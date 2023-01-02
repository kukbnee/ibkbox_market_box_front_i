import { useState, useCallback, useEffect,useContext } from 'react'
import {useHistory} from "react-router-dom"
import { UserContext } from 'modules/contexts/common/userContext'
import Button from 'components/atomic/Button'
import Radio from 'components/atomic/Radio'
import PopupAlert from 'components/PopupAlert'
import PayDeliveryInfo from 'components/payment/PayDeliveryInfo'
import PayProductEsttInfo from 'components/payment/PayProductEsttInfo'
import BoxPosPayment from "components/payment/BoxPosPayment"
import {BoxPosUtlaplcinfo} from "modules/payment/BoxPos"
import PopupCustom from 'components/PopupCustom'

const PayEstt = (props) => {

  const { data } = props
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [payState, setPayState] = useState(false);
  const [payWay, setPayWay] = useState({
    active: 'boxpos',
    list: [
      { id: 'boxpos', label: 'BOX POS', status: true }
    ]
  })
  const [popupPay, setPopupPay] = useState(false)
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    msg: null,
    btnMsg: '확인'
  })
  const [paramsOrder, setParamsOrder] = useState({
    rcarNm: '',
    recv: '', //수령인
    recvCnplone:'', //연락처 1
    recvCnpltwo: '' , //연락처 2
    recvZpcd: '', //우편번호
    recvAdr:'' , //주소
    recvDtad:'' , //상세주소
    dlplUseYn: 'N', //다음에도 동일 주소 사용 여부
    esttInfoId: '', //견적 id
    ordnInfoId: '', //qr생성시 필요
    sellerId: '', //가맹점 조회시 필요
    payType: 'ESTT' //결제 타입(견적)
  })

  const handlePopupAlert = useCallback(() => {
    setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: null })
  }, [popupAlert])

  const handleRadio = useCallback((e) => {
    setPayWay({ ...payWay, active: e.target.id })
  }, [data, payWay])

  const handlePopupPay = useCallback((type) => {  //결제 하기 전 확인 팝업
    if(type === 'PAY') handlePay()
    setPopupPay(false)
  }, [popupPay])

  const handlePay = useCallback(async() => { //결제 진행

    //가맹점 정보 확인
    if(payWay.active == "boxpos") {
      const getBoxPosInfo = await BoxPosUtlaplcinfo(paramsOrder.sellerId);
      if(getBoxPosInfo == null){
        setPopupAlert({
          ...popupAlert,
          active: true,
          msg: '해당 판매자는 전자결제(BOXPOS)가맹점이 아닌 것으로 확인되어 결제가 불가능합니다.\n판매자와 직접 연락하여 결제를 진행해주시길 바랍니다.',
          btnMsg: '닫기'
        })
        return;
      }
    }

    //결제진행
    setPayState(false);

    if(data?.dvryPtrnId === 'GDS02002' || data?.dvryPtrnId === 'GDS02003'){
      if(paramsOrder?.recv === '') {
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '수령인을 입력해주세요.' })
        return
      }
      if(paramsOrder?.recvZpcd === '') {
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '배송지를 입력해주세요.' })
        return
      }
      if(paramsOrder?.recvDtad === '') {
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '상세주소를 입력해주세요.' })
        return
      }
      if((paramsOrder?.recvCnplone?.length < 12) || (paramsOrder?.recvCnpltwo?.length > 0 && paramsOrder?.recvCnpltwo?.length > 13)) {
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '연락처를 입력해주세요.' })
        return
      }
    }

    //결제진행
    setPayState(true);
    
  }, [data, paramsOrder, popupAlert])

  useEffect(() => {
    setParamsOrder({
      ...paramsOrder,
      ...data?.deliveryEsmInfo,
      recv: userContext?.state?.userInfo?.userNm, //수령인
      products: data?.products,
      esttInfoId: data?.esttInfoId,
      ordnInfoId: data?.orderReqStlmVO?.ordnInfoId,
      sellerId: data?.sellerInfoVO?.selrUserId
    })
  }, [data, userContext])


  return (
    <>
      {popupAlert?.active &&  //alert 팝업
        <PopupAlert
          handlePopup={handlePopupAlert}
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={popupAlert?.btnMsg}
        />
      }
      {popupPay && ( //결제방법 확인 팝업
        <PopupCustom handlePopup={() => handlePopupPay('CLOSE')} className={'popup_review_warning popup_unable_pay'}>
          <div className="content">
            <p className="text">
              결제시 참고사항<br /><br />
              - <b className="highlight_blue">휴대폰 기본 카메라</b>로 <b className="highlight_blue">QR 코드</b>를 인식해주세요.<br />
              - <b className="highlight_blue">안드로이드 기종</b>(삼성,LG 등 아이폰이 아닌 기종)만 <b className="highlight_blue">결제가 가능</b>합니다.<br />
              - <b className="highlight_blue">아이폰(IOS) 유저</b>의 경우 판매자에게 <b className="highlight_blue">직접 결제 문의</b>를 해주세요.<br />
              - <b className="highlight_blue">휴대폰에서 결제</b>가 완료된 경우, <b className="highlight_blue">PC화면의 [결제완료]버튼을 클릭</b>해주세요.<br />
            </p>
            <div className="popup_footer" style={{marginBottom: 10}}>
              <Button className={'full_blue'} onClick={() => handlePopupPay('PAY')}>네, 확인했으며 결제를 진행합니다.</Button>
            </div>
          </div>
        </PopupCustom>
      )}

      <PayDeliveryInfo type={'ESTIMATION'} data={data} paramsOrder={paramsOrder} setParamsOrder={setParamsOrder}/>
      <PayProductEsttInfo data={data} />
      <div className="toggle_card_layout active">
        <div className="toggle_card_header">
          <div className="title">결제 수단</div>
        </div>
        <div className="toggle_card_container">
          <div className="payment_method">
            {payWay?.list?.map((item, idx) => (
              <Radio
                className={'type02'}
                key={item.id}
                label={item.label}
                onChange={(e) => handleRadio(e)}
                checked={item.id === payWay.active}
              />
            ))}
          </div>
        </div>

        {payState && payWay.active == "boxpos" ? <BoxPosPayment orderData={paramsOrder}/> : null}

      </div>

      {
        !payState ?
            <>
              <div className="payment_button">
                <Button className="btn full_blue" onClick={() => setPopupPay(true)}>결제하기</Button>
              </div>
            </>
            :
            <></>
      }
    </>
  )
}

export default PayEstt
