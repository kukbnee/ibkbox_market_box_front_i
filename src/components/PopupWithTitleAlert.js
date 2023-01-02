import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'

const PopupWithTitleAlert = (props) => {
  const { className = '', title = '', msg = '메세지를 입력하세요', btnMsg = '확인', handlePopup } = props
  let msgWithLine = <p>{msg.split("\n").map((txt, index) => ( <span key={index}>{txt}<br /></span> ))}</p>
  
  const onPopup = (btnType) => {
    if (handlePopup) handlePopup(btnType)
  }


  return (
    <div className={`popup_wrap popup ${className}`}>
      <div className="layer">&nbsp;</div>
      <div className="container">
        <BtnClose onClick={() => onPopup('close')}/>
        <div className="popup_content">
          <div className="confirm_msg_wrap">
            {title?.length > 0 && <p className="title_text">{title}</p>}
            <div className="text_wrap">
              <div className="text">{msgWithLine}</div>
            </div>
            <div className="button_wrap">
              <Button className="full_blue btn" onClick={() => onPopup('btnMsg')}>{btnMsg}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupWithTitleAlert
