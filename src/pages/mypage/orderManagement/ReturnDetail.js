import { useCallback, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'
import PopupAlert from 'components/PopupAlert'
import ReturnDetailItem from 'components/mypage/orderManagement/Return/ReturnDetailItem'

const ReturnDetail = (props) => {

  const history = useHistory()
  const { id, infoSqn, type } = useParams()
  const [returnData, setReturnData] = useState({})
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    type: null,
    msg: ''
  })
  const sttsLabel = {
    ODS00005: <span className="orange">반품요청</span>,
    ODS00006: <span className="peach">반품불가</span>,
    ODS00007: <span className="orange">반품완료</span>
  }

  const handleLinkList = useCallback(() => { //목록으로 이동
    history.push({ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/return` })
  }, [])

  const handleButton = useCallback((type) => { //반품불가, 반품완료 버튼 클릭
    setPopupAlert({ ...popupAlert, active: true, type: type })
  }, [popupAlert])

  const handlePopupAlert = useCallback(() => { //팝업 닫기
    setPopupAlert({ ...popupAlert, active: false, type: null, msg: '' })
    if (popupAlert?.type === 'COMPLETE') getRetrunDetail() //완료팝업이면 정보 업데이트
    if (popupAlert?.type === 'NO_DATA') history.goBack() //접속 경로가 잘못되어 반품정보를 못 불러오면 페이지 back
  }, [popupAlert])

  const getRetrunDetail = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ORDER_RETURN_DETAIL,
      method: 'get',
      params: {
        ordnInfoId: id,
        infoSqn: infoSqn,
        returnType: type
      }
    }).then((response) => {
      if (response?.data?.code === '200') setReturnData(response?.data?.data) //반품정보
      else setPopupAlert({ ...popupAlert, active: true, type: 'NO_DATA', msg: '반품 정보를 불러올 수 없습니다.' })
    })
  }, [id, infoSqn, type])

  const postProductDetailQnaSave = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.PRODUCT_DETAIL_QNA_SAVE,
      method: 'post',
      data: { pdfInfoId: returnData.pdfInfoId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.push({ pathname: `${PathConstants.MY_PAGE_QNA_USER_VIEW}/${response.data.data}` })
      } else {
        setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', msg: '잠시 후 다시 시도해주세요.' })
      }
    })
  }, [returnData, popupAlert])

  const postOrderReturnReject = useCallback(async () => {
    await Axios({
      url: API.ORDER.MY_ORDER_RETURN_STATE_REJECT,
      method: 'post',
      params: {
        ordnInfoId: returnData?.ordnInfoId,
        infoSqn: returnData?.infoSqn,
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({ ...popupAlert, active: true, type: 'COMPLETE', msg: '반품불가 처리 되었습니다.' })
      } else {
        setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', msg: '잠시 후 다시 시도해주세요.' })
      }
    })
  }, [returnData, popupAlert])

  const postOrderReturnComplete = useCallback(async () => {
    await Axios({
      url: API.ORDER.MY_ORDER_RETURN_STATE_COMPLETE,
      method: 'post',
      params: {
        ordnInfoId: returnData?.ordnInfoId,
        infoSqn: returnData?.infoSqn,
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'COMPLETE',
          msg: '반품완료 처리되었습니다.\n환불을 진행해주세요.'
        })
      } else {
        setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', msg: '잠시 후 다시 시도해주세요.' })
      }
    })
  }, [returnData, popupAlert])

  useEffect(() => {
    getRetrunDetail()
  }, [id, infoSqn, type])

  return (
    <>
      <div className="mypage buy_sell return return02 buy_sell_return">
        {popupAlert?.active && popupAlert?.type === 'RE_REJECT' && ( //반품 불가처리 확인
          <PopupCustom className={'register_info_popup'} handlePopup={handlePopupAlert}>
            <div className="content">
              <div className="text">
                반품 불가처리 하시겠습니까?
                <br /> 반품 불가처리는 수정이 불가합니다.
                <br /> 구매자에게 충분한 설명 후 반품 불가 처리 부탁드립니다.
              </div>
            </div>
            <div className="btn_group">
              <Button className={'full_grey'} onClick={handlePopupAlert}>
                취소
              </Button>
              <Button className={'full_peach'} onClick={postOrderReturnReject}>
                반품불가
              </Button>
            </div>
          </PopupCustom>
        )}
        {popupAlert?.active && popupAlert?.type === 'RE_COMPLETE' && ( //반품 완료처리 확인
          <PopupCustom className={'register_info_popup'} handlePopup={handlePopupAlert}>
            <div className="content">
              <div className="text">
                반품 완료처리 전, 다음을 확인해보세요.
                <br />1. 구매자의 반품요청 상품을 수령함
                <br />2. 반품상품을 확인 후 환불을 진행함
                <br />* 반품 완료 처리는 수정이 불가합니다.
              </div>
            </div>
            <div className="btn_group">
              <Button className={'btn linear_blue'} onClick={handlePopupAlert}>
                취소
              </Button>
              <Button className={'btn full_blue'} onClick={postOrderReturnComplete}>
                반품완료
              </Button>
            </div>
          </PopupCustom>
        )}
        {popupAlert?.active && popupAlert?.type === 'ALERT' && (
          <PopupAlert
            handlePopup={handlePopupAlert}
            className={'popup_review_warning detail_mo_text'}
            msg={popupAlert?.msg}
            btnMsg={'확인'}
          />
        )}
        {popupAlert?.active && popupAlert?.type === 'COMPLETE' && ( //처리 완료 팝업
          <PopupAlert
            handlePopup={handlePopupAlert}
            className={'popup_review_warning detail_mo_text'}
            msg={popupAlert?.msg}
            btnMsg={'확인'}
          />
        )}
        {popupAlert?.active && popupAlert?.type === 'NO_DATA' && ( //데이터 못 불러올 때 PAGE BACK 시킬 팝업
          <PopupAlert
            handlePopup={handlePopupAlert}
            className={'popup_review_warning detail_mo_text'}
            msg={popupAlert?.msg}
            btnMsg={'확인'}
          />
        )}

        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">반품상세</h2>
            </div>
          </div>
          <div className="return_container return_request">
            <div className="card_layout">
              <div className="return_detail_info">
                <p className="title">반품 상품 정보</p>
                <div className="item_content_wrap">
                  <div className="text_wrap">
                    <p className="state">반품상태 : {sttsLabel?.[returnData?.ordnSttsId]}</p>
                  </div>
                  <div className="btn_wrap">
                    <Button className="btn full_blue" onClick={postProductDetailQnaSave}>
                      문의하기
                    </Button>
                  </div>
                </div>
              </div>
              <div className="table_list_wrap">
                <div className="table_header returndetail">
                  <div className="cell number">주문번호</div>
                  <div className="cell info">상품정보</div>
                  <div className="cell sale">판매가</div>
                  <div className="cell amount">주문수량</div>
                  <div className="cell delivery">배송</div>
                  <div className="cell price">총 주문금액</div>
                  <div className="cell company">
                    {type === 'buyer' && '판매사명'}
                    {type === 'selr' && '구매자명'}
                  </div>
                </div>
                <ul className="table_list">
                  <li className="table_list_item">
                    {returnData && <ReturnDetailItem data={returnData} returnType={type} />}
                  </li>
                </ul>
              </div>
            </div>
            <div className="card_layout bg_gray">
              <div className="return_refund_wrap">
                <p className="text_title">[반품 및 환불 안내]</p>
                <p className="text_title">
                  {`1. 반품요청의 경우, ${type === 'selr' ? '구매자' : '판매자'}가 반품한 상품에 대한 정보만 확인합니다.`}
                </p>
                <p className="text_title">
                  {`2. 이후의 결제 취소 및 반품방법에 대해서는 ${type === 'selr' ? '구매자' : '판매자'}와 메시지 또는 유선으로 진행해주세요.`}
                </p>
                {type === 'selr' ? (
                  <>
                    <p className="text_title">3. 반품완료 후에는 반품완료 처리를 해주세요.</p>
                    <p className="text_title">4. 구매자와 논의 후 반품불가인 경우, 반품불가 처리를 해주세요.</p>
                  </>
                ) : (
                  <p className="text_title">3. 반품은 구매 시기 및 사유 등에 따라 불가처리될 수도 있습니다.</p>
                )}
                <span className="blue">* IBK는 판매 및 결제에 대해 직접 관여하지 않습니다.</span>
              </div>
            </div>
            <div className="button_wrap">
              {type === 'selr' && returnData?.ordnSttsId === 'ODS00005' && (
                <>
                  <Button className="btn full_peach" onClick={() => handleButton('RE_REJECT')}>
                    뱐품불가
                  </Button>
                  <Button className="btn full_blue" onClick={() => handleButton('RE_COMPLETE')}>
                    반품완료
                  </Button>
                </>
              )}
              <Button className="btn full_blue" onClick={handleLinkList}>
                목록
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReturnDetail
