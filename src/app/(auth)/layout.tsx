"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const slides = [
  {
    image: "/Tese-people-joining-hands.png",
    text: "TESE: Empowering Brands, Elevating Reach.",
  },
  {
    image: "/Tese-data-driven-advertising-at-scale.png",
    text: "Data-Driven Advertising at Scale.",
  },
  {
    image: "/Tese-sports.jpeg",
    text: "Your Vision, Our Global Network.",
  },
];

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const pathname = usePathname();
  const isRegisterPage = pathname?.startsWith("/register");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] dark:bg-[#1A1A1A] p-4 sm:p-6 relative overflow-hidden transition-colors duration-500">
      {/* --- DECORATIVE BACKGROUND ELEMENTS --- */}
      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[#F9A825] blur-[120px] opacity-10 dark:opacity-20 pointer-events-none" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#2E7D32] blur-[120px] opacity-10 dark:opacity-20 pointer-events-none" />
      {/* -------------------------------------- */}

      {/* Main Container Card */}
      <div
        className={`z-10 ${isRegisterPage ? "flex flex-col" : "flex flex-col lg:flex-row"} w-full ${isRegisterPage ? "max-w-3xl" : "max-w-6xl"} bg-white dark:bg-[#1A1A1A] rounded-[24px] overflow-hidden shadow-2xl ${isRegisterPage ? "h-auto" : "min-h-[700px]"} border border-black/5 dark:border-white/5`}
      >
        {/* Left Side: Sliding Hero Section - Hidden on register pages */}
        {!isRegisterPage && (
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1A1A1A]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={slide.image}
                  alt="TESE Software"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/20 to-transparent" />

                {/* Hero Content */}
                <div className="absolute inset-x-0 bottom-24 px-16 text-center">
                  <h2 className="text-[#F5F5F5] text-3xl font-semibold leading-tight drop-shadow-lg">
                    {slide.text}
                  </h2>

                  {/* Pagination (Gold Standard) */}
                  <div className="flex justify-center gap-3 mt-10">
                    {slides.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          i === currentSlide
                            ? "w-10 bg-[#F9A825]"
                            : "w-5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Logo (Original Colors) */}
            <div className="absolute top-10 left-10 flex items-center gap-3">
              <img
                src="/Tese-Light-Logo.png"
                alt="Tese Light Logo"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
        )}

        {/* Right Side: Form Area */}
        <div
          className={`w-full ${isRegisterPage ? "p-6" : "lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-16"} bg-white dark:bg-[#1A1A1A]`}
        >
          <div
            className={`w-full ${isRegisterPage ? "max-w-full" : "max-w-md"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
