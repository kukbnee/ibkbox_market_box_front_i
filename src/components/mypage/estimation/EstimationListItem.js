import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import moment from 'moment'
import PathConstants from 'modules/constants/PathConstants'
import Button from 'components/atomic/Button'
import ProductInfo from 'components/mypage/estimation/ProductInfo'
import PopupAlert from 'components/PopupAlert'

const EstimationListItem = (props) => {

  const { data, index, params, totalEstm, paramsEstm, listType, setParamsEstm } = props
  const history = useHistory()
  const [paramsQna, setParamsQna] = useState({ pdfInfoId: null })
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '견적을 취소하시겠습니까?\n취소한 견적은 되돌릴 수 없습니다.', btnMsg: '견적 취소' })
  const [requesterInfo, setRequesterInfo] = useState({
    reqName: '',
    reqCoName: ''
  })
  const reqList = {
    sen: {reqName: data?.rcvrUserId, reqCoName: data?.rcvrBplcNm},
    rec: {reqName: data?.dpmpUserId, reqCoName: data?.bplcNm},
  }
  const buttonList = {
    sen: {
      ESS02001: <Button className="btn full_peach full" onClick={() => setPopupAlert({ ...popupAlert, active: !popupAlert.active })}>취소</Button>,
      ESS02002: null,
      ESS02003: null,
    },
    rec: {
      ESS02001: <Button className="btn full_blue full" onClick={() => handleLinkPay()}>결제</Button>,
      ESS02002: null,
      ESS02003: null,
    }
  }
  const itemStateList = {
    ESS02001: <p className="orange">대기</p>,
    ESS02002: <p className="blue">결제완료</p>,
    ESS02003: <p className="red">취소</p>,
    ODS00008: <p className="red">주문취소완료</p>
  }

  const handleQna = useCallback(() => {
    setParamsQna({ ...paramsQna, pdfInfoId: data?.gearPdfInfoId })
  }, [data])

  const handleEstimationDetail = useCallback(() =>{
    setParamsEstm({ ...paramsEstm, paramType:'detail', esttInfoId: data?.esttInfoId })
  }, [data])

  const handleLinkPay = useCallback(() => {
    history.push({
      pathname: PathConstants.PAYMENT,
      state: { type: 'ESTM', data:{esttInfoId: data?.esttInfoId} }
    })
  }, [data])

  const handlePopup = (type) => {
    if(type === 'btnMsg') setParamsEstm({ ...paramsEstm, paramType:'cancel', esttInfoId: data?.esttInfoId })
    setPopupAlert({ ...popupAlert, active: !popupAlert.active })
  }


  const postProductDetailQnaSave = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.PRODUCT_DETAIL_QNA_SAVE,
      method: 'post',
      data: paramsQna
    }).then((response) => {
      if(response?.data?.code === '200') {
        history.push({pathname: `${PathConstants.MY_PAGE_QNA_USER_VIEW}/${response.data.data}`, state: {inqrInfoId: response.data.data}})
      }
    })
  }, [paramsQna])


  useEffect(() => {
    setRequesterInfo(reqList?.[listType])
  }, [data])

  useEffect(() => {
    if(paramsQna?.pdfInfoId != null) postProductDetailQnaSave()
  }, [paramsQna])
  

  return (
    <>
      <div className="item_section req_each_item"> 
      {popupAlert?.active && <PopupAlert className={'popup_review_warning'} title={'견적취소'} msg={popupAlert?.msg} btnMsg={popupAlert?.btnMsg} handlePopup={(type) => handlePopup(type)} />}
        <div className="cell cell_num">{totalEstm - ((params?.page - 1) * params?.record) - index}</div>
        <ProductInfo
          type={'ESTIMATION'}
          classCell={"cell cell_info estiinfo"}
          classWrap={"content_wrap estiitem"}
          classPrcWrap={"flex_row_wrap resp"}
          textColor={"#333139"}
          data={data}
          category={data?.tms4ClsfNm}
          pdfState={data?.pcsnSttsId}
        />
        <div className="cell cell_target" style={{textAlign: 'center'}}>
          <div className="flex_row_wrap">
            <p className="req_name">{requesterInfo?.reqCoName}</p>
            <p className="req_com">{requesterInfo?.reqName}</p>
            <Button className="linear_grey btn" onClick={handleQna}>문의하기</Button>
          </div>
        </div>
        <div className="cell cell_day">
          <div className="day_row_wrap">
            <p>{moment(data?.rgsnTsStr).format('YYYY-MM-DD')}</p>
            <Button className="linear_grey btn" onClick={handleEstimationDetail}>견적보기</Button>
          </div>
        </div>
        <div className="cell cell_state estiitem">
        {data?.pcsnSttsId === 'ESS02002' && data?.ordnSttsId === 'ODS00008' ? ( //견적결제완료 + 주문취소완료
          itemStateList?.['ODS00008']
        ) : (
          itemStateList?.[data?.pcsnSttsId]
        )}
          {buttonList?.[listType]?.[data?.pcsnSttsId]}
        </div>
      </div>
    </>
  )
}

export default EstimationListItem
