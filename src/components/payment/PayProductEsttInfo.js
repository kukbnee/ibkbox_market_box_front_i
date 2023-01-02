import PayProductEsttItem from 'components/payment/PayProductEsttItem'
import {addComma} from 'modules/utils/Common'

const PayProductEsttInfo = (props) => {

  const { data } = props

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
            {data?.products?.length > 0 && 
              data.products.map((item, index) => 
                <PayProductEsttItem 
                  screenSize={'pc'} 
                  key={index}
                  data={item} 
                  index={index} 
                  dvryPtrnId={data?.dvryPtrnId}
                  entpNm={data?.deliveryEsmInfo?.entpNm} />
              )
            }
          </div>
          <div className="amount_wrap resp_pc">
            <div className="text_wrap">결제금액</div>
            <div className="contents_wrap">
              <p className="product_price">상품금액 : {data?.totalProductPay ? addComma(Number(data?.totalProductPay)) : 0} 원</p>
              <p className="ship_price">배송금액 : {data?.totalProductDeliveryPay ? addComma(Number(data?.totalProductDeliveryPay)) : 0} 원</p>
              <p className="total_price">총 결제 금액 : {data?.totalProductPay + data?.totalProductDeliveryPay ? addComma(Number(data?.totalProductPay) + Number(data?.totalProductDeliveryPay)) : 0} 원</p>
            </div>
          </div>
          <div className="table_content resp_mo">
            {data?.products?.length > 0 && 
              data.products.map((item, index) => 
                <PayProductEsttItem 
                  screenSize={'mo'} 
                  key={index}
                  data={item} 
                  index={index} 
                  dvryPtrnId={data?.dvryPtrnId}
                  entpNm={data?.deliveryEsmInfo?.entpNm} />
              )
            }
            <div className="amount_wrap">
              <div className="text_wrap">결제금액</div>
              <div className="contents_wrap">
                <p className="product_price">상품금액 : {data?.totalProductPay ? addComma(Number(data?.totalProductPay)) : 0} 원</p>
                <p className="ship_price">배송금액 : {data?.totalProductDeliveryPay ? addComma(Number(data?.totalProductDeliveryPay)) : 0} 원</p>
                <p className="total_price">총 결제 금액 : {data?.totalProductPay + data?.totalProductDeliveryPay ? addComma(Number(data?.totalProductPay) + Number(data?.totalProductDeliveryPay)) : 0} 원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PayProductEsttInfo
