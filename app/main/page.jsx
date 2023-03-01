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
    });
  if (!res.ok) {
    // throw new Error('Failed to fetch data');
    console.log('error');
  }

  return res.json();
}

async function page() {
  const nextCookies = cookies();
  const post = await getPosts(nextCookies.get('token').value);

  
  return (
    <div>
        <Content post={post} />
    </div>
  )
}

export default page