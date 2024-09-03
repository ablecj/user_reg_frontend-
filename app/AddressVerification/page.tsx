"use client";

import React, { useEffect, useState } from "react";
import "@/styles/addressverification.css";
import { useRouter } from "next/navigation";

interface PostOffice {
  pincode: string;
  area: string;
  lat: string;
  lng: string;
  district: string;
  state: string;
}

interface FormData {
  pincode: string;
  email: string;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    pincode: "",
    email: "",
  });
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState<string>("");
  const [districtName, setDistrictName] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // Fetch email from sessionStorage and set it in the state
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email") || "";
    setFormData((prevState) => ({ ...prevState, email: storedEmail }));
  }, []);

  // Handle verify button click
  const handleVerifyPincode = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (formData.pincode.length === 6) {
      try {
        // Fetch post office data based on pincode and email
        const encodedPincode = encodeURIComponent(formData.pincode);
        const encodedEmail = encodeURIComponent(formData.email);

        const response = await fetch(
          `https://user-reg-backend-git-master-able-c-js-projects.vercel.app/postoffices?pincode=${encodedPincode}&email=${encodedEmail}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data: PostOffice[] = await response.json();
        setPostOffices(data);
        setIsVerified(true);

        // Automatically select the first post office in the list if available
        if (data.length > 0) {
          setSelectedPostOffice(data[0].area);
          setDistrictName(data[0].district);
          setStateName(data[0].state);
        }
      } catch (error) {
        setIsVerified(false);
      }
    } else {
      setIsVerified(false);
    }
  };

  // Handle dropdown selection
  const handlePostOfficeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedArea = e.target.value;
    setSelectedPostOffice(selectedArea);

    const selectedOffice = postOffices.find(
      (office) => office.area === selectedArea
    );

    if (selectedOffice) {
      setDistrictName(selectedOffice.district);
      setStateName(selectedOffice.state);
    }
  };

  // Handle submit button function
  const router = useRouter();
  const handleSubmitBtn = () => {
    router.push("/");
  };

  return (
    <div className="address_verification_container">
      <form className="address_container">
        <h1>Address Verification</h1>
        {/* Pincode input */}
        <div className="pincode_container">
          <label htmlFor="pincode">Pincode:</label>
          <input
            type="text"
            id="pincode"
            value={formData.pincode}
            onChange={(e) =>
              setFormData((prevState) => ({
                ...prevState,
                pincode: e.target.value,
              }))
            }
            placeholder="Enter pincode"
            className="picode_input"
          />
          {isVerified ? (
            <button className="verify_otp_btn_green">verified</button>
          ) : (
            <button className="verify_pin_btn" onClick={handleVerifyPincode}>
              verify
            </button>
          )}
        </div>

        {/* Area Name dropdown */}
        <div className="pincode_container">
          <label htmlFor="officeName" className="city_labael">
            City:
          </label>
          <select
            id="officeName"
            value={selectedPostOffice}
            className="picode_input1"
            onChange={handlePostOfficeSelect}
          >
            <option value="">Select an area</option>
            {postOffices.map((office) => (
              <option key={office.area} value={office.area}>
                {office.area}
              </option>
            ))}
          </select>
        </div>

        {/* District Name input */}
        <div className="pincode_container">
          <label htmlFor="districtName">District:</label>
          <input
            type="text"
            id="districtName"
            value={districtName}
            readOnly
            className="picode_input2"
          />
        </div>

        {/* State Name input */}
        <div className="pincode_container">
          <label htmlFor="stateName">State:</label>
          <input
            type="text"
            id="stateName"
            value={stateName}
            readOnly
            className="picode_input3"
          />
        </div>

        {isVerified !== null &&
          (isVerified ? (
            <span className="address_verify_success">
              Address verified successfully
            </span>
          ) : (
            <span className="address_verify_failed">
              Address verification failed
            </span>
          ))}

        {isVerified && (
          <button className="Addres_next_btn" onClick={handleSubmitBtn}>
            submit
          </button>
        )}
      </form>
    </div>
  );
}
