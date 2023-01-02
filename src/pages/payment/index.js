import { useState, useEffect, useContext, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'modules/contexts/common/userContext'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import BreadCrumbs from 'components/BreadCrumbs'
import PayProduct from 'pages/payment/PayProduct'
import PayEstt from 'pages/payment/PayEstt'
import PayNone from 'pages/payment/PayNone'

const index = (props) => {

  const userContext = useContext(UserContext)
  const location = useLocation()
  const data = location?.state
  const [payScreen, setPayScreen] = useState(true)
  const [payData, setPayData] = useState({})
  const screenList = {
    ESTM: <PayEstt data={payData} />, //견적결제
    BASKET: <PayProduct payType={data?.type} data={payData} setPayData={setPayData} axiosData={data?.data} />, //장바구니결제
    PRODUCT: <PayProduct payType={data?.type} data={payData} setPayData={setPayData} axiosData={data?.data} /> //상품상세결제
  }

  const postPayEsttData = useCallback(async () => {
    await Axios({
      url: API.ORDER.PAY_ESTIMATION,
      method: 'post',
      data: { ...data?.data }
    }).then((response) => {
      if (response?.data?.code === '200') setPayData(response.data.data)
      else setPayScreen(false)
    })
  }, [data])

  const postPayPdfData = useCallback(async () => {
    await Axios({
      url: API.ORDER.PAY_PRODUCT,
      method: 'post',
      data: { ...data?.data, addr: '' }
    }).then((response) => {
      if (response?.data?.code === '200') setPayData(response.data.data)
      else setPayScreen(false)
    })
  }, [data])

  useEffect(() => {
    data?.type === 'ESTM' && postPayEsttData() //견적 결제
    data?.type === 'BASKET' && postPayPdfData() //장바구니 결제
    data?.type === 'PRODUCT' && postPayPdfData() //장바구니 결제
  }, [data])

  return (
    <>
      <div className="mypage product each_write ask_detail">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">결제하기</h2>
            </div>
          </div>
        </div>
        {payScreen ? screenList?.[data?.type] : <PayNone />}
      </div>
    </>
  )
}

export default index
