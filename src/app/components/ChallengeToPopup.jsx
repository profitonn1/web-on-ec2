// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const ChallengeToPopup = ({ data, data2, onClick }) => {
//   const router = useRouter();
//   const modalRef = useRef(null); // Reference for the modal container
//   const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
//   const [opponentUsername, setOpponentUsername] = useState("");

//   const [selectedRange, setSelectedRange] = useState({
//     betStartRange2: null,
//     betEndRange2: null,
//     askStartRange2: null,
//     askEndRange2: null,
//     challengeToname: null,
//   });

//   const goToNextChallenge = () => {
//     setCurrentChallengeIndex((prevIndex) => (prevIndex + 1) % data.length);

//     setSelectedRange({
//       betStartRange2: null,
//       betEndRange2: null,
//       askStartRange2: null,
//       askEndRange2: null,
//       challengeToname: null,
//     });
//   };

//   const goToPreviousChallenge = () => {
//     if (currentChallengeIndex >= 1) {
//       setCurrentChallengeIndex((prevIndex) => (prevIndex - 1) % data.length);
//     }
//     setSelectedRange({
//       betStartRange2: null,
//       betEndRange2: null,
//       askStartRange2: null,
//       askEndRange2: null,
//       challengeToname: null,
//     });
//   };

//   function getCookieValue(name) {
//     const match = document.cookie.match(
//       new RegExp("(^| )" + name + "=([^;]+)")
//     );
//     if (match) return match[2];
//     return null;
//   }

//   // Sending backend request to calculate intersection in the ranges of the prices set for bid and ask by the user and the opponent
//   const commonRangeData = async () => {
//     try {
//       const userDetailsCookie = getCookieValue("userDetails");

//       if (!userDetailsCookie) {
//         alert("User not authenticated. Please log in.");
//         return;
//       }

//       const decodedUserDetails = decodeURIComponent(userDetailsCookie);
//       const parsedUserDetails = JSON.parse(decodedUserDetails);

//       // Debugging line to check what is being sent
//       console.log(parsedUserDetails.id); // Ensure the id and username are correct

//       const response = await axios.post(
//         "/api/game/matchChallenger",
//         {
//           data: data[currentChallengeIndex],
//           data2: data2[currentChallengeIndex],
//           id: parsedUserDetails.id, // userId
//           username: parsedUserDetails.username, // username
//         },
//         {
//           withCredentials: true, // Ensure cookies are sent with the request
//         }
//       );

//       if (response.status === 201) {
//         setOpponentUsername(response.data.opponentUsername); // Set opponent's username
//         alert(
//           `You are Paired with ${response.data.opponentUsername}`
//         );
//         router.push("/terminal");
//       }
//     } catch (error) {
//       console.error("Error during challenge:", error);

//       // Check if error response contains the specific "No Common Price Range" message
//       if (
//         error.response &&
//         error.response.data.msg === "No Common Price Range"
//       ) {
//         alert("No common range found, please re-enter your bet and ask.");
//       } else {
//         alert("An error occurred: " + error.message);
//       }

//       // Log error details for debugging
//       if (error.response) {
//         console.error("Error response status:", error.response.status);
//         console.error("Error response data:", error.response.data);
//       }
//     }
//   };

//   // Handle click outside the modal
//   const handleClickOutside = (event) => {
//     if (modalRef.current && !modalRef.current.contains(event.target)) {
//       onClick(); // Close the modal (or any other function you want)
//     }
//   };

//   useEffect(() => {
//     // Add event listener for clicking outside
//     document.addEventListener("mousedown", handleClickOutside);

//     // Cleanup event listener on component unmount
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div>
//       {/* Overlay backdrop */}
//       <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-md z-40" />

//       {/* Modal container */}
//       <div
//         ref={modalRef}
//         className="fixed top-1/2 left-1/2 z-50 w-4/6 max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-lg shadow-lg p-4 glow-effect"
//       >
//         {data.length > 0 && (
//           <div className="flex flex-col items-center">
//             <div className="text-center mb-4">
//               <h1 className="text-2xl font-medium text-white">
//                 Challenge Sent to
//                 <p className="font-semibold mt- text-[#FFEB00]">
//                   {data[currentChallengeIndex]?.challengeToname.toUpperCase()}{" "}
//                   🗡️
//                 </p>
//               </h1>
//             </div>

//             {/* Display opponent's username */}
//             {opponentUsername && (
//               <p className="font-bold text-yellow-400">
//                 Paired with: {opponentUsername}
//               </p>
//             )}

