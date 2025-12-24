import { ChefHat, Facebook, Instagram, Twitter, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";


const Footer = () => {
  return (
   <footer className="relative bg-[#022d1c] text-white overflow-hidden">

      {/* Premium gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/40 via-emerald-800/30 to-lime-700/40 pointer-events-none" />

      {/* Texture */}
      <div className="absolute inset-0 bg-[url('/texture-light.png')] opacity-10 mix-blend-overlay" />

      <div className="relative container mx-auto px-4 md:px-6 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img
                src={logo}
                alt="EasyPans"
                className="h-12 md:h-14 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <p className="text-white/75 mb-6 leading-relaxed max-w-md">
              Cook fresh, eat better, feel happier. Every EasyPans box is crafted
              to help you enjoy real cooking — balanced, flavorful, and made with care.
            </p>

            {/* Social */}
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-3 rounded-full bg-white/5 
                  hover:bg-white/10 
                  hover:ring-2 hover:ring-white
                  transition-all duration-300"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-5 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-4 text-white/75">
              <li>
                <Link to="/recipes" className="hover:text-white transition">
                  All Recipes
                </Link>
              </li>
              <li>
                <a href="/#products" className="hover:text-white transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-white transition">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-5 uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-5 text-white/75">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/80" />
                <span>easypans.marketing@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white/80" />
                <span>+91 8967028287</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="relative mt-14 pt-6 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-white/30" />
          <p className="text-white/60 text-sm tracking-wide">
            © 2025 EasyPans. All rights reserved.
          </p>
        </div>

      </div>
    </footer>

  );
};

export default Footer;
