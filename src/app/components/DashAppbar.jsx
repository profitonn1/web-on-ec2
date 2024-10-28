"use client"
import Image from "next/image"
// import { useSession } from "next-auth/react";
import { getCombinedData } from "../fetchData/fetchuserdata"
import { useState, useEffect, useRef } from "react"
// import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation"
import walletImage from "../../../public/app/wallet.png"
import axios from "axios"
import logo from "../../../public/app/logo-3.png"

export default function DashAppbar() {
  const [data, setData] = useState(null)
  // const { data: session } = useSession();
  const router = useRouter()

  const dropdownRef = useRef(null)
  const balanceRef = useRef(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [balanceOpen, setbalanceOpen] = useState(false)
  const buttonRef = useRef(null)
  const buttonRef2 = useRef(null)
  const [hasScrolled, setHasScrolled] = useState(false)

  const balanceButton = event => {
    event.stopPropagation()
    setbalanceOpen(!balanceOpen)
  }

  const toggleDropdown = event => {
    event.stopPropagation()
    setDropdownOpen(!dropdownOpen)
  }

  const handleClickOutside = event => {
    if (
      balanceOpen &&
      balanceRef.current &&
      !balanceRef.current.contains(event.target) &&
      !buttonRef2.current?.contains(event.target)
    ) {
      setbalanceOpen(false)
    }

    if (
      dropdownOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !buttonRef.current?.contains(event.target)
    ) {
      setDropdownOpen(false)
    }
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

      router.push("/")
      // Optionally, handle successful sign-out here
      console.log("Sign-out successful")
    } catch (error) {
      console.error("Error during sign-out:", error)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownOpen, balanceOpen])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHasScrolled(true)
      } else {
        setHasScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const combinedData = await getCombinedData()
        setData(combinedData)
      } catch (error) {
        console.error("Error fetching combined data:", error)
      }
    }
    fetchData()
  }, [])

  if (!data) return <div>Loading...</div>

  const { userDetails } = data

  return (
    <div>
      {/* <div className="text-white">{data.mobile}</div> */}
      <nav
        className={`bg-gray-950 border-b-2 border-b-gray-900 z-50 fixed left-0 right-0 top-0 transition-all ${
          hasScrolled ? "border-b-2 border-gray-700" : ""
        }`}
      >
        {/* <div></div> */}

        <div className="max-w-screen-xl flex justify-between items-center mx-auto p-2">
          <button
            onClick={() => {
              router.push("/dashboard")
            }}
            className="flex gap-2 text-[#2995d8] font-bold  text-2xl"
          >
            <Image src={logo} alt="Stock_img" className="w-10 " />
            <span>ProfitONN</span>
          </button>

          <div className="flex items-center justify-between w-40 pr-5 md:order-2 lg:gap-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="relative">
              <button
                onClick={balanceButton}
                ref={buttonRef2}
                className=" -ml-6 lg:-ml-8 w-28 lg:w-36 lg:gap-x-5 p-3 lg:p-5 h-8 lg:h-12 text-slate-800 bg-blue-700 font-normal text-lg rounded-xl flex items-center justify-center bg-gradient-to-r  from-cyan-500 to-blue-500 relative group   hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ...  hover:text-black"
              >
                <Image
                  src={walletImage}
                  alt="Logo"
                  // width={100}
                  // height={100}
                  className="lg:w-10 lg:h-10 md:h-6 md:w-6 w-6 h-6 mr-1 lg:-mr-1 "
                />
                Balance
              </button>

              {balanceOpen && (
                <div
                  ref={balanceRef}
                  className="absolute -right-2 h-42  mt-2 w-40 text-center p-2 bg-gradient-to-r  from-cyan-500 to-blue-500 text-black rounded-3xl  shadow-lg"
                >
                  <div>Your Balance </div>
                  <div className="flex justify-center  ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="pt-1 size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <p className="text-lg font-bold">{userDetails?.balance}</p>
                  </div>
                  <div className="mt-2 text-white">
                    <button className="bg-orange-600 p-2  rounded-3xl w-32 hover:bg-orange-500">
                      Add Money
                    </button>
                    <button className="bg-orange-600 p-2 mt-2  w-32 rounded-3xl hover:bg-orange-500">
                      WithDraw
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              className="  flex text-sm rounded-full md:me-0 border-2 bg-blue-700 text-white"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
              onClick={toggleDropdown}
              ref={buttonRef}
            >
              <span className="sr-only">Open user menu</span>

              <div className="w-8 h-8 lg:w-10 lg:h-10 font-medium text-lg rounded-full flex justify-center flex-col bg-gradient-to-r from-cyan-500 to-blue-500 ... text-blue-900  hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ...">
                P
              </div>
            </button>
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                id="dropdown"
                className="absolute right-5 top-16 z-10 bg-gradient-to-r text-black from-cyan-500 to-blue-500 ... divide-y  divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-100"
              >
                <ul
                  className="py-2  rounded-lg text-sm text-black shadow-2xl"
                  aria-labelledby="dropdownDefaultButton"
                >
                  <li>
                    <button
                      onClick={() => {
                        router.push("/dashboard")
                        setDropdownOpen(false)
                      }}
                      className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        router.push("/profile")
                        setDropdownOpen(false)
                      }}
                      className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
                    >
                      Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        router.push("/dashboard")
                        setDropdownOpen(false)
                      }}
                      className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
                    >
                      Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        router.push("/dashboard")
                        setDropdownOpen(false)
                      }}
                      className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}