"use client"
import React, { useEffect, useState, useRef } from 'react'
import Stories from '../design/stories'
import { environment } from '../../environment/environment'
import { getCookie } from 'cookies-next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import moment from 'moment';
import EmojiPicker from 'emoji-picker-react';



const baseUrl = environment.scheme + environment.baseUrl;
function Main_content({posts}) {
    let token = getCookie('token');
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
    const [textOnly, setTextOnly] = useState(false)
    const [files, setFiles] = useState([]);
    const [rot, setRot] = useState(0)
    const [zoom, setZoom] = useState(0);
    const [showLib, setShowLib] = useState(false);
    // const [share, setShare] = useState(false);


    
    const notify_err = (res) => toast.error(res, { theme: "colored" });
    const notify = (res)=> {
        toast.success(res, { theme: "colored" })
    } 

    useEffect(()=> {
        setCurrentUser(JSON.parse(localStorage.currentUser).user)
    })

    useEffect(()=> {
    }, [files])

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
                // router.refresh();
                window.location.reload();
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
                // router.refresh();
                window.location.reload();
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
                // router.refresh();
                window.location.reload();
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
                    <label htmlFor="media" className='text-center text-white px-3 py-2 mt-5'>
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
                                    {file.type.includes('video') && <video src={URL.createObjectURL(files[idx])} width='100%' autoPlay height='600' class="d-block w-100" alt="..." controls></video>}
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

    
    const PostModal4 = (
        <div class="modal fade" id="exampleModal4" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog thirdModal modal-lg modal-dialog-centered">
                <div class="modal-content post3">
                <div class="modal-header justify-content-between closeP2">
                    <button type="button" ref={postRef4Close} class="btn-close d-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div style={{cursor: 'pointer', width: '30px', height:'30px'}}  onClick={()=> {postRef4Close.current.click(); postRef3.current.click();}}>
                        <img src="/assets/left.png"  alt="" />
                    </div>
                    <button>Share</button>
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
                    <div className='post4_post py-3 px-3'>
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
                        <div>
                            <textarea name="" id="" cols="30" rows="10" placeholder='Write A Caption'></textarea>
                            <div>
                                <EmojiPicker />
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )


    const textPost = async(e)=> {
        e.preventDefault();

        let url = baseUrl + environment.post.main;
        const data = {
            text: e.target[0].value,
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
            // router.refresh();
            window.location.reload();
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


  return (
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
                        <div style={{width: '90%'}}>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='d-flex align-items-center'>
                                    <img src="/assets/img1.JPG" className='post_img' width='50' height='50' style={{borderRadius: '50%'}} alt="" />
                                    <div className='ms-3 pt-2'>
                                        <h1>{currentUser.name}</h1>
                                        <div>
                                            <img src="/assets/world.png" className='me-2' alt="" />
                                            <span>Public <img className='ms-2' src="/assets/down.png" alt="" /></span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h2 className='fw-bolder'>...</h2>
                                </div>
                            </div>
                            <div>
                                <form action="" onSubmit={textPost}>
                                    <input type="text" onChange={(e)=> {e.target.value !== ''? setTextOnly(true): setTextOnly(false)}} className='py-4 px-2' placeholder="What's new with you?" />
                                    {textOnly && <button className='btn btn-primary mt-2 px-3 '>Post</button>}
                                </form>
                                {!textOnly && <div className='d-flex align-items-center mt-3' style={{cursor: 'pointer'}} onClick={()=> {postRef2.current.click()}}>
                                    <img src="/assets/post.png" alt="" />
                                    <h4 className='ms-2'>Photo / Video</h4>
                                </div>}
                            </div>
                        </div>
                    </div>
                    {posts.post.length=== 0 ?
                    <h6>No post</h6>
                    :
                    posts.post.map((post, idx)=> (
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
                                        <div className='d-flex align-items-center'>
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
        {PostModal}
        {PostModal2}
        {PostModal3}
        {PostModal4}
        <ToastContainer theme="colored"  />
    </div>
  )
}

export default Main_content