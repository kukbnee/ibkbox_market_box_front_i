import {useState, useEffect, useCallback} from 'react'
import Button from 'components/atomic/Button'
import {addComma} from 'modules/utils/Common'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import Badge from 'components/atomic/Badge'
import PopupAlert from 'components/PopupAlert'

const PayProductFeeItem = (props) => {

  const { screenSize, data, index, paramsOrder,setParamsOrder,setIsFreightOpen, isFreightOpen,setPayData,payData } = props
  const [isBlock, setIsBlock] = useState(false)
  const [freightInfo, setFreightInfo] =useState({entpNm:'', dvryBscprce:'', apiResultYn:''})

  const [popupAlert, setPopupAlert] = useState({
    active: false,
    className: 'popup_review_warning',
    msg: null,
    caseMsg: [],
    msg2: null,
    btnMsg: '확인'
  })

  const handlePopupAlert = () => {
    setPopupAlert({ ...popupAlert, active: !popupAlert, msg: null, caseMsg: [], msg2: null })
  }

  const checkCargoFee = useCallback(async()=>{

    if(paramsOrder?.recvAdr == "") {
      setPopupAlert({...popupAlert, active: true, msg: '확인 가능한 주소정보가 없습니다.', btnMsg: '닫기'})
      return;
    }

    await Axios({
      url: API.ORDER.PAY_PRODUCT_FREIGHT_INFO,
      method: 'post',
      data: {
        recvZpcd: paramsOrder?.recvZpcd,
        recvAdr: paramsOrder?.recvAdr,
        recvDtad: paramsOrder?.recvDtad,
        pdfQty: data?.productQty.toString(),
        dvryPtrnId : data?.productDelInfo?.dvryPtrnId,
        pdfInfoId : data?.productInfo?.pdfInfoId,
      }
    }).then(response=>{
      let _paramOrder = {...paramsOrder}
      let _entpNm=  response?.data?.data?.list[0]?.dvryEntps[0]?.entpNm
      let _dvrynone= response?.data?.data?.list[0]?.dvryEntps[0]?.dvrynone
      let _apiResultYn= response?.data?.data?.list[0]?.dvryEntps[0]?.apiResultYn //Y:운임체크 완료, N:운임불가
      let _apiResultTxt= response?.data?.data?.list[0]?.dvryEntps[0]?.apiResultTxt //운임불가 내용
      let _payData={...payData}
      let _products = (_payData?.products)
        ? [..._payData.products].map(item => {
            if (item?.productInfo?.pdfInfoId === data?.productInfo?.pdfInfoId) {
                // 운임체크 에러 시, 팝업 메세지 띄움
                if(_apiResultYn === 'N') {
                  setPopupAlert({active:true, msg:"해당 상품 및 조건은 현재 설정한 화물서비스를 이용하실 수 없습니다. 판매자에게 문의하여 결제를 진행해주세요."})
                  return {...item, productDeliveryPay: _dvrynone, productDelInfo: {...item.productDelInfo}}
                }
                setFreightInfo({entpNm: _entpNm, dvryBscprce: _dvrynone, apiResultYn: _apiResultYn})
                return {...item, productDeliveryPay: _dvrynone, productDelInfo: {...item.productDelInfo, dvryBscprce: _dvrynone, entpNm: _entpNm, apiResultYn: _apiResultYn, apiResultTxt: _apiResultTxt}}
            }
            return {...item}
        })
        : [];
      setParamsOrder({..._paramOrder, dlplUseYn : 'Y'})
      let totalDeliveryPay = _products.reduce((acc, curr)=> acc+curr.productDeliveryPay,0)
      let productPay =_payData.totalProductPay
      setPayData({..._payData,totalProductDeliveryPay: totalDeliveryPay, totalProductPay:productPay, products:[..._products], deliveryInfo:{..._payData.deliveryInfo, dlplUseYn : 'N'}})

      setIsFreightOpen(true)
    })
  },[setIsFreightOpen,paramsOrder,data])

  const dvryList = {
    GDS02001: '화물서비스',
    GDS02002: '직접배송',
    GDS02003: '무료배송',
    GDS02004: '구매자 직접 수령'
  }
  useEffect(() => {
    if(data?.payUsed === 'N') setIsBlock(true)
  }, [data, freightInfo])

  useEffect(()=>{
    setFreightInfo({entpNm:'', dvryBscprce:''})
  },[paramsOrder?.recvZpcd])

  return (
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

        {screenSize === 'mo'
            ? <div className={isBlock ? "resp_mo_wrap blur" : "resp_mo_wrap"}>
              < div className="resp_table resp_head">{index+1}</div>
              <div className="resp_table">
                <div className="resp_name">주문상품정보</div>
                <div className="resp_content">
                  <div className="resp_contents">
                    <div className="img_wrap">
                      <img src={`${data?.productFieInfo?.imgUrl}`} alt={data?.productInfo?.pdfNm} />
                    </div>
                    <div className="text_wrap">
                      {data?.productInfo?.pdfAgenState === 'Y' &&
                      <div className="name_badge_wrap">
                        <Badge className="badge full_blue">에이전시</Badge>
                      </div>
                      }
                      {data?.productInfo?.selrComapnyName && <p className="name">{data?.productInfo?.selrComapnyName}</p>}
                      <p className="desc">{data?.productInfo?.pdfNm}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="resp_table">
                <div className="resp_name">판매가</div>
                {Number(data?.productSalInfo?.salePrc) > 0 ? (
                    <div className="resp_content">
                      <div className="change_price_wrap" style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <p className="before_price">{addComma(Number(data?.productSalInfo?.pdfPrc))}원</p>
                        <p className="change_price">{addComma(Number(data?.productSalInfo?.salePrc))}원</p>
                      </div>
                    </div>
                ) : (
                    <div className="resp_content">{addComma(Number(data?.productSalInfo?.pdfPrc))}원</div>
                )}
              </div>
              <div className="resp_table">
                <div className="resp_name">수량</div>
                <div className="resp_content">{data?.productQty ? addComma(Number(data?.productQty)) : 0}개</div>
              </div>
              <div className="resp_table">
                <div className="resp_name">주문금액</div>
                <div className="resp_content price">{data?.productPay ? addComma(Number(data?.productPay)) : 0}원</div>
              </div>
              <div className="resp_table">
                <div className="resp_name">배송</div>
                {data?.productDelInfo?.dvryPtrnId === 'GDS02001'
                    ? isFreightOpen && freightInfo?.dvryBscprce!==0 ?
                        <div className="resp_content">
                          {
                            freightInfo?.dvryBscprce && freightInfo?.apiResultYn === 'Y' ?
                                addComma(freightInfo?.dvryBscprce) : 0}원 (화물서비스 : {freightInfo?.entpNm})</div>
                                : <Button className="btn full_blue chk_btn" onClick={()=>checkCargoFee()}>운임체크</Button>
                    : <div className="resp_content">{data?.productDeliveryPay ? addComma(Number(data?.productDeliveryPay)) : 0}원 ({dvryList?.[data?.productDelInfo?.dvryPtrnId]})</div>
                }
              </div>
            </div>

            : <div className={isBlock ? "table_tr blur" : "table_tr"}>
              <div className="table_td">
                <div className="cell info">
                  <div className="contents_wrap">
                    <div className="img_wrap">
                      <img src={`${data?.productFieInfo?.imgUrl}`} alt={data?.productInfo?.pdfNm} />
                    </div>
                    <div className="text_wrap">
                      {data?.productInfo?.pdfAgenState === 'Y' &&
                      <div className="name_badge_wrap">
                        <Badge className="badge full_blue">에이전시</Badge>

                      </div>
                      }
                      {data?.productInfo?.selrComapnyName && <p className="name">{data?.productInfo?.selrComapnyName}</p>}
                      <p className="desc">{data?.productInfo?.pdfNm}</p>
                    </div>
                  </div>
                </div>
                {Number(data?.productSalInfo?.salePrc) > 0 ? (
                    <div className="cell sale">
                      <div className="change_price_wrap">
                        <p className="before_price">{addComma(Number(data?.productSalInfo?.pdfPrc))}원</p>
                        <p className="change_price">{addComma(Number(data?.productSalInfo?.salePrc))}원</p>
                      </div>
                    </div>
                ) : (
                    <div className="cell sale">{addComma(Number(data?.productSalInfo?.pdfPrc))}원</div>
                )}
                <div className="cell quantity">{data?.productQty ? addComma(Number(data?.productQty)) : 0}개</div>
                <div className="cell price">{data?.productPay ? addComma(Number(data?.productPay)) : 0}원</div>
                <div className="cell ship">
                  <div className="ship_wrap">
                    {data?.productDelInfo?.dvryPtrnId === 'GDS02001'
                        ? isFreightOpen && freightInfo?.dvryBscprce!=='' && freightInfo?.apiResultYn === 'Y' ?
                            <div className="pricetext">{freightInfo?.dvryBscprce && addComma(freightInfo?.dvryBscprce)}원
                              <div className='type'> (화물서비스 : {freightInfo?.entpNm})</div>
                            </div>
                            : <Button className="btn full_blue chk_btn" onClick={()=>checkCargoFee()}>운임체크</Button>
                        : <div className="pricetext">{data?.productDeliveryPay ? addComma(Number(data?.productDeliveryPay)) : 0}원
                          <div className='type'>({dvryList?.[data?.productDelInfo?.dvryPtrnId]})</div>
                        </div>
                    }
                  </div>
                </div>
              </div>
            </div>
        }
      </>
  )
}

export default PayProductFeeItem
