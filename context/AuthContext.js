"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signIn as nextAuthSignIn } from "next-auth/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const router = useRouter();

  // Fetch the current user data from the server when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/auth/session");
        setUser(data.user); // Set the fetched user data in state
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);


  const signupUser = async ({ name, email, password }) => {
    try {
      setLoading(true);
      const { data, status } = await axios.post("/api/auth/signup", { name, email, password });
      setLoading(false);
  
      console.log('API Response:', data, status); // Debugging line
  
      if (status === 201) {
        toast.success("Signup successful! Please sign in to continue.", {
          autoClose: 3000,
          onClose: () => router.push("/signin"),
        });
        setUser(data.user);  // Set the user state
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Signup failed";
      toast.error(errorMessage);
    }
  };
  

  const registerUser = async ({ name, email, password }) => {
    try {
      const { data } = await axios.post(
        `${process.env.API_URL}/api/auth/register`,
        {
          id: user._id,
          name,
          email,
          password,
          role: 'user',
        }
      );

      if (data?.user) {
        router.push("/");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
        setLoading(true);
        const res = await nextAuthSignIn("credentials", {
            redirect: false,
            email,
            password,
        });
        setLoading(false);

        // Ensure the response structure is handled correctly
        if (res.error) {
            return { success: false, message: res.error }; // Return error as part of the object
        } else if (res.ok) {
            return { success: true }; // Indicate success
        }
    } catch (error) {
        setLoading(false);
        const errorMessage = error.response?.data?.message || "Signin failed";
        toast.error(errorMessage);
        return { success: false, message: errorMessage }; // Handle error case
    }
};

  const adminSignIn = async ({ username, password }) => {
    try {
      setLoading(true);
      const res = await nextAuthSignIn("adminCredentials", {
        redirect: false,
        username,
        password,
      });
      setLoading(false);

      if (res.error) {
        toast.error(res.error);
      }

      if (res.ok) {
        toast.success("Admin signin successful!", {
          autoClose: 1000,
          onClose: () => {
            setTimeout(() => {
              window.location.reload(); // Optionally reload the page to update the session state
            }, 1000); // Adjust the delay as needed
          },
        });
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Signin failed";
      toast.error(errorMessage);
    }
  };

  const loadUser = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/auth/session?update");

      if (data?.user) {
        setUser(data.user);
        router.replace("/profile");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);

      if (data.success) {
        toast.success("Profile updated successfully!");
        setUser(data.user); // Update user state with new profile data
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || "Profile update failed";
      toast.error(errorMessage);
    }
  };

  const updatePassword = async ({ currentPassword, newPassword }) => {
    try {
      const { data } = await axios.put(
        `${process.env.API_URL}/api/auth/me/update_password`,
        {
          currentPassword,
          newPassword,
        }
      );

      if (data?.success) {
        router.replace("/profile");
      }
    } catch (error) {
      console.log(error.response);
      setError(error?.response?.data?.message);
    }
  };

  const addNewAddress = async (newAddress) => {
    try {
      const res = await fetch('/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress),
      });
      if (!res.ok) {
        throw new Error('Failed to add address');
      }
      // Handle successful address addition
    } catch (err) {
      setError(err.message);
    }
  };

  const updateAddress = async (id, address) => {
    try {
      const { data } = await axios.put(
        `${process.env.API_URL}/api/address/${id}`,
        address
      );

      if (data?.address) {
        setUpdated(true);
        router.replace(`/address/${id}`);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.API_URL}/api/address/${id}`
      );

      if (data?.success) {
        router.push("/profile");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };


  const clearErrors = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        signupUser,
        loginUser,
        adminSignIn,
        updated,
        setUpdated,
        setUser,
        registerUser,
        updateProfile,
        updatePassword,
        addNewAddress,
        updateAddress,
        deleteAddress,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