//             <div className="text-center text-white">
//               <div className="font-bold mb-4 mt-4">
//                 <div className="flex justify-center gap-x-2">
//                   <p>
//                     Bet Start Price:{" "}
//                     {data[currentChallengeIndex]?.betStartRange}
//                   </p>
//                   <p>
//                     Bet End Price: {data[currentChallengeIndex]?.betEndRange}
//                   </p>
//                 </div>
//                 <div className="flex justify-center gap-x-2">
//                   <p>
//                     Ask Start Price:{" "}
//                     {data[currentChallengeIndex]?.askStartRange}
//                   </p>
//                   <p>
//                     Ask End Price: {data[currentChallengeIndex]?.askEndRange}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Check if data2 exists and render accordingly */}
//             {data2 &&
//             data2.length > 0 &&
//             data2[currentChallengeIndex] != null ? (
//               <div className="text-center text-yellow-400 font-bold mb-4">
//                 <p className="text-xl">
//                   {"@"+data[currentChallengeIndex]?.challengeToname +" Sent a minimum Ask of: "}
//                 </p>
//                 <span className="text-2xl">{data2[currentChallengeIndex]?.betStartRange2}</span>
//                 <div className="mt-5">
//                   <button
//                     className="bg-indigo-700 hover:bg-indigo-500 p-2 w-32 text-white text-base rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
//                     onClick={commonRangeData}
//                   >
//                     Accept
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="mt-2 font-semibold text-lg text-center text-blue-300 opacity-65">
//                 <h2>
//                   Waiting for{" "}
//                   <span className="text-[#FFEB00]">
//                     {data[currentChallengeIndex]?.challengeToname}
//                   </span>{" "}
//                   to send ask range
//                 </h2>
//                 <br />
//                 <a
//                   href="/bstartgame"
//                   className="text-base underline text-[#FFDB00] font-medium"
//                 >
//                   (Reload the page once)
//                 </a>
//               </div>
//             )}

//             {/* Navigation buttons */}
//             {data.length > 1 && (
//               <div className="flex gap-x-5 mt-4">
//                 <button
//                   className="w-28 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
//                   onClick={goToPreviousChallenge}
//                 >
//                   Previous
//                 </button>
//                 <button
//                   className="w-28 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
//                   onClick={goToNextChallenge}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Glow effect */}
//       <style jsx>{`
//         @keyframes glow {
//           0% {
//             box-shadow: 0 0 15px rgba(255, 255, 255, 0.4),
//               0 0 20px rgba(255, 255, 255, 0.3),
//               0 0 25px rgba(255, 255, 255, 0.2),
//               0 0 30px rgba(255, 255, 255, 0.1);
//           }
//           50% {
//             box-shadow: 0 0 25px rgba(255, 255, 255, 0.5),
//               0 0 30px rgba(255, 255, 255, 0.4),
//               0 0 35px rgba(255, 255, 255, 0.3),
//               0 0 40px rgba(255, 255, 255, 0.2);
//           }
//           100% {
//             box-shadow: 0 0 15px rgba(255, 255, 255, 0.4),
//               0 0 20px rgba(255, 255, 255, 0.3),
//               0 0 25px rgba(255, 255, 255, 0.2),
//               0 0 30px rgba(255, 255, 255, 0.1);
//           }
//         }

//         .glow-effect {
//           animation: glow 1.5s infinite alternate;
//           border-radius: 12px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChallengeToPopup;

"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const ChallengeToPopup = ({ data, data2, onClick }) => {
  const router = useRouter();
  const modalRef = useRef(null); // Reference for the modal container
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [opponentUsername, setOpponentUsername] = useState("");

  const [selectedRange, setSelectedRange] = useState({
    betStartRange2: null,
    betEndRange2: null,
    askStartRange2: null,
    askEndRange2: null,
    challengeToname: null,
  });

  const goToNextChallenge = () => {
    setCurrentChallengeIndex((prevIndex) => (prevIndex + 1) % data.length);

    setSelectedRange({
      betStartRange2: null,
      betEndRange2: null,
      askStartRange2: null,
      askEndRange2: null,
      challengeToname: null,
    });
  };

  const goToPreviousChallenge = () => {
    if (currentChallengeIndex >= 1) {
      setCurrentChallengeIndex((prevIndex) => (prevIndex - 1) % data.length);
    }
    setSelectedRange({
      betStartRange2: null,
      betEndRange2: null,
      askStartRange2: null,
      askEndRange2: null,
      challengeToname: null,
    });
  };

  function getCookieValue(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }

  // Sending backend request to calculate intersection in the ranges of the prices set for bid and ask by the user and the opponent
  const commonRangeData = async () => {
    try {
      const userDetailsCookie = getCookieValue("userDetails");

      if (!userDetailsCookie) {
        alert("User not authenticated. Please log in.");
        return;
      }

      const decodedUserDetails = decodeURIComponent(userDetailsCookie);
      const parsedUserDetails = JSON.parse(decodedUserDetails);

      // Debugging line to check what is being sent
      console.log(parsedUserDetails.id); // Ensure the id and username are correct

      const response = await axios.post(
        "/api/game/matchChallenger",
        {
          data: data[currentChallengeIndex],
          data2: data2[currentChallengeIndex],
          userId: parsedUserDetails.id, // userId
          username: parsedUserDetails.username, // username
        },
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );

      if (response.status === 201) {
        setOpponentUsername(response.data.opponentUsername); // Set opponent's username
        alert(
          `You are Paired with ${response.data.opponentUsername}`
        );
        console.log(parsedUserDetails);
        console.log(response.data);
        // Save challenge history in the backend
        await saveChallengeHistory(parsedUserDetails, response.data);

        // Redirect both users to the terminal page
        router.push("/terminal"); // <-- This ensures redirection happens here after "Accept"
      }
    } catch (error) {
      console.error("Error during challenge:", error);

      if (
        error.response &&
        error.response.data.msg === "No Common Price Range"
      ) {
        alert("No common range found, please re-enter your bet and ask.");
      } else {
        alert("An error occurred: " + error.message);
      }

      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);
      }
    }
  };
  

  // Frontend function to save challenge history
