import React, { useState, useCallback, useEffect, useContext } from 'react'
import Badge from 'components/atomic/Badge'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import AddPopup from 'components/mypage/cart/AddPopup'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import { addComma } from 'modules/utils/Common'
import { UserContext } from 'modules/contexts/common/userContext'
import PopupAlert from 'components/PopupAlert'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'


const CardItem = (props) => {

  const { buttonUiType, syncInfo, data, buyerLatter, handleOnCart } = props
  const history = useHistory()
  const [product, setProduct] = useState({})
  const [addPopup, setAddPopup] = useState(false)
  const userContext = useContext(UserContext)
  const [poupMessage, setPoupMessage] = useState(false)
  const [msg, setMsg] = useState({ message: '', btnMsg: '' })
  const [loginPopup, setLoginPopup] = useState(false)

  const handleLoginPopup = () => { //로그인 팝업
    setLoginPopup(!loginPopup)
  }

  const onClickLogin = () => { //로그인
    handleLoginPopup()
    window.esgLogin()
  }

  const onLike = async (wishFlg, pdfInfoId) => { //위시리스트 클릭
    if (!userContext.state.userInfo.isLogin) { //로그인 필요
      handleLoginPopup()
      return
    }
    if (userContext?.state?.userInfo?.mmbrtypeId === "SRS00004") { //개인회원은 불가
      setMsg({ message: `해당 기능은 기업회원만 가능합니다.`, btnMsg: '닫기' })
      setPoupMessage(true)
      return;
    }

    switch (wishFlg) {
      case 'Y':
        await Axios({
          url: API.MAIN.WISH_DELETE,
          method: 'post',
          data: {
            pdfInfoId: pdfInfoId
          }
        }).then((response) => {
          if (response?.data?.code === '200') {
            setProduct({ ...product, wishFlg: 'N' })
            if (syncInfo?.syncFu != undefined) syncInfo.syncFu()
          } else if (response?.data?.code === '400' && response?.data?.data) {
            setMsg({ message: response.data.data, btnMsg: '확인' })
            setPoupMessage(true)
          } else {
            setMsg({ message: `오류가 발생했습니다.\n잠시 후 다시 시도해주세요.`, btnMsg: '확인' })
            setPoupMessage(true)
          }
        })
        break
      case 'N':
        await Axios({
          url: API.MAIN.WISH_SAVE,
          method: 'post',
          data: {
            pdfInfoId: pdfInfoId
          }
        }).then((response) => {
          if (response?.data?.code === '200') {
            setProduct({ ...product, wishFlg: 'Y' })
            if (syncInfo?.syncFu != undefined) syncInfo.syncFu()
          } else if (response?.data?.code === '400' && response?.data?.data) {
            setMsg({ message: response.data.data, btnMsg: '확인' })
            setPoupMessage(true)
          } else {
            setMsg({ message: `오류가 발생했습니다.\n잠시 후 다시 시도해주세요.`, btnMsg: '확인' })
            setPoupMessage(true)
          }
        })
        break
    }
  }

  const onCart = () => { //장바구니 담기
    if(buttonUiType === 'OUT') { //swiper 영역때문에 팝업 안뜨는 문제로, 메인 이벤트에서의 장바구니 팝업은 메인 index에서 처리
      handleOnCart(data)
      return
    }

    if (!userContext.state.userInfo.isLogin) {
      handleLoginPopup()
      return
    }

    if (userContext?.state?.userInfo?.mmbrtypeId === "SRS00004") {
      setMsg({ message: `해당 기능은 기업회원만 가능합니다.`, btnMsg: '닫기' })
      setPoupMessage(true)
      return;
    }

    setAddPopup(!addPopup)
  }

  const onStore = () => {
    window.open(`${PathConstants.SELLER_STORE}/${product.selrUsisId}`, '_blank')
  }

  const moveDetailPage = () => {
    if(buyerLatter){
      window.open(`${PathConstants.PRODUCT_DETAIL}/${product.pdfInfoId}`, '_blank')
    }else{
      history.push(`${PathConstants.PRODUCT_DETAIL}/${product.pdfInfoId}`)
    }

  }

  // 팝업닫기
  const handlePopupAlert = () => {
    setPoupMessage(!poupMessage)
  }

  useEffect(() => {
    setProduct({ ...data })
  }, [data])

  // 좋아요, 장바구니, 홈이 배경보다 밖에 있는 경우(메인의 이벤트 배너만 사용: buttonUiType === 'OUT' )
  const OutSideItem = () => {
    return (
      <div className="card_type02">
        <div className="card_inner">
          <div className="img" onClick={moveDetailPage}>
            {product?.agenInfId != null ? <Badge className="badge full_blue">에이전시</Badge> : ''}
            <img src={product?.imgUrl} alt={product?.pdfNm}  />
          </div>
          <div className="content">
            {
              product.selrUsisName &&
                <div className="brand_wrap mo_brand_wrap">
                  <img src={require('assets/images/ico_auth.png').default} alt="" />
                  <p className="brand">{product.selrUsisName}</p>
                </div>
            }
            <p className="title" onClick={moveDetailPage}>
              {product?.pdfNm}
            </p>
            {userContext?.state?.userInfo?.mmbrtypeId === 'SRS00004' || !userContext?.state?.userInfo?.mmbrtypeId ? (
              <div className="price">******원</div>
            ) : product?.pdfSttsId === 'GDS00002' || product?.pdfSttsId === 'GDS00003' ? (
              <div className="money_wrap">
                <p className="money sell_stop">판매중지</p>
              </div>
            ) : product?.pdfSttsId === 'GDS00005' ? (
              <div className="money_wrap">
                <p className="money red">관리자 판매중지</p>
              </div>
            ) : product?.prcDscsYn == 'Y' ? (
              <p className="price">가격협의</p>
            ) : (
              <>
                {Number(product?.salePrc) > 0 ? (
                  <div className="change_price_wrap">
                    <p className="before_price">{addComma(product?.pdfPrc)}원</p>
                    <p className="change_price">{addComma(product?.salePrc)}원</p>
                  </div>
                ) : (
                  <p className="price">{addComma(product?.pdfPrc)}원</p>
                )}
              </>
            )
            }
            <div className="brand_wrap">
              {product?.userAuthYn === 'Y' ? <img src={require('assets/images/ico_auth.png').default} alt="" /> : ''}
              <p className="brand">{product?.selrUsisName}</p>
            </div>
            <div className="card_menu_list btn_group">
              <button
                className={`card_menu_item heart ${product?.wishFlg === 'Y' && `on`}`}
                title="좋아요"
                onClick={() => onLike(product?.wishFlg, product?.pdfInfoId)}
              >
                <span className="hide">좋아요</span>
              </button>
              <button className="card_menu_item cart" title="장바구니" onClick={onCart}>
                <span className="hide">장바구니</span>
              </button>
              <button className="card_menu_item order" title="상세보기" onClick={onStore}>
                <span className="hide">상세보기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const InSideItem = () => {
    return (
      <div className="card">
        <div className="card_box">
          <div className="card_inner">
            <div className="img">
              <div className="img" onClick={moveDetailPage}>
                {product?.agenInfId != null ? <Badge className="badge full_blue">에이전시</Badge> : ''}
                <img src={product?.imgUrl} alt={product?.pdfNm} />
              </div>
              <div className="card_menu_list btn_group">
                <button
                  className={`card_menu_item heart ${product?.wishFlg === 'Y' && `on`}`}
                  title="좋아요"
                  onClick={(e) => onLike(product?.wishFlg, product?.pdfInfoId)}
                >
                  <span className="hide">좋아요</span>
                </button>
                <button className="card_menu_item cart" title="장바구니" onClick={onCart}>
                  <span className="hide">장바구니</span>
                </button>
                <button className="card_menu_item order" title="상세보기" onClick={onStore}>
                  <span className="hide">상세보기</span>
                </button>
              </div>
            </div>
            
            <div className="content">
              <p className="title" onClick={moveDetailPage}>
                {product?.pdfNm}
              </p>
              {/*바이어 레터인 경우*/}
              {buyerLatter ?
                  product?.pdfSttsId === 'GDS00002' ?
                      <div className="change_price_wrap">
                        <div className="money_wrap">
                          <p className="money sell_stop">판매중지</p>
                        </div>
                      </div>
                      : product?.pdfSttsId === 'GDS00005' ?
                            <div className="change_price_wrap">
                              <div className="money_wrap">
                                <p className="money red">관리자 판매중지</p>
                              </div>
                            </div>
                        :
                          product?.prcDscsYn == 'Y' ? (
                            <p className="price">가격협의</p>
                          ) : (
                            <>
                              {Number(product?.salePrc) > 0 ? (
                                <div className="change_price_wrap">
                                  <p className="before_price">{addComma(product?.pdfPrc)}원</p>
                                  <p className="change_price">{addComma(product?.salePrc)}원</p>
                                </div>
                              ) : (
                                <p className="price">{addComma(product?.pdfPrc)}원</p>
                              )}
                            </>
                          )
                :
                // 바이어 레터가 아닌 경우
                userContext?.state?.userInfo?.mmbrtypeId === 'SRS00004' || !userContext?.state?.userInfo?.mmbrtypeId ? (
                  <div className="price">******원</div>
                ) : product?.pdfSttsId === 'GDS00002' || product?.pdfSttsId === 'GDS00003' ? (
                  <div className="money_wrap">
                    <p className="money sell_stop">판매중지</p>
                  </div>
                ) : product?.pdfSttsId === 'GDS00005' ? (
                  <div className="money_wrap">
                    <p className="money red">관리자 판매중지</p>
                  </div>
                ) : product?.prcDscsYn == 'Y' ? (
                  <p className="price">가격협의</p>
                ) : (
                  <>
                    {Number(product?.salePrc) > 0 ? (
                      <div className="change_price_wrap">
                        <p className="before_price">{addComma(product?.pdfPrc)}원</p>
                        <p className="change_price">{addComma(product?.salePrc)}원</p>
                      </div>
                    ) : (
                      <p className="price">{addComma(product?.pdfPrc)}원</p>
                    )}
                  </>
                )}
              {!buyerLatter && ( //바이어레터인 경우 회사명 빠짐
                <div className="brand_wrap">
                  {product?.userAuthYn == 'Y' ? <img src={require('assets/images/ico_auth.png').default} alt="" /> : ''}
                  <p className="brand">{product?.selrUsisName}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {buttonUiType === 'OUT' ? <OutSideItem /> : <InSideItem />}
      {addPopup && <AddPopup product={product} handlePopup={onCart} />}
      {poupMessage && (
        <PopupAlert msg={msg.message} btnMsg={msg.btnMsg} handlePopup={handlePopupAlert} />
      )}
      {loginPopup && (
          <PopupCustom className={'register_info_popup add_cart_popup'} handlePopup={handleLoginPopup}>
            <div className="content">
              <div className="text">로그인이 필요합니다.</div>
            </div>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={onClickLogin}>
                로그인하러 가기
              </Button>
            </div>
          </PopupCustom>
      )}
    </>
  )
}

export default CardItem
