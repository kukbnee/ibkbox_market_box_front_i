import { useState, useEffect, useCallback } from 'react'
import Button from 'components/atomic/Button'
import Badge from 'components/atomic/Badge'
import { addComma } from 'modules/utils/Common'

const EstimateProductItem = (props) => {
  const { type, item, index, isNarrow, handleItemChangeValue, handleItemDelete, pdfList } = props
  const [prcLabel, setPrcLabel] = useState(0)
  const [cntLabel, setCntLabel] = useState(0)
  const [totalPrcLabel, setTotalPrcLabel] = useState(0)

  const handleChangePrice = (price, index) => {
    let newPdf = item
    let newPrc = parseInt(price.replace(/\D/g, ''))
    if (newPrc > 1000000000) return
    newPdf['salePrc'] = newPrc
    handleItemChangeValue(newPdf, index)
    setPrcLabel(Number(newPrc) > 0 ? addComma(Number(newPrc)) : 0)
  }

  const handleChangeQuantity = (cnt, index) => {
    let newPdf = item
    let newCnt = parseInt(cnt.replace(/\D/g, ''))
    if (newCnt > 1000000) return
    newPdf['ordnQty'] = newCnt
    handleItemChangeValue(newPdf, index)
    setCntLabel(Number(newCnt) > 0 ? addComma(Number(newCnt)) : 0)
  }

  const handleDelete = () => {
    handleItemDelete(index)
  }

  const handleChangeForm = (pdfNm, index) => {
    let newPdf = item
    newPdf['pdfNm'] = pdfNm
    handleItemChangeValue(newPdf, index)
  }

  useEffect(() => {
    if (Number(item?.salePrc) > 0) setPrcLabel(addComma(Number(item.salePrc))) //금액(할인가 있음)
    else setPrcLabel(addComma(Number(item.pdfPrc))) //금액(할인가 없음)
    if (item?.ordnQty > 0) setCntLabel(addComma(Number(item.ordnQty))) //수량
    if (item?.totalPrc > 0) setTotalPrcLabel(addComma(Number(item.totalPrc))) //총 금액
  }, [item])

  useEffect(() => {
    let prc = prcLabel ? parseInt(prcLabel.replace(/\D/g, '')) : 0
    let cnt = cntLabel ? parseInt(cntLabel.replace(/\D/g, '')) : 1
    let totalPrc = prc * cnt
    let newPdf = item
    newPdf['totalPrc'] = totalPrc
    setTotalPrcLabel(Number(totalPrc) > 0 ? addComma(Number(totalPrc)) : 0)

    if (type === 'form') handleItemChangeValue(newPdf, index)

  }, [prcLabel, cntLabel])

  const pdfNmItem = () => {
    if (item?.esttPdfPtrnId === 'ESS01002') {
      return (
        <input
          type="text"
          className="input"
          style={{ textAlign: 'left' }}
          value={item?.pdfNm}
          onChange={(e) => handleChangeForm(e.target.value, index)}
          disabled={type === 'sheet' ? true : false}
          title={'pdfNm'}
        />
      )
    } else {
      if (item?.imgUrl) {
        return ( //이미지 있으면
          <div className="contents_wrap">
            <div className="img_wrap">
              <img src={`${item?.imgUrl}`} alt={item?.pdfNm} />
            </div>
            <div className="name_badge_wrap">
              {item?.agenInfId || item?.agenPdfYn === 'Y' ? (
                <div className="badge_wrap">
                  <Badge className="badge full_blue">에이전시</Badge>
                </div>
              ) : (
                null
              )}
              <div className="name_text">{item?.pdfNm}</div>
            </div>
          </div>
        )
      } else {
        return ( //이미지 없으면
          <div className="name_badge_wrap full_width">
            {item?.agenInfId || item?.agenPdfYn === 'Y' ? (<Badge className="badge full_blue">에이전시</Badge>) : null}
            <div className="name_text">{item?.pdfNm}</div>
          </div>
        )
      }
    }
  }

  if (isNarrow) {
    return (
      <div className="estimate_resp_mo">
        <div className="cell tr accent">{index + 1}</div>
        <div className="cell through pdname">
          <div className="title">상품명</div>
          <div className="info_c">{pdfNmItem()}</div>
        </div>
        <div className="cell through">
          <div className="title">단가(원)</div>
          {type === 'form' && (
            <>
              <div className="info_c">
                <input
                  type="text"
                  value={prcLabel}
                  onChange={(e) => handleChangePrice(e.target.value, index)}
                  title={'prcLabel'}
                />
              </div>
            </>
          )}
          {type === 'sheet' && <div className="info_c">{prcLabel}</div>}
        </div>
        <div className="cell through">
          <div className="title">주문수량</div>
          {type === 'form' && (
            <>
              <div className="info_c">
                <input
                  type="text"
                  value={cntLabel}
                  onChange={(e) => handleChangeQuantity(e.target.value, index)}
                  title={'cntLabel'}
                />
              </div>
            </>
          )}
          {type === 'sheet' && <div className="info_c">{cntLabel}</div>}
        </div>
        <div className="cell through">
          <div className="title">단위</div>
          <div className="info_c">개</div>
        </div>
        <div className="cell through">
          <div className="title">금액(원)</div>
          <div className="info_c">{totalPrcLabel}</div>
        </div>
        {type === 'form' && (
          <div className="cell through delwrap">
            <Button className="del_btn" onClick={handleItemDelete}>
              <span className="hide">항목 삭제 버튼</span>
            </Button>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className="cell_wrap cell_td">
        <div className="cell num">{index + 1}</div>
        <div className="cell name">{pdfNmItem()}</div>
        {type === 'form' && (
          <>
            <div className="cell unitprice">
              <input
                type="text"
                value={prcLabel}
                onChange={(e) => handleChangePrice(e.target.value, index)}
                title={'prcLabel'}
              />
            </div>
            <div className="cell quantity">
              <input
                type="text"
                value={cntLabel}
                maxLength={1000000}
                onChange={(e) => handleChangeQuantity(e.target.value, index)}
                title={'cntLabel'}
              />
            </div>
          </>
        )}
        {type === 'sheet' && (
          <>
            <div className="cell unitprice">{prcLabel}</div>
            <div className="cell quantity">{cntLabel}</div>
          </>
        )}
        <div className="cell unit">개</div>
        <div className="cell money">{totalPrcLabel}</div>
        {type === 'form' && (
          <div className="cell del">
            <Button onClick={handleDelete}>
              <span className="hide">항목 삭제 버튼</span>
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default EstimateProductItem
