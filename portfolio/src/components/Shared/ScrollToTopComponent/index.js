import React, { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";

export default function ScrollToTopComponent() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Button is displayed after scrolling for 500 pixels
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 md:bottom-10 md:right-10 z-50">
      {isVisible && (
        <div
          onClick={scrollToTop}
          className="h-10 w-10 md:h-14 md:w-14 bg-black/50 shadow-md flex items-center justify-center cursor-pointer rounded-full z-50"
        >
          <FaChevronUp className="text-white text-xs md:text-xl" />
        </div>
      )}
    </div>
  );
}
