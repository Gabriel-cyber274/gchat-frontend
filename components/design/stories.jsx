"use client"
import React, { Component, useState } from "react";
import Slider from "react-slick";

export default function Stories() {
    const [idx, setIdx] = useState(0);

    const func = ()=> {
        return
    }
    
    const SamplePrevArrow = ({onClick}) => {
        return (
        <div className="arrow prev" onClick={!(idx===0) ? onClick : func} style={{cursor:'pointer'}}>
            {/* <FaAngleLeft /> */}
            {idx !==0 && <img src="/assets/arrow left.png" style={{transform: 'rotate(180deg)'}} alt="" />}
            {idx ===0 && <img src="/assets/arrow right.png" alt="" />}
        </div>
        )
    }

    const SampleNextArrow = ({onClick}) => {
        return (
        <div className="arrow next" onClick={onClick} style={{cursor:'pointer'}}>
            <img src="/assets/arrow left.png" alt="" />
            {/* {idx === 4 && <img src="/assets/arrow right.png" style={{transform: 'rotate(180deg)'}} alt="" />} */}
        </div>
        
        )
    }
    
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        // nextArrow: <SampleNextArrow />,
        // prevArrow: <SamplePrevArrow />,
        beforeChange: (current, next)=> setIdx(next),
    };

    return (
      <div className='story_slide'>
        <Slider {...settings}>
          <div>
            <div className='box1 d-flex justify-content-center align-items-center'>
                <div className='box2 d-flex justify-content-center align-items-center'>
                    <div className='text-center' style={{width: '95%'}}>
                        <img src="/assets/create.png" className="d-inline"  alt="" />
                        <h4 className='mt-3'>Create A story</h4>
                    </div>
                </div>
            </div>
          </div>
          <div>
            <div className='box1'>
                <div className='d-flex mt-3 justify-content-center align-items-center'>
                    <div className='box2 story d-flex justify-content-center align-items-center'>
                        <div className='text-center' style={{width: '95%'}}>
                            <img src="/assets/img1.JPG" alt="" />
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center mt-2'>
                    <div className='d-flex story_user align-items-center'>
                        <img src="/assets/img2.JPG" width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
                        <span className='ms-2'>Adam smith</span>
                    </div>
                </div>
            </div>
          </div>
          <div>
            <div className='box1'>
                <div className='d-flex mt-3 justify-content-center align-items-center'>
                    <div className='box2 story d-flex justify-content-center align-items-center'>
                        <div className='text-center' style={{width: '95%'}}>
                            <img src="/assets/img1.JPG" alt="" />
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center mt-2'>
                    <div className='d-flex story_user align-items-center'>
                        <img src="/assets/img2.JPG" width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
                        <span className='ms-2'>Adam smith</span>
                    </div>
                </div>
            </div>
          </div>
          <div>
            <div className='box1'>
                <div className='d-flex mt-3 justify-content-center align-items-center'>
                    <div className='box2 story d-flex justify-content-center align-items-center'>
                        <div className='text-center' style={{width: '95%'}}>
                            <img src="/assets/img1.JPG" alt="" />
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center mt-2'>
                    <div className='d-flex story_user align-items-center'>
                        <img src="/assets/img2.JPG" width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
                        <span className='ms-2'>Adam smith</span>
                    </div>
                </div>
            </div>
          </div>
          <div>
            <div className='box1'>
                <div className='d-flex mt-3 justify-content-center align-items-center'>
                    <div className='box2 story d-flex justify-content-center align-items-center'>
                        <div className='text-center' style={{width: '95%'}}>
                            <img src="/assets/img1.JPG" alt="" />
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center mt-2'>
                    <div className='d-flex story_user align-items-center'>
                        <img src="/assets/img2.JPG" width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
                        <span className='ms-2'>Adam smith</span>
                    </div>
                </div>
            </div>
          </div>
        </Slider>
      </div>
    )
  
}