import React, { useState } from 'react';
import { PenTool, Share2, Copy, RefreshCw, Send, Check } from 'lucide-react';
import { generateText } from '../services/geminiService';

export const MarketingStudio: React.FC = () => {
  const [contentType, setContentType] = useState<'Blog' | 'Social' | 'Ad' | 'Email'>('Blog');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setCopied(false);
    
    const prompt = `Write a ${contentType} post about "${topic}". Tone: ${tone || 'Professional'}. Format cleanly with Markdown.`;
    
    try {
      const result = await generateText(prompt, 'gemini-3-pro-preview');
      setGeneratedContent(result || 'Failed to generate.');
    } catch (e) {
        setGeneratedContent('Error generating content.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full w-full p-6 animate-in fade-in duration-500 flex gap-6">
      {/* Config Panel */}
      <div className="w-1/3 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <PenTool className="text-purple-500" /> Marketing Studio
          </h2>
          <p className="text-zinc-400 text-sm">Generate high-converting copy for brand and press.</p>
        </div>

        <div className="space-y-4 bg-zinc-900/40 p-6 rounded-xl border border-zinc-800">
           <div>
             <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase">Content Type</label>
             <div className="grid grid-cols-2 gap-2">
                {['Blog', 'Social', 'Ad', 'Email'].map(t => (
                  <button 
                    key={t}
                    onClick={() => setContentType(t as any)}
                    className={`px-3 py-2 rounded-lg text-sm transition-all ${contentType === t ? 'bg-purple-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}`}
                  >
                    {t}
                  </button>
                ))}
             </div>
           </div>

           <div>
             <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase">Topic / Context</label>
             <textarea 
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
               placeholder="e.g. Launching our new API v2 with 50% lower latency..."
               className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500 h-32 resize-none"
             />
           </div>

           <div>
             <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase">Tone</label>
             <input 
               type="text"
               value={tone}
               onChange={(e) => setTone(e.target.value)}
               placeholder="e.g. Exciting, Professional, Witty"
               className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500"
             />
           </div>

           <button 
             onClick={handleGenerate}
             disabled={isGenerating || !topic}
             className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-3 rounded-lg font-medium transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
             Generate Copy
           </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex-1 glass-panel rounded-xl p-6 flex flex-col relative">
         <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-800">
            <h3 className="font-semibold text-zinc-200">Generated Output</h3>
            {generatedContent && (
                <button 
                  onClick={handleCopy}
                  className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
            )}
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar">
            {generatedContent ? (
              <div className="prose prose-invert max-w-none">
                 <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">
                   {generatedContent}
                 </pre>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                 <Share2 className="w-12 h-12 mb-4 opacity-20" />
                 <p>Content will appear here...</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

// Icon Helper
import { Sparkles } from 'lucide-react';