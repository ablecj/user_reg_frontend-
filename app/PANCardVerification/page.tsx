'use client'

import React, { useEffect, useState } from 'react'
import '@/styles/Pancardverification.css'
import { useRouter } from 'next/navigation';

// type for state
type FORMDATA = {
  PAN: string;
  email: string;
}

export default function Page() {

  // formdata for saving the state inside 
  const [formData, setFormData] = useState<FORMDATA>({PAN: '', email: ''});
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  // useEffect for setting the session
  useEffect(()=>{
    const storedEmail = sessionStorage.getItem('email') || '';
    setFormData(prevState => ({ ...prevState, email: storedEmail }));
  },[])

// function for handke onchange pan 
const handlePanCardNumber = (e: React.ChangeEvent<HTMLInputElement>)=> {
  e.preventDefault();
  const { name, value } = e.target;
  // Update the formData state
  setFormData({
    ...formData,
    [name]: value, // Dynamically update the field based on the input's name
  });

}

// handle verify pan number 
const handleVerifyPan = async()=> {
  try {
    // Send the entire formData to the backend
    const response = await fetch('https://user-reg-backend.vercel.app/verify-pan', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), 
    });

    const result = await response.json();

    if (response.ok && result.exists) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
    }
  } catch (error) {
    setIsVerified(false);
  }
}

// handle next btn function definition
const router = useRouter();
const handlenextBtn =()=> {
  router.push('/AddressVerification')
}



  return (
    <div className='Pan_card_verification'>
        <div className='pan_card_container'>
            <h1 className='PAN_card_Title'>PAN Card Verification</h1>
            {/* input container */}
            <div className='input_container'>
                <input type="text" placeholder='Enter the PAN Card No' className='input_pan' onChange={handlePanCardNumber} name='PAN' />
                {/* <button className='verify_pan_btn' onClick={handleVerifyPan} >{isVerified === true ? 'verified': 'verify'}</button> */}
                {isVerified ? (
            <button className="verify_otp_btn_green">verified</button>
          ) : (
            <button className="verify_pan_btn" onClick={handleVerifyPan}>
              verify
            </button>
          )}
            </div>
            {
              isVerified ? (<span className='pan_sucessful'>PAN verified successfully</span>) : (<span className='pan_failed'> PAN verification failed</span>)
            }

            {
              isVerified && <button className='Pan_next_btn' onClick={handlenextBtn}>Next</button>
            }
            
        </div>
    </div>
  )
}
