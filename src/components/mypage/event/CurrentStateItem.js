import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import Badge from 'components/atomic/Badge'
import { addComma, extractCategory } from 'modules/utils/Common'
import PathConstants from 'modules/constants/PathConstants'

const CurrentStateItem = (props) => {
  const { data, index } = props
  const history = useHistory()
  const moveProductDetail = useCallback(() => history.push(`${PathConstants.PRODUCT_DETAIL}/${data.pdfInfoId}`), [])

  return (
    <div className="item_section prod_each_item" onClick={moveProductDetail}>
      <div className="cell cell_num mo_cell_number">{index + 1}</div>
      <div className="cell cell_name mo_cell_name">
        <div className="content_wrap">
          <div className="img_wrap">
            <img src={data?.imgUrl} alt={data?.pdfNm} />
          </div>
          <div className="pro_name_wrap">
            <div className="pro_agency_wrap">
              <div className="agency_wrap">
                {data?.pdfAgenState === 'Y' && (<Badge className="full_blue">에이전시</Badge>)}
                {data?.rcipptrnId === 'ETS02002' && (<Badge className="full_green">관리자선정</Badge>)}
              </div>
              <p className="mo_type">{extractCategory(data?.ctgyData)}</p>
            </div>
            <p className="name">{data.pdfNm}</p>
            <div className="mo_price_text_wrap">
              {/* 가격정보 */}
              {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
                <p className="money sell_stop">판매중지</p>
              ) : (
                data?.pdfSttsId === "GDS00005" ? (
                  <p className="money red">관리자 판매중지</p>
                ) : (
                  data?.prcDscsYn === "Y" ? (
                    <div className="price_text">가격협의</div>
                  ) : (
                    Number(data.salePrc) > 0 ? (
                      <div className="price_text">{addComma(data.salePrc) + ` 원`}</div>
                    ) : (
                      <div className="price_text">{addComma(data.pdfPrc) + ` 원`}</div>
                    )
                  )
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="cell cell_price pc_on">
        <div className="flex_row_wrap">
          {/* 가격정보 */}
          {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
            <p className="money sell_stop">판매중지</p>
          ) : (
            data?.pdfSttsId === "GDS00005" ? (
              <p className="money red">관리자 판매중지</p>
            ) : (
              data?.prcDscsYn === "Y" ? (
                <div className="price">가격협의</div>
              ) : (
                Number(data.salePrc) > 0 ? (
                  <div className="price">{addComma(data.salePrc) + ` 원`}</div>
                ) : (
                  <div className="price">{addComma(data.pdfPrc) + ` 원`}</div>
                )
              )
            ))}
        </div>
      </div>
      <div className="cell cell_cate pc_on">{extractCategory(data?.ctgyData)}</div>
    </div>
  )
}

export default CurrentStateItem
