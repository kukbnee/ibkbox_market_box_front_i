import Button from 'components/atomic/Button'

const SttsButtonDeliveryOn = (props) => {

  const { data, handleButton } = props

  return (
    <>
      {data?.dvryPtrnId != 'GDS02004' &&
        <div className="status_step status">
          <p className="blue delivery_ing">배송중</p>
        </div>
      }
      {data?.dvryPtrnId === 'GDS02002' || data?.dvryPtrnId === 'GDS02003' ? (
        <div className="sub_txt_wrap">
          <div className="common_delivery_company delivery_info_wrap">
            <p className="delivery_company">{data?.pcsvcmpNm}</p>
            <p className="delivery_num" onClick={() => handleButton('copy_invoice')}>{data?.mainnbNo}</p>
          </div>
        </div>
      ) : (
        <div />
      )}
      {data?.dvryPtrnId === 'GDS02001' && //화물서비스
        <>
          <div className="sub_txt_wrap">
            <div className="common_delivery_company delivery_info_wrap">
              <p className="delivery_company">{data?.entpNm}</p>
            </div>
          </div>
          <div className="btn_group">
            <Button className="btn full_blue btn_shipment" onClick={() => handleButton('tracking')}>배송조회</Button>
          </div>
        </>
      }
    </>
  )
}

export default SttsButtonDeliveryOn
