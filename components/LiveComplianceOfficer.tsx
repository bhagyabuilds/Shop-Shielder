
import React, { useState, useEffect, useRef } from 'react';
import { ai } from '../services/geminiService.ts';
import { Modality } from '@google/genai';

const LiveComplianceOfficer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState('Standby');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  // Manual base64 decoding implementation as per guidelines
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  // Raw PCM audio decoding logic as per guidelines
  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  // Manual base64 encoding implementation as per guidelines
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const createBlob = (data: Float32Array) => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        // Updated to the correct recommended model for native audio conversation
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setStatus('Active');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // CRITICAL: initiate sendRealtimeInput after sessionPromise resolves
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: any) => {
            // Extracting audio data from modelTurn parts
            const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              // Use nextStartTime to track the exact end of the playback queue for gapless playback
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => {
            setIsConnected(false);
            setStatus('Disconnected');
          },
          onerror: (err) => {
            console.error('Live API Error:', err);
            setStatus('Error');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
          },
          systemInstruction: 'You are a world-class senior e-commerce compliance officer at Shop Shielder. You help merchants understand FDA, FTC, CCPA, and ADA regulations. Be professional, concise, and helpful. Speak naturally.'
        }
      });

      const session = await sessionPromise;
      sessionRef.current = session;
    } catch (err) {
      console.error('Failed to start Live session:', err);
      setStatus('Failed');
    }
  };

  const toggleSession = () => {
    if (isConnected) {
      sessionRef.current?.close();
      setIsConnected(false);
    } else {
      startSession();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-8 lg:bottom-8 lg:right-8 w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-600 transition-all z-50 group border border-white/10"
      >
        <span className="text-2xl group-hover:scale-110 transition-transform">🎧</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-pulse border-2 border-white"></span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 lg:inset-auto lg:bottom-8 lg:right-8 lg:w-96 lg:h-[32rem] bg-slate-900 text-white lg:rounded-[2.5rem] shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-inner">👮</div>
          <div>
            <h3 className="font-black text-sm uppercase tracking-widest italic">Compliance Officer</h3>
            <div className="flex items-center space-x-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
              <span className="text-[10px] font-black uppercase text-slate-400">{status}</span>
            </div>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"/></svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-8">
        <div className="relative">
          <div className={`w-32 h-32 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${isSpeaking ? 'border-emerald-500 scale-110' : 'border-slate-700'}`}>
            <div className={`w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl shadow-inner ${isSpeaking ? 'animate-pulse bg-emerald-500/10' : ''}`}>
              {isConnected ? '🎙️' : '💤'}
            </div>
          </div>
          {isSpeaking && (
            <div className="absolute inset-x-0 -bottom-4 flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-1 bg-emerald-500 rounded-full animate-bounce`} style={{ height: `${Math.random() * 20 + 5}px`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 max-w-xs">
          <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest italic">
            {isConnected 
              ? "Ask me anything about FDA claims, FTC disclosure requirements, or ADA standards. I'm listening." 
              : "Connect for a real-time compliance strategy session with our senior officer."}
          </p>
        </div>

        <button 
          onClick={toggleSession}
          className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${isConnected ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-emerald-600 text-white shadow-xl hover:bg-emerald-700'}`}
        >
          {isConnected ? 'Disconnect Session' : 'Initiate Secure Audio Link'}
        </button>
      </div>

      <div className="p-4 bg-black/20 text-center">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">
          SECURE CHANNEL • ENCRYPTED VIA SHOP SHIELDER VAULT
        </p>
      </div>
    </div>
  );
};

export default LiveComplianceOfficer;
