import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'

const PopupAlert = (props) => {
  const { 
    className = '', 
    msg = '메세지를 입력하세요', 
    msg2,
    caseMsg,
    btnMsg = '확인',
    handlePopup,
    btnMsg2 
  } = props

  const onPopup = (btnType) => {
    if (handlePopup) handlePopup(btnType)
  }

  return (
    <div className={`popup_wrap popup_alert ${className}`}>
      <div className="layer">&nbsp;</div>
      <div className="container">
        <BtnClose onClick={() => onPopup('close')} />
        <div className="popup_content">
          <p className="msg">{msg}</p>
          {caseMsg && (
            <div className="case_msg_wrap">
              {caseMsg.map((item, index) => (<p key={index} className={`case_msg${index + 1}`}>{index + 1}. {item}</p>) )}
            </div>
          )}
          {msg2 && <p className="msg2">{msg2}</p>}
        </div>
        <div className="popup_footer">
          {btnMsg2 && (
            <Button className={'btn linear_blue'} onClick={() => onPopup('btnMsg2')}>
              {btnMsg2}
            </Button>
          )}
          <Button className={'btn full_blue'} onClick={() => onPopup('btnMsg')}>
            {btnMsg}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PopupAlert
