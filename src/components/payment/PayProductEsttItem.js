import { addComma } from 'modules/utils/Common'
import Badge from 'components/atomic/Badge'

const PayProductEsttItem = (props) => {

  const { screenSize, data, index, dvryPtrnId, entpNm } = props
  const dvryPtrnList = {
    GDS02001: '화물서비스',
    GDS02002: '직접배송',
    GDS02003: '무료배송',
    GDS02004: '구매자 직접 수령'
  }

  return (
    <>
      {screenSize === 'mo'
        ? <div className="resp_mo_wrap">
          < div className="resp_table resp_head">{index + 1}</div>
          <div className="resp_table">
            <div className="resp_name">주문상품정보</div>
            <div className="resp_content">
              <div className="resp_contents">
                <div className="img_wrap">
                  {data?.imgUrl && <img src={`${data?.imgUrl}`} alt={data?.pdfNm} />}
                </div>
                <div className="text_wrap">
                  <div className="name_badge_wrap">
                    {data?.agenInfId && (<Badge className="badge full_blue">에이전시</Badge>)}
                    <p className="name">{data?.bplcNm}</p>
                  </div>
                  <p className="desc">{data?.pdfNm}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="resp_table">
            <div className="resp_name">판매가</div>
            <div className="resp_content">{data?.pdfPrc ? addComma(Number(data?.pdfPrc)) : 0} 원</div>
          </div>
          <div className="resp_table">
            <div className="resp_name">수량</div>
            <div className="resp_content">{data?.ordnQty ? addComma(Number(data?.ordnQty)) : 0} 개</div>
          </div>
          <div className="resp_table">
            <div className="resp_name">주문금액</div>
            <div className="resp_content price">{data?.pdfPrc && data?.ordnQty ? addComma(Number(data?.pdfPrc) * Number(data?.ordnQty)) : 0} 원</div>
          </div>
          <div className="resp_table">
            <div className="resp_name">배송</div>
            <div className="resp_content">{dvryPtrnId === 'GDS02001' ? dvryPtrnList?.[dvryPtrnId] + ': ' + entpNm : dvryPtrnList?.[dvryPtrnId]}</div>
          </div>
        </div>
        : <div className="table_tr">
          <div className="table_td">
            <div className="cell info">
              <div className="contents_wrap">
                <div className="img_wrap">
                  {data?.imgUrl && <img src={`${data?.imgUrl}`} alt={data?.pdfNm} />}
                </div>
                <div className="text_wrap">
                  <div className="name_badge_wrap">
                    {data?.agenInfId && (<Badge className="badge full_blue">에이전시</Badge>)}
                    <p className="name">{data?.bplcNm}</p>
                  </div>
                  <p className="desc">{data?.pdfNm}</p>
                </div>
              </div>
            </div>
            <div className="cell sale">{data?.pdfPrc ? addComma(Number(data?.pdfPrc)) : 0} 원</div>
            <div className="cell quantity">{data?.ordnQty ? addComma(Number(data?.ordnQty)) : 0} 개</div>
            <div className="cell price">{data?.pdfPrc && data?.ordnQty ? addComma(Number(data?.pdfPrc) * Number(data?.ordnQty)) : 0} 원</div>
            <div className="cell ship">
              <div className="ship_wrap">
                <p className="pricetext">{dvryPtrnId === 'GDS02001' ? dvryPtrnList?.[dvryPtrnId] + ': ' + entpNm : dvryPtrnList?.[dvryPtrnId]}</p>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default PayProductEsttItem
