import React from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()
  return (
    <div>
      Landing
      <button onClick={() => {
        navigate("/login")
      }
      } className='btn btn-primary'>Login</button>
    </div>

  )
}

export default Landing
