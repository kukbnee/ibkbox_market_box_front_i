const SttsButtonDeliveryFinish = (props) => {

  const { data, handleButton } = props
  const cargoCoList = {
    ODS01001: 'CJ대한통운',
    ODS01002: '우체국택배',
    ODS01003: '한진택배',
    ODS01004: '롯데택배',
    ODS01005: '로젠택배',
    ODS01006: '천일택배',
    ODS01007: '일양로지스',
    ODS01008: '홈픽택배',
    ODS01009: 'EMS',
    ODS01010: '대신택배',
    ODS01011: '경동택배',
    ODS01012: '합동택배',
    ODS01013: '기타',
  }

  return (
    <>
      <div className="status_step status">
        <p className="blue delivery_complete">배송완료</p>
      </div>
      <div className="sub_txt_wrap">
        {data?.ordnSttsId === 'GDS02001' && <p className="cargo_company">({cargoCoList?.[data?.pcsvcmpPtrnId]})</p>}
        {(data?.ordnSttsId === 'GDS02002' || data?.ordnSttsId === 'GDS02003' ) &&
          <div className="sub_txt_wrap">
            <div className="common_delivery_company delivery_info_wrap">
              <p className="delivery_company">{cargoCoList?.[data?.pcsvcmpPtrnId]}</p>
              <p className="delivery_num" onClick={() => handleButton('copy_invoice')}>{data?.mainnbNo}</p>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default SttsButtonDeliveryFinish
