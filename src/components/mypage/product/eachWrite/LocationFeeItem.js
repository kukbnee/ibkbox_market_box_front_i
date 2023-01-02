import { useCallback } from 'react'
import Button from 'components/atomic/Button'
import Location from 'components/mypage/product/eachWrite/Location'
import { addComma } from 'modules/utils/Common'

const LocationFee = (props) => {
    const { index, element, form, setForm } = props

    const onChangeForm = useCallback(
        (e) => {
            let _form = { ...form }
            _form.deliveryLocalInfoList[index][e.target.id] = e.target.value
            setForm({ ..._form })
        },
        [form]
    )

    const onChangeNum = useCallback(
        (e) => {
          let _form = { ...form }
          let regExp = /[^0-9]/g
          let result = e.target.value.replace(regExp, '')
          _form.deliveryLocalInfoList[index][e.target.id] = result
          setForm({ ..._form })
        },
        [form]
      )

    const removeItem = useCallback(() => {
        let _form = { ...form }
        _form.deliveryLocalInfoList.splice(index, 1)
        setForm({ ..._form })
    }, [form])


    return (
        <div className="select_input_button_wrap">
            <select className="select" value={element?.trl} id={'trl'} onChange={onChangeForm}>
                {Location?.SIDO?.map((sido, index) => (
                    <option value={sido} key={sido + index}>
                        {sido}
                    </option>
                ))}
            </select>
            <select className="select" value={element?.ctcocrwd === null ? Location?.SIGUNGU[element.trl][0] : element?.ctcocrwd} id={'ctcocrwd'} onChange={onChangeForm}>
                {Location?.SIGUNGU[element.trl]?.map((sigungu, index) => (
                    <option value={sigungu} key={sigungu + index}>
                        {sigungu}
                    </option>
                ))}
            </select>
            <div className="input_total_wrap input_won area_add">
                <input
                    type="text"
                    className="input ta_right"
                    placeholder={0}
                    id={'amt'}
                    onChange={onChangeNum}
                    value={addComma(element?.amt)}
                />
                <span className="unit">원 추가</span>
            </div>
            <Button onClick={removeItem}>
                <span className="hide">삭제버튼</span>
            </Button>
        </div>
    )
}

export default LocationFee
