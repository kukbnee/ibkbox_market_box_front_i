import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import Button from 'components/atomic/Button'
import Badge from 'components/atomic/Badge'
import SttsLabelDelivery from 'components/mypage/orderManagement/BuySell/BuyStatusLabel/SttsLabelDelivery'
import SttsLabelEnable from 'components/mypage/orderManagement/BuySell/BuyStatusLabel/SttsLabelEnable'
import SttsLabelDisable from 'components/mypage/orderManagement/BuySell/BuyStatusLabel/SttsLabelDisable'
import SttsButtonOrder from 'components/mypage/orderManagement/BuySell/BuySttsButton/SttsButtonOrder'
import SttsButtonDeliveryOn from 'components/mypage/orderManagement/BuySell/BuySttsButton/SttsButtonDeliveryOn'
import SttsButtonDeliveryFinish from 'components/mypage/orderManagement/BuySell/BuySttsButton/SttsButtonDeliveryFinish'
import SttsButtonReturn from 'components/mypage/orderManagement/BuySell/BuySttsButton/SttsButtonReturn'
import { addComma } from 'modules/utils/Common'
import moment from "moment";

const BuyItem = (props) => {

  const history = useHistory()
  const { data, popupAlert, setPopupAlert, setParamsRecv } = props
  const orderSttsList = {
    ODS00001: <SttsLabelEnable data={data} />, //주문완료
    ODS00002: <SttsLabelDisable data={data} />, //주문취소(승인)
    ODS00003: <SttsLabelDelivery data={data} handleButton={(type) => handleButton(type)} />, //배송중
    ODS00004: <SttsLabelDelivery data={data} handleButton={(type) => handleButton(type)} />, //배송완료
    ODS00005: <SttsLabelEnable data={data} />, //반품요청
    ODS00006: <SttsLabelDisable data={data} />, //반품불가
    ODS00007: <SttsLabelEnable data={data} />, //반품완료
    ODS00008: <SttsLabelDisable data={data} /> //주문취소(완료)
  }
  const orderBtnList = {
    ODS00001: <SttsButtonOrder data={data} handleButton={(type) => handleButton(type)} />, //주문 완료
    ODS00002: <SttsButtonOrder data={data} handleButton={(type) => handleButton(type)} />, //주문취소(승인)
    ODS00003: <SttsButtonDeliveryOn data={data} handleButton={(type) => handleButton(type)} />, //배송중
    ODS00004: <SttsButtonDeliveryFinish pdfInfoId={data?.pdfInfoId} isReviewed={data?.isReviewed} handleButton={(type) => handleButton(type)} />, //배송완료
    ODS00005: <SttsButtonReturn handleButton={(type) => handleButton(type)} />, //반품요청
    ODS00006: <SttsButtonReturn handleButton={(type) => handleButton(type)} />, //반품
    ODS00007: <SttsButtonReturn handleButton={(type) => handleButton(type)} />, //반품완료
    ODS00008: <div />, //주문취소(완료)
  }

  const handleLinkProductDetail = useCallback(() => { //상품 상세로 이동
    if (data?.pdfInfoId) history.push(`${PathConstants.PRODUCT_DETAIL}/${data.pdfInfoId}`)
  }, [data])

  const handleLinkReview = useCallback(() => { //리뷰 작성 페이지로 이동
    history.push({
      pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_BUY_REVIEW}`,
      state: {
        pdfInfoId: data?.pdfInfoId,
        rgsnTs: data?.rgsnTs ? moment(data?.rgsnTs).format('YYYY-MM-DD') : '-',
        qty: data?.qty,
        ttalAmt: data?.ttalAmt,
        ordnInfoId: data?.ordnInfoId,
      }
    })
  }, [data])

  const handleLinkReturnDetail = useCallback(() => { //반품 상세로 이동
    history.push({ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL}/${data?.ordnInfoId}&${data?.infoSqn}&buyer` })
  }, [data])

  const handleLinkReturnRequest = useCallback(() => { //반품 요청으로 이동
    history.push({
      pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_REQUEST}/${data?.ordnInfoId}`,
      state: {
        ordnInfoId: data?.ordnInfoId,
        infoSqn: data?.infoSqn,
        returnType: 'buyer'
      }
    })
  }, [data])

  const handleCopyInvoice = useCallback(() => { //운송장번호 복사
    if (data?.mainnbNo === null) return
    navigator.clipboard.writeText(data?.mainnbNo)
    setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', class: 'popup_review_warning', msg: '운송장번호가 복사되었습니다.' })
  }, [popupAlert, data])

  const handleButton = useCallback((type) => {
    switch (type) {
      case 'address': //주소 확인
        setPopupAlert({ ...popupAlert, active: true, type: 'ADDRESS', class: 'estimate_cancel_popup address_confirm_popup', title: '주소확인', msg: `(${data?.recvZpcd}) ${data?.recvAdr} ${data?.recvDtad}` })
        break
      case 'tracking': //배송조회
        if(data?.mainnbNoUrl) window.open(data.mainnbNoUrl)
        break
      case 'review': //리뷰작성
        handleLinkReview()
        break
      case 'receive': //수령완료
        setPopupAlert({ ...popupAlert, active: true, type: 'RECV', class: 'popup_review_warning', msg: '실제 상품을 받으셨을 경우에만,\n수령확인 버튼을 눌러주세요.\n배송완료처리가 됩니다.', btnMsg: '수령확인' })
        setParamsRecv({ ordnInfoId: data?.ordnInfoId, ordnPdfInfoSqn: data?.infoSqn })
        break
      case 're_request': //반품요청
        handleLinkReturnRequest()
        break
      case 're_detail': //반품상세
        handleLinkReturnDetail()
        break
      case 'copy_invoice': //운송장번호 복사
        handleCopyInvoice()
        break
    }
  }, [data, popupAlert])


  const postProductDetailQnaSave = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.PRODUCT_DETAIL_QNA_SAVE,
      method: 'post',
      data: { pdfInfoId: data?.pdfInfoId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.push({
          pathname: `${PathConstants.MY_PAGE_QNA_USER_VIEW}/${response.data.data}`,
          state: {
            inqrInfoId: response.data.data
          }
        })
      } else if (response?.data?.code === '400' && response?.data?.message != null) {
        setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', class: 'popup_review_warning', msg: response.data.message })
      } else {
        setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', class: 'popup_review_warning', msg: '잠시 후 다시 시도해주세요.' })
      }
    })
  }, [data, popupAlert])


  return (
    <>
      {/* version pc */}
      <div className="buy_item_wrap pc_version">
        <div className="buy_item">
          <div className={data?.pdfInfoId ? "img_wrap" : "img_wrap cursor_none"} onClick={handleLinkProductDetail}>
            {data?.pdfInfoId ? (
              data?.imgUrl && (<img src={`${data?.imgUrl}`} alt={data?.pdfNm} />)
            ) : (
              <img src={require('assets/images/img_direct_input.png').default} alt={'d_input'} style={{objectFit: 'none'}} />
            )}
          </div>
          <div className="buy_item_container">
            <div className="content">
              {data?.agenInfId && (
                <div className="badge_wrap">
                  <Badge className="badge full_blue">에이전시</Badge>
                </div>
              )}
              <p className={data?.pdfInfoId ? "name" : "name cursor_none"} onClick={handleLinkProductDetail}>{data?.pdfNm}</p>
            </div>
            <div className="price_info">
              <p className="price">{Number(data?.ttalAmt) + Number(data?.dvrynone) > 0 ? addComma(Number(data?.ttalAmt) + Number(data?.dvrynone)) : 0} 원</p>
            </div>
            <div className="company_info">
              <p className="company">{data?.selrUsisNm}</p>
              <Button className={'btn_query linear_grey'} onClick={postProductDetailQnaSave}>문의하기</Button>
            </div>
            <div className="status_info">
              {orderSttsList?.[data?.ordnSttsId]}
            </div>
            <div className="btn_group">
              {orderBtnList?.[data?.ordnSttsId]}
            </div>
          </div>
        </div>
      </div>

      {/* version mobile */}
      <div className="buy_item_wrap mobile_version">
        <div className="buy_item">
          <div className="company_info">
            <p className="company">{data?.selrUsisNm}</p>
            <Button className={'btn_query linear_grey'} onClick={postProductDetailQnaSave}>문의하기</Button>
          </div>
          <div className="buy_item_container">
            <div className="content_wrap">
              <div className={data?.pdfInfoId ? "img_wrap" : "img_wrap cursor_none"} onClick={handleLinkProductDetail}>
                {data?.pdfInfoId ? (
                  data?.imgUrl && (<img src={`${data?.imgUrl}`} alt={data?.pdfNm} />)
                ) : (
                  <img src={require('assets/images/img_direct_input.png').default} alt={'d_input'} style={{objectFit: 'none'}} />
                )}
              </div>
              <div className="content">
                <div className="badge_status_wrap">
                  {data?.agenInfId && (
                    <div className="badge_wrap">
                      <Badge className="badge full_blue">에이전시</Badge>
                    </div>
                  )}
                  <div className="status_info">
                    {orderSttsList?.[data?.ordnSttsId]}
                  </div>
                </div>
                <p className={data?.pdfInfoId ? "name" : "name cursor_none"} onClick={handleLinkProductDetail}>{data?.pdfNm}</p>
                <div className="price_info">
                  <p className="price">{Number(data?.ttalAmt) + Number(data?.dvrynone) > 0 ? addComma(Number(data?.ttalAmt) + Number(data?.dvrynone)) : 0} 원</p>
                </div>
              </div>
            </div>
            <div className="btn_group">
              {orderBtnList?.[data?.ordnSttsId]}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BuyItem
