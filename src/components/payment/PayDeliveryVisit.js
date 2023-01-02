const PayDeliveryVisit = (props) => {

  const { data } = props

  return (
    <>
      <li className="table_row">
        <div className="item_section">
          <div className="cell cell_label cell_header cell_full_header">
            <span className="label">상품수령위치</span>
          </div>
          <div className="cell cell_value02 cell_full_value">
            {data?.rcarZpcd ? `(${data?.rcarZpcd}) ${data?.rcarAdr} ${data?.rcarDtlAdr}` : null}
          </div>
        </div>
      </li>
      <li className="table_row">
        <p className="sub_text">* 판매자가 입력한 상품수령위치에서 상품을 직접 수령해야 합니다.</p>
      </li>
    </>
  )
}

export default PayDeliveryVisit
