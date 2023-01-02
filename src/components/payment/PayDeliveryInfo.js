import { useState, useEffect, useCallback } from 'react'
import Button from 'components/atomic/Button'
import Badge from 'components/atomic/Badge'
import Checkbox from 'components/atomic/Checkbox'
import AdressSearch from 'components/AdressSearch'
import PayDeliveryCargo from 'components/payment/PayDeliveryCargo'
import PayDeliveryVisit from 'components/payment/PayDeliveryVisit'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'

const PayDeliveryInfo = (props) => {
  const { data, paramsOrder, setParamsOrder, setPayData, axiosData, type,setIsFreightOpen } = props
  const [popupAddress, setPopupAddress] = useState(false)
  const [saveDvryInfo, setSaveDvryInfo] = useState(false) //다음에도 같은 배송지 사용하기
  const [cnplone, setCnplone] = useState({ //연락처 정보
    cpSt01: '',
    cpNd01: '',
    cpRd01: '',
    cpSt02: '',
    cpNd02: '',
    cpRd02: ''
  })

  const screenList = {
    GDS02001: <PayDeliveryCargo data={data?.deliveryEsmInfo} />, //화물서비스
    GDS02004: <PayDeliveryVisit data={data?.deliveryEsmInfo} /> //방문수령
  }

  const handlePopupAddress = useCallback(() => {
    setPopupAddress(!popupAddress)
  }, [popupAddress])

  const setAddress = useCallback(
    async (data) => {
      setParamsOrder({
        ...paramsOrder,
        recvZpcd: data?.zonecode, //우편번호
        recvAdr: data?.roadAddress, //주소
        recvDtad: '' //상세주소
      })
      handlePopupAddress()

      if (type === 'BASKET') {
        await Axios({
          url: API.ORDER.PAY_PRODUCT,
          method: 'post',
          data: { ...axiosData, addr: data?.roadAddress }
        }).then((response) => {
          if (response?.data?.code === '200') {
            const useDelivery = {
              adr: data?.roadAddress,
              cnplone: data?.deliveryInfo?.cnplone,
              cnpltwo: data?.deliveryInfo?.cnpltwo,
              dlplUseYn: 'N',
              dtlAdr: '',
              mmbrsttsId: data?.deliveryInfo?.mmbrsttsId,
              recv: data?.deliveryInfo?.recv,
              zpcd: data?.zonecode,
            }
            setPayData({...response?.data?.data, deliveryInfo:{...useDelivery}})
            setIsFreightOpen(false)
          }
        })
      }
    },
    [paramsOrder, popupAddress]
  )
  const onChangeForm = useCallback((e) => { //배송정보 입력
    let dvryInfo = { ...paramsOrder }
    dvryInfo[e.target.id] = e.target.value
    setParamsOrder({ ...dvryInfo })
  }, [paramsOrder])

  const onChangeCnplone = useCallback((e) => { //연락처 입력
    let cellNo = { ...cnplone }
    let dvryInfo = { ...paramsOrder }
    let regExp = /[^0-9|-]/g
    let text = e.target.value.replace(regExp, '')

    cellNo[e.target.id] = text
    setCnplone({ ...cellNo })
    dvryInfo['recvCnplone'] = (
      document.getElementById('cpSt01').value +
      '-' +
      document.getElementById('cpNd01').value +
      '-' +
      document.getElementById('cpRd01').value
    ).toString()
    dvryInfo['recvCnpltwo'] = (
      document.getElementById('cpSt02').value +
      '-' +
      document.getElementById('cpNd02').value +
      '-' +
      document.getElementById('cpRd02').value
    ).toString()
    setParamsOrder({ ...dvryInfo })
  }, [paramsOrder, cnplone])

  const handleSaveDvryInfo = useCallback(() => { //입력 정보 저장
    setSaveDvryInfo(!saveDvryInfo)
    setParamsOrder({ ...paramsOrder, dlplUseYn: !saveDvryInfo === true ? 'Y' : 'N' })
  }, [saveDvryInfo, paramsOrder])


  const onChangeFormCnplNo = useCallback((cellNo) => { //연락처 형태 체크

    if(cellNo?.search('-') < 0){  //전화번호가 '-' 없이 등록된 경우
      let value = cellNo.replace(/[^0-9]/g, '')
      let result = []
      let restNumber = ''
      if (value.startsWith('02')) {
        result.push(value.substr(0, 2))
        restNumber = value.substring(2)
      } else if (value.startsWith('1')) {
        restNumber = value
      } else {
        result.push(value.substr(0, 3))
        restNumber = value.substring(3)
      }
      if (restNumber.length === 7) {
        result.push(restNumber.substring(0, 3))
        result.push(restNumber.substring(3))
      } else {
        result.push(restNumber.substring(0, 4))
        result.push(restNumber.substring(4))
      }

      return result

    } else { //전화번호가 '-' 포함하여 등록된 경우
      return cellNo?.split('-') || ''
    }

  }, [])

  useEffect(() => { //연락처 표시
    if (data?.deliveryEsmInfo?.rcarCnplone) { //견적 결제
      let cellNo = (data?.deliveryEsmInfo?.rcarCnplone).split('-')
      if (cellNo.length) {
        setCnplone({
          ...cnplone,
          cpSt01: cellNo[0],
          cpNd01: cellNo[1],
          cpRd01: cellNo[2]
        })
      }
    }

    if (data?.deliveryInfo?.dlplUseYn === 'Y' && (data?.deliveryInfo?.cnplone || data?.deliveryInfo?.cnpltwo)) { //장바구니 결제, 상품 결제
 
      let cellNo1 = data?.deliveryInfo?.cnplone ? onChangeFormCnplNo(data?.deliveryInfo?.cnplone) : [''] //연락처 1
      let cellNo2 = data?.deliveryInfo?.cnpltwo ? onChangeFormCnplNo(data?.deliveryInfo?.cnpltwo) : [''] //연락처 2

      if (cellNo1.length || cellNo2.length) {
        setCnplone({
          ...cnplone,
          cpSt01: cellNo1[0],
          cpNd01: cellNo1[1],
          cpRd01: cellNo1[2],
          cpSt02: cellNo2[0],
          cpNd02: cellNo2[1],
          cpRd02: cellNo2[2]
        })
      }
    }
  }, [data])

  useEffect(() => {
    setSaveDvryInfo(paramsOrder?.dlplUseYn === 'Y' ? true : false)
  },[paramsOrder])

  return (
    <>
      {popupAddress && <AdressSearch closePopup={handlePopupAddress} setAddress={setAddress} />}
      <div className="toggle_card_layout active">
        <div className="toggle_card_header">
          <div className="title">배송 정보</div>
        </div>
        <div className="toggle_card_container">
          <div className="table_list_wrap type02 ">
            <ul className="table_list ">
              {screenList?.[data?.dvryPtrnId] ? ( //견적결제 && 배송타입 == 화물서비스/직접배송
                screenList?.[data?.dvryPtrnId]
              ) : ( //그 외 결제
                <>
                  <li className="table_row">
                    <div className="item_section">
                      <div className="cell cell_label cell_header first cell_full_header">
                        <span className="label">수령인</span>
                        <Badge className={'linear_full_pink'}>필수</Badge>
                      </div>
                      <div className="cell cell_value02 first cell_full_value">
                        <div className="input_total_wrap">
                          <input
                            type="text"
                            className="input"
                            id={'recv'}
                            maxLength={10}
                            value={paramsOrder?.recv ?? ''}
                            onChange={onChangeForm}
                            title={`recv`}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="table_row">
                    <div className="item_section">
                      <div className="cell cell_label cell_header cell_full_header">
                        <span className="label">배송지</span>
                        <Badge className={'linear_full_pink'}>필수</Badge>
                      </div>
                      <div className="cell cell_value02 cell_line3 cell_full_value">
                        <div className="input3_wrap">
                          <input
                            type="text"
                            className="input"
                            placeholder=""
                            value={paramsOrder?.recvZpcd ?? ''}
                            disabled
                            title={`recvZpcd`}
                          />
                          <Button className="btn full_blue" onClick={handlePopupAddress}>
                            우편번호 찾기
                          </Button>
                        </div>
                        <div className="input3_wrap">
                          <input
                            type="text"
                            className="input"
                            placeholder=""
                            value={paramsOrder?.recvAdr ?? ''}
                            disabled
                            title={`recvAdr`}
                          />
                        </div>
                        <div className="input3_wrap">
                          <input
                            type="text"
                            className="input"
                            placeholder="상세주소"
                            id={'recvDtad'}
                            maxLength={100}
                            value={paramsOrder?.recvDtad ?? ''}
                            onChange={onChangeForm}
                            title={`recvDtad`}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="table_row">
                    <div className="item_section">
                      <div className="cell cell_label cell_header cell_full_header">
                        <span className="label">연락처1</span>
                        <Badge className={'linear_full_pink'}>필수</Badge>
                      </div>
                      <div className="cell cell_value02 cell_full_value">
                        <div className="input_phone_wrap">
                          <input
                            type="text"
                            className="input"
                            id={'cpSt01'}
                            maxLength={3}
                            value={cnplone?.cpSt01}
                            onChange={onChangeCnplone}
                            title={`cpSt01`}
                          />
                          -
                          <input
                            type="text"
                            className="input"
                            id={'cpNd01'}
                            maxLength={4}
                            value={cnplone?.cpNd01}
                            onChange={onChangeCnplone}
                            title={`cpNd01`}
                          />
                          -
                          <input
                            type="text"
                            className="input"
                            id={'cpRd01'}
                            maxLength={4}
                            value={cnplone?.cpRd01}
                            onChange={onChangeCnplone}
                            title={`cpRd01`}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="table_row">
                    <div className="item_section">
                      <div className="cell cell_label cell_header cell_full_header">
                        <span className="label">연락처2</span>
                      </div>
                      <div className="cell cell_value02 cell_full_value">
                        <div className="input_phone_wrap">
                          <input
                            type="text"
                            className="input"
                            id={'cpSt02'}
                            maxLength={3}
                            value={cnplone?.cpSt02}
                            onChange={onChangeCnplone}
                            title={`cpSt02`}
                          />
                          -
                          <input
                            type="text"
                            className="input"
                            id={'cpNd02'}
                            maxLength={4}
                            value={cnplone?.cpNd02 || ''}
                            onChange={onChangeCnplone}
                            title={`cpNd02`}
                          />
                          -
                          <input
                            type="text"
                            className="input"
                            id={'cpRd02'}
                            maxLength={4}
                            value={cnplone?.cpRd02 || ''}
                            onChange={onChangeCnplone}
                            title={`cpRd02`}
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              )}
              {type === 'BASKET' && ( //장바구니 결제일 때만 사용
                <div className="save_shipping">
                  <Checkbox
                    className={'type02 negotiate'}
                    id={`negotiate`}
                    label={'다음 주문도 같은 배송지 사용하기'}
                    onChange={() => handleSaveDvryInfo()}
                    checked={saveDvryInfo}
                  />
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default PayDeliveryInfo
