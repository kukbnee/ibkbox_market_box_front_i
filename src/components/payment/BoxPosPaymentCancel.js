import Button from "../atomic/Button";
import {useCallback, useContext, useEffect, useState} from "react";
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { deviceCheck } from 'modules/utils/Common'
import PopupAlert from 'components/PopupAlert'
import { BoxPosLnkStlmCncl, BoxPosPcRmteStlmInq, BoxPosPopupOption } from "modules/payment/BoxPos";
import {UserContext} from "../../modules/contexts/common/userContext";

const BoxPosPaymentCancel = (props) => {

    const { orderData } = props

    const userContext = useContext(UserContext);

    const [popupAlert, setPopupAlert] = useState({
        active: false,
        className: 'popup_review_warning',
        type: 'ALERT',
        msg: null,
        caseMsg: [],
        msg2: null,
        btnMsg: '확인'
    })

    let [boxPosPayData, setBoxPosPayData] = useState({
        lnkStlmSrn : '',
        url: ''
    });

    const handlePopupAlert = () => {
        if(popupAlert?.type === 'COMPLETE') location.reload();
        setPopupAlert({ ...popupAlert, active: !popupAlert, type: 'ALERT', msg: null, caseMsg: [], msg2: null })
    }

    //url에 따른 QR생성
    const createQrPopUp = (url) => {
        if(deviceCheck() == "M"){
            window.open(url);
        }else {
            let popObj = window.open(url, "boxpos", BoxPosPopupOption());
            let timer = setInterval(function() {
                if(popObj.closed) {
                    clearInterval(timer);
                    setPopupAlert({...popupAlert, active: true, type: 'ALERT', msg: '[결제취소]버튼을 클릭하셔야 결제취소가 완료됩니다.', btnMsg: '확인'});
                }
            }, 1000);

            //새로고침시 알림창 노출
            window.addEventListener('beforeunload', (event) => {
                event.preventDefault();
                event.returnValue = '';
                return '';
            });
        }
    }

    const handlePay = useCallback(async() => {
        //결제번호가 있는 경우 취소 진행
        if(orderData.stlmRsltId != undefined) {
            const getPcRmteStlmInq = await BoxPosPcRmteStlmInq(orderData.stlmRsltId);
            if(getPcRmteStlmInq != null){
                //취소수락인 경우
                if(parseInt(getPcRmteStlmInq.pgrsSttsCd) == 5){
                    //최초일때만 생성
                    if(boxPosPayData.lnkStlmSrn == '') {
                        const getBoxPosRgsnData = await BoxPosLnkStlmCncl({
                            lnkStlmSrn : orderData.stlmRsltId, // 연계결제일련번호
                            type : "B", //요청자 유형(B: 구매자, F: 가맹점)
                            deviceType : deviceCheck(), //PC, M 구분
                        });
                        if(getBoxPosRgsnData != null){
                            createQrPopUp(getBoxPosRgsnData.url);
                            setBoxPosPayData(getBoxPosRgsnData);
                        }else{
                            setPopupAlert({...popupAlert, active: true, type: 'ALERT', msg: '결제취소 정보 생성 중 오류가 발생하였습니다. \n다시 시도해주세요.', btnMsg: '닫기'})
                        }
                    }else{
                        createQrPopUp(boxPosPayData.url);
                    }
                }else if(parseInt(getPcRmteStlmInq.pgrsSttsCd) == 4){ //판매자가 boxpos어플내에서 [취소요청 수락]을 클릭해줘야 하는 상황
                    setPopupAlert({...popupAlert, active: true, type: 'ALERT', msg: '판매자가 BOXPOS앱에서 영수증을 취소해야 진행이 가능합니다. \n판매자에게 문의해주세요.', btnMsg: '닫기'})
                }else if(parseInt(getPcRmteStlmInq.pgrsSttsCd) == 6){
                    //구매자가 팝업에서 취소완료를 진행해서 커머스BOX내에서 완료를 클릭안한경우로, BOXPOS상태에 맞춰서 업데이트 해준다.
                    payResponseCheck();
                    // setPopupAlert({ active: true, type: 'COMPLETE', msg: '주문상태정보가 업데이트 되었습니다. 새로고침 후 이용해주세요.' })
                }else{
                    setPopupAlert({...popupAlert, active: true, type: 'ALERT', msg: '결제취소 중 오류가 발생하였습니다. \n판매자에게 문의해주세요.', btnMsg: '닫기'})
                }
            }else{
                setPopupAlert({...popupAlert, active: true, type: 'ALERT', msg: '결제정보 확인 중 오류가 발생하였습니다.', btnMsg: '닫기'})
            }
        }else{
            setPopupAlert({...popupAlert, active: true, type: 'ALERT', msg: '결제취소 가능한 정보가 없습니다.', btnMsg: '닫기'})
        }

    }, [boxPosPayData])

    useEffect(() => {
        //취소 연계시작
        handlePay();
    }, []);


    //결제취소
    const payResponseCheck = useCallback(async() => {
        return await Axios({
            url: API.ORDER.MY_ORDER_PAY_CANCEL,
            method: 'post',
            data: {
                ordnInfoId: orderData.ordnInfoId,
                ordnPdfInfoSqnList : orderData.products
            }
        }).then(async(response) => {
            if (response?.data?.code === '200') {

                //운송의뢰 취소
                await orderDvryCancel(orderData.ordnInfoId);

                setPopupAlert({ active: true, type: 'COMPLETE', msg: '결제취소가 완료되었습니다.' })
                // location.reload();
            }else{
                setPopupAlert({ active: true, type: 'ALERT', msg: '결제취소 완료 중 오류가 발생하였습니다.' })
            }
        })
    },[boxPosPayData]);

    //화물서비스 주문인경우 운송의뢰 취소호출
    const orderDvryCancel = useCallback(async(ordnInfoId) => {
        return await Axios({
            url: API.ORDER.MY_ORDER_PRODUCT_DVRY_CANCEL,
            method: 'post',
            data: { ordnInfoId : ordnInfoId }
        }).then((response) => {
        })
    },[])

    return(
        <>
            {popupAlert?.active &&
            <PopupAlert
                handlePopup={handlePopupAlert}
                className={popupAlert?.className}
                msg={popupAlert?.msg}
                caseMsg={popupAlert?.caseMsg}
                msg2={popupAlert?.msg2}
                btnMsg={popupAlert?.btnMsg}
            />
            }
            <div className="qr_view">
                <div className="qr_text">
                    <div>- 휴대폰 기본 카메라로 QR 코드를 인식해주세요.</div>
                    <div>- 만약 BOXPOS 앱이 설치되지 않았으면, 설치를 진행한 후 QR코드를 인식해주세요.</div>
                    <div>- 안드로이드 기종(삼성,LG 등 아이폰이 아닌 기종)만 결제가 가능합니다.</div>
                    <div>- 아이폰(IOS) 유저의 경우 판매자에게 직접 결제 문의를 해주세요.</div>
                    <div>- 휴대폰에서 결제가 완료된 경우, PC화면의 [결제취소 완료]버튼을 클릭해주세요.</div>
                </div>
                <div className="qr_tag_wrap">
                    {
                        boxPosPayData?.url != '' ?
                            <Button className="btn full_blue qr_btn" onClick={payResponseCheck}>결제취소 완료</Button>
                            :
                            null
                    }
                    <Button className="btn full_blue qr_btn" onClick={handlePay}>결제취소 팝업</Button>
                </div>
            </div>
        </>
    )
}
export default BoxPosPaymentCancel;