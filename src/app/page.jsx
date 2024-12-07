"use client";

import Appbar from "./components/Appbar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import Footer from "./components/Footer";
import crypto from "./../../public/app/imagecrypto.jpeg";
import terminal from "./../../public/app/terminal.png";
import tradingviewlogo from "./../../public/app/logotradingview.png";
import binance from "./../../public/app/binance.png";

export default function Home() {
  const router = useRouter();
  const imageRef = useRef(null);
  const cryptoRef = useRef(null);
  const terminalRef = useRef(null);
  const [isCryptoInView, setIsCryptoInView] = useState(false);
  const [isTerminalInView, setIsTerminalInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.target === cryptoRef.current) {
          setIsCryptoInView(entry.isIntersecting); // Update state based on visibility
        } else if (entry.target === terminalRef.current) {
          setIsTerminalInView(entry.isIntersecting);
        }
      },
      { threshold: 0.4 } // Trigger when at least 40% of the element is visible
    );

    if (cryptoRef.current) observer.observe(cryptoRef.current);
    if (terminalRef.current) observer.observe(terminalRef.current);

    return () => {
      if (cryptoRef.current) observer.unobserve(cryptoRef.current);
      if (terminalRef.current) observer.unobserve(terminalRef.current);
    };
  }, []);
  // Scroll fade-in effect using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // Stop observing after animation
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll(".scroll-fade");
    elements.forEach((element) => {
      observer.observe(element);
    });

    // Cleanup observer on component unmount
    return () => {
      elements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <>
      <div className="min-h-screen w-full bg-black flex flex-col items-center">
        <Appbar />
        <div className="container mx-auto w-full max-w-screen-xl mt-16 flex flex-col items-center">
          <span className="scroll-fade mt-12 text-9xl text-white font-extrabold">
            Trade, Compete
          </span>
          <span className="scroll-fade text-9xl text-white mt-4 font-extrabold">
            & Win Big
          </span>
          <h1 className="text-base font-bold lg:text-3xl text-left mt-10 px-5 text-white opacity-100 scroll-fade">
            Your Crypto Journey Starts Now! 
          </h1>
          <h1 className="text-base font-bold lg:text-3xl text-left mt-0.5 px-5 text-white opacity-100 scroll-fade">
            Demo Trading platform to compete with traders like you
          </h1>
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => {
                router.push("/signup");
              }}
              className="bg-indigo-700 hover:bg-indigo-600 w-80 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg font-semibold text-white p-4 mt-5 relative mx-8 text-2xl"
            >
              Start Trading Now
            </button>
            <button className="w-80 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg font-semibold text-white p-4 mt-5 relative mx-8 text-2xl bg-transparent border-2 border-white hover:bg-slate-900 box-border">
              Explore Now
            </button>
          </div>
        </div>

        {/*description*/}
        <div className="w-full max-w-full text-center mt-40">
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center">
            {/* Crypto Image Section */}
            <div className="w-full lg:w-[40%]" ref={cryptoRef}>
              <Image
                src={crypto}
                alt="crypto-image"
                className={`w-[100%] max-w-full object-contain rounded-lg shadow-lg ${
                  isCryptoInView ? "grow" : ""
                }`}
              />
            </div>

            {/* Text Section */}
            <div className="w-full lg:w-[50%] text-center lg:text-left ml-8">
              <h1 className="text-white text-4xl lg:text-6xl font-extrabold leading-tight mb-4 scroll-fade">
                India&apos;s First Gamified Crypto Trading Platform
              </h1>
              <p className="text-white text-base lg:text-2xl leading-relaxed mb-8 px-4 lg:px-0 scroll-fade">
                Transforms the traditional trading experience into a competitive
                game, making the world of finance accessible and exciting for
                all participants.
              </p>
            </div>
          </div>

          {/* How to Start the Game */}
          <div className="flex flex-col items-center text-center mt-20 px-4">
            <h1 className="text-white text-3xl lg:text-6xl font-bold leading-tight mb-4">
              How to Start the Game
            </h1>
            <p className="text-white text-base lg:text-2xl leading-relaxed mb-8 px-4 lg:px-0 w-[60vw]">
              Ready to challenge other traders? Watch this video to learn how to
              start trading and get started now. Compete with other traders,
              using your knowledge and skill, and win big!
            </p>
            <div
              className={`w-[76vw] flex justify-center transition-transform ${
                isTerminalInView ? "grow" : ""
              }`}
              ref={terminalRef}
            >
              <Image src={terminal} alt="terminal" className="glow3"/>
            </div>
          </div>

          {/* Powered By Section */}
          <div className="flex justify-center mt-32">
          <div className="mt-12 px-4 w-[50vw]">
            <h1 className="text-white text-3xl mb-10 lg:text-6xl font-bold leading-tight">
              Powered By
            </h1>
            <div className="overflow-hidden relative">
              <div className="flex gap-x-10 animate-slide">
                <div className="h-[60px] w-[400px] flex items-center">
                  <Image src={tradingviewlogo} alt="logo" />
                </div>
                <div className="h-[60px] w-[400px] flex items-center">
                  <Image
                    src={binance}
                    alt="logo"
                    className="h-[68px] w-[350px]"
                  />
                </div>
              </div>
            </div>
          </div>
          </div>
         

          {/* Why Choose Us Section */}
          <div className="text-center mt-20 px-4">
            <h1 className="text-white text-3xl lg:text-6xl font-bold leading-tight mb-4">
              Why Choose Us?
            </h1>
            <p className="text-white text-center text-base lg:text-2xl leading-relaxed lg:w-[60vw] mx-auto mb-8 scroll-fade">
            Our platform adds a competitive edge to crypto trading. Challenge other traders, track your progress, and rise through the ranks. With a gamified approach, you can learn, earn rewards, and test your strategies in a community of passionate traders. Here, your skills determine success—win or lose, it’s all part of the game!
            </p>
          </div>
        </div>
        {/* FAQ's Section */}
        <h1 className="text-4xl font-normal text-center p-2 mt-8 text-white mb-4">
          FAQ&apos;s
        </h1>
        <div className="flex items-center justify-center bg-black">
          <div className="w-[60vw] space-y-6">
            {" "}
            <FaqBox text="How safe is Tradding Ventures" />
            <FaqBox text="How and where will I get the winning money" />
            <FaqBox text="What is the lowest amount to start" />
            <FaqBox text="When will I get my money" />
            <FaqBox text="How to Play" />
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
}

const FaqBox = ({ text }) => {
  const [click, setClick] = useState(false);

  const dropDownFun = () => {
    setClick(!click);
  };

  return (
    <div className="font-normal text-sm mb-6">
      <button
        className="w-full flex justify-between items-center px-6 py-4 border-2 border-gray-600 rounded-lg text-left bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        onClick={dropDownFun}
      >
        <span className="text-lg font-semibold text-white">{text}</span>
        <div
          className={`transition-transform duration-300 ${
            click ? "transform rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6 text-gray-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </button>
      {click && (
        <div className="text-gray-300 p-6 mt-2 border-2 border-t-0 border-gray-600 bg-gray-900 rounded-lg">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo,
          culpa assumenda. Voluptates harum laboriosam iste aperiam deleniti.
        </div>
      )}
    </div>
  );
};