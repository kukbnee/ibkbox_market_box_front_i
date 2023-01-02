import { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Badge from 'components/atomic/Badge'
import SttsLabelCargo from 'components/mypage/orderManagement/BuySell/SellStatusLabel/SttsLabelCargo'
import SttsLabelDirect from 'components/mypage/orderManagement/BuySell/SellStatusLabel/SttsLabelDirect'
import SttsLabelFree from 'components/mypage/orderManagement/BuySell/SellStatusLabel/SttsLabelFree'
import SttsLabelVisit from 'components/mypage/orderManagement/BuySell/SellStatusLabel/SttsLabelVisit'
import SttsButtonOrder from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonOrder'
import SttsButtonCancel from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonCancel'
import SttsButtonDeliveryOn from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonDeliveryOn'
import SttsButtonDeliveryFinish from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonDeliveryFinish'
import SttsButtonReturn from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonReturn'
import SttsButtonOrderRequest from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonOrderRequest'
import { addComma } from 'modules/utils/Common'
import EstimationSheet from 'pages/mypage/estimation/EstimationSheet'

const SellItem = (props) => {

  const { type, data, popupAlert, popupDvry, paramsDvry, setPopupAlert, setPopupDvry, setParamsDvry } = props
  const history = useHistory()
  const [estmSheet, setEstmSheet] = useState({ active: false, data: null })

  const dvrySttsList = { //배송타입별 상태 ui
    GDS02001: <SttsLabelCargo data={data} />, //화물서비스
    GDS02002: <SttsLabelDirect data={data} />, //직접배송
    GDS02003: <SttsLabelFree />, //무료배송
    GDS02004: <SttsLabelVisit /> //구매자 직접 수령
  }
  const dvryBtnList = {
    ODS00001: <SttsButtonOrder ordnSttsId={'ODS00001'} dvryPtrnId={data?.dvryPtrnId} handleButton={(type) => handleButton(type)} />, //주문완료
    ODS00002: <SttsButtonCancel ordnSttsId={'ODS00002'} date={null} />, //주문취소(승인)
    ODS00003: <SttsButtonDeliveryOn data={data} handleButton={(type) => handleButton(type)} />, //배송중
    ODS00004: <SttsButtonDeliveryFinish data={data} handleButton={(type) => handleButton(type)} />, //배송완료
    ODS00005: <SttsButtonReturn ordnSttsId={'ODS00005'} handleButton={(type) => handleButton(type)} />, //반품요청
    ODS00006: <SttsButtonReturn ordnSttsId={'ODS00006'} handleButton={(type) => handleButton(type)} />, //반품불가
    ODS00007: <SttsButtonReturn ordnSttsId={'ODS00007'} handleButton={(type) => handleButton(type)} />, //반품완료
    ODS00008: <SttsButtonCancel ordnSttsId={'ODS00008'} date={data?.amnnTs} />, //주문취소(완료)
  }

  const handleCopyInvoice = useCallback(() => {
    if (data?.mainnbNo === null) return
    navigator.clipboard.writeText(data?.mainnbNo)
    setPopupAlert({ ...popupAlert, active: true, type: 'alert', class: 'popup_review_warning', msg: '운송장번호가 복사되었습니다.' })
  }, [popupAlert, data])

  const handleLinkReturnDetail = useCallback(() => {
    history.push({ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL}/${data?.ordnInfoId}&${data?.infoSqn}&selr` })
  }, [data])

  const handleButton = useCallback((type) => {
    switch (type) {
      case 'address': //주소확인
        setPopupAlert({ ...popupAlert, active: true, type: 'address', class: 'estimate_cancel_popup address_confirm_popup', title: '주소확인', msg: `(${data?.recvZpcd}) ${data?.recvAdr} ${data?.recvDtad}` })
        break
      case 'tracking': //배송조회
        if(data?.mainnbNoUrl) window.open(data.mainnbNoUrl)
        break
      case 'dvryInfo': //운송장번호입력, 화물서비스 업체 선택
        setPopupDvry({ active: true, type: 'dvryInfo' })
        setParamsDvry({
          ...paramsDvry,
          ordnInfoId: data?.ordnInfoId,
          ordnPdfInfoSqn: data?.infoSqn,
          pdfInfoId: data?.pdfInfoId
        })
        break
      case 'copy_invoice': //운송장번호 복사
        handleCopyInvoice()
        break
      case 're_detail': //반품상세
        handleLinkReturnDetail()
        break
    }
  }, [data, paramsDvry, popupAlert, popupDvry])

  const handleSheet = useCallback(() => {
    setEstmSheet({ active: false, data: null })
  })

  const handleShowEstimation = useCallback(async () => { //견적서 보기
    if (data?.esttInfoId === null || data?.esttInfoId === undefined) {
      setPopupAlert({ ...popupAlert, active: true, type: 'alert', class: 'popup_review_warning', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
      return
    }

    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_DETAIL,
      method: 'get',
      params: { esttInfoId: data?.esttInfoId }
    }).then((response) => {
      if (response?.data?.code === '200') setEstmSheet({ active: !estmSheet.active, data: response.data.data })
      else setPopupAlert({ ...popupAlert, active: true, type: 'alert', class: 'popup_review_warning', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
    })
  }, [data])

  //화물서비스 주문인경우에 운송장번호가 없는 주문에 대해서 판매자가 직접 운임요청을 보낼수 있도록
  const orderDvryRequest = useCallback(async() => {
    return await Axios({
      url: API.ORDER.MY_ORDER_PRODUCT_DVRY_REQUEST,
      method: 'post',
      data: { ordnInfoId : data?.ordnInfoId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({ ...popupAlert, active: true, type: 'alert', class: 'popup_review_warning', msg: '선택한 화물서비스에 운송의뢰가 성공하였습니다. \n배송비 결제는 기사님이 도착했을때 현장결제 진행해주세요. ' })
      }else{
        setPopupAlert({ ...popupAlert, active: true, type: 'alert', class: 'popup_review_warning', msg: '선택한 화물서비스에 운송의뢰가 실패하였습니다. \n페이지를 새로고침한 후 배송요청버튼을 다시 눌러주세요. \n계속 실패한 경우, 관리자문의로 문의바랍니다. ' })
      }
    })
  },[])

  return (
    <>
      {/* 견적서 보기 */}
      {estmSheet?.active && <EstimationSheet data={estmSheet?.data} handlePopup={(type) => handleSheet(type)} />}

      {type === 'pc' && (
        <>
          <td className="cell cell_value product">
            <div className="inner_wrap">
              {data?.agenInfId &&
                <div className="badge_wrap">
                  <Badge className="badge full_blue">에이전시</Badge>
                </div>
              }
              <p className="product_name">{data?.pdfNm}</p>
            </div>
          </td>
          <td className="cell cell_value delivery_type">
            <div className="inner_wrap">
              {dvrySttsList?.[data?.dvryPtrnId]}
            </div>
          </td>
          <td className="cell cell_value payment_amount">
            <div className="inner_wrap">
              <p className="price">{Number(data?.ttalAmt) + Number(data?.dvrynone) > 0 ? addComma(Number(data?.ttalAmt) + Number(data?.dvrynone)) : 0}원</p>
            </div>
          </td>
          <td className="cell cell_value buyer_name">
            <div className="inner_wrap">
              <p className="buyer_company">{data?.pucsUsisNm}</p>
              <p className="ceo">{data?.pucsNm}</p>
            </div>
          </td>
          <td className="cell cell_value estimate">
            <div className="inner_wrap">
              {data?.ordnPtrnId === 'GDS03004'
                ? <p className="estimate_view" onClick={handleShowEstimation}>견적보기</p>
                : <p className="estimate_none">X</p>
              }
            </div>
          </td>
          <td className="cell cell_value status status_info">
            <div className="inner_wrap">
              {dvryBtnList?.[data?.ordnSttsId]}

              {
                data?.dvryPtrnId == 'GDS02001' && data?.ordnSttsId == 'ODS00001' && (data?.mainnbNo == "" || data?.mainnbNo == null) ?
                 <SttsButtonOrderRequest handleButton={() => orderDvryRequest()}/>
                :
                <></>
              }

            </div>
          </td>
        </>
      )}

      {type === 'mo' && (
        <>
          <div className="prod_item">
            <div className="resp_table">
              <div className="resp_name">상품명</div>
              <div className="resp_content">
                <div className="inner_wrap">
                  {data?.agenInfId &&
                    <div className="badge_wrap">
                      <Badge className="badge full_blue">에이전시</Badge>
                    </div>
                  }
                  <p className="product_name">{data?.pdfNm}</p>
                </div>
              </div>
            </div>
            <div className="resp_table">
              <div className="resp_name">배송유형</div>
              <div className="resp_content delivery_type">
                <div className="inner_wrap">
                  {dvrySttsList?.[data?.dvryPtrnId]}
                </div>
              </div>
            </div>
            <div className="resp_table">
              <div className="resp_name">총 결제금액</div>
              <div className="resp_content payment_amount">
                <div className="inner_wrap">
                  <p className="price">{Number(data?.ttalAmt) + Number(data?.dvrynone) > 0 ? addComma(Number(data?.ttalAmt) + Number(data?.dvrynone)) : 0}원</p>
                </div>
              </div>
            </div>
            <div className="resp_table">
              <div className="resp_name">구매자명</div>
              <div className="resp_content buyer_name">
                <div className="inner_wrap">
                  <p className="buyer_company">{data?.pucsUsisNm}</p>
                  <p className="ceo">{data?.pucsNm}</p>
                </div>
              </div>
            </div>
            <div className="resp_table">
              <div className="resp_name">견적</div>
              <div className="resp_content estimate">
                <div className="inner_wrap">
                  {data?.ordnPtrnId === 'GDS03004'
                    ? <p className="estimate_view" onClick={handleShowEstimation}>견적보기</p>
                    : <p className="estimate_none">X</p>
                  }
                </div>
              </div>
            </div>
            <div className="resp_table">
              <div className="resp_name">상태</div>
              <div className="resp_content status status_info">
                <div className="inner_wrap">
                  <div className="status_detail_wrap">
                    {dvryBtnList?.[data?.ordnSttsId]}

                    {
                      data?.dvryPtrnId == 'GDS02001' && data?.ordnSttsId == 'ODS00001' && (data?.mainnbNo == "" || data?.mainnbNo == null) ?
                          <SttsButtonOrderRequest handleButton={() => orderDvryRequest()}/>
                          :
                          <></>
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default SellItem
