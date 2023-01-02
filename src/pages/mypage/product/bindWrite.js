import { useState, useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import BindContents from 'components/mypage/product/bindWrite/BindContents'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import BindListContents from 'components/mypage/product/bindWrite/BindListContents'
import PopupAlert from 'components/PopupAlert'

const BindWrite = (props) => {
  const { id } = useParams()
  const history = useHistory()
  const [bundleInfo, setBundleInfo] = useState({
    fileId: '',
    pdfNm: '',
    pdfCon: ''
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

  const saveBundle = useCallback(() => {
    // 입력 validation
    if (bundleInfo?.fileId === '' || bundleInfo?.pdfNm === '' || bundleInfo?.pdfCon === '' || productList.length < 2) {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        className: 'popup_review_warning popup_unable_pay',
        msg: '묶음상품에 다음과 같은 항목은 필수 입력입니다.',
        caseMsg: ['대표이미지', '상품명', '상품내용', '상품(2개 이상)']
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

    // 대표상품지정 validation
    const mainPdfCheck = productList.filter((item) => item?.mainYn === "Y")
    if (mainPdfCheck.length > 2) {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        className: 'popup_review_warning',
        msg: '대표상품은 최대 2개까지 선택 가능합니다.',
      })
    } else if (mainPdfCheck.length > 0 && mainPdfCheck.length < 3) {
      postBundleSave()
    } else {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        className: 'popup_review_warning',
        msg: '대표상품을 1개 이상 선택해주세요.',
      })
    }
  }, [bundleInfo, productList])

  const cancel = useCallback(() => {
    history.push({ pathname: PathConstants.MY_PAGE_PRODUCT, state: { tab: 'bind' } })
  }, [])

  const postBundleSave = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BUNDLE_PRODUCT_SAVE,
      method: 'post',
      data: {
        ...bundleInfo,
        bundleProductList: [...productList]
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
  }, [productList, bundleInfo])

  const getProductInfo = useCallback(async () => { //등록한 묶음상품 정보
    await Axios({
      url: API.MYPAGE.MY_BUNDLE_PRODUCT_DETAIL,
      method: 'get',
      params: { bunInfId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setBundleInfo(response.data.data.bundleProductInfo)
        setProductList(response.data.data.bundleProductList)
      }
    })
  }, [])

  useEffect(() => {
    if (id) getProductInfo()//수정일 경우 데이터 불러오기
  }, [])

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
              <p className="sub_title">묶음상품 {id ? `수정` : `등록`}</p>
            </div>
            <div className="btn_group">
              <Button className={'linear_blue btn_delete'} onClick={cancel}>
                취소
              </Button>
              <Button className={'full_blue btn_add'} onClick={saveBundle}>
                저장
              </Button>
            </div>
          </div>
          <div className="product_container">
            {/* 이미지, 제목, 내용 */}
            <BindContents form={bundleInfo} setForm={setBundleInfo} />
            {/* 상품 리스트 */}
            <BindListContents form={productList} setForm={setProductList} />
          </div>
        </div>
      </div>
    </>
  )
}

export default BindWrite
