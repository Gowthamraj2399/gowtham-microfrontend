import React, { useRef, useState } from "react";
import { CgMenuLeft, CgClose } from "react-icons/cg";
import {
  FaLinkedin,
  FaTwitter,
  FaGithub,
} from "react-icons/fa";
import {
  blueShadowColor,
  whiteShadowColor,
} from "../../../constants/constants";
import MobileToggleSwitch from "../../MobileToggleSwitch";

const Navbar = (props) => {
  const listRef = useRef(null);
  const [hidden, setHidden] = useState(false);

  const Menu = (event) => {
    let list = listRef.current;
    setHidden(true);
    list.classList.remove("top-[-400px]");
    list.classList.remove("opacity-0");
    list.classList.add("top-[70px]");
    list.classList.add("opacity-100");
  };

  const Close = (event) => {
    let list = listRef.current;
    setHidden(false);
    list.classList.add("top-[-400px]");
    list.classList.add("opacity-0");
    list.classList.remove("top-[70px]");
    list.classList.remove("opacity-100");
  };
  const onLinkOpen = (event, link) => {
    console.log(event, link);
    event.preventDefault();
    window.open(link, "_blank");
  };
  return (
    <div className="sticky top-0 z-50 inset-x-0">
      <nav className="absolute inset-x-0 md:px-16 py-4 text-black uppercase text-xs font-bold dark:bg-dark-black bg-white shadow-md dark:shadow-dark-shadow dark:shadow-md">
        <div className="container flex flex-1 justify-between items-center">
          <div className="cursor-pointer flex text-xl justify-between flex-1 items-center">
            <div className="flex">
              <h1
                className="text-4xl font-bold text-primary-red dark:text-dark-primary"
                style={{
                  textShadow: `2px 2px ${
                    props.theme === "light" ? blueShadowColor : whiteShadowColor
                  }`,
                }}
              >
                GR
              </h1>
              {/* <h1
                className="text-4xl font-bold text-secondary-blue "
                {{ textShadow: `2px 2px ${redShadowColor}` }}
              >
                GR
              </h1> */}
            </div>

            <div className="text-3xl cursor-pointer mx-2 md:hidden">
              {!hidden && (
                <CgMenuLeft
                  name="menu"
                  onClick={Menu}
                  className="dark:text-dark-text"
                />
              )}
              {hidden && (
                <CgClose
                  name="close"
                  onClick={Close}
                  className="dark:text-dark-text"
                />
              )}
            </div>
          </div>
          <ul
            class="md:flex md:items-center z-[-1] md:z-auto md:static absolute bg-white dark:bg-dark-black dark:text-dark-text w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-100 shadow-md md:shadow-none dark:shadow-dark-shadow"
            ref={listRef}
          >
            <li
              className="cursor-pointer mx-4 p-1 my-4 md:my-0"
              onClick={() => {
                props.onHomeClick();
                Close();
              }}
            >
              Home
            </li>
            <li
              className="cursor-pointer mx-4 p-1 my-4 md:my-0"
              onClick={() => {
                props.onAboutClick();
                Close();
              }}
            >
              About
            </li>
            <li
              className="cursor-pointer mx-4 p-1 my-4 md:my-0"
              onClick={() => {
                props.onTechnologiesClick();
                Close();
              }}
            >
              Skills
            </li>
            <li
              className="cursor-pointer mx-4 p-1 my-4 md:my-0"
              onClick={() => {
                props.onExperienceClick();
                Close();
              }}
            >
              Experience
            </li>
            <li
              className="cursor-pointer mx-4 p-1 my-4 md:my-0"
              onClick={() => {
                props.onProjectsClick();
                Close();
              }}
            >
              Projects
            </li>
            <li className="cursor-pointer mx-4 p-1 my-4 md:my-0">
              <button
                className='className=" text-white uppercase text-xs font-bold px-2 py-2 rounded-lg bg-gradient-to-r from-green-400 dark:from-dark-primary to-blue-500 hover:from-pink-500 hover:to-yellow-500 cursor-pointer"'
                onClick={() => {
                  props.onContactClick();
                  Close();
                }}
              >
                Lets Talk
              </button>
            </li>
            <div className="flex md:hidden mx-2">
              {/* <div className="mx-2">
                <div
                  className="cursor-pointer"
                  onClick={(event) =>
                    onLinkOpen(event, "https://www.instagram.com/gowthamraj.v/")
                  }
                >
                  <FaInstagram
                    size={24}
                    className="transition-all scale-95 hover:scale-100 hover:text-pink-700 "
                  />
                </div>
              </div> */}
              <div className="mx-2">
                <div
                  className="cursor-pointer"
                  onClick={(event) =>
                    onLinkOpen(
                      event,
                      "https://www.linkedin.com/in/gowthamraj-dev/"
                    )
                  }
                >
                  <FaLinkedin
                    size={24}
                    className=" transition-all scale-95 hover:scale-100 hover:text-blue-900 "
                  />
                </div>
              </div>
              <div className="mx-2">
                <div
                  className="cursor-pointer"
                  onClick={(event) =>
                    onLinkOpen(event, "https://twitter.com/gowtham23091999")
                  }
                >
                  <FaTwitter
                    size={24}
                    className="transition-all scale-95 hover:scale-100 hover:text-blue-500 "
                  />
                </div>
              </div>
              {/* <div className="mx-2">
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
              <div className="mx-2">
                <div
                  className="cursor-pointer"
                  onClick={(event) =>
                    onLinkOpen(event, "https://github.com/Gowthamraj2399")
                  }
                >
                  <FaGithub
                    size={24}
                    className="transition-all scale-95 hover:scale-100"
                  />
                </div>
              </div>
            </div>

            <MobileToggleSwitch onThemeToggleClick={props.onThemeToggleClick} />
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
