"use client";

import React, { useEffect, useState } from "react";
import "@/styles/Aadharverify.css";
import { useRouter } from "next/navigation";

type FormData = {
  Aadhar: string;
  email: string;
};
export default function Page() {
  // state for saving theaadhar value
  const [formData, setFormData] = useState<FormData>({ Aadhar: "", email: "" });
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  // handle aadhar value
  // Generic handleChange function to update formData
  const handleChangeAdhar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Update the formData state
    setFormData({
      ...formData,
      [name]: value, // Dynamically update the field based on the input's name
    });
  };

  // Fetch email from sessionStorage and set it in the state
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email") || "";
    setFormData((prevState) => ({ ...prevState, email: storedEmail }));
  }, []);

  //   handle aadhar verify
  const handleVerifyAadhar = async () => {
    try {
      // Send the entire formData to the backend
      const response = await fetch(
        "https://user-reg-backend.vercel.app/verify-aadhar",
        {
          // Corrected URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData), // Send formData directly
        }
      );

      const result = await response.json();
      if (response.ok && result.data === true) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      setIsVerified(false);
    }
  };

  const router = useRouter();

  // handle next button function
  const handleNextBtn = () => {
    router.push("/BankAccountVerification");
  };

  return (
    <div className="Aadhar_container">
      <div className="Aadhar_cont">
        <h1>Aadhar verification</h1>
        <div className="Aadhar_input_container">
          <input
            type="text"
            className="Aadhar_input"
            placeholder="Enter the Aadhar Number"
            name="Aadhar"
            pattern="\d{12}"
            required
            onChange={handleChangeAdhar}
          />
          {/* <button className='Aadhar_verify_btn'  onClick={handleVerifyAadhar}>{isVerified ? 'verified' : 'verify'}</button> */}
          {isVerified ? (
            <button className="verify_otp_btn_green">verified</button>
          ) : (
            <button className="Aadhar_verify_btn" onClick={handleVerifyAadhar}>
              verify
            </button>
          )}
        </div>
        {isVerified !== null &&
          (isVerified ? (
            <span className="aadhar_verify_success">
              Aadhar verified successfully
            </span>
          ) : (
            <span className="aadhar_verify_failed">
              Aadhar verification failed
            </span>
          ))}
        {isVerified && (
          <button className="Aadhar_next_btn" onClick={handleNextBtn}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
