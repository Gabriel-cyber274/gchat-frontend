"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { environment } from '../../environment/environment';
import { usePathname } from 'next/navigation';


const baseUrl = environment.scheme + environment.baseUrl;
function Nav() {
    const router = useRouter();
    let token = getCookie('token');
    const pathname = usePathname();
    const [notification, setNotification] = useState([])

    
    useEffect(()=> {
        getNotification();
        console.log('john2')
    }, [router, pathname])
    const getNotification = async() => {
        const res = await fetch(baseUrl + environment.notification.main, {
            method: 'GET',
            headers: {
                'Content-Type' : 'applications/json',
                'Authorization': `Bearer ${token}`
            },
        });
        let response = await res.json();
        setNotification(response.notification.filter(not=> not.read === 0));
    }

    

  return (
    <div className='d-flex justify-content-center position-fixed main_landnav' style={{background: 'white', width: '100%'}}>
        <div className='nav_padding d-flex justify-content-evenly align-items-center'>
            <div onClick={()=> router.push('/main')} style={{cursor: 'pointer'}}> 
                <img src="/assets/G-Chat.png" alt="" />
            </div>
            <div className='nav_search position-relative'>
                <input type="search" className='px-5 py-2 rounded-pill' placeholder='search...' />
                <img src="/assets/search.png" alt="" />
            </div>
            <div className='d-flex justify-content-evenly align-items-center nav_links'>
                <div className={`py-5 ${pathname == '/main' && 'active'}`} style={{cursor: 'pointer'}} onClick={()=> router.push('/main')}>
                    <img src="/assets/home.png" alt="" />
                </div>
                <div className={`py-5 ${pathname.includes('friends') && 'active'}`} style={{cursor: 'pointer'}} onClick={()=> router.push('/main/friends')}>
                    <img src="/assets/people.png" alt="" />
                </div>
                <div className='py-5' style={{cursor: 'pointer'}}>
                    <img src="/assets/media.png" alt="" />
                </div>
                <div className='py-5' style={{cursor: 'pointer'}}>
                    <img src="/assets/chat.png" alt="" />
                </div>
                <div className={`py-5 position-relative ${pathname.includes('notifications') && 'active'}`} style={{cursor: 'pointer'}} onClick={()=> router.push('/main/notifications')}>
                    {notification.length > 0 && <div className='notification_bell d-flex justify-content-center align-items-center position-absolute'>
                        <h6 className='text-white'>{notification.length>99? '99+': notification.length }</h6>
                    </div>}
                    <img src="/assets/bell.png" alt="" />
                </div>
            </div>
            <div className='nav_user' style={{cursor: 'pointer'}}>
                <img src="/assets/img3.JPG" style={{borderRadius: '50%', border:'2px solid blue'}} width='50' height='50' alt="" />
                <div></div>
            </div>
        </div>
    </div>
  )
}

export default Nav