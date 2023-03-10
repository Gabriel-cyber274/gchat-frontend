"use client"
import React, {useEffect, useRef, useState} from 'react'
import Nav from '../../components/main_component/Nav'
import { useRouter } from 'next/navigation';
import Modals from '../../components/main_component/Modals'
import { usePathname } from 'next/navigation';

function layout({children}) {
    const router = useRouter();
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
    const pathname = usePathname();
  useEffect(()=> {
    if(localStorage.currentUser === undefined || localStorage.currentUser === null ) {
      router.replace('/auth/login')
    }
  }, [])
  return (
    <>
        <Nav />
        <div className='main_container py-5'>
            <div className='row'>
                <div className="col-2">
                    <div className='create_new side_design py-5 position-sticky'>
                        <div className=''>
                            <div style={{cursor: 'pointer'}}>
                                <div className='ps-4'>
                                    <button className='py-3 px-4 mb-5' onClick={()=> {postRef.current.click()}}>
                                        Create New
                                        <img src="/assets/add.png" className='ms-2' alt="" />
                                    </button>   
                                </div>
                                <div className={`d-flex align-items-center px-4 py-2  ${pathname.includes('friends') && 'active'}`} >
                                    <img src="/assets/people2.png" alt="" />
                                    <h6 className='ms-3'>Friends</h6>
                                </div>
                                <div className={`d-flex align-items-center px-4 py-2 my-5 ${pathname.includes('videos') && 'active'}`} onClick={()=> router.push('/main/videos')}>
                                    <img src="/assets/media2.png" alt="" />
                                    <h6 className='ms-3'>Videos</h6>
                                </div>
                                <div className={`d-flex align-items-center px-4 py-2  ${pathname.includes('settings') && 'active'}`}>
                                    <img src="/assets/settings.png" alt="" />
                                    <h6 className='ms-3'>Settings</h6>
                                </div>
                                <div className={`d-flex align-items-center px-4 py-2 my-5 ${pathname.includes('shared') && 'active'}`} onClick={()=> router.push('/main/shared')}>
                                    <img src="/assets/shared.png" alt="" />
                                    <h6 className='ms-3'>Shared</h6>
                                </div>
                                <div className={`d-flex align-items-center px-4 py-2  ${pathname.includes('saved') && 'active'}`} onClick={()=> router.push('/main/saved')}>
                                    <img src="/assets/saved.png" alt="" />
                                    <h6 className='ms-3'>Saved</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-8">
                    {children}
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
        </div>
      <Modals commentRef={commentRef} commentScrollRef={commentScrollRef}  postRef4={postRef4} postRef4Close={postRef4Close} postRef={postRef} postRefClose={postRefClose} postRef2={postRef2} postRef2Close={postRef2Close} postRef3={postRef3} postRef3Close={postRef3Close} />
    </>
  )
}

export default layout