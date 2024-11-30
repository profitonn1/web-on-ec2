// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { z } from "zod";
// import axios from "axios";
// import { useRouter } from "next/navigation";  // Correct import for Next.js 13+

// // Define the Zod schema
// const bchallengeRangeSchema = z.object({
//   betStartRange2: z
//     .number()
//     .min(50, { message: "Bet Start Range must be between 50 and 200" })
//     .max(200, { message: "Bet Start Range must be between 50 and 200" }),
//   betEndRange2: z
//     .number()
//     .min(50, { message: "Bet End Range must be between 50 and 200" })
//     .max(200, { message: "Bet End Range must be between 50 and 200" }),
//   askStartRange2: z
//     .number()
//     .min(50, { message: "Ask Start Range must be between 50 and 200" })
//     .max(200, { message: "Ask Start Range must be between 50 and 200" }),
//   askEndRange2: z
//     .number()
//     .min(50, { message: "Ask End Range must be between 50 and 200" })
//     .max(200, { message: "Ask End Range must be between 50 and 200" }),
// });

// const ChallengeByPopup = ({ data, onClick }) => {
//   const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
//   const [selectedRange, setSelectedRange] = useState({
//     betStartRange2: 50,
//     betEndRange2: 50,
//     askStartRange2: 0,
//     askEndRange2: 0,
//   });

//   const modalRef = useRef(null);
//   const router = useRouter();  // Initialize the router here

//   const goToNextChallenge = () => {
//     setCurrentChallengeIndex((prevIndex) => (prevIndex + 1) % data.length);
//     resetSelectedRange();
//   };

//   const goToPreviousChallenge = () => {
//     setCurrentChallengeIndex(
//       (prevIndex) => (prevIndex - 1 + data.length) % data.length
//     );
//     resetSelectedRange();
//   };

//   const resetSelectedRange = () => {
//     setSelectedRange({
//       betStartRange2: 50,
//       betEndRange2: 50,
//       askStartRange2: 0,
//       askEndRange2: 0,
//     });
//   };

//   useEffect(() => {
//     setSelectedRange((prev) => ({
//       ...prev,
//       askStartRange2: Math.min(prev.betStartRange2 * 0.7, 200),
//     }));
//   }, [selectedRange.betStartRange2]);

//   useEffect(() => {
//     setSelectedRange((prev) => ({
//       ...prev,
//       askEndRange2: Math.min(prev.betEndRange2 * 0.7, 200),
//     }));
//   }, [selectedRange.betEndRange2]);

//   const getCookieValue = (name) => {
//     const match = document.cookie.match(
//       new RegExp("(^| )" + name + "=([^;]+)")
//     );
//     return match ? match[2] : null;
//   };

//   const onSubmit = async () => {
//     try {
//       const userDetailsCookie = getCookieValue("userDetails");

//       if (userDetailsCookie) {
//         const decodedUserDetails = decodeURIComponent(userDetailsCookie);
//         const parsedUserDetails = JSON.parse(decodedUserDetails);
//         console.log("hello");
//         console.log(parsedUserDetails);
//         console.log(data[currentChallengeIndex]);
//         const validationResult = bchallengeRangeSchema.safeParse(selectedRange);

//         if (validationResult.success) {
//           const challengeSentBackend = await axios.post(
//             "/api/game/resendChallengeRange",
//             {
//               betStartRange2: String(selectedRange.betStartRange2),
//               betEndRange2: String(selectedRange.betEndRange2),
//               askStartRange2: String(selectedRange.askStartRange2),
//               askEndRange2: String(selectedRange.askEndRange2),
//               challengedby: data[currentChallengeIndex]?.challengerName,
//             },
//             {
//               params: {
//                 id: parsedUserDetails.id,
//                 username: parsedUserDetails.username,
//               },
//               withCredentials: true,
//             }
//           );

