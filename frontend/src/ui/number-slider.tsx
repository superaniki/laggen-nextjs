"use client";
import React, { useEffect, useRef, useState } from "react";

interface NumberSliderProps {
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  label?: string;
  className?: string;
}

export default function NumberSlider({
  name,
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision = 2,
  label,
  className = "",
}: NumberSliderProps) {
  // DOM refs
  const containerRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [displayValue, setDisplayValue] = useState(value.toFixed(precision));
  const [isEditing, setIsEditing] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isActive, setIsActive] = useState(false);
  
  // Drag tracking refs (not state to avoid re-renders during drag)
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startValueRef = useRef(0);
  const lastXRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const valueChangedDuringDragRef = useRef(false);
  
  // Update display when value changes
  useEffect(() => {
    if (!isEditing) {
      setDisplayValue(value.toFixed(precision));
    }
  }, [value, precision, isEditing]);
  
  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    const display = displayRef.current;
    
    if (!container || !display) return;
    
    // Pointer down handler - start dragging
    const handleMouseDown = (e: PointerEvent) => {
      // Only handle left mouse button
      if (e.button !== 0) return;
      
      // Don't start drag if we're in edit mode
      if (isEditing) return;
      
      e.preventDefault();
      
      // Set up drag state
      isDraggingRef.current = true;
      startXRef.current = e.clientX;
      lastXRef.current = e.clientX;
      startValueRef.current = value;
      accumulatedDeltaRef.current = 0;
      valueChangedDuringDragRef.current = false;
      
      // Set cursor to ew-resize (double arrow)
      document.body.style.cursor = 'ew-resize';
      
      // Add visual feedback
      setIsActive(true);
      
      // Capture pointer to keep tracking even if mouse leaves the window
      try {
        display.setPointerCapture(e.pointerId);
      } catch (err) {
        // Fallback if pointer capture is not supported
        console.log("Pointer capture not supported");
      }
    };
    
    // Pointer move handler - update value during drag
    const handleMouseMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      
      // Calculate delta from last position instead of start position
      // This makes the dragging more reliable when the mouse enters different areas
      const deltaX = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      
      // Accumulate the delta to maintain precision
      accumulatedDeltaRef.current += deltaX;
      
      // Calculate new value based on accumulated delta
      const sensitivity = step / 20; // Adjust sensitivity as needed
      const newValue = startValueRef.current + (accumulatedDeltaRef.current * sensitivity);
      
      // Clamp value to min/max
      const clampedValue = Math.min(Math.max(newValue, min), max);
      
      // Round to precision and update
      const roundedValue = parseFloat(clampedValue.toFixed(precision));
      
      // Check if value has changed
      if (roundedValue !== value) {
        valueChangedDuringDragRef.current = true;
      }
      
      onChange(name, roundedValue);
    };
    
    // Pointer up handler - end dragging
    const handleMouseUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      
      // Store the drag state before resetting it
      const valueChanged = valueChangedDuringDragRef.current;
      
      // Reset drag state
      isDraggingRef.current = false;
      document.body.style.cursor = 'auto';
      
      // Remove visual feedback
      setIsActive(false);
      
      // Release pointer capture
      try {
        display.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Fallback if pointer capture is not supported
        console.log("Pointer release not supported");
      }
      
      // If the value changed during dragging, prevent the click event
      if (valueChanged) {
        // Add a small delay to ensure this happens after any potential click event
        setTimeout(() => {
          valueChangedDuringDragRef.current = false;
        }, 100);
      }
    };
    
    // Single click handler - enter edit mode
    const handleClick = (e: MouseEvent) => {
      // Only handle if we're not dragging and no value change occurred during drag
      if (isDraggingRef.current || valueChangedDuringDragRef.current) {
        // Reset the flag for next time
        valueChangedDuringDragRef.current = false;
        return;
      }
      
      setIsEditing(true);
      
      // Focus and select input on next tick
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 0);
    };
    
    // Add event listeners directly to the DOM
    // Use pointer events instead of mouse events for better cross-browser support
    display.addEventListener('pointerdown', handleMouseDown);
    display.addEventListener('click', handleClick);
    display.addEventListener('pointermove', handleMouseMove);
    display.addEventListener('pointerup', handleMouseUp);
    display.addEventListener('pointercancel', handleMouseUp); // Handle cases where pointer is canceled
    
    // Cleanup
    return () => {
      display.removeEventListener('pointerdown', handleMouseDown);
      display.removeEventListener('click', handleClick);
      display.removeEventListener('pointermove', handleMouseMove);
      display.removeEventListener('pointerup', handleMouseUp);
      display.removeEventListener('pointercancel', handleMouseUp);
      document.body.style.cursor = 'auto';
    };
  }, [name, value, step, min, max, precision, onChange, isEditing]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value);
  };
  
  // Handle input blur - commit value
  const handleInputBlur = () => {
    commitInputValue();
  };
  
  // Handle key press in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitInputValue();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setDisplayValue(value.toFixed(precision));
    }
  };
  
  // Commit input value
  const commitInputValue = () => {
    const newValue = parseFloat(displayValue);
    if (!isNaN(newValue)) {
      const clampedValue = Math.min(Math.max(newValue, min), max);
      onChange(name, clampedValue);
      setDisplayValue(clampedValue.toFixed(precision));
    } else {
      setDisplayValue(value.toFixed(precision));
    }
    setIsEditing(false);
  };
  
  // Handle increment/decrement
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = Math.min(value + step, max);
    onChange(name, parseFloat(newValue.toFixed(precision)));
  };
  
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = Math.max(value - step, min);
    onChange(name, parseFloat(newValue.toFixed(precision)));
  };
  
  // Generate label text
  const displayLabel = label || name[0].toUpperCase() + name.substring(1);
  
  return (
    <div 
      ref={containerRef}
      className={`flex items-center gap-4 mb-2 ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Label - fixed width */}
      <div className="w-32 text-right text-sm font-medium text-gray-700">
        {displayLabel}
      </div>
      
      {/* Input container - take remaining width */}
      <div className="flex-1 relative">
        {isEditing ? (
          // Edit mode - text input
          <input
            ref={inputRef}
            className="w-full h-10 px-8 text-center outline-none border bg-default-100 hover:bg-default-50 focus:bg-default-50 focus:outline-none"
            
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            type="text"
          />
        ) : (
          // Display mode - draggable number
          <div
            ref={displayRef}
            className={`w-full h-10 px-8 flex items-center justify-center transition-colors duration-150 ease-in-out
              ${isEditing ? "cursor-text" : "cursor-ew-resize"}`}
            style={{
              borderRadius: '10px', // Full rounded (pill shape)
              backgroundColor: isActive ? '#e5e7eb' : isHovering ? '#e5e7eb' : '#f4f4f5',
              color: isActive ? '#000000' : '#000000'
            }}
          >
            <span className="select-none">{displayValue}</span>
          </div>
        )}
        
        {/* Buttons - only show when hovering and not editing */}
        {!isEditing && (
          <>
            {/* Decrement button */}
            <div
              className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-6 h-6 transition-opacity
                ${isHovering ? "opacity-100" : "opacity-0"}`}
            >
              <button
                className="w-6 h-6 rounded-full bg-white shadow-sm hover:bg-gray-200 flex items-center justify-center"
                onClick={handleDecrement}
                tabIndex={-1}
                style={{ transition: 'all 0.15s ease' }}
              >
                <span className="text-gray-600 font-medium">-</span>
              </button>
            </div>
            
            {/* Increment button */}
            <div
              className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-6 h-6 transition-opacity
                ${isHovering ? "opacity-100" : "opacity-0"}`}
            >
              <button
                className="w-6 h-6 rounded-full bg-white shadow-sm hover:bg-gray-200 flex items-center justify-center"
                onClick={handleIncrement}
                tabIndex={-1}
                style={{ transition: 'all 0.15s ease' }}
              >
                <span className="text-gray-600 font-medium">+</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

