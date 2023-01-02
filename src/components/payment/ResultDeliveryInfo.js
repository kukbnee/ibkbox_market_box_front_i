const ResultDeliveryInfo = (props) => {

  const { data } = props

  const autoHyphen = (target) => {
    if(target?.length===9){
      return target.slice(0,2)+'-'+target.slice(2,5)+'-'+target.slice(5,9)
    }else if(target?.length===10){
      return target.slice(0,3)+'-'+target.slice(3,6)+'-'+target.slice(6,10)
    }else if(target?.length===11){
      return target.slice(0,3)+'-'+target.slice(3,7)+'-'+target.slice(7,11)
    }else{
      return target
    }
  }

  return (
    <>
      {data?.dvryId === 'GDS02004' || data?.dvryPtrnId === 'GDS02004' //배송 - 구매자 직접수령
        ? <div className="toggle_card_layout active">
            <div className="toggle_card_header">
              <div className="title">배송지 정보</div>
            </div>
            <div className="toggle_card_container">
              <div className="ask_detail_layout">
                <div className="table_wrap">
                  <div className="table_list">
                    <div className="table_list">
                      <div className="cell td">상품수령위치</div>
                      <div className="cell tr brnone">{data?.recvZpcd && `(${data?.recvZpcd}) ${data?.recvAdr} ${data?.recvDtad}`}</div>
                    </div>
                    <p className="sub_text">* 상품수령위치로 직접 상품을 수령해야합니다.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        : <div className="toggle_card_layout active bbnone">
            <div className="toggle_card_header">
              <div className="title">배송지 정보</div>
            </div>
            <div className="toggle_card_container">
              <div className="ask_detail_layout">
                <div className="table_wrap">
                  <div className="table_list">
                    <div className="table_list double">
                      <div className="cell td">받으시는 분</div>
                      <div className="cell tr">{data?.recv}</div>
                      <div className="cell td">연락처</div>
                      <div className="cell tr brnone phones">
                        {data?.recvCnplone && <p className="phone">{autoHyphen(data?.recvCnplone)}</p>}
                        {data?.recvCnpltwo != "--" && <p className="phone">{autoHyphen(data?.recvCnpltwo)}</p>}
                      </div>
                    </div>
                    <div className="table_list">
                      <div className="cell td">주소</div>
                      <div className="cell tr brnone">{data?.recvZpcd && `(${data?.recvZpcd}) ${data?.recvAdr} ${data?.recvDtad}`}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default ResultDeliveryInfo
