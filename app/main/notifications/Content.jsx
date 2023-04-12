"use client"
import React, { useEffect } from 'react'
import { environment } from '../../../environment/environment'
import { getCookie } from 'cookies-next';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const baseUrl = environment.scheme + environment.baseUrl;
function Content({notifications}) {
    let token = getCookie('token');
    const router = useRouter();

    
    const notify_err = (res) => toast.error(res, { theme: "colored" });
    const notify = (res)=> {
        toast.success(res, { theme: "colored" })
    } 


    useEffect(()=> {
        console.log(notifications.notification)
    })

    const readAll = async()=> {
        let url = baseUrl + environment.notification.readAll;
        let data = [
            {
                read: true,
            }
        ]
        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            
            const res = await response.json();
            router.refresh();
            if(res.success) {
                notify(res.message)
            }else {
                notify_err(res.message)
            }
        } catch (error) {
            notify_err('error')
        }

    }

    const read = async(id)=> {
        let url = baseUrl + environment.notification.read + id;
        let data = [
            {
                read: true,
            }
        ]
        try {
            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            
            const res = await response.json();
            router.refresh();
            if(res.success) {
                notify(res.message)
            }else {
                notify_err(res.message)
            }
        } catch (error) {
            notify_err('error')
        }
    }


  return (
    <div className='notification_container'>
        <div className='d-flex notification_header justify-content-between align-items-center py-4 px-5'>
            <h2>Notifications</h2>
            <h2 style={{cursor: 'pointer'}} onClick={readAll}>Mark all as read <img src="/assets/down3.png" className='ms-2' alt="" /></h2>
        </div>
        <div className='line'></div>
        <div className='notification_overflow'>
            {notifications.notification.length > 0 && 
                notifications.notification.map((notification, idx)=> (
                    <div className={`d-flex main_notification ${notification.read == 0 && 'unread'} justify-content-between p-4`} key={idx}>
                        <div className='d-flex' style={{cursor: 'pointer'}} onClick={()=> read(notification.id)}>
                            <div className='active_ball'></div>
                            <div className='d-flex align-items-center'>
                                <div className='img_design d-flex justify-content-center align-items-center me-4'>
                                    {notification.image == null && <img src="/assets/img1.jpg" alt="" />}
                                    {notification.image !== null && <img src={notification.image} alt="" />}
                                </div>
                                <div>
                                    <h1>{notification.name}</h1>
                                    <p>{notification.message}</p>
                                </div>
                            </div>
                        </div>
                        <div className='d-flex align-items-end ms-4'>
                            <h3>Just now</h3>
                            <h3 className='balls ms-5'>...</h3>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default Content