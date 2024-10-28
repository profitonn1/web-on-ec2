"use client"
import axios from "axios"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"
import { getCombinedData } from "../../fetchData/fetchuserdata"
import { useRouter } from "next/navigation"

export default function Autopairing() {
  const router = useRouter()
  const [, setIsSuccess] = useState(false)

  const [heading, setHeading] = useState("Finding Player")
  const [oppData, setOppData] = useState({
    oppname: "",
    winrate: "",
    ranking: ""
  })

  // const [name, setName] = useState<any>(null);
  const [data, setData] = useState(null)
  // const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("0")
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  function getCookieValue(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) return match[2]
    return null
  }

  useEffect(() => {
    const storedDetails = getOpponentDetailsFromCookies()

    if (storedDetails) {
      console.log("Setting state with details:", storedDetails) // Debugging line
      setOppData(storedDetails)
    } else {
      console.log("No details found in cookies")
    }
  }, [oppData])

  const handleSubmit = async e => {
    e.preventDefault() // Prevent form submission

    if (amount == "0") {
      setAlertMessage("Please  Select  the  Amount")
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 1500)
    }

    try {
      let success = false
      while (!success && amount != "0") {
        try {
          const userDetailsCookie = getCookieValue("userDetails")
          // Start the game by posting the amount
          if (userDetailsCookie) {
            const decodedUserDetails = decodeURIComponent(userDetailsCookie)
            const parsedUserDetails = JSON.parse(decodedUserDetails)
            const postresponse = await axios.post("/api/game/start", {
              params: {
                // Wrap the data inside params
                id: parsedUserDetails.id,
                username: parsedUserDetails.username,
                amount: amount // The amount selected
              }
            })

            if (postresponse.status === 200) {
              success = true

              // Get the response data (opponent details)
              const opponentDetails = postresponse.data

              // Store opponent details in both cookies and state
              const expiresIn30Minutes = new Date(
                new Date().getTime() + 30 * 60 * 1000
              )

              // Set the cookie with a 30-minute expiration time
              Cookies.set("opponentDetails", JSON.stringify(opponentDetails), {
                expires: expiresIn30Minutes
              })
              setOppData(opponentDetails) // Update the state with the details

              // Optionally, start checking for an opponent if needed
              checkForOpponent()
            }
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            setAlertMessage("Finding Player")
            setShowAlert(true)
            setTimeout(() => {
              setShowAlert(false)
            }, 3000)
            console.log("Opponent not found, retrying...")
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for 1 second before retrying
          } else {
            console.error("Unexpected error:", error)
          }
        }
      }
    } catch (error) {
      console.error("Error starting the game:", error)
    }
  }

  const getOpponentDetailsFromCookies = () => {
    const storedDetails = Cookies.get("opponentDetails")
    return storedDetails ? JSON.parse(storedDetails) : null
  }

  const checkForOpponent = async () => {
    try {
      const userDetailsCookie = getCookieValue("userDetails")
      // Start the game by posting the amount
      if (userDetailsCookie) {
        const decodedUserDetails = decodeURIComponent(userDetailsCookie)
        const parsedUserDetails = JSON.parse(decodedUserDetails)
        const oppResponse = await axios.get("/api/game/start", {
          params: {
            // Wrap the data inside params
            id: parsedUserDetails.id,
            username: parsedUserDetails.username,
            amount: amount // The amount selected
          }
        })

        const expiresIn30Minutes = new Date(
          new Date().getTime() + 30 * 60 * 1000
        )

        const storeOpponentDetailsInCookies = details => {
          Cookies.set("opponentDetails", JSON.stringify(details), {
            expires: expiresIn30Minutes
          }) // Store for 7 days
        }
        if (oppResponse.data) {
          storeOpponentDetailsInCookies(oppResponse.data)
          setAlertMessage("User Found")
          setIsSuccess(true)
          setShowAlert(true)
          setTimeout(() => {
            setShowAlert(false)
            // router.push('/payment');
          }, 1500)

          if (oppResponse.status === 404) {
            setAlertMessage("Finding Player")
            setShowAlert(true)
            setTimeout(() => {
              setShowAlert(false)
              // router.push('/payment');
            }, 1500)
          }

          setHeading("Match Confirmed")
        } else {
          // If no opponent found, keep checking after a delay
          setTimeout(checkForOpponent, 3000) // Retry after 3 seconds
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        if (amount === "0") {
          setAlertMessage("Please Select the Amount")
          setShowAlert(true)
          setTimeout(() => {
            setShowAlert(false)
          }, 1500)
        } else {
          setAlertMessage("Finding Player")
          setShowAlert(true)
          setTimeout(() => {
            setShowAlert(false)
          }, 1500)
          // Keep checking for an opponent after a delay
          setTimeout(checkForOpponent, 3000) // Retry after 3 seconds
        }
      }
    }
  }

  const setAmountFunction = async e => {
    try {
      const selectedAmount = e.target.value
      setAmount(selectedAmount) // Set the amount

      const userDetailsCookie = getCookieValue("userDetails")
      // Start the game by posting the amount
      if (userDetailsCookie) {
        const decodedUserDetails = decodeURIComponent(userDetailsCookie)
        const parsedUserDetails = JSON.parse(decodedUserDetails)
        const oppResponse = await axios.post("/api/game/setamount", {
          params: {
            // Wrap the data inside params
            id: parsedUserDetails.id,
            username: parsedUserDetails.username,
            amount: selectedAmount // The amount selected
          }
        })

        console.log("Response:", oppResponse.data)
      }
    } catch (error) {
      console.error("Error setting amount:", error)
    }
  }

  const paymentButton = () => {
    const opponentData = Cookies.get("opponentDetails")
    console.log("opponentData:", opponentData) // To check the value in the console
    if (opponentData === undefined) {
      setAlertMessage("Please Select the Amount")
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 1500)
    } else {
      setAlertMessage("Redirecting to payment page")
      setShowAlert(true)

      setTimeout(() => {
        setShowAlert(false)
        router.push("/payments")
      }, 1500)
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
    <div className="bg-gray-950 text-white p-4 mt-14 lg:mt-4 md:mt-7 md:p-14 lg:p-16 lg:h-screen h-full w-full ">
      <div className="fixed">
        {/* Alert */}
        {showAlert && (
          <div className="relative top-0  left-1/2  right-1/2 transform -translate-x-1/2 w-full max-w-lg">
            <div
              className="p-4 mb-4 text-lg bg-blue-700 text-green-200 rounded-lg border-2 border-slate-200 shadow-3xl "
              role="alert"
            >
              {alertMessage}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="lg:text-9xl md:text-7xl text-5xl text-center text-gradient font-medium p-6 lg:-mb-4 lg:-mt-6 ">
          {heading}
        </div>
        <div className="grid lg:grid-cols-11 mt-6 gap-x-6 gap-y-2 p-2 items-center">
          <div className="border-2 border-slate-600 p-5 rounded-lg col-span-5 grid grid-cols-6">
            <span className="col-span-3  lg:col-span-2 md:col-span-2  w-28 h-28 rounded-full bg-white"></span>
            <div className="col-span-3 lg:col-span-4 md:col-span-4 ">
              <span className="text-3xl text-blue-500 font-medium">
                Player One
              </span>
              <br />
              <span className="text-lg text-orange-300">
                Username : {userDetails?.username}
              </span>
              <br />
              <span className="text-lg text-orange-300">
                Winrate : {userDetails?.winrate}
              </span>
              <br />
              <span className="text-lg text-orange-300">
                Ranking : {userDetails?.Ranking}
              </span>
              <br />
            </div>
          </div>
          <div className="text-4xl col-span-1 text-center"> VS </div>
          <div className="border-2 border-slate-600 p-5 rounded-lg col-span-5 grid grid-cols-6">
            <span className="col-span-3  lg:col-span-2 md:col-span-2   w-28 h-28 rounded-full bg-white"></span>
            <div className="col-span-3  lg:col-span-4 md:col-span-4  ">
              <span className="text-3xl text-blue-500 font-medium">
                Player Two
              </span>
              <br />
              <span className="text-lg text-orange-400">
                Username :{oppData.oppname}
              </span>
              <br />
              <span className="text-lg text-orange-400">
                Winrate :{oppData.winrate}
              </span>
              <br />
              <span className="text-lg text-orange-400">
                Ranking:{oppData.ranking}
              </span>
              <br />
            </div>
          </div>
        </div>

        <div className="lg:flex lg:flex-col items-start p-4 ">
          <div className="text-4xl p-2 w-full text-white font-medium mb-4">
            <div className="mb-4">
              <span className="text-gradient">Game Options</span>
            </div>
          </div>

          <div className="lg:flex lg:items-center  lg:space-x-72 text-center  ">
            <div className="flex items-center space-x-4 ">
              <form className="inline-block ">
                <select
                  name="Amount"
                  className="hover:bg-slate-700 cursor-pointer text-lg p-2 bg-zinc-900 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={setAmountFunction}
                >
                  <option value="" disabled selected>
                    Select amount
                  </option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="150">150</option>
                  <option value="200">200</option>
                </select>
              </form>
              <button
                onClick={handleSubmit}
                className="hover:bg-blue-600 bg-blue-800 p-2 w-28 rounded-3xl text-lg"
              >
                Submit
              </button>
            </div>

            <div className=" lg:flex-grow lg:flex lg:justify-end flex justify-start mt-4 lg:mt-0 md:mt-4  ">
              <button
                onClick={paymentButton}
                className="hover:bg-gradient-to-r hover:from-cyan-600 hover:to-blue-600 ...  bg-gradient-to-r from-cyan-500 to-blue-500 p-4 w-64 rounded-3xl text-xl text-black"
              >
                Proceed to payment
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-zinc-950">hi </div>
    </div>
  )
}