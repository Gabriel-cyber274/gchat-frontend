"use client"
import React from 'react'
import {Montserrat } from '@next/font/google'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from './auth.module.css';
import Slick from '../../components/design/Slick';
import { usePathname } from 'next/navigation';


const montserrat = Montserrat({ subsets: ['latin'] })

function layout({ children }) {
    const pathname = usePathname();

  return (
    <div className={`${montserrat.className}`}>   
    <div style={{overflowX: 'hidden'}}>
        <div className='d-flex justify-content-between align-items-start'>
            <img src="/assets/G-Chat.svg" alt="" className='p-5' />
            <div className={`${style.design1_cont} d-none d-md-block`}>
                <img src="/assets/design2.png" alt="" />
                <img className={style.design1} src="/assets/design3.png" alt="" />
            </div>
        </div>
        <div className={`row ${style.top}`}>
            <div className='col py-5 px-4'>
                <h1 className='text-center'>Welcome back user</h1>
                <h2 className='text-center py-5'>Welcome back!, please enter your details</h2>
                <div className='d-flex justify-content-center'>
                    <button className={`py-2 px-4 ${style.google}`}>
                        <img src="/assets/google.png" alt="" />
                        <span className='ps-3'>Login with google</span>
                    </button>
                </div>
                {children}
            </div>
            <div className='col d-none d-md-flex  justify-content-end align-items-end'>
                {/* <Slick /> */}
                <div className='auth_slider'>
                    <div className="cont">
                    <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        <button type="button" data-bs-target="#carouselExampleFade" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#carouselExampleFade" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#carouselExampleFade" data-bs-slide-to="2" aria-label="Slide 3"></button>
                    </div>
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <h1 className='position-absolute text-white py-5 px-4' style={{width: '50%'}}>Express yourself freely with G-Chat </h1>
                                <img src="/assets/img1.JPG" class={`d-block w-100 img_style ${pathname.includes('signup') && 'img_style2'}`} alt="..." />
                            </div>
                            <div class="carousel-item">
                            <img src="/assets/img2.JPG" class={`d-block w-100 img_style ${pathname.includes('signup') && 'img_style2'}`} alt="..." />
                            </div>
                            <div class="carousel-item">
                            <img src="/assets/img3.JPG" class={`d-block w-100 img_style ${pathname.includes('signup') && 'img_style2'}`} alt="..." />
                            </div>
                        </div>
                        
                        {/* <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button> */}
                        </div>
                    </div>
                </div>
                <img src="/assets/design1.png" alt="" />
            </div>
        </div>
        
        {/* <ToastContainer theme="colored"  /> */}
    </div>
    </div>
  )
}

export default layout