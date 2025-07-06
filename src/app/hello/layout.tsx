import React from 'react'
import TopMenu from '../comps/topMenu'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <TopMenu />
      {children}
    </div>
  )
}

export default layout
