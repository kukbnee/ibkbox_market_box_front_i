import { useState, useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import BuyerListContents from 'components/mypage/product/buyerWrite/BuyerListContents'
import BuyerContents from 'components/mypage/product/buyerWrite/BuyerContents'
import PopupAlert from 'components/PopupAlert'

const BuyerWrite = (props) => {
  const { id } = useParams()
  const history = useHistory()
  const [buyerInfo, setBuyerInfo] = useState({
    fileId: '',
    senEml: '',
    recEml: '',
    ttl: '',
    con: ''
  })
  const [productList, setProductList] = useState([])
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    type: 'ALERT',
    className: 'popup_review_warning popup_unable_pay',
    msg: '',
    caseMsg: []
  })

  const handlePopupAlert = useCallback(() => {
    if (popupAlert.type === 'SAVE') cancel()
    else setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '', caseMsg: [] })
  }, [popupAlert])

  const saveBuyer = useCallback(() => {

    if (
      buyerInfo?.senEml === '' ||
      buyerInfo?.recEml === '' ||
      buyerInfo?.ttl === '' ||
      buyerInfo?.con === '' ||
      buyerInfo?.fileId === '' ||
      productList.length < 1
    ) {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        className: 'popup_review_warning popup_unable_pay',
        msg: '바이어상품에 다음과 같은 항목은 필수 입력입니다.',
        caseMsg: ['보내는 사람', '받는 사람', '제목', '내용', '회사로고', '상품(최소 1개 이상)']
      })
      return
    }

    // 판매중지, 판매보류 상품일 때
    const userBlockPdfCheck = productList.filter((item) => item?.pdfSttsId === "GDS00002" || item?.pdfSttsId === "GDS00003")
    if (userBlockPdfCheck.length > 0) {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        className: 'popup_review_warning',
        msg: '판매중지 상품은 등록 할 수 없습니다.',
      })
      return
    }

    // 관리자 판매중지 상품일 때
    const adminBlockPdfCheck = productList.filter((item) => item?.pdfSttsId === "GDS00005")
    if (adminBlockPdfCheck.length > 0) {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        className: 'popup_review_warning',
        msg: '관리자 판매중지 상품은 등록 할 수 없습니다.',
      })
      return
    }

    postBuyerSave()
  }, [productList, buyerInfo])

  const cancel = useCallback(() => {
    history.push({ pathname: PathConstants.MY_PAGE_PRODUCT, state: { tab: 'buyer' } })
  }, [])

  const postBuyerSave = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BUYER_PRODUCT_SAVE,
      method: 'post',
      data: {
        ...buyerInfo,
        buyerProductList: [...productList]
      }
    }).then((response) => {
      if (response.data.code === '200') {
        setPopupAlert({
          ...popupAlert,
          active: !popupAlert.active,
          type: 'SAVE',
          className: 'popup_review_warning',
          msg: '상품 정보가 저장되었습니다.',
          caseMsg: []
        })
      }
    })
  }, [productList, buyerInfo])

  const getProductInfo = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BUYER_PRODUCT_DETAIL,
      method: 'get',
      params: { 
        buyerInfId: id,
        buyerFlg: 'selr'  //로그인만 가능
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setBuyerInfo(response.data.data.buyerProductInfo)
        setProductList(response.data.data.buyerProductList)
      }
    })
  }, [id])

  useEffect(() => { 
    if (id) getProductInfo() //수정일 경우
  }, [id])

  return (
    <>
      {popupAlert?.active && (
        <PopupAlert
          className={popupAlert?.className}
          msg={popupAlert?.msg}
          caseMsg={popupAlert?.caseMsg}
          btnMsg={'확인'}
          handlePopup={handlePopupAlert}
        />
      )}
      <div className="mypage product view">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">상품관리</h2>
              <p className="sub_title">바이어상품 {id ? `수정` : `등록`}</p>
            </div>
            <div className="btn_group">
              <Button className={'linear_blue btn_delete'} onClick={cancel}>취소</Button>
              <Button className={'full_blue btn_add'} onClick={saveBuyer}>저장</Button>
            </div>
          </div>
          <div className="product_container">
            {/* 바이어 상품 정보 입력 */}
            <BuyerContents form={buyerInfo} setForm={setBuyerInfo} />
            {/* 바이어 상품 리스트 */}
            <BuyerListContents form={productList} setForm={setProductList} />
          </div>
        </div>
      </div>
    </>
  )
}

export default BuyerWrite
