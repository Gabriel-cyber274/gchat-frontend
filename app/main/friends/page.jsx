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


async function getFriendsPost(token) {
  const res = await fetch(baseUrl + environment.post.allFriendsPost, {
    method: 'GET',
    headers: {
        'Content-Type' : 'applications/json',
        'Authorization': `Bearer ${token}`
    },
    }, {next: {revalidate: 10}});
  if (!res.ok) {
    // throw new Error('Failed to fetch data');
    console.log('error');
  }

  return res.json();
}

async function page() {
  const nextCookies = cookies();
  const friendsData = getFriends(nextCookies.get('token').value);
  const usersData= getUsers(nextCookies.get('token').value);
  const friendConfirmData= getConfirmFriends(nextCookies.get('token').value);
  const friendsPostData= getFriendsPost(nextCookies.get('token').value);

  
  const [friends, users, confirm, posts] = await Promise.all([friendsData, usersData, friendConfirmData,friendsPostData]); 

  return (
    <>
      <Content friends={friends} users={users} confirm={confirm} posts={posts} />
    </>
  )
}

export default page