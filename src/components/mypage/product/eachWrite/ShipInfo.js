import React, { useState, useCallback, useEffect } from 'react'
import Checkbox from 'components/atomic/Checkbox'
import Radio from 'components/atomic/Radio'
import Button from 'components/atomic/Button'
import Badge from 'components/atomic/Badge'
import AdressSearch from 'components/AdressSearch'
import AdditionalInfo from 'components/mypage/product/eachWrite/AdditionalInfo'
import QtyFee from 'components/mypage/product/eachWrite/QtyFeeItem'
import LocationFee from 'components/mypage/product/eachWrite/LocationFeeItem'
import { addComma } from 'modules/utils/Common'

const ShipInfo = (props) => {
  const { form, setForm,sellerInfo,saleInfo } = props
  const [toggle, setToggle] = useState(true)
  const [addressPopup, setAddressPopup] = useState(false)
  const shippingLocationList = [
    { id: 'GDS01001', label: '국내배송' },
    { id: 'GDS01002', label: '해외배송' },
    { id: 'GDS01003', label: '국내/해외배송' }
  ]

  const shippingTypeList = [
    {
      id: 'GDS02002',
      label: '직접배송 (IBK화물서비스를 이용하지않고 배송합니다.)'
    },
    {
      id: 'GDS02003',
      label: '무료배송 (구매자가 배송비를 지불하지 않습니다.)'
    },
    {
      id: 'GDS02001',
      label: '화물서비스 이용(IBK에 등록된 화물서비스에 대한 견적비교가 가능하며 결제가 이뤄졌을때 배송서비스를 이용할 수 있습니다. 단, 구매자가 배송비를 지불하더라도 기사님이 물건을 픽업할때 결제를 진행해야합니다.)'
    }
  ]

  const deliveryCode = [
    'GDS04001', //기본 배송비
    'GDS04002', //지역별 배송비
    'GDS04003', //수량별 배송비
    'GDS04004' //지역/수량별 배송비
    //GDS04005  화물서비스 견적
  ]

  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  const handleAddressPopup = useCallback(() => setAddressPopup(!addressPopup), [addressPopup])

  const setAddress = useCallback(
    (data) => {
      setForm({ ...form, rlontfZpcd: data.zonecode, rlontfAdr: data?.roadAddress ?? data.jibunAddress })
      handleAddressPopup()
    },
    [form, addressPopup]
  )

  const handleShipTypeList = useCallback(
    (e) => {
      if (e.target.id === 'GDS01001')
        setForm({
          ...form,
          dvryPtrnId: e.target.id
        })
      else {
        let _form = { ...form }
        _form.dvryPtrnId = e.target.id
        _form.dvryBscprce = 0
        _form.deliveryLocalInfoList = []
        _form.deliveryCntInfoList = []
        _form.deliveryProductServiceInfoList = []
        _form.fileId = ''
        setForm({ ..._form })
      }
    },
    [form]
  )

  const onChangeForm = useCallback(
    (e) => {
      let _form = { ...form }
      _form[e.target.id] = e.target.value
      setForm({ ..._form })
    },
    [form]
  )

  const onChangeNum = useCallback(
    (e) => {
      let _form = { ...form }
      let regex = /[^0-9]/g
      let result = e.target.value.replace(regex, '')
      if(result.length>12){
        result=result.substr(0,12)
      }
      _form[e.target.id] = result
      setForm({ ..._form })
    },
    [form]
  )
  const onChangeNumPoint = useCallback(
      (e) => {
        let _form = { ...form }
        let regex = /[^0-9.]/g
        let result = e.target.value.replace(regex, '')
        if(result.length>9 && result.includes('.')){
          result=result.substr(0,9)
        }else if(result.length>6 && !result.includes('.')){
          result=result.substr(0,6)
        }
        _form[e.target.id] = result
        setForm({ ..._form })
      },
      [form]
  )

  const onFocusForm = useCallback(
    (e) => {
      let _form = { ...form }
      switch (_form[e.target.id]) {
        case 0:
          _form[e.target.id] = ''
          setForm({ ..._form })
          break
        case '':
          _form[e.target.id] = 0
          setForm({ ..._form })
          break
      }
    },
    [form]
  )

  const handleDeliveryCodeIndex = useCallback(
    (index, checked) => {
      let _index = checked ? form.deliveryCodeIndex - index : form.deliveryCodeIndex + index
      let _form = { ...form }
      switch (deliveryCode[_index]) {
        case 'GDS04001': //기본 배송비
          _form.deliveryLocalInfoList = []
          _form.deliveryCntInfoList = []
          break
        case 'GDS04002': //지역별 배송비
          _form.deliveryCntInfoList = []
          break
        case 'GDS04003': //수량별 배송비
          _form.deliveryLocalInfoList = []
          break
      }

      setForm({
        ..._form,
        deliveryCodeIndex: _index,
        dvrynonePtrnId: deliveryCode[_index]
      })
    },
    [form]
  )

  const addLocationRequirment = useCallback(() => {
    if (deliveryCode[form.deliveryCodeIndex] === 'GDS04002' || deliveryCode[form.deliveryCodeIndex] === 'GDS04004') {
      let _form = { ...form }
      _form.deliveryLocalInfoList.push({
        trl: '서울',
        ctcocrwd: '전체',
        amt: '',
        comPrcutId: 'COC02001',
        comPdfutId: 'COC02002'
      })
      setForm({ ..._form })
    }
  }, [form])

  const addQtyRequirment = useCallback(() => {
    if (deliveryCode[form.deliveryCodeIndex] === 'GDS04003' || deliveryCode[form.deliveryCodeIndex] === 'GDS04004') {
      let _form = { ...form }
      _form.deliveryCntInfoList.push({
        qty: '',
        amt: '',
        comPrcUtId: 'COC02001',
        comPdfUtId: 'COC02002'
      })
      setForm({ ..._form })
    }
  }, [form])

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">배송 정보</div>
        <div className="btn_group">
          <button className="btn_toggle_card" onClick={handleToggleState}>
            <span className="hide">카드 열고 닫기</span>
          </button>
        </div>
      </div>
      {toggle && (
        <div className="toggle_card_container">
          <div className="table_list_wrap type02 ">
            <ul className="table_list ">
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">국내&#47;해외배송</span>
                  </div>
                  <div className="cell cell_value flex cell_full_value">
                    <div className="checkbox_list_wrap disabled">
                      {shippingLocationList.map((shippingLocation, index) => (
                        <Radio
                          disabled
                          className={'type02'}
                          key={shippingLocation.id}
                          id={shippingLocation.id}
                          label={shippingLocation.label}
                          checked={index === 0}
                        />
                      ))}
                    </div>
                    <div className="info_wrap">
                      <p className="text">&#42; 현재 해외배송은 이용이 불가합니다&#46;</p>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">배송기본정보</span>
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="freight_service_wrap">
                      <div>
                        <p className="text">&#42; 대량으로 배송하는 경우에 1개의 박스에 대한 정보가 필요합니다&#46;</p>
                        <p className="text">&#42; 1개의 박스 기준으로 작성해주세요&#46;</p>
                        <p className="text">&#42; 최대상품수는 1개의 박스에 등록하는 상품이 최대 몇개가 들어가는지 입력합니다&#46;</p>
                      </div>
                      <div className="table_list_wrap type02">
                        <ul className="table_list freight_service">
                          <li className="table_row">
                            <div className="item_section">
                              <div className="cell cell_label cell_header cell_title">
                                <span className="label">구분</span>
                              </div>
                              <div className="cell cell_value cell_header cell_title">
                                <span className="label">설명</span>
                              </div>
                            </div>
                          </li>
                          <li className="table_row">
                            <div className="item_section">
                              <div className="cell cell_label cell_header ">
                                <span className="label">상품출고지</span>
                              </div>
                              <div className="cell cell_value grid">
                                <div className="input_wrap release">
                                  <input
                                    type="text"
                                    className="input"
                                    placeholder="우편번호입력"
                                    value={form?.rlontfZpcd}
                                    disabled
                                    title={'rlontfZpcd'}
                                  />
                                  <Button className="btn full_blue" onClick={handleAddressPopup}>
                                    우편번호 찾기
                                  </Button>
                                </div>
                                <div className="input_wrap release">
                                  <input
                                    type="text"
                                    className="input"
                                    placeholder="주소입력"
                                    value={form?.rlontfAdr}
                                    disabled
                                    title={'rlontfAdr'}
                                  />
                                  <input
                                    type="text"
                                    className="input"
                                    placeholder="상세주소"
                                    id={'rlontfDtad'}
                                    value={form?.rlontfDtad}
                                    onChange={onChangeForm}
                                    title={'rlontfDtad'}
                                  />
                                </div>
                              </div>
                            </div>
                            {addressPopup && <AdressSearch closePopup={handleAddressPopup} setAddress={setAddress} />}
                          </li>
                          <li className="table_row">
                            <div className="item_section">
                              <div className="cell cell_label cell_header ">
                                <span className="label">박스규격&#40;부피&#41;</span>
                              </div>
                              <div className="cell cell_value">
                                <div className="bargain_form_wrap">
                                  <div className="size_value">
                                    가로
                                    <input
                                      type="number"
                                      className="input number length"
                                      id={'prdtBrdh'}
                                      onChange={onChangeNumPoint}
                                      value={form?.prdtBrdh}
                                      onFocus={onFocusForm}
                                      onBlur={onFocusForm}
                                      title={'prdtBrdh'}
                                    />
                                    cm
                                  </div>
                                  <div className="size_value">
                                    세로
                                    <input
                                      type="number"
                                      className="input number length"
                                      id={'prdtVrtc'}
                                      onChange={onChangeNumPoint}
                                      value={form?.prdtVrtc}
                                      onFocus={onFocusForm}
                                      onBlur={onFocusForm}
                                      title={'prdtVrtc'}
                                    />
                                    cm
                                  </div>
                                  <div className="size_value">
                                    높이
                                    <input
                                      type="number"
                                      className="input number length"
                                      id={'prdtAhgd'}
                                      onChange={onChangeNumPoint}
                                      value={form?.prdtAhgd}
                                      onFocus={onFocusForm}
                                      onBlur={onFocusForm}
                                      title={'prdtAhgd'}
                                    />
                                    cm
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="table_row">
                            <div className="item_section">
                              <div className="cell cell_label cell_header ">
                                <span className="label">박스규격&#40;무게&#41;</span>
                              </div>
                              <div className="cell cell_value">
                                <div className="bargain_form_wrap">
                                  <div className="size_value">
                                    <input
                                      type="number"
                                      className="input number weight"
                                      id={'prdtWgt'}
                                      onChange={onChangeNumPoint}
                                      value={form?.prdtWgt}
                                      placeholder={0}
                                      onFocus={onFocusForm}
                                      onBlur={onFocusForm}
                                      title={'prdtWgt'}
                                    />
                                    kg 단위로 입력
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="table_row">
                            <div className="item_section">
                              <div className="cell cell_label cell_header ">
                                <span className="label">내품가액&#40;1box당&#41;</span>
                              </div>
                              <div className="cell cell_value">
                                <div className="bargain_form_wrap">
                                  <div className="least_purchase">
                                    <input
                                      type="text"
                                      className="input number price"
                                      placeholder={0}
                                      id={'dchGdsPrc'}
                                      onChange={onChangeNum}
                                      value={addComma(form?.dchGdsPrc)}
                                      onFocus={onFocusForm}
                                      onBlur={onFocusForm}
                                      title={'dchGdsPrc'}
                                    />
                                    원
                                  </div>
                                </div>
                              </div>
                            </div>
                            </li>
                            <li className="table_row">
                              <div className="item_section">
                                <div className="cell cell_label cell_header ">
                                  <span className="label">최대상품수&#40;1box당&#41;</span>
                                </div>
                                <div className="cell cell_value">
                                  <div className="bargain_form_wrap">
                                    <div className="least_purchase">
                                      <input
                                        type="text"
                                        className="input number price"
                                        placeholder={0}
                                        id={'mxmmGdsCnt'}
                                        onChange={onChangeNum}
                                        value={addComma(form?.mxmmGdsCnt)}
                                        onFocus={onFocusForm}
                                        onBlur={onFocusForm}
                                        title={'mxmmGdsCnt'}
                                      />
                                      개
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">배송유형</span>
                  </div>
                  <div className="cell cell_value flex cell_full_value">
                    <div className="checkbox_list_wrap ship_type">
                      {shippingTypeList.map((shippingType, index) => (
                        <React.Fragment key={`shippingType_${index}`}>
                          <Radio
                            className={`type02 ${saleInfo.prcDscsYn === 'Y' ? 'no_select' : ''}`}
                            key={shippingType.id}
                            id={shippingType.id}
                            label={shippingType.label}
                            onChange={handleShipTypeList}
                            checked={shippingType.id === form.dvryPtrnId}
                            disabled={saleInfo.prcDscsYn === 'Y' ? true : false}
                          />
                          {shippingType.id === 'GDS02002' && (
                            <p className="into">
                              *직접배송 선택시, 판매자가 직접 배송해야하며, 구매자에게 배송상태를 전달하려면 직접
                              택배사와 운송장번호를 입력하셔야합니다.
                            </p>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                    {form.dvryPtrnId === 'GDS02001' && (
                      <AdditionalInfo form={form} setForm={setForm} sellerInfo={sellerInfo} />
                    )}
                  </div>
                </div>
              </li>
              {/*배송유형 end*/}

              {form?.dvryPtrnId === 'GDS02002' && (
                <>
                  <li className="table_row">
                    <div className="item_section">
                      <div className="cell cell_label cell_header first cell_full_header">
                        <span className="label">배송기본가</span>
                      </div>
                      <div className="cell cell_value02 first cell_full_value">
                        <div className="input_total_wrap input_won disabled_bg">
                          <input
                            type="text"
                            className="input ta_right"
                            placeholder={0}
                            value={addComma(form?.dvryBscprce)}
                            id={'dvryBscprce'}
                            onChange={onChangeNum}
                            onFocus={onFocusForm}
                            onBlur={onFocusForm}
                            disabled={saleInfo.prcDscsYn === 'Y' ? true : false}
                            title={'dvryBscprce'}
                            maxLength={12}
                          />
                          <span className="unit">원</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="table_row">
                    <div className="item_section">
                      <div className="cell cell_label cell_header first cell_full_header">
                        <Checkbox
                          className={'type02 fee'}
                          id={'deliveryLocalInfoFlag'}
                          label={'지역별 배송비'}
                          onChange={() =>
                            handleDeliveryCodeIndex(
                              1,
                              deliveryCode[form.deliveryCodeIndex] === 'GDS04002' ||
                                deliveryCode[form.deliveryCodeIndex] === 'GDS04004'
                            )
                          }
                          checked={
                            deliveryCode[form.deliveryCodeIndex] === 'GDS04002' ||
                            deliveryCode[form.deliveryCodeIndex] === 'GDS04004'|| form.deliveryLocalInfoList.length>0
                          }
                          disabled={saleInfo.prcDscsYn === 'Y' ? true : false}
                        />
                      </div>
                      <div className="cell cell_value02 first cell_full_value flex_start">
                        {form?.deliveryLocalInfoList?.map((element, index) => (
                          <LocationFee
                            element={element}
                            index={index}
                            form={form}
                            setForm={setForm}
                            key={`location_fee_${index}`}
                          />
                        ))}
                        <Button
                          className="btn full_blue add"
                          onClick={addLocationRequirment}
                          disabled={
                            form.dvrynonePtrnId === 'GDS04002' || form.dvrynonePtrnId === 'GDS04004' ? false : true
                          }
                        >
                          시/도 지역추가
                        </Button>
                      </div>
                    </div>
                  </li>
                  <li className="table_row">
                    <div className="item_section">
                      <div className="cell cell_label cell_header first cell_full_header">
                        <Checkbox
                          className={'type02 fee'}
                          id={'deliveryCntInfoFlag'}
                          label={'수량별 배송비'}
                          onChange={() =>
                            handleDeliveryCodeIndex(
                              2,
                              deliveryCode[form.deliveryCodeIndex] === 'GDS04003' ||
                                deliveryCode[form.deliveryCodeIndex] === 'GDS04004'
                            )
                          }
                          checked={
                            deliveryCode[form.deliveryCodeIndex] === 'GDS04003' ||
                            deliveryCode[form.deliveryCodeIndex] === 'GDS04004' || form.deliveryCntInfoList.length>0
                          }
                          disabled={saleInfo.prcDscsYn === 'Y' ? true : false}
                        />
                      </div>
                      <div className="cell cell_value02 first cell_full_value flex_start">
                        {form?.deliveryCntInfoList?.map((element, index) => (
                          <QtyFee
                            element={element}
                            index={index}
                            form={form}
                            setForm={setForm}
                            key={`qty_fee${index}`}
                          />
                        ))}
                        <Button
                          className="btn full_blue add quantity"
                          onClick={addQtyRequirment}
                          disabled={
                            form.dvrynonePtrnId === 'GDS04003' || form.dvrynonePtrnId === 'GDS04004' ? false : true
                          }
                        >
                          수량별 조건 추가
                        </Button>
                      </div>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>
          {/*table_list_wrap end*/}
        </div>
      )}
    </div>
  )
}

export default ShipInfo
