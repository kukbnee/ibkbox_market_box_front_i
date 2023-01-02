const DeliveryDirect = (props) => {
  const { destInfo, setDest } = props

  const handleChangeFee = (fee) => {
    let newFee = parseInt(fee.replace(/\D/g, ''))
    if (newFee > 100000000) return
    setDest({ ...destInfo, dvrynone: newFee })
  }

  return (
    <>
      <div className="delivery_price_wrap">
        <div className="delivery_left">배송비</div>
        <div className="delivery_right">
          <input
            type="text"
            className="input"
            value={destInfo?.dvrynone > 0 ? destInfo?.dvrynone.toLocaleString() : 0}
            onChange={(e) => handleChangeFee(e.target.value)}
            title={`dvrynone`}
          />
        </div>
      </div>
    </>
  )
}

export default DeliveryDirect
