import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * CustomSwitch component using GSAP for animations
 * 
 * Props:
 * - checked: boolean - current state of the switch
 * - onChange: (checked: boolean) => void - callback when toggled
 * - disabled?: boolean - disables interaction and dims the switch
 * - size?: 'small' | 'default' - size variant
 */
export default function CustomSwitch({
  checked,
  onChange,
  disabled = false,
  size = 'default',
}) {
  const width = size === 'small' ? 32 : 40;
  const height = size === 'small' ? 16 : 20;
  const knobSize = size === 'small' ? 12 : 16;
  const translateX = width - knobSize - 4; // 2px margin each side

  const knobRef = useRef(null);
  const trackRef = useRef(null);

  // Animate knob position on checked change
  useEffect(() => {
    if (!knobRef.current) return;
    gsap.to(knobRef.current, {
      x: checked ? translateX : 2,
      duration: 0.25,
      ease: 'power2.out',
    });
    gsap.to(trackRef.current, {
      backgroundColor: checked ? '#3b82f6' : '#d1d5db', // blue-500 / gray-300
      duration: 0.25,
    });
  }, [checked, translateX]);

  return (
    <div
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex items-center transition-opacity ${
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'
      }`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: checked ? '#3b82f6' : '#d1d5db' }}
      />
      {/* Knob */}
      <div
        ref={knobRef}
        className="relative bg-white rounded-full shadow-md"
        style={{
          width: `${knobSize}px`,
          height: `${knobSize}px`,
          top: `calc(50% - ${knobSize / 2}px)`,
          left: '2px',
        }}
      />
    </div>
  );
}

/**
 * Example usage:
 *
 * import React, { useState } from 'react';
 * import CustomSwitch from './CustomSwitch';
 *
 * function App() {
 *   const [on, setOn] = useState(false);
 *   return (
 *     <div className="p-4">
 *       <CustomSwitch checked={on} onChange={setOn} />
 *       <p className="mt-2">Switch is {on ? 'On' : 'Off'}</p>
 *     </div>
 *   );
 * }
 */
