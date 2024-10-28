"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import axios from "axios"

// Schema for input validation
const signinSchema = z.object({
  username: z.string(),
  password: z.string().min(8)
})

export default function SigninAuth() {
  const router = useRouter()

  // Input state
  const [postInputs, setPostInputs] = useState({
    username: "",
    password: ""
  })

  // Alert state
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  // Form submit handler
  const handleSubmit = async e => {
    e.preventDefault()

    // Validate inputs
    const { success } = signinSchema.safeParse(postInputs)
    if (!success) {
      setShowAlert(true)
      setAlertMessage("Invalid Credentials")
      setTimeout(() => setShowAlert(false), 1500)
      return
    }

    try {
      // Attempt sign in
      const response = await axios.post("/api/signin", {
        username: postInputs.username,
        password: postInputs.password
      })

      const data = response.data

      // Handle success
      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("userDetails", JSON.stringify(data.userDetails))
        setShowAlert(true)
        setAlertMessage("Signed In Successfully")
        setTimeout(() => {
          setShowAlert(false)
          router.push("/dashboard")
        }, 1500)
      }
    } catch (error) {
      // Axios error handling
      if (axios.isAxiosError(error)) {
        const status = error.response?.status

        if (status === 401 || status === 404) {
          setShowAlert(true)
          setAlertMessage("Invalid Credentials")
        } else if (status === 402) {
          setShowAlert(true)
          setAlertMessage("Already Logged in from another browser")
        } else {
          setShowAlert(true)
          setAlertMessage("An unexpected error occurred.")
        }
      } else {
        // Network or other errors
        setShowAlert(true)
        setAlertMessage("Network error, please try again later.")
      }
      setTimeout(() => setShowAlert(false), 1500)
    }
  }

  return (
    <div>
      {/* Alert Message */}
      {showAlert && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
          <div
            className="p-4 mb-4 text-lg bg-[#b4ecc1] text-[#28a745] rounded-lg border-2 border-[#28a745]"
            role="alert"
          >
            {alertMessage}
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="flex justify-center flex-col bg-white text-gray-900 h-screen w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div>
              <div className="text-center text-3xl font-bold">
                Sign in to your Account
              </div>
              <div className="text-center p-2">
                Don&apos;t have an account?
                <button
                  className="hover:text-black text-slate-700 hover:underline text-lg font-bold ml-1"
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </button>
              </div>

              {/* Username Input */}
              <LabelInput
                Label="Username"
                name="username"
                placeholder="Enter your username"
                type="string"
                onChange={e =>
                  setPostInputs({ ...postInputs, username: e.target.value })
                }
              />

              {/* Password Input */}
              <LabelInput
                Label="Password"
                placeholder=""
                type="password"
                name="password"
                onChange={e =>
                  setPostInputs({ ...postInputs, password: e.target.value })
                }
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-8 w-full text-white bg-black border border-black hover:bg-gray-700 rounded-lg text-sm px-5 py-2.5"
              >
                Sign In
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// LabelInput Component
function LabelInput({ Label, placeholder, onChange, type, name }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="mt-8 relative">
      <label className="block mb-1 text-sm font-semibold text-black">
        {Label}
      </label>
      <input
        name={name}
        onChange={onChange}
        type={type === "password" && showPassword ? "text" : type}
        className="w-96 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        placeholder={placeholder}
        required
      />
      {type === "password" && (
        <span
          className="absolute right-3 top-9 cursor-pointer text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  )
}