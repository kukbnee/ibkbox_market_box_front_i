const EsimationSheetDeliveryCargo = (props) => {

  const { data } = props

  return (
    <div className="delivery_price_wrap">
      <div className="delivery_left">화물서비스 이용</div>
      <div className="delivery_right">
        {data?.entpNm ? <p className="blue subtext">이용 택배사 : <span className="bold">{data?.entpNm}</span></p> : null}
      </div>
    </div>
  )
}

export default EsimationSheetDeliveryCargo
