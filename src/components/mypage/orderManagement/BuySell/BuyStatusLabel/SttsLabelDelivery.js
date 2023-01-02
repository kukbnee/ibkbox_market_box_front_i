const SttsLabelDelivery = (props) => {

  const { data, handleButton } = props
  const sttsLabel = {
    ODS00003: '배송중',
    ODS00004: '배송완료',
  }

  return (
    <>
      <div className="status">
        <p className="blue">{sttsLabel?.[data?.ordnSttsId]}</p>
      </div>
      {data?.ordnSttsId === 'ODS00003' && data?.dvryPtrnId === 'GDS02004' ? ( //배송중 && 구매자 직접 수령
        null
      ) : (
        data?.ordnSttsId === 'ODS00004' && data?.dvryPtrnId === 'GDS02001' ? ( //배송완료 && 화물서비스
          <div className="delivery_info_wrap">
            <p className="delivery_company">{data?.entpNm}</p>
          </div>
        ) : (
          <div className="delivery_info_wrap">
            <p className="delivery_company">{data?.pcsvcmpNm}</p>
            <p className="delivery_num" onClick={() => handleButton('copy_invoice')}>{data?.mainnbNo}</p>
          </div>
        )
      )}
    </>
  )
}

export default SttsLabelDelivery
