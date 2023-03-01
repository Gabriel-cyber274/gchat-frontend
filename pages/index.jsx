// import React from 'react'

function index() {
  return (
    <div>index</div>
  )
}

export default index


export const getServerSideProps = async ()=> {

    const isAuth = false;
  
    if(!isAuth) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false
        }
      }
    }
  
    return{
      props:{}
    }
  }