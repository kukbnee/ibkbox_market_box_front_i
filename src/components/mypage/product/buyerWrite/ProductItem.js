import Checkbox from 'components/atomic/Checkbox'
import { addComma } from 'modules/utils/Common'
import Badge from 'components/atomic/Badge'

const ProductItem = (props) => {

  const { data, index, handleCheckbox } = props
  const onChangeCheckBox = () => handleCheckbox(index)

  return (
    <div className="item_section prod_each_item">
      <div className="cell cell_num">
        <Checkbox
          className={'type02'}
          checked={data.checked}
          id={`product_item_${index}`}
          onChange={onChangeCheckBox}
        />
      </div>
      <div className="cell cell_name">
        <div className="content_wrap">
          <div className="img_wrap">
            <img src={data?.imgUrl} alt={data?.pdfNm} />
          </div>
          <div className="text_wrap">
            {data?.agenInfId && (
              <div className="agency_wrap">
                <Badge className="badge full_blue">에이전시</Badge>
              </div>
            )}

            {/* 상품명 */}
            <p className="name long_txt">{data?.pdfNm}</p>

            {/* 반응형에서만 보이는 가격정보 */}
            {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
              <p className="money sell_stop pc_none">판매중지</p>
            ) : (
              data?.pdfSttsId === "GDS00005" ? (
                <p className="money red pc_none">관리자 판매중지</p>
              ) : (
                data?.prcDscsYn === "Y" ? (
                  <div className="flex_row_wrap pc_none">가격협의</div>
                ) : (
                  Number(data.salePrc) > 0 ? (
                    <div className="flex_row_wrap pc_none">
                      <p className={`price grey text_through grey`}>
                        {addComma(Number(data.pdfPrc))} 원
                      </p>
                      <p className={`price`}>
                        {addComma(Number(data.salePrc))} 원
                      </p>
                    </div>
                  ) : (
                    <div className="flex_row_wrap pc_none">
                      <p className={`price`}>
                        {addComma(Number(data.pdfPrc))} 원
                      </p>
                    </div>
                  )
                )
              ))}
          </div>
        </div>
      </div>

      {/* PC에서만 보이는 가격정보 */}
      <div className="cell cell_price mo_none">
        {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
          <p className="money sell_stop">판매중지</p>
        ) : (
          data?.pdfSttsId === "GDS00005" ? (
            <p className="money red">관리자 판매중지</p>
          ) : (
            data?.prcDscsYn === "Y" ? (
              <div className="flex_row_wrap">가격협의</div>
            ) : (
              Number(data.salePrc) > 0 ? (
                <div className="flex_row_wrap">
                  <p className={`price grey text_through grey`}>
                    {addComma(Number(data.pdfPrc))} 원
                  </p>
                  <p className={`price`}>
                    {addComma(Number(data.salePrc))} 원
                  </p>
                </div>
              ) : (
                <div className="flex_row_wrap">
                  <p className={`price`}>
                    {addComma(Number(data.pdfPrc))} 원
                  </p>
                </div>
              )
            )
          ))}
      </div>

      {/* 분류 */}
      <div className="cell cell_cate mo_none">{data?.pdfCtgyName}</div>

      {/* 최소구매 */}
      <div className="cell cell_stock mo_none">
        <div className="flex_row_wrap">
          <p className="left_cnt">{Number(data?.ordnMnmmQty) > 0 ? addComma(Number(data?.ordnMnmmQty)) : 0}개</p>
        </div>
      </div>
    </div>
  )
}

export default ProductItem
