import React, { useState } from 'react';
import './style.css';
const SideNav = (props) => {
  const [srollYPosition, setSrollYPosition] = useState(0);
  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };

  const navHighligher = () => {};

  window.addEventListener('scroll', navHighligher);
  return (
    <div className="fixed inset-y-0 flex flex-col justify-center z-50 mx-4">
      <div
        className="cursor-pointer my-4 p-1 border-t-2 border-white"
        onClick={props.onHeroClick}
      >
        <p>Home</p>
      </div>
      <div
        className="cursor-pointer my-4 p-1 border-t-2 border-white"
        onClick={props.onAboutClick}
      >
        <p>About</p>
      </div>
      <div
        className="cursor-pointer my-4 p-1 border-t-2 border-white"
        onClick={props.onTechnologiesClick}
      >
        <p>Technologies</p>
      </div>
      <div
        className="cursor-pointer my-4 p-1 border-t-2 border-white"
        onClick={props.onTestimonialsClick}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <p className={`${!hover && 'hidden'} transition-all`}>Testimonials</p>
      </div>
      <div
        className={`cursor-pointer my-4 p-1 border-t-2 border-white`}
        onClick={props.onContactClick}
      >
        <p>Contact</p>
      </div>
    </div>
  );
};

export default SideNav;
