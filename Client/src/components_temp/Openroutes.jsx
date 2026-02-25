import React from 'react'
import { Navigate } from 'react-router-dom';

const Openroutes = ({children}) => {
    const accessToken=localStorage.getItem("accessToken");
     const role =localStorage.getItem("role")
    if(accessToken && role==="customer"){
        return <Navigate to="/welcome" replace />
    }
    if(accessToken && role==="admin"){
      return <Navigate to="/admindash" replace/>
    }
  return (
    <div>{children}</div>
  )
}

export default Openroutes