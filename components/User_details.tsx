"use client";
import React, { useEffect, useState } from "react";
import "@/styles/UserDetails.css";
import { useRouter } from 'next/navigation'

export default function UserDetails() {
  // type for the formdata
  type FormData = {
    name: string;
    dob: string;
    email: string;
    phone: string;
  };

  // state for setting the data from the form
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dob: "",
    email: "",
    phone: "",
  });

  // state for error handling 
  const [error , setError] = useState('');

  // handle change event for tracking the values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // setting the useRouter
  const router = useRouter();

  // handleSaveDetails function defintion
  const handleSaveDetails = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("https://user-reg-backend-git-master-able-c-js-projects.vercel.app/validatePhone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({formData: formData }),
      });

      if (response.ok) {
        const result = await response.json();
        // Navigate to another route upon successful save
        router.push('/MobileEmailValidation'); // Replace '/success' with the route you want to navigate to
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('An unexpected error occurred.');

    }
  };

  // useEffect to set the email into the session
  useEffect(() => {
    if (formData.email) {
      sessionStorage.setItem("email", formData.email);
    }
  }, [formData.email]);

  return (
    <div className="user_reg_container">
      <div className="name_Dob_container">
        <form className="form_container" onSubmit={handleSaveDetails}>
          <div className="form_wrapper">
            <h1 className="register_form_title">Register</h1>
            <div className="name_dob_content">
              {/* name input */}
              <div className="name_container">
                {/* <label htmlFor="name">Name:</label> */}
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  className="Name_input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {/* dob container */}
              <div className="DOB_container">
                {/* <label htmlFor="dob">Date of Birth:</label> */}
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  required
                  className="DOB_input"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="Email_container">
              {/* email inputs */}
              <div className="Email_content">
                {/* <label htmlFor="email">Email:</label> */}
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {/* phone number input */}
              <div className="phone_container">
                <div className="phone_content">
                  {/* <label htmlFor="phone">Phone No:</label> */}
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    pattern="[0-9]{10}"
                    required
                    placeholder="Enter your phone number"
                    className="phone_input"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button type="submit"  className="submit_btn" >
              Submit
            </button>
            <span className="Error_span">{error}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
