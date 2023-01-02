import { useState } from 'react'
import moment from 'moment'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'

const OnProcess = (props) => {

  const {applyData} = props
  const [isPopup, setIsPopup] = useState(false)

  const handlePopupWarning = () => {
    setIsPopup(!isPopup)
  }

  const postApplyCancel = (btnType) => {
    if(btnType === 'btnMsg') props.onRequestCancel()
    setIsPopup(!isPopup)
  }


  return (
    <>
      {isPopup && (
        <PopupAlert
          handlePopup={(btnType) => postApplyCancel(btnType)}
          className={'popup_review_warning'}
          msg={`에이전시 등록을 취소하시겠습니까?`}
          btnMsg={`등록취소`}
        />
      )}
      <div className="agency_container">
        <div className="mypage agency">
          <div className="agency_container">
            <div className="agency_first ing">
            <p className="title">{applyData.pcsnCon}</p>
            <div className="sub_title">
              <p className="icon_text">신청일</p>
              <p className="date">{moment(applyData.stateDate).format('YYYY-MM-DD')}</p>
            </div>
            <Button className={'full_blue req cancel'} onClick={handlePopupWarning}>취소</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OnProcess
