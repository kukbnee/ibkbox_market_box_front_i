import {useState, useEffect, useCallback} from 'react'
import Radio from 'components/atomic/Radio'
import PopupAlert from 'components/PopupAlert'
import PayDeliveryInfo from 'components/payment/PayDeliveryInfo'
import PayProductFeeInfo from 'components/payment/PayProductFeeInfo'
import BoxPosPayment from "components/payment/BoxPosPayment"
import Button from 'components/atomic/Button'
import {BoxPosUtlaplcinfo} from "modules/payment/BoxPos"
import PopupCustom from 'components/PopupCustom'

const PayProduct = (props) => {

  const { payType, data, setPayData, axiosData } = props
  const [cntImpPdf, setCntImpPdf] = useState(0);
  const [payState, setPayState] = useState(false);
  const [payWay, setPayWay] = useState({
    active: 'boxpos',
    list: [
      { id: 'boxpos', label: 'BOX POS', status: true }
    ]
  })

  const [isFreightOpen,setIsFreightOpen] = useState(false)
  const [popupPay, setPopupPay] = useState(false)
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    className: 'popup_review_warning',
    msg: null,
    caseMsg: [],
    msg2: null,
    btnMsg: '확인'
  })
  const [paramsOrder, setParamsOrder] = useState({
    products: [],
    recv: '',
    recvZpcd: '',
    recvAdr: '',
    recvDtad: '',
    recvCnplone: '',
    recvCnpltwo: '',
    dlplUseYn: 'N',
    ordnInfoId: '', //qr생성시 필요
    sellerId: '', //가맹점 조회시 필요
    payType: payType //결제 타입(BASKET/PRODUCT)
  })

  const handlePopupAlert = () => {
    setPopupAlert({ ...popupAlert, active: !popupAlert, msg: null, caseMsg: [], msg2: null })
  }

  const handleRadio = (e) => {
    setPayWay({ ...payWay, active: e.target.id })
  }

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

    if(cntImpPdf> 0) {
      setPopupAlert({
        ...popupAlert,
        active:true,
        className: 'popup_review_warning popup_unable_pay',
        msg: '결제가 불가능한 상품이 있어 진행이 불가능합니다.\n 결제가 불가능한 경우는 다음과 같습니다.',
        caseMsg: [
          '현재 상품이 판매가능하지 않은 상태일때(판매중지, 판매자격박탈 등)',
          '구매수량이 맞지 않은 경우(판매업체가 설정한 최소구매, 최대구매 수량의 범위에 해당하지 않을때)',
        ],
        msg2: '위와 같은 경우, 판매업체에 직접 문의해주시길 바랍니다.',
      })
    } else {
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

      for(let i = 0 ; i<paramsOrder?.products?.length ; i++){
        if((paramsOrder?.products[i].productDelInfo.dvryPtrnId==='GDS02001')){
          if(paramsOrder?.products[i].productDelInfo.apiResultYn == undefined){
            setPopupAlert({ ...popupAlert, active: true, msg: '운임 체크를 해주세요',btnMsg: '닫기'})
            return;
          }

          if(paramsOrder?.products[i].productDelInfo.apiResultYn == 'N'){
            setPopupAlert({ ...popupAlert, active: true, msg: paramsOrder?.products[i].productDelInfo.apiResultTxt ,btnMsg: '닫기'})
            return;
          }
        }
      }

      //결제진행
      setPayState(true);
    }
  }, [cntImpPdf,paramsOrder])

  useEffect(() => {
    const useDelivery = data?.deliveryInfo?.dlplUseYn === 'Y' ? {
      recvAdr: data?.deliveryInfo?.adr,
      recvCnplone: data?.deliveryInfo?.cnplone,
      recvCnpltwo: data?.deliveryInfo?.cnpltwo,
      dlplUseYn: data?.deliveryInfo?.dlplUseYn,
      recvDtad: data?.deliveryInfo?.dtlAdr,
      mmbrsttsId: data?.deliveryInfo?.mmbrsttsId,
      recv: data?.deliveryInfo?.recv,
      recvZpcd: data?.deliveryInfo?.zpcd,
    } : { };
    setParamsOrder({
      ...paramsOrder,
      ...useDelivery,
      products: data?.products,
      dlplUseYn:data?.deliveryInfo?.dlplUseYn,
      ordnInfoId:data?.orderReqStlmVO?.ordnInfoId,
      sellerId:data?.sellerInfoVO?.selrUserId
    })
  }, [data])

  return (
    <>
      {popupAlert?.active &&  //alert 팝업
        <PopupAlert
          handlePopup={handlePopupAlert}
          className={popupAlert?.className}
          msg={popupAlert?.msg}
          caseMsg={popupAlert?.caseMsg}
          msg2={popupAlert?.msg2}
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

      <PayDeliveryInfo type='BASKET' data={data} paramsOrder={paramsOrder} setParamsOrder={setParamsOrder} setPayData={setPayData} axiosData={axiosData} setIsFreightOpen={setIsFreightOpen}/>
      <PayProductFeeInfo data={data} cntImpPdf={cntImpPdf} setCntImpPdf={setCntImpPdf} paramsOrder={paramsOrder} setParamsOrder={setParamsOrder} setIsFreightOpen={setIsFreightOpen} isFreightOpen={isFreightOpen} setPayData={setPayData}/>

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

        {payState && payWay.active == "boxpos" ? <BoxPosPayment orderData={paramsOrder} /> : null}

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

export default PayProduct
