"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import SideAppbar from "../../components/SideAppbar"
import ChallengeByPopup from "../../components/ChallengeByPopup"
import { getCombinedData } from "../../../app/fetchData/fetchuserdata"
import ChallengeToPopup from "../../components/ChallengeToPopup"
// import { data } from "autoprefixer";

export default function Bstartgame() {
  const [dataBy, setDataBy] = useState([])
  const [dataTo, setDataTo] = useState([])
  const [data2, setData2] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [popUpByOpen, setPopUpByOpen] = useState(false)
  const [popUpToOpen, setPopUpToOpen] = useState(false)
  const [data, setData] = useState(null)
  // const [ showChallengerButton , setShowChallengerButton ] = useState(false)
  const router = useRouter()
  const [noofChallengesGot, setNoofChallengesGot] = useState("0")
  const [noofChallengesSent, setNoofChallengesSent] = useState("0")
  const [showMessageBy, setShowMessageBy] = useState(false)
  const [autoPopUp, setAutoPopUp] = useState(false)
  const [showMessageTo, setShowMessageTo] = useState(false)
  const [showWarning, setShowWarning] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)
  const items = [
    { id: 1, value: 50 },
    { id: 2, value: 100 },
    { id: 3, value: 150 },
    { id: 4, value: 200 }
  ]

  useEffect(() => {
    const fetchChallengeByDataBy = async () => {
      try {
        const userDetailsCookie = getCookieValue("userDetails")

        if (userDetailsCookie) {
          const decodedUserDetails = decodeURIComponent(userDetailsCookie)
          const parsedUserDetails = JSON.parse(decodedUserDetails)

          const response = await axios.get("/api/game/showChallengeBy", {
            params: {
              id: parsedUserDetails.id,
              username: parsedUserDetails.username
            },
            withCredentials: true // Ensure cookies are sent with the request
          })

          if (response.status === 200 && response.data.data) {
            setDataBy(response.data.data)
            setNoofChallengesGot(response.data.data.length)
          }
        } else {
          console.error("User details cookie not found.")
          alert("User is not authenticated. Please log in again.")
        }
      } catch (error) {
        console.error("Error fetching challenge dataBy:", error)
        alert("Something went wrong. Please try again.")
      }
    }

    fetchChallengeByDataBy()

    // Separate popup logic to avoid conditional hook rendering issues
    const lastPopupByTime = localStorage.getItem("lastPopupByTime")
    const currentTime = Date.now()

    if (
      !lastPopupByTime ||
      currentTime - Number(lastPopupByTime) > 30 * 60 * 1000
    ) {
      setShowPopup(true)
      localStorage.setItem("lastPopupByTime", currentTime.toString()) // Update the last shown time
    }
  }, []) // Only run once on component mount

  function getCookieValue(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) return match[2]
    return null
  }

  useEffect(() => {
    const resentChallengeDataBy = async () => {
      try {
        const userDetailsCookie = getCookieValue("userDetails")

        if (userDetailsCookie) {
          const decodedUserDetails = decodeURIComponent(userDetailsCookie)
          const parsedUserDetails = JSON.parse(decodedUserDetails)

          // Fetch challenge data
          const response = await axios.get("/api/game/showChallengeTo", {
            params: {
              id: parsedUserDetails.id,
              username: parsedUserDetails.username
            },
            withCredentials: true // Moved into the same config object
          })

          // Fetch resend challenge range
          const resentResponse = await axios.get(
            "/api/game/resendChallengeRange",
            {
              params: {
                id: parsedUserDetails.id,
                username: parsedUserDetails.username
              },
              withCredentials: true // Moved into the same config object
            }
          )

          if (
            resentResponse.status === 200 &&
            Array.isArray(resentResponse.data.data)
          ) {
            const filteredData = resentResponse.data.data.filter(
              item => Object.keys(item).length !== 0
            )

            if (filteredData.length > 0) {
              setData2(filteredData)
              console.log("Filtered Data:", filteredData)
            }
          }

          if (response.status === 200 && response.data.data) {
            setDataTo(response.data.data)
            setNoofChallengesSent(response.data.data.length)

            // Check if the popup has already been shown and when
            const lastPopupToTime = localStorage.getItem("lastPopupToTime")
            const currentTime = Date.now()

            // If it has never been shown, or more than 30 minutes have passed, show the popup
            if (
              !lastPopupToTime ||
              currentTime - Number(lastPopupToTime) > 30 * 60 * 1000
            ) {
              setShowPopup(true)
              localStorage.setItem("lastPopupToTime", currentTime.toString()) // Update the last shown time
            }
          }
        } else {
          console.error("User details cookie not found.")
          alert("User is not authenticated. Please log in again.")
        }
      } catch (error) {
        console.error("Error fetching challenge dataBy:", error)
        alert("Something went wrong. Please try again.")
      }
    }

    resentChallengeDataBy()
  }, [])

  const dataToButton = () => {
    if (dataTo.length === 0 && popUpToOpen) {
      setShowMessageTo(true)
      const timer = setTimeout(() => {
        setShowMessageTo(false)
        setPopUpToOpen(false)
      }, 2000) // Show for 2 seconds

      return () => clearTimeout(timer) // Cleanup on unmount
    } else {
      setShowMessageTo(false) // Hide message if data changes
    }
  }
  useEffect(() => {
    dataToButton()
  }, [dataTo, popUpToOpen])

  const dataByButton = () => {
    if (dataBy.length === 0 && popUpByOpen) {
      setShowMessageBy(true)
      const timer = setTimeout(() => {
        setShowMessageBy(false)
        setPopUpByOpen(false)
      }, 2000) // Show for 2 seconds

      return () => clearTimeout(timer) // Cleanup on unmount
    } else {
      setShowMessageBy(false) // Hide message if data changes
    }
  }

  useEffect(() => {
    dataByButton()
  }, [dataBy, popUpByOpen])

  const tooglePopUp = () => {
    setAutoPopUp(!autoPopUp)
  }

  const handleItemClick = (id, value) => {
    setSelectedItemId(id)
    setSelectedItem(value) // Store the clicked item's value
  }

  const autoAmountSelect = async () => {
    try {
      console.log("Selected Item:", selectedItem)
      console.log("User Balance:", userDetails?.balance)

      const balance = parseInt(userDetails?.balance) // Convert to number
      const newBalance = balance - selectedItem // Calculate new balance

      if (balance !== undefined && !isNaN(balance)) {
        if (!selectedItem) {
          setShowWarning(true)
          alert("Select a price to enter")
        } else if (balance < selectedItem) {
          alert("Insufficient balance")
        } else {
          const userDetailsCookie = getCookieValue("userDetails")
          if (userDetailsCookie) {
            const decodedUserDetails = decodeURIComponent(userDetailsCookie)
            const parsedUserDetails = JSON.parse(decodedUserDetails)

            const response = await fetch("/api/updateBalanceAutopair", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ id: parsedUserDetails.id, newBalance })
            })

            if (!response.ok) {
              throw new Error("Failed to update balance")
            }

            // Redirect to autopairing page
            router.push("/autopairing")
          }
        }
      } else {
        alert("Unable to retrieve balance.")
      }
    } catch (error) {
      console.log("Error in autoAmountSelect:", error)
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

  if (!data) return <div>Loading...</div>

  const { userDetails } = data

  return (
    <div className="bg-gray-950 min-h-screen text-white">
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
            <div className="fixed top-12  text-center w-96  z-50 left-1/2 transform -translate-x-1/2 text-white text-lg font-mono bg-green-700 p-2 rounded">
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
            <div className="fixed top-12  text-center w-80 z-50 left-1/2 transform -translate-x-1/2 text-white text-lg font-mono bg-green-700 p-2 rounded">
              You Got no Challenge
            </div>
          )}

      <SideAppbar
        noofChallengesSent={noofChallengesSent}
        noofChallengesGot={noofChallengesGot}
        onClickTo={() => setPopUpToOpen(true)}
        onClickBy={() => setPopUpByOpen(true)}
      />

      <div className="p-4 sm:ml-64 sm:mt-10 mt-10">
        <div className="p-4">
          <div className="lg:text-9xl md:text-7xl text-4xl mb-3 md:mb-3 font-semibold font-sans text-gradient text-center">
            Choose One Option
          </div>
          <div className="lg:flex lg:justify-around gap-4 mb-4 lg:mt-10">
            <div className="items-center">
              <div className="flex justify-center">
                <button
                  onClick={tooglePopUp}
                  className="flex hover:bg-blue-500 bg-blue-700 items-center justify-center h-20 w-96 text-center rounded-full"
                >
                  <span className="lg:text-4xl md:text-3xl text-2xl">
                    Automatic
                  </span>
                </button>
                {autoPopUp && (
                  <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    onClick={tooglePopUp}
                  >
                    {/* Background overlay with blur */}
                    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm" />

                    {/* Popup Content */}
                    <div
                      className="bg-slate-950 border-2 border-white w-[20%] h-[44%] flex flex-col justify-center items-center md:w-1/3 rounded-lg shadow-lg py-4 text-center relative z-50"
                      // Prevents closing when clicking inside
                      onClick={e => e.stopPropagation()}
                    >
                      <h1 className="mb-4 text-2xl">Select Amount</h1>
                      <ul className="text-white text-lg mb-4 grid grid-cols-2 gap-8">
                        {items.map(item => (
                          <li
                            key={item.id}
                            className={`w-20 h-8 border-2 border-white flex items-center justify-center mb-4 hover:cursor-pointer hover:bg-slate-800 ${
                              selectedItem === item.value ? "bg-slate-800" : ""
                            }`}
                            onClick={() => handleItemClick(item.id, item.value)}
                          >
                            ₹{item.value}
                          </li>
                        ))}
                      </ul>
                      <button
                        // onClick={()=>{
                        //   router.push('/autopairing');
                        // }}
                        onClick={autoAmountSelect}
                        disabled={!selectedItem}
                        className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-500"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
                {showWarning && (
                  <div className="text-red-500 mt-2 text-center">
                    Please select an item before submitting.
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-4 lg:mt-6">
                <div className="w-96 border-2 text-center border-gray-300 rounded-lg p-4 text-lg">
                  <span>
                    The perfect match is found automatically based on the
                    discrete price level selected
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 md:mt-8">
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    router.push("/bchallenge1")
                  }}
                  className="flex hover:bg-blue-500 bg-blue-700 items-center justify-center h-20 w-96 text-center rounded-full"
                >
                  <span className="lg:text-4xl md:text-3xl text-2xl">
                    Challenge
                  </span>
                </button>
              </div>
              <div className="flex justify-center text-center mt-4 lg:mt-6">
                <span className="w-96 border-2 border-gray-300 rounded-lg p-4 text-lg">
                  Player can choose their own Match based on the range of price
                  selected
                </span>
              </div>
            </div>

            <div className=" block lg:hidden md:hidden sm:hidden relative text-center p-2 mt-4">
              <button
                className="text-blue-500  hover:text-blue-300 text-xl font-semibold font-mono"
                onClick={() => {
                  setPopUpByOpen(true)
                  dataByButton()
                }}
              >
                See Who All Challenged You
              </button>
            </div>
            <div className=" block lg:hidden md:hidden sm:hidden relative text-center p-2 mt-4">
              <button
                className="text-blue-500  hover:text-blue-300 text-xl font-semibold font-mono"
                onClick={() => {
                  setPopUpToOpen(true)
                  dataToButton()
                }}
              >
                See Who You&apos;ve Challenged{" "}
              </button>
            </div>

            {/* Render automatic popup if showPopup is true */}
            {showPopup && (
              <ChallengeByPopup
                onClick={() => {
                  setShowPopup(false) // Close the popup when clicked
                }}
                data={dataBy}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}