"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../../public/app/logo-3.png";

export default function Appbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function handleScroll() {
    if (window.scrollY > 100) {
      setIsScrolled(true); // Navbar background becomes transparent when scrolled
    } else {
      setIsScrolled(false); // Solid background before scrolling
    }
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div
      className={`fixed top-0 pt-3 left-0 right-0 py-2 pl-3 w-screen shadow lg:grid lg:grid-cols-3 lg:items-center z-50 ${
        isScrolled
          ? "bg-gradient-to-b from-zinc-950 to-transparent"
          : "bg-black" 
      } rounded-b-xl`}
    >
      <div className="flex items-center justify-between lg:justify-start w-screen relative">
        <button
          onClick={() => {
            router.push("/");
          }}
          className="text-xl ml-8 font-ubuntu font-medium lg:font-semibold lg:px-5 opacity-80 text-white"
        >
          {/* <Image src={logo} alt="logo" className="w-10" /> */}
          <span className=" lg:text-4xl">ProfitONN</span>
        </button>
        <div className="flex justify-between lg:hidden">
          <a
            href="/signin"
            className="flex flex-col font-medium justify-center px-7 py-2 bg-blue-500 rounded-3xl text-white w-30 text-center text-base"
          >
            Sign In
          </a>
          <button
            id="dropdownDefaultButton"
            className="text-blue-900 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div
              id="dropdown"
              className="absolute right-0 mt-14 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 bg-white rounded-lg text-sm text-slate-700 shadow-2xl"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <button
                    onClick={() => {
                      router.push("/");
                    }}
                    className="block px-4 py-2 hover:text-white text-start w-full"
                  >
                    Home
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => {
                      router.push("/about");
                    }}
                    className="block px-4 py-2 hover:text-white text-start w-full"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      router.push("/signup");
                    }}
                    className="block px-4 py-2 hover:text-white text-start w-full"
                  >
                    Signup
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      router.push("/signin");
                    }}
                    className="block px-4 py-2 hover:text-white text-start w-full"
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Large screen navigation */}
      <div
        className={`z-50 p-2 hidden ${
          isScrolled
            ? "text-white"
            : "text-gray-400" // Solid black background when at top
        } lg:flex lg:justify-evenly lg:w-auto lg:grid-cols-5`}
      >
        <button
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer text-xl hover:text-gray-200 hover:underline"
        >
          Home
        </button>
        <button
          onClick={() => {
            router.push("/about");
          }}
          className="cursor-pointer text-xl hover:text-gray-200 hover:underline"
        >
          About
        </button>
        <button
          onClick={() => {
            router.push("/signup");
          }}
          className="cursor-pointer text-xl hover:text-gray-200 hover:underline"
        >
          Sign Up
        </button>
        <button
          onClick={() => {
            router.push("/signin");
          }}
          className="cursor-pointer text-xl hover:text-gray-200 hover:underline"
        >
          Sign In
        </button>
      </div>
      {/* Dropdown toggle */}
      <div className="flex justify-end mr-5">
        <div className="hidden lg:block relative">
          <button
            id="dropdownDefaultButton"
            className="hover:border-2 border-slate-600 text-slate-500 hover:text-gray-400 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
            type="button"
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-12 h-12 ml-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          {dropdownOpen && (
            <div
              id="dropdown"
              className="absolute right-2 mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 bg-white rounded-lg text-sm text-slate-700 shadow-2xl"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <button
                    onClick={() => {
                      router.push("/");
                    }}
                    className="block text-start w-full px-4 py-2 hover:text-white"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      router.push("/about");
                    }}
                    className="block text-start w-full px-4 py-2 hover:text-white"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      router.push("/signup");
                    }}
                    className="block px-4 py-2 w-full text-start hover:text-white"
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
