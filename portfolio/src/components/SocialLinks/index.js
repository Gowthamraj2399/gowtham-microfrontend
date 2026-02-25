import React from "react";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";

const SocialLinks = () => {
  const onLinkOpen = (event, link) => {
    console.log(event, link);
    event.preventDefault();
    window.open(link, "_blank");
  };
  return (
    <>
      <div className="hidden fixed inset-y-0 lg:flex flex-col justify-center z-50 mx-8 after:content-[''] after:w-0.5 after:h-20 after:mx-2.5 after:bg-black dark:after:bg-dark-white before:content-[''] before:w-0.5 before:h-20 before:mx-2.5 before:bg-black dark:before:bg-dark-white">
        <div>
          {/* <div className="my-2">
            <div
              className="cursor-pointer"
              onClick={(event) =>
                onLinkOpen(event, 'https://www.instagram.com/gowthamraj.v/')
              }
            >
              <FaInstagram
                size={24}
                className="transition-all scale-95 hover:scale-100 hover:text-pink-700 "
              />
            </div>
          </div> */}
          <div className="my-2">
            <div
              className="cursor-pointer"
              onClick={(event) =>
                onLinkOpen(event, "https://www.linkedin.com/in/gowthamraj-dev/")
              }
            >
              <FaLinkedin
                size={24}
                className="transition-all scale-95 hover:scale-100 hover:text-blue-900 dark:text-dark-text dark:hover:text-blue-900"
              />
            </div>
          </div>
          <div className="my-2">
            <div
              className="cursor-pointer"
              onClick={(event) =>
                onLinkOpen(event, "https://twitter.com/gowtham23091999")
              }
            >
              <FaTwitter
                size={24}
                className="transition-all scale-95 hover:scale-100 hover:text-blue-500 dark:text-dark-text dark:hover:text-blue-500"
              />
            </div>
          </div>
          {/* <div className="my-2">
            <div
              className="cursor-pointer"
              onClick={(event) =>
                onLinkOpen(
                  event,
                  "https://www.facebook.com/profile.php?id=100037428134851"
                )
              }
            >
              <FaFacebookSquare
                size={24}
                className="transition-all scale-95 hover:scale-100 hover:text-blue-900"
              />
            </div>
          </div> */}
          <div className="my-2">
            <div
              className="cursor-pointer"
              onClick={(event) =>
                onLinkOpen(event, "https://github.com/Gowthamraj2399")
              }
            >
              <FaGithub
                size={24}
                className="transition-all scale-95 hover:scale-100 dark:text-dark-text"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden fixed lg:block z-50 -right-16 top-2/4 rotate-90">
        <span>
          <p className="text-black dark:text-dark-text text-sm mx-2 after:content-[''] after:w-16 after:h-0.5 after:absolute after:top-2.5 after:-right-20 after:mx-2.5 after:bg-black dark:after:bg-dark-white before:content-[''] before:absolute before:top-2.5 before:-left-20 before:w-16 before:h-0.5 before:mx-2.5 before:bg-black dark:before:bg-white font-Montserrat font-semibold">
            gowthamraj2399@gmail.com
          </p>
        </span>
      </div>
    </>
  );
};

export default SocialLinks;
