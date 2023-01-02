import moment from 'moment'
import Badge from 'components/atomic/Badge'

const ReturnDetailItem = (props) => {

  const { data, returnType } = props
  const dvryTypeList = {
    GDS02001: '화물서비스',
    GDS02002: '직접배송',
    GDS02003: '무료배송',
    GDS02004: '구매자가 직접수령',
  }
  const recCell = {
    selr: {
      pc: <div className="company_wrap">
        <p className="company_text">{data?.pucsBplcNm}</p>
        <p className="company_text">{data?.pucsNm}</p>
      </div>,
      mo: <p className="com">{data?.pucsBplcNm} {data?.pucsNm}</p>
    },
    buyer: {
      pc: <div className="company_wrap">
        <p className="company_text">{data?.selrBplcNm}</p>
      </div>,
      mo: <p className="com">{data?.selrBplcNm}</p>
    }
  }

  return (
    <>
      <div className="table_item return_item_pc">
        <div className="cell number">{data?.cnttNoId}</div>
        <div className="cell info">
          <div className="info_wrap">
            <div className="img_wrap">
              {data?.imgUrl && <img src={data.imgUrl} alt={data?.pdfNm} />}
            </div>
            <div className="badge_text_wrap">
              {data?.agenState === 'Y' && (
                <div className="badge_wrap">
                  <Badge className="badge full_blue">에이전시</Badge>
                </div>
              )}
              <div className="text_wrap">
                <p className="text">{data?.pdfNm}</p>
                <p className="date">{data?.rgsnTs ? moment(data.rgsnTs).format('YYYY-MM-DD HH:mm') : null}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="cell sale">{data?.pdfPrc ? parseInt(data.pdfPrc).toLocaleString() : 0} 원</div>
        <div className="cell amount">{data?.qty ? parseInt(data.qty).toLocaleString() : 0}개</div>
        <div className="cell delivery">{dvryTypeList?.[data?.dvryPtrnId]}</div>
        <div className="cell price">{data?.ttalAmt ? parseInt(data.ttalAmt).toLocaleString() : 0} 원</div>
        <div className="cell company">
          {recCell?.[returnType]?.pc}
        </div>
      </div>
      <div className="prod_item_mo return_item_mo">
        <div className="info_wrap w100">
          <div className="product_table_wrap">
            <div className="product_cell">
              <div className="name">주문번호</div>
              <div className="info">
                <div className="order_num">{data?.cnttNoId}</div>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">상품정보</div>
              <div className="info flex">
                <div className="img_wrap">
                  {data?.imgUrl && <img src={data.imgUrl} alt={data?.pdfNm} />}
                </div>
                <div className="badge_text_wrap">
                  {data?.agenState === 'Y' && (
                    <div className="badge_wrap">
                      <Badge className="badge full_blue">에이전시</Badge>
                    </div>
                  )}
                  <div className="txt_wrap">
                    <p className="pd_title">{data?.pdfNm}</p>
                    <p className="pd_date">{data?.rgsnTs ? moment(data.rgsnTs).format('YYYY-MM-DD HH:mm') : null}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">판매가</div>
              <div className="info">
                <div className="pd_price text-left">{data?.pdfPrc ? parseInt(data.pdfPrc).toLocaleString() : 0} 원</div>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">주문수량</div>
              <div className="info">
                <p className="com">{data?.qty ? parseInt(data.qty).toLocaleString() : 0}개</p>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">배송</div>
              <div className="info">
                <p className="com">{dvryTypeList?.[data?.dvryPtrnId]}</p>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">총 주문금액</div>
              <div className="info">
                <div className="pd_price text-left">{data?.ttalAmt ? parseInt(data.ttalAmt).toLocaleString() : 0} 원</div>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">판매사명</div>
              <div className="info">
                {recCell?.[returnType]?.mo}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReturnDetailItem
