import { useState, useRef } from "react";
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2, FileText, Mic, ChefHat, Camera, Upload, X, Aperture, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png"; 
import aiBg from "@/assets/ai-bg.png"; 

// Using placeholder GIFs
const CHEF_WAITING_GIF = "https://media.tenor.com/yDqaeH8tL4AAAAAi/chef-cooking.gif"; 
const CHEF_COOKING_GIF = "https://media.tenor.com/yDqaeH8tL4AAAAAi/chef-cooking.gif"; 

import AISidebar from "./AISidebar"; 
import AIHeader from "./AIHeader"; 
import { generateRecipeRequest, identifyIngredientsRequest } from "./aiService"; 

// Dynamic Image Generation
const getFoodImage = (query: string) => 
  `https://image.pollinations.ai/prompt/delicious ${query} food professional photography 4k?width=800&height=600&nologo=true`;

const AIChefPage = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<any>(null);
  const [generatedImage, setGeneratedImage] = useState<string>("");
  
  // Process States
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  
  // Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combined Loading State
  const isLoading = isGeneratingText || isImageLoading;

  // --- LOGIC: Process Image (From Camera or Upload) ---
  const processImageFile = async (file: File) => {
    setIsAnalyzingImage(true);
    try {
      const data = await identifyIngredientsRequest(file);
      const newIngredients = ingredients 
        ? `${ingredients}, ${data.ingredients}` 
        : data.ingredients;
      setIngredients(newIngredients);
    } catch (error) {
      console.error("Failed to identify ingredients", error);
      alert("Could not identify ingredients. Please try again.");
    } finally {
      setIsAnalyzingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
            stopCamera(); 
            processImageFile(file); 
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    
    setIsGeneratingText(true);
    setIsImageLoading(true);
    setRecipe(null);
    setGeneratedImage(""); 

    try {
      const data = await generateRecipeRequest(ingredients);
      setRecipe(data);
      
      const imageUrl = getFoodImage(data.name);
      setGeneratedImage(imageUrl);
      
      setIsGeneratingText(false);
    } catch (error: any) {
      console.error(error);
      alert("Chef is busy! Please try again.");
      setIsGeneratingText(false);
      setIsImageLoading(false);
    }
  };

  // Helper to convert user input string into an array for display
  const userIngredientsList = ingredients
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return (
    <div 
      className="min-h-screen text-white font-sans selection:bg-green-500/30 flex flex-col bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${aiBg})` }} 
    >
      {/* Hidden Preloader for Image Sync */}
      {generatedImage && (
        <img 
            src={generatedImage} 
            alt="preload" 
            className="hidden"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)} 
        />
      )}

      {/* --- CAMERA MODAL OVERLAY --- */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
          <div className="relative w-full h-full max-w-md bg-black flex flex-col">
            <div className="absolute top-4 left-0 right-0 z-10 flex justify-between items-center px-6">
               <span className="text-white font-bold drop-shadow-md">Take Photo</span>
               <Button variant="ghost" size="icon" onClick={stopCamera} className="text-white hover:bg-white/20 rounded-full"><X className="w-8 h-8" /></Button>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden bg-gray-900 relative">
               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
               <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="h-32 bg-black/80 backdrop-blur-md flex items-center justify-center pb-8">
               <button onClick={capturePhoto} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95 hover:bg-white/10">
                 <div className="w-16 h-16 bg-white rounded-full"></div>
               </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <AIHeader />

      <div className="flex flex-1">
        <AISidebar />

        <main className="flex-1 p-4 md:p-10 flex flex-col items-center relative overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide">
          
          {/* --- HERO TITLE --- */}
          <div className="text-center space-y-2 mb-8 relative z-10 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-bold text-white pb-2 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]">
              Meet Your New <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">AI Chef</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto drop-shadow-md whitespace-nowrap">
              Tell us what you have, and our culinary AI will craft a unique recipe instantly.
            </p>
          </div>

          {/* --- UNIFIED GREEN GLASS BOX --- */}
          <div className="w-full max-w-5xl relative z-20 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <div className="relative w-full rounded-3xl border border-[#4ade80]/30 bg-black/40 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(74,222,128,0.15)] overflow-hidden">
                
                <div className="flex flex-col md:flex-row h-full min-h-[350px]">
                    
                    {/* --- LEFT SIDE: INPUT (2/3 Width) --- */}
                    <div className="w-full md:w-2/3 p-8 flex flex-col justify-between relative">
                         <div className="space-y-4 h-full flex flex-col">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                                    What's in your fridge?
                                </h2>
                                <p className="text-gray-400 text-sm">We'll find the perfect recipe for you.</p>
                            </div>

                            <div className="relative flex-grow group">
                                <textarea
                                    className="w-full h-full min-h-[160px] bg-black/20 border border-white/10 rounded-xl p-4 text-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 transition-all resize-none pr-12"
                                    placeholder={isAnalyzingImage ? "Analyzing image..." : "Enter ingredients (e.g., Chicken, spinach...) or click the camera to upload."}
                                    value={ingredients}
                                    onChange={(e) => setIngredients(e.target.value)}
                                    disabled={isAnalyzingImage}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleGenerate();
                                        }
                                    }}
                                />
                                
                                {/* --- CAMERA / UPLOAD DROPDOWN --- */}
                                <div className="absolute bottom-3 right-3">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button 
                                          size="icon" 
                                          variant="ghost" 
                                          disabled={isAnalyzingImage}
                                          className="text-gray-400 hover:text-green-400 hover:bg-white/5 transition-colors focus:outline-none"
                                          title="Add Photo"
                                        >
                                          {isAnalyzingImage ? (
                                              <Loader2 className="w-6 h-6 animate-spin text-green-400" />
                                          ) : (
                                              <Camera className="w-6 h-6" />
                                          )}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48 bg-[#0f172a] border-white/10 text-white">
                                        <DropdownMenuItem onClick={startCamera} className="cursor-pointer hover:bg-white/10 focus:text-green-400">
                                          <Aperture className="mr-2 h-4 w-4" />
                                          <span>Take Photo</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer hover:bg-white/10 focus:text-green-400">
                                          <Upload className="mr-2 h-4 w-4" />
                                          <span>Upload Image</span>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>

                            <Button 
                                onClick={handleGenerate}
                                disabled={isLoading || isAnalyzingImage || !ingredients.trim()}
                                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#4ade80] to-[#22c55e] hover:from-[#22c55e] hover:to-[#16a34a] text-black shadow-[0_0_20px_rgba(74,222,128,0.4)] transition-all duration-300 rounded-xl border-0"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <ChefHat className="animate-bounce" /> Cooking...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <ChefHat className="w-6 h-6" /> Generate Recipe with AI
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* --- RIGHT SIDE: ANIMATED CHEF (1/3 Width) --- */}
                    <div className="w-full md:w-1/3 relative bg-white/5 border-t md:border-t-0 md:border-l border-white/10 flex items-center justify-center p-6">
                        {/* STATES (Idle, Loading, Success) */}
                        {!isLoading && !recipe && (
                            <div className="text-center animate-in zoom-in duration-500">
                                 <div className="w-40 h-40 mx-auto mb-4 rounded-full border-4 border-[#4ade80]/20 overflow-hidden shadow-[0_0_30px_rgba(74,222,128,0.1)] relative bg-black/20">
                                    <img src={CHEF_WAITING_GIF} alt="Ready" className="w-full h-full object-cover opacity-90" />
                                 </div>
                                 <p className="text-green-100/80 font-medium">Ready to take order!</p>
                            </div>
                        )}
                        {isLoading && (
                            <div className="text-center flex flex-col items-center justify-center h-full w-full">
                                <div className="w-40 h-40 mx-auto mb-4 relative">
                                    <img src={CHEF_COOKING_GIF} alt="Cooking" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(74,222,128,0.4)]" />
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="h-2 w-24 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#4ade80] animate-progress origin-left w-full"></div>
                                    </div>
                                    <p className="text-[#4ade80] font-bold animate-pulse tracking-wide text-sm">CHEF IS COOKING...</p>
                                </div>
                            </div>
                        )}
                        {!isLoading && recipe && generatedImage && (
                            <div className="absolute inset-0 w-full h-full group cursor-pointer">
                               <img 
                                  src={generatedImage} 
                                  alt="Result" 
                                  className="w-full h-full object-cover animate-in fade-in duration-1000"
                               />
                               <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-20">
                                  <p className="text-white font-bold text-lg leading-tight drop-shadow-md text-center">{recipe.name}</p>
                               </div>
                            </div>
                        )}
                    </div>
                </div>
             </div>
          </div>

          {/* --- RESULTS DETAILS (Updated Layout) --- */}
          {recipe && !isLoading && (
            <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
              
              <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-6 shadow-2xl relative overflow-hidden">
                
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] pointer-events-none -mr-32 -mt-32"></div>
                
                {/* Recipe Title & Description */}
                <div className="relative z-10 text-center mb-10">
                   <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-wider border-b border-white/10 pb-4 inline-block">
                     {recipe.name}
                   </h2>
                   <p className="text-gray-300 text-lg italic max-w-3xl mx-auto">"{recipe.description}"</p>
                </div>

                {/* ROW 1: INGREDIENTS (Side by Side) */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  
                  {/* Your Ingredients (Filled with user input) */}
                  <div className="bg-[#0f1c15]/60 border border-green-500/30 rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-4 text-green-300 border-b border-green-500/20 pb-2">
                      <CheckCircle2 className="w-6 h-6" /> <h3 className="text-xl font-bold">Your Ingredients</h3>
                    </div>
                    <ul className="space-y-2 text-green-100/80">
                      {userIngredientsList.length > 0 ? (
                        userIngredientsList.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"/> {item}
                          </li>
                        ))
                      ) : (
                        <li className="flex items-center gap-2 italic opacity-70">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500"/> Ingredients from input
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Missing Ingredients */}
                  <div className="bg-[#1c0f0f]/60 border border-red-500/30 rounded-2xl p-6 h-full">
                    <div className="flex items-center gap-3 mb-4 text-red-200 border-b border-red-500/20 pb-2">
                      <AlertCircle className="w-6 h-6" /> <h3 className="text-xl font-bold">Missing Items</h3>
                    </div>
                    <ul className="space-y-2 text-red-100/80">
                      {recipe.missingIngredients?.length > 0 ? (
                          recipe.missingIngredients.map((item: string, idx: number) => (
                              <li key={idx} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/> {item}</li>
                          ))
                      ) : (<li className="italic opacity-50 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> You have everything!</li>)}
                    </ul>
                  </div>
                </div>

                {/* ROW 2: INSTRUCTIONS (Full Width) */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full">
                   <div className="flex items-center gap-3 mb-6 text-white pb-3 border-b border-white/10">
                      <FileText className="w-6 h-6 text-blue-400" /> <h3 className="text-2xl font-bold">Instructions</h3>
                   </div>
                   <div className="space-y-6 relative pl-4">
                      {/* Vertical line connecting steps */}
                      <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-white/10"></div>
                      
                      {recipe.steps.map((step: string, idx: number) => (
                          <div key={idx} className="flex gap-6 relative group">
                              <div className="flex-shrink-0 relative z-10">
                                  <div className="w-12 h-12 rounded-full bg-[#0a0f1c] border border-green-500/50 flex items-center justify-center text-green-400 font-bold text-lg shadow-lg group-hover:bg-green-500 group-hover:text-black transition-colors duration-300">
                                      {idx + 1}
                                  </div>
                              </div>
                              <p className="pt-2 text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors">
                                  {step}
                              </p>
                          </div>
                      ))}
                   </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AIChefPage;