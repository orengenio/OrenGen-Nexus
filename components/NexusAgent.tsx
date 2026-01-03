import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Image as ImageIcon, Video, Bot, Loader2, StopCircle } from 'lucide-react';
import { generateText, generateImage, generateVideo, connectLiveSession, createPcmBlob, decodeAudioData } from '../services/geminiService';
import { ChatMessage } from '../types';

export const NexusAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', content: "I am Oren, your system copilot. How can I assist with your operations today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'chat' | 'live'>('chat');
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Audio Context Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const activeSessionRef = useRef<any>(null); // Live session

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Determine intent based on keywords (simple router)
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('generate image') || lowerInput.includes('create image')) {
         const imageUrl = await generateImage(input);
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            content: 'Here is the generated image:',
            type: 'image',
            mediaUrl: imageUrl || undefined,
            timestamp: new Date()
         }]);
      } else if (lowerInput.includes('generate video') || lowerInput.includes('create video')) {
         const videoUrl = await generateVideo(input);
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            content: 'Here is your generated video:',
            type: 'video',
            mediaUrl: videoUrl || undefined,
            timestamp: new Date()
         }]);
      } else {
         const response = await generateText(input);
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            content: response || "I couldn't process that request.",
            timestamp: new Date()
         }]);
      }

    } catch (error) {
       setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            content: "Error processing request. Check console for details.",
            timestamp: new Date()
         }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLiveMode = async () => {
    if (isRecording) {
      // Stop Recording
      setIsRecording(false);
      processorRef.current?.disconnect();
      sourceRef.current?.disconnect();
      activeSessionRef.current?.close();
      setMode('chat');
      return;
    }

    // Start Recording
    try {
      setMode('live');
      setIsRecording(true);
      
      // Setup Audio Context for playing back response
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      let nextStartTime = 0;

      // Connect Live API
      const session = await connectLiveSession(
        async (base64Audio) => {
             try {
                // Playback Logic
                const audioBuffer = await decodeAudioData(base64Audio, outputCtx);
                
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputCtx.destination);
                
                // Ensure continuous playback without gaps
                const currentTime = outputCtx.currentTime;
                if (nextStartTime < currentTime) {
                    nextStartTime = currentTime;
                }
                
                source.start(nextStartTime);
                nextStartTime += audioBuffer.duration;
             } catch (e) {
                 console.error("Audio playback error:", e);
             }
        },
        () => {
           console.log("Session closed");
           setIsRecording(false);
           setMode('chat');
        }
      );
      
      activeSessionRef.current = session;

      // Start Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmBlob = createPcmBlob(inputData);
        session.sendRealtimeInput({ media: pcmBlob });
      };

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

    } catch (err) {
      console.error("Failed to start live mode", err);
      setIsRecording(false);
      setMode('chat');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900/50 backdrop-blur-md border-l border-zinc-800">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Bot className="w-5 h-5 text-orange-500" />
          Agent Nexus
        </h3>
        <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${mode === 'live' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
            <span className="text-xs text-zinc-500 uppercase">{mode}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-orange-600 text-white rounded-br-none' 
                : 'bg-zinc-800 text-zinc-200 rounded-bl-none'
            }`}>
              {msg.content}
              {msg.type === 'image' && msg.mediaUrl && (
                  <img src={msg.mediaUrl} alt="Generated" className="mt-2 rounded-md border border-zinc-700 w-full" />
              )}
              {msg.type === 'video' && msg.mediaUrl && (
                  <video src={msg.mediaUrl} controls className="mt-2 rounded-md border border-zinc-700 w-full" />
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-zinc-800 p-3 rounded-lg rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Command Nexus..."
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            disabled={mode === 'live'}
          />
          <button 
            onClick={toggleLiveMode}
            className={`p-2 rounded-md transition-colors ${isRecording ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}
          >
            {isRecording ? <StopCircle className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleSend}
            disabled={isLoading || mode === 'live'}
            className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-md disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};