import { useState, useEffect, useCallback } from 'react'
import { useLocation, useHistory } from 'react-router'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import ReturnDetailItem from 'components/mypage/orderManagement/Return/ReturnDetailItem'

const ReturnRequest = (props) => {

  const history = useHistory()
  const location = useLocation()
  const data = location?.state
  const [returnData, setReturnData] = useState({})
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    type: null,
    msg: '',
    btnMsg: ''
  })

  const onClickButton = useCallback((type) => {
    switch (type) {
      case 'CANCEL':
        setPopupAlert({ active: true, type: 'CANCEL', msg: '반품을 취소하시겠습니까?', btnMsg: '반품취소' })
        break
      case 'REQUEST':
        setPopupAlert({ active: true, type: 'REQUEST', msg: '반품을 요청하시겠습니까?', btnMsg: '반품요청' })
        break
    }
  }, [])

  const handlePopupAlert = useCallback(() => {
    setPopupAlert({ active: false, type: null, msg: '', btnMsg: '확인' })
  }, [popupAlert])

  const handleLinkToDetail = useCallback(() => { //반품 요청 완료 후 반품 상세로 페이지 전환
    history.replace({ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL}/${data?.ordnInfoId}&${data?.infoSqn}&${data?.returnType}` })
  }, [data])

  const handlePopupType = useCallback((type) => {
    switch (type) {
      case 'btnMsg':
        switch (popupAlert.type) {
          case 'CANCEL':
            history.goBack() //반품 취소하기
            break
          case 'REQUEST':
            postOrderRetrunRequest() //반품 요청하기
            break
          case 'COMPLETE':
            handleLinkToDetail() //반품 상세로 이동
            break
          case 'ALERT':
            handlePopupAlert() //팝업 닫기
            break
        }
        break
      case 'close': {
        handlePopupAlert()
        if (popupAlert?.type === 'COMPLETE') handleLinkToDetail() //반품 상세로 이동
      }
        break
    }
  }, [data, popupAlert])

  const getRetrunDetail = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ORDER_RETURN_DETAIL,
      method: 'get',
      params: data
    }).then((response) => {
      response?.data?.code === '200' && setReturnData(response.data.data)
    })
  }, [data])

  const postOrderRetrunRequest = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ORDER_RETURN_REQUEST,
      method: 'post',
      params: {
        ordnInfoId: returnData?.ordnInfoId,
        infoSqn: returnData?.infoSqn
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({
          active: true,
          type: 'COMPLETE',
          msg: '반품이 접수되었습니다.\n판매자가 반품을 승인해야 반품처리가 가능합니다.',
          btnMsg: '확인'
        })
      } else if (response?.data?.code === '400' && response?.data?.message) {
        setPopupAlert({
          active: true,
          type: 'ALERT',
          msg: response.data.message,
          btnMsg: '확인'
        })
      } else {
        setPopupAlert({
          active: true,
          type: 'ALERT',
          msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
          btnMsg: '확인'
        })
      }
    })
  }, [data, returnData])

  useEffect(() => {
    getRetrunDetail()
  }, [data])

  return (
    <>
      {popupAlert?.active && (
        <PopupAlert
          handlePopup={(type) => handlePopupType(type)}
          className={'popup_review_warning'}
          msg={popupAlert.msg}
          btnMsg={popupAlert.btnMsg}
        />
      )}

      <div className="mypage buy_sell return return02">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">반품요청</h2>
            </div>
          </div>
          <div className="return_container return_request">
            <div className="card_layout">
              <div className="tab_header moretext">
                주문 상품 정보
              </div>
              <div className="table_list_wrap">
                <div className="table_header">
                  <div className="cell number">주문번호</div>
                  <div className="cell info">상품정보</div>
                  <div className="cell sale">판매가</div>
                  <div className="cell amount">주문수량</div>
                  <div className="cell delivery">배송</div>
                  <div className="cell price">총 주문금액</div>
                  <div className="cell company">판매사명</div>
                </div>
                <ul className="table_list">
                  <li className="table_list_item">
                    {returnData && <ReturnDetailItem data={returnData} returnType={'buyer'} />}
                  </li>
                </ul>
              </div>
            </div>
            <div className="card_layout bg_gray">
              <div className="return_refund_wrap">
                <p className="text_title">[반품 및 환불 안내]</p>
                <p className="text_title">1.반품요청의 경우, 판매자가 반품한 상품에 대한 정보만 확인합니다.</p>
                <p className="text_title">
                  2.이후의 결제 취소 및 반품방법에 대해서는 판매자와 메시지 또는 유선으로 진행해주세요.
                </p>
                <p className="text_title">3.반품은 구매 시기 및 사유 등에 따라 불가처리될 수도 있습니다.</p>
                <span className="blue">* IBK는 판매 및 결제에 대해 직접 관여하지 않습니다.</span>
              </div>
            </div>
            <div className="button_wrap">
              <Button className="btn linear_blue" onClick={() => onClickButton('CANCEL')}>
                취소
              </Button>
              {returnData?.ordnSttsId != 'ODS00006' && returnData?.ordnSttsId != 'ODS00007' && ( //반품 완료, 반품 불가에선 요청버튼 안보임
                <Button className="btn full_blue" onClick={() => onClickButton('REQUEST')}>
                  요청하기
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReturnRequest
