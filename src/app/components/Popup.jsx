"use client"
import { useState, useRef, useEffect } from "react"
import BasicChallengeButton from "./BasicButton"
import axios from "axios"
import { z } from "zod"
import DoubleEndedSlider from "./slider"

export default function Popup2() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalRef = useRef(null) // Ref to keep track of the modal
  const [selectUsername, setSelectedMobile] = useState(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const [selectedRange, setSelectedRange] = useState({
    betStartRange: null,
    betEndRange: null,
    askStartRange: null,
    askEndRange: null
  })

  const handleItemClick = username => {
    setSelectedMobile(username)
  }

  const bchallengeRangeSchema = z.object({
    betStartRange: z
      .number()
      .min(50)
      .max(200),
    betEndRange: z
      .number()
      .min(50)
      .max(200),
    askStartRange: z
      .number()
      .min(50)
      .max(200),
    askEndRange: z
      .number()
      .min(50)
      .max(200)
  })

  const fetchData = async e => {
    e.preventDefault()

    try {
      const { success } = bchallengeRangeSchema.safeParse(selectedRange)

      if (success) {
        //challengeSentBackend
        await axios.post("/api/challengeRange", {
          body: JSON.stringify({
            betStartRange: String(selectedRange.betStartRange),
            betEndRange: String(selectedRange.betEndRange),
            askStartRange: String(selectedRange.askStartRange),
            askEndRange: String(selectedRange.askEndRange),
            username: String(selectUsername)
          })
        })

        // If the request is successful (status 200)
        setAlertMessage("Challenge sent to Player, Wait till he accepts!!!")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 1500)
        setTimeout(() => setIsModalOpen(false), 1500)

        return
      } else {
        // Invalid input range case
        setAlertMessage("Please Enter values in given Range")
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 1500)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if the error is an AxiosError
        const status = error.response?.status // Get the response status if it exists

        if (status === 404) {
          setAlertMessage("Challenge already sent")
          setTimeout(() => setIsModalOpen(false), 1500)
        } else {
          setAlertMessage("An error occurred while sending the challenge.")
        }
      } else {
        // Handle unexpected errors
        setAlertMessage("An unexpected error occurred.")
      }

      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 1500)
    }
  }

  // Close the modal if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false)
      }
    }

    // Add event listener to detect clicks
    document.addEventListener("mousedown", handleClickOutside)

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [modalRef])

  const buttonFunction = () => {
    // Set isModalOpen to true
    setIsModalOpen(true)
  }

  useEffect(() => {
    if (isModalOpen) {
      setSelectedRange({
        betStartRange: null,
        betEndRange: null,
        askStartRange: null,
        askEndRange: null
      })
    }
  }, [isModalOpen])

  return (
    <div className="lg:ml-52  md:ml-56 sm:ml-60">
      <div className="realtive top-20 left-1/2 right-1/2 z-50">
        {/* Alert */}
        {showAlert && (
          <div className="absolute  top-20 z-50 left-1/2 right-1/2 transform -translate-x-1/2 w-full max-w-lg">
            <div
              className="p-4 mb-4 text-lg bg-[#b4ecc1] text-[#28a745] rounded-lg  dark:text-[#155724] border-2 border-[#28a745] shadow-3xl"
              role="alert"
            >
              {alertMessage}
            </div>
          </div>
        )}
      </div>

      <BasicChallengeButton
        onClick={buttonFunction}
        onItemClick={handleItemClick}
      />

      <div
        id="select-modal"
        aria-hidden={!isModalOpen}
        className={`${
          isModalOpen ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-10 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div
          ref={modalRef}
          className="relative p-4 w-4/6 max-w-md max-h-full lg:mt-20 md:mt-20"
        >
          <div className="relative  rounded-lg shadow bg-orange-600">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Range
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-orange-400 dark:hover:text-white"
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5">
              <p className="text-white mb-2 text-center">Bet</p>

              <div className="w-full ">
                <input
                  min="50"
                  max="200"
                  onChange={e =>
                    setSelectedRange({
                      ...selectedRange,
                      betStartRange: parseInt(e.target.value, 10) || null // Parse as a number, fallback to null
                    })
                  }
                  // Handle null as an empty string
                  value={
                    selectedRange.betStartRange !== null
                      ? selectedRange.betStartRange
                      : ""
                  }
                  className="mb-4 text-black w-full rounded-lg p-2 placeholder-gray-500"
                  placeholder="start range"
                  type="number"
                />

                <input
                  min="50"
                  max="200"
                  onChange={e =>
                    setSelectedRange({
                      ...selectedRange,
                      betEndRange: parseInt(e.target.value, 10) || null // Parse as a number, fallback to null
                    })
                  }
                  // Handle null as an empty string
                  value={
                    selectedRange.betEndRange !== null
                      ? selectedRange.betEndRange
                      : ""
                  }
                  className="mb-4 text-black w-full rounded-lg p-2 placeholder-gray-500"
                  placeholder="end range"
                  type="number"
                />
              </div>

              <p className="text-white mb-2 text-center mt-4">Ask</p>

              <div className="w-full">
                <input
                  min="50"
                  max="200"
                  onChange={e =>
                    setSelectedRange({
                      ...selectedRange,
                      askStartRange: parseInt(e.target.value, 10) || null // Parse as a number, fallback to null
                    })
                  }
                  // Handle null as an empty string
                  value={
                    selectedRange.askStartRange !== null
                      ? selectedRange.askStartRange
                      : ""
                  }
                  className="mb-4 text-black w-full rounded-lg p-2 placeholder-gray-500"
                  placeholder="start range"
                  type="number"
                />

                <input
                  min="50"
                  max="200"
                  onChange={e =>
                    setSelectedRange({
                      ...selectedRange,
                      askEndRange: parseInt(e.target.value, 10) || null // Parse as a number, fallback to null
                    })
                  }
                  // Handle null as an empty string
                  value={
                    selectedRange.askEndRange !== null
                      ? selectedRange.askEndRange
                      : ""
                  }
                  className="mb-4 text-black w-full rounded-lg p-2 placeholder-gray-500"
                  placeholder="end range"
                  type="number"
                />

                <DoubleEndedSlider />
              </div>
              <button
                onClick={fetchData}
                className="mt-4 text-white inline-flex w-full justify-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
