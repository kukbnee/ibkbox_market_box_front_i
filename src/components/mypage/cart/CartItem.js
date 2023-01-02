import React, { useState, useEffect, useCallback, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import Counter from 'components/Counter'
import Tooltip from 'components/Tooltip'
import Checkbox from 'components/atomic/Checkbox'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { addComma } from 'modules/utils/Common'
import { UserContext } from 'modules/contexts/common/userContext'
import Badge from 'components/atomic/Badge'
import PathConstants from 'modules/constants/PathConstants'


const CardItem = (props) => {

  const { item, index, cartList, setCartList, cartListkey, buyList, setBuyList, setPopupAlert } = props
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [counterVal, setCounterVal] = useState(0)
  const [delivery, setDelivery] = useState('')

  const checkQty = useCallback((type, qty) => {
    let pdfCnt = Number(qty);
    const minQty = Number(item.ordnMnmmQty);
    const maxQty = Number(item.ordnMxmmQty);

    if (pdfCnt < 1) pdfCnt = 1 //주문수량 최소는 1
    if (item.ordnQtyLmtnUsyn === 'Y' && minQty >= pdfCnt) { //최소주문수량 확인
      pdfCnt = minQty
      if(type === 'CHANGE'){ 
        setPopupAlert({
          active: true,
          type: 'ALERT',
          msg: `최소 구매 수량은 ${minQty}개 입니다.`,
          btnMsg: '확인',
          btnMsg2: ''
        })
      }
    }
    if (item.ordnQtyLmtnUsyn === 'Y' && item.ordnMxmmQtyYn === 'Y' && maxQty <= pdfCnt) { //최대주문수량 확인
      pdfCnt = maxQty
      if(type === 'CHANGE'){
        setPopupAlert({
          active: true,
          type: 'ALERT',
          msg: `최대 구매 수량은 ${maxQty}개 입니다.`,
          btnMsg: '확인',
          btnMsg2: ''
        })
      }
    }

    handleItemQtyChange(pdfCnt) //주문수량 변경

    return pdfCnt;
  })

  const handleItemQtyChange = (pdfCnt) => {
    let _cartList = (cartList[item?.selrUsisName]).map((picker, index) => {
      if (picker.pdfInfoId === item.pdfInfoId) {
        picker.pdfCnt = pdfCnt;
      }
      return picker
    })
    setCartList({ ...cartList, [item?.selrUsisName]: _cartList })
  }

  const handleAdd = () => { //주문수량 추가
    setCounterVal(checkQty('CHANGE', counterVal + 1))
  }
  const handleMinus = () => { //주문수량 감소
    setCounterVal(checkQty('CHANGE', counterVal - 1))
  }
  const handleCntChange = (e) => { //주문 수량 직접 입력
    let reqExp = /[^0-9]/g 
    let numberTxt = e.target.value ? parseInt(e.target.value.replace(reqExp, '')) : 0 //숫자만 입력 받기
    setCounterVal(numberTxt)
  }
  const handleCntOnBlur = () => { //직접 수량 입력 후 마우스 아웃일 때 주문 수량 체크
    setCounterVal(checkQty('CHANGE', counterVal))
  }

  const handleCheckBox = () => {
    let _cartList = { ...cartList }
    let _buyList = [...buyList]
    switch (_cartList[cartListkey][index].selectedFlg) {
      case `Y`:
        _buyList = _buyList.filter((butylist) => item.pdfInfoId !== butylist.pdfInfoId)
        _cartList[cartListkey][index].selectedFlg = `N`
        break
      case `N`:
        _cartList[cartListkey][index].selectedFlg = `Y`
        _buyList.push(_cartList[cartListkey][index])
        break
      default:
        break
    }
    setBuyList([..._buyList])
    setCartList({ ..._cartList })
  }

  const handleLinkToPdfDetail = () => { //상품 상세로 이동
    history.push(`${PathConstants.PRODUCT_DETAIL}/${item?.pdfInfoId}`)
  }

  //선택삭제
  const cartItemDelete = useCallback(async (pdfInfoId) => {
    await Axios({
      url: API.MYPAGE.MY_BASKET_DELETE,
      method: 'post',
      data: [{ pdfInfoId: pdfInfoId }]
    }).then((response) => {
      if (response?.data?.code === '200') {
        Object.keys(cartList).map((key, index) => {
          let result = cartList[key].filter((cartList) => pdfInfoId !== cartList.pdfInfoId)
          if (result.length == 0) {
            delete cartList[key];
          } else {
            cartList[key] = result;
          }
        })
        setCartList({ ...cartList })
        userContext.actions.actDelCartCount(1)
      }
    })
    let _buyList = [...buyList.filter(item => item.pdfInfoId !== pdfInfoId)]
    setBuyList([..._buyList])
  })

  useEffect(() => {
    setCounterVal(checkQty('INIT', item.pdfCnt));
    setDelivery(item?.deliveryinfo?.dvryPtrnId === 'GDS02001' ?
      `IBK에 등록되어있는 운송업체가 배송을 담당합니다.\n구매 수량, 수령위치에 따라서 가격이 달라질 수 있습니다.\n정확한 금액은 결제하기 페이지에서 확인 가능합니다.`
      :
      (item?.deliveryLocalInfoList ? item?.deliveryLocalInfoList.map(delivery => `${delivery?.trl} ${delivery?.ctcocrwd !== null ? '/ ' + delivery?.ctcocrwd : ''}: ${delivery?.amt ? addComma(Number(delivery.amt)) : ''}원 추가 \n`).join('') : '')
      + (item?.deliveryCntInfoList ? item?.deliveryCntInfoList.map(delivery => `${addComma(Number(delivery?.qty))}개 이상 구매시 ${addComma(Number(delivery?.amt))}원 추가 \n`).join('') : '')
    )
  }, [])

  return (
    <div className="cart_item">
      <button className="close_btn" onClick={() => cartItemDelete(item.pdfInfoId)}>
        <img src={require('assets/images/ico_close1.png').default} alt="" />
      </button>
      <div className="cart_new_wrap">
        <div className="cb_wrap">
          <Checkbox
            className={'type02'}
            id={item.pdfInfoId}
            onChange={handleCheckBox}
            checked={item?.selectedFlg !== 'N'}
          />
        </div>
        <div className="cart_right">
          <div className="cart_right_info">
            <div className="cart_info_wrap" onClick={handleLinkToPdfDetail}>
              <div className="img">
                <img src={item?.imgUrl} alt={item?.pdfNm} />
              </div>
              <div className="info">
                {item?.agenInfId &&
                  <div className="agency_wrap">
                    <Badge className="full_blue badge">에이전시</Badge>
                  </div>
                }
                <p className="title">{item?.pdfNm}</p>
                <p className="brand">{item?.selrUsisName}</p>
              </div>
            </div>
            <div className="product_info">
              <div className="counter_delivery_wrap">
                <Counter
                  type={'type02'}
                  value={addComma(Number(counterVal))}
                  handleAdd={() => handleAdd(item?.id)}
                  handleMinus={() => handleMinus(item?.id)}
                  handleInput={(e) => handleCntChange(e, item?.id)}
                  onBlur={handleCntOnBlur}
                />
              </div>
              <div className="money">
                <div className="money_text">
                  {/* 가격정보 */}
                  {item?.pdfSttsId === 'GDS00002' || item?.pdfSttsId === 'GDS00003' ? (
                    <div className="money_wrap">
                      <p className="money sell_stop">판매중지</p>
                    </div>
                  ) : item?.pdfSttsId === 'GDS00005' ? (
                    <div className="money_wrap">
                      <p className="money red">관리자 판매중지</p>
                    </div>
                  ) : item.prcDscsYn == 'Y' ? (
                    <>가격협의필요</>
                  ) : (item?.salePrc > 0 ?
                    (<div className="change_price_wrap">
                      <p className="before_price">{Number(item.pdfPrc) > 0 && `${addComma(counterVal * Number(item.pdfPrc))} ${item?.comPrcutName}`}</p>
                      <p className="change_price">{Number(item.salePrc) > 0 && `${addComma(counterVal * Number(item.salePrc))} ${item?.comPrcutName}`}</p>
                    </div>) :
                    (<div className="change_price_wrap">
                      <p className="change_price">{`${addComma(counterVal * (Number(item.pdfPrc) - Number(item.salePrc)))} ${item?.comPrcutName}`}</p>
                    </div>)
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="etc_text_wrap">
            <div className="delivery pre">
              <div className="charge">
                {item?.deliveryinfo?.dvryPtrnName} : {item?.deliveryinfo?.dvryPtrnId === 'GDS02002' ? `${item?.deliveryinfo?.dvryBscprce}원, ` : ''}
                <span className="label">

                  조건별 배송비 추가
                  {item?.ordnQtyLmtnUsyn === 'Y' &&
                    `, (최소 ${item?.ordnMnmmQty}개 이상  ${item?.ordnMxmmQty === '0' ? '' : `최대 ${item?.ordnMxmmQty}개 이하 구매 가능`})`
                  }
                  {item?.deliveryinfo?.dvryPtrnId === 'GDS02001' &&
                    `, 화물서비스 : 천일화물 `
                  }
                </span>
                {(item?.deliveryCntInfoList !== null || item?.deliveryLocalInfoList !== null || item?.deliveryinfo?.dvryPtrnId === 'GDS02001')
                  &&
                  <Tooltip
                    className={'bottom_left'}
                    title={item?.deliveryinfo?.dvryPtrnId === 'GDS02001' ? null : '조건별 배송비'}
                    content={delivery}
                  />}
              </div>
            </div>
          </div>

        </div>


      </div>

    </div>
  )
}

export default CardItem
