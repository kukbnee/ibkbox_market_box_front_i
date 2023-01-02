const ResultOrderInfo = (props) => {

  const { data, cpnType } = props

  return (
    <>
      <div className="toggle_card_layout active mg_top pb_none">
        <div className="toggle_card_header">
          <div className="title">주문내역</div>
        </div>
        <div className="toggle_card_container">
          <div className="ask_detail_layout">
            <div className="table_wrap">
              <div className="table_list">
                <div className="table_list double">
                  <div className="cell td">주문일자</div>
                  <div className="cell tr">{data?.ordnRgsnTs}</div>
                  <div className="cell td">주문번호</div>
                  <div className="cell tr brnone">{data?.cnttNoId}</div>
                </div>
                <div className="table_list double">
                  <div className="cell td">주문자</div>
                  <div className="cell tr">{data?.pucsRprsntvNm}</div>
                  <div className="cell td">{cpnType === 'selr' ? '주문업체' : '판매업체'}</div>
                  <div className="cell tr brnone">{cpnType === 'selr' ?  data?.pucsBplcNm : data?.selrBplcNm}</div>
                </div>
                <p className="sub_text">
                  {`* ${cpnType === 'selr' ? '배송이 시작되면 주문취소가 불가능합니다.': '주문취소는 판매업체에게 직접 문의해주세요.'}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResultOrderInfo
