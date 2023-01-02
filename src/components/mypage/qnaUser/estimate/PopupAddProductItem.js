import { useCallback } from 'react'
import Checkbox from 'components/atomic/Checkbox'
import Badge from 'components/atomic/Badge'
import { addComma } from 'modules/utils/Common'

const PopupAddProductItem = (props) => {

  const { data, index, addList, handleCheckbox } = props

  const handleCheck = useCallback(() => {
    let list = addList
    let item = list[index]
    if (item?.isChecked === undefined) item.isChecked = true
    else item['isChecked'] = !item?.isChecked
    handleCheckbox(list)
  }, [addList])

  return (
    <>
      <div className="pc_version">
        <div className="item_section prod_each_item">
          <div className="cell cell_num cb_none">
            <Checkbox
              className={data?.checkDisabled === true ? 'type03' : 'type02'}
              id={`prod_each_item_` + index}
              label={""}
              onChange={() => handleCheck()}
              checked={data?.isChecked ? true : false}
              disabled={data?.checkDisabled ? data?.checkDisabled : false}
            />
          </div>
          <div className="cell cell_name w55">
            <div className="content_wrap">
              <div className="img_wrap">
                {data?.imgUrl ? <img src={`${data?.imgUrl}`} alt={data?.pdfNm} /> : null}
              </div>
              <div className="pro_name_wrap">
                {data?.agenPdfYn === 'Y' &&
                  <div className="pro_agency_wrap">
                    <Badge className="full_blue">에이전시</Badge>
                  </div>
                }
                <p className="name">{data?.pdfNm}</p>
              </div>
            </div>
          </div>
          <div className="cell cell_price w20">
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
                    <div className="flex_row_wrap">{addComma(data.salePrc) + ` 원`}</div>
                  ) : (
                    <div className="flex_row_wrap">{addComma(data.pdfPrc) + ` 원`}</div>
                  )
                )
              ))}
          </div>
          <div className="cell cell_cate w20">{data?.tms4ClsfNm}</div>
        </div>
      </div>
      <div className="mobile_version">
        <div className="item_section prod_each_item">
          <div className="cell cell_num cb_none">
            <Checkbox
              className={data?.checkDisabled === true ? 'type03' : 'type02'}
              id={`prod_each_item_` + index}
              label={""}
              onChange={() => handleCheck()}
              checked={data?.isChecked ? true : false}
              disabled={data?.checkDisabled ? data?.checkDisabled : false}
            />
          </div>
          <div className="cell cell_name w55">
            <div className="content_wrap">
              <div className="img_wrap">
                {data?.imgUrl ? <img src={`${data?.imgUrl}`} alt={data?.pdfNm} /> : null}
              </div>
              <div className="pro_name_wrap">
                {data?.agenPdfYn === 'Y' &&
                  <div className="agency_category_wrap">
                    <Badge className="full_blue">에이전시</Badge>
                  </div>
                }
                <p className="name">{data?.pdfNm}</p>
                <div className="cell cell_price w20">
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
                          <div className="flex_row_wrap">{addComma(data.salePrc) + ` 원`}</div>
                        ) : (
                          <div className="flex_row_wrap">{addComma(data.pdfPrc) + ` 원`}</div>
                        )
                      )
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PopupAddProductItem
