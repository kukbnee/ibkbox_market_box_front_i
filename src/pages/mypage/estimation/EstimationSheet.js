import { useState, useEffect, useContext, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from 'modules/contexts/common/userContext'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import EstimateProductItem from 'components/mypage/qnaUser/estimate/EstimateProductItem'
import EsimationSheetDeliveryCargo from 'components/mypage/estimation/EsimationSheetDeliveryCargo'
import EsimationSheetDeliveryFee from 'components/mypage/estimation/EsimationSheetDeliveryFee'
import EsimationSheetDeliveryVisit from 'components/mypage/estimation/EsimationSheetDeliveryVisit'

const EstimationSheet = (props) => {

  const userContext = useContext(UserContext)
  const history = useHistory()
  const { data, handlePopup } = props
  const [pdfList, setPdfList] = useState([])
  const [viewer, setViewer] = useState('buyer')
  const [popupAlert, setPopupAlert] = useState({ active: false, type: 'ALERT', msg: '', btnMsg: '확인' })
  const deliveryFeeType = {
    GDS02001: <EsimationSheetDeliveryCargo data={data} />,
    GDS02002: <EsimationSheetDeliveryFee data={data} />,
    GDS02003: <EsimationSheetDeliveryFee data={data} />,
    GDS02004: <EsimationSheetDeliveryVisit data={data} />,
  }
  const funcButtonList = {
    seller: <Button className="full_peach btn" onClick={() => setPopupAlert({ active: true, type: 'CANCEL', msg: '견적을 취소하시겠습니까?\n취소한 견적은 되돌릴 수 없습니다.', btnMsg: '견적취소' })}>
              견적취소
            </Button>,
    buyer: <Button className="full_blue btn" onClick={() => handleLinkPay()}>결제하기</Button>
  }
  const sheetTextList = {
    title: {
      ESS02001: '',
      ESS02002: '',
      ESS02003: '(취소)',
      ESS02004: '(취소)'
    },
    commonSend: {
      ESS02001: '위와 같이 견적을 발송합니다.',
      ESS02002: '위와 같이 견적을 발송합니다.',
      ESS02003: '위 견적이 취소되었습니다.',
      ESS02004: '위 견적이 취소되었습니다.'
    }
  }

  const handleLinkPay = useCallback(() => {
    history.push({
      pathname: `${PathConstants.PAYMENT}`,
      state: { type: 'ESTM', data: { esttInfoId: data?.esttInfoId } }
    })
  }, [data])



  const handlePopupAlert = useCallback((type) => {
    if(type === 'btnMsg' && popupAlert?.type === 'CANCEL') {
      postEstimationCancel()
    } else if(type === 'btnMsg' && popupAlert?.type === 'ALERT') {
      handlePopup('refresh')
      setPopupAlert({ ...popupAlert, active: false, type: 'ALERT', msg: '' })
    } else {
      setPopupAlert({ ...popupAlert, active: false, type: 'ALERT', msg: '' })
    }
  }, [popupAlert])


  const postEstimationCancel = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_CANCEL,
      method: 'post',
      data: {esttInfoId: data?.esttInfoId}
    }).then((response) => {
      if(response?.data?.code === '200' && response?.data?.data?.resultStr != null) {
        setPopupAlert({ active: true, type: 'ALERT', msg: '견적이 취소되었습니다.', btnMsg: '확인' })
      }
    })
  }, [data])


  useEffect(() => {
    setPdfList(data?.items)
    if((userContext?.state?.userInfo?.utlinsttId === data?.dpmpUsisId)) setViewer('seller')
  }, [data])

  return (
    <>
      <div className="popup_wrap popup_bargain_register estimate estimateItem type02 type04">
        <div className="layer">&nbsp;</div>
        <div className="container scroll">
          <div className="popup_header">
            <h3 className="popup_title">견적서{sheetTextList?.title?.[data?.pcsnSttsId]}</h3>
            <BtnClose onClick={handlePopup} />
          </div>
          <div className="estimate_content">
            <div className="sub_header">
              <p className="title">견적내역</p>
            </div>
            <div className="estimate_responsive_wrap">
              <div className="table_wrap">
                <div className="table_inner">
                  <div className="cell_wrap cell_tr">
                    <div className="cell num">NO</div>
                    <div className="cell name">상품명</div>
                    <div className="cell unitprice">단가(원)</div>
                    <div className="cell quantity">주문수량</div>
                    <div className="cell unit">단위</div>
                    <div className="cell money">금액(원)</div>
                  </div>
                  {pdfList?.length > 0 
                    ? pdfList.map((item, index) => (
                        <EstimateProductItem  
                          key={index}
                          type={'sheet'}
                          index={index}
                          isNarrow={false}
                          item={item} />
                    ))
                    : null
                  }
                </div>
              </div>
            </div>
            <div className="sub_header type02 type04">
              <p className="title">배송비 입력</p>
            </div>
            {deliveryFeeType?.[data?.dvryPtrnId]}
            <div className="delivery_result">
              <p className="deli_price">배송비 : {data?.dvrynone != null ? parseInt(data.dvrynone).toLocaleString() : 0 } 원</p>
              <div className="deli_subprice">
                <p className="price01">결제 금액 : {data?.pdfSum ? parseInt(data.pdfSum).toLocaleString() : 0}원(견적 총액) + {data?.dvrynone ? parseInt(data.dvrynone).toLocaleString() : 0 }(배송비)</p>
                <p className="price02">총 : {data?.pdfSum && data?.dvrynone != null ? Math.floor(parseInt(data.pdfSum)+parseInt(data.dvrynone)).toLocaleString() : 0} 원</p>
              </div>
            </div>
            <div className="stamp_wrap">
              <div className="text_wrap">
                <p className="text01">{sheetTextList?.commonSend?.[data?.pcsnSttsId]}</p>
                <p className="text01">{data?.bplcNm}</p>
              </div>
              <div className="stamp_img">
                <div className="img_wrap">
                  {data?.rgslImgFileUrl && <img src={data.rgslImgFileUrl} alt={data.bplcNm} />}
                </div>
              </div>
            </div>
            <div className="button_wrap">
              <Button className="linear_blue btn" onClick={handlePopup}>닫기</Button>
              {data?.pcsnSttsId === 'ESS02001' && funcButtonList?.[viewer]}
            </div>
            <p className="etc_text">*IBK는 결제 및 판매에 직접 관여하지 않으며, 책임은 각 판매업체에 있습니다.</p>
          </div>
        </div>
      </div>
      {popupAlert?.active && <PopupAlert className={'popup_review_warning'} msg={popupAlert?.msg} btnMsg={popupAlert?.btnMsg} handlePopup={(type) => handlePopupAlert(type)} />}
    </>
  )
}

export default EstimationSheet
