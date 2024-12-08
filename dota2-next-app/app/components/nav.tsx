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
      <div className="w-full h-20 bg-slate-700 top-0">
        <div className="mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">

            <ul className="hidden md:flex gap-x-6 text-white">
              <li>
                <Link href="/">
                  <p>Dashboard</p>
                </Link>
              </li>
              <li>
                <Link href="/heroes/hero-list">
                  <p>Heroes</p>
                </Link>
              </li>
              <li>
                <Link href="/heroes/my-favorite-list">
                  <p>My Heroes List</p>
                </Link>
              </li>
              {!token ? (<li>

                <Link href="/login">
                  <p>Login</p>
                </Link>
              </li>) : (
                <li>
                  <Link href="/" onClick={logout}>
                    <p>Logout</p>
                  </Link>
                </li>
              )}

              {token && (<li>
                current user: {token}
              </li>)}
            </ul>

          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;