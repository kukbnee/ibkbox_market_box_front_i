import { useState, useCallback, useEffect } from 'react'
import Checkbox from 'components/atomic/Checkbox'
import NoResult from 'components/NoResult'
import ProductItem from 'components/mypage/product/bindWrite/ProductItem'
import SerachPopup from 'components/mypage/product/bindWrite/SerachPopup'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'

const BindListContents = (props) => {

  const { form, setForm } = props
  const [popupSearch, setPopupSearch] = useState(false)
  const [checkFlag, setCheckFlag] = useState(false)

  const handlePopup = useCallback(() => {
    setPopupSearch(!popupSearch)
  }, [popupSearch])

  const AllCheck = useCallback(() => {
    let _form = [...form]
    setForm(
      _form.map((product) => {
        return { ...product, checked: !checkFlag }
      })
    )
    setCheckFlag(!checkFlag)
  }, [form, checkFlag])

  const handleCheckbox = useCallback(
    (index) => {
      let _form = [...form]
      _form[index].checked = !_form[index].checked
      setForm([..._form])
    },
    [form]
  )

  const handleMainCheckbox = useCallback(
    (index) => {
      let _form = [ ...form ]
      _form[index].mainYn = form[index].mainYn === 'Y' ? 'N' : 'Y'
      setForm([..._form])
    },
    [form]
  )

  const removeCheckList = useCallback(() => {
    let _form = [...form]
    setForm(_form.filter((product) => product.checked === false))
  }, [form])

  // 체크 수에 따라 전체체크 여부 확인
  useEffect(() => {
    let checkedCnt = 0
    form?.map((item) => {
      if (item.checked) {
        checkedCnt = checkedCnt + 1
      }
    })
    if (checkedCnt > 0 && checkedCnt === form?.length) setCheckFlag(true)
    else setCheckFlag(false)
  }, [form, checkFlag])

  return (
    <>
      {/* 상품검색 */}
      {popupSearch && <SerachPopup handlePopup={handlePopup} form={form} setForm={setForm} />}
      
      <div className="section_product_list">
        <div className="section_header">
          <div className="essential_badge_wrap">
            <div className="section_title">상품추가</div>
            <Badge className={'linear_full_pink'}>필수</Badge>
          </div>
          <div className="btn_group">
            <Button className={'btn linear_blue btn_delete'} onClick={removeCheckList}>삭제</Button>
            <Button className={'btn full_blue btn_add'} onClick={handlePopup}>상품추가</Button>
          </div>
        </div>
        <div className="product_add_list">
          <div className="table_list_wrap each_list_wrap view">
            <div className="table_header bind_header">
              <div className="cell cell_num">
                <Checkbox className={'type02'} onChange={AllCheck} checked={checkFlag} id={'product_all'} />
              </div>
              <div className="cell cell_name new_name">상품명</div>
              <div className="cell cell_price">판매가</div>
              <div className="cell cell_cate new_cate">분류</div>
              <div className="cell cell_stock new_stock">최소구매</div>
              <div className="cell cell_rep textnone center">
                대표상품<br />지정
              </div>
            </div>
            {/* 추가한 상품 리스트 */}
            <ul className="table_list each_list">
              {form.length === 0 ? (
                <li className="table_row each_item_row no_result_wrap">
                  <NoResult msg={`등록된 상품이 없습니다.`} />
                </li>
              ) : (
                form?.map((product, index) => (
                  <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                    <ProductItem
                      data={product}
                      index={index}
                      handleCheckbox={handleCheckbox}
                      handleMainCheckbox={handleMainCheckbox}
                    />
                  </li>
                ))
              )}
            </ul>
            <p className="explain">
              * 대표상품지정 : 묶음상품 목록에서 대표이미지 아래에 2개의 대표 상품이 표시되며 상품 목록에서 2개만 선택
              가능합니다.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default BindListContents
