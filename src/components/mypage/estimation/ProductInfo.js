import { addComma } from 'modules/utils/Common'
import Badge from 'components/atomic/Badge'

const ProductInfo = (props) => {

  const {
    data,
    type,
    classCell,
    classWrap,
    classPrcWrap,
    category,
    pdfState,
    handleLink
  } = props
  const stateList = {
    ESS02001: <p className="orange">대기</p>,
    ESS02002: <p className="blue">결제완료</p>,
    ESS02003: <p className="red">취소</p>
  }

  return (
    <div className={classCell}>
      <div className={classWrap} onClick={handleLink}>
        <div className="img_wrap">
          {data?.imgUrl && <img src={data.imgUrl} alt={data.pdfNm} />}
        </div>
        <div className={classPrcWrap} onClick={handleLink}>
          {type != 'AGENCY' && data?.agenInfId && (
            <div className="badge_wrap">
              <Badge className="badge full_blue">에이전시</Badge>
            </div>
          )}
          <p className="name">{data?.pdfNm}</p>
          {/* 가격정보 */}
          {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
              <p className="money sell_stop">판매중지</p>
          ) : (
            data?.pdfSttsId === "GDS00005" ? (
              <p className="money red">관리자 판매중지</p>
            ) : (
              data?.prcDscsYn === "Y" ? (
                <div className="money">가격협의</div>
              ) : (
                data?.pdfSum ? ( //견적서에서만 사용, 상품 total 금액
                  <div className="money">{addComma(Number(data?.pdfSum)) + ` 원`}</div>
                ) : (
                  Number(data?.salePrc) > 0 ? ( //할인가가 있을 경우
                    <div className="change_price_wrap align_start" style={{ alignItems: 'flex-start' }}>
                      <p className="before_price">{addComma(Number(data?.pdfPrc)) + ` 원`}</p>
                      <p className="change_price">{addComma(Number(data?.salePrc)) + ` 원`}</p>
                    </div>
                  ) : (
                    <div className="money">{Number(data?.pdfPrc) > 0 ? addComma(Number(data?.pdfPrc)) + ` 원` : null}</div> //데이터 다 못 불러왔을 때 Nan 안뜨게..
                  )
                ))))}
          {category ? <p className="category">{category}</p> : null}
        </div>
        {classCell === "cell cell_info estiinfo" && (
          <div className="status_wrap">
            {stateList?.[pdfState]}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
