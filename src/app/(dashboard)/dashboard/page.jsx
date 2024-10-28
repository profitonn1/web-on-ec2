"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import React from "react"
import "../../globals.css"
import Footer from "../../components/Footer"
import axios from "axios"
// import Cookies from "js-cookie";
// import jwt from 'jsonwebtoken';
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default function Dashboard() {
  // const pathname = usePathname();
  // const { data: session, status } = useSession();
  const router = useRouter()
  const videoRef = useRef(null)

  // Separate state for each dropdown
  const [dropdownOpen1, setDropdownOpen1] = useState(false)
  const [dropdownOpen2, setDropdownOpen2] = useState(false)
  const [dropdownOpen3, setDropdownOpen3] = useState(false)
  const [categoryChosen, setCategoryChosen] = useState("")

  // Refs for each dropdown and button
  const dropdownRef1 = useRef(null)
  const buttonRef1 = useRef(null)
  const dropdownRef2 = useRef(null)
  const buttonRef2 = useRef(null)
  const dropdownRef3 = useRef(null)
  const buttonRef3 = useRef(null)

  // const toggleDropdown1 = (event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   setDropdownOpen1(!dropdownOpen1);
  // };

  // const toggleDropdown2 = (event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   setDropdownOpen2(!dropdownOpen2);
  // };

  // const toggleDropdown3 = (event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   setDropdownOpen3(!dropdownOpen3);
  // };

  useEffect(() => {
    const dropdowns = [
      { open: dropdownOpen1, ref: dropdownRef1 },
      { open: dropdownOpen2, ref: dropdownRef2 },
      { open: dropdownOpen3, ref: dropdownRef3 }
    ]

    dropdowns.forEach(({ open, ref }) => {
      if (open && ref.current) {
        const dropdownRect = ref.current.getBoundingClientRect()
        const isDropdownVisible = dropdownRect.bottom <= window.innerHeight

        if (!isDropdownVisible) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
      }
    })
  }, [dropdownOpen1, dropdownOpen2, dropdownOpen3])
  const handleClickOutside = event => {
    if (!event) return // Guard clause in case event is null
    if (
      dropdownOpen1 &&
      dropdownRef1.current &&
      !dropdownRef1.current.contains(event.target) &&
      !buttonRef1.current?.contains(event.target)
    ) {
      setDropdownOpen1(false)
    }
    if (
      dropdownOpen2 &&
      dropdownRef2.current &&
      !dropdownRef2.current.contains(event.target) &&
      !buttonRef2.current?.contains(event.target)
    ) {
      setDropdownOpen2(false)
    }
    if (
      dropdownOpen3 &&
      dropdownRef3.current &&
      !dropdownRef3.current.contains(event.target) &&
      !buttonRef3.current?.contains(event.target)
    ) {
      setDropdownOpen3(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [dropdownOpen1, dropdownOpen2, dropdownOpen3])

  const scrollToVideo = () => {
    videoRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // const [, setLoading] = useState(true);

  // useEffect(() => {
  //   const verifyToken = async () => {
  //     try {
  //       const response = await axios.get("/api/verifyToken");

  //       console.log(response.status)
  //       if (response.status === 200) {
  //         console.log("Token is valid:", response.data);
  //         // setLoading(false);
  //       } else {
  //         router.push("/signin");
  //       }
  //     } catch (error) {
  //       console.error("Error verifying token:", error);
  //       router.push("/signin");
  //     }
  //   };

  //   verifyToken();
  // }, [router]);
  function getCookieValue(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) return match[2]
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault() // Prevent form submission if it's in a form element
    try {
      const userDetailsCookie = getCookieValue("userDetails")

      if (categoryChosen && userDetailsCookie) {
        console.log("User Details Cookie:", userDetailsCookie) // Log the cookie value
        const decodedUserDetails = decodeURIComponent(userDetailsCookie)
        const parsedUserDetails = JSON.parse(decodedUserDetails)

        await axios.post(
          "/api/category",
          {
            categoryChosen: categoryChosen,
            params: {
              id: parsedUserDetails.id,
              username: parsedUserDetails.username
            }
          },
          {
            withCredentials: true // Include credentials if needed
          }
        )
      }
      if (categoryChosen === "beginner") {
        router.push("/bstartgame")
      }
      if (categoryChosen === "plus") {
        router.push("/plstartgame")
      }
      if (categoryChosen === "pro") {
        router.push("/prstartgame")
      }
    } catch (error) {
      console.error("Error starting the game:", error)
    }
  }

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="p-1 md:p-14 lg:p-20 lg:my-10">
        <div className=" text-center text-3xl lg:pb-8 font-sans font-semibold md:text-7xl lg:-mt-8 lg:text-6xl mt-20 md:mt-5 text-gradient">
          Select A Category
        </div>
        <div className="text-center lg:text-xl text-base lg:text-l font-sans font-light">
          <button
            className="text-blue-400 hover:text-blue-500 underline"
            onClick={scrollToVideo}
          >
            Are you pro?Know here
          </button>
        </div>

        {/* players selection section starts */}
        <div className="flex justify-center">
          <div className="grid grid-flow-row lg:grid-cols-3 gap-1 lg:gap-8 lg:mt-6 text-white  rounded-xl mt-4 bg-gray-950">
            {/* First Column */}
            <div className="p-4 mt-2 w-[80vw] lg:w-[25vw] flex flex-col justify-center border-r-2 border-2  border-gray-700 text-center rounded-2xl">
              <div className="lg:text-4xl font-normal md:text-4xl text-2xl">
                Beginner
              </div>
              <div className="lg:mt-8 mt-2 text-base px-2 py-1 flex justify-around items-center lg:text-xl border-2 md:p-4 md:text-lg md:mt-8 border-slate-600 rounded-2xl lg:p-4">
                <div>Min: ₹50</div>
                <div className="w-[1px] h-[20px] bg-white opacity-40"></div>
                <div>Max: ₹200</div>
              </div>
              <div className="relative">
                <button
                  onClick={handleSubmit}
                  onMouseEnter={() => {
                    setCategoryChosen("beginner")
                  }}
                  ref={buttonRef1}
                  className="bg-blue-700 rounded-full mt-4 lg:p-2 lg:text-lg lg:w-48 hover:bg-blue-600 md:p-2 md:w-48 md:text-lg w-[28vw] text-center p-2 text-base font-medium tracking-widest"
                >
                  Start
                </button>
              </div>
            </div>

            {/* Second Column */}
            <div className="p-4 mt-2 w-[80vw] lg:w-[25vw] flex flex-col justify-center border-2 border-gray-700 text-center rounded-2xl">
              <div className="lg:text-4xl font-normal md:text-4xl text-2xl">
                Plus
              </div>
              <div className="lg:mt-8 mt-2 text-base p-2 flex justify-around items-center lg:text-xl border-2 md:p-4 md:text-lg md:mt-8 border-slate-600 rounded-2xl lg:p-4">
                <div>Min: ₹250</div>
                <div className="w-[1px] h-[20px] bg-white opacity-40"></div>
                <div>Max: ₹1000</div>
              </div>
              <div className="relative">
                <button
                  onClick={handleSubmit}
                  onMouseEnter={() => {
                    setCategoryChosen("plus")
                  }}
                  ref={buttonRef1}
                  className="bg-blue-700 rounded-full mt-4 lg:p-2 lg:text-lg lg:w-48 hover:bg-blue-600 md:p-2 md:w-48 md:text-lg w-[28vw] text-center p-2 text-base font-medium tracking-widest"
                >
                  Start
                </button>
              </div>
            </div>

            {/* Third Column */}
            <div className="p-4 mt-2 w-[80vw] lg:w-[25vw] flex flex-col justify-center border-2 border-gray-700  rounded-2xl text-center">
              <div className="lg:text-4xl font-normal md:text-4xl text-2xl">
                Pro
              </div>
              <div className="lg:mt-8 mt-2 text-base p-2 flex justify-around items-center lg:text-xl border-2 md:p-4 md:text-lg md:mt-8 border-slate-600 rounded-2xl lg:p-4">
                <div>Min: ₹1250</div>
                <div className="w-[1px] h-[20px] bg-white opacity-40"></div>
                <div>Max: ₹5000</div>
              </div>
              <div className="relative">
                <button
                  onClick={handleSubmit}
                  onMouseEnter={() => {
                    setCategoryChosen("pro")
                  }}
                  ref={buttonRef1}
                  className="bg-blue-700 rounded-full mt-4 lg:p-2 lg:text-lg lg:w-48 hover:bg-blue-600 md:p-2 md:w-48 md:text-lg w-[28vw] text-center p-2 text-base font-medium tracking-widest"
                >
                  Start
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* players selection section ends here */}

      {/* Video section */}
      <div className="flex flex-col items-center w-screen">
        <h1 className="text-2xl lg:text-5xl mb-8 font-semibold text-center text-gradient lg:-mt-5 mt-10">
          Detailed Video Explanation
        </h1>
        <div ref={videoRef} className="flex justify-center w-full">
          <iframe
            src="https://www.youtube.com/embed/-DQLpA7Fy2g"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
            className="rounded-lg shadow-lg max-w-2xl w-[88%] h-[49.5vw] lg:h-[52vh] lg:w-screen"
          ></iframe>
        </div>
      </div>

      <Footer />
    </div>
  )
}

