"use client"
import React from 'react'

function TrialComponent({click, buttons}) {
  return (
    <div>
        <form action="" onSubmit={click} className='my-4'>
            <input type="number" />
            {/* <input type="text" /> */}
            <button>convert</button>
        </form>
        <div className='d-flex'>
            <button onClick={buttons} className='btn btn-primary py-2 px-4 me-3'>food</button>
            <button onClick={buttons} className='btn btn-primary py-2 px-4 me-3'>cloth</button>
            <button onClick={buttons} className='btn btn-primary py-2 px-4 me-3'>bags</button>
            <button onClick={buttons} className='btn btn-primary py-2 px-4 me-3'>cars</button>
        </div>
    </div>
  )
}

export default TrialComponent