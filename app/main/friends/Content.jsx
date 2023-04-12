"use client"
import React, { useEffect, useState,useRef } from 'react'
import { environment } from '../../../environment/environment'
import { getCookie } from 'cookies-next';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Users from '../../../components/design/users';
import Modals from '../../../components/main_component/Modals';
import moment from 'moment';



const baseUrl = environment.scheme + environment.baseUrl;
function Content({friends, users, confirm, posts}) {
    const [request, setRequest] = useState(false);
    let token = getCookie('token');
    const [mainConfirm, setMainConfirm] = useState([]);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(0);
    const [mainUsers, setMainUsers] = useState([]);
    const addFriendRef = useRef(null);
    const [currentUser, setCurrentUser] = useState({});
    const postRef = useRef(null);
    const postRefClose = useRef(null);
    const postRef2 = useRef(null);
    const postRef2Close = useRef(null);
    const postRef3 = useRef(null);
    const postRef3Close = useRef(null);
    const postRef4 = useRef(null);
    const postRef4Close = useRef(null);
    const commentRef = useRef(null);
    const commentScrollRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState('');
    const [subComment, setSubComment] = useState([]);
    const [subReply, setSubReply] = useState(false);
    const [commentId, setCommentId] = useState('');
    const [first, setFirst] = useState([])
    const [second, setSecond] = useState([])

    useEffect(()=> {
        let arr1 = confirm.friends.map(friend=> friend.id)
        let arr2 = friends.friends.map(friend=> friend.id)

        const mainArr = confirm.friends.filter((elem) => {
            return arr1.filter(id=> !arr2.includes(id)).some((ele) => {
            return ele === elem.id;
              });
        });
        setMainConfirm(mainArr);

        let arr3 = users.users.map(user=> user.id);
        const mainArr2 = users.users.filter((elem) => {
            return arr3.filter(id=> !arr2.includes(id)).some((ele) => {
            return ele === elem.id;
              });
        });

        setMainUsers(mainArr2)
        
        setFirst(posts.post.slice(0, Math.ceil(posts.post.length/2)));
        setSecond(posts.post.slice(Math.ceil(posts.post.length/2))) 
        setCurrentUser(JSON.parse(localStorage.currentUser).user)
        console.log(mainArr2)
    }, [friends, confirm, users, posts]);


    
    const notify_err = (res) => toast.error(res, { theme: "colored" });
    const notify = (res)=> {
        toast.success(res, { theme: "colored" })
    } 
    
    function calendarDate(date) {
        return moment(date).calendar({
          sameElse: function (now) {
            const from = moment(this);
            now = moment(now);
            const dayDiff = now.diff(from, 'days');
            if (dayDiff >= 7 && dayDiff <= 14) {
              return '[Last week]';
            } else {
              const monthDiff = now.diff(from, 'months', true);
              if (monthDiff === 0) {
                return '[This month]';
              }
              if (monthDiff > 0 && monthDiff <= 1) {
                return '[Last Month]';
              }
              if (monthDiff > 1) {
                if (Number(from.format('YYYY')) - Number(now.format('YYYY')) < 0) {
                  return `[${from.format('YYYY')}]`;
                }
                return `[${from.format('MMMM')}]`;
              }
            }
            return '[More than a week]';
          },
        });
      }

    
    const likePost = async(id, likes) => {
        if(likes.filter((like)=> like.user_id === currentUser.id).length === 0) {
            let url = baseUrl + environment.post.like;
            const data = {
                post_id: id,
            }
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
                if(res.success) {
                    notify(res.message)
                }else {
                    notify_err(res.message)
                }
            } catch (error) {
                notify_err('error')
                return error
            }
        }
        else {
            try {
                const response = await fetch(baseUrl + environment.post.unlike + `/${likes.filter((like)=> like.user_id === currentUser.id)[0].id}`, {
                    method: 'DELETE',
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
                return error
            }
        }
    }

    const sharePost = async(id, shares)=> {
        if(shares.filter((share)=> share.user_id === currentUser.id).length === 0) {
            let url = baseUrl + environment.post.share;
            const data = {
                post_id: id,
            }
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
                if(res.success) {
                    notify(res.message)
                }else {
                    notify_err(res.message)
                }
            } catch (error) {
                notify_err('error')
                return error
            }
        }else {
            notify_err('you already shared this post')
        }
    }

    const getComments = async(id)=> {
    let url = baseUrl + environment.comments.getComments + `${id}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            // body: JSON.stringify(data),
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        });
        
        const res = await response.json();
        console.log(res, 'ebuka');
        if(res.success) {
            setComments(res.comments);
            commentRef.current.click();
        }else {
            notify_err(res.message)
        }
    } catch (error) {
        notify_err('error')
        return error
    }
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
            setLoading(false)
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
            setLoading(false)
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
                            <button className='btn btn-primary py-2 px-3' onClick={()=> addFriendRef.current.scrollIntoView({behavior: 'smooth'})}>Add friends</button>
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

        <>
            {first.length>0 && <div className='friends_post_header my-5 position-relative'>
                <div className='position-absolute d-flex justify-content-between' style={{top: '0', width: '100%'}}>
                    <img src="/assets/friend_design2.png" className='des1' alt="" />
                    <img src="/assets/friend_design1.png" alt="" />
                </div>
                <div className='add_friend_header'>
                    <h2>Posts From your Friends</h2>
                </div>
            </div>}
            <div>
                {
            first.map((post, idx)=> (
                <div className='main_post mb-5 py-5 d-flex justify-content-center' key={idx}>
                    <div style={{width: '90%'}}>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className='d-flex align-items-center'>
                                <img src="/assets/img1.JPG" className='post_img' width='50' height='50' style={{borderRadius: '50%'}} alt="" />
                                <div className='ms-3 pt-2'>
                                    <h1>{post?.user.name}</h1>
                                    <h3>{calendarDate(post?.updated_at.slice(0,post?.updated_at.indexOf('T')))}</h3>
                                </div>
                            </div>
                            <div>
                                <h2 className='fw-bolder'>...</h2>
                            </div>
                        </div>
                        <div>
                            <p className='my-3'>{post?.text}</p>
                            <div className="post_imgs mt-2">
                                {post?.images.length === 1 && post?.images.map((img, id)=> (
                                    <>
                                        {img.file.includes('mp4')?
                                            <video src={img.file} className='full' controls />
                                            :
                                            <img src={img.file} className='full' alt="" key={id} />
                                        }
                                    </>
                                ))}
                                {post?.images.length > 1 && post?.images.map((img, id)=> (
                                    <>
                                        {img.file.includes('mp4')?
                                            <video src={img.file} controls />
                                            :
                                            <img src={img.file} alt="" key={id} />
                                        }
                                    </>
                                ))}
                            </div>
                            <div className='d-flex post_actions mt-3 justify-content-between' style={{width: '85%', cursor: 'pointer'}}>
                                <div className='d-flex align-items-center' onClick={()=> {getComments(post?.id); setSubReply(false); setCommentId(''); setSubComment([]); setPostId(post?.id); router.refresh();}}>
                                    <img src="/assets/comment.png" className='pt-3' alt="" />
                                    <h5 className='ms-3'>{post?.comments.length}</h5>
                                </div>
                                <div className='d-flex align-items-center' style={{cursor: 'pointer'}} onClick={(e)=> likePost(post?.id, post?.likes)}>
                                    <img src="/assets/like.png" alt="" />
                                    <h5 className='ms-3'>{post?.likes.length}</h5>
                                </div>
                                <div className='d-flex align-items-center' style={{cursor: 'pointer'}} onClick={(e)=> sharePost(post?.id, post?.share)}>
                                    <img src="/assets/share.png" alt="" />
                                    <h5 className='ms-3'>{post?.share.length}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ))}
            </div>
        </>

        {mainUsers.length > 0 && <div ref={addFriendRef} className='user_container my-5 position-relative'>
            <div className='position-absolute d-flex justify-content-between' style={{top: '0', width: '100%'}}>
                <img src="/assets/friend_design2.png" className='des1' alt="" />
                <img src="/assets/friend_design1.png" alt="" />
            </div>
            <div className='add_friend_header'>
                <h2>Discover New Friends</h2>
            </div>
            <div className='line'></div>
            <Users users={mainUsers} addFriend={addFriend} />
        </div>}
        
        <div>
            {second.map((post, idx)=> (
                <div className='main_post mb-5 py-5 d-flex justify-content-center' key={idx}>
                    <div style={{width: '90%'}}>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div className='d-flex align-items-center'>
                                <img src="/assets/img1.JPG" className='post_img' width='50' height='50' style={{borderRadius: '50%'}} alt="" />
                                <div className='ms-3 pt-2'>
                                    <h1>{post?.user.name}</h1>
                                    <h3>{calendarDate(post?.updated_at.slice(0,post?.updated_at.indexOf('T')))}</h3>
                                </div>
                            </div>
                            <div>
                                <h2 className='fw-bolder'>...</h2>
                            </div>
                        </div>
                        <div>
                            <p className='my-3'>{post?.text}</p>
                            <div className="post_imgs mt-2">
                                {post?.images.length === 1 && post?.images.map((img, id)=> (
                                    <>
                                        {img.file.includes('mp4')?
                                            <video src={img.file} className='full' controls />
                                            :
                                            <img src={img.file} className='full' alt="" key={id} />
                                        }
                                    </>
                                ))}
                                {post?.images.length > 1 && post?.images.map((img, id)=> (
                                    <>
                                        {img.file.includes('mp4')?
                                            <video src={img.file} controls />
                                            :
                                            <img src={img.file} alt="" key={id} />
                                        }
                                    </>
                                ))}
                            </div>
                            <div className='d-flex post_actions mt-3 justify-content-between' style={{width: '85%', cursor: 'pointer'}}>
                                <div className='d-flex align-items-center' onClick={()=> {getComments(post?.id); setSubReply(false); setCommentId(''); setSubComment([]); setPostId(post?.id); router.refresh();}}>
                                    <img src="/assets/comment.png" className='pt-3' alt="" />
                                    <h5 className='ms-3'>{post?.comments.length}</h5>
                                </div>
                                <div className='d-flex align-items-center' style={{cursor: 'pointer'}} onClick={(e)=> likePost(post?.id, post?.likes)}>
                                    <img src="/assets/like.png" alt="" />
                                    <h5 className='ms-3'>{post?.likes.length}</h5>
                                </div>
                                <div className='d-flex align-items-center' style={{cursor: 'pointer'}} onClick={(e)=> sharePost(post?.id, post?.share)}>
                                    <img src="/assets/share.png" alt="" />
                                    <h5 className='ms-3'>{post?.share.length}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            ))}
        </div>
        
        <Modals setComments={setComments} postD={true} commentId={commentId} setCommentId={setCommentId} setSubReply={setSubReply} setSubComment={setSubComment} subReply={subReply} subComment={subComment} comments={comments} postId={postId} commentRef={commentRef} commentScrollRef={commentScrollRef}  postRef4={postRef4} postRef4Close={postRef4Close} postRef={postRef} postRefClose={postRefClose} postRef2={postRef2} postRef2Close={postRef2Close} postRef3={postRef3} postRef3Close={postRef3Close} />
    </div>
  )
}

export default Content