"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/EmailPhoneValidation.css";
import { auth } from "@/firebase.config"; // Adjust the path based on your project structure
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
    handleSendOtp?: () => void;
  }
}
export default function EmailPhoneInput() {
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  // type for the stsate
  type FormData = {
    email: string;
    phone: string;
  };

  // State for setting the data from the form
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
  });

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedEmail = sessionStorage.getItem("email");
        if (storedEmail) {
          const response = await fetch(
            "https://user-reg-backend.vercel.app/getUserData",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${storedEmail}`, // Example: Pass email in the headers
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setFormData(data);
          } else {
            console.error("Failed to fetch data");
          }
        } else {
          console.error("No email found in session storage");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the function to fetch data
  }, []);

  // setting the otp to a state from the backend
  const [otps, setOtp] = useState<string>("");

  // handling the otp send to the backend
  const handleSendEmailOtp = async () => {
    try {
      const response = await fetch(
        "https://user-reg-backend.vercel.app/sendemailotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: formData.email }),
        }
      );
      // data recieng
      const data = await response.json();
      // conditional check for the response
      if (response.ok) {
        setOtp(data.otp);
      } else {
        console.log("failed to send otp");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // state for setting the data on the onchange in the iinput field
  const [otpInput, setOtpInput] = useState<string>("");

  // Handle OTP input change
  const handleOtpInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtpInput(event.target.value);
  };

  // state for saving the data from the backend response
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // handle otp verification to the backend
  const handleEmailOtpVerify = async () => {
    try {
      const response = await fetch(
        "https://user-reg-backend.vercel.app/verifyotp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp: otpInput }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    } catch (error) {
      setIsVerified(false);
    }
  };

  const handleSendOtp = () => {
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.clear(); // Clear previous reCAPTCHA if it exists
    }

    recaptchaVerifierRef.current = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible", // or 'invisible'
        callback: (response: any) => {
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      }
    );

    const phoneNumber = "+91" + formData.phone;
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current!)
      .then((confirmationResult: ConfirmationResult) => {
        confirmationResultRef.current = confirmationResult;
        alert("OTP has been sent to your phone");
      })
      .catch((error: Error) => {
        console.log("Error during signInWithPhoneNumber", error);
        alert("Failed to send OTP. Please try again.");
      });
  };

  useEffect(() => {
    // Cleanup function to avoid memory leaks
    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, []);

  // state for storing otp and verify otp
  const [phoneOtp, setPhoneOtp] = useState("");
  const [isVerifiedPhone, setIsVerifiedPhone] = useState<boolean | null>(null);
  // handle onchage function for otp for the phone
  const handlePhoneOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setPhoneOtp(e.target.value);
  };

  // Function to handle the OTP verification
  const handleVerifyPhone = () => {
    // Ensure OTP has been entered and confirmationResult is available
    if (phoneOtp && confirmationResultRef.current) {
      confirmationResultRef.current
        .confirm(phoneOtp)
        .then((result: any) => {
          // User successfully verified
          const user = result.user;
          console.log("Phone number verified successfully:", user);
          setIsVerifiedPhone(true);
          alert("Phone number verified successfully!");
          // You can now proceed with the user flow, like redirecting or updating UI
        })
        .catch((error: any) => {
          // OTP verification failed
          setIsVerifiedPhone(false);
          console.error("Error verifying OTP", error);
          alert("Invalid OTP. Please try again.");
        });
    } else {
      setIsVerifiedPhone(false);
      alert("Please enter the OTP received on your phone.");
    }
  };

  const router = useRouter();
  // function defintion for routing to next page
  const handleNextPage = () => {
    router.push("/AadharVerification");
  };

  return (
    <div className="email_phone_validation">
      <div className="validation_container">
        <div className="validation_title">
          <h1>Otp Verification</h1>
        </div>
        {/* email verification */}
        <div className="Email_container">
          <input
            type="text"
            className="Email_input"
            readOnly
            value={formData.email}
          />
          <button className="send_otp" onClick={handleSendEmailOtp}>
            send otp
          </button>
          <input
            type="text"
            className="verify_otp_input"
            placeholder="Enter the otp"
            onChange={handleOtpInputChange}
          />
          {isVerified ? (
            <button className="verify_otp_btn_green">verified</button>
          ) : (
            <button className="verify_otp_btn" onClick={handleEmailOtpVerify}>
              verify
            </button>
          )}
        </div>
        {isVerified !== null &&
          (isVerified ? (
            <span className="email_verify_success">
              Email verified successfully
            </span>
          ) : (
            <span className="email_verify_failed">Email validation failed</span>
          ))}

        {/* phone number verification */}
        <div className="Phone_container">
          <input
            type="text"
            className="phone_input_verification"
            readOnly
            value={formData.phone}
          />
          <button
            id="send-otp-button"
            className="send_otp"
            onClick={handleSendOtp}
          >
            send otp
          </button>
          <input
            type="text"
            className="verify_otp_input"
            placeholder="Enter the otp"
            onChange={handlePhoneOtp}
          />
          {isVerifiedPhone ? (
            <button className="verify_otp_btn_green">verified</button>
          ) : (
            <button className="verify_otp_btn" onClick={handleVerifyPhone}>
              verify
            </button>
          )}
        </div>
        {isVerifiedPhone !== null &&
          (isVerifiedPhone ? (
            <span className="Phone_verify_success">
              Phone verified successfully
            </span>
          ) : (
            <span className="phone_verify_failed">
              Phone verification failed
            </span>
          ))}

        <div id="recaptcha-container"></div>

        {/* button for the next page */}
        {isVerified && isVerifiedPhone ? (
          <button className="Email_ph_verify_nextbtn" onClick={handleNextPage}>
            Next
          </button>
        ) : null}
      </div>
    </div>
  );
}
