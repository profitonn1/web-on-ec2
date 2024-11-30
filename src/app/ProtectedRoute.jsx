"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

// Function to get cookie value by name
function getCookieValue(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ["/signin", "/signup"];
  const [isLoading, setIsLoading] = useState(true);
  const inactivityTimer = useRef(null);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      console.log("Inactivity timer reset.");
    }
    inactivityTimer.current = setTimeout(() => {
      console.log("User inactive for 10 minutes. Logging out.");
      handleLogout();
    }, 10 * 60 * 1000); // 10 minutes
  };

  const handleLogout = async () => {
    const currentPath = window.location.pathname;
    const excludedPaths = ["/", "/signin", "/signup"];

    // Prevent logout if the user is on excluded paths
    if (excludedPaths.includes(currentPath)) {
      // console.log("Logout is not executed on this page:", currentPath);
      return;
    }

    const userDetailsString = getCookieValue("userDetails");
    let userDetails = null;

    if (userDetailsString) {
      try {
        userDetails = JSON.parse(userDetailsString);
      } catch (error) {
        console.error("Error parsing user details:", error);
      }
    }

    if (!userDetails) {
      // console.error("No user details found for logout.");
      router.push("/");
      return;
    }

    try {
      await fetch("/api/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userDetails.username }),
      });
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    const token = getCookieValue("token");
    const userDetailsString = getCookieValue("userDetails");
    let userDetails = null;

    if (userDetailsString) {
      try {
        userDetails = JSON.parse(userDetailsString);
      } catch (error) {
        console.error("Error parsing user details:", error);
      }
    }

    const verifyToken = async () => {
      if (!token || !userDetails) {
        if (!publicPaths.includes(pathname)) {
          router.push("/");
        }
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/verifyToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            userId: userDetails.id,
            username: userDetails.username,
          }),
        });

        if (response.status === 401) {
          const errorData = await response.json();
          console.error("Token error:", errorData.error);

          if (!publicPaths.includes(pathname)) {
            router.push("/");
          }
        } else if (response.status === 200) {
          if (publicPaths.includes(pathname)) {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        if (!publicPaths.includes(pathname)) {
          router.push("/");
        }
      }

      setIsLoading(false);
    };

    verifyToken();

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (inactivityTimer.current) {
          clearTimeout(inactivityTimer.current);
          // console.log("Tab is hidden, timer stopped.");
        }
      } else if (document.visibilityState === "visible") {
        resetInactivityTimer();
        // console.log("Tab is visible, timer restarted.");
      }
    };

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);

    // Initialize the timer
    resetInactivityTimer();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("mousemove", resetInactivityTimer);
      window.removeEventListener("keydown", resetInactivityTimer);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [pathname, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Cookies from "js-cookie";

// const ProtectedRoute = ({ children }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const publicPaths = ["/", "/signin", "/signup"];
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const token = Cookies.get("token");
//     const userDetailsString = Cookies.get("userDetails");
//     let userDetails = null;

//     // Debugging: Check if cookies are retrieved correctly
//     console.log("Token:", token);
//     console.log("User Details String:", userDetailsString);

//     // Parse user details if they exist
//     if (userDetailsString) {
//       try {
//         userDetails = JSON.parse(userDetailsString);
//         console.log("Parsed User Details:", userDetails);
//       } catch (error) {
//         console.error("Error parsing user details:", error);
//       }
//     }

//     // Redirect based on token and public paths
//     if (!token && !publicPaths.includes(pathname)) {
//       console.log("Redirecting to home...");
//       router.push("/");
//     } else if (token && publicPaths.includes(pathname)) {
//       console.log("Redirecting to dashboard...");
//       router.push("/dashboard");
//     }

//     setIsLoading(false); // Set loading to false after checks
//   }, [pathname, router]); // Added router to dependencies for good practice

//   // Show loading indicator while checking
//   if (isLoading) {
//     return <div>Loading...</div>; 
//   }

//   return <>{children}</>; // Render children if not loading
// };

// export default ProtectedRoute;