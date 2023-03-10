import React from 'react'
import { environment } from '../../../environment/environment';
import { cookies } from 'next/headers';
import Content from './Content';


const baseUrl = environment.scheme + environment.baseUrl;

async function getSaved(token) {
  const res = await fetch(baseUrl + environment.post.save, {
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
  const saved = await getSaved(nextCookies.get('token').value);


  return (
    <div>
      <Content saved={saved} />
    </div>
  )
}

export default page