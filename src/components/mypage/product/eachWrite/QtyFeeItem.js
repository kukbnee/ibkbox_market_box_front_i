import { useCallback } from 'react'
import Button from 'components/atomic/Button'
import { addComma } from 'modules/utils/Common'

const QtyFee = (props) => {
  const { index, element, form, setForm } = props

  const onChangeForm = useCallback(
    (e) => {
      let _form = { ...form }
      let regExp = /[^0-9]/g
      let result = e.target.value.replace(regExp, '')
      _form.deliveryCntInfoList[index][e.target.id] = result
      setForm({ ..._form })
    },
    [form]
  )

  const removeItem = useCallback(() => {
    let _form = { ...form }
    _form.deliveryCntInfoList.splice(index, 1)
    setForm({ ..._form })
  }, [form])

  return (
    <div className="select_input_button_wrap type02">
      <div className="input_total_wrap input_won">
        <input
          type="text"
          id={'qty'}
          className="input ta_right"
          placeholder={0}
          value={addComma(element?.qty)}
          onChange={onChangeForm}
          title={'qty'}
        />
        <span className="unit">이상 구매시</span>
      </div>
      <div className="input_total_wrap input_won">
        <input
          type="text"
          id={'amt'}
          className="input ta_right"
          placeholder={0}
          value={addComma(element?.amt)}
          onChange={onChangeForm}
          title={'amt'}
        />
        <span className="unit">원 추가</span>
      </div>
      <Button onClick={removeItem}>
        <span className="hide">삭제버튼</span>
      </Button>
    </div>
  )
}

export default QtyFee
