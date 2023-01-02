import { useCallback } from 'react'

const Category = (props) => {
  const { depth, category, active, setActive, ctgyParentCd, handleDepth } = props

  const onClickCategory = useCallback((item) => {
    if (item?.useYn === 'Y') {
      setActive(item)
      handleDepth(depth, item)
    }
  }, [])

  return (
    <div className="category_select_section">
      <p className="category_select_label">{depth}차분류</p>
      <div className="category_select_list_wrap">
        <ul className="category_select_list scroll_light">
          {category
            ?.filter((item) => item.ctgyParentCd === ctgyParentCd)
            ?.map((item, indx) => (
              <li
                className={`category_select_item ${active.ctgyCd === item.ctgyCd && 'active'} ${
                  depth === 4 && 'subcate'
                }`}
                key={item.ctgyCd + indx}
              >
                <button className={`btn_category_arr_right ${item?.useYn === 'Y' ? 'black' : 'grey'}`} id={item.ctgyCd} onClick={() => onClickCategory(item)}>
                  {item?.ctgyNm}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Category
