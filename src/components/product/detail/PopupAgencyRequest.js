import { useContext } from 'react'
import { UserContext } from 'modules/contexts/common/userContext'
import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'

const PopupAgencyRequest = (props) => {
  const { handlePopupAgency, applyAgency } = props
  const userContext = useContext(UserContext)
  const textList = {
    SRS00001: {
      contents: <div className="text">해당 판매자는 실사업자 인증을 안한<br />준회원으로 에이전시 요청을 할 수 없습니다.</div>,
      button: '확인'
    },
    SRS00002: {
      contents: <div className="text">해당 판매자는 실사업자 인증을 안한<br />정회원으로 에이전시 요청을 할 수 없습니다.</div>,
      button: '확인'
    },
    SRS00003: {
      contents: <div className="text">에이전시 요청 후에는 해당 상품 판매자에게 문의하여 재고 및 가격등에 대해 협의하시길 바랍니다.<br /></div>,
      button: '요청'
    }
  }


  return (
    <div className="popup_wrap agency_request">
      <div className="layer">&nbsp;</div>
      <div className="container scroll">
        <div className="popup_header">
          <h3 className="popup_title">에이전시 요청</h3>
          <BtnClose onClick={handlePopupAgency} />
        </div>
        <div className="agency_popup">
          <div className="agency_wrap">
            {textList?.[userContext?.state?.userInfo?.mmbrtypeId]?.contents}
            <div className="btn_wrap">
              <Button className="btn full_blue" onClick={()=>applyAgency(userContext?.state?.userInfo?.mmbrtypeId==='SRS00003' &&'Y')}>{textList?.[userContext?.state?.userInfo?.mmbrtypeId]?.button}</Button>
            </div>
            <div className="etc_text_wrap">
              <p className="etc_text">IBK는 판매 및 결제에 대해 직접 관여하지 않습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupAgencyRequest
