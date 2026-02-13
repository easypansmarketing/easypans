import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const Products = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Our New Product is Coming Soon!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            We're working hard to bring you something amazing. Stay tuned!
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="font-semibold">
              <Mail className="mr-2 h-5 w-5" />
              Notify Me
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;