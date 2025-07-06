import React from 'react'
import TypingEffect from './textTyping'
import Menu from './menu'

const Home = () => {
  return (
    <div className='p-5'>
      <p className='text-[40px] font-medium'>Asif Bhuiyan Shawon</p>
      <TypingEffect />
      <Menu />
    </div>
  )
}

export default Home
