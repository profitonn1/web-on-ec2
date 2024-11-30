"use client"
import axios from "axios"
import React, { useEffect, useState } from "react"

export default function BasicChallengeButton({ onClick, onItemClick }) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true) // Add loading state
  const [error, setError] = useState(null) // Add error state

  function getCookieValue(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
    if (match) return match[2]
    return null
  }
  useEffect(() => {
    const fetchData = async () => {
      try { 
        const userDetailsCookie = getCookieValue("userDetails")

        if (userDetailsCookie) {
          const decodedUserDetails = decodeURIComponent(userDetailsCookie)
          const parsedUserDetails = JSON.parse(decodedUserDetails)

          const response = await axios.get("/api/category", {
            params: {
              categoryChosen: "beginner",
              id: parsedUserDetails.id,
              username: parsedUserDetails.username
            }
          })

          if (response.data && Array.isArray(response.data)) {
            setData(response.data)
          } else {
            console.error("Unexpected response format:", response.data)
            setError("Unexpected data format.")
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
        setError("Error fetching data.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <p className="ml-20">Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className="flex justify-center">
      <div
        onClick={onClick}
        className="border-2 cursor-pointer w-5/6 max-w-full bg-indigo-700 items-center ml-8 text-sm lg:text-lg -mt-8 border-gray-300"
      >
        {data.length > 0 ? (
          data
            .filter(item => item && item.username)
            .map((item, index) => (
              <div
                // Ensure item.id is unique
                key={item.id}
                className={`hover:bg-indigo-600 flex justify-around  ${
                  index === data.length - 1
                    ? "mb-1"
                    : "border-b-2 border-gray-300"
                }`}
                onClick={() => onItemClick(item.username)}
              >
                <p className="w-[25%] text-center">{item.ranking}</p>
                <p className="w-[25%] text-center">{item.username}</p>
                <p className="w-[25%] text-center">{item.averageroc}</p>
                <p className="w-[25%] text-center">{item.winRate}</p>
              </div>
            ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  )
}