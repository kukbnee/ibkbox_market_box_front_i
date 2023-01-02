import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'

const DeliveryInfoInput = (props) => {

  const { pdfInfoId, handlePopup } = props

  return (
    <div className="popup_wrap popup_alert delivery_info_input">
      <div className="layer">&nbsp;</div>
      <div className="container">
        <BtnClose onClick={() => handlePopup('close')} />
        <div className="popup_content">
          <h1 className="msg">배송 정보 입력</h1>
          <div className="delivery_type_box delivery_num" onClick={() => handlePopup('inputInvoice')}>
            <p className="tit">운송장번호 입력</p>
            <p className="cnt">이미 발송처리 했으며&#44; 운송장번호를 입력합니다&#46;</p>
          </div>
          {pdfInfoId != null && ( //견적서에서 직접입력한 상품은 화물서비스 선택 불가
            <div className="delivery_type_box cargo_service" onClick={() => handlePopup('selectCargo')}>
              <p className="tit">화물서비스 이용</p>
              <p className="cnt">발송처리 전으로 IBK에 등록된 운송서비스를 이용합니다&#46;</p>
            </div>
          )}
        </div>
        <div className="popup_footer">
          <Button className={'btn full_blue'} onClick={() => handlePopup('close')}>닫기</Button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryInfoInput
