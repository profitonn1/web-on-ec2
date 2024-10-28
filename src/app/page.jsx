"use client"

// import { useSession, getSession } from "next-auth/react";
import Appbar from "./components/Appbar"
import { useRouter } from "next/navigation"
import Image from "next/image"
// import VideoPlayer from "../components/VedioPlayer";
import React, { useState, useRef } from "react"
import Footer from "./components/Footer"
import stockImg from "./../../public/app/stock-chart.svg"

export default function Home() {
  const router = useRouter()
  const videoRef = useRef(null)
  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  //#CB9FD2
  return (
    <div className="fullPage bg-[#EDDFE0]">
      <Appbar />

      {/* headerPortion started */}

      <div className="headerPortion flex flex-col lg:flex lg:justify-center lg:items-center bg-[#EDDFE0] w-screen lg:w-screen pt-16 lg:p-16 mt-[28px] lg:mt-[60px] relative">
        <div className="text-4xl font-normal text-[#5D12D2] text-left relative z-30 lg:text-8xl w-[80vw]">
          <div className="container flex flex-col lg:items-center font-medium px-5">
            <span>Trade, Compete</span>
            <span>& Win Big</span>
          </div>
        </div>

        <h1 className="text-base font-bold lg:text-2xl text-left mt-3 px-5 text-[#000000] opacity-100">
          Exciting Stock Market Challenge!
        </h1>
        <h1 className="text-base font-bold lg:text-2xl text-left mt-0.5 px-5 text-[#000000] opacity-100">
          Demo Trading platform to compete with traders like you
        </h1>

        <div className="flex space-x-1 w-screen lg:justify-center">
          <button
            onClick={() => {
              router.push("/signup")
            }}
            className="hover:bg-blue-500 bg-blue-600 font-bold text-white w-36 p-2 mt-5 relative text-lg rounded-3xl mx-5"
          >
            Start
          </button>
          <button
            onClick={scrollToVideo}
            // onClick={()=>{router.push('/dashboard')}}
            className=" hover:bg-[#d7d8df] bg-[#F4F6FF] font-bold border-2 border-slate-800  text-slate-500 w-36 p-2 mt-5 relative text-lg rounded-3xl mx-5"
          >
            Explore
          </button>
        </div>
      </div>
      {/* headerPortion ended */}

      {/* description part starts */}
      <div className="flex flex-col items-center lg:grid lg:grid-cols-2 h-auto grid-cols-1 p-4 mt-1">
        <div className="flex justify-center p-2 w-[85%] h-[30vh]">
          <Image src={stockImg} alt="Stock_img" />
        </div>
        <div>
          <h1 className="font-medium text-center px-5 text-[#006BFF] text-3xl lg:text-left lg:text-7xl lg:font-normal lg:pl-0 ">
            India&apos;s first Gamified Version of Trading
          </h1>
          <p className="text-center text-sm lg:w-[44vw] lg:text-2xl text-black lg:text-left lg:pl-0 lg:text-l mt-2 w-[90vw]">
            Transforms the traditional trading experience into an competitive
            game, making the world of finance accessible and exciting for all
            participants.
          </p>
        </div>
      </div>
      {/* description part ends */}

      {/* game guide starts */}
      <div className="  grid grid-cols-1 lg:flex lg:flex-col lg:items-center lg:mt-24 mt-4 h-full">
        <h1 className="font-medium text-center  text-[#006BFF] text-3xl lg:text-left lg:text-7xl lg:font-normal lg:pl-0 mt-4">
          How to Start the Game
        </h1>
        <p className="text-center lg:w-[44vw] text-l lg:text-2xl lg:text-left text-black lg:pl-0 lg:text-l mt-2 px-5">
          Ready to challenge other traders? Watch this video to learn how to
          start trading and get started now. Compete with other traders , as per
          your knowledge and skill and win big
        </p>
      </div>
      <div
        ref={videoRef}
        className="flex justify-center relative mt-8 lg:mt-12 w-screen"
      >
        <iframe
          src="https://www.youtube.com/embed/-DQLpA7Fy2g"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
          className="rounded-lg shadow-lg max-w-2xl w-[88%] h-[49.5vw] lg:h-[52vh] lg:w-screen "
        ></iframe>
      </div>
      {/* game guide ends */}

      {/* faqs start */}
      <h1 className="text-3xl font-normal text-center p-2 mt-8 text-[#424242] ">
        FAQ&apos;s
      </h1>
      <div className="flex justify-center">
        <div>
          <FaqBox text="How safe is Tradding Ventures" />
          <FaqBox text="How and where will I get the winning money" />
          <FaqBox text="What is the lowest amount to start" />
          <FaqBox text="When will I get my money " />
          <FaqBox text="How to Play" />
        </div>
      </div>
      {/* faqs ends */}
      <div className=" text-base text-slate-500 mt-5 -mb-6 text-center ">
        {" "}
        <span>
          Charts Powered By
          <a
            className="text-[#006BFF] ml-1 hover:underline hover:text-blue-600"
            href="https://www.tradingview.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            TradingView
          </a>
        </span>{" "}
      </div>
      <Footer />
    </div>
  )
}

const FaqBox = ({ text }) => {
  const [click, setClick] = useState(false)

  const dropDownFun = () => {
    setClick(!click)
  }
  return (
    <div className="font-normal text-sm ">
      <button
        className=" mt-2 mb-2 h-10 text-slate-600 text-center pt-2 pb-1 border-2 border-slate-400   pl-3 w-[90vw] flex justify-between rounded-md hover:bg-slate-200 "
        onClick={dropDownFun}
      >
        {text}
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6  pr-2"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </svg>
        </div>
      </button>
      {click && (
        <div className=" text-slate-600 flex justify-center w-[90vw] border-2 border-slate-400 p-2 rounded-b-md -mt-4 border-t-0">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo,
          culpa assumenda. Voluptates harum laboriosam iste aperiam deleniti.
          Aliquid quidem unde tenetur accusamus libero iure debitis voluptatem,
          mollitia quibusdam, quasi beatae.
        </div>
      )}
    </div>
  )
}
