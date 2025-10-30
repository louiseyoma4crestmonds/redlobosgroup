import { useEffect, useRef } from "react";

/**
 * Custom hook to detect clicks outside of a specified element.
 * @param {Function} handler - Callback function to execute when a click outside is detected.
 * @returns {Object} - Ref to attach to the element to detect outside clicks.
 */
function useClickOutside(handler: (event: MouseEvent | null) => void) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Function to handle clicks
    const handleClickOutside = (event: MouseEvent | null) => {
      // Check if the click is outside the referenced element
      if (ref.current && !ref.current.contains(event?.target as Node)) {
        handler(event);
      }
    };

    // Attach the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return ref;
}

export default useClickOutside;
