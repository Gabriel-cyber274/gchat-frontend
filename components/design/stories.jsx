"use client"
import React, { Component, useEffect, useState } from "react";
import Slider from "react-slick";
import CenterMode from "./center";

export default function Stories({stories, currentUser}) {
    const [idx, setIdx] = useState(0);
    const [storySlide, showStorySlide] = useState(false);
    const [storyId, setStoryId] = useState(0);


    useEffect(()=> {
        console.log(stories, 'ebuka')
        let boy = [{created_at
            : 
            "2023-03-28T17:44:54.000000Z"}, {created_at
            : 
            "2023-03-28T17:59:00.000000Z"}, {created_at
            : 
            "2023-03-28T17:45:03.000000Z"}]
            console.log(boy.map(v=> v.created_at).sort(), 'john')
            console.log(boy.filter(b=> b.created_at === boy.map(v=> v.created_at).sort()[0]), 'john')
        boy.sort((a,b)=> {
            console.log(a.created_at > b.created_at, 'john');
            return a.created_at > b.created_at
        })
    })

    const func = ()=> {
        return
    }
    
    const SamplePrevArrow = ({onClick}) => {
        return (
        <div className="arrow prev" onClick={!(idx===0) ? onClick : func} style={{cursor:'pointer'}}>
            {/* <FaAngleLeft /> */}
            {idx !==0 && <img src="/assets/arrow left.png" style={{transform: 'rotate(180deg)'}} alt="" />}
            {idx ===0 && <img src="/assets/arrow right.png" alt="" />}
        </div>
        )
    }

    const SampleNextArrow = ({onClick}) => {
        return (
        <div className="arrow next" onClick={onClick} style={{cursor:'pointer'}}>
            <img src="/assets/arrow left.png" alt="" />
            {/* {idx === 4 && <img src="/assets/arrow right.png" style={{transform: 'rotate(180deg)'}} alt="" />} */}
        </div>
        
        )
    }
    
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: stories.length,
        slidesToScroll: stories.length,
        // nextArrow: <SampleNextArrow />,
        // prevArrow: <SamplePrevArrow />,
        beforeChange: (current, next)=> setIdx(next),
    };


    return (
      <>
        <div className='story_slide'>    
                {stories.length <= 4 && <div className="d-flex justify-content-around">
                    <>
                        {<div>
                            <div className='box1 d-flex justify-content-center align-items-center'>
                                <div className='box2 d-flex justify-content-center align-items-center'>
                                    <div className='text-center' style={{width: '95%'}}>
                                        <img src="/assets/create.png" className="d-inline"  alt="" />
                                        <h4 className='mt-3'>Create A story</h4>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </>
                    <>
                        {stories.map((story,idx)=> (
                            <div key={idx} style={{cursor: 'pointer'}} onClick={()=> {showStorySlide(true); setStoryId(story.id)}}>
                                <div className='box1'>
                                    <div className='d-flex mt-3 justify-content-center align-items-center'>
                                        <div className='box2 story d-flex justify-content-center align-items-center'>
                                            <div className='text-center' style={{width: '95%'}}>
                                                {[...story.media, ...story.text].filter(b=> b.created_at === [...story.media, ...story.text].map(v=> v.created_at).sort()[[...story.media, ...story.text].length-1])[0].text? 
                                                    <>
                                                        <p className="story_first_text">{[...story.media, ...story.text].filter(b=> b.created_at === [...story.media, ...story.text].map(v=> v.created_at).sort()[[...story.media, ...story.text].length-1])[0].text.length > 70? [...story.media, ...story.text].filter(b=> b.created_at === [...story.media, ...story.text].map(v=> v.created_at).sort()[[...story.media, ...story.text].length-1])[0].text.slice(0, 70)+'...' : [...story.media, ...story.text].filter(b=> b.created_at === [...story.media, ...story.text].map(v=> v.created_at).sort()[[...story.media, ...story.text].length-1])[0].text}</p>
                                                    </>
                                                    :
                                                    <img style={{objectFit: 'cover'}} src={[...story.media, ...story.text].filter(b=> b.created_at === [...story.media, ...story.text].map(v=> v.created_at).sort()[[...story.media, ...story.text].length-1])[0].file} alt="" />
                                                }  
                                            </div>
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-center mt-2'>
                                        <div className='d-flex story_user align-items-center'>
                                            <img src="/assets/img2.JPG" width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
                                            <span className='ms-2'>{story.user.name === currentUser.name ? 'Your story': story.user.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                </div>}
            {stories.length > 4 && <Slider {...settings}>
                <>
                    <div>
                        <div className='box1 d-flex justify-content-center align-items-center'>
                            <div className='box2 d-flex justify-content-center align-items-center'>
                                <div className='text-center' style={{width: '95%'}}>
                                    <img src="/assets/create.png" className="d-inline"  alt="" />
                                    <h4 className='mt-3'>Create A story</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                <>
                    {stories.map((story,idx)=> (
                        <div key={idx}>
                            <div className='box1'>
                                <div className='d-flex mt-3 justify-content-center align-items-center'>
                                    <div className='box2 story d-flex justify-content-center align-items-center'>
                                        <div className='text-center' style={{width: '95%'}}>
                                            <img src="/assets/img1.JPG" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center mt-2'>
                                    <div className='d-flex story_user align-items-center'>
                                        <img src={story.media.length !== 0 ? story.media[story.media.length-1].file :  "/assets/img2.JPG"} width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
                                        <span className='ms-2'>Adam smith</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            </Slider>}
        </div>

        {storySlide && 
            <div className="story_slideC" style={{cursor: 'pointer'}}>
                <div className="d-flex justify-content-between px-5 py-4">
                    <div className="logo_stories">
                        <img src="/assets/G-Chat2.png" width={'158px'} alt="" />
                        <h2 className="mt-2">Stories</h2>
                    </div>
                    <div onClick={()=> showStorySlide(false)}>
                        <img src="/assets/x.png" width={'40px'} alt="" />
                    </div>
                </div>
                <div style={{padding: '40px 0'}}>
                    <CenterMode stories={stories} storyId={storyId} currentUser={currentUser} />
                </div>
            </div>
        }
      </>
    )
  
}
        //   <div>
        //     <div className='box1'>
        //         <div className='d-flex mt-3 justify-content-center align-items-center'>
        //             <div className='box2 story d-flex justify-content-center align-items-center'>
        //                 <div className='text-center' style={{width: '95%'}}>
        //                     <img src="/assets/img1.JPG" alt="" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className='d-flex justify-content-center mt-2'>
        //             <div className='d-flex story_user align-items-center'>
        //                 <img src="/assets/img2.JPG" width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
        //                 <span className='ms-2'>Adam smith</span>
        //             </div>
        //         </div>
        //     </div>
        //   </div>
        //   <div>
        //     <div className='box1'>
        //         <div className='d-flex mt-3 justify-content-center align-items-center'>
        //             <div className='box2 story d-flex justify-content-center align-items-center'>
        //                 <div className='text-center' style={{width: '95%'}}>
        //                     <img src="/assets/img1.JPG" alt="" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className='d-flex justify-content-center mt-2'>
        //             <div className='d-flex story_user align-items-center'>
        //                 <img src="/assets/img2.JPG" width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
        //                 <span className='ms-2'>Adam smith</span>
        //             </div>
        //         </div>
        //     </div>
        //   </div>
        //   <div>
        //     <div className='box1'>
        //         <div className='d-flex mt-3 justify-content-center align-items-center'>
        //             <div className='box2 story d-flex justify-content-center align-items-center'>
        //                 <div className='text-center' style={{width: '95%'}}>
        //                     <img src="/assets/img1.JPG" alt="" />
        //                 </div>
        //             </div>
        //         </div>
        //         <div className='d-flex justify-content-center mt-2'>
        //             <div className='d-flex story_user align-items-center'>
        //                 <img src="/assets/img2.JPG" width='25' height='25' style={{borderRadius: '50%', objectFit: 'cover'}} alt="" />
        //                 <span className='ms-2'>Adam smith</span>
        //             </div>
        //         </div>
        //     </div>
        //   </div>