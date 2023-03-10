"use client"
import React, { useEffect, useState, useRef } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { environment } from '../../environment/environment'
import { getCookie } from 'cookies-next';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import moment from 'moment';
// import EmojiPicker from 'emoji-picker-react';
import axios, {isCancel, CancelToken} from 'axios'
import Pusher from "pusher-js";
import Echo from "laravel-echo";


const baseUrl = environment.scheme + environment.baseUrl;
function Modals({setComments, postD, commentId, setCommentId, setSubReply, setSubComment, subComment, subReply, postId, comments, commentScrollRef, commentRef, postRef4Close, postRef4, postRef3Close, postRef3, postRef, postRefClose, postRef2, postRef2Close}) {
  const [files, setFiles] = useState([]);
  const [rot, setRot] = useState(0)
  const [zoom, setZoom] = useState(0);
  const [showLib, setShowLib] = useState(false);
  const [postText, setPostText] = useState('');
  let token = getCookie('token');
  const [subUser, setSubUser] = useState('');
  const [commentText, setCommentText] = useState('');
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState({});
    
  
  useEffect(()=> {
    setCurrentUser(JSON.parse(localStorage.currentUser).user)
}, [])
  
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

  
   


  const selectedMedia = (e)=> {
    let arr = []
    arr.push(...e.target.files);

    setFiles(arr)
    postRef2Close.current.click()
    setTimeout(() => {
        postRef3.current.click();
    }, 1000);
}



const rotateImage = ()=> {
    let media = document.querySelector('.post_carousel .carousel-item.active')
    let images = document.querySelector('.post_carousel .carousel-item.active img')
    let videos = document.querySelector('.post_carousel .carousel-item.active video')
    setRot(rot -90);
    
    if(media.innerHTML.includes('img')) {
        images.style.transform = `rotate(${rot}deg)`;
        images.style.transition = '0.5s';
    }else {
        videos.style.transform = `rotate(${rot}deg)`;
        videos.style.transition = '0.5s';
    }
}

const zoomImage = (e)=> {
    let media = document.querySelector('.post_carousel .carousel-item.active')
    let images = document.querySelector('.post_carousel .carousel-item.active img')
    let videos = document.querySelector('.post_carousel .carousel-item.active video')
    setZoom(e.target.value)
    if(media.innerHTML.includes('img')) {
        images.style.transition = '0.5s';
        images.style.transform = `scale(${e.target.value})`;
    }else {
        videos.style.transition = '0.5s';
        videos.style.transform = `scale(${e.target.value})`;
    }
}

const firstZoom = ()=> {
    let media = document.querySelector('.post_carousel .carousel-item.active')
    let images = document.querySelector('.post_carousel .carousel-item.active img')
    let videos = document.querySelector('.post_carousel .carousel-item.active video')
    setZoom(1)
    if(media.innerHTML.includes('img')) {
        images.style.transition = '0.5s';
        images.style.transform = `scale(${1})`;
    }else {
        videos.style.transition = '0.5s';
        videos.style.transform = `scale(${1})`;
    }
}


const removeMedia = (name)=> {
    if(files.length === 1) {
        postRef3Close.current.click(); 
        postRef2.current.click();
    }else {
        setFiles(files.filter(file => file.name !== name));
    }

}

const addMedia = (e)=> {
    setFiles([...files, ...e.target.files]);
}


const emojiClicked = (e)=> {
    // document.querySelector('emoji-picker')
    // .addEventListener('emoji-click', event => {
    //     // console.log(event.detail.unicode, 'ebuka');  
    //     let jj = postText;
    //     jj.split('');
    //     jj.push(event.detail.unicode)
    //     jj.join('')
    //     console.log(jj, 'ebuka');
    //     setPostText(postText + event.detail.unicode)
    // });
    // console.log('ebuka')
    setPostText(postText + e.emoji)
}


// posts

const postMedia = async()=> {
    postRef4Close.current.click()
    let url = baseUrl + environment.post.main;
    const data = {
        text: postText,
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
        if(res.success) {
            mediaPost(res.post_id)
        }else {
            notify_err(res.message)
        }
    } catch (error) {
        notify_err('error')
        return error
    }   
}

const mediaPost = async(id)=> {
    let url = baseUrl + environment.post.media;
    
    console.log(files, 'ebuka')
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append(`file`, files[i]);
    }   
    formData.append('post_id', id)

    try {
        const response = await axios({
            url: url,  
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data: formData,
        });
        console.log(response.data.success, 'ebuka')
        router.refresh();
        if(response.data.success) {
            notify(response.data.message)
        }else {
            notify_err(response.data.message)
        }
    } catch (error) {
        notify_err('error')
        console.log(error, 'ebuka')
        return error
    }   

}




