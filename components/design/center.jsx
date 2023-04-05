import React, { useState, useEffect, useRef, } from "react";
import Slider from "react-slick";
import { environment } from "../../environment/environment";
import { getCookie } from 'cookies-next';



const baseUrl = environment.scheme + environment.baseUrl
export default function CenterMode ({stories, storyId, currentUser, closeRef}) {
    const [idx, setIdx] = useState(0);
    const [activeStory, setActiveStory] = useState([]);
    const [scaleMedia, setScaleMedia] = useState(false);
    const [currentStory, setCurrentStory] = useState(0);
    const [storyData, setStoryData] = useState([]);
    const nextRef = useRef(null);
    // const [stopInt, setStopInt] = useState(false);
    const storyNextRef = useRef(null);
    let token = getCookie('token');
    const [loading, setLoading] = useState(false);
    // const [stopMedia, setStopMedia] = useState(false);


    const SamplePrevArrow = ({onClick}) => {
        return (
        <div className="arrow_stories prev_sto"  style={{cursor:'pointer'}}>
            <img src="/assets/storyA.png" alt="" onClick={onClick} style={{transform: 'rotate(180deg)', zIndex: '100'}} />
        </div>
        )
    }

    const SampleNextArrow = ({onClick}) => {
        return (
        <div className="arrow_stories next_sto"  style={{cursor:'pointer'}}>
            <img src="/assets/storyA.png" alt="" ref={storyNextRef} onClick={onClick} style={{zIndex: '100'}} />
        </div>
        
        )
    }

    const settings = {
      className: "center",
      centerMode: true,
      infinite: true,
      centerPadding: "60px",
      slidesToShow: 3,
      speed: 500,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      beforeChange: (current, next)=> setIdx(next),
    };

    const settings2 = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 1,
        speed: 500,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        beforeChange: (current, next)=> setIdx(next),
      };

    useEffect(()=> {
        setCurrentStory(0)
        setLoading(true)
        getStoryData([...activeStory, ...stories.filter(story=> story.id == storyId), ...stories.filter(story=> story.id !== storyId)][idx].id)
    }, [idx])

    const getStoryData = async(id)=> {
        setLoading(true)
        try {
            const res = await fetch(baseUrl + environment.stories.storyMedia + id, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'applications/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const res2 = await fetch(baseUrl + environment.stories.storyText + id, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'applications/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const response = await res.json();
            const response2 = await res2.json();
            if(response2.success && response.success) {
                setLoading(false)
                setStoryData([...response.media, ...response2.text])
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=> {
        setActiveStory([...activeStory, ...stories.filter(story=> story.id == storyId), ...stories.filter(story=> story.id !== storyId)])
    },[stories])
    
    useEffect(()=> {
        let change = !loading && setTimeout(async() => {
            let next = currentStory;
            if(stories.length === 1){
                closeRef.current.click();
            }
            else if(activeStory[idx] !== undefined && next >= [...activeStory[idx]?.media, ...activeStory[idx]?.text].length-1) {
                storyNextRef.current.click();
                next = [...activeStory[idx]?.media, ...activeStory[idx]?.text].length-1;
            }else {
                next ++
            }
            setCurrentStory(next)  
            if(activeStory[idx] !== undefined && [...activeStory[idx]?.media, ...activeStory[idx]?.text].filter(b=> b?.created_at === [...activeStory[idx]?.media, ...activeStory[idx]?.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file) {
                try {
                    const res = await fetch(baseUrl + environment.stories.singleMedia + [...activeStory[idx]?.media, ...activeStory[idx]?.text].filter(b=> b?.created_at === [...activeStory[idx]?.media, ...activeStory[idx]?.text].map(v=> v?.created_at).sort()[currentStory])[0].id, {
                        method: 'GET',
                        headers: {
                            'Content-Type' : 'applications/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    const response = await res.json();
                    console.log(response);
                } catch (error) {
                    console.log(error)
                }
            }else {
                try {
                    const res = await fetch(baseUrl + environment.stories.singletext + [...activeStory[idx]?.media, ...activeStory[idx]?.text].filter(b=> b?.created_at === [...activeStory[idx]?.media, ...activeStory[idx]?.text].map(v=> v?.created_at).sort()[currentStory])[0].id, {
                        method: 'GET',
                        headers: {
                            'Content-Type' : 'applications/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    // const response = await res.json();
                    // console.log(response);
                } catch (error) {
                    console.log(error)
                }
            }
            
        }, 3000);
        return ()=> clearTimeout(change);
    }, [currentStory, loading])



    const nextStory = async(item)=> {
        let next = currentStory;
        if(next >= item.length-1) {
            storyNextRef.current.click();
            next = item.length-1;
        }else {
            next ++
        }
        setCurrentStory(next)  
        if(item.filter(b=> b?.created_at === item.map(v=> v?.created_at).sort()[currentStory])[0]?.file) {
            try {
                const res = await fetch(baseUrl + environment.stories.singleMedia + item.filter(b=> b?.created_at === item.map(v=> v?.created_at).sort()[currentStory])[0].id, {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'applications/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                // const response = await res.json();
                // console.log(response);
            } catch (error) {
                console.log(error)
            }
        }else {
            try {
                const res = await fetch(baseUrl + environment.stories.singletext + item.filter(b=> b?.created_at === item.map(v=> v?.created_at).sort()[currentStory])[0].id, {
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'applications/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                // const response = await res.json();
                // console.log(response);
            } catch (error) {
                console.log(error)
            }
        }
    }

    const prevStory = (item)=> {
        setCurrentStory(v => v < 1 ? 0 : v-1);
    }



            // <div className='d-flex story_viewer justify-content-center'>
            //     <div className='active normal position-relative'>
            //         <div className="overlay start_inactive1"></div>
            //         <div className='d-flex justify-content-center'>
            //             <div className='stories_boxes d-none mt-3 row gx-2'>
            //                 <div className='box col'>
            //                     <div className="fill"></div>
            //                 </div>
            //                 <div className='box col'>
            //                 </div>
            //                 <div className='box col'>
            //                 </div>
            //                 <div className='box col'>
            //                 </div>
            //             </div>
            //         </div>
            //         <div className='d-flex d-none justify-content-center'>
            //             <div className='user_profstory mt-3 d-flex justify-content-between'>
            //                 <div className='d-flex align-items-center'>
            //                     <img src="/assets/img1.jpg" width='40px' height='40px' style={{borderRadius: '50%'}} alt="" />
            //                     <h2 className='ms-2'>Adam smith</h2>
            //                 </div>
            //                 <div>
            //                     <img src="/assets/pause.png" alt="" />
            //                     <img className="ms-3" src="/assets/speaker.png" alt="" />
            //                 </div>
            //             </div>
            //         </div>
            //         <div className="main_display">
            //             <img src="/assets/img2.jpg" alt="" />
            //             {/* <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quod necessitatibus libero dolor accusantium, veniam pariatur sequi quas architecto nostrum 
            //                 aperiam culpa ipsam voluptate totam quam excepturi ipsa! Minima, sapiente autem.
            //             </p> */}
            //         </div>
            //         <div className="next_inside d-none">
            //             <div className="right"></div>
            //             <div className="left"></div>
            //         </div>
            //         <div className="inactive text-center">
            //             <div>
            //                 <img src="/assets/img1.jpg" width={'70px'} height={'70px'} style={{borderRadius: '50%'}} alt="" />
            //                 <h2 className="my-3">Esther jeffrey</h2>
            //                 <h6>3hr</h6>
            //             </div>
            //         </div>
            //         <div className="story_reply d-none d-flex justify-content-center">
            //             <div style={{width: '95%'}} className='d-flex align-items-center'>
            //                 <div style={{width: '87%'}}>
            //                     <input type="text" className="rounded-pill" placeholder="Reply to Adam Smith..." />
            //                     <img className="emoji2" src="/assets/emoji2.png" alt="" />
            //                     <img className="send2" src="/assets/send2.png" alt="" />
            //                 </div>
            //                 <div className="ms-3">
            //                     <img src="/assets/like2.png" alt="" />
            //                 </div>
            //             </div>
            //         </div>
            //     </div>
            // </div>
            // || idx == 0 && [1,2,3,4].length-1 + 1 == idx

    return (
        <>
            {stories.length <= 3 && 
                <Slider {...settings2}>
                {activeStory.map((story, id)=> ( 
                    <div className='d-flex story_viewer justify-content-center' key={id}>
                        <div className={`active normal position-relative`}>
                            <div onDoubleClick={()=> setScaleMedia(!scaleMedia)} onKeyDown={()=> console.log('hello')} className={`overlay ${id !== idx && 'start_inactive1'}`}></div>
                            <div className='d-flex justify-content-center'>
                                <div className={`stories_boxes ${id !== idx && 'd-none'} mt-3 row gx-2`}>
                                    {[...story.media, ...story?.text].sort((a,b)=> a?.created_at < b?.created_at).map((item, id2)=> (
                                        <div className='box col'>
                                            {id2 === currentStory && !loading && <div className="fill start_fill"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`d-flex ${id !== idx && 'd-none'} justify-content-center`}>
                                <div className='user_profstory mt-3 d-flex justify-content-between'>
                                    <div className='d-flex align-items-center'>
                                        <img src="/assets/img1.jpg" width='40px' height='40px' style={{borderRadius: '50%'}} alt="" />
                                        <h2 className='ms-2'>{currentUser.name === story.user.name? 'your story' : story.user.name}</h2>
                                    </div>
                                    {!loading && <h6 className="text-white">{
                                    storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]
                                    .created_at.slice(storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]
                                    .created_at.indexOf('T')+1, storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]
                                    .created_at.lastIndexOf(':'))
                                    }</h6>}
                                    {[...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file && ([...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('mp4') || [...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('mov') || [...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('ogg') || [...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('qt')) && <div>
                                        <img src="/assets/pause.png" alt="" />
                                        <img className="ms-3" src="/assets/speaker.png" alt="" />
                                    </div>}
                                </div>
                            </div>
                            <div className="main_display">
                                {!loading && storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.text && 
                                    <>
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id === story.id && <p style={{zIndex: id !== idx? '-1' : '1'}}>{storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.text}</p>}
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id !== story.id && <p style={{zIndex: id !== idx? '-1' : '1'}}>{[...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.text}</p>}
                                    </>
                                }
                                {!loading && storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file && (storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('png') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('jpg') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('jpeg')) &&
                                    <>
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id === story.id && <img style={{objectFit: 'contain', transition: '0.5s', transform: scaleMedia ? 'scale(2)': 'scale(1)'}} src={storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file} alt="" />}
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id !== story.id && <img style={{objectFit: 'contain', transition: '0.5s', transform: scaleMedia ? 'scale(2)': 'scale(1)'}} src={[...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file} alt="" />}
                                    </>
                                }
                                {!loading && storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file && (storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('mp4') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('mov') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('ogg') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('qt')) &&
                                    <>
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id === story.id && <video style={{objectFit: 'contain',transition: '0.5s', transform: scaleMedia ? 'scale(2)': 'scale(1)'}} src={storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file} controls alt="" />}
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id !== story.id && <video style={{objectFit: 'contain',transition: '0.5s', transform: scaleMedia ? 'scale(2)': 'scale(1)'}} src={[...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file} controls alt="" />}
                                    </>
                                }


                            </div>
                            <div className="next_inside">
                                <div className="right" ref={nextRef} onClick={()=> !loading && nextStory([...story?.media, ...story?.text])}></div>
                                <div className="left" onClick={()=> !loading && prevStory([...story?.media, ...story?.text])}></div>
                            </div>
                            <div className={`inactive text-center ${id === idx && 'start_inactive2'}`}>
                                <div>
                                    <img src="/assets/img1.jpg" width={'70px'} height={'70px'} style={{borderRadius: '50%'}} alt="" />
                                    <h2 className="my-3">{currentUser.name === story.user.name? 'your story' : story.user.name}</h2>
                                    <h6>{[...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[[...story.media, story.text].length-2])[0]?.created_at !== undefined && [...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[[...story.media, story.text].length-2])[0]?.created_at.slice([...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[[...story.media, story.text].length-2])[0]?.created_at.indexOf('T') + 1, [...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[[...story.media, story.text].length-2])[0]?.created_at.lastIndexOf(':'))}</h6>
                                </div>
                            </div>
                            {loading && <h6 className="text-white position-absolute text-center" style={{zIndex: '1', width: '100%', top: '50%', height: '100%'}}>loading...</h6>}
                            {currentUser.name === story.user.name && !loading && storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.views !== undefined && <div className="story_views">
                                <h6 className="text-white">{storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.views.filter(v=> v.user_id !== currentUser.id).length}</h6>
                            </div>}
                            {currentUser.name !== story.user.name&& !loading && <div className={`story_reply d-flex ${id !== idx && 'd-none'} justify-content-center`}>
                                <div style={{width: '95%'}} className='d-flex align-items-center'>
                                    <div style={{width: '87%'}}>
                                        <input type="text" className="rounded-pill" placeholder={"Reply to" + ' ' + story.user.name + '...'} />
                                        <img className="emoji2" src="/assets/emoji2.png" alt="" />
                                        <img className="send2" src="/assets/send2.png" alt="" />
                                    </div>
                                    <div className="ms-3">
                                        <img src="/assets/like2.png" alt="" />
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                ))}
                </Slider>
            }
            
            
            {stories.length > 3 && <Slider {...settings}>
                {activeStory.map((story, id)=> ( 
                    <div className='d-flex story_viewer justify-content-center' key={id}>
                        <div className={`active ${(id-1 == idx || id+1 == idx || idx == 0 && id === activeStory.length-1 || idx === activeStory.length-1 && id == 0) && 'inactive3'} ${(id-2 == idx || id+2 == idx || idx == 0 && id == activeStory.length-2 || idx == activeStory.length-1 && id == 1 || idx == 1 && id == activeStory.length-1 || idx == activeStory.length-2 && id == 0) && 'inactive4'} normal position-relative`}>                     
                            <div onDoubleClick={()=> setScaleMedia(!scaleMedia)} className={`overlay ${id !== idx && 'start_inactive1'}`}></div>
                            <div className='d-flex justify-content-center'>
                                <div className={`stories_boxes ${id !== idx && 'd-none'} mt-3 row gx-2`}>
                                    {[...story.media, ...story?.text].sort((a,b)=> a?.created_at < b?.created_at).map((item, id2)=> (
                                        <div className='box col'>
                                            {id2 === currentStory && !loading && <div className="fill start_fill"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={`d-flex ${id !== idx && 'd-none'} justify-content-center`}>
                                <div className='user_profstory mt-3 d-flex justify-content-between'>
                                    <div className='d-flex align-items-center'>
                                        <img src="/assets/img1.jpg" width='40px' height='40px' style={{borderRadius: '50%'}} alt="" />
                                        <h2 className='ms-2'>{currentUser.name === story.user.name? 'your story' : story.user.name}</h2>
                                    </div>
                                    {!loading && <h6 className="text-white">{
                                    storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]
                                    .created_at.slice(storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]
                                    .created_at.indexOf('T')+1, storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]
                                    .created_at.lastIndexOf(':'))
                                    }</h6>}
                                    {[...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file && ([...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('mp4') || [...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('mov') || [...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('ogg') || [...story.media, ...story.text].filter(b=> b?.created_at === [...story.media, ...story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('qt')) && <div>
                                        <img src="/assets/pause.png" alt="" />
                                        <img className="ms-3" src="/assets/speaker.png" alt="" />
                                    </div>}
                                </div>
                            </div>
                            <div className="main_display">
                                {!loading && storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.text && 
                                    <>
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id === story.id && <p style={{zIndex: id !== idx? '-1' : '1'}}>{storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.text}</p>}
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id !== story.id && <p style={{zIndex: id !== idx? '-1' : '1'}}>{[...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.text}</p>}
                                    </>
                                }
                                {!loading && storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file && (storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('png') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('jpg') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('jpeg')) &&
                                    <>
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id === story.id && <img style={{objectFit: 'contain', transition: '0.5s', transform: scaleMedia ? 'scale(2)': 'scale(1)'}} src={storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file} alt="" />}
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id !== story.id && <img style={{objectFit: 'contain', transition: '0.5s', transform: scaleMedia ? 'scale(2)': 'scale(1)'}} src={[...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file} alt="" />}
                                    </>
                                }
                                {!loading && storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file && (storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('mp4') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('mov') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('ogg') || storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file.includes('qt')) &&
                                    <>
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id === story.id && <video style={{objectFit: 'contain',transition: '0.5s', transform: scaleMedia ? 'scale(2)': 'scale(1)'}} src={storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.file} controls alt="" />}
                                        {storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.story_id !== story.id && <video style={{objectFit: 'contain',transition: '0.5s', transform: scaleMedia ? 'scale(2)': 'scale(1)'}} src={[...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[currentStory])[0]?.file} controls alt="" />}
                                    </>
                                }


                            </div>
                            <div className="next_inside">
                                <div className="right" ref={nextRef} onClick={()=> !loading && nextStory([...story?.media, ...story?.text])}></div>
                                <div className="left" onClick={()=> !loading && prevStory([...story?.media, ...story?.text])}></div>
                            </div>
                            <div className={`inactive text-center ${id === idx && 'start_inactive2'}`}>
                                <div>
                                    <img src="/assets/img1.jpg" width={'70px'} height={'70px'} style={{borderRadius: '50%'}} alt="" />
                                    <h2 className="my-3">{currentUser.name === story.user.name? 'your story' : story.user.name}</h2>
                                    <h6>{[...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[[...story.media, story.text].length-2])[0]?.created_at !== undefined && [...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[[...story.media, story.text].length-2])[0]?.created_at.slice([...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[[...story.media, story.text].length-2])[0]?.created_at.indexOf('T') + 1, [...story.media, story.text].filter(b=> b?.created_at === [...story.media, story.text].map(v=> v?.created_at).sort()[[...story.media, story.text].length-2])[0]?.created_at.lastIndexOf(':'))}</h6>
                                </div>
                            </div>
                            {loading && <h6 className="text-white position-absolute text-center" style={{zIndex: '1', width: '100%', top: '50%', height: '100%'}}>loading...</h6>}
                            {currentUser.name === story.user.name && !loading && storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.views !== undefined && <div className="story_views">
                                <h6 className="text-white">{storyData.filter(b=> b?.created_at === storyData.map(v=> v?.created_at).sort()[currentStory])[0]?.views.filter(v=> v.user_id !== currentUser.id).length}</h6>
                            </div>}
                            {currentUser.name !== story.user.name && !loading && <div className={`story_reply d-flex ${id !== idx && 'd-none'} justify-content-center`}>
                                <div style={{width: '95%'}} className='d-flex align-items-center'>
                                    <div style={{width: '87%'}}>
                                        <input type="text" className="rounded-pill" placeholder={"Reply to" + ' ' + story.user.name + '...'} />
                                        <img className="emoji2" src="/assets/emoji2.png" alt="" />
                                        <img className="send2" src="/assets/send2.png" alt="" />
                                    </div>
                                    <div className="ms-3">
                                        <img src="/assets/like2.png" alt="" />
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                ))}
            </Slider>}
        </>
    );
  }
