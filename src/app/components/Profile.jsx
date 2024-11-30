"use client";
import { useEffect, useState } from "react";
import { getCombinedData } from "../fetchData/fetchuserdata"; // Adjust path if necessary
import { useRouter } from "next/navigation";
import axios from "axios";
import DashAppbar from "./DashAppbar";

export default function Profile() {
  const [data, setData] = useState(null);
  // const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!userDetails?.username) {
      console.error("User username not found in session");
      return;
    }

    try {
      // Send a POST request to your custom sign-out API route
      const response = await axios.post("/api/signout", {
        username: userDetails?.username,
      });

      if (response.status !== 200) {
        console.error("Failed to update sign-out status");
        return;
      }

      router.push("/");
      // Optionally, handle successful sign-out here
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const combinedData = await getCombinedData();
        setData(combinedData);
      } catch (error) {
        console.error("Error fetching combined data:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  const { userDetails } = data;
  return (
    <>
      <DashAppbar />
      <div className="relative flex min-h-screen flex-col bg-black overflow-x-hidden">
        <div className="layout-container flex h-full flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#F4EFE6] px-6 py-3 sm:px-10">
            <div className="flex items-center gap-4 text-white">
              <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                tradding
              </h2>
            </div>
            <div className="flex flex-1 justify-end gap-4 sm:gap-8">
              <div className="flex gap-2">
                <button className="flex items-center justify-center rounded-full h-10 bg-[#F4EFE6] text-[#1C160C] text-sm font-bold px-2.5 min-w-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Z"></path>
                  </svg>
                </button>
                <button className="flex items-center justify-center rounded-full h-10 bg-[#F4EFE6] text-[#1C160C] text-sm font-bold px-2.5 min-w-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z"></path>
                  </svg>
                </button>
              </div>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"></div>
            </div>
          </header>
          <div className="flex flex-col md:flex-row gap-4 justify-center px-6 py-5">
            <div className="layout-content-container flex flex-col w-full md:w-80">
              <div className="flex flex-col items-center p-4">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full bg-white h-28 lg:h-28 w-28 lg:w-28 text-indigo-700  flex  items-center justify-center text-6xl lg:text-7xl">
                    P
                  </div>
                  <div className="flex flex-col items-center">
                    <p className=" text-[22px] text-blue-400 font-bold leading-tight tracking-[-0.015em]">
                      {userDetails?.username}
                    </p>
                    <p className="text-slate-400 text-base font-normal">
                      Joined On {userDetails?.joinedDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-stretch gap-2 px-4 py-3">
                <button className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center rounded-lg h-8 lg:h-12 px-5  text-black text-lg font-semibold w-[240px] lg:w-full bg-gradient-to-r bg-slate-200 hover:bg-transparent hover:border-2 hover:border-white hover:text-white">
                  <span className="truncate">Change Picture</span>
                </button>
                <button
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                  className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center font-semibold justify-center rounded-lg h-8 lg:h-12 px-5 bg-indigo-700 text-[#FFFFFF] hover:bg-indigo-500 text-lg w-[240px] lg:w-full"
                >
                  <span className="truncate">Start Game</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center rounded-lg h-8 lg:h-12 px-5 bg-[#FFFFFF] text-indigo-700 text-lg font-bold border border-solid w-[240px] lg:w-full hover:bg-transparent hover:border-2 hover:border-white hover:text-white"
                >
                  <span className="truncate">Log Out</span>
                </button>
              </div>
            </div>
            <div className="layout-content-container flex flex-col items-center gap-4 mt-8 w-full">
              <div className="layout-section-container flex flex-col">
                <div className="flex flex-col lg:-mt-10 justify-between gap-2">
                  <div className="flex  justify-center items-center p-2 ">
                    <span className="lg:text-8xl font-mono lg:mt-8 text-3xl md:text-5xl md:h-auto leading-none w-full font-medium text-center">
                      Your Performance
                    </span>
                  </div>
                  <div className="text-white mt-4 md:mt-2 text-center grid grid-cols-2 border-2 border-gray-300">
                    <div className="bg-indigo-600 py-2">
                      <span className="lg:text-xl text-l text-white font-normal font-mono text-glow">
                        Trades:
                      </span>
                      <span className="text-l lg:text-base text-glow"> 60</span>
                    </div>
                    <div className="bg-indigo-800 py-2">
                      <span className="lg:text-xl text-l text-white font-normal font-mono text-glow">
                        WinRate:
                      </span>
                      <span className="lg:text-base text-l text-glow">
                        {" "}
                        4/5
                      </span>
                    </div>
                  </div>

                  <div className="text-white mt-4 md:mt-2 text-center grid grid-cols-2 border-2 border-gray-300">
                    <div className="bg-indigo-600 py-2">
                      <span className="lg:text-xl text-l text-white font-normal font-mono text-glow">
                        ROC:
                      </span>
                      <span className="lg:text-base text-l text-glow"> 5%</span>
                    </div>
                    <div className="bg-indigo-800 py-2">
                      <span className="lg:text-xl text-l text-white font-normal font-mono text-glow">
                        Rank:
                      </span>
                      <span className="lg:text-base text-l text-glow">
                        {" "}
                        123
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="layout-section-container flex flex-col w-full">
                <div className="flex flex-col justify-center gap-2 lg:w-full w-[90vw]">
                  <div className="flex justify-between gap-2 w-full">
                    <span className="text-xl lg:text-3xl p-4 font-semibold text-white">
                      Trade History:
                    </span>
                  </div>
                  <div className="grid grid-cols-4 mr-1 lg:m-0 font-semibold text-center text-white  text-xs lg:text-lg md:text-xl">
                    <p>Rank</p>
                    <p>Name</p>
                    <p>Win/lose</p>
                    <p className="gap-x-2">Profit/Loss(INR)</p>
                  </div>

                  <div className=" text-center text-md bg-gradient-to-r w-[90vw] lg:w-full bg-black border-2 border-white p-4">
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Lost</span>
                      <span>-100</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Won</span>
                      <span>+100</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Won</span>
                      <span>+100</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Won</span>
                      <span>+100</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Won</span>
                      <span>+100</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Won</span>
                      <span>+100</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Won</span>
                      <span>+100</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Won</span>
                      <span>+100</span>
                    </div>
                    <div className="grid grid-cols-4 text-xs lg:text-lg p-1 border-b-2 border-gray-500">
                      <span className="-ml-5">123</span>
                      <span>Priyanshu Ranjan</span>
                      <span>Won</span>
                      <span>+100</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <button className=" text-start font-mono text-indigo-500 hover:text-blue-500 p-1 rounded-lg text-xs lg:text-lg flex justify-center">
                      {" "}
                      Click here To view all Opponents
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
