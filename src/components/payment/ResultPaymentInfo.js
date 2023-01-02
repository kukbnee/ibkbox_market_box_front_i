import {BoxPosPcRmteStlmInq} from "modules/payment/BoxPos";
import { useCallback, useState, useEffect, useContext } from 'react'
import Button from 'components/atomic/Button'
import { UserContext } from 'modules/contexts/common/userContext'
import BoxPosPaymentCancel from "./BoxPosPaymentCancel";
import moment from 'moment'
import ReturnListItem from "components/mypage/orderManagement/Return/ReturnListItem";

const ResultPaymentInfo = (props) => {

  const { data } = props;
  const userContext = useContext(UserContext)

  const [ payInfo, setPayInfo ] = useState(
      {
        acqrNm:'', //카드사
        cardNo:'',  //카드번호
        stlmWayDcdDesc:'', //결제수단
        pgrsSttsCd : '', //결제 진행 상태 코드( 1:결제요청전, 2:결제전, 3:결제완료, 4:취소수락전, 5:취소수락, 6:취소완료)
      }
  );

  const [cancelInfo, setCancelInfo] = useState({
    pucsState : false, //구매자여부
    payCancelState : false //QR팝업
  });

  //상품수에서 상품상태의 수 리턴
  const findStateLen = useCallback((data, state) => {
    return data?.products?.filter(item => item.ordnSttsId == `${state}`).length;
  },[data])

  const handleCancelPay = useCallback(() => {
    setCancelInfo({...cancelInfo,payCancelState : true});
  },[data])

  //결제 취소일때 취소 일자 포맷
  const onFormDate = useCallback((date) =>{ 

    let year = date.substr(0,4)
    let month = date.substr(4,2)
    let day = date.substr(6,2)
    let hour = date.substr(8,2)
    let min = date.substr(10,2)
  
    return `${year}-${month}-${day} ${hour}:${min}`
  })


  useEffect(async() => {
    //결제정보
    const getPcRmteStlmInq = await BoxPosPcRmteStlmInq(data.stlmRsltId);
    if(getPcRmteStlmInq != null){
      setPayInfo({
        acqrNm: getPcRmteStlmInq.acqrNm,
        cardNo: getPcRmteStlmInq.cardNo,
        stlmWayDcdDesc: getPcRmteStlmInq.stlmWayDcdDesc,
        pgrsSttsCd: getPcRmteStlmInq.pgrsSttsCd,
      });
    }

    //구매자 여부 판단
    if(userContext?.state?.userInfo.utlinsttId == (data?.pucsUsisId != undefined && data?.pucsUsisId)) {
      //주문취소 승인 경우
      if(data?.products?.length == findStateLen(data, 'ODS00002')){
        setCancelInfo({
          pucsState : true,
          payCancelState : false
        });
      }
    }

  }, [data]);

  return (
    <>
      <div className="toggle_card_layout active">
        <div className="toggle_card_header">
          <div className="title">결제 정보</div>
        </div>
        <div className="toggle_card_container">
          <div className="payment_info">
            <div className="text_wrap">결제방법</div>
            <div className="contents_wrap">
              {payInfo?.cardNo && (
                <>
                  <p className="account">{`${payInfo?.acqrNm}(${payInfo?.cardNo})`}</p>
                  <p className="type">{payInfo?.pgrsSttsCd === '6' && data?.products?.[0].ordnSttsId === 'ODS00008' ? '결제 취소 완료' : payInfo?.stlmWayDcdDesc}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {cancelInfo?.payCancelState ? <BoxPosPaymentCancel orderData={data} /> : null}

        {
          cancelInfo?.pucsState && !cancelInfo?.payCancelState ?
              <>
                <div className="payment_button margin_bottom_zero">
                  <Button className="btn full_blue" onClick={handleCancelPay}>결제취소</Button>
                </div>
              </>
              :
              <></>
        }

      </div>
    </>
  )
}

export default ResultPaymentInfo
