import { useState, useCallback } from "react"
import { useHistory } from "react-router-dom"
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'
import { addComma } from 'modules/utils/Common'
import AddPopup from 'components/mypage/cart/AddPopup'

const CardItem = (props) => {

  const { type = '', data, getWishList, setPopupAlert } = props
  const history = useHistory()
  const [addPopup, setAddPopup] = useState(false)

  const onCart = useCallback(() => { //장바구니 담기 팝업
    setAddPopup(!addPopup)
  }, [addPopup])

  const handleLinkToStore = useCallback(() => { //판매자 상점으로 이동
    history.push(`${PathConstants.SELLER_STORE}/${data?.selrUsisId}`)
  }, [data])

  const handleLinkToDetail = useCallback(() => { //상품 상세로 이동
    history.push(`${PathConstants.PRODUCT_DETAIL}/${data?.pdfInfoId}`)
  }, [data])

  const postWishDelete = useCallback(async () => { //위시리스트에서 삭제
    await Axios({
      url: API.MAIN.WISH_DELETE,
      method: 'post',
      data: { pdfInfoId: data?.pdfInfoId }
    }).then(async (response) => {
      if (response?.data?.code === '200') {
        getWishList() //리스트 새로고침
      } else if (response?.data?.code === '400' && response?.data?.data) {
        setPopupAlert({ active: true, msg: response.data.data })
      } else {
        setPopupAlert({ active: true, msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [data])


  // 좋아요, 장바구니, 홈이 없는경우
  if (type === 'type02') {
    return (
      <div className="card_type02">
        {addPopup && <AddPopup product={data} handlePopup={onCart} />}
        <div className="card_inner">
          <div className="delete_btn_wrap">
            <Button onClick={postWishDelete}>
              <div className="hide">삭제버튼</div>
            </Button>
          </div>
          <div className="img">
            {data?.agenPdfYn === 'Y' && <Badge className="badge full_blue">에이전시</Badge>}
            <img src={data.imgUrl} alt={data.pdfNm} onClick={handleLinkToDetail} />
          </div>
          <div className="content">
            <p className="title" onClick={handleLinkToDetail}>{data.pdfNm}</p>
            {/* 가격정보 */}
            {data?.pdfSttsId === 'GDS00002' || data?.pdfSttsId === 'GDS00003' ? (
              <div className="money_wrap">
                <p className="money sell_stop">판매중지</p>
              </div>
            ) : data?.pdfSttsId === 'GDS00005' ? (
              <div className="money_wrap">
                <p className="money red">관리자 판매중지</p>
              </div>
            ) : data?.prcDscsYn == 'Y' ? (
              <p className="price">가격협의</p>
            ) : (
              <>
                {Number(data?.salePrc) > 0 ? (
                  <div className="change_price_wrap">
                    <p className="before_price">{addComma(Number(data?.pdfPrc))}원</p>
                    <p className="change_price">{addComma(Number(data?.salePrc))}원</p>
                  </div>
                ) : (
                  <p className="price">{addComma(Number(data?.pdfPrc))}원</p>
                )}
              </>
            )}
            <div className="brand_wrap">
              <img src={require('assets/images/ico_auth.png').default} alt="" />
              <p className="brand">{data.name}</p>
            </div>
            <div className="card_menu_list btn_group">
              <button className="card_menu_item heart" title="좋아요" onClick={postWishDelete}>
                <span className="hide">좋아요</span>
              </button>
              <button className="card_menu_item cart" title="장바구니" onClick={onCart}>
                <span className="hide">장바구니</span>
              </button>
              <button className="card_menu_item order" title="상세보기" onClick={handleLinkToStore}>
                <span className="hide">상세보기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="card">
        {addPopup && <AddPopup product={data} handlePopup={onCart} />}
        <div className="card_box">
          <div className="card_inner">
            <div className="delete_btn_wrap">
              <Button onClick={postWishDelete}>
                <div className="hide">삭제버튼</div>
              </Button>
            </div>
            <div className="img">
              {data?.agenPdfYn === 'Y' && <Badge className="badge full_blue">에이전시</Badge>}
              <img src={data.imgUrl} alt={data.pdfNm} onClick={handleLinkToDetail} />
              <div className="card_menu_list btn_group">
                <button className="card_menu_item heart" title="좋아요" onClick={postWishDelete}>
                  <span className="hide">좋아요</span>
                </button>
                <button className="card_menu_item cart" title="장바구니" onClick={onCart}>
                  <span className="hide">장바구니</span>
                </button>
                <button className="card_menu_item order" title="상세보기" onClick={handleLinkToStore}>
                  <span className="hide">상세보기</span>
                </button>
              </div>
            </div>
            <div className="content">
              <p className="title" onClick={handleLinkToDetail}>{data.pdfNm}</p>
              {/* 가격정보 */}
              {data?.pdfSttsId === 'GDS00002' || data?.pdfSttsId === 'GDS00003' ? (
                <div className="money_wrap">
                  <p className="money sell_stop">판매중지</p>
                </div>
              ) : data?.pdfSttsId === 'GDS00005' ? (
                <div className="money_wrap">
                  <p className="money red">관리자 판매중지</p>
                </div>
              ) : data?.prcDscsYn == 'Y' ? (
                <p className="price">가격협의</p>
              ) : (
                <>
                  {Number(data?.salePrc) > 0 ? (
                    <div className="change_price_wrap">
                      <p className="before_price">{addComma(Number(data?.pdfPrc))}원</p>
                      <p className="change_price">{addComma(Number(data?.salePrc))}원</p>
                    </div>
                  ) : (
                    <p className="price">{addComma(Number(data?.pdfPrc))}원</p>
                  )}
                </>
              )}
              <div className="brand_wrap">
                <img src={require('assets/images/ico_auth.png').default} alt="" />
                <p className="brand">{data.bplcNm}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CardItem
