"use client";

import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import { useSession } from "next-auth/react"; // Import useSession
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

const Signin = () => {
  const { data: session } = useSession(); // Get the session data
  const { error, loginUser, clearErrors } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const params = useSearchParams();
  const callBackUrl = params.get("callbackUrl");

  // Redirect to homepage if user is already signed in
  useEffect(() => {
    if (session) {
      router.push("/"); // Redirect to homepage if authenticated
    }
  }, [session, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error]);

  const submitUserHandler = async (e) => {
    e.preventDefault();
    
    const result = await loginUser({ email, password });

    if (result.success) {
      toast.success("Login successful!", {
        autoClose: 2000, // Set duration for 2 seconds
      });

      // Set a timeout to push and reload after the toast disappears
      setTimeout(() => {
        router.push("/"); // Redirect to homepage
        window.location.reload(); // Reload the page
      }, 700); // Match this time with autoClose time
    }  else {
      toast.error(result.message || "Login failed. Please try again.");
      // Stay on the login page
    }
  };

  const submitAdminHandler = async (e) => {
    e.preventDefault();
    router.push("/api/auth/signin?callbackUrl=/"); // Navigate to admin login
  };

  return (
    <div
      style={{ maxWidth: "480px" }}
      className="mt-10 mb-20 p-4 md:p-7 mx-auto rounded bg-white shadow-lg"
    >
      <form onSubmit={submitUserHandler}>
        <h2 className="mb-5 text-2xl font-semibold">User Login</h2>

        <div className="mb-4">
          <label className="block mb-1"> Email </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1"> Password </label>
          <input
            className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full"
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 w-full"
          type="submit"
        >
          Sign In
        </button>

        <div className="mt-4">
          <Link
            href="/signup"
            className="text-blue-500 hover:underline"
          >
            Don’t have an account? Sign up
          </Link>
        </div>
      </form>

      <hr className="my-5" />

      <form onSubmit={submitAdminHandler}>
        <h2 className="mb-5 text-2xl font-semibold">Admin Login</h2>

        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 w-full"
          type="submit"
        >
          Go to Admin Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;