//beginner dropdown
// {dropdownOpen1 && (
//   <div
//     ref={dropdownRef1}
//     className="bg-slate-700 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-3xl p-4 z-50"
//   >
//     <div className="text-xl mb-4">Choose</div>
//     <div>
//       <button onClick={()=>{router.push("/random")}} className="bg-blue-700 hover:bg-blue-600 w-full p-2 rounded-full mb-4">
//         Automatic Pairing
//       </button>
//     </div>
//     <div>
//       <button onClick={()=>{router.push("/bchallenge")}} className="bg-blue-700 hover:bg-blue-600 w-full p-2 rounded-full">
//         Challenge
//       </button>
//     </div>
//   </div>
// )}

// {dropdownOpen3 && (
//   <div
//     ref={dropdownRef3}
//     className="bg-slate-700 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-3xl p-4 z-50"
//   >
//     <div className="text-xl mb-4">Choose</div>
//     <div>
//       <button className="bg-blue-700 hover:bg-blue-600 w-full p-2 rounded-full mb-4">
//         Automatic Pairing
//       </button>
//     </div>
//     <div>
//       <button className="bg-blue-700 hover:bg-blue-600 w-full p-2 rounded-full">
//         Challenge
//       </button>
//     </div>
//   </div>
// )}

// {dropdownOpen2 && (
//   <div
//     ref={dropdownRef2}
//     className="bg-slate-700 absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-3xl p-4 z-50"
//   >
//     <div className="text-xl mb-4">Choose</div>
//     <div>
//       <button className="bg-blue-700 hover:bg-blue-600 w-full p-2 rounded-full mb-4">
//         Automatic Pairing
//       </button>
//     </div>
//     <div>
//       <button className="bg-blue-700 hover:bg-blue-600 w-full p-2 rounded-full">
//         Challenge
//       </button>
//     </div>
//   </div>
// )}