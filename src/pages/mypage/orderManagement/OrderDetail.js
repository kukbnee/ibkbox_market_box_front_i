import { useCallback, useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import ResultOrderInfo from 'components/payment/ResultOrderInfo'
import ResultDeliveryInfo from 'components/payment/ResultDeliveryInfo'
import ResultProductInfo from 'components/payment/ResultProductInfo'
import ResultPaymentInfo from 'components/payment/ResultPaymentInfo'
import PathConstants from 'modules/constants/PathConstants'
import PopupAlert from 'components/PopupAlert'
import { UserContext } from 'modules/contexts/common/userContext'

const OrderDetail = (props) => {

  const history = useHistory()
  const { id, type } = useParams() //id: ordnInfoId, type: selr/buyer/result
  const userContext = useContext(UserContext)
  const [detailInfo, setDetailInfo] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '' })

  const handlesLink = (link) => {
    if (link) history.push(link)
  }

  const callRefresh = useCallback(() => {
    getOrderDetail()
  }, [id])

  const handlePopupAlert = useCallback(() => {
    history.goBack()
  }, [popupAlert])

  const getOrderDetail = useCallback(async () => {
    setIsLoading(true)
    await Axios({
      url: API.ORDER.PAY_PRODUCT_ORDER_DETAIL,
      method: 'get',
      params: { ordnInfoId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {

        //구매자 전용 페이지에 접속한 유저가 구매자인지 체크
        if (type === 'buyer' && userContext?.state?.userInfo?.utlinsttId != response?.data?.data?.pucsUsisId) {
          setPopupAlert({ active: true, msg: '구매자만 구매 상세 내역을 볼 수 있습니다.' })
          return
        }

        //판매자 전용 페이지에 접속한 유저가 판매자인지 체크
        if (type === 'selr' && userContext?.state?.userInfo?.utlinsttId != response?.data?.data?.selrUsisId) {
          setPopupAlert({ active: true, msg: '판매자만 판매 상세 내역을 볼 수 있습니다.' })
          return
        }

        setDetailInfo(response?.data?.data) //주문정보
      }
      setIsLoading(false)
    })
  })


  useEffect(() => {
    if (userContext?.state?.userInfo?.utlinsttId) getOrderDetail()
  }, [id, userContext])


  return (
    <>
      {popupAlert?.active && ( //alert 팝업
        <PopupAlert
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={'확인'}
          handlePopup={handlePopupAlert}
        />
      )}

      <div className="mypage product each_write ask_detail paydetail buy sell order_detail buy_sell sell_list_wrap ">
        <div className="container">
          <BreadCrumbs {...props} />
          <ResultOrderInfo data={detailInfo} cpnType={type} />
          <ResultDeliveryInfo data={detailInfo} />
          <ResultProductInfo data={detailInfo} cpnType={type} isLoading={isLoading} callRefresh={callRefresh} />
          <ResultPaymentInfo data={detailInfo} />
          <div className="payment_button">
            <Button className="btn linear_blue" onClick={() => handlesLink(PathConstants.MAIN)}>
              홈화면으로 이동
            </Button>
            <Button className="btn full_blue" onClick={() => handlesLink(`${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/buySell`)}>
                {`${type === 'selr' ? `판매` : type === 'buyer' ? `구매` : `구매/판매`} 내역으로 이동`}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderDetail
