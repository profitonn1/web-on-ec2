import axios from "axios"
import * as cookie from "cookie"

// Function to retrieve cookie values (used on the client-side)
function getCookieValue(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  if (match) return match[2]
  return null
}

// Function to fetch user data (client-side)
export async function fetchUserData() {
  try {
    // Retrieve and decode the 'userDetails' cookie from the browser (client-side)
    const userDetailsCookie = getCookieValue("userDetails")
    const accessToken = getCookieValue("token")
    console.log("Document Cookies:", document.cookie)

    console.log("userDetailsCookie:", userDetailsCookie) // Log to ensure it's fetched
    console.log("accessToken:", accessToken) // Log to ensure it's fetched

    if (!userDetailsCookie || !accessToken) {
      console.log("User not authenticated or token missing")
      return {
        error: "User not authenticated or token missing",
        username: "",
        joinedDate: "",
        balance: "",
        Ranking: "",
        winrate: ""
      }
    }

    // Decode the URL-encoded cookie value and parse it
    const decodedUserDetails = decodeURIComponent(userDetailsCookie)
    const parsedUserDetails = JSON.parse(decodedUserDetails)

    console.log(parsedUserDetails, accessToken, "hiiiii")
    // Verify the token with the backend (send the token in Authorization header)
    const verifyResponse = await axios.post(
      "/api/verifyToken",
      {
        userId: parsedUserDetails.id, // Send data in the body
        username: parsedUserDetails.username,
        token: accessToken // Send the token in the body
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}` // (Optional) token in header as well
        },
        withCredentials: true
      }
    )

    if (verifyResponse.status === 200) {
      // Fetch user balance using access token
      const balanceResponse = await axios.get(`/api/balance`, {
        params: {
          id: parsedUserDetails.id,
          username: parsedUserDetails.username
        },
        headers: {
          Authorization: `Bearer ${accessToken}` // Send the token in the Authorization header
        },
        withCredentials: true
      })
      console.log("Balance Response:", balanceResponse.data)

      const timestamp = balanceResponse.data?.joinedDate || null // Default to null if undefined
      const date = timestamp
        ? new Date(timestamp).toISOString().split("T")[0]
        : ""

      return {
        joinedDate: date || "",
        username: balanceResponse.data.username || "",
        balance: balanceResponse.data.balanceINR || "",
        Ranking: balanceResponse.data.Ranking || "",
        winrate: balanceResponse.data.winRate || ""
      }
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("Axios error:", err.response) // Log the Axios error response
    } else {
      console.error("Error fetching user details:", err) // Log any other error
    }
    return {
      username: "",
      joinedDate: "",
      balance: "",
      Ranking: "",
      winrate: ""
    }
  }
}

// Function to fetch data server-side
export const getServerSideProps = async context => {
  // Access cookies from the request headers
  const cookies = cookie.parse(context.req.headers.cookie || "")
  const userDetails = cookies.userDetails
    ? JSON.parse(decodeURIComponent(cookies.userDetails))
    : null
  const accessToken = cookies.accessToken || null

  if (!userDetails || !accessToken) {
    return {
      redirect: {
        destination: "/signin", // Redirect to sign-in page if not authenticated
        permanent: false
      }
    }
  }

  // Pass the parsed cookies to the component as props
  return {
    props: {
      userDetails,
      accessToken
    }
  }
}

export async function getCombinedData() {
  const userDetails = await fetchUserData()
  return {
    userDetails
  }
}