const saveChallengeHistory = async (userDetails, opponentDetails) => {
  try {
    const challengeHistoryData = {
      player1: userDetails.username,
      player2: opponentDetails.opponentUsername,
      player1Bet: parseFloat(data[currentChallengeIndex]?.betStartRange),
      player2Bet: parseFloat(data2[currentChallengeIndex]?.betStartRange2),
      date: new Date(),
    };
    
    console.log("Challenge History Data sent to API:", challengeHistoryData);
    

    // Send data to the backend to save it in the database
    const challengeHistoryResponse = await axios.post("/api/game/saveChallengeHistory", challengeHistoryData);

    if (challengeHistoryResponse.status === 201) {
      console.log("Challenge history saved successfully!");
    } else {
      console.error("Failed to save challenge history.");
    }
  } catch (error) {
    console.error("Error saving challenge history:", error);
  }
};


  // Handle click outside the modal
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClick(); // Close the modal (or any other function you want)
    }
  };

  useEffect(() => {
    // Add event listener for clicking outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-md z-40" />

      {/* Modal container */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 z-50 w-4/6 max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-lg shadow-lg p-4 glow-effect"
      >
        {data.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-medium text-white">
                Challenge Sent to
                <p className="font-semibold mt- text-[#FFEB00]">
                  {data[currentChallengeIndex]?.challengeToname.toUpperCase()}{" "}
                  🗡️
                </p>
              </h1>
            </div>

            {/* Display opponent's username */}
            {opponentUsername && (
              <p className="font-bold text-yellow-400">
                Paired with: {opponentUsername}
              </p>
            )}

            <div className="text-center text-white">
              <div className="font-bold mb-4 mt-4">
                <div className="flex justify-center gap-x-2">
                  <p>
                    Bet Start Price:{" "}
                    {data[currentChallengeIndex]?.betStartRange}
                  </p>
                  <p>
                    Bet End Price: {data[currentChallengeIndex]?.betEndRange}
                  </p>
                </div>
                <div className="flex justify-center gap-x-2">
                  <p>
                    Ask Start Price:{" "}
                    {data[currentChallengeIndex]?.askStartRange}
                  </p>
                  <p>
                    Ask End Price: {data[currentChallengeIndex]?.askEndRange}
                  </p>
                </div>
              </div>
            </div>

            {/* Check if data2 exists and render accordingly */}
            {data2 &&
            data2.length > 0 &&
            data2[currentChallengeIndex] != null ? (
              <div className="text-center text-yellow-400 font-bold mb-2">
                <p className="text-xl">
                  {"@"+data[currentChallengeIndex]?.challengeToname +" Sent a minimum Ask of: "}
                </p>
                <span className="text-2xl">{data2[currentChallengeIndex]?.betStartRange2}</span>
                <div className="mt-5">
                  <button
                    className="bg-indigo-700 hover:bg-indigo-500 p-2 w-32 text-white text-base rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={commonRangeData}
                  >
                    Accept
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 font-semibold text-lg text-center text-blue-300 opacity-65">
                <h2>
                  Waiting for{" "}
                  <span className="text-[#FFEB00]">
                    {data[currentChallengeIndex]?.challengeToname}
                  </span>{" "}
                  to send ask range
                </h2>
                <br />
                <a
                  href="/bstartgame"
                  className="text-base underline text-[#FFDB00] font-medium"
                >
                  (Reload the page once)
                </a>
              </div>
            )}

            {/* Navigation buttons */}
            {data.length > 1 && (
              <div className="flex justify-center gap-x-4 mb-4">
                <button
                  className="w-28 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
                  onClick={goToPreviousChallenge}
                >
                  Previous
                </button>
                <button
                  className="w-28 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
                  onClick={goToNextChallenge}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Glow effect */}
      <style jsx>{`
        @keyframes glow {
          0% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.4),
              0 0 20px rgba(255, 255, 255, 0.3),
              0 0 25px rgba(255, 255, 255, 0.2),
              0 0 30px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 25px rgba(255, 255, 255, 0.5),
              0 0 30px rgba(255, 255, 255, 0.4),
              0 0 35px rgba(255, 255, 255, 0.3),
              0 0 40px rgba(255, 255, 255, 0.2);
          }
          100% {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.4),
              0 0 20px rgba(255, 255, 255, 0.3),
              0 0 25px rgba(255, 255, 255, 0.2),
              0 0 30px rgba(255, 255, 255, 0.1);
          }
        }

        .glow-effect {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ChallengeToPopup;
