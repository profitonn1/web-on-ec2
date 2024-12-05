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
            className="flex flex-col font-medium justify-center px-7 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-3xl text-white w-30 text-center text-base transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign In
          </a>
          <button
            id="dropdownDefaultButton"
            className="text-blue-900 font-medium  rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
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
    className="absolute right-0 mt-14 z-10 bg-black divide-y divide-gray-700 rounded-lg shadow-lg w-44 dark:bg-gray-800"
  >
    <ul
      className="py-2 rounded-lg text-sm text-white shadow-2xl"
      aria-labelledby="dropdownDefaultButton"
    >
      <li>
        <button
          onClick={() => {
            router.push("/");
          }}
          className="block px-4 py-2 text-start w-full hover:bg-indigo-600 rounded-md  hover:scale-105 transition-all duration-300"
        >
          Home
        </button>
      </li>

      <li>
        <button
          onClick={() => {
            router.push("/about");
          }}
          className="block px-4 py-2 text-start w-full hover:bg-indigo-600  rounded-md hover:scale-105 transition-all duration-300"
        >
          About
        </button>
      </li>

      <li>
        <button
          onClick={() => {
            router.push("/signup");
          }}
          className="block px-4 py-2 text-start w-full hover:bg-indigo-600  rounded-md hover:scale-105 transition-all duration-300"
        >
          Signup
        </button>
      </li>

      <li>
        <button
          onClick={() => {
            router.push("/signin");
          }}
          className="block px-4 py-2 text-start w-full hover:bg-indigo-600  rounded-md hover:scale-105 transition-all duration-300"
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
    isScrolled ? "text-white" : "text-gray-400"
  } lg:flex lg:justify-evenly lg:w-auto lg:grid-cols-5`}
>
  <button
    onClick={() => {
      router.push("/");
    }}
    className="cursor-pointer text-xl hover:text-gray-200 transform hover:scale-110 transition duration-300"
  >
    Home
  </button>
  <button
    onClick={() => {
      router.push("/about");
    }}
    className="cursor-pointer text-xl hover:text-gray-200 transform hover:scale-110 transition duration-300"
  >
    About
  </button>
  <button
    onClick={() => {
      router.push("/signup");
    }}
    className="cursor-pointer text-xl hover:text-gray-200 transform hover:scale-110 transition duration-300"
  >
    Sign Up
  </button>
  <button
    onClick={() => {
      router.push("/signin");
    }}
    className="cursor-pointer text-xl hover:text-gray-200 transform hover:scale-110 transition duration-300"
  >
    Sign In
  </button>
</div>

      {/* Dropdown toggle */}
      <button className="fixed right-0 top-4 text-center rounded-lg mr-5 bg-indigo-700 text-lg w-32 h-10 text-white  flex flex-col justify-center lg:block transition duration-300 ease-in-out transform hover:scale-105">
        Start Demo
      </button>

    </div>
  );
}
