"use client"
import React, { useEffect, useState } from 'react'
import '@/styles/BankAccountVerify.css'
import { useRouter } from 'next/navigation';

type AccIfscState = {
    ACC: string;
    ifsc: string;
    email: string;
  }

export default function Page() {
// satte for saving the Account no and ifsc code 
const [AccIfsc, setAccIfsc] = useState<AccIfscState>({ ACC: '', ifsc: '', email: '' });

useEffect(() => {
  // Retrieve email from session storage or any other place
  const email = sessionStorage.getItem('email') || ''; // Replace with your method of getting the email
  // Update state with email from session
  setAccIfsc((prevState) => ({
    ...prevState,
    email: email,
  }));
}, []);

  // Handle change function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Update state dynamically based on input name
    setAccIfsc((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // setting state for verification 
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

// this is the function defition for handle bank account verification 
const handleVerifyBankDetails = async () => {
  try {
    // Send POST request to your backend
    const response = await fetch('https://user-reg-backend.vercel.app/verify-bank-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(AccIfsc),
    });

    const result = await response.json();

    // Delay the GET request for 5 seconds
    setTimeout(async () => {
      const email = AccIfsc.email;
      // Handle the GET request to get the final response
      const getResponse = await fetch(`https://user-reg-backend.vercel.app/get-verification-result?request_id=${result.request_id}&email=${encodeURIComponent(email)}`);
      const finalResult = await getResponse.json();
      // Set the verification result in state
      setVerificationResult(finalResult[0].result.status);
    }, 5000); // 5000 milliseconds = 5 seconds

  } catch (error) {
    console.error('Error verifying bank account:', error);
  }
};

const router = useRouter();
// handle next button function
const handleNextBtn =()=> {
  router.push('/GstVerification')
}


    return (
    <div className='BankAccountContainer'>
        <div className='bank_cont'>
            <h1>Bank Account Verification</h1>
            <div className='input_container'>
             <input type="text" placeholder='Enter the bank account number' className='Account_input'   name="ACC"    onChange={handleChange} />
             <input type="text" placeholder='Enter the IFSC code' className='IFSC_inpput'  name="ifsc"    onChange={handleChange} />
             {/* <button className='verify_bank_acc_btn' onClick={handleVerifyBankDetails} >{verificationResult? 'verified': 'verify'}</button> */}
             {verificationResult ? (
            <button className="verify_otp_btn_green">verified</button>
          ) : (
            <button className="verify_bank_acc_btn" onClick={handleVerifyBankDetails}>
              verify
            </button>
          )}
            </div>
            {
              verificationResult ? (<span className='bank_success'>Bank account verified</span>) : (<span className='bank_failed'>Bank account verification failed </span>)
            }

            {
              verificationResult && <button className='Next_page_btn' onClick={handleNextBtn}>Next</button>
            }
            
        </div>
    </div>
  )
}
