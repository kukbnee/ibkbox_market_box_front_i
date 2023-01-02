import Button from 'components/atomic/Button'

const SttsButtonDeliveryOn = (props) => {

  const { data, handleButton } = props

  return (
    <>
      {data?.dvryPtrnId === 'GDS02001' ? (
        <Button className="btn full_blue btn_shipment" onClick={() => handleButton('tracking')}>배송조회</Button>
      ) : (
        data?.dvryPtrnId === 'GDS02004' ? (
          <>
            <Button className="btn full_blue btn_address" onClick={() => handleButton('address')}>주소확인</Button>
            <Button className="btn full_blue btn_receive" onClick={() => handleButton('receive')}>수령확인</Button>
          </>
        ) : (
          <Button className="btn full_blue btn_receive" onClick={() => handleButton('receive')}>수령확인</Button>
        ))}
    </>
  )
}

export default SttsButtonDeliveryOn
