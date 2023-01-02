import { useState, useCallback } from 'react'
import Button from 'components/atomic/Button'

const LinkProduct = (props) => {
  const { form, setForm } = props

  const [toggle, setToggle] = useState(true)
  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  const addLink = useCallback(() => {
    setForm({
      productLinkList: [
        ...form.productLinkList,
        {
          infoSqn: '',
          linkTtl: '',
          linkUrl: ''
        }
      ]
    })
  }, [form])

  const onChangeForm = useCallback(
    (e, index) => {
      let _form = { ...form }
      _form.productLinkList[index][e.target.id] = e.target.value
      setForm({ ..._form })
    },
    [form]
  )

  const removeVideo = useCallback(
    (e, index) => {
      let _form = { ...form }
      _form.productLinkList.splice(index, 1)
      setForm({ ..._form })
    },
    [form]
  )

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">타 사이트 구매링크</div>
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
                    <span className="label">구매 사이트 등록</span>
                  </div>
                  <div className="cell cell_value regist cell_full_value">
                    <div className="regist_info_wrap">
                      <p className="text">&#183; 타 사이트에도 판매하고 있다면 등록할 수 있습니다&#46; &#40;최대 5개&#41;</p>
                      <p className="text">
                        &#183; 등록 링크는 상품 상세페이지에 표시되며, 구매자가 해당 링크를 통해 확인 후 결제가 가능합니다&#46;
                      </p>
                    </div>

                    {form?.productLinkList?.length > 0 && (
                      <div className="order_volume_limit">
                        {form?.productLinkList?.map((video, index) => (
                          <LinkInfoItem
                            key={`videoItem_${index}`}
                            form={form}
                            setForm={setForm}
                            video={video}
                            index={index}
                            onChangeForm={onChangeForm}
                            removeVideo={removeVideo}
                          />
                        ))}
                      </div>
                    )}
                    {form?.productLinkList?.length < 5 && (
                      <div className="btn_wrap">
                        <Button className="btn more_btn" onClick={addLink} />
                      </div>
                    )}
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

const LinkInfoItem = (props) => {

  const { video, index, onChangeForm, removeVideo } = props

  return (
    <div className="order_volume_limit_wrap">
      <div className="table_list_wrap type02">
        <ul className="table_list video">
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_label cell_header cell_header_video">
                <span className="label">구매 사이트 명</span>
              </div>
              <div className="cell cell_value cell_value_video">
                <div className="input_wrap">
                  <input
                    type="text"
                    className="input"
                    placeholder="필수 항목입니다."
                    maxLength="200"
                    id={'linkTtl'}
                    value={video?.linkTtl}
                    onChange={(e) => onChangeForm(e, index)}
                    title={'linkTtl'}
                  />
                </div>
              </div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_label cell_header cell_header_video">
                <span className="label">구매 사이트 url</span>
              </div>
              <div className="cell cell_value cell_value_video">
                <div className="input_wrap">
                  <input
                    type="text"
                    className="input"
                    placeholder="필수 항목입니다."
                    value={video?.linkUrl}
                    id={'linkUrl'}
                    onChange={(e) => onChangeForm(e, index)}
                    title={'linkUrl'}
                  />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="delete_btn_wrap">
        <Button onClick={(e) => removeVideo(e, index)}>
          <div className="hide">삭제버튼</div>
        </Button>
      </div>
    </div>
  )
}

export default LinkProduct
