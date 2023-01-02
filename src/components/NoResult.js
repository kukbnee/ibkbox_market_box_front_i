import React from 'react'

const NoResult = (props) => {
  const { msg = '데이터가 없습니다.' } = props
  return (
    <div className="no_result">
      <p className="msg">{msg}</p>
    </div>
  )
}

export default NoResult
