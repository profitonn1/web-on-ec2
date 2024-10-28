
"use client"
import React, { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

const ChallengeToPopup = ({ data, data2, onClick }) => {
  const router = useRouter()

  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)

  const [, setSelectedRange] = useState({
    betStartRange2: null,
    betEndRange2: null,
    askStartRange2: null,
    askEndRange2: null,
    challengeToname: null
  })

  const goToNextChallenge = () => {
    setCurrentChallengeIndex(prevIndex => (prevIndex + 1) % data.length)

    setSelectedRange({
      betStartRange2: null,
      betEndRange2: null,
      askStartRange2: null,
      askEndRange2: null,
      challengeToname: null
    })
  }

  const goToPreviousChallenge = () => {
    if (currentChallengeIndex >= 1) {
      setCurrentChallengeIndex(prevIndex => (prevIndex - 1) % data.length)
    }
    setSelectedRange({
      betStartRange2: null,
      betEndRange2: null,
      askStartRange2: null,
      askEndRange2: null,
      challengeToname: null
    })
  }

  function getCookieValue(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) return match[2]
    return null
  }

  // sending backend request to calculate intesection in the ranges of the prices set for bid and ask by the user and the opponent

  const commanRangeData = async () => {
    try {
      const userDetailsCookie = getCookieValue("userDetails")

      if (userDetailsCookie) {
        const decodedUserDetails = decodeURIComponent(userDetailsCookie)
        const parsedUserDetails = JSON.parse(decodedUserDetails)

        const response = await axios.post(
          "/api/game/matchChallenger",
          {
            data: data[currentChallengeIndex],
            data2: data2[currentChallengeIndex]
          },
          {
            params: {
              id: parsedUserDetails.id,
              username: parsedUserDetails.username
            },
            withCredentials: true // Moved into the same config object
          }
        )
        console.log(response.data.intersection1)
        console.log("challengeBet", response.data.challengerBet)
        console.log("challengeBet", response.data.opponentBet)

        if (response.status === 201) {
          alert(
            `You are Paired with ${data[currentChallengeIndex]?.challengeToname}\nYour Bet - Rs ${response.data.challengerBet}\nYour Opponents Bet - Rs ${response.data.opponentBet}`
          )
          router.push("/realterminal")
        }
      }
    } catch (error) {
      alert(`You are Already paired  ${error}`)
    }
  }

  return (
    <div>
      {/* {data.length > 0 && (
        {data.[currentChallengeIndex]?.challengeToname}
       )}
      } */}
      <div className="fixed text-black inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-95">
        <div className="flex flex-col items-center">
          <div className="border-2 border-gray-300 rounded-lg w-96 bg-white m-2 p-4">
            {data.length > 0 && (
              <div className="flex flex-col items-center p-2">
                <div className="text-center grid grid-cols-10 mb-4 gap-x-3">
                  <p className="text-3xl col-span-9 font-medium mt-10 text-yellow-600 text-center">
                    Challenge Sent to
                    <p className="font-bold">
                      &lt;{data[currentChallengeIndex]?.challengeToname}&gt;
                    </p>
                  </p>

                  <button
                    // Close the popup when clicking the 'X' button
                    onClick={onClick}
                    className=" col-span-1 text-white font-bold   bg-gray-600 rounded-full w-10  h-10 text-center p-2 hover:bg-gray-500"
                  >
                    X
                  </button>
                </div>
                <div className="p-2 flex flex-col items-center text-black">
                  <div className="font-bold mb-4">
                    <p className="flex justify-center gap-x-2">
                      <p>
                        Bet Start Price:{" "}
                        {data[currentChallengeIndex]?.betStartRange}
                      </p>
                      <p>
                        Bet End Price:{" "}
                        {data[currentChallengeIndex]?.betEndRange}
                      </p>
                    </p>
                    <p className="flex justify-center gap-x-2">
                      <p>
                        Ask Start Price:{" "}
                        {data[currentChallengeIndex]?.askStartRange}
                      </p>
                      <p>
                        Ask End Price:{" "}
                        {data[currentChallengeIndex]?.askEndRange}
                      </p>
                    </p>
                    <p></p>
                  </div>
                </div>
                {data2 &&
                data2.length > 0 &&
                data2[currentChallengeIndex] != null ? (
                  <div className="font-bold mb-4 text-center ">
                    <p className=" font-bold text-xl text-yellow-600 ">
                      {" "}
                      &lt;{data[currentChallengeIndex]?.challengeToname}&gt;
                      sent ask Range
                    </p>
                    <div className="flex justify-center gap-x-2">
                      <span>
                        Bet Start Price:{" "}
                        {data2[currentChallengeIndex]?.betStartRange2}
                      </span>
                      <span>
                        Bet End Price:{" "}
                        {data2[currentChallengeIndex]?.betEndRange2}
                      </span>
                    </div>
                    <div className="flex justify-center gap-x-2 mt-2">
                      <span>
                        Ask Start Price:{" "}
                        {data2[currentChallengeIndex]?.askStartRange2}
                      </span>
                      <span>
                        Ask End Price:{" "}
                        {data2[currentChallengeIndex]?.askEndRange2}
                      </span>
                    </div>
                    <div className="text-center mt-5">
                      <button
                        className="bg-blue-700 hover:bg-blue-600 p-2  rounded-full w-32 text-white  text-base "
                        onClick={() => {
                          commanRangeData()
                        }}
                      >
                        Accept{" "}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 font-semibold text-lg text-center text-blue-800">
                    <span>
                      Waiting for &lt;
                      {data[currentChallengeIndex]?.challengeToname}&gt; to send
                      ask range
                    </span>{" "}
                    <br />
                    <span className="text-base font-medium">
                      (Reload the page once)
                    </span>
                  </p>
                )}

                {data.length > 1 ? (
                  <div className="flex gap-x-5">
                    <button
                      className=" w-28 mt-4 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
                      onClick={goToPreviousChallenge}
                    >
                      Previous
                    </button>
                    <button
                      className=" w-28 mt-4 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded"
                      onClick={goToNextChallenge}
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeToPopup