"use client";
import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import "../../globals.css";
import Image from "next/image";
import Footer from "../../components/Footer";
import axios from "axios";
import DashAppbar from "../../components/DashAppbar";
import terminal from "../../../../public/app/terminal.png";
export default function Dashboard() {
  const router = useRouter();
  const videoRef = useRef(null);

  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  const [categoryChosen, setCategoryChosen] = useState("");
  
  // Refs for each dropdown and button
  const dropdownRef1 = useRef(null);
  const buttonRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const buttonRef2 = useRef(null);
  const dropdownRef3 = useRef(null);
  const buttonRef3 = useRef(null);


  

  useEffect(() => {
    const dropdowns = [
      { open: dropdownOpen1, ref: dropdownRef1 },
      { open: dropdownOpen2, ref: dropdownRef2 },
      { open: dropdownOpen3, ref: dropdownRef3 },
    ];

    dropdowns.forEach(({ open, ref }) => {
      if (open && ref.current) {
        const dropdownRect = ref.current.getBoundingClientRect();
        const isDropdownVisible = dropdownRect.bottom <= window.innerHeight;

        if (!isDropdownVisible) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }
    });
  }, [dropdownOpen1, dropdownOpen2, dropdownOpen3]);
  const handleClickOutside = (event) => {
    if (!event) return; // Guard clause in case event is null
    if (
      dropdownOpen1 &&
      dropdownRef1.current &&
      !dropdownRef1.current.contains(event.target) &&
      !buttonRef1.current?.contains(event.target)
    ) {
      setDropdownOpen1(false);
    }
    if (
      dropdownOpen2 &&
      dropdownRef2.current &&
      !dropdownRef2.current.contains(event.target) &&
      !buttonRef2.current?.contains(event.target)
    ) {
      setDropdownOpen2(false);
    }
    if (
      dropdownOpen3 &&
      dropdownRef3.current &&
      !dropdownRef3.current.contains(event.target) &&
      !buttonRef3.current?.contains(event.target)
    ) {
      setDropdownOpen3(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen1, dropdownOpen2, dropdownOpen3]);

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function getCookieValue(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission if it's in a form element
    try {
      const userDetailsCookie = getCookieValue("userDetails");
      if (categoryChosen && userDetailsCookie) {
        const decodedUserDetails = decodeURIComponent(userDetailsCookie);
        const parsedUserDetails = JSON.parse(decodedUserDetails);
        await axios.post(
          "/api/category",
          {
            categoryChosen: categoryChosen,
            params: {
              id: parsedUserDetails.id,
              username: parsedUserDetails.username,
            },
          },
          {
            withCredentials: true, // Include credentials if needed
          }
        );
      }
      if (categoryChosen === "beginner") {
        router.push("/bstartgame");
      }
      if (categoryChosen === "plus") {
        router.push("/plstartgame");
      }
      if (categoryChosen === "pro") {
        router.push("/prstartgame");
      }
    } catch (error) {
      console.error("Error starting the game:", error);
    }
  };

  const redirectToTerminal = () => {
    router.push("/terminal")
    setButtonClicked(true);
  }

  return (
    <>
      <DashAppbar />
      <div className="bg-black">
        <div>
          <div className="text-center my-10 pt-16 py-6">
            <h1 className="text-white text-lg lg:text-8xl font-ubuntu font-medium">
              Select a category
            </h1>
          </div>
          <div class="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 lg:w-[90vw]">
            <div class="flex flex-wrap -mx-4">
              <div class="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
                <div class="bg-black glow2 p-6 shadow-lg text-center animate-color-glow1 rounded-lg">
                  <h2 class="text-2xl lg:text-3xl lg:font-bold font-semibold text-white">
                    Beginner
                  </h2>
                  <div className="lg:mt-8 font-semibold mt-2 text-base px-2 py-1 flex justify-around items-center lg:text-xl border-2 md:p-4 md:text-lg md:mt-8 border-slate-600 rounded-2xl lg:p-4">
                    <div>Min: ₹50</div>
                    <div className="w-[2px] h-[20px] font-semibold bg-white opacity-40"></div>
                    <div>Max: ₹200</div>
                  </div>
                  <div className="mt-4 flex flex-col items-center">
                    <ul>
                      <li className="text-lg mb-1 font-medium">
                        Time Limit: 15 Minutes
                      </li>
                      <li className="text-lg font-medium">
                        Initial Balance: $10,000
                      </li>
                    </ul>
                  </div>{" "}
                  <div className="mt-8 relative">
                    <a
                      href="#"
                      onClick={handleSubmit}
                      onMouseEnter={() => {
                        setCategoryChosen("beginner");
                      }}
                      ref={buttonRef1}
                      class="block w-full bg-indigo-700 hover:bg-indigo-500 text-white font-semibold text-center py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>

              <div class="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
                <div class="bg-black glow2 p-6 rounded-lg shadow-lg text-center animate-color-glow2">
                  <h2 class="text-2xl lg:text-3xl lg:font-bold font-semibold text-white">
                    Plus
                  </h2>
                  <div className="lg:mt-8 mt-2 font-semibold text-base px-2 py-1 flex justify-around items-center lg:text-xl border-2 md:p-4 md:text-lg md:mt-8 border-slate-600 rounded-2xl lg:p-4">
                    <div>Min: ₹250</div>
                    <div className="w-[2px] h-[20px] font-semibold bg-white opacity-40"></div>
                    <div>Max: ₹1000</div>
                  </div>
                  <div className="mt-4 flex flex-col items-center">
                    <ul>
                      <li className="text-lg mb-1 font-medium">
                        Time Limit: 45 Minutes
                      </li>
                      <li className="text-lg font-medium">
                        Initial Balance: $50,000
                      </li>
                    </ul>
                  </div>
                  <div className="relative mt-8">
                    <a
                      href="#"
                      onClick={handleSubmit}
                      onMouseEnter={() => {
                        setCategoryChosen("plus");
                      }}
                      ref={buttonRef1}
                      class="block w-full bg-indigo-700 hover:bg-indigo-500 text-white font-semibold text-center py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>

              <div class="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
                <div class="bg-black glow2 p-6 rounded-lg shadow-lg text-center animate-color-glow3">
                  <h2 class="text-2xl lg:text-3xl lg:font-bold font-semibold text-white">
                    Pro
                  </h2>
                  <div className="lg:mt-8 font-semibold mt-2 text-base px-2 py-1 flex justify-around items-center lg:text-xl border-2 md:p-4 md:text-lg md:mt-8 border-slate-600 rounded-2xl lg:p-4">
                    <div>Min: ₹1250</div>
                    <div className="w-[2px] font-semibold h-[20px] bg-white opacity-40"></div>
                    <div>Max: ₹5000</div>
                  </div>
                  <div className="mt-4 flex flex-col items-center">
                    <ul>
                      <li className="text-lg mb-1 font-medium">
                        Time Limit: 120 Minutes
                      </li>
                      <li className="text-lg font-medium">
                        Initial Balance: $1,00,000
                      </li>
                    </ul>
                  </div>{" "}
                  <div class="mt-8 relative">
                    <a
                      href="#"
                      onClick={handleSubmit}
                      onMouseEnter={() => {
                        setCategoryChosen("pro");
                      }}
                      ref={buttonRef1}
                      class="block w-full bg-indigo-700 hover:bg-indigo-500 text-white font-semibold text-center py-2 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mb-12 flex-col items-center justify-center my-12">
            <h1 className="text-white text-lg lg:text-6xl font-ubuntu font-medium mb-4">
              Not ready to risk real money?
            </h1>
            <p className="text-3xl mb-8 text-white opacity-60">
              Take a free demo trade with us
            </p>
            <button onClick={redirectToTerminal} className="bg-indigo-700 mb-8 hover:bg-indigo-500 transition duration-300 ease-in-out transform hover:scale-105 rounded-lg font-semibold text-white w-44 p-2 relative text-lg mx-5">
              Start
            </button>
            <div className="w-[60vw]">
              <Image src={terminal} alt="terminal image" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
