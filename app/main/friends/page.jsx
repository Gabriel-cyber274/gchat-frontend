import React from 'react'
import { environment } from '../../../environment/environment';
import { cookies } from 'next/headers';
import Content from './Content';


const baseUrl = environment.scheme + environment.baseUrl;

async function getFriends(token) {
  const res = await fetch(baseUrl + environment.friends.main, {
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

async function getUsers(token) {
  const res = await fetch(baseUrl + environment.user.main, {
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

async function getConfirmFriends(token) {
  const res = await fetch(baseUrl + environment.friends.confirmFriend, {
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
  const friendsData = getFriends(nextCookies.get('token').value);
  const usersData= getUsers(nextCookies.get('token').value);
  const friendConfirmData= getConfirmFriends(nextCookies.get('token').value);

  
  const [friends, users, confirm] = await Promise.all([friendsData, usersData, friendConfirmData]); 

  return (
    <>
      <Content friends={friends} users={users} confirm={confirm} />
    </>
  )
}

export default page