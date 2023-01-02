import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import BreadCrumbs from 'components/BreadCrumbs'
import BasicInfo from 'components/mypage/myInfo/BasicInfo'
import MemberType from 'components/mypage/myInfo/MemberType'
import SellerInfo from 'components/mypage/myInfo/SellerInfo'
import MailOrderSalesNumber from 'components/mypage/myInfo/MailOrderSalesNumber'
import Design from 'components/mypage/myInfo/Design'
import Banner from 'components/mypage/myInfo/Banner'
import BusinessCard from 'components/mypage/myInfo/BusinessCard'
import Seal from 'components/mypage/myInfo/Seal'
import PopupAlert from 'components/PopupAlert'
import PopupCustom from 'components/PopupCustom'
import Button from 'components/atomic/Button'

const MyInfo = (props) => {

  const history = useHistory()
  const [myData, setMyData] = useState({})
  const [originBannerList, setOriginBannerList] = useState([]) //배너 수정하다가 취소 눌렀을 때 복원용
  const [popupAlert, setPopupAlert] = useState({ active: false, type: 'ALERT', msg: null, btnMsg: '확인' })

  const handlePopupAlert = useCallback(() => {
    if (popupAlert?.msg === '사용자 정보가 존재하지 않습니다') {
      history.goBack()
    }
    setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: null })
  }, [popupAlert])

  const handleLinkToMainBox = useCallback(() => { //메인박스 로그인으로 이동
    window.open(`${process.env.REACT_APP_MAIN_BOX_URL}/member/login.do`)
  })

  const getMyInfo = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_INFO,
      method: 'get'
    }).then((response) => {
      if (response?.data?.code === '200') {
        setMyData(response.data.data)
        setOriginBannerList(response.data.data.bannerInfoList)
      } else if (response?.data?.code != '200' && response?.data?.message){
        setPopupAlert({ ...popupAlert, active: true, msg: response.data.message })
      } else {
        setPopupAlert({ ...popupAlert, active: true, msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [])

  useEffect(() => {
    getMyInfo()
  }, [])

  return (
    <>
      {popupAlert?.active && popupAlert?.type === 'ALERT' && (
        <PopupAlert
          handlePopup={handlePopupAlert}
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={popupAlert?.btnMsg}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'MAIN_BOX' && (
      <PopupCustom handlePopup={handlePopupAlert} className={'popup_review_warning popup_unable_pay'}>
        <div className="content">
          <p className="text">
            내 정보, 판매자 정보는 메인BOX에서 수정가능합니다.<br />
            메인BOX에서 <b className="highlight_blue">커머스BOX</b>에 가입한 <b className="highlight_blue">휴대폰번호로 로그인</b>후 수정해주세요.<br />
            내 정보는 메인BOX &gt; 프로필조회,<br/>
            판매자 정보는 메인BOX &gt; 회사관리 &gt; 회사프로필에서 변경가능합니다.
          </p>
          <div className="popup_footer">
            <Button className={'full_blue'} onClick={handleLinkToMainBox}>수정하러가기</Button>
          </div>
        </div>
      </PopupCustom>
      )}

      <div className="my_info write">
        <div className="container default_size">
          <BreadCrumbs {...props} />
          <div className="info_wrap">
            <p className="title">내정보</p>
            <BasicInfo data={myData} setPopupAlert={setPopupAlert} />
            <MemberType data={myData} />
            <SellerInfo data={myData} setPopupAlert={setPopupAlert} />
            <MailOrderSalesNumber data={myData} setData={setMyData} setPopupAlert={setPopupAlert} />
            <Design data={myData} setMyData={setMyData} setPopupAlert={setPopupAlert} />
            <Banner data={myData} originBannerList={originBannerList} setMyData={setMyData} setPopupAlert={setPopupAlert} />
            <BusinessCard myData={myData}/>
            <Seal data={myData} setData={setMyData} setPopupAlert={setPopupAlert} />
          </div>
        </div>
      </div>
    </>
  )
}

export default MyInfo
