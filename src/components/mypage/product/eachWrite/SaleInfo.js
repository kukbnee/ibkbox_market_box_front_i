import React, { useState, useCallback, useEffect } from 'react'
import Badge from 'components/atomic/Badge'
import ToggleCheckBox from 'components/atomic/ToggleCheckBox'
import Tooltip from 'components/Tooltip'
import Checkbox from 'components/atomic/Checkbox'
import Radio from 'components/atomic/Radio'
import { addComma } from 'modules/utils/Common'

const SaleInfo = (props) => {
  const { form, setForm } = props
  const [toggle, setToggle] = useState(true)
  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  const amountLimitList = [
    { id: 'amount_Y', label: '사용', value: 'Y' },
    { id: 'amount_N', label: '사용안함', value: 'N' }
  ]

  const handleAmountLimit = useCallback(
    (e) => {
      let convert = e.target.id.split('_')[1]
      setForm({
        ...form,
        ordnQtyLmtnUsyn: convert,
          ordnMnmmQty: form?.ordnQtyLmtnUsyn==='Y' ?'1':form?.ordnMnmmQty,
        ordnMxmmQtyYn :'N',
        ordnMxmmQty:0
      })
    },
    [form]
  )

  const onChangeForm = useCallback(
    (e) => {
      let _form = { ...form }
        let regex = /[^0-9]/g
      let result = e.target.value.replace(regex, '')
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

  const onFocusFormMinQty = useCallback(
    (e) => {
      let _form = { ...form }
      switch (e.target.value) {
        case 1:
          _form['ordnMnmmQty'] = ''
          setForm({ ..._form })
          break
        case '':
          _form['ordnMnmmQty'] = 1
          setForm({ ..._form })
          break
      }
    },
    [form]
  )

  const handleNegotiationFlag = useCallback(() => {
    setForm({
      ...form,
      prcDscsYn: form.prcDscsYn === 'Y' ? 'N' : 'Y',
      pdfPrc: 0,
      salePrc: 0,
      esttUseEn: form.prcDscsYn === 'N' ? 'Y' : 'N',
      ordnQtyLmtnUsyn: 'N'
    })
  }, [form])

  const handleEstimateFlag = useCallback(() => {
    if (form.prcDscsYn === 'N')
      setForm({
        ...form,
        esttUseEn: form.esttUseEn === 'Y' ? 'N' : 'Y'
      })
  }, [form])

  const handleMaxQtyFlag = useCallback(
    (flag) => {
      setForm({
        ...form,
        ordnMxmmQtyYn: flag,
        ordnMxmmQty: 0
      })
    },
    [form]
  )

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">판매 정보</div>
        <div className="btn_group">
          <button className="btn_toggle_card" onClick={handleToggleState}>
            <span className="hide">카드 열고 닫기</span>
          </button>
        </div>
      </div>

      {toggle && (
        <div className="toggle_card_container">
          {/*table_list_wrap start*/}
          <div className="table_list_wrap type02 ">
            <ul className="table_list ">
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header first cell_full_header">
                    <span className="label">판매기본가</span>
                    <Tooltip title={'판매기본가'} content={'상품의 기본 판매가격을 입력해주세요.'} />
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value02 first cell_full_value">
                    <div className="input_total_wrap input_won">
                      <input
                        type="text"
                        id={'pdfPrc'}
                        className={`input ta_right ${form.prcDscsYn === 'Y' && 'disabled'}`}
                        placeholder={0}
                        disabled={form.prcDscsYn === 'Y'}
                        value={addComma(form?.pdfPrc)}
                        onChange={onChangeForm}
                        onFocus={onFocusForm}
                        onBlur={onFocusForm}
                        title={'pdfPrc'}
                      />
                      <span className="unit">원</span>
                    </div>
                    <Checkbox
                      className={'type02 negotiate add'}
                      id={'prcDscsYn'}
                      label={'가격협의 필요'}
                      onChange={handleNegotiationFlag}
                      checked={form.prcDscsYn === 'Y'}
                    />
                    {form.prcDscsYn === 'Y' ? <div className="type_none red">* 배송타입 선택이 불가합니다</div> : ''}

                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">할인가</span>
                  </div>
                  <div className="cell cell_value02 cell_full_value">
                    <div className="input_total_wrap input_won">
                      <input
                        type="text"
                        id={'salePrc'}
                        className={`input ta_right ${form.prcDscsYn === 'Y' && 'disabled'}`}
                        placeholder={''}
                        disabled={form.prcDscsYn === 'Y'}
                        value={addComma(form?.salePrc)}
                        onChange={onChangeForm}
                        onFocus={onFocusForm}
                        onBlur={onFocusForm}
                        title={'salePrc'}
                      />
                      <span className="unit">원</span>
                    </div>
                    <p className="discount_text">
                      &#40;{form.salePrc > 0 ? (((form.pdfPrc - form.salePrc) / form.pdfPrc) * 100).toFixed(2) : 0}%
                      할인&#44; 할인금액&#58;
                      {form.salePrc > 0 ? parseInt(form.pdfPrc - form.salePrc).toLocaleString() : 0}원&#41;
                    </p>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">견적받기</span>
                    <Tooltip
                      title={'견적받기'}
                      content={
                        '견적받기를 사용할 경우, 구매자가 견적을 요청할 수 있습니다.' +
                        '견적받기를 사용하지 않으면, 구매자는 메신저 또는 상품 상세페이지에서 견적요청을 할 수 없습니다.'
                      }
                    />
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="bargain_form_wrap">
                      <div className="usage_check">
                        <ToggleCheckBox
                          id={'esttUseEn'}
                          label={'사용유무'}
                          onChange={handleEstimateFlag}
                          reverse={true}
                          checked={form.esttUseEn === 'Y'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">주문수량 제한</span>
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="order_volume_limit">
                      {/*order_volume_limit_table start*/}
                      <div className="table_list_wrap type02">
                        <ul className="table_list sale">
                          <li className="table_row">
                            <div className="item_section">
                              <div className="cell cell_label cell_header cell_header_sale">
                                <span className="label">주문수량 제한 사용유무</span>
                              </div>
                              <div className="cell cell_value cell_full_value amount_limit">
                                {amountLimitList.map((item, index) => {
                                  return (
                                    <Radio
                                      className={'type02'}
                                      key={item.id + index}
                                      id={item.id}
                                      label={item.label}
                                      onChange={handleAmountLimit}
                                      checked={item.value === form.ordnQtyLmtnUsyn}
                                      disabled={form?.prcDscsYn === 'Y'}
                                    />
                                  )
                                })}
                              </div>
                            </div>
                          </li>
                          <li className="table_row">
                            <div className="item_section">
                              <div className="cell cell_label cell_header cell_header_sale">
                                <span className="label">최소 주문수량</span>
                              </div>
                              <div className="cell cell_value cell_value_sale">
                                <div className="order_unit_wrap">
                                  <div className="input_number_wrap">
                                    <input
                                      type="text"
                                      className={'input number'}
                                      // placeholder={1}
                                      id={'ordnMnmmQty'}
                                      value={addComma(form?.ordnMnmmQty)}
                                      disabled={form.ordnQtyLmtnUsyn === 'N'}
                                      onChange={onChangeForm}
                                      onFocus={onFocusFormMinQty}
                                      onBlur={onFocusFormMinQty}
                                      title={'ordnMnmmQty'}
                                    />
                                    <span className="text">개 이상</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                          <li className="table_row">
                            <div className="item_section">
                              <div className="cell cell_label cell_header cell_header_sale">
                                <span className="label">최대 주문수량</span>
                              </div>
                              <div className="cell cell_value cell_value_sale">
                                <div className="order_limit_radio_wrap">
                                  {/*제한없음*/}
                                  <div className={`radio_wrap type02`}>
                                    <input
                                      type="radio"
                                      id={'ordnMxmmQtyYn'}
                                      onChange={() => handleMaxQtyFlag('N')}
                                      checked={form.ordnMxmmQtyYn === 'N'}
                                    />
                                    <label htmlFor={'ordnMxmmQtyYn'}>&nbsp;</label>
                                    <label htmlFor={'ordnMxmmQtyYn'}>제한없음</label>
                                  </div>
                                  {/*n개 이하로 제한함*/}
                                  <div className={`radio_wrap type02`}>
                                    <input
                                      type="radio"
                                      name={'qtyLimit'}
                                      id={'qtyLimit'}
                                      onChange={() => handleMaxQtyFlag('Y')}
                                      checked={form.ordnMxmmQtyYn === 'Y'}
                                      disabled={form.ordnQtyLmtnUsyn === 'N'}
                                      title={'qtyLimit'}
                                    />
                                    <label htmlFor={'qtyLimit'}>&nbsp;</label>
                                    <label htmlFor={'qtyLimit'}>
                                      <div className="limits_input_wrap">
                                        <input
                                          type="text"
                                          id={'ordnMxmmQty'}
                                          className="input number"
                                          value={addComma(form?.ordnMxmmQty)}
                                          disabled={form.ordnMxmmQtyYn === 'N'}
                                          onChange={onChangeForm}
                                          onFocus={onFocusForm}
                                          onBlur={onFocusForm}
                                          title={'ordnMxmmQty'}
                                        />
                                        <span className="text">개 이하로 제한함</span>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      {/*order_volume_limit_table end*/}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          {/*table_list_wrap end*/}
        </div>
      )}
    </div>
  )
}

export default SaleInfo
