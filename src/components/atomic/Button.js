import React from 'react'

const Button = (props) => {
  const { className = '', children, ...others } = props
  return (
    <button className={`btn ${className}`} {...others}>
      {children}
    </button>
  )
}

export default Button
