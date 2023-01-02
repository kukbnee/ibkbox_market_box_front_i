import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'

const PopupAlert = (props) => {
  const { className = '', msg = '메세지를 입력하세요', btnMsg = '흥정확인', btnMsg2, handleCancel, handleOk } = props

  return (
    <div className={`popup_wrap popup_alert ${className}`}>
      <div className="layer">&nbsp;</div>
      <div className="container">
        <BtnClose onClick={handleCancel} />
        <div className="popup_content">
          <p className="msg">{msg}</p>
        </div>
        <div className="popup_footer">
          {btnMsg2 && (
            <Button className={'btn linear_blue'} onClick={handleCancel}>
              {btnMsg2}
            </Button>
          )}
          <Button className={'btn full_blue'} onClick={handleOk}>
            {btnMsg}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PopupAlert
