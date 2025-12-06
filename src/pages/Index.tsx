import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeCard from "@/components/RecipeCard";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import productBox from "@/assets/product-box_1.webp";
import chefAbout from "@/assets/chef-about.webp";
import { recipes } from "@/data/recipes";
import heroBG from "@/assets/Hero_BG.webp";
import heroBG_M from "@/assets/Hero_BG_M.webp";
import Recipe_BG from "@/assets/Recipe_BG.webp";
import Recipe_BG_M from "@/assets/Recipe_BG_M.webp";
import roll from "@/assets/Roll_Title.webp";

import { motion } from "framer-motion";
import IngradientBG from "../assets/ingradient-bg2.webp";



const Index = () => {
  const featuredRecipes = recipes.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
        <section className="relative overflow-hidden text-white">
          {/* Moving Image Banner */}
          <div className="relative w-full overflow-hidden border-b border-gray-200 bg-white">
            <div
              className="scroll-banner"
              style={{
                backgroundImage: `url(${roll})`
              }}
            ></div>
          </div>

          {/* --- THIS IS YOUR ORIGINAL LAPTOP HERO VERSION --- */}
          <div className="hidden md:block">

            {/* Your original hero code is here, starting with... */}
            <div className="relative w-full flex justify-start items-center overflow-hidden">
              <img
                src={heroBG}
                alt="Hero Background"
                className="w-full h-auto object-contain"
              />
              <div className="absolute" style={{ top: "67%", left: "8.2%" }}>
                <Button
                  className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-6 text-base md:text-lg rounded-lg shadow-lg"
                  asChild
                >
                  <Link to="/recipes">View Recipe</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* --- ADD THIS NEW MOBILE HERO VERSION --- */}
          <div className="md:hidden">
            <div className="relative w-full flex justify-start items-center overflow-hidden">
              <img
                src={heroBG_M}
                alt="Hero Background"
                className="w-full h-auto object-contain"
              />
              <div className="absolute top-[30%] left-1/2 -translate-x-1/2">
                <Button
                  className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-6 text-base md:text-lg rounded-lg shadow-lg"
                  asChild
                >
                  <Link to="/recipes">View Recipe</Link>
                </Button>
              </div>
            </div>
          </div>

        </section>

      {/* Products Section */}
      {/* <section id="products" className="py-8 md:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-8">
            Say goodbye to kitchen stress
          </h2>          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                With pre-measured ingredients and easy instructions, you'll spend less time
                preparing and more time enjoying your meal. No planning. No waste. Just pure
                joy in every bite.
              </p>
              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-sm md:text-base">Pre-measured portions for perfect results every time</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-sm md:text-base">Step-by-step instructions anyone can follow</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-sm md:text-base">Zero food waste with exact quantities</p>
                </div>
              </div>              
            </div>
            <div className="order-1 md:order-2">
              <img
                src={productBox}
                alt="EasyPans Product Box"
                className="rounded-lg shadow-[var(--card-shadow)] h-80 w-4/5 mx-auto"
              />
            </div>
          </div>
        </div>
      </section> */}

      {/* Products Section */}
        <section
            id="products"
            className="py-16 relative overflow-hidden bg-white"
            >
          {/* Ingredients Background */}
          <div
              className="absolute inset-0 opacity-30 bg-cover bg-center"
              style={{ backgroundImage: `url(${IngradientBG})` }}
            ></div>

          {/* Soft Green Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#e9f5f1] to-white opacity-80"></div>

          <div className="container mx-auto px-4 md:px-6 relative z-10">

            {/* Top Title Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-5xl font-extrabold text-center leading-tight mb-6"
              >
                Make Cooking <span className="text-[#025e3f]">Effortless</span>
              </motion.h2>

              <div className="flex justify-center">
                <div className="w-24 h-1 bg-[#025e3f] rounded-full"></div>
              </div>

              <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                Fresh ingredients, chef-crafted recipes, and perfectly measured portions —
                delivered to make your cooking stress-free.
              </p>
            </motion.div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

              {/* Left: Image Block */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
              >
                <div className="relative ">

                  {/* Premium Glow Behind Image */}
                  <div className="absolute -inset-6 bg-[#025e3f]/10 blur-3xl rounded-full "></div>

                  <motion.img
                    src={productBox}
                    alt="EasyPans Kit"
                    className="rounded-xl shadow-lg h-80 w-full object-cover "
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 180 }}
                  />
                </div>
              </motion.div>

              {/* Right: Features Text */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  Why you’ll love our meal kits
                </h3>

                <div className="space-y-6">
                  {[
                    "Perfectly measured ingredients that make cooking easier",
                    "Chef-designed recipes anyone can follow",
                    "Fresh produce & high-quality items in every box",
                    "Save time — no planning, no grocery runs",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.12 }}
                      className="flex items-start gap-3"
                    >
                      <div className="p-2 bg-[#025e3f]/10 rounded-full">
                        <CheckCircle2 className="h-6 w-6 text-[#025e3f]" />
                      </div>
                      <p className="text-gray-700 text-lg">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
      </section>





      {/* About Section with Image */}
      {/* <section id="about" className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <img
                src={chefAbout}
                alt="Our Chef"
                className="rounded-lg shadow-[var(--card-shadow)] w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">EAT WELL, FEEL GREAT</h2>
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                At EasyPans, we believe that cooking should be a joy, not a chore. That's why
                we've created meal kits that make home cooking accessible, enjoyable, and
                delicious for everyone.
              </p>
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                Our team of experienced chefs carefully curates each recipe, ensuring a
                perfect balance of nutrition and flavor. We source the freshest ingredients
                from trusted suppliers, delivering them straight to your doorstep.
              </p>
              <p className="text-base md:text-lg text-muted-foreground">
                Join thousands of happy families who have transformed their dinner routines
                with EasyPans. Cook fresh, eat better, and feel happier every day.
              </p>
            </div>
          </div>
        </div>
      </section> */}



        <section id="about" className="relative py-20 md:py-28 overflow-hidden bg-secondary">

            {/* Background Texture */}
            <div
                className="absolute inset-0 opacity-30 bg-cover bg-center"
                style={{ backgroundImage: `url(${IngradientBG})` }}
              ></div>

            {/* Soft Premium Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-[#e9f5f1]/70 to-white/70"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

                {/* IMAGE SIDE */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Glow Effect Behind Image */}
                  <div className="absolute -inset-6 bg-[#025e3f]/20 blur-3xl rounded-full"></div>

                  <motion.img
                    src={chefAbout}
                    alt="Our Chef"
                    className="rounded-xl shadow-lg w-full relative z-10"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 180 }}
                  />
                </motion.div>

                {/* TEXT SIDE */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                >
                  <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight"
                  >
                    Eat Well, <span className="text-[#025e3f]">Feel Great</span>
                  </motion.h2>

                  <div className="w-20 h-1 bg-[#025e3f] rounded-full mb-6"></div>

                  <motion.p 
                   initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.12 }}
                  className="text-lg text-gray-600 mb-6">
                    At EasyPans, we believe that cooking should be a joy, not a chore.
                    Our mission is to make home cooking simple, enjoyable, and delicious
                    for everyone — from beginners to seasoned home chefs.
                  </motion.p>

                  <motion.p
                     initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.12 }}
                    className="text-lg text-gray-600 mb-6"
                  >
                    Our expert chefs design every recipe with a perfect blend of nutrition,
                    taste, and ease. We use the freshest produce sourced directly from
                    trusted farms and suppliers.
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.12 }}
                    className="text-lg text-gray-600"
                  >
                    Join thousands of happy families who’ve transformed their cooking routine
                    with EasyPans. Cook fresh, eat better, and feel amazing every day.
                  </motion.p>
                </motion.div>

              </div>
            </div>
          </section>


      {/* Recipe Section */}
        <section className="relative overflow-hidden text-white">

          {/* --- THIS IS YOUR ORIGINAL LAPTOP HERO VERSION --- */}
          {/* Add this wrapping div below */}
          <div className="hidden md:block">

            {/* Your original hero code is here, starting with... */}
            <div className="relative w-full flex justify-start items-center overflow-hidden">
              <img
                src={Recipe_BG}
                alt="Hero Background"
                className="w-full h-auto object-contain"
              />
              <div className="absolute" style={{ top: "70%", left: "42.5%" }}>
                <Button
                  className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-6 text-base md:text-lg rounded-lg shadow-lg"
                  asChild
                >
                  <Link to="/recipes">View Recipe</Link>
                </Button>
              </div>
            </div>
          </div> {/* <-- Add the closing div here */}

          {/* --- ADD THIS NEW MOBILE HERO VERSION --- */}
          <div className="md:hidden">
            <div className="relative w-full flex justify-start items-center overflow-hidden">
              <img
                src={Recipe_BG_M}
                alt="Hero Background"
                className="w-full h-auto object-contain"
              />
              <div className="absolute" style={{ top: "68%", left: "29.5%" }}>
                <Button
                  className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-6 text-base md:text-lg rounded-lg shadow-lg"
                  asChild
                >
                  <a href="#products">View Recipe</a>
                </Button>
              </div>
            </div>
          </div>


        </section>

      {/* Featured Recipes Section */}
      <section className="pt-16 md:pt-10 pb-0 md:pb-0">
        <div className="container mx-auto px-4 md:px-40">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Recipes</h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Discover delicious meals you can make with EasyPans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {featuredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                image={recipe.image}
                cookTime={recipe.cookTime}
                serves={recipe.serves}
                description={recipe.description}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" className="font-semibold" asChild>
              <Link to="/recipes">
                View All Recipes <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
