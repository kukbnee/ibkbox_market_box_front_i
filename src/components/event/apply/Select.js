import { useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import Button from 'components/atomic/Button'
import Search from 'components/event/apply/Search'
import SearchItem from 'components/event/apply/SearchItem'
import PopupAlert from 'components/PopupAlert'

const Select = (props) => {

  const { productList, setProductList, onClickTab } = props
  const history = useHistory()
  const [popupAlert, setPopupAlert] = useState(false)

  const handlePopupAlert = useCallback(() => {
    setPopupAlert(!popupAlert)
  }, [popupAlert])

  const onClickNext = useCallback(() => {
    if (productList.length > 0) onClickTab('CONFIRM')
    else setPopupAlert(true)
  }, [productList])

  return (
    <>
      <div className="guide_wrap">
        <p className="tit">해당 이벤트에 신청할 상품을 검색 후 추가해주세요&#46;</p>
        {productList.length === 0 && (
          <p className="exp">
            판매중 상태의 등록 상품&#47;에이전시 상품만 신청가능하여 노출됩니다&#46;
            <br />
            추가로 등록 또는 수정이 필요한 상품이 있다면&nbsp;
            <span className="link_blue" onClick={() => history.push(PathConstants.MY_PAGE_PRODUCT)}>
              마이페이지&gt;상품관리
            </span>
            &nbsp;메뉴에서
            <br />
            상품을 등록 또는 수정해주세요&#46;
          </p>
        )}
      </div>
      <div className="article_wrap">
        <div className="search_area">
          <Search productList={productList} setProductList={setProductList} />
        </div>
        {productList.length === 0 ? (
          <div className="product_add_list">
            <p className="exp">이벤트에 신청할 상품을 검색 후 추가하면 해당 영역에 노출됩니다&#46;</p>
          </div>
        ) : (
          <div className="product_add_list">
            <div className="table_list_wrap each_list_wrap view">
              <div className="table_header bind_header apply_select_header">
                <div className="cell cell_num cb_none">No</div>
                <div className="cell cell_name">상품명</div>
                <div className="cell cell_price">판매가</div>
                <div className="cell cell_cate">분류</div>
              </div>
              <ul className="table_list each_list scroll">
                {productList?.map((product, index) => (
                  <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                    <SearchItem
                      data={product}
                      index={index}
                      productList={productList}
                      setProductList={setProductList}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="btn_wrap">
        <Button className={'btn full_blue'} onClick={onClickNext}>
          다음
        </Button>
      </div>
      {popupAlert && (
        <PopupAlert
          className={'event_popup_wrap'}
          msg={'이벤트에 등록될 상품을\n 1개 이상 추가해주세요.'}
          btnMsg={'확인'}
          handlePopup={handlePopupAlert}
        />
      )}
    </>
  )
}

export default Select
