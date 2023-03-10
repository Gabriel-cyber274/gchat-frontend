"use client"
import React, { useEffect, useState, useRef } from 'react'
import Stories from '../design/stories'
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



const baseUrl = environment.scheme + environment.baseUrl;
function Main_content({posts,sharedPrivate, sharedPublic, privatePost, myPost}) {
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
    const [files, setFiles] = useState([]);
    const [rot, setRot] = useState(0)
    const [zoom, setZoom] = useState(0);
    const [showLib, setShowLib] = useState(false);
    const [postText, setPostText] = useState('');
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [postId, setPostId] = useState('');
    const [subComment, setSubComment] = useState([]);
    const [subReply, setSubReply] = useState(false);
    const [subUser, setSubUser] = useState('');
    const [commentId, setCommentId] = useState('');
    const [postType, setPostType] = useState(false);
    const [postPublic, setPostPublic] = useState(true)







  return (
    <>
        
        <div className='main_container py-5'>
            <div className='row'>
                <div className="col-2">
                    <div className='create_new side_design py-5 position-sticky'>
                        <div className='d-flex justify-content-center'>
                            <div style={{width: 'max-content'}}>
                                <button className='py-3 px-4 mb-5' onClick={()=> {postRef.current.click()}}>
                                    Create New
                                    <img src="/assets/add.png" className='ms-2' alt="" />
                                </button>   
                                <div className='d-flex align-items-center'>
                                    <img src="/assets/people2.png" alt="" />
                                    <h6 className='ms-3'>Friends</h6>
                                </div>
                                <div className='d-flex align-items-center my-5'>
                                    <img src="/assets/media2.png" alt="" />
                                    <h6 className='ms-3'>Videos</h6>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <img src="/assets/settings.png" alt="" />
                                    <h6 className='ms-3'>Settings</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-8">
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
                </div>
                <div className="col-2">
                    <div className='side_design2 py-5 position-sticky'>
                        <div className='d-flex justify-content-center'>
                            <div style={{width: 'max-content'}}>
                                <h1 className='mb-2'>Recent Messages</h1>
                                <div className='d-flex align-items-center mt-5'>
                                    <div className='position-relative'>
                                        <img src="/assets/people2.png" alt="" />
                                        <div className='active'></div>
                                    </div>
                                    <div className='ms-2'>
                                        <h5 >Johnson Carter</h5>
                                        <div className='d-flex align-items-center'>
                                            <h6>Good luck!!!!</h6>
                                            <span className='ms-3'>11:30 AM</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mt-5'>
                                    <div className='position-relative'>
                                        <img src="/assets/people2.png" alt="" />
                                        <div className='active'></div>
                                    </div>
                                    <div className='ms-2'>
                                        <h5 >Johnson Carter</h5>
                                        <div className='d-flex align-items-center'>
                                            <h6>Good luck!!!!</h6>
                                            <span className='ms-3'>11:30 AM</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mt-5'>
                                    <div className='position-relative'>
                                        <img src="/assets/people2.png" alt="" />
                                        <div className='active'></div>
                                    </div>
                                    <div className='ms-2'>
                                        <h5 >Johnson Carter</h5>
                                        <div className='d-flex align-items-center'>
                                            <h6>Good luck!!!!</h6>
                                            <span className='ms-3'>11:30 AM</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mt-5'>
                                    <div className='position-relative'>
                                        <img src="/assets/people2.png" alt="" />
                                        <div className='active'></div>
                                    </div>
                                    <div className='ms-2'>
                                        <h5 >Johnson Carter</h5>
                                        <div className='d-flex align-items-center'>
                                            <h6>Good luck!!!!</h6>
                                            <span className='ms-3'>11:30 AM</span>
                                        </div>
                                    </div>
                                </div>
                                <h4 className='text-center mt-5'>Hide Recent Messages</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer theme="colored"  />
        </div>
    </>
  )
}

export default Main_content