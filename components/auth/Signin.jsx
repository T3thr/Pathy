"use client";

import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

const Signin = () => {
  const { data: session } = useSession(); // Get session from NextAuth
  const { loginUser, adminSignIn, error, clearErrors } = useContext(AuthContext); // AuthContext functions
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSignIn, setIsUsernameSignIn] = useState(true);
  const [googleSignInSuccess, setGoogleSignInSuccess] = useState(false); // State to track Google login success

  const router = useRouter();
  const params = useSearchParams();
  const callBackUrl = params.get("callbackUrl");

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push(callBackUrl || "/"); // Redirect to callback URL or home
    }
  }, [session, callBackUrl, router]);

  // Handle errors from the AuthContext
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  // Submit handler for the login form
  const submitHandler = async (e) => {
    e.preventDefault();

    const credentials = { username, email, password };

    // Check if the credentials are for the admin
    const isAdminLogin = credentials.username === "Admin" && credentials.password === "admin123";

    const result = isAdminLogin
      ? await adminSignIn() // Call adminSignIn from AuthContext if admin credentials
      : await loginUser(credentials); // Call loginUser for regular user credentials

    if (result?.success) {
      toast.success("Login successful!", { autoClose: 2000 });
      setTimeout(() => {
        router.push(callBackUrl || "/"); // Redirect to callback URL or home
        window.location.reload();
      }, 700);
    } else if (result?.message) {
      toast.error(result.message);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    console.log("Redirecting to Google sign-in...");
    const result = await signIn("google", { redirect: false }); // Use redirect: false to stay on the page
    if (result?.error) {
      toast.error("Google sign-in failed!");
    } else {
      setGoogleSignInSuccess(true); // Set success state when Google sign-in is successful
    }
  };

  // Effect to show toast when Google sign-in is successful
  useEffect(() => {
    if (googleSignInSuccess) {
      toast.success("Google sign-in successful!", { autoClose: 2000 });
      router.push(callBackUrl || "/"); // Redirect to callback URL or home
    }
  }, [googleSignInSuccess, callBackUrl, router]);

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
