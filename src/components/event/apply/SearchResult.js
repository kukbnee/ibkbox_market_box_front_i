import { useCallback } from 'react'
import Button from 'components/atomic/Button'
import Badge from 'components/atomic/Badge'
import { addComma } from 'modules/utils/Common'

const SearchResult = (props) => {
  const { data, productList, setProductList, closePopup, setPopupAlert } = props

  const addProduct = useCallback(() => {
    // 판매중지, 판매보류 상품일 때
    if (data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003") {
      setPopupAlert({ active: true, msg: '판매중지 상품은 추가 할 수 없습니다.' })
      return
    }

    // 관리자 판매중지 상품일 때
    if (data?.pdfSttsId === "GDS00005") {
      setPopupAlert({ active: true, msg: '관리자 판매중지 상품은 추가 할 수 없습니다.' })
      return
    }

    // 중복 추가인지 확인
    const insertCheck = productList.filter((item) => item.pdfInfoId === data.pdfInfoId)
    if (insertCheck.length === 0) {
      setProductList([...productList, data])
      closePopup()
    } else {
      setPopupAlert({ active: true, msg: '이미 추가한 상품입니다.' })
      return
    }
  }, [data, productList])

  return (
    <li className="search_item mo_search_item">
      <div className="content_wrap_inner">
        <div className="content_wrap">
          <div className="img_wrap">
            <img src={data.imgUrl} alt="img" />
          </div>
          <div className="text_wrap">
            {(data?.pdfAgenState === 'Y' || data?.agenInfId) && (<Badge className="full_blue mo_badge">에이전시</Badge>)}
            <div className="text">{data.pdfNm}</div>
            {/* 가격정보 */}
            {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
              <p className="price money sell_stop">판매중지</p>
            ) : (
              data?.pdfSttsId === "GDS00005" ? (
                <p className="price money red">관리자 판매중지</p>
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
      </div>
      <div className="add popup_pc">
        {(data?.pdfAgenState === 'Y' || data?.agenInfId) && (<Badge className="full_blue mo_badge">에이전시</Badge>)}
      </div>
      {/* 가격정보 */}
      {data?.pdfSttsId === "GDS00002" || data?.pdfSttsId === "GDS00003" ? (
        <p className="money popup_pc sell_stop">판매중지</p>
      ) : (
        data?.pdfSttsId === "GDS00005" ? (
          <p className="money popup_pc red">관리자 판매중지</p>
        ) : (
          data?.prcDscsYn === "Y" ? (
            <div className="money popup_pc">가격협의</div>
          ) : (
            Number(data.salePrc) > 0 ? (
              <div className="money popup_pc">{addComma(data.salePrc) + ` 원`}</div>
            ) : (
              <div className="money popup_pc">{addComma(data.pdfPrc) + ` 원`}</div>
            )
          )
        ))}
      <div className="button">
        <Button onClick={addProduct} />
      </div>
    </li>
  )
}

export default SearchResult