//           if (challengeSentBackend.status === 201) {
//             alert("Data Sent, Wait!!!");
//             onClick();
//           }
//           router.push("/terminal"); // Use the router to navigate to the terminal page
//         } else {
//           alert("Please enter all values correctly!");
//         }
//       }
//     } catch (error) {
//       alert("Challenge already sent");
//       console.log(error);
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (modalRef.current && !modalRef.current.contains(event.target)) {
//       onClick();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <>
//       <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-md z-40" />
//       <div
//         ref={modalRef}
//         className="fixed top-1/2 left-1/2 z-50 w-4/6 max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-lg shadow-lg p-4 glow-effect"
//       >
//         {data.length > 0 && (
//           <>
//             <h1 className="text-center font-mono text-2xl font-extrabold text-white mb-4">
//               Select Bet Amount
//             </h1>
//             <div className="text-center text-yellow-400">
//               <p className="font-bold">
//                 &lt;{data[currentChallengeIndex]?.challengerName}&gt; sent a
//                 challenge to You
//               </p>
//               <div className="font-bold text-white">
//                 Ranking - {data[currentChallengeIndex]?.ranking}
//               </div>
//             </div>
//             <div className="my-4">
//               <h2 className="font-mono text-white">
//                 Bet Amount:{" "}
//                 <span className="font-bold">{selectedRange.betStartRange2}</span>
//               </h2>
//               <input
//                 type="range"
//                 min="50"
//                 max="200"
//                 value={selectedRange.betStartRange2}
//                 onChange={(e) =>
//                   setSelectedRange((prev) => ({
//                     ...prev,
//                     betStartRange2: Number(e.target.value),
//                   }))
//                 }
//                 className="w-full"
//               />
//             </div>
//             <div className="my-4">
//               <h2 className="font-mono text-white">
//                 Max Bet Amount:{" "}
//                 <span className="font-bold">{selectedRange.betEndRange2}</span>
//               </h2>
//               <input
//                 type="range"
//                 min="50"
//                 max="200"
//                 value={selectedRange.betEndRange2}
//                 onChange={(e) =>
//                   setSelectedRange((prev) => ({
//                     ...prev,
//                     betEndRange2: Number(e.target.value),
//                   }))
//                 }
//                 className="w-full"
//               />
//             </div>
//             <div className="my-4">
//               <h2 className="font-mono text-white">
//                 Ask Amount:{" "}
//                 <span className="font-bold">{selectedRange.askStartRange2}</span>
//               </h2>
//               <input
//                 type="range"
//                 min="50"
//                 max="200"
//                 value={selectedRange.askStartRange2}
//                 disabled
//                 className="w-full"
//               />
//             </div>
//             <div className="my-4">
//               <h2 className="font-mono text-white">
//                 Max Ask Amount:{" "}
//                 <span className="font-bold">{selectedRange.askEndRange2}</span>
//               </h2>
//               <input
//                 type="range"
//                 min="50"
//                 max="200"
//                 value={selectedRange.askEndRange2}
//                 disabled
//                 className="w-full"
//               />
//             </div>
//             <div className="flex gap-x-2">
//               <button
//                 onClick={onSubmit}
//                 className="mt-4 w-[30%] bg-blue-700 hover:bg-blue-800 text-white p-2 rounded"
//               >
//                 Submit
//               </button>
//               <button
//                 onClick={onClick}
//                 className="mt-4 w-[30%] bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
//               >
//                 Close
//               </button>
//             </div>
//             {data.length > 1 && (
//               <div className="flex gap-x-2 mt-4">
//                 <button
//                   className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
//                   onClick={goToPreviousChallenge}
//                 >
//                   Previous
//                 </button>
//                 <button
//                   className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
//                   onClick={goToNextChallenge}
//                 >
//                   Next
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// };
 
// export default ChallengeByPopup;


"use client";

import React, { useState, useEffect, useRef } from "react";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";  // Correct import for Next.js 13+

// Define the Zod schema
const bchallengeRangeSchema = z.object({
  betStartRange2: z
    .number()
    .min(50, { message: "Bet Start Range must be between 50 and 200" })
    .max(200, { message: "Bet Start Range must be between 50 and 200" }),
  betEndRange2: z
    .number()
    .min(50, { message: "Bet End Range must be between 50 and 200" })
    .max(200, { message: "Bet End Range must be between 50 and 200" }),
  askStartRange2: z
    .number()
    .min(50, { message: "Ask Start Range must be between 50 and 200" })
    .max(200, { message: "Ask Start Range must be between 50 and 200" }),
  askEndRange2: z
    .number()
    .min(50, { message: "Ask End Range must be between 50 and 200" })
    .max(200, { message: "Ask End Range must be between 50 and 200" }),
});

const ChallengeByPopup = ({ data, onClick }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedRange, setSelectedRange] = useState({
    betStartRange2: 50,
    betEndRange2: 50,
    askStartRange2: 0,
    askEndRange2: 0,
  });

  const modalRef = useRef(null);
  const router = useRouter();  // Initialize the router here

  const goToNextChallenge = () => {
    setCurrentChallengeIndex((prevIndex) => (prevIndex + 1) % data.length);
    resetSelectedRange();
  };

  const goToPreviousChallenge = () => {
    setCurrentChallengeIndex(
      (prevIndex) => (prevIndex - 1 + data.length) % data.length
    );
    resetSelectedRange();
  };

  const resetSelectedRange = () => {
    setSelectedRange({
      betStartRange2: 50,
      betEndRange2: 50,
      askStartRange2: 0,
      askEndRange2: 0,
    });
  };

  useEffect(() => {
    setSelectedRange((prev) => ({
      ...prev,
      askStartRange2: Math.min(prev.betStartRange2 * 0.7, 200),
    }));
  }, [selectedRange.betStartRange2]);

  useEffect(() => {
    setSelectedRange((prev) => ({
      ...prev,
      askEndRange2: Math.min(prev.betEndRange2 * 0.7, 200),
    }));
  }, [selectedRange.betEndRange2]);

  const getCookieValue = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  const onSubmit = async () => {
    try {
      const userDetailsCookie = getCookieValue("userDetails");
  
      if (userDetailsCookie) {
        const decodedUserDetails = decodeURIComponent(userDetailsCookie);
        const parsedUserDetails = JSON.parse(decodedUserDetails);
  
        const validationResult = bchallengeRangeSchema.safeParse(selectedRange);
  
        if (validationResult.success) {
          // Send challenge data to backend
          const challengeSentBackend = await axios.post(
            "/api/game/resendChallengeRange",
            {
              betStartRange2: String(selectedRange.betStartRange2),
              betEndRange2: String(selectedRange.betEndRange2),
              askStartRange2: String(selectedRange.askStartRange2),
              askEndRange2: String(selectedRange.askEndRange2),
              challengedby: data[currentChallengeIndex]?.challengerName,
            },
            {
              params: {
                id: parsedUserDetails.id,
                username: parsedUserDetails.username,
              },
              withCredentials: true,
            }
          );
  
          if (challengeSentBackend.status === 201) {
            alert("Data Sent, Wait!!!");
            onClick();
          }
  
          // Start polling for pairing status
          pollForPairing(parsedUserDetails.id);
        } else {
          alert("Please enter all values correctly!");
        }
      }
    } catch (error) {
      alert("Challenge already sent");
      console.log(error);
    }
  };
  
  // Polling for pairing status
  const pollForPairing = (userId) => {
    const intervalId = setInterval(async () => {
      try {
        // Call the API to check if the challenge has been paired
        const response = await axios.post("/api/game/checkChallengePaired", null, {
          params: { id: userId },
        });
  
        if (response.data.paired) {
          clearInterval(intervalId); // Stop polling once paired
          router.push("/terminal"); // Redirect to the terminal once paired
        }
      } catch (error) {
        console.error("Error checking pairing status", error);
        clearInterval(intervalId); // Stop polling in case of error
      }
    }, 5000); // Poll every 5 seconds
  };  

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClick();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return ( 
    <>
      <div className="fixed inset-0 glow-effect bg-black opacity-50 backdrop-blur-md z-40" />
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 z-50 w-4/6 max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-lg shadow-lg p-4 glow-effect"
      >
        {data.length > 0 && (
          <>
            <h1 className="text-center font-mono text-2xl font-extrabold text-white mb-4">
              Select Bet Amount
            </h1>
            <div className="text-center text-yellow-400">
              <p className="font-bold">
                &lt;{data[currentChallengeIndex]?.challengerName}&gt; sent a
                challenge to You
              </p>
              <div className="font-bold text-white">
                Ranking - {data[currentChallengeIndex]?.ranking}
              </div>
            </div>
            <div className="my-4">
              <h2 className="font-mono text-white">
                Bet Amount:{" "}
                <span className="font-bold">{selectedRange.betStartRange2}</span>
              </h2>
              <input
                type="range"
                min="50"
                max="200"
                value={selectedRange.betStartRange2}
                onChange={(e) =>
                  setSelectedRange((prev) => ({
                    ...prev,
                    betStartRange2: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>
            <div className="my-4">
              <h2 className="font-mono text-white">
                Max Bet Amount:{" "}
                <span className="font-bold">{selectedRange.betEndRange2}</span>
              </h2>
              <input
                type="range"
                min="50"
                max="200"
                value={selectedRange.betEndRange2}
                onChange={(e) =>
                  setSelectedRange((prev) => ({
                    ...prev,
                    betEndRange2: Number(e.target.value),
                  }))
                }
                className="w-full"
              />
            </div>
            <div className="my-4">
              <h2 className="font-mono text-white">
                Ask Amount:{" "}
                <span className="font-bold">{selectedRange.askStartRange2}</span>
              </h2>
              <input
                type="range"
                min="50"
                max="200"
                value={selectedRange.askStartRange2}
                disabled
                className="w-full"
              />
            </div>
            <div className="my-4">
              <h2 className="font-mono text-white">
                Max Ask Amount:{" "}
                <span className="font-bold">{selectedRange.askEndRange2}</span>
              </h2>
              <input
                type="range"
                min="50"
                max="200"
                value={selectedRange.askEndRange2}
                disabled
                className="w-full"
              />
            </div>
            <div className="flex justify-center gap-x-4 mb-2">
              <button
                onClick={onSubmit}
                className="mt-4 w-[30%] font-mono transition duration-300 ease-in-out transform hover:scale-105 bg-indigo-700 hover:bg-indigo-500 text-white p-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={onClick}
                className="mt-4 w-[30%] bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
              >
                Close
              </button>
            </div>
            {data.length > 1 && (
              <div className="flex gap-x-2 mt-4">
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
                  onClick={goToPreviousChallenge}
                >
                  Previous
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
                  onClick={goToNextChallenge}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
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
    </>
  );
};

export default ChallengeByPopup;



