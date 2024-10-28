"use client"
import { useState } from "react"

const DoubleEndedSlider = () => {
  const [minValue, setMinValue] = useState(50)
  const [maxValue, setMaxValue] = useState(150)

  const handleMinChange = e => {
    const value = parseInt(e.target.value)
    if (value <= maxValue) {
      setMinValue(value)
    }
  }

  const handleMaxChange = e => {
    const value = parseInt(e.target.value)
    if (value >= minValue) {
      setMaxValue(value)
    }
  }

  return (
    <div className="w-72 relative">
      <div className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-gray-300 w-full z-0"></div>

      {/* Min slider (left handle) */}
      <input
        type="range"
        min="50"
        max="200"
        value={minValue}
        onChange={handleMinChange}
        className="absolute z-10 w-full appearance-none bg-transparent h-1 pointer-events-auto"
        style={{ pointerEvents: "auto" }}
      />

      {/* Max slider (right handle) */}
      <input
        type="range"
        min="50"
        max="200"
        value={maxValue}
        onChange={handleMaxChange}
        className="absolute z-20 w-full appearance-none bg-transparent h-1 pointer-events-auto"
        style={{ pointerEvents: "auto" }}
      />
      <br />
      <p className="mt-4 text-lg">
        Selected Range:{" "}
        <span>
          {minValue} - {maxValue}
        </span>
      </p>
    </div>
  )
}

export default DoubleEndedSlider