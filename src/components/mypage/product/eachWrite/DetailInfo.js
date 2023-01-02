import { useState, useCallback } from 'react'
import Badge from 'components/atomic/Badge'

const DetailInfo = (props) => {

  const { form, setForm } = props
  const [toggle, setToggle] = useState(true)

  const onChangeForm = useCallback((e) => {
      let _form = { ...form }
      _form[e.target.id] = e.target.value
      setForm({ ..._form })
    },[form])

  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header ">
        <div className="title">반품&#47;교환정보</div>
        <div className="btn_group">
          <button className="btn_toggle_card" onClick={handleToggleState}>
            <span className="hide">카드 열고 닫기</span>
          </button>
        </div>
      </div>
      {toggle && (
        <div className="toggle_card_container">
          <div className="table_list_wrap type02 detailInfo">
            <ul className="table_list ">
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label change">
                      반품&#47;교환 요청 가능 기간<Badge className={'linear_full_pink'}>필수</Badge>
                    </span>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <textarea
                        className="textarea height03"
                        maxLength={1000}
                        placeholder={'반품/교환 요청 가능 기간을 입력해주세요.'}
                        id={'rtgdInrcTrm'}
                        onChange={onChangeForm}
                        value={form.rtgdInrcTrm}
                        title={'rtgdInrcTrm'}
                      />
                      <span className="text_length_check">{form?.rtgdInrcTrm?.length} &#47; 1&#44;000</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label change">
                      반품비용
                      <Badge className={'linear_full_pink'}>필수</Badge>
                    </span>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <textarea
                        className="textarea height04"
                        maxLength={1000}
                        placeholder={'반품비용을 입력해주세요.'}
                        id={'rtgdExp'}
                        onChange={onChangeForm}
                        value={form.rtgdExp}
                        title={'rtgdExp'}
                      />
                      <span className="text_length_check">{form?.rtgdExp?.length} &#47; 1&#44;000</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label change">
                      반품&#47;교환 절차
                      <Badge className={'linear_full_pink'}>필수</Badge>
                    </span>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <textarea
                        className="textarea height04"
                        maxLength={1000}
                        placeholder={'반품/교환 절차를 입력해주세요.'}
                        id={'rtgdInrcPrcd'}
                        onChange={onChangeForm}
                        value={form.rtgdInrcPrcd}
                        title={'rtgdInrcPrcd'}
                      />
                      <span className="text_length_check">{form?.rtgdInrcPrcd?.length} &#47; 1&#44;000</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label change">
                      반품&#47;교환이 불가능한 경우
                      <Badge className={'linear_full_pink'}>필수</Badge>
                    </span>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <textarea
                        className="textarea height04"
                        maxLength={1000}
                        placeholder={'반품/교환이 불가능한 경우를 입력해주세요.'}
                        id={'rtgdInrcDsln'}
                        onChange={onChangeForm}
                        value={form.rtgdInrcDsln}
                        title={'rtgdInrcDsln'}
                      />
                      <span className="text_length_check">{form?.rtgdInrcDsln?.length} &#47; 1&#44;000</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailInfo
