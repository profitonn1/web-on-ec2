"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"
import React from "react"

const ProtectedRoute = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const publicPaths = ["/", "/signin", "/signup"]

  useEffect(() => {
    const token = Cookies.get("token")
    const userDetailsString = Cookies.get("userDetails")
    let userDetails = null

    // Check if userDetailsString exists
    if (userDetailsString) {
      try {
        userDetails = JSON.parse(userDetailsString)
        console.log(userDetails?.username)
      } catch (error) {
        console.error("Error parsing user details:", error)
      }
    }

    // Redirect based on token and public paths
    if (!token && !publicPaths.includes(pathname)) {
      router.push("/")
    } else if (token && publicPaths.includes(pathname)) {
      router.push("/dashboard")
    }
  }, [pathname, router])

  return <>{children}</>
}

export default ProtectedRoute
