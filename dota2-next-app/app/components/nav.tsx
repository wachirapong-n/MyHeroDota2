"use client"

import React from "react";
import Link from "next/link";
import cookie from "js-cookie";
import { useState, useEffect } from "react";


const Navbar = () => {
  const [token, setToken] = useState(null);


  useEffect(() => {
    var token = cookie.get("token");
    setToken(token)
  }, [])

  const logout = () => {
    cookie.remove("token");
    setToken(null);
  }
  return (
    <>
      <nav className="bg-slate-900 border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-start p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="../favicon.ico" className="h-8" alt="dota-logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
          </a>

          <div className="hidden w-full md:block md:w-auto ml-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a href="/" className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" aria-current="page">Home</a>
              </li>
              <li>
                <a href="/heroes/hero-list" className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Heroes</a>
              </li>
              <li>
                <a href="/heroes/my-favorite-list" className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">My Favorite Heroes</a>
              </li>
              {token && (<li className="text-white">
                Admin: {token}
              </li>)}
              {!token ? (
                <li>
                  <a href="/login" className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</a>
                </li>) : (
                <li>
                  <a href="/" onClick={logout} className="block py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</a>
                </li>)}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;