"use client";

import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <style jsx>{`
        .spinner-border {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          vertical-align: text-bottom;
          border: 0.25em solid black;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border .75s linear infinite;
        }
        
        @keyframes spinner-border {
          to { transform: rotate(360deg); }
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}

// Add this to your globals.css if it doesn't exist
// @keyframes spin {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }