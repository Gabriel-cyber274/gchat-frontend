import React from 'react'
import { environment } from '../../../environment/environment';
import { cookies } from 'next/headers';
import Content from './Content';


const baseUrl = environment.scheme + environment.baseUrl;

async function getShared(token) {
  const res = await fetch(baseUrl + environment.post.share, {
    method: 'GET',
    headers: {
        'Content-Type' : 'applications/json',
        'Authorization': `Bearer ${token}`
    },
    });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

async function page() {
  const nextCookies = cookies();
  const shared = await getShared(nextCookies.get('token').value);
  // console.log(shared);
  return (
    <div>
      <Content shared={shared} />
    </div>
  )
}

export default page