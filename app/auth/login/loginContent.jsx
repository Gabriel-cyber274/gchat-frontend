"use client"
import React, { useEffect, useState } from 'react'
import style from '../auth.module.css';
import Link from 'next/link';
import { environment } from '../../../environment/environment';
import {ValidateEmail, ValidatePassword} from '../../../components/auth/authentification'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation'


const baseUrl = environment.scheme + environment.baseUrl
function LoginContent() {
    const [emailErr, setEmailErr] = useState(false);
    const [passwordErr, setPasswordErr]= useState(false);
    const router = useRouter();

    
    const notify_err = (res) => toast.error(res, { theme: "colored" });
    const notify = (res)=> {
      toast.success(res, { theme: "colored" })
    } 
    const handleLogin = (e)=> {
        e.preventDefault();
        if(ValidateEmail(e.target[0].value)) {
            setEmailErr(true);
        }
        if(ValidatePassword(e.target[1].value)) {
            setPasswordErr(true)
        }

        if(!ValidatePassword(e.target[1].value) && !ValidateEmail(e.target[0].value)) {
            setEmailErr(false)
            setPasswordErr(false);
            const data = {
                email: e.target[0].value, 
                password: e.target[1].value
            }

            login(data);
        }
        
    }

    const login = async(data)=> {
        let url = baseUrl + environment.auth.login;
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
                setCookie('token', res.token);
                localStorage.setItem('currentUser', JSON.stringify(res))
                router.push('/main')
              }else {
                notify_err(res.message)
              }
              console.log(res.user);
        } catch (error) {
            notify_err('error')
            return error
        }
    }

    useEffect(()=> { 
      if(localStorage.currentUser) {
        localStorage.removeItem('currentUser')
        setCookie('token', null);
      }
    }, [])
  return (
    <>
        <form action="" noValidate className='my-5 px-sm-4 auth_form' onSubmit={handleLogin}>
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
            <div className='d-flex justify-content-between align-items-center'>
                <div>
                    <label class="check_container">
                        <input type="checkbox" className='black' />
                        <span class="checkmark"></span>
                        <span>Remember me</span>
                    </label>
                </div>
                <Link href={'/auth/signup'} style={{color: 'black', textDecoration: 'none'}}><h3 className={style.forgot}>Forgot password?</h3></Link>                 
            </div>
            <div className='d-flex justify-content-center mt-3'>
                <button className='login_button'>Login</button>
            </div>
            <h5 className='text-center my-5 auth_account'  style={{color: 'rgba(58, 58, 58, 0.57)'}}>
                Don’t have an account?,  <Link href={'/auth/signup'} style={{color: 'black', textDecoration: 'none'}}>
                <span className='fw-bolder'>Sign Up for free. <br />
                <img src="/assets/design4.png" alt="" style={{marginRight: '-195px'}} />
                </span></Link>

            </h5>
        </form>

        <ToastContainer theme="colored"  />
    </>
  )
}

export default LoginContent