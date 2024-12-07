// "use client";
// import Image from "next/image";
// // import { useSession } from "next-auth/react";
// import { getCombinedData } from "../fetchData/fetchuserdata";
// import { useState, useEffect, useRef } from "react";
// // import { signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import walletImage from "../../../public/app/wallet.png";
// import axios from "axios";

// export default function DashAppbar() {
//   const [data, setData] = useState(null);
//   // const { data: session } = useSession();
//   const router = useRouter();

//   const dropdownRef = useRef(null);
//   const balanceRef = useRef(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [balanceOpen, setbalanceOpen] = useState(false);
//   const buttonRef = useRef(null);
//   const buttonRef2 = useRef(null);
//   const [hasScrolled, setHasScrolled] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   function handleScroll() {
//     if (window.scrollY > 100) {
//       setIsScrolled(true);
//     } else {
//       setIsScrolled(false);
//     }
//   }
//   const balanceButton = (event) => {
//     event.stopPropagation();
//     setbalanceOpen(!balanceOpen);
//   };

//   const toggleDropdown = (event) => {
//     event.stopPropagation();
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleClickOutside = (event) => {
//     if (
//       balanceOpen &&
//       balanceRef.current &&
//       !balanceRef.current.contains(event.target) &&
//       !buttonRef2.current?.contains(event.target)
//     ) {
//       setbalanceOpen(false);
//     }

//     if (
//       dropdownOpen &&
//       dropdownRef.current &&
//       !dropdownRef.current.contains(event.target) &&
//       !buttonRef.current?.contains(event.target)
//     ) {
//       setDropdownOpen(false);
//     }
//   };

//   const handleSignOut = async () => {
//     if (!userDetails?.username) {
//       console.error("User username not found in session");
//       return;
//     }

//     try {
//       // Send a POST request to your custom sign-out API route
//       const response = await axios.post("/api/signout", {
//         username: userDetails?.username,
//       });

//       if (response.status !== 200) {
//         console.error("Failed to update sign-out status");
//         return;
//       }

//       router.push("/");
//       // Optionally, handle successful sign-out here
//       console.log("Sign-out successful");
//     } catch (error) {
//       console.error("Error during sign-out:", error);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dropdownOpen, balanceOpen]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 0) {
//         setHasScrolled(true);
//       } else {
//         setHasScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const combinedData = await getCombinedData();
//         setData(combinedData);
//       } catch (error) {
//         console.error("Error fetching combined data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   if (!data) return <div>Loading...</div>;

//   const { userDetails } = data;

//   return (
//     <div>
//       {/* <div className="text-white">{data.mobile}</div> */}
//       <nav
//         className={`fixed flex top-0 left-0 right-0 py-1 lg:py-2 pl-3 w-screen shadow z-50 ${
//           isScrolled
//             ? "bg-gradient-to-b from-zinc-950 to-transparent"
//             : "bg-black"
//         }`}
//       >
//         {/* <div></div> */}

//         <div className="flex items-center justify-between lg:justify-start w-screen relative">
//           <button
//             onClick={() => {
//               router.push("/dashboard");
//             }}
//             className="text-xl lg:text-3xl ml-8 font-ubuntu font-medium lg:font-semibold lg:px-5 opacity-80 text-white"
//           >
//             <span>ProfitONN</span>
//           </button>

//           <div className="grid grid-cols-3 gap-2 mr-8 items-center">
// <div className="w-[30px] h-[16px] -mt-4">
//   <div className="relative">
//     <svg
//       className="w-10 h-10 text-teal-600 animate-wiggle"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 21 21"
//     >
//       <path
//         fill="none"
//         stroke="currentColor"
//         stroke-linecap="round"
//         stroke-linejoin="round"
//         d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
//       />
//     </svg>
//     <div className="px-1 bg-teal-500 rounded-full text-center text-white text-sm absolute -top-2 -end-2">
//       3
//       <div class="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-teal-200 w-full h-full"></div>
//     </div>
//   </div>
// </div>

//             <div className="relative">
//               <button
//                 onClick={balanceButton}
//                 ref={buttonRef2}
//                 className=" -ml-6 lg:-ml-8 w-28 lg:w-36 lg:gap-x-5 p-3 lg:p-5 h-8 lg:h-12 text-white bg-blue-950 font-normal text-lg rounded-xl flex items-center justify-center bg-gradient-to-r  from-cyan-500 to-blue-500 relative group   hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ...  hover:text-white"
//               >
//                 <Image
//                   src={walletImage}
//                   alt="Logo"
//                   // width={100}
//                   // height={100}
//                   className="lg:w-10 lg:h-10 md:h-6 md:w-6 w-6 h-6 mr-1 lg:-mr-1 "
//                 />
//                 Balance
//               </button>

//               {balanceOpen && (
//                 <div
//                   ref={balanceRef}
//                   className="absolute -right-2 h-42  mt-2 w-40 text-center p-2 bg-gradient-to-r  from-cyan-500 to-blue-500 text-black rounded-3xl  shadow-lg"
//                 >
//                   <div>Your Balance </div>
//                   <div className="flex justify-center  ">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke-width="1.5"
//                       stroke="currentColor"
//                       className="pt-1 size-6"
//                     >
//                       <path
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//                       />
//                     </svg>
//                     <p className="text-lg font-bold">{userDetails?.balance}</p>
//                   </div>
//                   <div className="mt-2 text-white">
//                     <button className="bg-orange-600 p-2  rounded-3xl w-32 hover:bg-orange-500">
//                       Add Money
//                     </button>
//                     <button className="bg-orange-600 p-2 mt-2  w-32 rounded-3xl hover:bg-orange-500">
//                       WithDraw
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//               <div>
//               <button
//               type="button"
//               className="  flex text-sm rounded-full md:me-0 border-2 bg-blue-700 text-white"
//               id="user-menu-button"
//               aria-expanded="false"
//               data-dropdown-toggle="user-dropdown"
//               data-dropdown-placement="bottom"
//               onClick={toggleDropdown}
//               ref={buttonRef}
//             >
//               <span className="sr-only">Open user menu</span>

//               <div className="w-8 h-8 lg:w-10 lg:h-10 font-medium text-lg rounded-full flex justify-center flex-col bg-gradient-to-r from-cyan-500 to-blue-500 ... text-blue-900  hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ...">
//                 P
//               </div>
//             </button>
//               </div>

//             {dropdownOpen && (
//               <div
//                 ref={dropdownRef}
//                 id="dropdown"
//                 className="absolute right-5 top-16 z-10 bg-gradient-to-r text-black from-cyan-500 to-blue-500 ... divide-y  divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-100"
//               >
//                 <ul
//                   className="py-2  rounded-lg text-sm text-black shadow-2xl"
//                   aria-labelledby="dropdownDefaultButton"
//                 >
//                   <li>
//                     <button
//                       onClick={() => {
//                         router.push("/dashboard");
//                         setDropdownOpen(false);
//                       }}
//                       className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
//                     >
//                       Home
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         router.push("/profile");
//                         setDropdownOpen(false);
//                       }}
//                       className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
//                     >
//                       Profile
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         router.push("/dashboard");
//                         setDropdownOpen(false);
//                       }}
//                       className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
//                     >
//                       Settings
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={() => {
//                         router.push("/dashboard");
//                         setDropdownOpen(false);
//                       }}
//                       className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
//                     >
//                       About Us
//                     </button>
//                   </li>
//                   <li>
//                     <button
//                       onClick={handleSignOut}
//                       className="block px-4 py-2 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ... w-full text-start"
//                     >
//                       Sign out
//                     </button>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import { getCombinedData } from "../fetchData/fetchuserdata";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import walletImage from "../../../public/app/wallet.png";
import axios from "axios";

export default function DashAppbar() {
  const [data, setData] = useState(null);
  const router = useRouter();

  const dropdownRef = useRef(null);
  const balanceRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const buttonRef = useRef(null);
  const buttonRef2 = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetching user data
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

 // Handle clicks outside dropdown or balance popover
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      balanceOpen &&
      balanceRef.current &&
      !balanceRef.current.contains(event.target) &&
      !buttonRef2.current?.contains(event.target)
    ) {
      setBalanceOpen(false);
    }

    // Check if the click is outside the dropdown or button
    if (
      dropdownOpen &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      !buttonRef.current?.contains(event.target)
    ) {
      setDropdownOpen(false); // Close dropdown when clicking outside
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [dropdownOpen, balanceOpen]);

  const balanceButton = (event) => {
    event.stopPropagation();
    setBalanceOpen(!balanceOpen);
  };

  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevents the event from bubbling up and triggering other handlers
    setDropdownOpen((prev) => !prev); // Toggle the dropdown state
  };

  const handleSignOut = async () => {
    const { userDetails } = data;
    if (!userDetails?.username) {
      console.error("User username not found");
      return;
    }

    try {
      const response = await axios.post("/api/signout", {
        username: userDetails?.username,
      });

      if (response.status !== 200) {
        console.error("Failed to sign out");
        return;
      }

      router.push("/");
      console.log("Sign-out successful");
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  // if (!data) return <div>Loading...</div>;

  const { userDetails } = data || {};


  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 py-1 lg:py-2 pl-3 w-screen shadow z-50 ${
          isScrolled
            ? "bg-gradient-to-b from-zinc-950 to-transparent"
            : "bg-black"
        }`}
      >
        <div className="flex items-center justify-between w-full px-8">
          {/* Left side: Logo */}
          <div className="flex items-center">
            <button
              onClick={() => {
                router.push("/dashboard");
              }}
              className="text-xl ml-8 lg:text-3xl font-ubuntu font-medium lg:font-semibold opacity-80 text-white"
            >
              <span>ProfitONN</span>
            </button>
          </div>

          {/* Right side: User components */}
          <div className="flex items-center gap-8 mr-8 mt-1">
            <div className="w-[30px] h-[16px] mr-8 -mt-4 cursor-pointer">
              <div className="relative">
                <svg
                  className="w-10 h-10 text-white animate-wiggle"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 21"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.585 15.5H5.415A1.65 1.65 0 0 1 4 13a10.526 10.526 0 0 0 1.5-5.415V6.5a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1.085c0 1.907.518 3.78 1.5 5.415a1.65 1.65 0 0 1-1.415 2.5zm1.915-11c-.267-.934-.6-1.6-1-2s-1.066-.733-2-1m-10.912 3c.209-.934.512-1.6.912-2s1.096-.733 2.088-1M13 17c-.667 1-1.5 1.5-2.5 1.5S8.667 18 8 17"
                  />
                </svg>
                <div className="px-1 bg-indigo-700 rounded-full text-center text-white text-sm absolute -top-2 -end-2">
                  3
                  <div class="absolute top-0 start-0 rounded-full -z-10 animate-ping bg-teal-200 w-full h-full"></div>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={balanceButton}
                ref={buttonRef2}
                className="w-28 rounded-lg lg:w-36 lg:gap-x-5 p-3 lg:p-5 h-12 text-white bg-indigo-700 font-bold text-lg flex items-center justify-center relative transition duration-300 ease-in-out transform hover:scale-105"
              >
                <Image
                  src={walletImage}
                  alt="Wallet"
                  className="lg:w-10 lg:h-10 md:h-6 md:w-6 w-6 h-6 mr-1 lg:-mr-1"
                />
                Balance
              </button>

              {balanceOpen && (
  <div
    ref={balanceRef}
    className="absolute -right-8 mt-4 top-10 w-48 p-3 bg-slate-950 from-gray-800 via-gray-700 to-gray-600 text-white rounded-lg shadow-md border border-gray-600 "
  >
    <div className="text-xs font-medium text-gray-300 text-center mb-2">Your Balance</div>
    <div className="flex gap-x-1 justify-center items-center  mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <p className="text-xl font-semibold">{userDetails?.balance}</p>
    </div>
    <div className="space-y-3">
      <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all duration-150 transform hover:scale-105">
        <p className="text-sm font-medium">Add Money</p>
      </button>
      <button className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-150 transform hover:scale-105">
        <p className="text-sm font-medium">Withdraw</p>
      </button>
    </div>
  </div>
)}
            </div>

            <div className="flex flex-col justify-center">
            <button
              type="button"
              className={`w-14 h-12 relative focus:outline-none bg-indigo-700 rounded transition duration-300 ease-in-out transform ${
                dropdownOpen ? 'scale-105' : ''
              } hover:scale-105`}
              onClick={toggleDropdown}
              ref={buttonRef}
            >
                <div className="block w-5 absolute left-6 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span
                    className="block absolute h-1 w-7 text-white bg-current transform transition duration-500 ease-in-out"
                    style={{ transform: dropdownOpen ? "rotate(45deg)" : "" }}
                  />
                  <span
                    className="block absolute h-1 w-5 text-white bg-current transform transition duration-500 ease-in-out"
                    style={{ opacity: dropdownOpen ? 0 : 1 }}
                  />
                  <span
                    className="block absolute h-1 w-7 text-white bg-current transform transition duration-500 ease-in-out"
                    style={{ transform: dropdownOpen ? "rotate(-45deg)" : "" }}
                  />
                </div>
              </button>
            </div>
            {dropdownOpen && (
  <div
    ref={dropdownRef}
    className="absolute right-8 top-16 z-20 bg-slate-950 divide-y divide-gray-700 rounded-lg shadow-lg w-48 transition-transform duration-300 transform opacity-100 scale-100  border border-gray-600"
  >
    <ul className="py-2 text-white text-sm font-medium">
      <li>
        <button
          onClick={() => {
            router.push("/dashboard");
            setDropdownOpen(false);
          }}
          className="block px-4 py-3 hover:bg-indigo-700 rounded-lg w-full text-left transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Home
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            router.push("/profile");
            setDropdownOpen(false);
          }}
          className="block px-4 py-3 hover:bg-indigo-700 rounded-lg w-full text-left transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Profile
        </button>
      </li>
      <li>
        <button
          onClick={() => {
            router.push("/settings");
            setDropdownOpen(false);
          }}
          className="block px-4 py-3 hover:bg-indigo-700 rounded-lg w-full text-left transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Settings
        </button>
      </li>
      <li>
        <button
          onClick={handleSignOut}
          className="block px-4 py-3 hover:bg-indigo-700 rounded-lg w-full text-left transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Sign Out
        </button>
      </li>
    </ul>
  </div>
)}

          </div>
        </div>
      </nav>
    </div>
  );
}
