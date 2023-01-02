import Badge from 'components/atomic/Badge'
import { addComma, extractCategory } from 'modules/utils/Common'

const ConfirmItem = (props) => {
  const { data, index } = props
  return (
    <>
      <div className="pc_version">
        <div className="item_section prod_each_item">
          <div className="cell cell_num cb_none">{index + 1}</div>
          <div className="cell cell_name w55">
            <div className="content_wrap">
              <div className="img_wrap">
                <img src={data.imgUrl} alt={data?.pdfNm} />
              </div>
              <div className="pro_name_wrap">
                <div className="pro_agency_wrap">
                  {data?.pdfAgenState === 'Y' && <Badge className="full_blue">에이전시</Badge>}
                </div>
                <p className="name">{data?.pdfNm}</p>
              </div>
            </div>
          </div>
          <div className="cell cell_price w20">
            <div className="flex_row_wrap">
              {data?.prcDscsYn === 'Y' ? (
                `가격협의`
              ) : (
                Number(data.salePrc) > 0 ? (
                  addComma(data?.salePrc) + ` 원`
                ) : (
                  addComma(data?.pdfPrc) + ` 원`
                )
              )}
            </div>
          </div>
          <div className="cell cell_cate w20">{extractCategory(data?.ctgyData)}</div>
        </div>
      </div>
      <div className="mobile_version">
        <div className="item_section prod_each_item">
          <div className="cell cell_num cb_none">{index + 1}</div>
          <div className="cell cell_name w55">
            <div className="content_wrap">
              <div className="img_wrap">
                <img src={data.imgUrl} alt={data?.pdfNm} />
              </div>
              <div className="pro_name_wrap">
                <div className="agency_category_wrap">
                  {data?.pdfAgenState === 'Y' && <Badge className="full_blue">에이전시</Badge>}
                  <div className="cell cell_cate w20">{extractCategory(data?.ctgyData)}</div>
                </div>
                <p className="name">{data?.pdfNm}</p>
                <div className="cell cell_price w20">
                  <div className="flex_row_wrap">
                    {data?.prcDscsYn === 'Y' ? (
                      `가격협의`
                    ) : (
                      Number(data.salePrc) > 0 ? (
                        addComma(data?.salePrc) + ` 원`
                      ) : (
                        addComma(data?.pdfPrc) + ` 원`
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmItem
