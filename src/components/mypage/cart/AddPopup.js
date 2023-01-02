import React, { useState, useCallback, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'
import Counter from 'components/Counter'
import { addComma } from 'modules/utils/Common'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PopupAlert from 'components/PopupAlert'
import PathConstants from 'modules/constants/PathConstants'
import { UserContext } from 'modules/contexts/common/userContext'

const AddPopup = (props) => {
  const userContext = useContext(UserContext)
  const { product, handlePopup } = props
  const history = useHistory()
  const [poupInfo, setPoupInfo] = useState({ state: false, msg: '' })
  const [poupCart, setPoupCart] = useState(false)
  const [qty, setQty] = useState(1)

  const handleAdd = useCallback(() => {
    if (product?.ordnMxmmQtyYn === 'Y') {
      let result = product?.ordnMxmmQty > qty ? qty + 1 : product?.ordnMxmmQty
      setQty(result)
    } else {
      setQty(qty + 1)
    }

  }, [qty])

  const handleMinus = useCallback(() => {
    let counterValue = qty - 1
    if (counterValue <= product?.ordnMnmmQty) { //최소구매 수량인지 체크
      setQty(product?.ordnMnmmQty) 
      return
    }

    if(counterValue < 1){
      setQty(1) //최소구매 수량은 1
    } else { 
      setQty(counterValue)
    }

  }, [qty])

  const handleCntChange = useCallback((e) => {
    let reqExp = /[^0-9]/g 
    let numberTxt = e.target.value ? parseInt(e.target.value.replace(reqExp, '')) : 0 //숫자만 입력 받기
    setQty(numberTxt)
  }, [qty])


  const handleCntOnBlur = () => { //상품 수량 변경(직접입력) 후 주문 수량 최소/최대 체크
    //최소 주문 수량 체크
    if(product?.ordnQtyLmtnUsyn === 'Y' && qty < product?.ordnMnmmQty){
      setQty(product.ordnMnmmQty)
      setPoupInfo({ state: true, msg: `최소 구매 수량은 ${product.ordnMnmmQty}개 입니다.` })
      return
    }
   
    //최대 주문 수량 체크
    if(product?.ordnQtyLmtnUsyn === 'Y' && qty > product?.ordnMxmmQty){
      setQty(product.ordnMxmmQty)
      setPoupInfo({ state: true, msg: `최대 구매 수량은 ${product.ordnMxmmQty}개 입니다.` })
      return
    }

    //최소 주문 수량은 없으나 0개 직접 입력했을경우 1로 고정
    if(qty < 1) setQty(1)
  }

  const addProductInCart = async () => {

    if (product?.ordnQtyLmtnUsyn === 'Y') {
      if (qty < product?.ordnMnmmQty) {
        setPoupInfo({ state: true, msg: `최소 구매 수량은 ${addComma(product?.ordnMnmmQty)}개 입니다.` })
        return;
      }

      if (product?.ordnMxmmQtyYn === 'Y' && qty > product?.ordnMxmmQty) {
        setPoupInfo({ state: true, msg: `최대 구매 수량은 ${addComma(product?.ordnMxmmQty)}개 입니다.` })
        return;
      }
    }

    await Axios({
      url: API.MAIN.BASKET_SAVE,
      method: 'post',
      data: {
        pdfInfoId: product.pdfInfoId,
        pdfCnt: qty,
        utId: 'COC02001'
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPoupCart(!poupCart)
      } else if(response?.data?.code === '400' && response?.data?.message){
        setPoupInfo({ state: !poupInfo.state, msg: response.data.message })
      } else {
        setPoupInfo({ state: !poupInfo.state, msg: "처리 중 오류가 발생하였습니다." })
      }
    })
  }

  // 팝업닫기
  const handlePopupAlert = () => {
    setPoupInfo({ state: !poupInfo.state, msg: '' })
  }

  const handlePopupCart = (type) => {
    handlePopup()
    userContext.actions.actAddCartCount()
    switch (type) {
      case 'link':
        history.push(PathConstants.MY_PAGE_CART)
        break
      case 'close':
        setPoupCart(false)
        break
    }
  }

  useEffect(() => {
    if (product.ordnMnmmQty > 0) {
      setQty(product.ordnMnmmQty)
    }
  }, [])

  return (
    <PopupCustom handlePopup={handlePopup} className={'reject_reason_popup cart_popup'}>
      <div className="confirm_msg_wrap">
        <p className="title_text">장바구니</p>
        <div className="cart_popup_container">
          <div className="cart_popup_content">
            <div className="img_wrap">
              <img
                src={product.imgUrl}
                alt={product.pdfNm}
              />
            </div>
            <div className="info">
              <p className="title">{product?.pdfNm}</p>
              <p className="text">{product?.brfDesc}</p>
              {
                product.prcDscsYn == "Y" ? (
                  <p className="price">가격협의</p>
                ) : (
                  <>
                    {Number(product.salePrc) > 0 ? (
                      <div className="change_price_wrap">
                        <p className="before_price">
                          {addComma(product?.pdfPrc)}원
                        </p>
                        <p className="change_price">
                          {addComma(product.salePrc)}원
                        </p>
                      </div>
                    ) : (
                      <p className="price">
                        {addComma(product?.pdfPrc)}원
                      </p>
                    )}
                  </>
                )
              }
            </div>
          </div>
          <div className="util">
            <div className="number">
              <div className="number_top">
                <p className="number_text">수량</p>
                <div className="component_section">
                  <Counter
                    type={'type03'}
                    value={addComma(qty)}
                    handleAdd={handleAdd}
                    handleMinus={handleMinus}
                    handleInput={handleCntChange}
                    onBlur={handleCntOnBlur}
                  />
                </div>
              </div>
              <div className="number_bot">
                {product?.ordnQtyLmtnUsyn === 'Y' && <p className="number_subtext">최소 구매 수량 : {product?.ordnMnmmQty}개</p>}
              </div>
            </div>
            <div className="all_price">
              <p className="all_price_text">총금액</p>
              <p className="all_price_money">
                {
                  product.prcDscsYn == "Y" ? (
                    <span>가격협의</span>
                  ) : (
                    <>
                      {Number(product.salePrc) > 0 ? (
                        <span>
                          {addComma((Number(product?.salePrc)) * qty)}원
                        </span>
                      ) : (
                        <span>
                          {addComma((Number(product?.pdfPrc)) * qty)}원
                        </span>
                      )}
                    </>
                  )
                }
              </p>
            </div>
          </div>
        </div>
        <div className="button_wrap">
          <Button className="full_blue btn" onClick={addProductInCart}>
            담기
          </Button>
        </div>
      </div>
      {poupInfo.state && <PopupAlert msg={poupInfo.msg} btnMsg={'확인'} handlePopup={handlePopupAlert} />}
      {poupCart && (
        <PopupCustom className={'register_info_popup add_cart_popup'} handlePopup={() => handlePopupCart('close')}>
          <div className="content">
            <div className="text">상품이 장바구니에 담겼습니다.</div>
          </div>
          <div className="btn_group">
            <Button className={'full_blue'} onClick={() => handlePopupCart('link')}>장바구니 바로가기</Button>
            <Button className={'full_blue'} onClick={() => handlePopupCart('close')}>쇼핑 계속하기</Button>
          </div>
        </PopupCustom>
      )}
    </PopupCustom>
  )
}

export default AddPopup
