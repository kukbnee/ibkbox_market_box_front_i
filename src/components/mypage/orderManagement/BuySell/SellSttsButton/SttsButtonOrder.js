import Button from 'components/atomic/Button'

const SttsButtonOrder = (props) => {

  const { dvryPtrnId, handleButton } = props

  return (
    <>
      <div className="status_step status">
        <p className="blue order_complete">주문완료</p>
      </div>
      <div className="btn_group">
        {(dvryPtrnId === 'GDS02002' || dvryPtrnId === 'GDS02003') && (
          <Button className="btn full_blue btn_ship_info_write" onClick={() => handleButton('dvryInfo')}>배송정보입력</Button>
        )}
        {dvryPtrnId === 'GDS02004' && <Button className="btn full_blue btn_address" onClick={() => handleButton('address')}>주소확인</Button>}
      </div>
    </>
  )
}

export default SttsButtonOrder
