"use client"
import React, { useEffect, useState, useRef } from 'react';
import { environment } from '../../../environment/environment'
import { getCookie } from 'cookies-next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import Modals from '../../../components/main_component/Modals';


const baseUrl = environment.scheme + environment.baseUrl;
function Content({shared}) {
    const [mainPost, setMainPost] = useState([]);
    const router = useRouter();
    let token = getCookie('token');
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
    const deleteCloseRef = useRef(null)
    const [subComment, setSubComment] = useState([]);
    const [subReply, setSubReply] = useState(false);
    const [commentId, setCommentId] = useState('');

    
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
    
  useEffect(()=> {
    setCurrentUser(JSON.parse(localStorage.currentUser).user)
  }, [])
    
    const notify_err = (res) => toast.error(res, { theme: "colored" });
    const notify = (res)=> {
        toast.success(res, { theme: "colored" })
    } 

    useEffect(()=> {
        setMainPost(shared.post)
    }, [shared])

    
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

const deleteShare = async()=> {
    let url = baseUrl + environment.post.share + `/${postId}`;
    // console.log(url);
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
        if(res.success) {
            notify(res.message)
            deleteCloseRef.current.click();
        }else {
            notify_err(res.message)
        }
    } catch (error) {
        notify_err('error')
        return error
    }
}


const savePost = async(id) => {
    let url = baseUrl + environment.post.save;
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

const deleteModal = (
    <div class="modal fade" data-bs-backdrop="static" data-bs-keyboard="false" id="exampleModal6" tabindex="-1" aria-labelledby="exampleModal6Label" aria-hidden="true">
        <div class="modal-dialog fourthModal modal-dialog-centered">
            <div class="modal-content comment1">
            <div class="modal-header justify-content-between">
                <button type="button" ref={deleteCloseRef} class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className='d-flex modal-footer justify-content-evenly align-items-center py-4'>
                <div>
                    <h2>Are you sure you want to discard this post ?</h2>
                </div>
                    <button className='yes px-3 py-2' onClick={deleteShare}>Yes</button>
                    <div onClick={()=> deleteCloseRef.current.click()}>
                        <button className='no px-3 py-2' >No</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)



  return (
    <div>
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
                          <div style={{cursor: 'pointer'}}>
                            <img src="/assets/delete.png" onClick={()=> setPostId(post.id)} data-bs-toggle="modal" data-bs-target="#exampleModal6" width={'30px'} alt="" />
                            <img className='ms-4' src="/assets/save.png" onClick={()=> savePost(post.id)} width={'30px'} alt="" />
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

          {deleteModal}
          <Modals setComments={setComments} postD={true} commentId={commentId} setCommentId={setCommentId} setSubReply={setSubReply} setSubComment={setSubComment} subReply={subReply} subComment={subComment} comments={comments} postId={postId} commentRef={commentRef} commentScrollRef={commentScrollRef}  postRef4={postRef4} postRef4Close={postRef4Close} postRef={postRef} postRefClose={postRefClose} postRef2={postRef2} postRef2Close={postRef2Close} postRef3={postRef3} postRef3Close={postRef3Close} />
    </div>
  )
}

export default Content