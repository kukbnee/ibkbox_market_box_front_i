import Checkbox from 'components/atomic/Checkbox'
import { addComma } from 'modules/utils/Common'
import Badge from 'components/atomic/Badge'

const ProductItem = (props) => {

  const { data, index, handleCheckbox, handleMainCheckbox } = props
  const onChangeCheckBox = () => handleCheckbox(index)
  const onChangeMainCheckBox = () => handleMainCheckbox(index)

  return (
    <div className="item_section prod_each_item mo_type">
      <div className="cell cell_num">
        <Checkbox
          className={'type02'}
          checked={data.checked}
          id={`product_item_${index}`}
          onChange={onChangeCheckBox}
        />
      </div>
      <div className="cell cell_name new_name pc_type">
        <div className="content_wrap">
          <div className="img_wrap">
            <img src={data.imgUrl} alt={data.pdfNm} />
          </div>
          <div className="name_badge_wrap">
            {data?.agenInfId && (
              <div className="badge_wrap">
                <Badge className="badge full_blue">에이전시</Badge>
              </div>
            )}
            <p className="name">{data.pdfNm}</p>
          </div>
        </div>
      </div>
      <div className="cell cell_price w50 pc_type">
        {/* 가격정보 */}
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
      <div className="cell cell_cate new_cate w50 pc_type">{data.pdfCtgyName}</div>
      <div className="cell cell_stock new_stock w50 pc_type">
        <div className="flex_row_wrap">
          <p className="left_cnt">{Number(data.ordnMnmmQty) > 0 ? addComma(Number(data.ordnMnmmQty)) : 0}개</p>
        </div>
      </div>
      <div className="cell cell_name new_name mo_type">
        <div className="content_wrap">
          <div className="img_wrap">
            <img src={data.imgUrl} alt={data.pdfNm} />
          </div>
          <div className="pro_name_wrap">
          <div className="agency_category_wrap">
              {data?.agenInfId && (
                <div className="badge_wrap">
                  <Badge className="badge full_blue">에이전시</Badge>
                </div>
              )}
            </div>
            <p className="name">{data.pdfNm}</p>
            <div className="cell cell_price w50">
              {/* 가격정보 */}
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
          </div>
        </div>
      </div>
      <div className="cell cell_rep w50">
        <Checkbox
          className={'type02'}
          checked={data.mainYn === 'Y'}
          onChange={onChangeMainCheckBox}
          id={`mainYn_check_box_${index}`}
        />
      </div>
    </div>
  )
}

export default ProductItem
