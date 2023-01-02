const PayDeliveryCargo = (props) => {

  const { data } = props

  return (
    <>
      <li className="table_row">
        <div className="item_section">
          <div className="cell cell_label cell_header cell_full_header">
            <span className="label">받는주소</span>
          </div>
          <div className="cell cell_value02 cell_full_value">
            {data?.rcarZpcd ? `(${data?.rcarZpcd}) ${data?.rcarAdr} ${data?.rcarDtlAdr}` : null}
          </div>
        </div>
      </li>
      <li className="table_row">
        <div className="item_section">
          <div className="cell cell_label cell_header cell_full_header">
            <span className="label">받는사람 성명/연락처</span>
          </div>
          <div className="cell cell_value02 cell_full_value">
            {data?.rcarNm} {data?.rcarCnplone ? `/ ${data?.rcarCnplone}` : null}
          </div>
        </div>
      </li>
    </>
  )
}

export default PayDeliveryCargo
