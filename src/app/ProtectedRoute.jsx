"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ["/", "/signin", "/signup"];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const userDetailsString = Cookies.get("userDetails");
    let userDetails = null;

    // Debugging: Check if cookies are retrieved correctly
    console.log("Token:", token);
    console.log("User Details String:", userDetailsString);

    // Parse user details if they exist
    if (userDetailsString) {
      try {
        userDetails = JSON.parse(userDetailsString);
        console.log("Parsed User Details:", userDetails);
      } catch (error) {
        console.error("Error parsing user details:", error);
      }
    }

    // Redirect based on token and public paths
    if (!token && !publicPaths.includes(pathname)) {
      console.log("Redirecting to home...");
      router.push("/");
    } else if (token && publicPaths.includes(pathname)) {
      console.log("Redirecting to dashboard...");
      router.push("/dashboard");
    }

    setIsLoading(false); // Set loading to false after checks
  }, [pathname, router]); // Added router to dependencies for good practice

  // Show loading indicator while checking
  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return <>{children}</>; // Render children if not loading
};

export default ProtectedRoute;
