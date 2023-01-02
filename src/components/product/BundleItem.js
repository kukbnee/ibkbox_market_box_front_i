import { useState, useEffect, useCallback, useContext } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import PathConstants from 'modules/constants/PathConstants'
import Badge from 'components/atomic/Badge'
import { addComma } from 'modules/utils/Common'
import { UserContext } from 'modules/contexts/common/userContext'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import PopupCustom from 'components/PopupCustom'

const BundleItem = (props) => {

  const { data, handleRefreshList } = props
  const userContext = useContext(UserContext)
  const [mainYCnt, setMainYCnt] = useState(0)
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '', btnMsg: '확인' })
  const [popupLogin, setPopupLogin] = useState(false)

  const handlePopupAlert = useCallback(() => {
    setPopupAlert(!popupAlert)
  }, [popupAlert])

  const handlePopupLogin = useCallback(() => {
    setPopupLogin(!popupLogin)
  }, [popupLogin])

  const onClickLogin = useCallback(() => { //로그인
    handlePopupLogin()
    window.esgLogin()
  }, [popupLogin])

  const onLike = useCallback((wishFlg, pdfInfoId) => { //좋아요 클릭
    if (!userContext?.state?.userInfo?.isLogin || Object.keys(userContext?.state?.userInfo).length < 1) {
      handlePopupLogin()
      return
    }
    if (userContext?.state?.userInfo?.mmbrtypeId === "SRS00004") {
      setPopupAlert({ active: true, msg: `해당 기능은 기업회원만 가능합니다.`, btnMsg: '닫기' })
      return;
    }

    if(pdfInfoId === undefined){ //id 값 없으면 거절
      setPopupAlert({ active: true, msg: `오류가 발생했습니다.\n잠시 후 다시 시도해주세요.`, btnMsg: '확인' })
      return;
    }

    if (wishFlg === 'Y') postWishDelete(pdfInfoId)
    else postWithAdd(pdfInfoId)

  }, [data, popupAlert, userContext])


  const postWishDelete = useCallback(async (pdfInfoId) => {
    Axios({
      url: API.MAIN.WISH_DELETE,
      method: 'post',
      data: { pdfInfoId: pdfInfoId }
    }).then(async(response) => {
      if (response?.data?.code === '200') {
        handleRefreshList() //리스트 새로고침(여러 묶음상품에 동일한 상품이 추가되어 있을 수 있어 전체 새로고침 함)
      } else if (response?.data?.code === '400' && response?.data?.data != null) {
        setPopupAlert({ active: true, msg: response.data.data, btnMsg: '확인' })
      } else {
        setPopupAlert({ active: true, msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.', btnMsg: '확인' })
      }
    })
  }, [data])

  const postWithAdd = useCallback(async (pdfInfoId) => {
    Axios({
      url: API.MAIN.WISH_SAVE,
      method: 'post',
      data: { pdfInfoId: pdfInfoId }
    }).then(async(response) => {
      if (response?.data?.code === '200') {
        handleRefreshList() //리스트 새로고침(여러 묶음상품에 동일한 상품이 추가되어 있을 수 있어 전체 새로고침 함)
      } else if (response?.data?.code === '400' && response?.data?.data != null) {
        setPopupAlert({ active: true, msg: response.data.data, btnMsg: '확인' })
      } else {
        setPopupAlert({ active: true, msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.', btnMsg: '확인' })
      }
    })
  }, [data])


  useEffect(() => {
    let mainCnt = 0 //묶음상품별 대표상품 수 확인
    data?.items?.map((product) => {
      if (product?.mainYn === 'Y') mainCnt = mainCnt + 1
    })

    setMainYCnt(mainCnt) //묶음상품별 대표상품 수 저장

  }, [data])


  return (
    <>
      {popupAlert?.active && ( //alert 팝업
        <PopupAlert
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={popupAlert?.btnMsg}
          handlePopup={handlePopupAlert} />
      )}
      {popupLogin && ( //로그인 팝업
        <PopupCustom className={'register_info_popup add_cart_popup'} handlePopup={handlePopupLogin}>
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
      <div className="combine_item">
        <Link to={`${PathConstants.PRODUCT_BIND_DETAIL}/${data?.bunInfId}`}>
          <div className="img_wrap">
            <img src={data.imgUrl} alt="" />
          </div>
          <div className="info_wrap">
            <p className="title">{data.pdfNm}</p>
            <p className="content">{data.pdfCon}</p>
          </div>
        </Link>
        <ul className="sub_item_list">
          {mainYCnt > 0 ? (
            <>
              {data?.items?.map((product, index) => {
                if (product?.mainYn === 'Y') {
                  return (
                    <li className="sub_item_item" key={'dataSubList_' + index}>
                      <Link className="link_flex" to={`${PathConstants.PRODUCT_DETAIL}/${product.pdfInfoId}`} >
                        <div className="sub_img_wrap">
                          <img src={product.imgUrl} alt="" />
                        </div>
                        <div className="sub_info_wrap">
                          <div className="name_wrap">
                            {product.agenInfId ? <Badge className="badge full_blue">에이전시</Badge> : null}
                            <p className="name">{product.pdfNm}</p>
                          </div>
                          <p className="cont">{product.brfDesc}</p>

                          {/* 가격 정보 */}
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
                          ) : (
                            product?.prcDscsYn === "Y" ? (
                              <div className="price">가격협의</div>
                            ) : (
                              Number(product.salePrc) > 0 ? (
                                <div className="price_wrap">
                                  <p className="price text_through">{addComma(Number(product.pdfPrc))}</p>
                                  <p className="price">{`${addComma(Number(product.salePrc))} 원`}</p>
                                </div>
                              ) : (
                                <p className="price">{`${Number(product.pdfPrc) > 0 ? addComma(Number(product.pdfPrc)) : 0} 원`}</p>
                              )
                            ))}

                        </div>
                      </Link>
                      <button className="like" onClick={() => onLike(product?.wishFlg, product?.pdfInfoId)}>
                        <span className={product?.wishFlg === 'Y' ? "number active" : "number"}>
                          {product?.wishCnt != null ? Number(product?.wishCnt) : 0}
                        </span>
                      </button>
                    </li>
                  )
                }
              })}
              {mainYCnt === 1 && <li className="sub_item_item" />}
            </>
          ) : (
            <li className="sub_item_item no_date">등록된 대표 상품이 없습니다.</li>
          )}
        </ul>
      </div>
    </>
  )
}

export default BundleItem
