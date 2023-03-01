"use client"
import React, { useEffect } from 'react'
import Nav from '../../components/main_component/Nav'
import Main_content from '../../components/main_component/Main_content'
import {Sansita} from '@next/font/google'
import { useRouter } from 'next/navigation'


const sansation = Sansita({ subsets: ['latin'], weight: '700' })

function Content({post}) {
  const router = useRouter();
  useEffect(()=> {
    if(localStorage.currentUser === undefined || localStorage.currentUser === null ) {
      router.replace('/auth/login')
    }
  })
  return (
    <div className={`${sansation.className}`}>
        <Nav />
        <Main_content posts={post} />
    </div>
  )
}

export default Content