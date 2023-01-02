const EsimationSheetDeliveryVisit = (props) => {

  const { data } = props

  return (
    <div className="delivery_price_wrap">
      <div className="delivery_left">상품 수령위치</div>
      <div className="delivery_right">
        <p className="address">{data?.rcarAdr} {data?.rcarDtlAdr}</p>
      </div>
    </div>
  )
}

export default EsimationSheetDeliveryVisit
