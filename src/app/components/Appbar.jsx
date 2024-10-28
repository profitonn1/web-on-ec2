"use client"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import logo from "../../../public/app/logo-3.png"

export default function Appbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <div className="fixed top-0 left-0 right-0 py-2 border-b-2 border-[#B7B7B7] pl-3 w-screen shadow lg:grid lg:grid-cols-3 lg:items-center bg-[#EDDFE0] z-50">
      <div className="flex items-center justify-between lg:justify-start w-screen relative bg-#D6C0B3">
        <button
          onClick={() => {
            router.push("/")
          }}
          className="flex gap-2 text-[#055f9c] font-bold  text-2xl"
        >
          <Image src={logo} alt="logo" className="w-10 " />
          <span>ProfitONN</span>
        </button>
        <div className="flex justify-between lg:hidden ">
          <a
            href="/signin"
            className="flex flex-col font-medium justify-center px-7 py-2 bg-blue-500 rounded-3xl text-white w-30 text-center text-base"
          >
            Sign In
          </a>
          <button
            id="dropdownDefaultButton"
            className=" text-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
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
              className="absolute right-0 mt-14 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 "
            >
              <ul
                className="py-2 bg-white rounded-lg text-sm text-slate-700 shadow-2xl"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <button
                    onClick={() => {
                      router.push("/")
                    }}
                    className=" block px-4 py-2 hover:bg-slate-300 text-start w-full"
                  >
                    Home
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => {
                      router.push("/about")
                    }}
                    className=" block px-4 py-2 hover:bg-slate-300 text-start w-full"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      router.push("/signup")
                    }}
                    className="block px-4 py-2 hover:bg-slate-300 text-start w-full"
                  >
                    Signup
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      router.push("/signin")
                    }}
                    className="block px-4 py-2 hover:bg-slate-300 text-start w-full"
                  >
                    Sign In
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="z-50  p-2 hidden lg:flex lg:justify-evenly lg:w-auto lg:grid-cols-5 ">
        <button
          onClick={() => {
            router.push("/")
          }}
          className=" cursor-pointer text-slate-500 text-lg hover:text-blue-900 hover:underline"
        >
          Home
        </button>
        <button
          onClick={() => {
            router.push("/about")
          }}
          className=" cursor-pointer text-slate-500 text-lg hover:text-blue-900 hover:underline"
        >
          About
        </button>
        <button
          onClick={() => {
            router.push("/signup")
          }}
          className=" cursor-pointer text-slate-500 text-lg hover:text-blue-900 hover:underline"
        >
          Sign Up
        </button>
        <button
          onClick={() => {
            router.push("/signin")
          }}
          className=" cursor-pointer text-slate-500 text-lg hover:text-blue-900 hover:underline "
        >
          Sign In
        </button>
      </div>
      <div className="flex justify-end mr-5">
        <div className=" hidden lg:block relative">
          <button
            id="dropdownDefaultButton"
            className="hover:border-2 border-slate-600 text-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
            type="button"
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
              className="absolute right-2 mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 bg-white rounded-lg text-sm text-slate-700 shadow-2xl"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <button
                    onClick={() => {
                      router.push("/")
                    }}
                    className=" block text-start w-full  px-4 py-2 hover:bg-slate-300 "
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      router.push("/about")
                    }}
                    className="block text-start w-full px-4 py-2  hover:bg-slate-300"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      router.push("/signup")
                    }}
                    className="block px-4 py-2  w-full text-start hover:bg-slate-300"
                  >
                    Sign Up{" "}
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}