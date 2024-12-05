"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import validator from "validator";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const signUpSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters long" })
    .max(30, { message: "Username can't be more than 30 characters" }),
  mobile: z
    .string()
    .min(10, { message: "Enter a valid mobile number" })
    .refine((val) => validator.isMobilePhone(val, "any"), {
      message: "Invalid mobile phone number",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      message: "Password must contain at least one special character",
    }),
  email: z.string().email({ message: "Invalid email address" }),
});

export default function SignupBox() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [errors, setErrors] = useState({
    username: "",
    mobile: "",
    password: "",
    email: "",
  });

  const [postInputs, setPostInputs] = useState({
    username: "",
    mobile: "",
    password: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ username: "", mobile: "", password: "", email: "" });
    const result = signUpSchema.safeParse(postInputs);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setErrors((prev) => ({ ...prev, [issue.path[0]]: issue.message }));
      });
      return; // stop further execution
    }

    try {
      const response = await axios.post("/api/signup", postInputs, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        // Successful sign up
        setAlertMessage("Sign Up Successful");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          router.push("/signin"); // Redirect only on success
        }, 1500);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Access the error response status
          if (error.response.status === 401) {
            setAlertMessage("Username already exists");
          } else if (error.response.status === 400) {
            setAlertMessage("Email already exists");
          } else {
            setAlertMessage("Sign Up failed");
          }
        } else {
          // Fallback for unexpected errors
          setAlertMessage("An error occurred, please try again");
        }
      } else {
        // Handle non-Axios errors (if any)
        setAlertMessage("Unexpected error occurred");
      }
      setShowAlert(true);

      // Prevent redirection if an error occurs
      setTimeout(() => {
        setShowAlert(false);
      }, 1500);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostInputs((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen w-screen bg-black flex flex-col justify-center items-center">
      {showAlert && (
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
         <div
            className="p-4 mb-4 text-xl font-mono glow2 bg-black text-white rounded-lg border-2 border-white"
            role="alert"
          >
            {alertMessage}
          </div>
        </div>
      )}

      <div className="w-full glow2 max-w-md p-8 space-y-8 bg-zinc-950 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center">Create Your Account</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <LabelInput
              Label="Username"
              name="username"
              placeholder="Enter your username"
              type="text"
              onChange={handleInputChange}
              error={errors.username}
            />

            <LabelInput
              Label="Email"
              name="email"
              placeholder="Enter your email address"
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
              placeholder="Enter your password"
              type="password"
              onChange={handleInputChange}
              error={errors.password}
            />


          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-white">
                I agree to the Terms and Conditions
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="transition duration-300 ease-in-out transform hover:scale-105 group relative w-full flex justify-center py-2 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            className="font-medium text-indigo-400 hover:text-indigo-200"
            onClick={() => {
              router.push("/signin");
            }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}


function LabelInput({ Label, placeholder, onChange, type, error, name }) {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility only for password fields
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const currentInput = e.target;
    const formElements = Array.from(document.querySelectorAll("input")); // Get all input fields
    const currentIndex = formElements.indexOf(currentInput);

    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent default behavior of the ArrowDown key
      const nextInput = formElements[currentIndex + 1];
      if (nextInput) nextInput.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent default behavior of the ArrowUp key
      const prevInput = formElements[currentIndex - 1];
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-white">
        {Label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          type={type === "password" && showPassword ? "text" : type}
          className="text-black appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={placeholder}
          required
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-700"
          >
            {showPassword ? (
              <FaEyeSlash size={20} />
            ) : (
              <FaEye size={20} />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}