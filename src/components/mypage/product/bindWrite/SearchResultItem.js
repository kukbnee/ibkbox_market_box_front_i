import { addComma } from 'modules/utils/Common'
import Button from 'components/atomic/Button'
import Badge from 'components/atomic/Badge'

const SearchResultItem = (props) => {
  const { data, index, handleDel } = props

  return (
    <>
      {/* pc */}
      <div className="pc_version">
        <div className="item_section prod_each_item">
          <div className="cell cell_num cb_none">{index + 1}</div>
          <div className="cell cell_name">
            <div className="content_wrap">
              <div className="img_wrap">{data?.imgUrl && <img src={data.imgUrl} alt={data.pdfNm} />}</div>
              <div className="name_badge_wrap">
                {data?.agenInfId && (
                  <div className="badge_wrap">
                    <Badge className="badge full_blue">에이전시</Badge>
                  </div>
                )}
                <p className="name">{data?.pdfNm}</p>
              </div>
            </div>
          </div>
          <div className="cell cell_price w20">
            {/* 가격정보 */}
            {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
              <div className="money_wrap">
                <p className="money sell_stop">판매중지</p>
              </div>
            ) : (
              data?.pdfSttsId === "GDS00005" ? (
              <div className="money_wrap">
                <p className="money red">관리자 판매중지</p>
              </div>
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
          <div className="cell cell_cate w20">{data?.pdfCtgyName}</div>
          <div className="cell cell_delete w20">
            <Button onClick={() => handleDel(index)}>
              <div className="hide">버튼</div>
            </Button>
          </div>
        </div>
      </div>
      {/* 모바일 */}
      <div className="mobile_version">
        <div className="item_section prod_each_item">
          <div className="cell cell_num cb_none">{index + 1}</div>
          <div className="cell cell_name">
            <div className="content_wrap">
              <div className="img_wrap">{data?.imgUrl && <img src={data.imgUrl} alt={data.pdfNm} />}</div>
              <div className="pro_name_wrap">
                <div className="agency_category_wrap">
                  {data?.agenInfId && (
                    <div className="badge_wrap">
                      <Badge className="badge full_blue">에이전시</Badge>
                    </div>
                  )}
                  <div className="cell cell_cate w20">{data?.pdfCtgyName}</div>
                </div>
                <p className="name">{data?.pdfNm}</p>
                <div className="cell cell_price w20">
                  {/* 가격정보 */}
                  {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
                    <div className="money_wrap">
                      <p className="money sell_stop">판매중지</p>
                    </div>
                  ) : (
                    data?.pdfSttsId === "GDS00005" ? (
                      <div className="money_wrap">
                        <p className="money red">관리자 판매중지</p>
                      </div>
                  ) : (
                    data?.prcDscsYn === "Y" ? (
                      <div className="flex_row_wrap">가격 협의</div>
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
          <div className="cell cell_delete w20">
            <Button onClick={() => handleDel(index)}>
              <div className="hide">버튼</div>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchResultItem
