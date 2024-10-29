// api/auth/signup/route.js

import User from "@/backend/models/User";
import mongodbConnect from "@/backend/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  await mongodbConnect();

  const { name, email, password } = await req.json();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 400 }
    );
  }

  try {
    // Create new user (password will be hashed by the model's pre-save hook)
    const user = await User.create({ name, email, password });
    

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: 'user',
      },
    }, { status: 201 });
    
    if (response.status === 201) {
        toast.success("Signup successful! Please sign in to continue.", {
          autoClose: 3000,
          onClose: () => router.push("/signin"),
        });
        setUser(response.data.user);  // Set the user state
      }
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
}
