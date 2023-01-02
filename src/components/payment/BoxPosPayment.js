import Button from "components/atomic/Button";
import {useCallback, useContext, useEffect, useState} from "react";
import { useParams, useHistory } from 'react-router-dom'
import {BoxPosLnkStlmPgrsInq, BoxPosLnkStlmRgsn, BoxPosPcRmteStlmInq, BoxPosUtlaplcinfo, BoxPosPopupOption} from "modules/payment/BoxPos";
import { UserContext } from 'modules/contexts/common/userContext'
import moment from 'moment';
import { deviceCheck } from 'modules/utils/Common'
import PopupAlert from 'components/PopupAlert'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'

const BoxPosPayment = (props) => {

    const history = useHistory();
    const { orderData } = props

    const userContext = useContext(UserContext);

    const [popupAlert, setPopupAlert] = useState({
        active: false,
        className: 'popup_review_warning',
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
        setPopupAlert({ ...popupAlert, active: !popupAlert, msg: null, caseMsg: [], msg2: null })
    }

    //결제확인
    const payResponseCheck = useCallback(async() => {

        //연계등록을 안되어있는 경우 체크
        if(boxPosPayData.lnkStlmSrn == ''){
            setPopupAlert({...popupAlert, active: true, msg: '결제 진행 중 오류가 발생하였습니다.\n새로고침(F5) 후에도 문제가 발생시 관리자에게 문의해주세요.', btnMsg: '확인'})
            return;
        }

        //결제여부 확인
        const getLnkStlmPgrsInq = await BoxPosLnkStlmPgrsInq(boxPosPayData.lnkStlmSrn);
        if(getLnkStlmPgrsInq){

            //결제정보
            const getPcRmteStlmInq = await BoxPosPcRmteStlmInq(boxPosPayData.lnkStlmSrn);

            //주문 등록
            if(getPcRmteStlmInq != null){

                if(orderData?.payType === 'ESTT'){ //견적결제일 때
                    await Axios({
                        url: API.ORDER.PAY_ESTIMATION_ORDER,
                        method: 'post',
                        data: {
                            orderReqStlmVO : {
                                ordnInfoId : orderData.ordnInfoId,// 주문 정보 ID
                                cnttNoId:orderData.cnttNoId,// 체결 번호 ID
                                stlmptrnId:"PYS00002",// 결제유형 ID
                                stlmsttsId:"PYS01003",// 결제상태 ID
                                rsltInfo:JSON.stringify(getPcRmteStlmInq),// 결과 정보
                                amt:getPcRmteStlmInq.allSumAmt,// 금액
                                stlmRsltId:boxPosPayData.lnkStlmSrn // 결제 결과 ID
                            },//결제정보
                            ...orderData
                        }
                      }).then(async(response) => {
                        if(response?.data?.code === '200'){

                            //운송의뢰 호출
                            await orderDvryRequest(response?.data?.data?.resultStr);

                            history.push(`${PathConstants.PAYMENT_RESULT}/${response?.data?.data?.resultStr}`)
                        } else {
                            history.push(`${PathConstants.PAYMENT_NOT_RESULT}`)
                        }
                      })
                } else { //장바구니, 상품 결제일 때
                    await Axios({
                        url: API.ORDER.PAY_PRODUCT_ORDER,
                        method: 'post',
                        data : {
                            orderReqStlmVO : {
                                ordnInfoId : orderData.ordnInfoId,// 주문 정보 ID
                                cnttNoId:orderData.cnttNoId,// 체결 번호 ID
                                stlmptrnId:"PYS00002",// 결제유형 ID
                                stlmsttsId:"PYS01003",// 결제상태 ID
                                rsltInfo:JSON.stringify(getPcRmteStlmInq),// 결과 정보
                                amt:getPcRmteStlmInq.allSumAmt,// 금액
                                stlmRsltId:boxPosPayData.lnkStlmSrn // 결제 결과 ID
                            }, //결제정보
                            recv : orderData?.recv,
                            recvCnplone:orderData?.recvCnplone,
                            recvCnpltwo:orderData?.recvCnpltwo || '' ,
                            recvZpcd:orderData?.recvZpcd ,
                            recvAdr:orderData?.recvAdr ,
                            recvDtad:orderData?.recvDtad ,
                            esttInfoId:'' ,
                            dlplUseYn:orderData?.dlplUseYn ,
                            products:orderData?.products.map(item=> {
                                return {
                                    qty: item?.productQty.toString(),
                                    pdfPrc:(item.productPay/item.productQty).toString(), //productPay는 수량이 곱해진 가격이라서 상품원래 가격으로 변환 시킴
                                    pdfInfoId:item?.productInfo?.pdfInfoId,
                                    dvryPtrnId:item?.productDelInfo?.dvryPtrnId,
                                    dvrynone:item?.productDeliveryPay.toString()
                                }
                            })
                        }
                    }).then(async(response) => {
                        if(response?.data?.code === '200') {

                            //운송의뢰 호출
                            await orderDvryRequest(response?.data?.data?.resultStr);

                            if(orderData?.payType === 'BASKET'){ //장바구니 결제일 경우엔 장바구니에서 해당 상품 삭제
                                let delList = orderData?.products?.map((item) => {return {pdfInfoId: item?.productInfo?.pdfInfoId} })
                                await postMyBasketDelete(delList)
                            }

                            history.push({
                                pathname: `${PathConstants.PAYMENT_RESULT}/${response?.data?.data?.resultStr}`,
                            })

                        }else{
                            history.push(`${PathConstants.PAYMENT_NOT_RESULT}`);
                        }
                    })
                }
            }else{
                setPopupAlert({...popupAlert, active: true, msg: '결제가 진행되지 않았습니다.', btnMsg: '확인'});
            }
        }else{
            setPopupAlert({...popupAlert, active: true, msg: '결제가 진행되지 않았습니다. \n[결제팝업]버튼을 눌러 결제를 진행해주세요.', btnMsg: '확인'});
        }
    },[boxPosPayData]);

    //url에 따른 QR생성
    const createQrPopUp = (url) => {
        if(deviceCheck() == "M"){
            window.open(url);
        }else {
            let popObj = window.open(url, "boxpos", BoxPosPopupOption());
            let timer = setInterval(function() {
                if(popObj.closed) {
                    clearInterval(timer);
                    setPopupAlert({...popupAlert, active: true, msg: '[결제완료]버튼을 클릭하셔야 주문이 완료됩니다.', btnMsg: '확인'});
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
        //가맹점 정보 확인
        const getBoxPosInfo = await BoxPosUtlaplcinfo(orderData.sellerId);
        if(getBoxPosInfo != null){

            let totalPay = 0;
            if(orderData?.payType === 'ESTT'){ //견적 결제일 때
                orderData?.products.map(item=> {
                    totalPay += Number(item.pdfPrc)*Number(item.ordnQty);
                })
                totalPay += orderData?.dvrynone;
            } else { //장바구니, 상품 결제일 때
                orderData?.products.map(item=> {
                    totalPay += Number(item.productPay)+Number(item.productDeliveryPay);
                })
            }

            //체결번호 생성
            // const orderUqnKey = moment().format('YYYYMMDD')+'-'+orderData.ordnInfoId.split("-")[0].toUpperCase();
            // 채결번호 생성 시, 대문자 였던걸 소문자가 들어가도록 수정
            const orderUqnKey = moment().format('YYYYMMDD')+'-'+orderData.ordnInfoId.split("-")[0];
            orderData.cnttNoId = orderUqnKey;

            //최초일때만 생성
            if(boxPosPayData.lnkStlmSrn == ''){
                //연계정보등록
                const getBoxPosRgsnData = await BoxPosLnkStlmRgsn({
                    alcmLnkStlmUqn : orderUqnKey, //주문번호
                    afstBzn : getBoxPosInfo.afstBzn, //판매자정보 > 가맹자사업자등록번호
                    clphRcgnNo : getBoxPosInfo.clphRcgnNo, //판매자정보 > 휴대폰인식번호
                    // userId : userContext.state.userInfo.userId, //로그인 사용자 ID
                    // userId : "hNOSbUO8Vx", //결제 테스트 고정 아이디
                    userId : getBoxPosInfo.userId,
                    deviceType : deviceCheck(), //PC, M 구분
                    totalPay : totalPay
                });
                if(getBoxPosRgsnData != null && getBoxPosRgsnData?.lnkStlmSrn > 0){
                    createQrPopUp(getBoxPosRgsnData.url);
                    setBoxPosPayData(getBoxPosRgsnData);
                }else{
                    setPopupAlert({...popupAlert, active: true, msg: '결제 중 오류가 발생하였습니다.', btnMsg: '닫기'})
                }
            }else{
                createQrPopUp(boxPosPayData.url);
            }
        }else{
            setPopupAlert({
                ...popupAlert,
                active: true,
                msg: '해당 판매자는 전자결제(BOXPOS)가맹점이 아닌 것으로 확인되어 결제가 불가능합니다.\n판매자와 직접 연락하여 결제를 진행해주시길 바랍니다.',
                btnMsg: '닫기'
            })
        }
    }, [boxPosPayData])


    const postMyBasketDelete = useCallback(async (pdfList) => {
        //장바구니에서 결제완료한 상품 삭제
        return await Axios({
          url: API.MYPAGE.MY_BASKET_DELETE,
          method: 'post',
          data: [...pdfList]
        }).then((response) => {
          if (response?.data?.code === '200') {
            userContext.actions.actDelCartCount(pdfList.length) //헤더 장바구니 담은 수 변경
            return true
          } else {
            return false
          }
        })
      }, [])

    //화물서비스 주문인경우 운송의뢰 호출
    const orderDvryRequest = useCallback(async(ordnInfoId) => {
        return await Axios({
            url: API.ORDER.MY_ORDER_PRODUCT_DVRY_REQUEST,
            method: 'post',
            data: { ordnInfoId : ordnInfoId }
        }).then((response) => {
        })
    },[])

    useEffect(() => {
        if(orderData.selrUserId == "" || orderData.ordnInfoId == "" || orderData.products.length == 0) {
            setPopupAlert({...popupAlert, active: true, msg: '결제 요청 중 오류가 발생하였습니다.', btnMsg: '닫기'})
            return;
        }else{
            //연계시작
            handlePay();
        }
    }, []);

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
                    <div>- <span className="blue">휴대폰 기본 카메라</span>로 <span className="blue">QR 코드</span>를 인식해주세요.</div>
                    <div>- <span className="blue">안드로이드 기종</span>(삼성,LG 등 아이폰이 아닌 기종)만 <span className="blue">결제가 가능</span>합니다.</div>
                    <div>- <span className="blue">아이폰(IOS) 유저</span>의 경우 판매자에게 <span className="blue">직접 결제 문의</span>를 해주세요.</div>
                    <div>- <span className="blue">휴대폰에서 결제</span>가 완료된 경우, <span className="blue">PC화면의 [결제완료]버튼을 클릭</span>해주세요.</div>
                </div>
                <div className="qr_tag_wrap">
                    {
                        boxPosPayData?.lnkStlmSrn != '' ?
                            <Button className="btn full_blue qr_btn" onClick={payResponseCheck}>결제완료</Button>
                            :
                            null
                    }
                    <Button className="btn full_blue qr_btn" onClick={handlePay}>결제팝업</Button>
                </div>
            </div>
        </>
    )
}
export default BoxPosPayment;