"use client"
import React, { useState, useEffect, useRef, } from "react";
import Slider from "react-slick";
import { environment } from "../../environment/environment";
import { getCookie } from 'cookies-next';



const baseUrl = environment.scheme + environment.baseUrl;
function Users({users, addFriend}) {
    const [idx, setIdx] = useState(0);
    let token = getCookie('token');

    const SamplePrevArrow = ({onClick}) => {
        return (
        <div className="arrow_user prev_user"  style={{cursor:'pointer'}}>
            {users.length > 4 && <img src="/assets/arrow left.png" alt="" onClick={onClick} style={{transform: 'rotate(180deg)', zIndex: '100'}} />}
        </div>
        )
    }

    const SampleNextArrow = ({onClick}) => {
        return (
        <div className="arrow_user next_user"  style={{cursor:'pointer'}}>
            {users.length > 4 && <img src="/assets/arrow left.png" alt="" onClick={onClick} style={{zIndex: '100'}} />}
        </div>
        
        )
    }

    useEffect(()=> {
        
    })

    
    const settings = {
        dots: false,
        infinite: users.length > 4 ? true : false,
        speed: 500,
        slidesToShow: users.length > 4? 4 : users.length,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        beforeChange: (current, next)=> setIdx(next),
    };
  return (
    <div className='users my-4 position-relative'>
        <Slider {...settings}>
            {users.map((user, idx)=> (
                <div key={idx}>
                    <div className='add_friend'>
                        <div className='py-2 px-1'>
                            <div className='d-flex pic justify-content-center align-items-center'>
                                {user.profile_pic === null && <img src="/assets/img1.jpg"  alt="" />}
                                {user.profile_pic !== null && <img src={user.profile_pic}  alt="" />}
                            </div>
                            <div className='text-center'>
                                <h3 className='mt-2 mb-3'>{user.name}</h3>
                                <button className='pb-1 px-2' onClick={()=> addFriend(user.id)}><span>Add Friend</span> <b>+</b></button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </Slider>
    </div>
  )
}

export default Users