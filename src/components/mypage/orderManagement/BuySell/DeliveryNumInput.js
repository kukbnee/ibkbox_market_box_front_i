import { useState, useCallback } from 'react'
import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'

const DeliveryNumInput = (props) => {
  const { paramsDvry, setParamsDvry, handlePopup } = props
  const [cargoCode, setCargoCode] = useState({
    active: 'default',
    list: [
      { id: 'default', label: '택배사 선택' },
      { id: 'ODS01001', label: 'CJ대한통운' },
      { id: 'ODS01002', label: '우체국택배' },
      { id: 'ODS01003', label: '한진택배' },
      { id: 'ODS01004', label: '롯데택배' },
      { id: 'ODS01005', label: '로젠택배' },
      { id: 'ODS01006', label: '천일택배' },
      { id: 'ODS01007', label: '일양로지스' },
      { id: 'ODS01008', label: '홈픽택배' },
      { id: 'ODS01009', label: 'EMS' },
      { id: 'ODS01010', label: '대신택배' },
      { id: 'ODS01011', label: '경동택배' },
      { id: 'ODS01012', label: '합동택배' },
      { id: 'ODS01013', label: '기타(직접입력)' }
    ]
  })
  const cargoCoList = {
    default: '택배사 선택',
    ODS01001: 'CJ대한통운',
    ODS01002: '우체국택배',
    ODS01003: '한진택배',
    ODS01004: '롯데택배',
    ODS01005: '로젠택배',
    ODS01006: '천일택배',
    ODS01007: '일양로지스',
    ODS01008: '홈픽택배',
    ODS01009: 'EMS',
    ODS01010: '대신택배',
    ODS01011: '경동택배',
    ODS01012: '합동택배',
    ODS01013: '기타'
  }

  const handleCargoCode = useCallback(
    (e) => {
      setCargoCode({ ...cargoCode, active: e.target.value })
      setParamsDvry({ ...paramsDvry, pcsvcmpPtrnId: e.target.value })
    },
    [cargoCode, paramsDvry]
  )

  const onChangeForm = useCallback(
    (e) => {
      let _params = { ...paramsDvry }
      _params[e.target.id] = e.target.value
      setParamsDvry({ ..._params })
    },
    [paramsDvry]
  )

  return (
    <div className="popup_wrap popup_alert delivery_num_input">
      <div className="layer">&nbsp;</div>
      <div className="container">
        <BtnClose onClick={() => handlePopup('close')} />
        <div className="popup_content">
          <h1 className="msg">배송 정보 입력</h1>
          <div className="input_box_wrap">
            <div className="delivery_company_select_wrap">
              <select className={'select'} onChange={handleCargoCode} value={cargoCode?.active} title={'cargoCode'}>
                {cargoCode?.list?.map((company, idx) => (
                  <option key={company.id + idx} value={company.id}>
                    {company.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="input active"
                maxLength="100"
                placeholder="택배사를 입력해주세요."
                id={'pcsvcmpNm'}
                value={cargoCode?.active === 'ODS01013' ? paramsDvry?.pcsvcmpNm : cargoCoList?.[cargoCode?.active]}
                disabled={cargoCode?.active === 'ODS01013' ? false : true}
                onChange={onChangeForm}
                title={'pcsvcmpNm'}
              />
            </div>
            <div className="delivery_num_input_wrap">
              <input
                type="number"
                className={paramsDvry?.mainnbNoAlert ? 'input active' : 'input'}
                placeholder="운송장 번호 -없이 입력"
                id={'mainnbNo'}
                value={paramsDvry?.mainnbNo}
                onChange={onChangeForm}
                title={'mainnbNo'}
              />
              {paramsDvry?.mainnbNoAlert && <p className="notify active">운송장 번호를 입력해주세요&#46;</p>}
            </div>
          </div>
        </div>
        <div className="popup_footer">
          <div className="button_wrap">
            <Button className={'btn linear_blue'} onClick={() => handlePopup('close')}>
              취소
            </Button>
            <Button className={'btn full_blue'} onClick={() => handlePopup('save')}>
              저장
            </Button>
          </div>
          <p className="notice_txt">&#42;배송정보 입력시 구매자에게 배송중 상태로 노출됩니다&#46;</p>
        </div>
      </div>
    </div>
  )
}

export default DeliveryNumInput