// comments
const sendComment = async() => {
    // e.preventDefault();
    if(commentText.length === 0) {
        notify_err('write some text')
    }
    else if(!subReply) {
        let url = baseUrl + environment.comments.main;
        const data = {
            post_id: postId,
            comment: commentText
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
            setCommentText('')
            if(res.success) {
                notify(res.message)
                getComments2(postId)
                commentScrollRef.current.scrollIntoView({behaviour: 'smooth'});
            }else {
                notify_err(res.message)
            }
        } catch (error) {
            notify_err('error')
            return error
        }
    }
    else if (subReply) {
        let url = baseUrl + environment.comments.subComment;
        const data = {
            comment_id: subUser.slice(subUser.indexOf(',')+1, subUser.length),
            comment: commentText
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
            setCommentText('')
            if(res.success) {
                notify(res.message)
                showSubComment2(res.subcomment.comment_id);
                getComments2(postId);
                // commentScrollRef.current.scrollIntoView()
            }else {
                notify_err(res.message)
            }
        } catch (error) {
            notify_err('error')
            return error
        }
    }
}


const getComments2 = async(id)=> {
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
        if(res.success) {
            setComments(res.comments);
        }else {
            notify_err(res.message)
        }
    } catch (error) {
        notify_err('error')
        return error
    }
}

const showSubComment = async(id)=> {
    if(subComment.length > 0) {
        setCommentId('');
        setSubComment([])
    }else {
        let url = baseUrl + environment.comments.subComment + `/${id}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            });
            
            const res = await response.json();
            console.log(res)
            if(res.success) {
                setSubComment(res.subcomment);
            }else {
                notify_err(res.message)
            }
        } catch (error) {
            notify_err('error')
            return error
        }
    }
}

const showSubComment2 = async(id)=> {
    let url = baseUrl + environment.comments.subComment + `/${id}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        });
        
        const res = await response.json();
        router.refresh();
        if(res.success) {
            setSubComment(res.subcomment);
        }else {
            notify_err(res.message);
        }
    } catch (error) {
        notify_err('error')
        return error
    }

}


