import { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'
import { UserContext } from 'modules/contexts/common/userContext'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'

const EntryPoint = (props) => {
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [isRegPopup, setIsRegPopup] = useState(false)
  const [rejectPopup, setRejectPopup] = useState(false)
  const [rejectUserTypePopup, setRejectUserTypePopup] = useState(false)
  const [redirectUserInfo, setRedirectUserInfo] = useState(false)

  const checkPopup = () => {
    //개인회원 제한
    if (userContext.state.userInfo.mmbrtypeId === 'SRS00004') {
      setRejectUserTypePopup(!rejectUserTypePopup)
    } else if (userContext.state.userInfo.mmbrtypeId === 'SRS00001') {
      setIsRegPopup(!isRegPopup)
    } else if (
      userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
      userContext.state.userInfo.mmbrtypeId === 'SRS00003'
    ) {
      movePage()
    }
  }

  const movePage = () => {
    if (userContext.state.userInfo.mmbrsttsId === 'AUA01001') { //회원타입이 "승인"만 이동

      if(userContext.state.userInfo.csbStmtno != null && userContext.state.userInfo.csbStmtno != undefined){ //통신판매업신고번호가 있을 때
        history.push(PathConstants.MY_PAGE_PRODUCT_EACH_WRITE)
      } else { //통신판매업신고번호가 없을 때
        setRedirectUserInfo(true)
      }

    } else {
      handleReject()
    }
  }

  const handleReject = () => setRejectPopup(!rejectPopup)
  const handleRejectUserType = () => setRejectUserTypePopup(!rejectUserTypePopup)
  const handleIsRegPopup = () => setIsRegPopup(!isRegPopup)
  const handleRedirectUserInfo = () => setRedirectUserInfo(!redirectUserInfo)

  const handleLinkToMainBox = () => { //메인박스 로그인으로 이동
    window.open(`${process.env.REACT_APP_MAIN_BOX_URL}/member/login.do`)
  }

  return (
    <div className="container">
      {rejectUserTypePopup && (
        <PopupCustom className={'register_info_popup'} handlePopup={handleRejectUserType}>
          <div className="content">
            <div className="text">
              개인회원은 상품을
              <br /> 등록할 수 없습니다.
            </div>
          </div>
          <div className="btn_group">
            <Button className={'full_blue'} onClick={handleRejectUserType}>
              확인
            </Button>
          </div>
        </PopupCustom>
      )}

      {rejectPopup && (
        <PopupCustom handlePopup={handleReject} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              판매자 자격이 박탈되어 상품 등록이 불가능합니다.
              <br /> 관리자에게 문의하세요.
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={handleReject}>
                닫기
              </Button>
            </div>
          </div>
        </PopupCustom>
      )}

      {redirectUserInfo && ( //통신판매업신고 번호가 없을 때
        <PopupCustom handlePopup={handleRedirectUserInfo} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              통신판매업신고번호를 저장 후 상품 등록해주세요.<br />
              통신판매업신고번호는 마이페이지  &gt; 내정보에서 확인 및 수정이 가능합니다.
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={() => history.push(PathConstants.MY_PAGE_MYINFO)}>
                등록하러가기
              </Button>
            </div>
          </div>
        </PopupCustom>
      )}

      <BreadCrumbs {...props} />
      <div className="page_header">
        <h2 className="page_title">상품관리</h2>
      </div>
      {isRegPopup && (
        <PopupCustom className={'popup_review_warning popup_unable_pay'} handlePopup={handleIsRegPopup}>
          <div className="content">
            <div className="text">
              아직
              <p className={'highlight_full_lemon'}>
                <span className="text">회원 등록</span>
              </p>
              을 안하셨나요? <br />
              판매 후 세금계산서 발행, 에이전시, 이벤트 신청은 정회원만 가능합니다.

              <br /><br/>
              정회원 등록은 다음과 같이 진행해주시길 바랍니다.
              <br/>
              1. 하단 우측의 정회원등록버튼 클릭<br/> 
              2. 메인BOX에서 로그인<br/>
              3. 로그인 후 좌측 메뉴에서 회사관리 &gt; 사업자등록 메뉴에서 사업자 등록 진행<br/>
              4. 사업자 등록을 진행 후 현재 창에서 새로고침&#40;또는 F5버튼 클릭&#41;<br/>
              5. 정회원 인증 확인&#40;정회원 여부는 커머스BOX &gt; 마이페이지 &gt; 내정보에서 확인 가능합니다.
            </div>
          </div>
          <div className="popup_footer">
            <Button className={'linear_blue btn_delete'} onClick={movePage}>
              상품 등록하기
            </Button>
            <Button className={'full_blue'} onClick={handleLinkToMainBox}>정회원 등록하러 가기</Button>
          </div>
        </PopupCustom>
      )}
      <div className="product_init">
        <div className="product_init_content">
          <p className="text">상품을 등록하시겠습니까?</p>
          <Button className="full_blue" onClick={checkPopup}>
            상품등록하기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EntryPoint
