"use client"
import { useState } from "react"
import axios from "axios"
// import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { z } from "zod"
import validator from "validator"
import { FaEye, FaEyeSlash } from "react-icons/fa"

const signUpSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters long" })
    .max(30, { message: "Username can't be more than 30 characters" }),
  mobile: z
    .string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .refine(val => validator.isMobilePhone(val, "any"), {
      message: "Invalid mobile phone number"
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine(val => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter"
    })
    .refine(val => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter"
    })
    .refine(val => /\d/.test(val), {
      message: "Password must contain at least one number"
    })
    .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character"
    }),

  email: z.string().email({ message: "Invalid email address" })
})

export default function SignupBox() {
  // const { data: session, status } = useSession();
  const router = useRouter()
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [errors, setErrors] = useState({
    username: "",
    mobile: "",
    password: "",
    email: ""
  })

  const [postInputs, setPostInputs] = useState({
    username: "",
    mobile: "",
    password: "",
    email: ""
  })

  const handleSubmit = async e => {
    e.preventDefault()
    setErrors({ username: "", mobile: "", password: "", email: "" })
    const result = signUpSchema.safeParse(postInputs)

    if (!result.success) {
      result.error.issues.forEach(issue => {
        setErrors(prev => ({ ...prev, [issue.path[0]]: issue.message }))
      })
      return // stop further execution
    }

    try {
      const response = await axios.post("/api/signup", postInputs, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (response.status === 200) {
        // Successful sign up
        setAlertMessage("Sign Up Successful")
        setShowAlert(true)
        setTimeout(() => {
          setShowAlert(false)
          router.push("/signin") // Redirect only on success
        }, 1500)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Access the error response status
          if (error.response.status === 401) {
            setAlertMessage("Username already exists")
          } else if (error.response.status === 400) {
            setAlertMessage("Email already exists")
          } else {
            setAlertMessage("Sign Up failed")
          }
        } else {
          // Fallback for unexpected errors
          setAlertMessage("An error occurred, please try again")
        }
      } else {
        // Handle non-Axios errors (if any)
        setAlertMessage("Unexpected error occurred")
      }
      setShowAlert(true)

      // Prevent redirection if an error occurs
      setTimeout(() => {
        setShowAlert(false)
      }, 1500)
    }
  }

  // useEffect(() => {
  //   if (status === "loading") return; // Wait for session status to resolve
  //   if (session) router.push("/dashboard");
  // }, [session, status, router]);

  const handleInputChange = e => {
    const { name, value } = e.target
    setPostInputs(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      {showAlert && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
          <div
            className="p-4 mb-4 text-lg bg-[#b4ecc1] text-[#28a745] rounded-lg dark:text-[#155724] border-2 border-[#28a745] shadow-3xl"
            role="alert"
          >
            {alertMessage}
          </div>
        </div>
      )}

      <div className="flex justify-center flex-col  bg-white h-screen w-full">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <div>
              <div className="text-center text-3xl font-bold text-gray-900">
                Create an Account
              </div>
              <div className="text-center text-s lg:text-m text-slate-600">
                Already have an account?
                <button
                  className="hover:text-black hover:underline text-lg font-bold ml-1 text-slate-700 "
                  onClick={() => {
                    router.push("/signin")
                  }}
                >
                  login
                </button>
              </div>

              <LabelInput
                Label="Username"
                name="username"
                placeholder="Enter your name"
                type="text"
                onChange={handleInputChange}
                error={errors.username}
              />

              <LabelInput
                Label="Email"
                name="email"
                placeholder="Enter your email"
                type="email"
                onChange={handleInputChange}
                error={errors.email}
              />

              <LabelInput
                Label="Mobile Number"
                name="mobile"
                placeholder="Enter your mobile number"
                type="text"
                onChange={handleInputChange}
                error={errors.mobile}
              />

              <LabelInput
                Label="Password"
                name="password"
                placeholder=""
                type="password"
                onChange={handleInputChange}
                error={errors.password}
              />

              <button
                type="submit"
                className="mt-8 w-full text-white bg-white border border-black-300 focus:outline-none hover:bg-slate-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              >
                Sign up
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

function LabelInput({ Label, placeholder, onChange, type, error, name }) {
  const [showPassword, setShowPassword] = useState(false)

  // Toggle password visibility only for password fields
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div>
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
        {/* Show eye icon only if it's a password input */}
        {type === "password" && (
          <span
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </div>
  )
}