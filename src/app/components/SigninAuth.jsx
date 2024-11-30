"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

// Schema for input validation
const signinSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export default function SigninAuth() {
  const router = useRouter();

  // Input state
  const [postInputs, setPostInputs] = useState({
    username: "",
    password: "",
  });

  // Alert state
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    const { success } = signinSchema.safeParse(postInputs);
    if (!success) {
      setShowAlert(true);
      setAlertMessage("Invalid Credentials");
      // setTimeout(() => setShowAlert(false), 1500);
      return;
    }

    try {
      // Attempt sign in
      const response = await axios.post("/api/signin", {
        username: postInputs.username,
        password: postInputs.password,
      });

      const data = response.data;

      // Handle success
      if (response.status === 201) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userDetails", JSON.stringify(data.userDetails));
        setShowAlert(true);
        setAlertMessage("Signed In Successfully");
        setTimeout(() => {
          setShowAlert(false);
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      // Axios error handling
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 401 || status === 404) {
          setShowAlert(true);
          setAlertMessage("Invalid Credentials");
        } else if (status === 402) {
          setShowAlert(true);
          setAlertMessage("Already Logged in from another browser");
        } else {
          setShowAlert(true);
          setAlertMessage("An unexpected error occurred.");
        }
      } else {
        // Network or other errors
        setShowAlert(true);
        setAlertMessage("Network error, please try again later.");
      }
      setTimeout(() => setShowAlert(false), 1500);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black flex justify-center items-center">
      {/* Alert Message */}
      {showAlert && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
         <div
            className="p-4 mb-4 text-xl font-mono glow2 bg-black text-white rounded-lg border-2 border-white"
            role="alert"
          >
            {alertMessage}
          </div>
        </div>
      )}

      {/* Form Section */}
      <div className="w-full glow2 max-w-md p-8 space-y-8 bg-zinc-950 rounded-lg shadow-lg">
        <h2 className="text-2xl text-white font-bold text-center">Sign In to Your Account</h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {/* Username Input */}
            <LabelInput
              Label="Username"
              name="username"
              placeholder="Enter your username"
              type="text"
              onChange={(e) =>
                setPostInputs({ ...postInputs, username: e.target.value })
              }
            />

            {/* Password Input */}
            <LabelInput
              Label="Password"
              name="password"
              placeholder="Enter your password"
              type="password"
              onChange={(e) =>
                setPostInputs({ ...postInputs, password: e.target.value })
              }
            />
          </div>

          <div className="flex items-center justify-between ">
            {/* Remember Me Checkbox */}
            <div className="flex items-center ">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-white opacity-85">
                Remember me
              </label>
            </div>

            {/* Forgot Password Link */}
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-400 hover:text-indigo-200"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            {/* Sign In Button */}
            <button
              type="submit"
              className="transition duration-300 ease-in-out transform hover:scale-105 group relative text-base w-full flex justify-center py-2 px-4 border border-transparent font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign In
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-center text-sm text-white opacity-80">
          Don't have an account?{" "}
          <button
            className="font-medium text-indigo-400 hover:text-indigo-200"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

function LabelInput({ Label, placeholder, onChange, type, name }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleKeyDown = (e) => {
    const currentInput = e.target;
    const formElements = Array.from(document.querySelectorAll("input")); // Get all input fields
    const currentIndex = formElements.indexOf(currentInput);

    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent the default arrow key behavior
      const nextInput = formElements[currentIndex + 1];
      if (nextInput) nextInput.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevInput = formElements[currentIndex - 1];
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="mt-8 relative">
      <label className="block mb-1 text-sm font-semibold text-white">
        {Label}
      </label>
      <div className="relative">
        {/* Input field */}
        <input
          name={name}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          type={type === "password" && showPassword ? "text" : type}
          className="w-full bg-gray-50 border text-black border-gray-300 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 pr-10"
          placeholder={placeholder}
          required
        />

        {/* Toggle password visibility button */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800 focus:outline-none"
            tabIndex={-1} // Prevent tabbing to this button
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

