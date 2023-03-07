import React from 'react'
import Content from './Content'
import { environment } from '../../environment/environment';
import { cookies } from 'next/headers';



const baseUrl = environment.scheme + environment.baseUrl
async function getPosts(token) {
  const res = await fetch(baseUrl + environment.post.main, {
    method: 'GET',
    headers: {
        'Content-Type' : 'applications/json',
        'Authorization': `Bearer ${token}`
    },
    }, {next: {revalidate: 60}});
  if (!res.ok) {
    // throw new Error('Failed to fetch data');
    console.log('error');
  }

  return res.json();
}

async function getPrivatePosts(token) {
  const res = await fetch(baseUrl + environment.post.privatePost, {
    method: 'GET',
    headers: {
        'Content-Type' : 'applications/json',
        'Authorization': `Bearer ${token}`
    },
    }, {next: {revalidate: 60}});
  if (!res.ok) {
    // throw new Error('Failed to fetch data');
    console.log('error');
  }

  return res.json();
}

async function getSharedPublic(token) {
  const res = await fetch(baseUrl + environment.post.sharedPublic, {
    method: 'GET',
    headers: {
        'Content-Type' : 'applications/json',
        'Authorization': `Bearer ${token}`
    },
    }, {next: {revalidate: 60}});
  if (!res.ok) {
    // throw new Error('Failed to fetch data');
    console.log('error');
  }

  return res.json();
}


async function getSharedPrivate(token) {
  const res = await fetch(baseUrl + environment.post.sharedPrivate, {
    method: 'GET',
    headers: {
        'Content-Type' : 'applications/json',
        'Authorization': `Bearer ${token}`
    },
    }, {next: {revalidate: 60}});
  if (!res.ok) {
    // throw new Error('Failed to fetch data');
    console.log('error');
  }

  return res.json();
}


async function page() {
  const nextCookies = cookies();
  const privatePostData = getPrivatePosts(nextCookies.get('token').value);
  const sharedPublicData= getSharedPublic(nextCookies.get('token').value);
  const sharedPrivateData = getSharedPrivate(nextCookies.get('token').value);
  const postData = getPosts(nextCookies.get('token').value);

  
  const [post, sharedPrivate, sharedPublic, privatePost] = await Promise.all([postData, sharedPrivateData, sharedPublicData, privatePostData]); 

  
  return (
    <div>
        <Content post={post} sharedPrivate={sharedPrivate} sharedPublic={sharedPublic} privatePost={privatePost} />
    </div>
  )
}

export default page