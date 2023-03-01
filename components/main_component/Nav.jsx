"use client"
import React from 'react'

function Nav() {
  return (
    <div className='d-flex justify-content-center position-fixed main_landnav' style={{background: 'white', width: '100%'}}>
        <div className='nav_padding d-flex justify-content-evenly align-items-center'>
            <div>
                <img src="/assets/G-Chat.png" alt="" />
            </div>
            <div className='nav_search position-relative'>
                <input type="search" className='px-5 py-2 rounded-pill' placeholder='search...' />
                <img src="/assets/search.png" alt="" />
            </div>
            <div className='d-flex justify-content-evenly align-items-center nav_links'>
                <div className='py-5 active'>
                    <img src="/assets/home.png" alt="" />
                </div>
                <div className='py-5'>
                    <img src="/assets/people.png" alt="" />
                </div>
                <div className='py-5'>
                    <img src="/assets/media.png" alt="" />
                </div>
                <div className='py-5'>
                    <img src="/assets/chat.png" alt="" />
                </div>
                <div className='py-5'>
                    <img src="/assets/bell.png" alt="" />
                </div>
            </div>
            <div className='nav_user'>
                <img src="/assets/img3.JPG" style={{borderRadius: '50%', border:'2px solid blue'}} width='50' height='50' alt="" />
                <div></div>
            </div>
        </div>
    </div>
  )
}

export default Nav