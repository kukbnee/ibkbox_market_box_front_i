import { useState, useEffect } from 'react'
import PayProductFeeItem from 'components/payment/PayProductFeeItem'
import {addComma} from 'modules/utils/Common'

const PayProductFeeInfo = (props) => {

  const { data, cntImpPdf, setCntImpPdf,paramsOrder, setParamsOrder,setIsFreightOpen, isFreightOpen,setPayData } = props
  const [dvryCargo, setDvryCargo] = useState({
    active: false,
    dvryPay: 0,
    entpNm: '',
  })
  const [dvryCode, setDvryCode] = useState({
    GDS02001: false,
    GDS02002: false
  })
  const dvryExprTxt = {
    GDS02001: '* 화물서비스 : 판매자가 IBK화물서비스에 등록된 화물서비스를 이용하여 배송합니다. 배송처리 후 배송조회가 가능합니다.',
    GDS02002: '* 직접배송 : 판매자가 직접 배송을 진행합니다. 배송현황은 판매자가 배송처리 후 운송장을 입력하면 확인 가능합니다.'
  }

  useEffect(() => {
    data?.products?.map((item) => {
      if(item.payUsed === 'N') setCntImpPdf(cntImpPdf + 1)
      if(item?.productDelInfo?.dvryPtrnId === dvryCode?.GDS02001) setDvryCode({ ...dvryCode, GDS02001: !dvryCode.GDS02001})
      if(item?.productDelInfo?.dvryPtrnId === dvryCode?.GDS02002) setDvryCode({ ...dvryCode, GDS02002: !dvryCode.GDS02002})
    })
  }, [data])

  return (
    <>
      <div className="toggle_card_layout active">
        <div className="toggle_card_header">
          <div className="title">결제 정보 및 수단 선택</div>
        </div>
        <div className="toggle_card_container">
          <div className="table_content resp_pc">
            <div className="table_head">
              <div className="cell info">주문 상품 정보</div>
              <div className="cell sale">판매가</div>
              <div className="cell quantity">수량</div>
              <div className="cell price">주문금액</div>
              <div className="cell ship">배송</div>
            </div>
            {data?.products?.length > 0 && data.products.map((item, index) =>
              <PayProductFeeItem
                screenSize={'pc'}
                key={index}
                data={item}
                index={index}
                dvryCargo={dvryCargo}
                paramsOrder={paramsOrder}
                setParamsOrder={setParamsOrder}
                setIsFreightOpen={setIsFreightOpen}
                isFreightOpen={isFreightOpen}
                setPayData={setPayData}
                payData={data}
              />
            )}
          </div>
          <div className="explain_text resp_pc">
              <p className="text">{dvryExprTxt?.[data?.dvryPtrnId]}</p>
          </div>
          <div className="amount_wrap resp_pc">
            <div className="text_wrap">결제금액</div>
            <div className="contents_wrap">
              <p className="product_price">상품금액 : {data?.totalProductPay ? addComma(Number(data?.totalProductPay)) : 0} 원</p>
              <p className="ship_price">배송금액 : {data?.totalProductDeliveryPay ? addComma(Number(data?.totalProductDeliveryPay)) : 0} 원</p>
              <p className="total_price">총 결제 금액 : {data?.totalProductPay  ? addComma(Number(data?.totalProductPay) + Number(data?.totalProductDeliveryPay)) : 0} 원</p>
            </div>
          </div>
          <div className="table_content resp_mo">
            {data?.products?.length > 0 && data.products.map((item, index) =>
              <PayProductFeeItem
                screenSize={'mo'}
                key={index}
                data={item}
                index={index}
                dvryCargo={dvryCargo}
                paramsOrder={paramsOrder}
                setParamsOrder={setParamsOrder}
                setIsFreightOpen={setIsFreightOpen}
                isFreightOpen={isFreightOpen}
                setPayData={setPayData}
                payData={data}
              />
            )}
            <div className="explain_text">
              {dvryCode?.GDS02001 && <p className="text">{dvryExprTxt?.['GDS02001']}</p>}
              {dvryCode?.GDS02002 && <p className="text">{dvryExprTxt?.['GDS02002']}</p>}
            </div>
            <div className="amount_wrap">
              <div className="text_wrap">결제금액</div>
              <div className="contents_wrap">
                <p className="product_price">상품금액 : {data?.totalProductPay ? addComma(Number(data?.totalProductPay)) : 0} 원</p>
                <p className="ship_price">배송금액 : {data?.totalProductDeliveryPay ? addComma(Number(data?.totalProductDeliveryPay)) : 0} 원</p>
                <p className="total_price">총 결제 금액 : {data?.totalProductPay  ? addComma(Number(data?.totalProductPay) + Number(data?.totalProductDeliveryPay)) : 0} 원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PayProductFeeInfo
