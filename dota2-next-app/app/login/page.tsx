"use client"

import cookie from "js-cookie";
import React, { useState } from 'react'
import Swal from 'sweetalert2'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const checkLogin = async () => {
    try {
      const response = await fetch("/api/check-login", {
        method: "POST",
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          "content-type": "application/json"
        }
      })

      if (response.ok) {
        cookie.set("token", username)
        Swal.fire({
          title: "Login Success",
          icon: "success"
        }).then(() => {
          window.location.href = "/"

        });
      } else {
        Swal.fire({
          title: "Username or Password \nnot correct",
          icon: "error"
        });
      }

    } catch (error) {
      console.log("Can not fetch data:", error);
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    await checkLogin()

  }

  return (
    <div className='flex-grow'>
      <div className="flex justify-center items-center">
        <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
          <h3 className='text-3xl'>Login</h3>
          <hr className='my-3' />
          <form onSubmit={handleSubmit}>
            <input type="text" onChange={(e) => setUsername(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your username' />
            <input type="password" onChange={(e) => setPassword(e.target.value)} className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your password' />
            <button type='submit' className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>Login</button>
          </form>
          <hr className='my-3' />

        </div>
      </div>
    </div>

  )
}