const deleteComment = async(comment)=> {
    if(comment.user_id === currentUser.id) {
        let url = baseUrl + environment.comments.deleteComment + `${comment.id}`
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
                notify(res.message);
                setComments(comments.filter(com => com.id !== comment.id))
            }else {
                notify_err(res.message)
            }
        } catch (error) {
            notify_err('error')
            return error
        }
    }else {
        notify_err('you cannot delete this comment')
    }
}

    // modals
    const PostModal = (
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog firstModal modal-lg modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header closeP">
                    <button type="button" class="btn-close" ref={postRefClose} data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <h1 className='text-center'>Create New</h1>
                <div className='media_text d-flex justify-content-around align-items-center' style={{cursor: 'pointer'}}>
                    <div className="med text-center d-flex flex-column justify-content-center align-items-center" onClick={()=> {postRefClose.current.click(); postRef2.current.click();}}>
                        <img src="/assets/photo.png" alt="" />
                        <h2 className='text-center mt-2'>Photo/Video</h2>
                    </div>
                    <div className="text text-center d-flex flex-column justify-content-center align-items-center">
                        <img src="/assets/text.png" alt="" />
                        <h2 className='text-center mt-2'>Text</h2>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )

    
    const PostModal2 = (
        <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog firstModal modal-lg modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header justify-content-start closeP">
                    <button type="button" ref={postRef2Close} class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div style={{cursor: 'pointer', width: '30px', height:'30px'}}  onClick={()=> {postRef2Close.current.click(); postRef.current.click();}}>
                        <img src="/assets/left.png"  alt="" />
                    </div>
                </div>
                <h1 className='text-center'>Create New</h1>
                <div className='media_text d-flex justify-content-center flex-column align-items-center' style={{cursor: 'pointer'}}>
                    <div className="med text-center d-flex flex-column justify-content-center align-items-center">
                        <img src="/assets/photo.png" alt="" />
                        <h2 className='text-center mt-2'>Photo/Video</h2>
                    </div>
                    <label htmlFor="media" style={{cursor: 'pointer'}} className='text-center text-white px-3 py-2 mt-5'>
                        Select from computer
                        <input type="file" onChange={selectedMedia} multiple id='media' className='d-none' />
                    </label>
                </div>
                </div>
            </div>
        </div>
    )

    const PostModal3 = (
        <div class="modal fade" id="exampleModal3" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog thirdModal modal-lg modal-dialog-centered">
                <div class="modal-content post3">
                <div class="modal-header justify-content-between closeP2">
                    <button type="button" ref={postRef3Close} class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div style={{cursor: 'pointer', width: '30px', height:'30px'}}  onClick={()=> {postRef3Close.current.click(); postRef2.current.click();}}>
                        <img src="/assets/left.png"  alt="" />
                    </div>
                    {files.length === 0 && <button style={{cursor: 'pointer'}} onClick={()=> notify_err('you must add media to post')}>Next</button>}
                    {files.length > 0 && <button style={{cursor: 'pointer'}} onClick={()=> {postRef3Close.current.click(); postRef4.current.click()}}>Next</button>}
                </div>
                <h1 className='text-center crop'>Crop</h1>
                <div className='post_carousel position-relative'>
                    <div id="carouselExampleIndicators" class="carousel slide" >
                        <div class="carousel-indicators post-indicator">
                            {files.length > 0 && files.map((file, idx)=> (
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to={idx} class={`${idx==0 && 'active'}`} aria-current="true" aria-label={`Slide ${idx}`}></button>
                            ))}
                        </div>
                        <div class="carousel-inner" onClick={()=> {setZoom(0); setShowLib(false)}}>
                            {files.length > 0 && files.map((file, idx)=> (
                                <div class={`carousel-item ${idx== 0 && 'active'}`}>
                                    {file.type.includes('image') && <img src={URL.createObjectURL(files[idx])} height='600' class="d-block w-100" alt="..."/>}
                                    {file.type.includes('video') && <video src={URL.createObjectURL(files[idx])} width='100%' height='600' class="d-block w-100" alt="..." controls></video>}
                                </div>
                            ))}
                        </div>
                        {files.length> 0 && <>
                            <button class="carousel-control-prev" type="button" onClick={()=> {setZoom(0)}} data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" onClick={()=> {setZoom(0)}} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </>}
                    </div>
                    {files.length > 0 && <div className='d-flex image_viewer justify-content-between align-items-center'>
                        <div className='d-flex align-items-center'>
                            <div className='position-relative'>
                                {zoom > 0 && <input type="range" value={zoom} min={0.5} max={6.5} onChange={zoomImage} className='zoom' />}
                                <img src="/assets/zoom.png" alt="" onClick={firstZoom} />
                            </div>
                            <div className='ms-3' onClick={rotateImage}>
                                <img src="/assets/rotate.png" alt="" />
                            </div>
                        </div>
                        <div>
                            <div className='position-relative '>
                                {showLib && <div className='d-flex filter-image px-2 py-3'>
                                    {files.length > 0 && files.map((file, idx)=> (
                                        <div className='image-cont ms-2'>
                                            <img src="/assets/cancel2.png" className='position-absolute cancel' alt="" onClick={()=> removeMedia(file.name)} />
                                            {file.type.includes('image') && <img src={URL.createObjectURL(files[idx])} width='100%' height='100%'  className='position-absolute mainImg' alt="" />}
                                            {file.type.includes('video') && <video src={URL.createObjectURL(files[idx])} width='100%' height='100%'  className='position-absolute mainImg' alt="" controls />}
                                        </div>
                                    ))}
                                    <div className='add2'>
                                        <label htmlFor="add">
                                            <img src="/assets/add2.png" alt="" />
                                            <input type="file" id='add' multiple onChange={addMedia} className='d-none' />
                                        </label>
                                    </div>
                                </div>}
                                <img src="/assets/library.png" alt="" onClick={()=> setShowLib(true)} />
                            </div>
                        </div>
                    </div>}
                </div>
                </div>
            </div>
        </div>
    )


    // https://bitbucket.org/ikoobadev/ims-web-api/
    const PostModal4 = (
        <div class="modal fade" id="exampleModal4" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog thirdModal modal-lg modal-dialog-centered">
                <div class="modal-content post3">
                <div class="modal-header justify-content-between closeP2">
                    <button type="button" ref={postRef4Close} class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div style={{cursor: 'pointer', width: '30px', height:'30px'}}  onClick={()=> {postRef4Close.current.click(); postRef3.current.click();}}>
                        <img src="/assets/left.png"  alt="" />
                    </div>
                    <button onClick={postMedia}>Share</button>
                </div>
                <h1 className='text-center crop'>Crop</h1>
                <div className='d-flex' style={{borderTop: '0.8318px solid rgba(58, 58, 58, 0.22)', marginTop: '2px'}}>
                    <div className='post_carousel position-relative' style={{width: '55%'}}>
                        <div id="carouselExampleIndicators2" class="carousel slide" >
                            <div class="carousel-indicators post-indicator">
                                {files.length > 0 && files.map((file, idx)=> (
                                    <button type="button" data-bs-target="#carouselExampleIndicators2" data-bs-slide-to={idx} class={`${idx==0 && 'active'}`} aria-current="true" aria-label={`Slide ${idx}`}></button>
                                ))}
                            </div>
                            <div class="carousel-inner" onClick={()=> {setZoom(0); setShowLib(false)}}>
                                {files.length == 0 && 
                                    <label htmlFor="file3" className='btn btn-primary px-3 py-2 m-4'>
                                        Add media
                                        <input type="file" multiple id='file3' className='d-none' onChange={addMedia} />
                                    </label>
                                }
                                {files.length > 0 && files.map((file, idx)=> (
                                    <div class={`carousel-item ${idx== 0 && 'active'}`}>
                                        {file.type.includes('image') && <img src={URL.createObjectURL(files[idx])} height='600' class="d-block w-100" alt="..."/>}
                                        {file.type.includes('video') && <video src={URL.createObjectURL(files[idx])} width='100%' autoPlay height='600' class="d-block w-100" alt="..." controls></video>}
                                    </div>
                                ))}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators2" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators2" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className='post4_post py-3 px-3' style={{width: '45%'}}>
                        <div className='d-flex post4 align-items-center'>
                            <img src="/assets/img1.jpg" width='40px' height='40px' style={{borderRadius: '50%'}} alt="" />
                            <div className='ms-3'>
                                <h1>{currentUser.name}</h1>
                                <div style={{transform: 'scale(0.7)', marginLeft: '-20px', marginTop: '-10px'}}>
                                    <img src="/assets/world.png" className='me-2' alt="" />
                                    <span>Public <img className='ms-2' src="/assets/down.png" alt="" /></span>
                                </div>
                            </div>
                        </div>
                        <div className='text mt-4'>
                            <textarea name="" id="" value={postText} onChange={(e)=> setPostText(e.target.value)} cols="30" rows="10" placeholder='Write A Caption'></textarea>
                            <div className='emoji' onClick={emojiClicked}>
                                {/* <EmojiPicker width={'100%'} height={'360px'} onEmojiClick={emojiClicked} /> */}
                                {/* <emoji-picker class="dark" style={{height: '360px'}}  ></emoji-picker> */}
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )

    const CommentModal = (
        <div class="modal fade"  id="exampleModal5" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog thirdModal modal-lg modal-dialog-centered">
                <div class="modal-content comment1">
                <div class="modal-header justify-content-between closeP2">
                    <button type="button" ref={postRef4Close} class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    <h1 className='pt-3'>Comments</h1>
                </div>
                <div className='px-3'>  
                    <div className='main-comment-overflow mb-2'>
                        {postD && comments.length=== 0 && <h1>No Comments</h1>}
                        {postD && comments.length > 0 && comments.map((comment,idx)=> (
                            <div className='d-flex justify-content-between' key={idx}>
                                <div style={{width: '70%'}}>
                                    <div className='d-flex main-comment' >
                                        <img src="/assets/img1.jpg" className='mt-2' width={'50px'} height={'50px'} style={{borderRadius: '50%'}} alt="" />
                                        <div className='ms-3'>
                                            <h2 className='mb-3'>{comment.user.id === currentUser.id ? 'you' : comment.user.name} <span className='ms-3'>{comment.created_at.slice(comment.created_at.indexOf('T')+1, comment.created_at.lastIndexOf(':'))}{comment.created_at.slice(comment.created_at.indexOf('T')+1, comment.created_at.indexOf(':')) > 11 ? 'pm' : 'am'}</span></h2>
                                            <p>{comment.comment}
                                                <b className='ms-3' style={{cursor: 'pointer',}} onClick={()=> {showSubComment(comment.id); setCommentId(comment.id)}}>{subComment.length > 0 && commentId === comment.id ? 'Close replies' : `Show ${comment.subcomments.length} replies`}</b>
                                            </p>
                                        </div>  
                                    </div>
                                    {commentId === comment.id && subComment.length > 0 && subComment.map((com, idx)=> (
                                        <div className='sub' key={idx}>
                                            <div className='d-flex main-comment ms-3' >
                                                <img src="/assets/img1.jpg" className='mt-2' width={'50px'} height={'50px'} style={{borderRadius: '50%'}} alt="" />
                                                <div className='ms-3'>
                                                    <h2 className='mb-3'>{com.user.id === currentUser.id ? 'you' : com.user.name}</h2>
                                                    <p>{com.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='reply-icon d-flex' style={{cursor: 'pointer'}}>
                                    <img onClick={()=> {setSubReply(!subReply); setCommentText(''); setSubUser(`${comment.user.name},${comment.id}`)}} src="/assets/reply.png"  alt="" />
                                    {/* <img className='ms-4 pe-3' src="/assets/more.png" alt="" /> */}
                                    <div class="dropdown">
                                        {/* <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Dropdown link
                                        </a> */}
                                        <img className='ms-4 pe-3 dropdown-toggle' style={{width: '24px'}} data-bs-toggle="dropdown" aria-expanded="false" src="/assets/more.png" alt="" />

                                        <ul class="dropdown-menu">
                                            <li className="dropdown-item commentDelete" onClick={()=> deleteComment(comment)}>Delete Comment</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div ref={commentScrollRef}></div>
                </div>
                <div className='comment-textMain px-3'>
                    <div className='d-flex align-items-center py-4'  style={{borderTop: '1px solid rgba(58, 58, 58, 0.4)'}}>
                        <img src="/assets/img1.jpg" className='me-3' width={'50px'} height={'50px'} style={{borderRadius: '50%'}} alt="" />
                        <div className='position-relative comment-input'>
                            <form action="" onSubmit={(e)=> {sendComment(); e.preventDefault();}}>
                                <input className='rounded-pill' placeholder={subReply ? `Reply ${subUser.slice(0, subUser.indexOf(','))}` : 'Comment'} value={commentText} type="text" onChange={(e)=> setCommentText(e.target.value)} />
                                <img src="/assets/EMOJI.png" style={{cursor: 'pointer'}}  className='position-absolute emoji' alt="" />
                                <img src="/assets/reply2.png" onClick={sendComment} style={{cursor: 'pointer'}} className='position-absolute send' alt="" />
                            </form>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )

    


  return (
    <div>
        

        <button type="button" ref={postRef} style={{display: 'none'}} class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Launch demo modal
        </button>
        <button type="button" ref={postRef2} style={{display: 'none'}} class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2">
            Launch demo modal
        </button>
        <button type="button" ref={postRef3} style={{display: 'none'}} class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal3">
            Launch demo modal
        </button>
        <button type="button" ref={postRef4} style={{display: 'none'}} class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal4">
            Launch demo modal
        </button>
        
        <button type="button" ref={postD && commentRef} style={{display: 'none'}} data-bs-toggle="modal" data-bs-target="#exampleModal5">
            Launch demo modal
        </button>
            
            {PostModal}
            {PostModal2}
            {PostModal3}
            {PostModal4}
            {postD && CommentModal}
            
            <ToastContainer theme="colored"  />
    </div>
  )
}

export default Modals