import Button from 'components/atomic/Button'

const SttsButtonOrder = (props) => {

  const { data, handleButton } = props

  return (
    <>
      {data?.ordnSttsId === 'ODS00001' && data?.dvryPtrnId === 'GDS02004' ? ( //주문완료 & 구매자 직접 수령
        <>
          <Button className="btn full_blue btn_address" onClick={() => handleButton('address')}>주소확인</Button>
          <Button className="btn full_blue btn_receive" onClick={() => handleButton('receive')}>수령확인</Button>
        </>
      ) : (
        <div />
      )}
    </>
  )
}

export default SttsButtonOrder
