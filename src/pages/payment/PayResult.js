import { useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import ResultOrderInfo from 'components/payment/ResultOrderInfo'
import ResultDeliveryInfo from 'components/payment/ResultDeliveryInfo'
import ResultProductInfo from 'components/payment/ResultProductInfo'
import ResultPaymentInfo from 'components/payment/ResultPaymentInfo'
import PopupAlert from 'components/PopupAlert'

const PayResult = (props) => {

  const history = useHistory();
  const { id } = useParams()
  const [orderDetail, setOrderDetail] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [popupAlert, setPopupAlert] = useState(false)

  const handlesLink = (link) => { //페이지 이동 : 메인, 구매내역
    history.push(link)
  }

  const handlePopupAlert = useCallback(() => { //api 오류 발생 팝업 버튼 누르면 메인으로 이동
    setPopupAlert(false)
    handlesLink(PathConstants.MAIN)
  }, [popupAlert])

  const getPayProductOrder = useCallback(async () => { //결제정보
    setIsLoading(true)
    await Axios({
      url: API.ORDER.PAY_PRODUCT_ORDER_DETAIL,
      method: 'get',
      params: { ordnInfoId: id }
    }).then(response => {
      if (response?.data.code === '200') {
        setOrderDetail(response?.data?.data)
      } else {
        setPopupAlert(true)
      }
      setIsLoading(false)
    })
  }, [id, popupAlert])

  useEffect(() => {
    getPayProductOrder()
  }, [id])

  return (
    <>
      {popupAlert && (
        <PopupAlert
          handlePopup={handlePopupAlert}
          className={'popup_review_warning'}
          msg={'오류가 발생하여 메인페이지로 이동합니다.'}
          btnMsg={'확인'}
        />
      )}
      <div className="mypage product each_write ask_detail paydetail">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="payment_complete_box">
            <p className="text">결제가 완료되었습니다.</p>
          </div>
          <ResultOrderInfo data={orderDetail} cpnType={'buyer'} />
          <ResultDeliveryInfo data={orderDetail} />
          <ResultProductInfo data={orderDetail} cpnType={'result'} isLoading={isLoading} />
          <ResultPaymentInfo data={orderDetail} />
          <div className="payment_button">
            <Button className="btn linear_blue" onClick={() => handlesLink(PathConstants.MAIN)}>홈화면으로 이동</Button>
            <Button className="btn full_blue" onClick={() => handlesLink(`${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/buySell`)}>구매 내역으로 이동</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PayResult
