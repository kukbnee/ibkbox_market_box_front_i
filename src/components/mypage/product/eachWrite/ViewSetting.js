import { useState, useCallback, useEffect } from 'react'
import Radio from 'components/atomic/Radio'
import Tooltip from 'components/Tooltip'
import Category from 'components/mypage/product/eachWrite/Category'
import Badge from 'components/atomic/Badge'

const ViewSetting = (props) => {
  const { form, setForm, categoryList } = props

  const [toggle, setToggle] = useState(true)
  const [settingFlg, setSettingFlg] = useState(true)
  const [depth1, setDepth1] = useState({})
  const [depth2, setDepth2] = useState({})
  const [depth3, setDepth3] = useState({})
  const [depth4, setDepth4] = useState({})

  const displayStatus = [
    { id: 'Y', label: '진열함' },
    { id: 'N', label: '진열안함' }
  ]

  const saleStatus = [
    { id: 'GDS00001', label: '판매함' },
    { id: 'GDS00002', label: '판매안함' }
  ]

  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  const handleDisplayRadio = useCallback(
    (e) => {
      setForm({
        ...form,
        pdfPgrsYn: e.target.id
      })
    },
    [form]
  )

  const handleSaleRadio = useCallback(
    (e) => {
      setForm({
        ...form,
        pdfSttsId: e.target.id
      })
    },
    [form]
  )

  const handleDepth = (depth, item) => {
    switch (depth) {
      case 0:
        setDepth1({})
        setDepth2({})
        setDepth3({})
        setDepth4({})
        break
      case 1:
        setDepth2({})
        setDepth3({})
        setDepth4({})
        break
      case 2:
        setDepth3({})
        setDepth4({})
        break
      case 4:
        setForm({ ...form, pdfCtgyId: item?.ctgyCd })
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (form.pdfCtgyId && settingFlg && categoryList?.depthTwo) {
      setDepth1(categoryList?.depthTwo?.filter((item) => item?.ctgyCd === form.pdfCtgyId.slice(0, 4))?.[0])
      setDepth2(categoryList?.depthThr?.filter((item) => item?.ctgyCd === form.pdfCtgyId.slice(0, 6))?.[0])
      setDepth3(categoryList?.depthFor?.filter((item) => item?.ctgyCd === form.pdfCtgyId.slice(0, 8))?.[0])
      setDepth4(categoryList?.depthFiv?.filter((item) => item?.ctgyCd === form.pdfCtgyId.slice(0, 10))?.[0])
      setSettingFlg(false)
    }
  }, [categoryList, form])

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">표시 설정</div>
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
                    <span className="label">진열 상태</span>
                    <Tooltip
                      title={'진행 상태'}
                      content={
                        '진열함 선택 시 상품이 노출되며 ' +
                        '진열안함을 선택 할 때는 상품이 ' +
                        '구매자에게 노출되지 않습니다.'
                      }
                    />
                  </div>
                  <div className="cell cell_value cell_full_value">
                    {displayStatus.map((displayState) => (
                      <Radio
                        className={'type02'}
                        key={`display_state_${displayState.id}`}
                        id={displayState.id}
                        label={displayState.label}
                        onChange={handleDisplayRadio}
                        checked={form.pdfPgrsYn === displayState.id}
                      />
                    ))}
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">판매 상태</span>
                    <Tooltip
                      title={'판매 상태'}
                      content={
                        '판매함 선택 시 구매자가 상품을 구매할 수 있습니다. ' +
                        '판매 안함의 경우 판매중지 상태로 구매자가 구매 또는 견적 요청을 할 수 없습니다.'
                      }
                    />
                  </div>
                  <div className="cell cell_value cell_full_value">
                    {saleStatus.map((saleState) => (
                      <Radio
                        className={'type02'}
                        key={`display_state_${saleState.id}`}
                        id={saleState.id}
                        label={saleState.label}
                        onChange={handleSaleRadio}
                        checked={form.pdfSttsId === saleState.id}
                      />
                    ))}
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label letter_spacing">상품분류 선택</span>
                    <Tooltip title={'상품분류 선택'} content={'상품을 1차,2차,3차,4차 순으로 선택해주세요.'} />
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="category_select_tag_wrap">
                      {/*category_select_wrap start*/}

                      <div className="category_select_wrap">
                        {/*1차분류 start*/}
                        <Category
                          category={categoryList.depthTwo}
                          active={depth1}
                          setActive={setDepth1}
                          depth={1}
                          ctgyParentCd={'01'}
                          handleDepth={handleDepth}
                        />
                        <Category
                          category={categoryList.depthThr}
                          active={depth2}
                          setActive={setDepth2}
                          depth={2}
                          ctgyParentCd={depth1.ctgyCd}
                          handleDepth={handleDepth}
                        />
                        <Category
                          category={categoryList.depthFor}
                          active={depth3}
                          setActive={setDepth3}
                          depth={3}
                          ctgyParentCd={depth2.ctgyCd}
                          handleDepth={handleDepth}
                        />
                        <Category
                          category={categoryList.depthFiv}
                          active={depth4}
                          setActive={setDepth4}
                          depth={4}
                          ctgyParentCd={depth3.ctgyCd}
                          handleDepth={handleDepth}
                        />
                      </div>
                      {depth1?.ctgyCd && depth2?.ctgyCd && depth3?.ctgyCd && depth4?.ctgyCd && (
                        <div className="category_tag_wrap">
                          <div className="tag_wrap">
                            <span className="tag">
                              {depth1?.ctgyNm}&nbsp;&#62;&nbsp;
                              {depth2?.ctgyNm}&nbsp;&#62;&nbsp;
                              {depth3?.ctgyNm}&nbsp;&#62;&nbsp;
                              {depth4?.ctgyNm}
                            </span>
                            <button className="btn_delete_blue" onClick={() => handleDepth(0)}>
                              <span className="hide">삭제</span>
                            </button>
                          </div>
                        </div>
                      )}
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

export default ViewSetting
