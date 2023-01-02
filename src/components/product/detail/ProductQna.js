import React, { useCallback, useContext, useState } from "react"
import { useHistory } from "react-router-dom"
import Button from 'components/atomic/Button'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import PathConstants from 'modules/constants/PathConstants'
import { UserContext } from 'modules/contexts/common/userContext'
import PopupAlert from 'components/PopupAlert'

const ProductQna = (props) => {

  const { productInfo } = props
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: null })


  const handlePopupAlert = useCallback(() => {
    setPopupAlert({ active: !popupAlert.active, msg: null })
  }, [popupAlert])

  const handleLinkQna = useCallback(() => {
    if (!userContext?.state?.userInfo?.isLogin) { //로그인 안했을 때
      setPopupAlert({ active: true, msg: `로그인이 필요합니다.` })
      return
    }
    if (userContext?.state?.userInfo?.mmbrtypeId === "SRS00004") { //개인회원일 때
      setPopupAlert({
        active: true,
        type: 'USER_TYPE',
        msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
        caseMsg: [
          '하단 우측의 정회원등록버튼 클릭',
          '메인BOX에서 로그인',
          '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
          '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
          '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
        ],
        btnMsg:'정회원 등록하러 가기',
        btnMsg2:'닫기'
      })
      return
    }
    if (userContext?.state?.userInfo?.utlinsttId === productInfo?.selrUsisId){ //판매자 본인 상품일 때
      setPopupAlert({ active: true, msg: `본인 상품에는 문의 할 수 없습니다.` })
      return
    }

    postProductDetailQnaSave()
  }, [userContext, productInfo])


  const postProductDetailQnaSave = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.PRODUCT_DETAIL_QNA_SAVE,
      method: 'post',
      data: { pdfInfoId: productInfo?.pdfInfoId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.push({
          pathname: `${PathConstants.MY_PAGE_QNA_USER_VIEW}/${response.data.data}`,
          state: { inqrInfoId: response.data.data }
        })
      } else if (response?.data?.code === '400' && response?.data?.message != null) {
        setPopupAlert({ active: true, msg: response.data.message })
      } else {
        setPopupAlert({ active: true, msg: '잠시 후 다시 시도해주세요.' })
      }
    })
  }, [productInfo])


  return (
    <>
      {popupAlert?.active && (
        <PopupAlert className={'popup_review_warning'} msg={popupAlert?.msg} btnMsg={'확인'} handlePopup={handlePopupAlert} />
      )}

      <div className={'product_qna_detail'}>
        <div className="product_tit_header">
          <p className="title">상품문의</p>
        </div>
        <div className="inquiry_wrap">
          <div className="inquiry">
            <Button className="btn full_blue" onClick={handleLinkQna}>상품 문의하기</Button>
            <p className="inquiry_text">
              1:1문의를 통해 판매자에게 직접 문의하거나
              <br />
              견적을 요청할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductQna
