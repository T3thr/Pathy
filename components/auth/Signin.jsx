"use client";

import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

const handleGoogleSignIn = async (callBackUrl) => {
  try {
    console.log("Redirecting to Google sign-in...");
    
    // Trigger Google sign-in
    const result = await signIn("google", { redirect: false }); // Set redirect to false to handle manually

    if (result?.error) {
      // Handle errors if any
      console.error("Google sign-in error:", result.error);
      toast.error("Google sign-in failed. Please try again.");
    } else {
      // Successful sign-in: Show toast and redirect
      toast.success("Google sign-in successful!", { autoClose: 2000 });
      window.location.href = callBackUrl || "/";  // Manually handle redirect
    }
  } catch (error) {
    console.error("An error occurred during Google sign-in:", error);
    toast.error("An error occurred. Please try again.");
  }
};

const Signin = () => {
  const { data: session } = useSession();
  const { error, clearErrors } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSignIn, setIsUsernameSignIn] = useState(true);

  const router = useRouter();
  const params = useSearchParams();
  const callBackUrl = params.get("callbackUrl");

  // Get the error parameter from the URL (for Google sign-in cancellation or failure)
  const errorParam = params.get("error");

  useEffect(() => {
    if (session) {
      router.push(callBackUrl || "/"); // Redirect to the callback URL if available
    }
  }, [session, callBackUrl, router]);

  // Show toast error if any error exists (e.g. for Google sign-in cancellation)
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);


  // Redirect user to /signin when Google sign-in is canceled
  useEffect(() => {
    if (errorParam === "Callback") {
      toast.error("Google sign-in was canceled. Please try again.");
      router.push("/signin"); // Redirect to /signin on cancellation
    }
  }, [errorParam, router]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const credentials = isUsernameSignIn ? { username, password } : { email, password };
    const result = await signIn("credentials", { redirect: false, ...credentials });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => {
        router.push(callBackUrl || "/"); // Redirect to the callback URL or home
        window.location.reload();
      }, 700);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="mb-5 text-3xl font-bold text-center text-gray-800">Welcome Back</h2>

        <div className="flex justify-center mb-4">
          <button
            className={`py-2 px-4 rounded-l-lg ${isUsernameSignIn ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setIsUsernameSignIn(true)}
          >
            Username Sign In
          </button>
          <button
            className={`py-2 px-4 rounded-r-lg ${!isUsernameSignIn ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}
            onClick={() => setIsUsernameSignIn(false)}
          >
            Email Sign In
          </button>
        </div>

        <form onSubmit={submitHandler}>
          {isUsernameSignIn ? (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Username</label>
              <input
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-800 transition duration-200 mb-4"
            type="submit"
          >
            Sign In
          </button>
        </form>

        <button
          className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition duration-200 mb-4"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </button>

        <div className="text-center">
          <Link href="/signup" className="text-blue-500 hover:underline">
            Don’t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
