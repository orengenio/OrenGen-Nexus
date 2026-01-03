import { GoogleGenAI, Modality, Type, LiveServerMessage } from "@google/genai";

// Singleton instance management
let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

// Check for Veo key
export const checkVeoKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
     return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback if not in that specific environment, or assume env key is enough for standard use
};

export const promptVeoKeySelection = async (): Promise<void> => {
   if (window.aistudio && window.aistudio.openSelectKey) {
     await window.aistudio.openSelectKey();
     // Reset instance to pick up new key
     aiInstance = null;
   }
};

export const generateText = async (prompt: string, model: string = 'gemini-3-pro-preview', systemInstruction?: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: model.includes('pro') ? { thinkingBudget: 1024 } : undefined // Modest budget for demo
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Text Generation Error:", error);
    throw error;
  }
};

export const generateJSON = async (prompt: string, schema?: any, model: string = 'gemini-3-flash-preview') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    // Safely parse JSON
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini JSON Generation Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K') => {
  // Check key for Pro Image model usage if strictly enforced, 
  // but standard env key usually works for preview models unless specific billing required.
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: '16:9'
        }
      }
    });
    
    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

export const generateVideo = async (prompt: string) => {
  // Force key selection for Veo
  const hasKey = await checkVeoKey();
  if (!hasKey) {
    await promptVeoKeySelection();
  }
  
  // Re-instantiate with potentially new key context if needed.
  // In the aistudio environment, the key is injected into process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
        // Append API Key for download
        const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }
    return null;

  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw error;
  }
};

// Live API Connection Helper
export const connectLiveSession = async (
  onAudioData: (base64: string) => void,
  onClose: () => void
) => {
  const ai = getAI();
  const session = await ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks: {
      onopen: () => console.log('Live Session Opened'),
      onmessage: (msg: LiveServerMessage) => {
         const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
         if (audioData) {
            onAudioData(audioData);
         }
      },
      onclose: () => onClose(),
      onerror: (err) => console.error('Live Session Error:', err)
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      },
      systemInstruction: "You are Oren, the AI core of the Nexus system. You are helpful, precise, and authoritative."
    }
  });
  return session;
};

// Audio Utilities
export const decodeAudioData = async (
  base64: string, 
  ctx: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const numChannels = 1;
  const sampleRate = 24000;
  const frameCount = dataInt16.length;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  const channelData = buffer.getChannelData(0);
  
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
};

export const createPcmBlob = (data: Float32Array): { data: string, mimeType: string } => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return {
      data: btoa(binary),
      mimeType: 'audio/pcm;rate=16000'
    };
};