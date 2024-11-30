"use client";
import { useState, useRef, useEffect } from "react";
import BasicChallengeButton from "./BasicButton";
import axios from "axios";
import { z } from "zod";

export default function Popup2() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [selectUsername, setSelectUsername] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [betStartRange, setBetStartRange] = useState(50);
  const [betEndRange, setBetEndRange] = useState(50);
  const [askStartRange, setAskStartRange] = useState(50);
  const [askEndRange, setAskEndRange] = useState(50);

  // Update ask ranges when bet ranges change
  useEffect(() => {
    setAskStartRange(Math.min(betStartRange * 1.5, 200));
  }, [betStartRange]);

  const handleItemClick = (username) => {
    setSelectUsername(username);
  };
  useEffect(() => {
    setAskEndRange(Math.min(betEndRange * 1.5, 200));
  }, [betEndRange]);

  const bchallengeRangeSchema = z.object({
    betStartRange: z.number().min(50).max(200),
    betEndRange: z.number().min(50).max(200),
    askStartRange: z.number().min(50).max(200),
    askEndRange: z.number().min(50).max(200),
  });

  const fetchData = async (e) => {
    e.preventDefault();

    const validation = bchallengeRangeSchema.safeParse({
      betStartRange: betStartRange,
      betEndRange: betEndRange,
      askStartRange: askStartRange,
      askEndRange: askEndRange,
    });

    if (validation.success) {
      try {
        await axios.post("/api/challengeRange", {
          body: JSON.stringify({
            betStartRange: String(betStartRange),
            betEndRange: String(betEndRange),
            askStartRange: String(askStartRange),
            askEndRange: String(askEndRange),
            username: String(selectUsername),
          }),
        });
        setAlertMessage("Challenge sent!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setIsModalOpen(false);
        }, 1500);
      } catch (error) {
        handleError(error);
      }
    } else {
      setAlertMessage("Please enter values in the given range.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 1500);
    }
  };

  const handleError = (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) {
        setAlertMessage("Challenge already sent.");
      } else {
        setAlertMessage("An error occurred while sending the challenge.");
      }
    } else {
      setAlertMessage("An unexpected error occurred.");
    }
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 1500);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  return (
    <>
    {/* Alert Message */}
    {showAlert && (
        <div className="absolute mt-0 left-1/2 transform -translate-x-1/2 max-w-lg z-[60]">
          <div
            className="p-4 mb-4 text-xl font-mono glow2 bg-black text-white rounded-lg border-2 border-white"
            role="alert"
          >
            {alertMessage}
          </div>
        </div>
      )}
     <div className="lg:ml-52 md:ml-56 sm:ml-60 relative">
      

      {/* Button to trigger modal */}
      <BasicChallengeButton
        onClick={() => setIsModalOpen(true)}
        onItemClick={handleItemClick}
      />

      {/* Modal Popup */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 backdrop-blur-md z-40" />
          <div className="fixed top-1/2 left-1/2 z-50 w-4/6 max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-lg shadow-lg glow-effect">
            <div ref={modalRef} className="p-4">
              <h1 className="text-center font-mono text-2xl font-extrabold">
                Select Bet Amount
              </h1>
              <div className="my-8">
                <h2 className="font-mono">
                  Min Bet Amount: <span>{betStartRange}</span>
                </h2>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={betStartRange}
                  onChange={(e) => setBetStartRange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="my-8">
                <h2 className="font-mono">
                  Max Bet Amount: <span>{betEndRange}</span>
                </h2>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={betEndRange}
                  onChange={(e) => setBetEndRange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="my-8">
                <h2 className="font-mono">
                  Min Ask Amount: <span>{askStartRange}</span>
                </h2>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={askStartRange}
                  disabled
                  className="w-full"
                />
              </div>
              <div className="my-8">
                <h2 className="font-mono">
                  Max Ask Amount: <span>{askEndRange}</span>
                </h2>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={askEndRange}
                  disabled
                  className="w-full"
                />
              </div>
              <div className="flex gap-x-2">
                <button
                  onClick={fetchData}
                  className="mt-4 w-[30%] text-white font-mono tracking-widest inline-flex justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsModalOpen(false)} // Close the popup
                  className="mt-4 w-[30%] bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
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
              animation: glow 1.5s infinite alternate;
              border-radius: 12px; /* Optional: to soften the edges */
            }
          `}</style>
        </>
      )}
    </div>
    </>
   
  );
}
