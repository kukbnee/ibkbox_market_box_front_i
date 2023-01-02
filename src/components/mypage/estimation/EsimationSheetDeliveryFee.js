const EsimationSheetDeliveryFee = (props) => {

  const { data } = props
  const prcUnitCode = {
    COC03001: '원',
    COC03002: '달러'
  }

  return (
    <div className="delivery_price_wrap">
      <div className="delivery_left">배송비</div>
      <div className="delivery_right">
        <p className="price">{data?.dvrynone > 0 ? data?.dvrynone.toLocaleString() : 0} {prcUnitCode?.[data?.items[0]?.comPrcutId]}</p>
      </div>
    </div>
  )
}

export default EsimationSheetDeliveryFee
