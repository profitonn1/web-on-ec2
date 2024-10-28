"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getCombinedData } from "../fetchData/fetchuserdata"
// import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { redirect } from "next/dist/server/api-utils";
import axios from "axios"

export default function Appbar2() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [, setShowPopup] = useState(false)

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleSignOut = async () => {
    if (!userDetails?.username) {
      console.error("User username not found in session")
      return
    }

    try {
      // Send a POST request to your custom sign-out API route
      const response = await axios.post("/api/signout", {
        username: userDetails?.username
      })

      if (response.status !== 200) {
        console.error("Failed to update sign-out status")
        return
      }

      router.push("/signin")
      // Optionally, handle successful sign-out here
      console.log("Sign-out successful")
    } catch (error) {
      console.error("Error during sign-out:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/verifyToken")
        if (response.status === 200) {
          const combinedData = await getCombinedData()
          setData(combinedData)
        }
      } catch (error) {
        console.error("Error fetching combined data:", error)
      }
    }
    fetchData()
  }, [])

  if (!data) return <div>Loading...</div>

  const { userDetails } = data

  return (
    <div className="border-b-2 p-2 border-slate-200 shadow flex flex-col lg:grid lg:grid-cols-3 lg:items-center">
      <div className="flex items-center justify-between lg:justify-start w-full relative">
        <a href="/dashboard">
          <Image src="/app/logo.png" alt="Logo" width={140} height={100} />
        </a>
        <div className="block lg:hidden relative">
          <button
            id="dropdownDefaultButton"
            className="hover:text-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
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
              className="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 bg-white rounded-lg text-sm text-slate-700 shadow-2xl"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="/dashboard"
                    className="block px-4 py-2  hover:bg-slate-300"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/rules"
                    className="block px-4 py-2  hover:bg-slate-300"
                  >
                    Rules
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="block px-4 py-2  hover:bg-slate-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="/useracount"
                    className="block px-4 py-2  hover:bg-slate-300"
                  >
                    Account
                  </a>
                </li>
                <li>
                  <a className="block px-4 py-2  hover:bg-slate-300">
                    <button onClick={handleSignOut}>Sign out</button>
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="p-2 hidden lg:flex lg:justify-evenly lg:w-auto lg:grid-cols-3 lg:gap-4">
        <a href="/dashboard">
          <button className=" text-slate-500 text-lg hover:text-blue-900 hover:underline">
            About
          </button>
        </a>
        <a href="/rules">
          <button className=" text-slate-500 text-lg hover:text-blue-900 hover:underline">
            Rules
          </button>
        </a>
        <button
          onClick={handleSignOut}
          className=" text-slate-500 text-lg hover:text-blue-900 hover:underline"
        >
          Sign out
        </button>
        <div>
          <button
            onClick={() => setShowPopup(true)}
            className="text-slate-500 text-lg hover:text-blue-900 hover:underline"
          >
            Start
          </button>
        </div>
      </div>
      <div className="flex justify-end ">
        <div className="hidden lg:block relative">
          <button
            id="dropdownDefaultButton"
            className="hover:text-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
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
                  <a
                    href="/dashboard"
                    className=" block px-4 py-2 hover:bg-slate-300 "
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/rules"
                    className="block px-4 py-2  hover:bg-slate-300"
                  >
                    Rules
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="block px-4 py-2  hover:bg-slate-300"
                  >
                    About
                  </a>
                </li>
                <li>
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 hover:bg-slate-300 text-start w-full "
                  >
                    Sign out
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