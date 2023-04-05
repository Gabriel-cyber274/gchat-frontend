"use client"
import React, { useEffect, useState } from 'react'
import { environment } from '../../../environment/environment'
import { getCookie } from 'cookies-next';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';



const baseUrl = environment.scheme + environment.baseUrl;
function Content({friends, users, confirm}) {
    const [request, setRequest] = useState(false);
    let token = getCookie('token');
    const [mainConfirm, setMainConfirm] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(0);

    useEffect(()=> {
        let arr1 = confirm.friends.map(friend=> friend.id)
        let arr2 = friends.friends.map(friend=> friend.id)

        const mainArr = confirm.friends.filter((elem) => {
            return arr1.filter(id=> !arr2.includes(id)).some((ele) => {
            return ele === elem.id;
              });
        });
        setMainConfirm(mainArr);
    }, [friends, confirm])
    
    const notify_err = (res) => toast.error(res, { theme: "colored" });
    const notify = (res)=> {
        toast.success(res, { theme: "colored" })
    } 

    const addFriend = async(id)=> {
        let url = baseUrl + environment.friends.main;
        let data = {
            user_id: id,
        }
        setLoading(true)
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            
            const res = await response.json();
            router.refresh();
            setLoading(false)
            if(res.success) {
                notify(res.message)
            }else {
                notify_err(res.message)
            }
        } catch (error) {
            notify_err('error')
        }
    }

    const deleteFriend = async(id)=> {
        let url = baseUrl + environment.friends.removeFriend + id;
        setLoading(true)
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            const res = await response.json();
            router.refresh();
            setLoading(false)
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
    <div>
        <div className='totalFriend_container'>
            <div className='d-flex friend_list_headers align-items-center' style={{cursor: 'pointer'}}>
                <div className='py-4' onClick={()=>setRequest(false)}>
                    <h1 className={`${!request && 'active'}`}>All Your Friends ({friends.friends.length}) {!request && <img src="/assets/down2.png" alt="" />} {request && <img src="/assets/down3.png" alt="" />} </h1>
                </div>
                <div className='py-4' onClick={()=>setRequest(true)}>
                    <h1 className={`${request && 'active'}`}>Requests ({mainConfirm.length}) {request && <img src="/assets/down2.png" alt="" />} {!request && <img src="/assets/down3.png" alt="" />}</h1>
                </div>
            </div>
            <div className='line'></div>
            <div className='friend_list_container'>
                {!request && <>
                    {friends.friends.length > 0 && friends.friends.map((friend, idx)=> (
                        <div key={idx} className='d-flex friend_list align-items-center'>
                            <div style={{width: '25%'}}>
                                <div className='profile_pic'>
                                    {friend.profile_pic === null && <img src="/assets/img1.jpg"  alt="" />}
                                    {friend.profile_pic !== null && <img src={friend.profile_pic}  alt="" />}
                                </div>
                            </div>
                            <div style={{width: '25%'}}>
                                <h2>{friend.name}</h2>
                            </div>
                            <div style={{width: '25%'}}>
                                {!loading && <button className='py-2 px-4' onClick={()=> {deleteFriend(friend.id), setId(friend.id)}}>Unfriend</button>}
                                {loading && <button className='py-2 px-4' disabled>{friend.id == id ?'loading...': 'Unfriend'}</button>}
                            </div>
                            <div style={{width: '25%'}}>
                                <span>...</span>
                            </div>
                        </div>
                    ))}
                    {friends.friends.length == 0 && 
                        <div className='text-center mt-3'>
                            <button className='btn btn-primary py-2 px-3'>Add friends</button>
                        </div>
                    }
                </>}

                {request &&
                    <>
                        {mainConfirm.length > 0 && mainConfirm.map((friend, idx)=> (
                            <div key={idx} className='d-flex friend_list align-items-center'>
                                <div style={{width: '25%'}}>
                                    <div className='profile_pic'>
                                        {friend.profile_pic === null && <img src="/assets/img1.jpg"  alt="" />}
                                        {friend.profile_pic !== null && <img src={friend.profile_pic}  alt="" />}
                                    </div>
                                </div>
                                <div style={{width: '25%'}}>
                                    <h2>{friend.name}</h2>
                                </div>
                                <div style={{width: '25%'}}>
                                    {!loading && <button className='py-2 px-4' onClick={()=> {addFriend(friend.id), setId(friend.id)}}>Confirm</button>}
                                    {loading && <button className='py-2 px-4' disabled>{friend.id == id ?'loading...': 'Confirm'}</button>}
                                </div>
                                <div style={{width: '25%'}}>
                                    <span>...</span>
                                </div>
                            </div>
                        ))}
                        {mainConfirm.length == 0 && 
                            <div className='text-center mt-3'>
                                <h2>No Friend Request</h2>
                            </div>
                        }      
                    </>
                }

                
                
            </div>
        </div>
    </div>
  )
}

export default Content