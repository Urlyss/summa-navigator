import React from 'react'

const loading = () => {
  return (
    <div className='w-full h-dvh absolute top-0 left-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-[99]'>
        <div className='border-[16px] border-solid border-[#f3f3f3] border-t-[16px] border-t-solid border-t-primary rounded-full w-32 h-32 animate-spin m-auto'></div>
    </div>
  )
}

export default loading