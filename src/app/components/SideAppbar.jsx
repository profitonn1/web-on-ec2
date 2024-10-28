"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
// import { useSession } from 'next-auth/react';
import { getCombinedData } from "../fetchData/fetchuserdata"
// import axios from "axios";
// import { signOut } from "next-auth/react";
// import ChallengePopup from "./ChallengeByPopup";
import axios from "axios"

export default function SideAppbar({
  onClickBy,
  onClickTo,
  noofChallengesGot,
  noofChallengesSent
}) {
  //  const [isModalOpen, setIsModalOpen] = useState(false);
  //  const [, setBrightness] = useState(100);
  const [data, setData] = useState(null)
  //  const { data: session, status } = useSession();
  const [, setDropdown] = useState(false)

  //  const [, setLoading] = useState(true);
  const router = useRouter()

  //  useEffect(() => {
  //   const verifyToken = async () => {
  //     try {

  //       const response = await axios.get("/api/verifyToken",);

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
  //  const toggleSidebar = () => {
  //     setIsModalOpen(!isModalOpen);

  //     // Set brightness based on the new state of isModelOpen
  //     if (!isModalOpen) {
  //       setBrightness(50);  // When modal opens
  //     } else {
  //       setBrightness(100); // When modal closes
  //     }
  //   };

  // const [, setSidebarOpen] = useState(false);

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

  const { userDetails } = data || {}
  //  additionalData

  return (
    <div>
      <aside
        id="default-sidebar"
        className="fixed top-16 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r-2 border-gray-300 "
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-950">
          <ul className="space-y-2 font-medium">
            <li>
              <button
                onClick={() => {
                  router.push("/dashboard")
                }}
                className="w-full  text-start rounded-lg p-2  hover:bg-gray-700 flex items-center gap-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  router.push("/dashboard")
                }}
                className="w-full  text-start rounded-lg p-2  hover:bg-gray-700 flex items-center gap-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Settings
              </button>
            </li>

            <li>
              <button
                onMouseEnter={() => {
                  setDropdown(true)
                }}
                onMouseOut={() => {
                  setDropdown(false)
                }}
                onClick={onClickTo}
                className="w-full  text-start rounded-lg p-2  hover:bg-gray-700 flex items-center gap-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
                ChallengedTo({noofChallengesSent})
              </button>
            </li>

            <li>
              <button
                onMouseEnter={() => {
                  setDropdown(true)
                }}
                onMouseOut={() => {
                  setDropdown(false)
                }}
                onClick={onClickBy}
                className="w-full  text-start rounded-lg p-2  hover:bg-gray-700 flex items-center gap-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 4.5 15 15m0 0V8.25m0 11.25H8.25"
                  />
                </svg>
                ChallengedBy({noofChallengesGot})
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  router.push("/profile")
                }}
                className="w-full  text-start rounded-lg p-2  hover:bg-gray-700 flex items-center gap-x-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Profile
              </button>
            </li>

            <li>
              <button
                onClick={handleSignOut}
                className="w-full  text-start rounded-lg p-2  hover:bg-gray-700 flex items-center gap-x-2"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                  />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  )
}