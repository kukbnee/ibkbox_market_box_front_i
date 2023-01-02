import { useState, useEffect, useContext, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { UserContext } from 'modules/contexts/common/userContext'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import ProductInfo from 'components/mypage/estimation/ProductInfo'
import QnaUserChatItem from 'components/mypage/qnaUser/QnaUserChatItem'
import EstimationSheet from 'pages/mypage/estimation/EstimationSheet'
import EstimationForm from 'pages/mypage/qnaUser/EstimationForm'
import PopupWithTitleAlert from 'components/PopupWithTitleAlert'
import PopupAlert from 'components/PopupAlert'

const QnaUserView = (props) => {

  const history = useHistory()
  const { id } = useParams()
  const userContext = useContext(UserContext)
  const [QnaDetailData, setQnaDetailData] = useState({})
  const [QnaChatList, setQnaChatList] = useState({})
  const [sellerId, setSellerId] = useState('')
  const [estmSheet, setEstmSheet] = useState({ esttInfoId: null, data: {} })
  const [paramsMsg, setParamsMsg] = useState({
    inqrInfoId: '',
    con: '',
    messageFlg: 'Y'
  })
  const [isPopup, setIsPopup] = useState({
    state: false,
    active: ''
  })
  const popupList = {
    cancel: (
      <PopupWithTitleAlert
        handlePopup={(type) => handlePopupBtn(type)}
        className={'estimate_cancel_popup'}
        title={'견적취소'}
        msg={'견적을 취소하시겠습니까?\n취소한 견적은 되돌릴 수 없습니다.'}
        btnMsg={'견적취소'}
      />
    ),
    detail: <EstimationSheet data={estmSheet?.data} handlePopup={(type) => handlePopupBtn(type)} />,
    estimate: <EstimationForm mainItemInfo={QnaDetailData} handlePopup={(type) => handlePopupBtn(type)} />,
    senEstimate: (
      <PopupWithTitleAlert
        handlePopup={(type) => handlePopupBtn(type)}
        className={'estimate_cancel_popup'}
        title={''}
        msg={'견적이 발송되었습니다.\n보낸 견적은 수정이 불가하며, 취소만 가능합니다.\n견적관리는 마이페이지 > 견적관리에서 확인 가능합니다.'}
        btnMsg={'확인'}
      />
    ),
    error: (
      <PopupWithTitleAlert
        handlePopup={(type) => handlePopupBtn(type)}
        className={'estimate_cancel_popup'}
        title={''}
        msg={'잠시 후 다시 시도해주세요.\n반복적으로 나타날 경우 관리자에게 문의해주세요.'}
        btnMsg={'확인'}
      />
    ),
    msg_length: (
      <PopupAlert
        handlePopup={() => handlePopupBtn('close')}
        className={'popup_review_warning'}
        msg={'문의 내용을 입력해주세요.'}
        btnMsg={'확인'}
      />
    )
  }

  const handlePageBack = useCallback(() => { //뒤로가기
    history.push(PathConstants.MY_PAGE_QNA_USER_LIST)
  }, [])

  const linkProductDetail = useCallback(() => { //상품 상세로 이동
    if (QnaDetailData?.pdfInfoId) history.push(`${PathConstants.PRODUCT_DETAIL}/${QnaDetailData?.pdfInfoId}`)
  }, [QnaDetailData])

  const onChangeMsgText = useCallback((e) => { //메세지 작성
    if (e.target.value.length > 800) return

    let regExp = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g //이모지 제거
    let text = e.target.value.replace(regExp, '')
    setParamsMsg({ ...paramsMsg, con: text })
  }, [paramsMsg])

  const handlePopup = useCallback((type) => {
    setIsPopup({ state: true, active: type })
  }, [isPopup])

  const handlePopupBtn = useCallback((type) => {
    if (type === 'send') { //견적서 발송 완료됬을 때
      handlePopup('senEstimate')
    } else if (type === 'btnMsg' && isPopup?.active === 'senEstimate') { //위 견젹서 발송 팝업 확인 버튼 눌렀을 때
      setIsPopup({ state: false, type: '' })
      getQnaDetail() //단가 수정 시 복원용
      getQnaDetailList()
    } else if (type === 'btnMsg' && isPopup?.active === 'cancel') { //견적서 작성 취소 눌렀을 때
      postEstimationCancel()
    } else if (type === 'refresh'){ //견적상세보기에서 견적 취소 했을 때
      getQnaDetailList()
      setIsPopup({ state: false, type: '' })
    } else { //그 외 닫기 버튼 눌렀을 때
      setIsPopup({ state: false, type: '' })
    }
  }, [isPopup])


  const getQnaDetail = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_QNA_DETAIL,
      method: 'get',
      params: { inqrInfoId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setQnaDetailData(response.data.data)
        setParamsMsg({ ...paramsMsg, inqrInfoId: id })
        setSellerId(response.data.data?.selrUsisId) //견적발송 버튼 표시용 셀러정보 state에 저장
      } else {
        setIsPopup({ state: true, active: 'error' }) //오류 팝업
      }
    })
  }, [id, isPopup])

  const getQnaDetailList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_QNA_DETAIL_LIST,
      method: 'get',
      params: { inqrInfoId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setQnaChatList(response.data.data)
        setParamsMsg({ ...paramsMsg, inqrInfoId: id, con: '' })
      } else {
        setIsPopup({ state: true, active: 'error' }) //오류 팝업
      }
    })
  }, [id, isPopup])

  const postQnaSave = useCallback(async () => {
    if(paramsMsg?.con?.length < 1){ //메세지 내용이 없으면 전송 불가
      setIsPopup({ state: true, active: 'msg_length' }) //메세지 전송 불가 팝업
      return
    }

    await Axios({
      url: API.MYPAGE.MY_QNA_SAVE,
      method: 'post',
      data: paramsMsg
    }).then((response) => {
      if (response?.data?.code === '200') getQnaDetailList()
      else {
        setIsPopup({ state: true, active: 'error' }) //오류 팝업
      }
    })
  }, [paramsMsg, isPopup])

  const getEstimationDetail = useCallback(async () => { //견적보기
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_DETAIL,
      method: 'get',
      params: { esttInfoId: estmSheet?.esttInfoId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setEstmSheet({ ...estmSheet, data: response.data.data })
        setIsPopup({ state: true, active: 'detail' })
      }
    })
  }, [estmSheet, isPopup])

  const postEstimationCancel = useCallback(async () => { //견적취소
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_CANCEL,
      method: 'post',
      data: estmSheet
    }).then((response) => {
      if (response?.data?.code === '200') {
        setIsPopup({ state: false, active: '' })
        getQnaDetailList()
      } else {
        setIsPopup({ state: true, active: 'error' }) //오류 팝업
      }
    })
  }, [estmSheet, isPopup])

  useEffect(() => {
    if (id) {
      getQnaDetail()
      getQnaDetailList()
    }
  }, [id])

  useEffect(() => {
    if (estmSheet?.esttInfoId != null && estmSheet?.paramType === 'detail' && Object.keys(estmSheet?.data).length === 0)
      getEstimationDetail()
    if (estmSheet?.esttInfoId != null && estmSheet?.paramType === 'cancel')
      setIsPopup({ state: !isPopup.state, active: 'cancel' })
  }, [estmSheet])

  return (
    <>
      <div className="mypage inquiry_view_wrap inquiry_list  product agency estimate">
        {/* 팝업 */}
        {isPopup?.state && popupList?.[isPopup?.active]}
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">문의</h2>
            </div>
          </div>
          <div className="inquiry_view_container">
            <div className="card_layout">
              <div className="card_content">
                <div className="inquiry_header">
                  <div className="inquiry_item_wrap">
                    <div className="inquiry_item tr">
                      <div className="cell pd_info">상품정보</div>
                    </div>
                    <div className="inquiry_item td">
                      <ProductInfo
                        type={'QNA'}
                        classCell={'cell pd_info'}
                        classWrap={'data_content'}
                        classPrcWrap={'text_wrap'}
                        textColor={'#878296'}
                        data={QnaDetailData}
                        handleLink={linkProductDetail}
                      />
                    </div>
                  </div>
                </div>
                <div className="inquiry_msg_wrap">
                  <div className="inquiry_msg_view scroll">
                    {/* 채팅 */}
                    <QnaUserChatItem
                      data={QnaChatList}
                      handlePopup={(type) => handlePopup(type)}
                      setEstmSheet={setEstmSheet}
                    />
                  </div>
                  <div className="inquiry_text_view">
                    <div className="inquiry_text_view_wrap">
                      <textarea
                        className="textarea scroll"
                        placeholder="문의 내용 입력"
                        value={paramsMsg?.con}
                        maxLength={800}
                        onChange={(e) => onChangeMsgText(e)}
                        title={'con'}
                      />
                      <div className="add">
                        <Button className="btn full_blue" onClick={postQnaSave}>
                          전송
                        </Button>
                      </div>
                    </div>
                    <p className="numbers">({paramsMsg?.con?.length}/800)</p>
                  </div>
                  <div className="btn_wrap_01">
                    <Button className="btn linear_blue" onClick={handlePageBack}>
                      닫기
                    </Button>
                    {userContext?.state?.userInfo?.utlinsttId === sellerId && (
                      <Button className="btn full_blue" onClick={() => handlePopup('estimate')}>
                        견적 발송
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default QnaUserView
