"use client"
import React, { useState } from 'react'
import style from '../auth.module.css';
import Link from 'next/link';
import { environment } from '../../../environment/environment';
import {ValidateEmail, ValidatePassword} from '../../../components/auth/authentification'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';



const baseUrl = environment.scheme + environment.baseUrl
function SignupContent() {
  const [nameErr, setnameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr]= useState(false);
  const router = useRouter();

  
  const notify_err = (res) => toast.error(res, { theme: "colored" });
  const notify = (res)=> {
    toast.success(res, { theme: "colored" })
  } 
  const handleSignup = (e)=> {
      e.preventDefault();
      if(e.target[0].value.length === 0) {
        setnameErr(true);
      }
      if(ValidateEmail(e.target[1].value)) {
          setEmailErr(true);
      }
      if(ValidatePassword(e.target[2].value)) {
          setPasswordErr(true)
      }

      if(!ValidatePassword(e.target[2].value) && !ValidateEmail(e.target[1].value) && !(e.target[0].value.length === 0)) {
          setEmailErr(false)
          setPasswordErr(false);
          setnameErr(false);
          const data = {
              name: e.target[0].value,
              email: e.target[1].value, 
              password: e.target[2].value
          }
          
          signup(data);
      }
      
  }

  const signup = async(data)=> {
      let url = baseUrl + environment.auth.register;
      try {
          const response = await fetch(url, {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {
                'Content-Type': 'application/json',
              }
            });
          
            const res = await response.json()
            if(res.success) {
              notify(res.message)
              router.push('/auth/login')
            }else {
              notify_err(res.message)
            }
            console.log(res);
      } catch (error) {
          notify_err('error')
          return error
      }
  }


  return (
    <>
        <form action="" noValidate className='my-5 px-sm-4 auth_form' onSubmit={handleSignup}>
            <div class="form-floating mb-5">
                <input type="text" onChange={(e)=> e.target.value.length === 0? setnameErr(true): setnameErr(false)} className={`form-control input_style ${nameErr && 'sign_err'}`} id="floatingInput" placeholder="name@example.com" />
                <label for="floatingInput">Name</label>
                {nameErr && <h6 className='text-danger'>name is required</h6>}
            </div>
            <div class="form-floating mb-5">
                <input type="email" onChange={(e)=> ValidateEmail(e.target.value)? setEmailErr(true): setEmailErr(false)} className={`form-control input_style ${emailErr && 'sign_err'}`} id="floatingInput" placeholder="name@example.com" />
                <label for="floatingInput">Email</label>
                {emailErr && <h6 className='text-danger'>invalid email</h6>}
            </div>
            <div class="form-floating mb-5">
                <input type="password" onChange={(e)=> ValidatePassword(e.target.value)? setPasswordErr(true): setPasswordErr(false)} className={`form-control input_style ${passwordErr && 'sign_err'}`} id="floatingInput" placeholder="name@example.com" />
                <label for="floatingInput">Password</label>
                {passwordErr && <h6 className='text-danger'>password must be at least 8</h6>}
            </div>
            <div>
                <div>
                    <label class="check_container">
                        <input type="checkbox" className='black' />
                        <span class="checkmark"></span>
                        <span>Remember me</span>
                    </label>
                </div>              
            </div>
            <div className='d-flex justify-content-center mt-3'>
                <button className='login_button'>Sign up</button>
            </div>
            <h5 className='text-center my-5 auth_account'  style={{color: 'rgba(58, 58, 58, 0.57)'}}>
                Don’t have an account?,  <Link href={'/auth/login'} style={{color: 'black', textDecoration: 'none'}}>
                <span className='fw-bolder'>Login. <br />
                <img src="/assets/design4.png" alt="" style={{marginRight: '-195px'}} />
                </span></Link>
            </h5>
        </form>

        <ToastContainer theme="colored"  />
    </>
  )
}

export default SignupContent