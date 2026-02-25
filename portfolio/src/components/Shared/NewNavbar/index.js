import React, { useRef } from 'react';
import { CgMenuLeft, CgClose } from 'react-icons/cg';

const NewNavbar = () => {
  const menuRef = useRef(null);

  const Menu = (event) => {
    let list = menuRef.current;

    list.classList.add('top-[80px]');
    list.classList.add('opacity-100');
  };

  const Close = (event) => {
    let list = menuRef.current;
    list.classList.remove('top-[80px]');
    list.classList.remove('opacity-100');
  };
  return (
    <nav className="p-5 bg-white shadow md:flex md:items-center md:justify-between fixed z-50 inset-x-0">
      <div className="flex justify-between items-center">
        <span className="text-2xl cursor-pointer">
          <img
            className="h-10 inline"
            src="https://tailwindcss.com/_next/static/media/social-square.b622e290e82093c36cca57092ffe494f.jpg"
            alt="logo"
          />
          tailwind
        </span>

        <span className="text-3xl cursor-pointer mx-2 md:hidden block">
          <CgMenuLeft name="menu" onClick={Menu} />
          <CgClose name="close" onClick={Close} />
        </span>
      </div>

      <ul
        className="md:flex md:items-center z-50 md:z-auto md:static absolute bg-white w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-500"
        ref={menuRef}
      >
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">
            HOME
          </a>
        </li>
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">
            SERVICE
          </a>
        </li>
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">
            ABOUT
          </a>
        </li>
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">
            CONTACT
          </a>
        </li>
        <li className="mx-4 my-6 md:my-0">
          <a href="#" className="text-xl hover:text-cyan-500 duration-500">
            BLOG'S
          </a>
        </li>

        <button className="bg-cyan-400 text-white font-[Poppins] duration-500 px-6 py-2 mx-4 hover:bg-cyan-500 rounded">
          Get started
        </button>
        <h2 className=""></h2>
      </ul>
    </nav>
  );
};

export default NewNavbar;
