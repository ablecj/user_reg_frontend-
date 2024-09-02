"use client"

import React, { useEffect, useState } from 'react';
import '@/styles/gstVerify.css'
import { useRouter } from 'next/navigation';

export default function Page() {

    // state for setting gst number 
    const [gstNumber, setGstNumber] = useState<{ gst: string; email: string }>({
        gst: '',
        email: ''
      });
    // set the state for verification result 
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

    const handleGstValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGstNumber((prev) => ({
          ...prev,
          [e.target.name]: e.target.value,
        }));
      };

    // useEffect for session calling 
    useEffect(() => {
        const email = sessionStorage.getItem('email') || ''; 
        setGstNumber((prev) => ({ ...prev, email }));
      }, []);

    // handle verfy gst number 
 
    const handleVerifyGst = async () => {
        const { gst, email } = gstNumber;
        try {
          const response = await fetch('https://user-reg-backend.vercel.app/verify-gst', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gst, email }),
          });
    
          const result = await response.json();
          if (response.ok) {
            setVerificationResult(true);
          } else {
            setVerificationResult(false);
          }
        } catch (error) {
          setVerificationResult(false);
        }
      };

// handle next btn function definition
const router = useRouter();
const handleNextBtn = ()=> {
  router.push('/PANCardVerification')
}


  return (
    <div className='gst_container'>
        <div className='gst_verify_cont'>
            <h1 className='gst_title'>Verify GST</h1>
            <div className='input_container_gst'>
                <input type="text" placeholder='Enter the GST No.'  pattern="^[A-Za-z0-9]{15}$" className='Gst_input' onChange={handleGstValueChange} name='gst'/>
                {/* <button className='gst_verify_btn' onClick={handleVerifyGst}>{verificationResult === true ? 'verified': 'verify' }</button> */}
                {verificationResult ? (
            <button className="verify_otp_btn_green">verified</button>
          ) : (
            <button className="gst_verify_btn" onClick={handleVerifyGst}>
              verify
            </button>
          )}
            </div>
            {
              verificationResult ? (<span className='gst_sucess'>GST verified successfully</span>) : (<span className='gst_failed'>GST verification failed</span>)
            }


             {
              verificationResult && <button className='gst_next_btn' onClick={handleNextBtn}>Next</button>
             }            
        </div>
    </div>
  )
}
