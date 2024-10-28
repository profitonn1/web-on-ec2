"use client"
import { useEffect, useState } from "react"
import axios from "axios"

export default function Challenge() {
  const [, setData] = useState([])
  const [, setShowPopup] = useState(false)

  useEffect(() => {
    const ischallegedData = async () => {
      try {
        const ischalleged = await axios.get("/api/game/showChallenges")

        console.log(ischalleged.data.data) // This should log your actual data

        // Check if the popup has been shown before
        const popupShown = localStorage.getItem("popupShown")

        if (
          !popupShown &&
          ischalleged.status === 200 &&
          ischalleged.data.data
        ) {
          setData(ischalleged.data.data)
          setShowPopup(true)

          // Hide popup after 1 second
          setTimeout(() => {
            setShowPopup(false)
          }, 1000)

          // Mark the popup as shown in localStorage
          localStorage.setItem("popupShown", "true")
        }
      } catch (error) {
        console.error("Error fetching challenge data:", error)
        alert("Something went wrong. Please try again.")
      }
    }

    ischallegedData()
  }, [])

  return <div className="mt-20"></div>
}