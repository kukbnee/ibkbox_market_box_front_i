import { useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import Badge from 'components/atomic/Badge'
import SttsLabelDelivery from 'components/mypage/orderManagement/BuySell/BuyStatusLabel/SttsLabelDelivery'
import SttsLabelEnable from 'components/mypage/orderManagement/BuySell/BuyStatusLabel/SttsLabelEnable'
import SttsLabelDisable from 'components/mypage/orderManagement/BuySell/BuyStatusLabel/SttsLabelDisable'
import BuySttsButtonOrder from 'components/mypage/orderManagement/BuySell/BuySttsButton/SttsButtonOrder'
import BuySttsButtonDeliveryOn from 'components/mypage/orderManagement/BuySell/BuySttsButton/SttsButtonDeliveryOn'
import BuySttsButtonDeliveryFinish from 'components/mypage/orderManagement/BuySell/BuySttsButton/SttsButtonDeliveryFinish'
import BuySttsButtonReturn from 'components/mypage/orderManagement/BuySell/BuySttsButton/SttsButtonReturn'
import SellSttsButtonOrder from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonOrder'
import SellSttsButtonCancel from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonCancel'
import SellSttsButtonDeliveryOn from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonDeliveryOn'
import SellSttsButtonDeliveryFinish from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonDeliveryFinish'
import SellSttsButtonReturn from 'components/mypage/orderManagement/BuySell/SellSttsButton/SttsButtonReturn'
import { addComma } from 'modules/utils/Common'
import PopupAlert from 'components/PopupAlert'
import PopupWithTitleAlert from 'components/PopupWithTitleAlert'
import DeliveryInfoInput from 'components/mypage/orderManagement/BuySell/DeliveryInfoInput'
import DeliveryNumInput from 'components/mypage/orderManagement/BuySell/DeliveryNumInput'
import PopupCargoList from 'components/mypage/estimation/PopupCargoList'
import moment from 'moment'


const OrderResultProductItem = (props) => {

  const { data, index, cpnType, dvryPtrnId, callRefresh, ordnRgsnTs } = props
  const history = useHistory()
  const [paramsDvry, setParamsDvry] = useState({
    pcsvcmpPtrnId: '', //택배회사 코드
    pcsvcmpNm: '', //택배회사(기타)일  경우 직접 입력
    mainnbNo: '', //운송장번호
    ordnInfoId: '',
    ordnPdfInfoSqn: 0
  })
  const [cargoList, setCargoList] = useState({})
  const [popupDvry, setPopupDvry] = useState({ //운송장입력/화물서비스 선택 팝업
    active: false,
    type: null
  })
  const [popupAlert, setPopupAlert] = useState({ //그 외 팝업
    active: false,
    type: null,
    class: 'popup_review_warning',
    title: null,
    msg: null,
    btnMsg: '확인'
  })
  const dvryPtrnList = { //배송타입별 라벨
    GDS02001: '화물서비스',
    GDS02002: '직접배송',
    GDS02003: '무료배송',
    GDS02004: '구매자 직접 수령'
  }
  const orderSttsList = { //주문 상태별 라벨
    ODS00001: <SttsLabelEnable data={data} />, //주문완료
    ODS00002: <SttsLabelDisable data={data} />, //주문취소(승인)
    ODS00003: <SttsLabelDelivery data={data} handleButton={(type) => handleButton(type)} />, //배송중
    ODS00004: <SttsLabelDelivery data={data} handleButton={(type) => handleButton(type)} />, //배송완료
    ODS00005: <SttsLabelEnable data={data} />, //반품요청
    ODS00006: <SttsLabelDisable data={data} />, //반품불가
    ODS00007: <SttsLabelEnable data={data} />, //반품완료
    ODS00008: <SttsLabelDisable data={data} />, //주문취소(완료)
  }
  const orderBtnList = { //주문 상태별 버튼 
    selr: {
      ODS00001: <SellSttsButtonOrder dvryPtrnId={data?.dvryPtrnId} handleButton={(type) => handleButton(type)} />,
      ODS00002: <SellSttsButtonCancel ordnSttsId={'ODS00002'} date={null} />,
      ODS00003: <SellSttsButtonDeliveryOn data={data} handleButton={(type) => handleButton(type)} />,
      ODS00004: <SellSttsButtonDeliveryFinish data={data} handleButton={(type) => handleButton(type)} />,
      ODS00005: <SellSttsButtonReturn ordnSttsId={'ODS00005'} handleButton={(type) => handleButton(type)} />,
      ODS00006: <SellSttsButtonReturn ordnSttsId={'ODS00006'} handleButton={(type) => handleButton(type)} />,
      ODS00007: <SellSttsButtonReturn ordnSttsId={'ODS00007'} handleButton={(type) => handleButton(type)} />,
      ODS00008: <SellSttsButtonCancel ordnSttsId={'ODS00008'} date={data?.amnnTs}  />,
    },
    buyer: {
      ODS00001: <BuySttsButtonOrder data={data} handleButton={(type) => handleButton(type)} />,
      ODS00002: <BuySttsButtonOrder data={data} handleButton={(type) => handleButton(type)} />,
      ODS00003: <BuySttsButtonDeliveryOn data={data} handleButton={(type) => handleButton(type)} />,
      ODS00004: <BuySttsButtonDeliveryFinish handleButton={(type) => handleButton(type)} />,
      ODS00005: <BuySttsButtonReturn handleButton={(type) => handleButton(type)} />,
      ODS00006: <div />,
      ODS00007: <BuySttsButtonReturn handleButton={(type) => handleButton(type)} />,
      ODS00008: <div />,
    }
  }

  const handleCopyInvoice = useCallback(() => { //운송장 번호 복사
    if (data?.mainnbNo === null) return
    navigator.clipboard.writeText(data?.mainnbNo)
    setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', class: 'popup_review_warning', msg: '운송장번호가 복사되었습니다.' })
  }, [popupAlert, data])

  const handleLinkPdfDetail = useCallback(() => { //상품 상세로 이동
    if (data?.pdfInfoId) history.push(`${PathConstants.PRODUCT_DETAIL}/${data?.pdfInfoId}`)
  }, [data])

  const handleLinkReview = useCallback(() => { //리뷰 작성으로 이동(구매자)
    history.push({
      pathname: PathConstants.MY_PAGE_ORDERMANAGEMENT_BUY_REVIEW,
      state: {
        pdfInfoId: data?.pdfInfoId,
        rgsnTs: ordnRgsnTs ? moment(ordnRgsnTs).format('YYYY-MM-DD') : '-',
        qty: data?.qty,
        ttalAmt: data?.ttalAmt,
        ordnInfoId: data?.ordnInfoId,
      }
    })
  }, [data, ordnRgsnTs])

  const handleLinkReturnDetail = useCallback(() => { //반품 상세로 이동(판매자)
    history.push({ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL}/${data?.ordnInfoId}&${data?.infoSqn}&${cpnType}` })
  }, [data, cpnType])

  const handleLinkReturnRequest = useCallback(() => { //반품 요청으로 이동(구매자)
    history.push({
      pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_REQUEST}/${data?.ordnInfoId}`,
      state: {
        ordnInfoId: data?.ordnInfoId,
        infoSqn: data?.infoSqn,
        returnType: 'buyer'
      }
    })
  }, [data])

  const handleButton = useCallback((type) => {
    switch (type) {
      case 'address': //주소 확인하기
        setPopupAlert({ ...popupAlert, active: true, type: 'ADDRESS', class: 'estimate_cancel_popup address_confirm_popup', title: '주소확인', msg: '(' + data?.recvZpcd + ') ' + data?.recvAdr + ' ' + data?.recvDtad })
        break
      case 'tracking':
        if(data?.mainnbNoUrl) window.open(data.mainnbNoUrl)
        break
      case 'review':
        handleLinkReview() //리뷰 작성으로 이동(구매자)
        break
      case 'receive':
        setPopupAlert({ ...popupAlert, active: true, type: 'RECV', class: 'popup_review_warning', msg: '실제 상품을 받으셨을 경우에만,\n수령확인 버튼을 눌러주세요.\n배송완료처리가 됩니다.', btnMsg: '수령확인', ordnInfoId: data?.ordnInfoId })
        break
      case 're_request':
        handleLinkReturnRequest() //반품 요청으로 이동(구매자)
        break
      case 're_detail':
        handleLinkReturnDetail() //반품 상세로 이동(판매자)
        break
      case 'dvryInfo':
        setPopupDvry({ active: true, type: 'DVRY_INFO' }) //운송장 번호 입력/화물서비스 선택 팝업
        setParamsDvry({ ...paramsDvry, ordnInfoId: data?.ordnInfoId, ordnPdfInfoSqn: data?.infoSqn })
        break
      case 'copy_invoice':
        handleCopyInvoice() //운송장 번호 복사
        break
      case 'cancel': //주문취소
        setPopupAlert({ ...popupAlert, active: true, type: 'CANCEL', class: 'popup_review_warning', msg: '주문을 취소하시겠습니까?', btnMsg: '주문취소' })
        break
    }
  }, [data, paramsDvry, popupAlert, popupDvry])



  const handlePopupAlert = useCallback((type) => { //팝업 버튼 눌렀을 때 action
    if (popupAlert?.type === 'COMPLETE') {  //주문상세 refresh
      callRefresh()
      handlePopupDvry()
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: null,
        class: 'popup_review_warning',
        btnMsg: '확인'
      })
    } else if (type === 'btnMsg' && popupAlert?.type === 'RECV') { //수령확인
      postOrderReceiptCheck()
    } else if (popupAlert?.type === 'CANCEL') { //주문취소
      postOrderCancel()
    } else {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: null,
        class: 'popup_review_warning',
        btnMsg: '확인'
      })
    }
  }, [popupAlert])

  const handlePopupDvry = useCallback(() => { //운송장입력/화물서비스 선택 팝업 닫기
    setPopupDvry({ active: false, type: null })
    setParamsDvry({ //입력한 운송장번호 초기화
      pcsvcmpPtrnId: '',
      pcsvcmpNm: '',
      mainnbNo: '',
      ordnInfoId: '',
      ordnPdfInfoSqn: 0
    })
  }, [popupDvry])

  const handlePopupDvryInfo = useCallback((type) => { //운송장 입력/화물서비스 선택 팝업에서 버튼 눌렀을 때 action
    switch (type) {
      case 'inputInvoice':
        setPopupDvry({ ...popupDvry, active: true, type: 'INPUT_INVOICE' })
        break
      case 'selectCargo':
        getDvryCargoList()
        break
      case 'save': //운송장번호 저장
        postDvryInvoiceUpdate()
        break
      case 'close':
        handlePopupDvry()
        break
    }
  }, [paramsDvry, popupDvry])

  const handlePopupAlertDvryCargo = useCallback((type, cargoData) => { //화물서비스 선택 팝업
    switch (type) {
      case 'save':
        postDvryCargoRequest(cargoData)
        break
      case 'close':
        handlePopupDvry()
        break
    }
  }, [paramsDvry, popupDvry])

  const postOrderReceiptCheck = useCallback(async () => { //상품 수령
    await Axios({
      url: API.MYPAGE.MY_ORDER_RECEIPT_CHECK,
      method: 'post',
      data: {
        ordnInfoId: data?.ordnInfoId,
        ordnPdfInfoSqn: data?.infoSqn
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'COMPLETE',
          class: 'popup_review_warning',
          msg: '수령 완료 처리되었습니다.',
          btnMsg: '확인'
        })
      } else if (response?.data?.code === '400' && response?.data?.message) {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'ALERT',
          class: 'popup_review_warning',
          msg: response.data.message,
          btnMsg: '확인'
        })
      } else {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'ALERT',
          class: 'popup_review_warning',
          msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
          btnMsg: '확인'
        })
      }
    })
  }, [data, popupAlert])


  const postDvryInvoiceUpdate = useCallback(async () => { //운송장번호 저장
    await Axios({
      url: API.MYPAGE.MY_ORDER_DVRY_INVOICE_UPDATE,
      method: 'post',
      data: paramsDvry
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({ ...popupAlert, active: true, type: 'COMPLETE', msg: '배송정보가 입력되었습니다.' })
      } else if (response?.data?.code === '400' && response?.data?.message) {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'ALERT',
          class: 'popup_review_warning',
          msg: response.data.message,
          btnMsg: '확인'
        })
      } else {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'ALERT',
          class: 'popup_review_warning',
          msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
          btnMsg: '확인'
        })
      }
    })
  }, [paramsDvry, popupAlert])

  const getDvryCargoList = useCallback(async () => { //화물서비스 리스트
    await Axios({
      url: API.MYPAGE.MY_ORDER_DVRY_CARGO_LIST,
      method: 'get',
      params: paramsDvry
    }).then((response) => {
      if (response?.data?.code === '200') {
        setCargoList(response?.data?.data?.list[0])
        setPopupDvry({ active: true, type: 'SELECT_CARGO' })
      } else if (response?.data?.code === '400' && response?.data?.message) {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'ALERT',
          class: 'popup_review_warning',
          msg: response.data.message,
          btnMsg: '확인'
        })
      } else {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'ALERT',
          class: 'popup_review_warning',
          msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
          btnMsg: '확인'
        })
      }
    })
  }, [paramsDvry, popupAlert])

  const postDvryCargoRequest = useCallback(async (cargoData) => { //화물서비스 선택 완료
    await Axios({
      url: API.MYPAGE.MY_ORDER_DVRY_CARGO_REQUEST,
      method: 'post',
      data: {
        ...cargoData,
        ordnInfoId: data?.ordnInfoId,
        ordnPdfInfoSqn: data?.infoSqn
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'COMPLETE',
          msg: '해당 운송업체에 배송요청이 완료되었습니다.\n배송비는 상품 픽업시 결제 부탁드립니다.',
          btnMsg: '확인'
        })
      } else if (response?.data?.code === '400' && response?.data?.message) {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'ALERT',
          class: 'popup_review_warning',
          msg: response.data.message,
          btnMsg: '확인'
        })
      } else {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'ALERT',
          class: 'popup_review_warning',
          msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
          btnMsg: '확인'
        })
      }
    })
  }, [data, popupAlert])

  const postOrderCancel = useCallback(async () => {
    //주문취소 api
    // await Axios({
    //   url: API.MYPAGE.MY_ORDER_RECEIPT_CHECK,
    //   method: 'post',
    //   data: paramsRecv
    // }).then((response) => {
    //   if (response?.data?.code === '200') {
    //     setPopupAlert({ ...popupAlert, active: true, type: 'COMPLETE', class: 'popup_review_warning', msg: '주문이 취소되었습니다.', btnMsg: '확인' })
    //     setParamsRecv({ //값 초기화
    //       ordnInfoId: '',
    //       ordnPdfInfoSqn: ''
    //     })
    //   } else if (response?.data?.code === '400' && response?.data?.message) {
    //     setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', class: 'popup_review_warning', msg: response.data.message })
    //   } else {
    //     setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', class: 'popup_review_warning', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
    //   }
    // })
  }, [paramsDvry, popupAlert])

  return (
    <>
      {popupDvry?.active && popupDvry?.type === 'DVRY_INFO' && ( //운송장번호 입력/화물서비스 선택 팝업
        <DeliveryInfoInput
          pdfInfoId={data?.pdfInfoId}
          handlePopup={(type) => handlePopupDvryInfo(type)}
        />
      )}
      {popupDvry?.active && popupDvry?.type === 'INPUT_INVOICE' && ( //운송장번호 입력 팝업
        <DeliveryNumInput
          paramsDvry={paramsDvry}
          setParamsDvry={setParamsDvry}
          handlePopup={(type) => handlePopupDvryInfo(type)}
        />
      )}
      {popupDvry?.active && popupDvry?.type === 'SELECT_CARGO' && ( //화물서비스 선택 팝업
        <PopupCargoList
          type={'estimation'}
          cargoData={cargoList}
          closePopup={() => handlePopupAlertDvryCargo('close')}
          handleSelectCargoEnt={(cargo) => handlePopupAlertDvryCargo('save', cargo)}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'ALERT' && ( //alert 팝업
        <PopupAlert
          className={popupAlert.class}
          msg={popupAlert.msg}
          btnMsg={popupAlert.btnMsg}
          handlePopup={() => handlePopupAlert('close')}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'COMPLETE' && ( //complete 팝업
        <PopupAlert
          className={popupAlert.class}
          msg={popupAlert.msg}
          btnMsg={popupAlert.btnMsg}
          handlePopup={() => handlePopupAlert('close')}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'ADDRESS' && ( //주소 확인 팝업
        <PopupWithTitleAlert
          className={popupAlert.class}
          title={popupAlert.title}
          msg={popupAlert.msg}
          btnMsg={popupAlert.btnMsg}
          handlePopup={() => handlePopupAlert('close')}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'RECV' && ( //수령 확인 팝업
        <PopupAlert
          className={popupAlert.class}
          msg={popupAlert.msg}
          btnMsg={popupAlert.btnMsg}
          handlePopup={(type) => handlePopupAlert(type)}
        />
      )}

      <div className="pc_version">
        <div className="table_tr">
          <div className="table_td">
            <div className="cell info">
              <div className="contents_wrap">
                <div className={data?.pdfInfoId ? "img_wrap" : "img_wrap cursor_none"} onClick={handleLinkPdfDetail}>
                  {data?.pdfInfoId ? (
                    data?.imgUrl && (<img src={`${data?.imgUrl}`} alt={data?.pdfNm} />)
                  ) : (
                    <img src={require('assets/images/img_direct_input.png').default} alt={'d_input'} style={{ objectFit: 'none' }} />
                  )}
                </div>
                <div className="text_wrap">
                  {data?.agenPdfYn === "Y" && (
                    <div className="agency_company_wrap">
                      <div className="badge_wrap">
                        <Badge className="badge full_blue">에이전시</Badge>
                      </div>
                    </div>
                  )}
                  <p className={data?.pdfInfoId ? "name" : "name cursor_none"} onClick={handleLinkPdfDetail}>{data?.pdfNm}</p>
                </div>
              </div>
            </div>
            <div className="cell price">{data?.pdfPrc ? addComma(Number(data?.pdfPrc)) : 0} 원</div>
            <div className="cell quantity">{data?.qty ? addComma(Number(data?.qty)) : 0} 개</div>
            <div className="cell amount">{data?.pdfPrc && data?.qty ? addComma(Number(data?.pdfPrc) * Number(data?.qty)) : 0} 원</div>
            <div className="cell ship">
              <div className="ship_wrap">
                <p className="type">{dvryPtrnList?.[dvryPtrnId]}</p>
                {dvryPtrnId === 'GDS02001' && (
                  <p className="cargo_company">
                    &#40;{data?.entpNm}&nbsp;&#58;
                    <br />
                    &nbsp;{data?.dvrynone ? addComma(Number(data?.dvrynone)) : 0}원&#41;
                  </p>
                )}
                {dvryPtrnId === 'GDS02002' && <p className="cost">&#40;{data?.dvrynone ? addComma(Number(data?.dvrynone)) : 0}원&#41;</p>}
              </div>
            </div>
            <div className="cell status_info">
              {cpnType === 'buyer' && (
                <div className="status">
                  {orderSttsList?.[data?.ordnSttsId]}
                </div>
              )}
              <div className="btn_group">
                {orderBtnList?.[cpnType]?.[data?.ordnSttsId]}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mobile_version">
        <div className="resp_table resp_head">{index + 1}</div>
        <div className="resp_table">
          <div className="resp_name">주문 상품 정보</div>
          <div className="resp_content">
            <div className="resp_contents">
              <div className={data?.pdfInfoId ? "img_wrap" : "img_wrap cursor_none"} onClick={handleLinkPdfDetail}>
                {data?.pdfInfoId ? (
                  data?.imgUrl && (<img src={`${data?.imgUrl}`} alt={data?.pdfNm} />)
                ) : (
                  <img src={require('assets/images/img_direct_input.png').default} alt={'d_input'} style={{ objectFit: 'none' }} />
                )}
              </div>
              <div className="text_wrap">
                {data?.agenPdfYn === "Y" && (
                  <div className="agency_company_wrap">
                    <div className="badge_wrap">
                      <Badge className="badge full_blue">에이전시</Badge>
                    </div>
                  </div>
                )}
                <p className={data?.pdfInfoId ? "name" : "name cursor_none"} onClick={handleLinkPdfDetail}>{data?.pdfNm}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="resp_table">
          <div className="resp_name">판매가</div>
          <div className="resp_content">{data?.pdfPrc ? addComma(Number(data?.pdfPrc)) : 0} 원</div>
        </div>
        <div className="resp_table">
          <div className="resp_name">수량</div>
          <div className="resp_content">{data?.qty ? addComma(Number(data?.qty)) : 0} 개</div>
        </div>
        <div className="resp_table">
          <div className="resp_name">주문 상품 금액</div>
          <div className="resp_content amount">{data?.pdfPrc && data?.qty ? addComma(Number(data?.pdfPrc) * Number(data?.qty)) : 0} 원</div>
        </div>
        <div className="resp_table">
          <div className="resp_name">배송</div>
          <div className="resp_content">
            <div className="ship_wrap">
              <p className="type">{dvryPtrnList?.[dvryPtrnId]}</p>
              {dvryPtrnId === 'GDS02001' && (
                <p className="cargo_company">
                  &#40;{data?.entpNm}&nbsp;&nbsp;{data?.dvrynone ? addComma(Number(data?.dvrynone)) : 0}원&#41;
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="resp_table">
          <div className="resp_name">상태</div>
          <div className="resp_content">
            <div className="cell status_info">
              <div className="status_detail_wrap">
                {cpnType === 'buyer' && (
                  <div className="status">
                    {orderSttsList?.[data?.ordnSttsId]}
                  </div>
                )}
                <div className="btn_group">
                  {orderBtnList?.[cpnType]?.[data?.ordnSttsId]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default OrderResultProductItem
