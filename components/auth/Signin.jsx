"use client";

import Link from "next/link";
import React, { useState, useContext, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";  // Import signIn method from next-auth
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

const Signin = () => {
  const { data: session, status } = useSession(); // Get session from NextAuth and status
  const { loginUser, adminSignIn, error, clearErrors } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSignIn, setIsUsernameSignIn] = useState(true);
  
  const router = useRouter();
  const params = useSearchParams();
  const callBackUrl = params.get("callbackUrl");

  // Check for error in the URL params (for Google sign-in failure)
  const errorParam = params.get("error");

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push(callBackUrl || "/"); // Redirect to callback URL or home
    }
  }, [session, callBackUrl, router]);

  // Show toast error if any error exists
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrors();
    }
  }, [error, clearErrors]);

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    console.log("Redirecting to Google sign-in...");
    await signIn("google", { redirect: true });  // Redirect to Google sign-in
  };

  // Show toast when Google sign-in is successful
  useEffect(() => {
    if (status === "authenticated" && session) {
      // Show success toast only after successful login
      toast.success("Google sign-in successful!", { autoClose: 2000 });
      router.push(callBackUrl || "/"); // Redirect to callback URL or home
    }
  }, [status, session, callBackUrl, router]);

  // Handle Google sign-in failure (user cancels or sign-in fails)
  useEffect(() => {
    if (errorParam) {
      // Handle error and show a toast
      toast.error("Google sign-in failed. Please try again.");
      // Redirect user back to /signin page if sign-in fails
      router.push("/signin");
    }
  }, [errorParam, router]);

  // Submit handler for the login form (standard username/email password sign-in)
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
