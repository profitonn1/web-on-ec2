"use client"

import React, { useState } from "react"
// import { useForm } from 'react-hook-form';
import { z } from "zod"
// import { zodResolver } from '@hookform/resolvers/zod';
// import DashAppbar from './DashAppbar';
import axios from "axios"

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
    .max(200, { message: "Ask End Range must be between 50 and 200" })
})

// Define the form inputs interface based on the schema
// type FormInputs = z.infer<typeof bchallengeRangeSchema>;

// Define the component using React.FC with ChallengePopupProps interface
const ChallengeByPopup = ({ data, onClick }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0)

  const [selectedRange, setSelectedRange] = useState({
    betStartRange2: null,
    betEndRange2: null,
    askStartRange2: null,
    askEndRange2: null
  })
  const goToNextChallenge = () => {
    setCurrentChallengeIndex(prevIndex => (prevIndex + 1) % data.length)

    setSelectedRange({
      betStartRange2: null,
      betEndRange2: null,
      askStartRange2: null,
      askEndRange2: null
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
      askEndRange2: null
    })
  }

  function getCookieValue(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) return match[2]
    return null
  }

  const onSubmit = async () => {
    try {
      const userDetailsCookie = getCookieValue("userDetails")

      if (userDetailsCookie) {
        const decodedUserDetails = decodeURIComponent(userDetailsCookie)
        const parsedUserDetails = JSON.parse(decodedUserDetails)

        // Validate the range values with Zod and only proceed if it's valid
        const validationResult = bchallengeRangeSchema.safeParse(selectedRange)

        if (validationResult.success) {
          // Proceed to send data if validation passes
          const challengeSentBackend = await axios.post(
            "/api/game/resendChallengeRange",
            {
              betStartRange2: String(selectedRange.betStartRange2),
              betEndRange2: String(selectedRange.betEndRange2),
              askStartRange2: String(selectedRange.askStartRange2),
              askEndRange2: String(selectedRange.askEndRange2),
              challengedby: data[currentChallengeIndex]?.challengername
            },
            {
              params: {
                id: parsedUserDetails.id,
                username: parsedUserDetails.username
              },
              withCredentials: true // Moved into the same config object
            }
          )

          if (challengeSentBackend.status === 201) {
            alert("Data Sent, Wait!!!")
            onClick() // Handle the onClick action here
          }
        }
      } else {
        alert("Please enter all values correctly!") // Show an error if validation fails
      }
    } catch (error) {
      alert("Data Already Sent to this Challenger, Wait!!!")
      console.log(error) // Log error to see what went wrong
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-95 ">
      <div className="flex flex-col items-center">
        <div className="border-2 border-gray-300 rounded-3xl w-96 bg-white m-2 p-4">
          {data.length > 0 && (
            <div className="flex flex-col items-center p-2">
              <div className="text-center  grid grid-cols-10 mb-4 gap-x-3">
                <p className="text-3xl  col-span-9  mt-10 font-medium text-yellow-600">
                  <p className="font-bold">
                    &lt;{data[currentChallengeIndex]?.challengername}&gt;
                  </p>
                  sent a challenge to You
                </p>

                <button
                  // Close the popup when clicking the 'X' button
                  onClick={onClick}
                  className=" col-span-1 text-white font-bold bg-gray-600 rounded-full w-10 h-10 text-center p-2 hover:bg-gray-500"
                >
                  X
                </button>
              </div>
              <div className="font-bold  items-center text-black">
                Ranking - {data[currentChallengeIndex]?.ranking}
              </div>
              <div className="p-2 flex flex-col items-center text-black">
                <div className="font-bold mb-4">
                  <p>
                    Ask Start Price:{" "}
                    {data[currentChallengeIndex]?.askStartRange}
                  </p>
                  <p>
                    Ask End Price: {data[currentChallengeIndex]?.askEndRange}
                  </p>
                </div>
                <p className="mt-2 font-medium ">Send Your Bet and Ask:</p>
                <form className="flex flex-col gap-2" onSubmit={onSubmit}>
                  <div>
                    <input
                      onChange={e => {
                        setSelectedRange(prevRange => ({
                          ...prevRange,
                          betStartRange2: parseInt(e.target.value, 10) || null
                        }))
                      }}
                      value={
                        selectedRange.betStartRange2 !== null
                          ? selectedRange.betStartRange2
                          : ""
                      }
                      className="rounded-lg w-72 border-2 border-black p-2"
                      type="number"
                      placeholder="Bet Start Range"
                    />
                    {/* {errors.betStartRange2?.message && (
                    <p className="text-red-600">{String(errors.betStartRange2.message)}</p>
                  )} */}
                  </div>

                  <div>
                    <input
                      onChange={e => {
                        setSelectedRange(prevRange => ({
                          ...prevRange,
                          betEndRange2: parseInt(e.target.value, 10) || null
                        }))
                      }}
                      value={
                        selectedRange.betEndRange2 !== null
                          ? selectedRange.betEndRange2
                          : ""
                      }
                      className="rounded-lg w-72 border-2 border-black p-2"
                      type="number"
                      placeholder="Bet End Range"
                    />
                    {/* {errors.betEndRange2?.message && (
                    <p className="text-red-600">{String(errors.betEndRange2.message)}</p>
                  )} */}
                  </div>

                  <div>
                    <input
                      onChange={e => {
                        setSelectedRange(prevRange => ({
                          ...prevRange,
                          askStartRange2: parseInt(e.target.value, 10) || null
                        }))
                      }}
                      value={
                        selectedRange.askStartRange2 !== null
                          ? selectedRange.askStartRange2
                          : ""
                      }
                      className="rounded-lg w-72 border-2 border-black p-2"
                      type="number"
                      placeholder="Ask Start Range"
                    />
                    {/* {errors.askStartRange2?.message && (
                    <p className="text-red-600">{String(errors.askStartRange2.message)}</p>
                  )} */}
                  </div>

                  <div>
                    <input
                      onChange={e => {
                        setSelectedRange(prevRange => ({
                          ...prevRange,
                          askEndRange2: parseInt(e.target.value, 10) || null
                        }))
                      }}
                      value={
                        selectedRange.askEndRange2 !== null
                          ? selectedRange.askEndRange2
                          : ""
                      }
                      className="rounded-lg w-72 border-2 border-black p-2"
                      type="number"
                      placeholder="Ask End Range"
                    />
                    {/* {errors.askEndRange2?.message && (
                    <p className="text-red-600">{String(errors.askEndRange2.message)}</p>
                  )} */}
                  </div>

                  <button
                    type="submit"
                    className="hover:bg-blue-600 bg-blue-800 p-2 rounded-full text-white "
                  >
                    Submit
                  </button>
                </form>
              </div>
              {data.length > 1 ? (
                <div className="flex gap-x-2">
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
  )
}

export default ChallengeByPopup