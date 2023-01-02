import { useState, useCallback, useEffect } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import AdressSearch from 'components/AdressSearch'
import PopupCargoList from 'components/mypage/estimation/PopupCargoList'
import PopupAlert from 'components/PopupAlert'

const DeliveryCargo = (props) => {
  const { productInfo, destInfo, setDest } = props
  const [addressType, setAddressType] = useState(null)
  const [popupAddress, setPopupAddress] = useState(false)
  const [popupCargo, setPopupCargo] = useState({ active: false, list: [] })
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '', msgBtn: '확인' })

  const handlePopupAddress = useCallback(
    (type) => {
      setPopupAddress(!popupAddress)
      setAddressType(type)
    },
    [popupAddress]
  )

  const handlePopupCargo = useCallback(() => {
    setPopupCargo({ ...popupCargo, active: !popupCargo })
  }, [popupCargo])

  const handlePopupAlert = useCallback(() => {
    setPopupAlert({ ...popupAlert, active: !popupAlert })
  }, [popupAlert])

  const setAddress = useCallback(
    (data) => {
      if (addressType === 'rcar')
        setDest({ ...destInfo, rcarZpcd: data.zonecode, rcarAdr: data?.roadAddress ?? data.jibunAddress })
      else if (addressType === 'rlont')
        setDest({ ...destInfo, rlontfZpcd: data.zonecode, rlontfAdr: data?.roadAddress ?? data.jibunAddress })
      handlePopupAddress()
    },
    [destInfo, popupAddress]
  )

  const onChangeForm = useCallback(
    (e) => {
      let destination = { ...destInfo }
      destination[e.target.id] = e.target.value
      setDest({ ...destination })
    },
    [destInfo]
  )

  const onChangeCellNum = useCallback(
    (e) => {
      let value = e.target.value
      value = value.replace(/[^0-9]/g, '')
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

      let finish = result.filter((val) => val).join('-')
      let destination = { ...destInfo }
      destination['rcarCnplone'] = finish
      setDest({ ...destination })
    },
    [destInfo]
  )

  const handleSelectCargoEnt = (cargo) => {
    setDest({ ...destInfo, ...cargo })
    handlePopupCargo()
  }

  const handleCargoList = useCallback(() => {
    if (destInfo?.rcarZpcd === '' || destInfo?.rlontfZpcd === '') {
      setPopupAlert({ ...popupAlert, active: !popupAlert?.active, msg: '주소를 입력 해주세요.' })
      return
    }
    if (destInfo?.rcarNm === '' || destInfo?.rcarCnplone === '') {
      setPopupAlert({ ...popupAlert, active: !popupAlert?.active, msg: '받는 분의 정보를 입력 해주세요.' })
      return
    }
    postEstimationDeliveryList()
  })

  const postEstimationDeliveryList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_DELIVERY_LIST,
      method: 'post',
      data: { ...destInfo, items: productInfo }
    }).then((response) => {
      if (response?.data?.code === '200')
        setPopupCargo({ active: !popupCargo?.active, list: response.data.data.list[0] })
      else if (response?.data?.code === '400' && response?.data?.message)
        setPopupAlert({ ...popupAlert, active: !popupAlert?.active, msg: response.data.message })
    })
  }, [productInfo, destInfo])

  return (
    <>
      {popupAddress && <AdressSearch closePopup={handlePopupAddress} setAddress={setAddress} />}
      {popupCargo?.active && (
        <PopupCargoList
          type={'estimation'}
          cargoData={popupCargo?.list}
          closePopup={handlePopupCargo}
          handleSelectCargoEnt={(cargo) => handleSelectCargoEnt(cargo)}
        />
      )}
      {popupAlert?.active && (
        <PopupAlert
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={popupAlert?.msgBtn}
          handlePopup={handlePopupAlert}
        />
      )}
      <div className="delivery_price_wrap type03 place">
        <div className="delivery_left">상품 출고지</div>
        <div className="delivery_right">
          <div className="address_wrap">
            <div className="address_top">
              <input
                type="text"
                className="input"
                placeholder="우편번호입력"
                value={destInfo?.rlontfZpcd ?? ''}
                disabled
                title={'rlontfZpcd'}
              />
              <Button className="btn full_blue find" onClick={() => handlePopupAddress('rlont')}>
                우편번호 찾기
              </Button>
            </div>
            <div className="address_bot">
              <input
                type="text"
                className="input"
                placeholder="주소입력"
                value={destInfo?.rlontfAdr ?? ''}
                disabled
                title={'rlontfAdr'}
              />
              <input
                type="text"
                className="input"
                placeholder="상세주소"
                id={'rlontfDtad'}
                value={destInfo?.rlontfDtad ?? ''}
                onChange={onChangeForm}
                title={'rlontfDtad'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="delivery_price_wrap type03 oneline">
        <div className="delivery_left">받는 분 성명</div>
        <div className="delivery_right">
          <div className="address_wrap">
            <div className="address_top">
              <input
                type="text"
                className="input"
                placeholder="성명"
                id={'rcarNm'}
                value={destInfo?.rcarNm ?? ''}
                onChange={onChangeForm}
                title={'rcarNm'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="delivery_price_wrap type03 oneline">
        <div className="delivery_left">받는 분 연락처</div>
        <div className="delivery_right">
          <div className="address_wrap">
            <div className="address_top">
              <input
                type="text"
                className="input"
                placeholder="연락처"
                id={'rcarCnplone'}
                value={destInfo?.rcarCnplone ?? ''}
                maxLength={13}
                onChange={onChangeCellNum}
                title={'rcarCnplone'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="delivery_price_wrap type03 service">
        <div className="delivery_left">받는 분 주소</div>
        <div className="delivery_right">
          <div className="address_wrap">
            <div className="address_top">
              <input
                type="text"
                className="input"
                placeholder="우편번호입력"
                value={destInfo?.rcarZpcd ?? ''}
                disabled
                title={'rcarZpcd'}
              />
              <Button className="btn full_blue find" onClick={() => handlePopupAddress('rcar')}>
                우편번호 찾기
              </Button>
            </div>
            <div className="address_bot">
              <input
                type="text"
                className="input"
                placeholder="주소입력"
                value={destInfo?.rcarAdr ?? ''}
                disabled
                title={'rcarAdr'}
              />
              <input
                type="text"
                className="input"
                placeholder="상세주소"
                id={'rcarDtlAdr'}
                value={destInfo?.rcarDtlAdr ?? ''}
                onChange={onChangeForm}
                title={'rcarDtlAdr'}
              />
            </div>
            <div className="service_wrap">
              <Button className="btn full_blue" onClick={handleCargoList}>
                화물서비스 선택
              </Button>
              {destInfo?.entpNm ? (
                <p className="text">
                  이용 택배사 : <span className="bold">{destInfo?.entpNm}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeliveryCargo
