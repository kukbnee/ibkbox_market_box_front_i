import { BtnClose } from 'components/atomic/IconButtons'

const PopupRejectReason = (props) => {
  const { className = '', handlePopup, children } = props

  const onPopup = () => {
    if (handlePopup) handlePopup('close')
  }

  return (
    <div className={`popup_wrap popup ${className}`}>
      <div className="layer">&nbsp;</div>
      <div className="container">
        <BtnClose onClick={onPopup} />
        <div className="popup_content">{children}</div>
      </div>
    </div>
  )
}

export default PopupRejectReason
