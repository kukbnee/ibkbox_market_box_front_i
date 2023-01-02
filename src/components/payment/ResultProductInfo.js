import { useCallback, useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router'
import PayResultProductItem from 'components/payment/PayResultProductItem'
import OrderResultProductItem from 'components/payment/OrderResultProductItem'
import NoResult from 'components/NoResult'
import { addComma } from 'modules/utils/Common'
import { UserContext } from 'modules/contexts/common/userContext'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import { BoxPosPcRmteStlmInq, BoxPosPcRmteStlmCnclRqstPush } from "modules/payment/BoxPos";
import Axios from "modules/utils/Axios";
import API from "modules/constants/API";
import moment from 'moment'

const ResultProductInfo = (props) => {
  const { data, cpnType, isLoading, callRefresh } = props
  const userContext = useContext(UserContext)
  const [popupAlert, setPopupAlert] = useState({ active: false, type: 'ALERT', msg: ''})
  const [orderCancleInfo, setOrderCancleInfo] = useState({
    sellerState : false, //판매자여부
    renderDom : ''
  });

  const handlePopupAlert = useCallback(() => {
    if(popupAlert?.type === 'COMPLETE') location.reload();
    setPopupAlert({ ...popupAlert, active: !popupAlert, type: 'ALERT', msg: '' })
  }, [popupAlert])

  //상품수에서 상품상태의 수 리턴
  const findStateLen = useCallback((data, state) => {
    return data?.products?.filter(item => item.ordnSttsId == `${state}`).length;
  },[data])

  //주문취소
  const orderCancel = useCallback(async() => {
    return await Axios({
      url: API.ORDER.MY_ORDER_CANCEL,
      method: 'post',
      data: {
        ordnInfoId: data.ordnInfoId,
        ordnPdfInfoSqnList : data.products
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({ active: true, type: 'COMPLETE', msg: '주문취소 승인 완료되었습니다.' })
        // location.reload();
      }else{
        setPopupAlert({ active: true, type: 'ALERT', msg: '주문취소 승인 중 오류가 발생하였습니다.' })
      }
    })
  },[data])


  //주문취소
  const handleSellerOrderCancel = useCallback(async() => {

    //결제번호가 있는 경우 취소 진행
    if(data.stlmRsltId != undefined) {
      const getPcRmteStlmInq = await BoxPosPcRmteStlmInq(data.stlmRsltId);
      if(getPcRmteStlmInq != null){
        switch(getPcRmteStlmInq.pgrsSttsCd){
          case "1": //결제요청전
          case "2": //결제전
            setPopupAlert({ active: true, type: 'ALERT', msg: '알수없는 오류가 발생하였습니다. BOXPOS 앱에서 결제 내역을 확인해주세요.' })
            break;
          case "3": //결제완료
            // eslint-disable-next-line no-case-declarations
            let getPcRmteStlmCnclRqstPush = await BoxPosPcRmteStlmCnclRqstPush(data.stlmRsltId);
            //결제취소 푸쉬알림 발송 -> 주문상태를 주문취소 승인으로 변경
            if(getPcRmteStlmCnclRqstPush != null && getPcRmteStlmCnclRqstPush){

              setPopupAlert({ active: true, type: 'ALERT', msg: 'BOXPOS 앱에서 취소요청 수락을 진행해주셔야,\n구매자가 결제 금액을 취소할 수 있습니다.' });
              orderCancel(); //주문취소 승인

            }else{
              setPopupAlert({ active: true, type: 'ALERT', msg: 'BOXPOS 결제취소 중 오류가 발생하였습니다.' });
            }
            break;
          case "4": //취소수락전
            setPopupAlert({ active: true, type: 'ALERT', msg: 'BOXPOS 앱에서 취소요청 수락을 진행해주세요.' });
            break;
          case "5": //취소수락
            //결제취소 알림 발송 오류지만 실제로는 어플에서 요청이된 상황이 발생 -> 취소수락일때 다시 주문취소를 진행
            if(data?.products?.length == findStateLen(data, 'ODS00001')){
              orderCancel(); //주문취소 승인
            }else{            
              setPopupAlert({ active: true, type: 'ALERT', msg: '구매자가 결제취소를 완료하지 않았습니다.' });
            }
            break;
          case "6": //취소완료

            orderCancel(); //주문취소 승인

            break;
          default:
        }
      }else{
        setPopupAlert({ active: true, type: 'ALERT', msg: '결제정보 확인 중 오류가 발생하였습니다.' })
      }
    }else{
      setPopupAlert({ active: true, type: 'ALERT', msg: '결제취소 가능한 정보가 없습니다.' })
    }
  },[data])

  useEffect(() => {
    //판매자일때
    if(userContext?.state?.userInfo.utlinsttId == (data?.selrUsisId != undefined && data?.selrUsisId)){

      const orderProductCnt = data?.products?.length;
      let renderDom = '';

      //전체상품 기준 주문상태
      if(orderProductCnt == findStateLen(data, 'ODS00001')){
        renderDom = <Button className="btn full_blue cancel_btn" onClick={() => handleSellerOrderCancel()}>주문취소</Button>;
      //전체상품 기준 주문취소 승인(ODS00002), 주문취소 완료(ODS00008)
      }else if(orderProductCnt == findStateLen(data, 'ODS00002') > 0 && data?.products?.[0].cancelSelrRgsnTs){ //주문취소 승인
        renderDom = <p className="grey">주문취소 승인일 : {moment(data?.products?.[0].cancelSelrRgsnTs).format('YYYY-MM-DD HH:mm')}</p>;
      }else if(orderProductCnt == findStateLen(data, 'ODS00008') > 0 && data?.products?.[0].cancelPucsRgsnTs){ //주문취소 완료
        renderDom = <p className="grey">주문취소 완료일 : {moment(data?.products?.[0].cancelPucsRgsnTs).format('YYYY-MM-DD HH:mm')}</p>;
      }

      setOrderCancleInfo({
        sellerState : true,
        renderDom : renderDom
      });
    }


    //구매자일때(주문취소 일자 표시)
    if(userContext?.state?.userInfo.utlinsttId == (data?.pucsUsisId != undefined && data?.pucsUsisId)){

      let renderDom = '';

      if(findStateLen(data, 'ODS00002') > 0 && data?.products?.[0].cancelSelrRgsnTs){ //주문취소 승인
        renderDom = <p className="grey">주문취소 승인일 : {moment(data?.products?.[0].cancelSelrRgsnTs).format('YYYY-MM-DD HH:mm')}</p>;
      }else if(findStateLen(data, 'ODS00008') > 0 && data?.products?.[0].cancelPucsRgsnTs){ //주문취소 완료
        renderDom = <p className="grey">주문취소 완료일 : {moment(data?.products?.[0].cancelPucsRgsnTs).format('YYYY-MM-DD HH:mm')}</p>;
      }

      setOrderCancleInfo({
        sellerState : true,
        renderDom : renderDom
      });
    }

  }, [data]);

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

      <div className="toggle_card_layout active padding_none">
        <div className="toggle_card_header">
          <div className="title">주문 상품 정보</div>
          { orderCancleInfo?.sellerState == true ? orderCancleInfo?.renderDom : '' }
        </div>
        <div className="toggle_card_container">
          {cpnType != 'result' ? ( //마이페이지 > 주문 상세
            <div className="table_content">
              <div className="pc_version">
                <div className="table_head">
                  <div className="cell info">주문 상품 정보</div>
                  <div className="cell price">판매가</div>
                  <div className="cell quantity">수량</div>
                  <div className="cell amount">주문상품 금액</div>
                  <div className="cell ship">배송</div>
                  <div className="cell status_info">상태</div>
                </div>
              </div>
              <ul className="prod_list">
                {data?.products?.length > 0 ? (
                  data.products.map((item, index) => (
                    <OrderResultProductItem
                      screenSize={'pc'}
                      data={item}
                      index={index}
                      key={index}
                      cpnType={cpnType}
                      dvryPtrnId={item?.dvryPtrnId}
                      callRefresh={callRefresh}
                      ordnRgsnTs={data?.ordnRgsnTs}
                    />
                  ))
                ) : (
                  <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '데이터가 없습니다.'} />
                )}
              </ul>
            </div>

          ) : ( //결제하기 > 결제 완료
            <div className="table_content resp_pc">
              <div className="table_head">
                <div className="cell info">주문 상품 정보</div>
                <div className="cell sale">판매가</div>
                <div className="cell quantity">수량</div>
                <div className="cell price">주문금액</div>
                <div className="cell ship">배송</div>
              </div>
              {data?.products?.length > 0 ? (
                data.products.map((item, index) => (
                  <PayResultProductItem
                    screenSize={'pc'}
                    data={item}
                    index={index}
                    key={index}
                    dvryPtrnId={item?.dvryPtrnId}
                    entpNm={item?.entpNm}
                    callRefresh={callRefresh}
                  />
                ))
              ) : (
                <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '데이터가 없습니다.'} />
              )}
            </div>
          )}
          <div className="amount_wrap resp_pc">
            <div className="text_wrap">결제금액</div>
            <div className="contents_wrap">
              <p className="product_price">상품금액 : {data?.pdfAmtSum ? addComma(Number(data?.pdfAmtSum)) : 0} 원</p>
              <p className="ship_price">배송금액 : {data?.dvrynoneSum ? addComma(Number(data?.dvrynoneSum)) : 0} 원</p>
              <p className="total_price">총 결제 금액 : {data?.stlmAmt ? addComma(Number(data?.stlmAmt)) : 0} 원</p>
            </div>
          </div>
          <div className="table_content resp_mo">
            {data?.products?.length > 0 ? (
              cpnType != 'result' ? ( //마이페이지 > 주문 상세
                data.products.map((item, index) => (
                  <OrderResultProductItem
                    screenSize={'mo'}
                    data={item}
                    index={index}
                    key={index}
                    cpnType={cpnType}
                    dvryPtrnId={item?.dvryPtrnId}
                    callRefresh={callRefresh}
                    ordnRgsnTs={data?.ordnRgsnTs}
                  />
                ))

              ) : ( //결제하기 > 결제 완료
                data.products.map((item, index) => (
                  <PayResultProductItem
                    screenSize={'mo'}
                    data={item}
                    index={index}
                    key={index}
                    dvryPtrnId={item?.dvryPtrnId}
                    entpNm={item?.entpNm}
                    callRefresh={callRefresh}
                  />
                ))
              )

            ) : (
              <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '데이터가 없습니다.'} />
            )
            }
            <div className="amount_wrap">
              <div className="text_wrap">결제금액</div>
              <div className="contents_wrap">
                <p className="product_price">상품금액 : {data?.pdfAmtSum ? addComma(Number(data?.pdfAmtSum)) : 0} 원</p>
                <p className="ship_price">배송금액 : {data?.dvrynoneSum ? addComma(Number(data?.dvrynoneSum)) : 0} 원</p>
                <p className="total_price">총 결제 금액 : {data?.stlmAmt ? addComma(Number(data?.stlmAmt)) : 0} 원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResultProductInfo
