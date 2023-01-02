import { useState, useEffect, useContext } from 'react'
import Radio from 'components/atomic/Radio'
import DeliveryDirect from 'components/mypage/qnaUser/estimate/DeliveryDirect'
import DeliveryFree from 'components/mypage/qnaUser/estimate/DeliveryFree'
import DeliveryVisit from 'components/mypage/qnaUser/estimate/DeliveryVisit'
import DeliveryCargo from 'components/mypage/qnaUser/estimate/DeliveryCargo'
import { addComma } from 'modules/utils/Common'
import { UserContext } from 'modules/contexts/common/userContext'

const EstimateDeliveryInfo = (props) => {

  const { productInfo, handleUpdateDelivery } = props
  const userContext = useContext(UserContext)
  const [pdfListTotalPrc, setPdfListTotalPrc] = useState(0)
  const [destInfo, setDestInfo] = useState({
    dvryPtrnId: 'GDS02002',
    entpInfoId: '',
    dvrynone: 0,
    rcarZpcd:'',
    rcarAdr: '',
    rcarDtlAdr: '',
    rcarNm: '',
    rcarCnplone: '',
    rlontfZpcd: '',
    rlontfAdr: '',
    rlontfDtad: '',
    entpNm: ''
  })
  const [deleveryType, setDeleveryType] = useState({
    active: 'GDS02002',
    list: [
      { id: 'GDS02002', label: '직접배송' },
      { id: 'GDS02003', label: '배송비없음' },
      { id: 'GDS02004', label: '구매자가 직접 수령' },
      { id: 'GDS02001', label: '화물서비스 이용' }
    ]
  })
  const deliveryForm = { //배송타입별 ui
    GDS02002: { //직접배송
      text: '',
      screen: <DeliveryDirect destInfo={destInfo} setDest={setDestInfo} />
    },
    GDS02003: { //무료배송
      text: '',
      screen: <DeliveryFree />
    },
    GDS02004: { //방문수령
      text: '*구매자가 직접 상품을 수령하러 가는 경우로, 상품위치를 전달합니다.',
      screen: <DeliveryVisit destInfo={destInfo} setDest={setDestInfo} />
    },
    GDS02001: { //화물서비스
      text: '*직접 입력한 상품은 화물서비스 견적에 포함되지않습니다.',
      screen: <DeliveryCargo productInfo={productInfo} destInfo={destInfo} setDest={setDestInfo} />
    },
  }

  const handleDeliveryType = (e) => { //배송타입 변경
    setDeleveryType({ ...deleveryType, active: e.target.id })
    setDestInfo({
      dvryPtrnId: e.target.id,
      entpInfoId: '',
      dvrynone: 0,
      rcarZpcd:'',
      rcarAdr: '',
      rcarDtlAdr: '',
      rcarNm: userContext?.state?.userInfo?.userNm && e.target.id === 'GDS02004' ? userContext.state.userInfo.userNm : '', //방문수령일 경우만 주문자 이름 보내기
      rcarCnplone: '',
      rlontfZpcd: '',
      rlontfAdr: '',
      rlontfDtad: '',
      entpNm: ''
    })
  }

  useEffect(() => {
    if(productInfo?.length){
      let pdfTotalPrc = 0
      productInfo?.map((item) => {
        pdfTotalPrc = Number(pdfTotalPrc) + Number(item.totalPrc)
      })
      setPdfListTotalPrc(pdfTotalPrc) //견적 상품 총액
      if(deleveryType?.active === 'GDS02001'){ //화물서비스면 견적상품 정보 바뀔때 배송 정보 초기화
        setDestInfo({
          dvryPtrnId: deleveryType?.active,
          entpInfoId: '',
          dvrynone: 0,
          rcarZpcd:'',
          rcarAdr: '',
          rcarDtlAdr: '',
          rcarNm: '',
          rcarCnplone: '',
          rlontfZpcd: '',
          rlontfAdr: '',
          rlontfDtad: '',
          entpNm: ''
        })
      }
    }
  }, [productInfo, deleveryType])

  useEffect(() => {
    handleUpdateDelivery(destInfo) //각 배송타입별 배송정보 업데이트시 부모로 전달
  }, [destInfo])

  return (
    <>
      <div className="sub_header type02">
        <p className="title">배송유형</p>
      </div>
      <div className="radio_list">
        <div className="checkbox_list_wrap">
          {deleveryType?.list?.map((item, index) => (
            <Radio
              className={'type02'}
              key={item.id + index}
              id={item.id}
              label={item.label}
              onChange={(e) => handleDeliveryType(e)}
              checked={item.id === deleveryType?.active}
            />
          ))}
        </div>
      </div>
      {deliveryForm?.[deleveryType?.active]?.screen}
      <div className="delivery_result">
        <div className="deli_service_price">
          <p className="deli_service_alert peach">{deliveryForm?.[deleveryType?.active]?.text}</p>
          <p className="deli_price">배송비 : {Number(destInfo?.dvrynone) > 0 ? addComma(Number(destInfo?.dvrynone)) : 0} 원</p>
        </div>
        <div className="deli_subprice">
          <p className="price01">결제 금액 : {addComma(Number(pdfListTotalPrc))}원(견적 총액) + {Number(destInfo?.dvrynone) > 0 ? addComma(Number(destInfo?.dvrynone)) : 0}(배송비)</p>
          <p className="price02">총 : {pdfListTotalPrc + Number(destInfo?.dvrynone) > 0 ? addComma(Number(pdfListTotalPrc + destInfo?.dvrynone)) : 0} 원</p>
        </div>
      </div>
    </>
  )
}

export default EstimateDeliveryInfo
