
"use client"

// components/VideoPlayer.js
import React from 'react';

export default function VideoPlayer ()  {
  return (
    <div className="video-container">
      <video className="video-player" controls>
        <source src="https://www.youtube.com/watch?v=3H9F-RRiGcc" type="video/mp4" />
      </video>
    </div>
  );
};

