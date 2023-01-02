import React, { useState, useEffect, useCallback, useContext } from 'react'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'
import CartItem from 'components/mypage/cart/CartItem'
import PopupAlert from 'components/PopupAlert'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import { UserContext } from 'modules/contexts/common/userContext'

const Cart = () => {

  const history = useHistory()
  const userContext = useContext(UserContext)
  const [cartList, setCartList] = useState([])
  const [buyList, setBuyList] = useState([])
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    type: '',
    msg: '',
    btnMsg: '확인',
    btnMsg2: ''
  })

  const handlePopup = useCallback((btnType) => {
    if (popupAlert.type === 'DELETE' && btnType === 'btnMsg') postMyBasketDelete() //장바구니 삭제
    setPopupAlert({ ...popupAlert, active: !popupAlert, type: '', msg: '', btnMsg: '확인' })
  }, [popupAlert])

  const handlePopupCartDelete = useCallback(() => { //장바구니 삭제 팝업
    setPopupAlert({
      active: true,
      type: 'DELETE',
      msg: `해당 상품을 장바구니에서 삭제하시겠습니까?`,
      btnMsg: '삭제',
      btnMsg2: '취소'
    })
  }, [popupAlert])

  const handleProductPayment = useCallback(async () => { //주문하기
    if (buyList?.length < 1) { //상품 갯수 0개인지 확인
      setPopupAlert({
        active: true,
        type: 'ALERT',
        msg: `주문할 상품을 선택해주세요.`,
        btnMsg: '확인',
        btnMsg2: ''
      })
      return
    }

    const selrUsisId = buyList[0].selrUsisId
    if (selrUsisId === userContext?.state?.userInfo?.utlinsttId) { //본인 상품이면 거절
      setPopupAlert({
        active: true,
        type: 'SELLER',
        msg: `본인 상품은 주문이 불가합니다.`,
        btnMsg: '확인',
        btnMsg2: ''
      })
      return false
    }

    let checkOneSeller = buyList?.filter((item) => selrUsisId != item?.selrUsisId) //동일한 판매자의 상품만 선택했는지 확인
    if (checkOneSeller.length > 0) {
      setPopupAlert({
        active: true,
        type: 'SELLER',
        msg: `동일한 판매자샵의 상품들만\n주문할 수 있습니다.`,
        btnMsg: '확인',
        btnMsg2: ''
      })
      return
    }

    let checkPrcDscsY = buyList?.filter((item) => item?.prcDscsYn === 'Y') //가격협의 상품이 들어있는지 확인
    if (checkPrcDscsY.length > 0) {
      setPopupAlert({
        active: true,
        type: 'REQUIRE',
        msg: `가격협의가 필요한 상품이 있습니다.\n해당 상품은 바로 결제가 불가합니다.\n판매자에게 문의해주세요.`,
        btnMsg: '확인',
        btnMsg2: ''
      })
      return
    }

    const orderList = [...buyList].map((item) => { //주문 가능 상품 리스트 재가공
      return { pdfInfoId: item.pdfInfoId, orderQty: item.pdfCnt }
    })

    postPayProduct(orderList)

  }, [buyList, popupAlert])


  const getCartList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BASKET_LIST,
      method: 'get'
    }).then((response) => {
      response?.data?.code === '200' && setCartList(response.data.data)
    })
  }, [])

  const postMyBasketDelete = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BASKET_DELETE,
      method: 'post',
      data: [...buyList]
    }).then((response) => {
      if (response?.data?.code === '200') {
        let delCount = 0
        delCount = buyList.length
        buyList.map((item, index) => {
          Object.keys(cartList).map((key, index) => {
            let result = cartList[key].filter((cartList) => item.pdfInfoId !== cartList.pdfInfoId)
            if (result.length == 0) {
              delete cartList[key]
            } else {
              cartList[key] = result
            }
          })
        })
        setCartList({ ...cartList })
        setBuyList([])
        userContext.actions.actDelCartCount(delCount)
      }
    })
  }, [buyList, cartList])

  const postPayProduct = useCallback(async (orderList) => {
    await Axios({
      url: API.ORDER.PAY_PRODUCT,
      method: 'post',
      data: { addr: '', products: [...orderList] }
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.push({
          pathname: `${PathConstants.PAYMENT}`,
          state: { type: 'BASKET', data: { addr: '', products: [...orderList] } }
        })
      } else if (response?.data?.code === '400' && response?.data?.message != null) {
        setPopupAlert({
          active: true,
          type: 'ALERT',
          msg: response.data.message,
          btnMsg: '확인',
          btnMsg2: ''
        })
      } else {
        setPopupAlert({
          active: true,
          type: 'ALERT',
          msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
          btnMsg: '확인',
          btnMsg2: ''
        })
      }
    })
  }, [])


  useEffect(() => {
    getCartList()
  }, [])


  return (
    <>
      {popupAlert?.active && (
        <PopupAlert
          handlePopup={(btnType) => handlePopup(btnType)}
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg2={popupAlert?.btnMsg2}
          btnMsg={popupAlert?.btnMsg}
        />
      )}

      <div className="mypage">
        <div className="container ">
          <div className="cart_wrap">
            <div className="cart_wrap_inner">
              <TopTitle buyList={buyList} cartList={cartList} handlePopup={handlePopupCartDelete} />
              { //장바구니 리스트
                Object.keys(cartList).length < 1 ? (
                  <div className="nodate_wrap">장바구니에 담긴 상품이 없습니다.</div>
                ) : (
                  Object.keys(cartList).map((key, index) => (
                    <div className="seller_card_wrap" key={`seller_card_${index}`}>
                      <div className="card_title">
                        <p className="seller_name">{key}</p>
                      </div>
                      <div className="cart_list">
                        {cartList[key]?.map((item, index) => {
                          return (
                            <CartItem
                              item={item}
                              index={index}
                              cartList={cartList}
                              cartListkey={key}
                              setCartList={setCartList}
                              buyList={buyList}
                              setBuyList={setBuyList}
                              key={item.pdfInfoId}
                              setPopupAlert={setPopupAlert}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))
                )}
              {
                Object.keys(cartList).length > 0 && <BottomTotal buyList={buyList} handleProductPayment={handleProductPayment} />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

//장바구니 타이틀
const TopTitle = (props) => {
  const { buyList, cartList, handlePopup } = props
  const [count, setCount] = useState(0)

  useEffect(() => {
    let sum = 0
    Object.keys(cartList)?.map((key) => (sum += cartList[key].length))
    setCount(sum)
  }, [cartList])

  return (
    <div className="tab_header">
      <ul className="tab_header_list">
        <li className="tab_header_item">
          <span className="label">장바구니</span>
          <Badge className={count > 0 ? 'badge full_blue' : 'badge full_grey'}>{count}</Badge>
        </li>
      </ul>
      <div className="btn_group">
        {/* 상품 체크시 활성화 */}
        <Button className={'full_blue'} disabled={buyList?.length < 1} onClick={() => handlePopup()}>
          삭제
        </Button>
      </div>
    </div>
  )
}

//총 주문 금액 정보
const BottomTotal = (props) => {
  const { buyList, handleProductPayment } = props
  return (
    <>
      <div className="total_wrap">
        <p className="total_text">Total&#58;</p>
        <div className="total_amount">
          <p className="product_amount">
            상품금액 &#58;&nbsp;
            <span>
              {buyList
                .reduce((acc, cur) => {
                  if (cur.salePrc > 0) {
                    return (acc = acc + Number(cur.salePrc) * Number(cur.pdfCnt))
                  } else {
                    return (acc = acc + Number(cur.pdfPrc) * Number(cur.pdfCnt))
                  }
                }, 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
            &nbsp;원
          </p>
          <p className="delivery_amount">
            배송금액 &#58;&nbsp;
            <span>
              {buyList
                .reduce((acc, cur) => {
                  return (
                    cur?.deliveryinfo?.dvryBscprce > 0 ? (acc = acc + Number(cur?.deliveryinfo?.dvryBscprce)) : acc
                  )
                }, 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
            &nbsp;원
          </p>
          <p className="payment_amount">
            총 결제금액 &#58;&nbsp;
            <span>
              {' '}
              {buyList
                .reduce((acc, cur) => {
                  return (acc =
                    acc +
                    Number(cur?.deliveryinfo?.dvryBscprce ? cur?.deliveryinfo?.dvryBscprce : 0) +
                    (cur?.salePrc > 0
                      ? Number(cur.salePrc) * Number(cur.pdfCnt)
                      : Number(cur.pdfPrc) * Number(cur.pdfCnt)))
                }, 0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </span>
            &nbsp;원
          </p>
        </div>
      </div>
      <div className="button_wrap">
        {/* 상품 체크시 활성화 */}
        <Button className="btn full_blue" disabled={buyList.length < 1} onClick={handleProductPayment}>
          주문하기
        </Button>
        <p className="notice highlight_blue">배송비는 각각 구매 수량별 또는 받는 지역에 따라 변동될 수 있습니다.</p>
      </div>
    </>
  )
}

export default Cart
