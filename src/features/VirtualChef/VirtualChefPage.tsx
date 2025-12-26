import { useState, useRef, useEffect } from "react";
import { Mic, Video, VideoOff, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { analyzeCookingState } from "./virtualChefService"; // Ensure this import is correct

// Types for Speech API (prevents "property does not exist" errors)
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const VirtualChefPage = () => {
  // --- STATES ---
  const [mode, setMode] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [chefMessage, setChefMessage] = useState("I'm ready! Start cooking.");
  const [isCamOn, setIsCamOn] = useState(true);
  
  // Memory States
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const recognitionRef = useRef<any>(null);

  // 1. Load User ID (Prevents "undefined" errors)
  useEffect(() => {
    try {
        const stored = localStorage.getItem('userInfo');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Handle both _id (MongoDB) and id (standard) cases
            setUserId(parsed._id || parsed.id); 
        }
    } catch (e) {
        console.warn("User info could not be loaded", e);
    }
  }, []);

  // 2. Camera Setup
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCamOn) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(s => { 
            stream = s;
            if (videoRef.current) videoRef.current.srcObject = s; 
        })
        .catch(err => console.error("Camera denied:", err));
    }
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [isCamOn]);

  // 3. Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => setMode("listening");
      recognition.onresult = (event: any) => handleInteraction(event.results[0][0].transcript);
      
      // Handle silence/errors gracefully
      recognition.onerror = (e: any) => {
        console.log("Speech error", e);
        setMode("idle");
      };
      
      recognitionRef.current = recognition;
    }
  }, [userId, sessionId]); // Re-bind if IDs change

  const toggleMic = () => {
    if (mode === "listening") {
        recognitionRef.current?.stop();
        setMode("idle");
    } else {
        recognitionRef.current?.start();
    }
  };

  const handleInteraction = async (userSpeech: string) => {
    setMode("thinking");
    
    // Capture Image
    let imageSrc = "";
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx?.drawImage(videoRef.current, 0, 0);
        imageSrc = canvasRef.current.toDataURL('image/jpeg', 0.5);
      }
    }

    try {
      // Calls the UPDATED service with 5 arguments
      const data = await analyzeCookingState(imageSrc, userSpeech, "professional", userId, sessionId);
      
      if (data.sessionId) setSessionId(data.sessionId);
      
      setChefMessage(data.message);
      speakResponse(data.message);
    } catch (err) {
      setChefMessage("I couldn't connect. Check your internet.");
      setMode("idle");
    }
  };

  const speakResponse = (text: string) => {
    setMode("speaking");
    // Cancel previous speech to avoid overlap
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setMode("idle");
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-screen w-full bg-black relative flex flex-col items-center justify-center overflow-hidden">
      
      {/* BACKGROUND CAMERA LAYER */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isCamOn ? 'opacity-50' : 'opacity-0'}`}>
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* CENTRAL "GEMINI LIVE" ORB */}
      <div className="z-10 relative cursor-pointer group flex flex-col items-center justify-center h-full pb-24" onClick={toggleMic}>
        <div className={`w-32 h-32 rounded-full blur-3xl absolute transition-all duration-500
          ${mode === 'listening' ? 'bg-blue-500 scale-150 animate-pulse' : 
            mode === 'thinking' ? 'bg-purple-500 scale-125 animate-spin-slow' : 
            mode === 'speaking' ? 'bg-green-500 scale-150' : 'bg-white/20 scale-100'} 
        `} />
        
        <div className="w-24 h-24 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl flex items-center justify-center relative shadow-2xl transition-transform group-hover:scale-105">
           {mode === 'thinking' ? <Sparkles className="animate-spin text-purple-300 w-8 h-8" /> : 
            mode === 'listening' ? <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div> :
            <Mic className="w-8 h-8 text-white" />}
        </div>
        
        <p className="mt-8 text-white/70 font-medium tracking-wide text-sm uppercase">
            {mode === 'idle' ? "Tap to Speak" : mode}
        </p>
      </div>

      {/* TEXT CAPTIONS (Top Center) */}
      <div className="absolute top-20 left-0 right-0 z-10 px-6 text-center flex justify-center">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl px-6 py-4 max-w-md border border-white/10">
            <p className="text-lg font-medium text-white/90 font-poppins">
            "{chefMessage}"
            </p>
        </div>
      </div>

      {/* CONTROLS (Bottom) */}
      <div className="absolute bottom-10 flex gap-6 z-20">
        <Button variant="outline" size="icon" onClick={() => setIsCamOn(!isCamOn)} className="w-14 h-14 rounded-full bg-white/10 backdrop-blur border-none hover:bg-white/20 text-white">
          {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6 text-gray-400" />}
        </Button>
        <Link to="/">
          <Button variant="destructive" size="icon" className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600">
            <X className="w-6 h-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VirtualChefPage;