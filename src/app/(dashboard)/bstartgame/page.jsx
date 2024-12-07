"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SideAppbar from "../../components/SideAppbar";
import ChallengeByPopup from "../../components/ChallengeByPopup";
import { getCombinedData } from "../../../app/fetchData/fetchuserdata";
import ChallengeToPopup from "../../components/ChallengeToPopup";
import DashAppbar from "../../components/DashAppbar";
// import { data } from "autoprefixer";

export default function Bstartgame() {
  const [dataBy, setDataBy] = useState([]);
  const [dataTo, setDataTo] = useState([]);
  const [data2, setData2] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popUpByOpen, setPopUpByOpen] = useState(false);
  const [popUpToOpen, setPopUpToOpen] = useState(false);
  const [data, setData] = useState(null);
  // const [ showChallengerButton , setShowChallengerButton ] = useState(false)
  const router = useRouter();
  const [noofChallengesGot, setNoofChallengesGot] = useState("0");
  const [noofChallengesSent, setNoofChallengesSent] = useState("0");
  const [showMessageBy, setShowMessageBy] = useState(false);
  const [autoPopUp, setAutoPopUp] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showMessageTo, setShowMessageTo] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [SelectedItemId, setSelectedItemId] = useState(null);

  const items = [
    { id: 1, value: 50 },
    { id: 2, value: 100 },
    { id: 3, value: 150 },
    { id: 4, value: 200 },
  ];
  const [oppData, setOppData] = useState({
    oppname: "",
    winrate: "",
    ranking: "",
  });

  useEffect(() => {
    const fetchChallengeByDataBy = async () => {
      try {
        const userDetailsCookie = getCookieValue("userDetails");

        if (userDetailsCookie) {
          const decodedUserDetails = decodeURIComponent(userDetailsCookie);
          const parsedUserDetails = JSON.parse(decodedUserDetails);

          const response = await axios.get("/api/game/showChallengeBy", {
            params: {
              id: parsedUserDetails.id,
              username: parsedUserDetails.username,
            },
            withCredentials: true, // Ensure cookies are sent with the request
          });

          if (response.status === 200 && response.data.data) {
            setDataBy(response.data.data);
            setNoofChallengesGot(response.data.data.length);
          }
        } else {
          console.error("User details cookie not found.");
          alert("User is not authenticated. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching challenge dataBy:", error);
        alert("Something went wrong. Please try again.");
      }
    };

    fetchChallengeByDataBy();

    // Separate popup logic to avoid conditional hook rendering issues
    const lastPopupByTime = localStorage.getItem("lastPopupByTime");
    const currentTime = Date.now();

    if (
      !lastPopupByTime ||
      currentTime - Number(lastPopupByTime) > 30 * 60 * 1000
    ) {
      setShowPopup(true);
      localStorage.setItem("lastPopupByTime", currentTime.toString()); // Update the last shown time
    }
  }, []); // Only run once on component mount

  function getCookieValue(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  }

  useEffect(() => {
    const resentChallengeDataBy = async () => {
      try {
        const userDetailsCookie = getCookieValue("userDetails");

        if (userDetailsCookie) {
          const decodedUserDetails = decodeURIComponent(userDetailsCookie);
          const parsedUserDetails = JSON.parse(decodedUserDetails);

          // Fetch challenge data
          const response = await axios.get("/api/game/showChallengeTo", {
            params: {
              id: parsedUserDetails.id,
              username: parsedUserDetails.username,
            },
            withCredentials: true, // Moved into the same config object
          });

          // Fetch resend challenge range
          const resentResponse = await axios.get(
            "/api/game/resendChallengeRange",
            {
              params: {
                id: parsedUserDetails.id,
                username: parsedUserDetails.username,
              },
              withCredentials: true, // Moved into the same config object
            }
          );

          if (
            resentResponse.status === 200 &&
            Array.isArray(resentResponse.data.data)
          ) {
            const filteredData = resentResponse.data.data.filter(
              (item) => Object.keys(item).length !== 0
            );

            if (filteredData.length > 0) {
              setData2(filteredData);
              console.log("Filtered Data:", filteredData);
            }
          }

          if (response.status === 200 && response.data.data) {
            setDataTo(response.data.data);
            setNoofChallengesSent(response.data.data.length);

            // Check if the popup has already been shown and when
            const lastPopupToTime = localStorage.getItem("lastPopupToTime");
            const currentTime = Date.now();

            // If it has never been shown, or more than 30 minutes have passed, show the popup
            if (
              !lastPopupToTime ||
              currentTime - Number(lastPopupToTime) > 30 * 60 * 1000
            ) {
              setShowPopup(true);
              localStorage.setItem("lastPopupToTime", currentTime.toString()); // Update the last shown time
            }
          }
        } else {
          console.error("User details cookie not found.");
          alert("User is not authenticated. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching challenge dataBy:", error);
        alert("Something went wrong. Please try again.");
      }
    };

    resentChallengeDataBy();
  }, []);

  const dataToButton = () => {
    if (dataTo.length === 0 && popUpToOpen) {
      setShowMessageTo(true);
      const timer = setTimeout(() => {
        setShowMessageTo(false);
        setPopUpToOpen(false);
      }, 2000); // Show for 2 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    } else {
      setShowMessageTo(false); // Hide message if data changes
    }
  };
  useEffect(() => {
    dataToButton();
  }, [dataTo, popUpToOpen]);

  const dataByButton = () => {
    if (dataBy.length === 0 && popUpByOpen) {
      setShowMessageBy(true);
      const timer = setTimeout(() => {
        setShowMessageBy(false);
        setPopUpByOpen(false);
      }, 2000); // Show for 2 seconds

      return () => clearTimeout(timer); // Cleanup on unmount
    } else {
      setShowMessageBy(false); // Hide message if data changes
    }
  };

  useEffect(() => {
    dataByButton();
  }, [dataBy, popUpByOpen]);

  const tooglePopUp = () => {
    setAutoPopUp(!autoPopUp);
  };

  const handleItemClick = (id, value) => {
    // Toggle the selected state if the same item is clicked again
    if (selectedItem === value) {
      setSelectedItem(null); // Deselect if it's already selected
      setSelectedItemId(null); // Deselect the item ID as well
    } else {
      setSelectedItem(value); // Set the selected item value
      setSelectedItemId(id); // Set the selected item ID
    }
  };
  

  const autoAmountSelect = async () => {
    try {
      console.log("Selected Item:", selectedItem);
      console.log("User Balance:", userDetails?.balance);
  
      const selectedAmount = parseInt(selectedItem);
      const balance = parseInt(userDetails?.balance);
      const newBalance = balance - selectedAmount;
  
      if (isNaN(balance)) {
        alert("Unable to retrieve balance.");
        return;
      }
  
      if (!selectedAmount) {
        setShowWarning(true);
        alert("Select a price to enter");
        return;
      }
  
      if (balance < selectedAmount) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 2000);
        return;
      }
  
      const userDetailsCookie = getCookieValue("userDetails");
      if (!userDetailsCookie) {
        alert("User details not found.");
        return;
      }
  
      const decodedUserDetails = decodeURIComponent(userDetailsCookie);
      const parsedUserDetails = JSON.parse(decodedUserDetails);
      console.log("Username:", parsedUserDetails.username);
  
      // Update balance in the database
      const response = await fetch("/api/updateBalanceAutoPair", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: parsedUserDetails.id,
          newBalance,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update balance");
      }
  
      // Set the amount in the database
      await axios.post("/api/game/setamount", {
        userId: parsedUserDetails.id,
        username: parsedUserDetails.username,
        amount: String(selectedAmount),
      });
  
  
      router.push(`/autopairing?amount=${encodeURIComponent(selectedAmount)}`);


    } catch (error) {
      console.error("Error in autoAmountSelect:", error);
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
    <div>
      <DashAppbar />
      <div className="bg-black min-h-screen text-white">
        {dataTo.length !== 0
          ? popUpToOpen && (
              <ChallengeToPopup
                // Close the manual popup
                onClick={() => setPopUpToOpen(false)}
                data={dataTo}
                data2={data2}
              />
            )
          : showMessageTo && (
              <div className="fixed top-12 text-center w-96 z-50 left-1/2 transform -translate-x-1/2 text-white text-lg font-mono bg-green-700 p-2 rounded">
                You didn&apos;t send any Challenge
              </div>
            )}

        {dataBy.length !== 0
          ? popUpByOpen && (
              <ChallengeByPopup
                // Close the manual popup
                onClick={() => setPopUpByOpen(false)}
                data={dataBy}
              />
            )
          : showMessageBy && (
              <div className="fixed top-12 text-center w-80 z-50 left-1/2 transform -translate-x-1/2 text-white text-lg font-mono bg-green-700 p-2 rounded">
                You Got no Challenge
              </div>
            )}

        <SideAppbar
          noofChallengesSent={noofChallengesSent}
          noofChallengesGot={noofChallengesGot}
          onClickTo={() => setPopUpToOpen(true)}
          onClickBy={() => setPopUpByOpen(true)}
        />

        <div>
          <div className="p-4 sm:ml-64 sm:mt-10 mt-10">
            <div className="p-4 mt-16 mr-28">
              <div className="lg:text-8xl font-sans md:text-7xl text-4xl mb-3 md:mb-3 font-black text-center">
                Choose One Option
              </div>
              <div className="lg:flex lg:justify-center mb-4 lg:mt-10">
                <div className="items-center mr-12">
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={tooglePopUp}
                      className="flex transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-500 bg-indigo-700 items-center justify-center h-16 w-80 text-center rounded-lg"
                    >
                      <span className="lg:text-3xl font-mono font-semibold md:text-3xl text-2xl">
                        Automatic
                      </span>
                    </button>

                    {autoPopUp && (
                      <div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        onClick={tooglePopUp}
                      >
                        {/* Background overlay with reduced opacity */}
                        <div className="fixed inset-0 bg-black bg-opacity-50" />

                        {/* Popup Content */}
                        <div
                          className="fixed top-1/2 left-1/2 z-50 w-4/6 max-w-md transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-lg shadow-lg p-4 glow-effect"
                          // Prevents closing when clicking inside
                          onClick={(e) => e.stopPropagation()}
                        >
                          <h1 className="mb-6 font-mono text-center text-3xl">
                            Select Amount
                          </h1>
                          <div className="flex justify-center">
                          <div className="text-center">
                          <ul className="text-white font-mono text-lg mb-2 grid grid-cols-2 gap-8">
                            {items.map((item) => (
                              <li
                                key={item.id}
                                className={`w-20 font-mono h-8 border-2 border-white flex items-center justify-center mb-4 
                                  cursor-pointer 
                                  ${selectedItem === null ? "hover:bg-[#006BFF]" : ""} 
                                  ${selectedItem === item.value
                                    ? "bg-[#161D6F]" // Selected item color
                                    : "bg-blue-600" // Default item color
                                  }`}
                                onClick={() => handleItemClick(item.id, item.value)}
                              >
                                ₹{item.value}
                              </li>
                            ))}
                          </ul>
                          </div>
                          </div>
                          
                          <div className="flex justify-center gap-x-4 mb-2">
                            <button
                              onClick={autoAmountSelect}
                              disabled={!selectedItem} // Disables the button when no item is selected
                              className={`mt-4 w-[30%] font-mono transition duration-300 ease-in-out transform hover:scale-105 bg-indigo-700 hover:bg-indigo-500 text-white p-2 rounded 
                                ${!selectedItem ? 'cursor-not-allowed' : 'cursor-pointer'}`} // Conditionally change cursor
                            >
                              Submit
                            </button>
                            <button
                              onClick={tooglePopUp}
                              className="mt-4 w-[30%] font-mono bg-gray-600 hover:bg-gray-500 text-white p-2 rounded"
                            >
                              Close
                            </button>
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
                            border-radius: 12px;
                          }
                        `}</style>
                      </div>
                    )}
                    {showAlert && (
                      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-mono p-4 text-xl  mb-4 rounded-md z-50 text-white text-center border-2 border-white bg-black">
                        Insufficient Balance
                      </div>
                    )}

                    {showWarning && (
                      <div className="text-red-500 mt-2 text-center">
                        Please select an item before submitting.
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center mt-4 lg:mt-6">
                    <div className="w-96 border-2 font-mono text-center border-gray-300 rounded-lg p-4 text-lg">
                      <span>
                        The perfect match is found automatically based on the
                        discrete price level selected
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 md:mt-8">
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => {
                        router.push("/bchallenge1");
                      }}
                      className="flex transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-500 bg-indigo-700 items-center justify-center h-16 w-80 text-center rounded-lg"
                    >
                      <span className="lg:text-3xl font-mono font-semibold md:text-3xl text-2xl">
                        Challenge
                      </span>
                    </button>
                  </div>
                  <div className="flex justify-center text-center mt-4 lg:mt-6">
                    <span className="w-96 font-mono border-2 border-gray-300 rounded-lg p-4 text-lg">
                      Player can choose their own Match based on the range of
                      price selected
                    </span>
                  </div>
                </div>

                {/* Mobile Buttons */}
                <div className=" block lg:hidden md:hidden sm:hidden relative text-center p-2 mt-4">
                  <button
                    className="text-blue-500 hover:text-blue-300 text-xl font-semibold font-mono"
                    onClick={() => {
                      setPopUpByOpen(true);
                      dataByButton();
                    }}
                  >
                    See Who All Challenged You
                  </button>
                </div>
                <div className=" block lg:hidden md:hidden sm:hidden relative text-center p-2 mt-4">
                  <button
                    className="text-blue-500 hover:text-blue-300 text-xl font-semibold font-mono"
                    onClick={() => {
                      setPopUpToOpen(true);
                      dataToButton();
                    }}
                  >
                    See Who You&apos;ve Challenged
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
