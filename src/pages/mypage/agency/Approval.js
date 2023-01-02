import React from 'react'
import Button from 'components/atomic/Button'

const Approval = (props) => {

  const handlePopupWarning = () => {
    props.onRequestApply()
  }

  return (
    <div className="agency_container">
      <div className="mypage agency">
          <div className="agency_container">
            <div className="agency_first">
              <p className="title">
                에이전시 등록을 위해서 <br />
                최초 관리자 승인이 필요합니다.
              </p>
              <Button className={'full_blue req'} onClick = {handlePopupWarning}>승인요청</Button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Approval
