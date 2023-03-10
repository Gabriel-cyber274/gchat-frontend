"use client"
import React, { useEffect, useState, useRef } from 'react'
import Stories from '../../components/design/stories'
// import Stories from '../design/stories'
import { environment } from '../../environment/environment'
import { getCookie } from 'cookies-next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import moment from 'moment';
// import EmojiPicker from 'emoji-picker-react';
import axios, {isCancel, CancelToken} from 'axios'
import Pusher from "pusher-js";
import Echo from "laravel-echo";
// import  'emoji-picker-element';
// import Main_content from '../../components/main_component/Main_content'
import {Sansita} from '@next/font/google'
// import { useRouter } from 'next/navigation'
import Modals from '../../components/main_component/Modals'


const sansation = Sansita({ subsets: ['latin'], weight: '700' })

const baseUrl = environment.scheme + environment.baseUrl;
function Content({posts, sharedPrivate, sharedPublic, privatePost, myPost}) {
  let token = getCookie('token');
  const [mainPost, setMainPost] = useState([]);
  const router = useRouter();
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
  const [textOnly, setTextOnly] = useState('')
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState('');
  const [postType, setPostType] = useState(false);
  const [postPublic, setPostPublic] = useState(true);
  const [subComment, setSubComment] = useState([]);
  const [subReply, setSubReply] = useState(false);
  const [commentId, setCommentId] = useState('');
  // const router = useRouter();

  
    // const cookies = new Cookies();

    // const options = {
    //     broadcaster: "pusher",
    //     key: "7f0a98912565df7f4f9a",
    //     cluster: "eu",
    //     forceTLS: true,
    //     encrypted: false,
    //     //authEndpoint is your apiUrl + /broadcasting/auth
    //     authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
    //     // As I'm using JWT tokens, I need to manually set up the headers.
    //     auth: {
    //         headers: {
    //             // "X-CSRF-TOKEN": 'csrf_token',
    //             Authorization: "Bearer " + token,
    //             Accept: "application/json"
    //         }
    //     }
    // };

    // const echo = new Echo(options);

    // useEffect(()=> { 
    // }, [])
    
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
  
  const notify_err = (res) => toast.error(res, { theme: "colored" });
  const notify = (res)=> {
      toast.success(res, { theme: "colored" })
  } 

  useEffect(()=> {
      setCurrentUser(JSON.parse(localStorage.currentUser).user)
  }, [])

  useEffect(()=> {
      let post = [];
      post.push(...posts.post, ...privatePost.post, privatePost.myPrivate);

      let post2 = [];
      post2.push(...sharedPrivate.post, ...sharedPublic.post);

      let rand1 = Math.floor(Math.random()* post.length-1) + 1

      let main = [];
      main.push(...post.sort((a,b)=> b.id - a.id).slice(0, rand1), ...post2, ...post.sort((a,b)=> b.id - a.id).slice(rand1))


      // ...myPost.post
      setMainPost(main); 
  }, [posts,sharedPrivate, sharedPublic, privatePost, myPost])



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

const textPost = async()=> {
  // e.preventDefault();
  let url = baseUrl + environment.post.main;
  const data = {
      text: textOnly,
      public: postPublic
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
      // e.target.reset();
      setTextOnly('');
      router.refresh();
      if(res.success) {
          notify(res.message)
          // echo.private('post')
          // .listen('.PostCreated', (e) => {
          //     // this.Post.push({
          //     //   text: e.post.text,
          //     //   user_id: e.post.user_id
          //     // });
          //     alert('hello world');
          //     console.log('john', 'ebuka')
          // });
      }else {
          notify_err(res.message)
      }
  } catch (error) {
      notify_err('error')
      return error
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


  return (
    <div className={`${sansation.className}`}>
      <div>
          <div className='stories d-flex justify-content-center py-4'>
              <div style={{width:'90%'}}>
                  <h1 className='mb-4'>Stories</h1>
                  {/* <div className='story_slide d-flex'>
                      <div className='box1 d-flex justify-content-center align-items-center'>
                          <div className='box2 d-flex justify-content-center align-items-center'>
                              <div className='text-center' style={{width: '95%'}}>
                                  <img src="/assets/create.png" alt="" />
                                  <h4 className='mt-3'>Create A story</h4>
                              </div>
                          </div>
                      </div>
                      <div className='box1 ms-5'>
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
                  </div> */}
                  <Stories />
              </div>
          </div>
          <div className='create_post my-5 py-4 d-flex justify-content-center'>
              <div style={{width: '90%'}} className='position-relative'>
                  <div className='d-flex  justify-content-between align-items-center'>
                      <div className='d-flex align-items-center'>
                          <img src="/assets/img1.JPG" className='post_img' width='50' height='50' style={{borderRadius: '50%'}} alt="" />
                          <div className='ms-3 pt-2'>
                              <h1>{currentUser.name}</h1>
                              <div className='d-flex' style={{cursor: 'pointer'}}>
                                  <div className={postType && 'p-1'} style={{border: postType &&  '1px solid rgba(58, 58, 58, 0.34)', borderRadius: postType && '3px', background: postType && 'white'}}>
                                      {(postType || postPublic) && <div className='d-flex' onClick={()=> {setPostType(false); setPostPublic(true)}}>
                                          <img src="/assets/world.png" width={'16px'} height='16px' style={{marginTop: '5px'}} className='me-2' alt="" />
                                          <div>
                                              <span>Public </span>
                                          </div>
                                      </div>}
                                      {(postType || !postPublic) && <div className='d-flex' onClick={()=> {setPostType(false); setPostPublic(false)}}>
                                          <img src="/assets/people3.png" width={'16px'} height='13px' style={{marginTop: '5px'}} className='me-2' alt="" />
                                          <div>
                                              <span>Friends</span>
                                          </div>
                                      </div>}
                                  </div>
                                  <div onClick={()=> setPostType(!postType)}>
                                      {!postType && <img className='ms-2' height={'11px'} width='15px' src="/assets/down.png" alt="" />}
                                      {postType && <img className='ms-2' style={{transform: 'rotate(180deg)'}} height={'11px'} width='15px' src="/assets/down.png" alt="" />}
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div>
                          {textOnly !== '' && <button onClick={textPost} className='px-3 post_text_first'>Post</button>}
                      </div>
                  </div>
                  <div>
                      <form action="" onSubmit={(e)=> e.preventDefault()}>
                          <textarea type="text" value={textOnly} onChange={(e)=> {e.target.value !== ''? setTextOnly(e.target.value): setTextOnly('')}} className='py-4 px-2' placeholder="What's new with you?" />
                      </form>
                      {!textOnly && <div className='d-flex align-items-center mt-3' style={{cursor: 'pointer'}} onClick={()=> {postRef2.current.click()}}>
                          <img src="/assets/post.png" alt="" />
                          <h4 className='ms-2'>Photo / Video</h4>
                      </div>}
                  </div>
              </div>
          </div>
          {mainPost.length=== 0 ?
          <h6>No post</h6>
          :
          mainPost.map((post, idx)=> (
              <div className='main_post mb-5 py-5 d-flex justify-content-center' key={idx}>
                  <div style={{width: '90%'}}>
                      <div className='d-flex justify-content-between align-items-center'>
                          <div className='d-flex align-items-center'>
                              <img src="/assets/img1.JPG" className='post_img' width='50' height='50' style={{borderRadius: '50%'}} alt="" />
                              <div className='ms-3 pt-2'>
                                  <h1>{post.user.name}</h1>
                                  <h3>{calendarDate(post.updated_at.slice(0,post.updated_at.indexOf('T')))}</h3>
                              </div>
                          </div>
                          <div>
                              <h2 className='fw-bolder'>...</h2>
                          </div>
                      </div>
                      <div>
                          <p className='my-3'>{post.text}</p>
                          <div className="post_imgs mt-2">
                              {post.images.length === 1 && post.images.map((img, id)=> (
                                  <>
                                      {img.file.includes('mp4')?
                                          <video src={img.file} className='full' controls />
                                          :
                                          <img src={img.file} className='full' alt="" key={id} />
                                      }
                                  </>
                              ))}
                              {post.images.length > 1 && post.images.map((img, id)=> (
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
                              <div className='d-flex align-items-center' onClick={()=> {getComments(post.id); setSubReply(false); setCommentId(''); setSubComment([]); setPostId(post.id); router.refresh();}}>
                                  <img src="/assets/comment.png" className='pt-3' alt="" />
                                  <h5 className='ms-3'>{post.comments.length}</h5>
                              </div>
                              <div className='d-flex align-items-center' style={{cursor: 'pointer'}} onClick={(e)=> likePost(post.id, post.likes)}>
                                  <img src="/assets/like.png" alt="" />
                                  <h5 className='ms-3'>{post.likes.length}</h5>
                              </div>
                              <div className='d-flex align-items-center' style={{cursor: 'pointer'}} onClick={(e)=> sharePost(post.id, post.share)}>
                                  <img src="/assets/share.png" alt="" />
                                  <h5 className='ms-3'>{post.share.length}</h5>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          ))
          }
      </div>
          <Modals setComments={setComments} postD={true} commentId={commentId} setCommentId={setCommentId} setSubReply={setSubReply} setSubComment={setSubComment} subReply={subReply} subComment={subComment} comments={comments} postId={postId} commentRef={commentRef} commentScrollRef={commentScrollRef}  postRef4={postRef4} postRef4Close={postRef4Close} postRef={postRef} postRefClose={postRefClose} postRef2={postRef2} postRef2Close={postRef2Close} postRef3={postRef3} postRef3Close={postRef3Close} />
        
  {/* const postRef = useRef(null);
  const postRefClose = useRef(null);
  const postRef2 = useRef(null);
  const postRef2Close = useRef(null);
  const postRef3 = useRef(null);
  const postRef3Close = useRef(null);
  const postRef4 = useRef(null);
  const postRef4Close = useRef(null);
  const commentRef = useRef(null);
  const commentScrollRef = useRef(null); */}
        {/* <Main_content posts={post} sharedPrivate={sharedPrivate} myPost={myPost} sharedPublic={sharedPublic} privatePost={privatePost} /> */}
    </div>
  )
}

export default Content