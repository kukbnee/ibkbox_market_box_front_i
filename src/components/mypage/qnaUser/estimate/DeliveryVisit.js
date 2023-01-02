import { useState, useCallback } from 'react'
import Button from 'components/atomic/Button'
import AdressSearch from 'components/AdressSearch'

const DeliveryVisit = (props) => {
  const { destInfo, setDest } = props
  const [addressPopup, setAddressPopup] = useState(false)

  const handleAddressPopup = useCallback(() => {
    setAddressPopup(!addressPopup)
  }, [addressPopup])

  const setAddress = useCallback(
    (data) => {
      setDest({ ...destInfo, rcarZpcd: data.zonecode, rcarAdr: data?.roadAddress ?? data.jibunAddress })
      handleAddressPopup()
    },
    [destInfo, addressPopup]
  )

  const onChangeForm = useCallback(
    (e) => {
      let destination = { ...destInfo }
      destination[e.target.id] = e.target.value
      setDest({ ...destination })
    },
    [destInfo]
  )

  return (
    <>
      {addressPopup && <AdressSearch closePopup={handleAddressPopup} setAddress={setAddress} />}
      <div className="delivery_price_wrap type03">
        <div className="delivery_left">상품수령 위치</div>
        <div className="delivery_right">
          <div className="address_wrap">
            <div className="address_top">
              <input
                type="text"
                className="input"
                placeholder="우편번호입력"
                value={destInfo?.rcarZpcd}
                disabled
                title={'rcarZpcd'}
              />
              <Button className="btn full_blue find" onClick={handleAddressPopup}>
                우편번호 찾기
              </Button>
            </div>
            <div className="address_bot">
              <input
                type="text"
                className="input"
                placeholder="주소입력"
                value={destInfo?.rcarAdr}
                disabled
                title={'rcarAdr'}
              />
              <input
                type="text"
                className="input"
                placeholder="상세주소"
                id={'rcarDtlAdr'}
                onChange={onChangeForm}
                title={'rcarDtlAdr'}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeliveryVisit
