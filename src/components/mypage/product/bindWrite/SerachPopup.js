import { useState, useCallback, useEffect, useRef } from 'react'
import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'
import SearchResultItem from 'components/mypage/product/bindWrite/SearchResultItem'
import NoResult from 'components/NoResult'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import SearchResult from 'components/event/apply/SearchResult'
import PopupAlert from 'components/PopupAlert'

const PopupProdList = (props) => {
  const { form, setForm, handlePopup } = props
  const [productList, setProductList] = useState([...form])
  const [search, setSearch] = useState('')
  const [result, setResult] = useState([])
  const [popup, setPopup] = useState(false)
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '' })

  const resultRef = useRef()

  const getSearchProduct = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BUNDLE_SEARCH_PROUDCT_LIST,
      method: 'get',
      params: { pdfInfoCon: search }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopup(true)
        setResult(response.data.data.list)
      }
    })
  }, [search])

  const onPressEnter = useCallback(
    (e) => {
      e.key === 'Enter' && getSearchProduct()
    },
    [search]
  )
  const closePopup = useCallback(() => setPopup(false), [])

  const handleDel = useCallback(
    (index) => {
      let _productList = [...productList]
      _productList.splice(index, 1)
      setProductList([..._productList])
    },
    [productList]
  )

  const applyProductList = useCallback(() => {
    setForm(productList)
    handlePopup()
  }, [productList, form])

  //판매중지/중복상품 alert
  const handlePopupAlert = useCallback(() => {
    setPopupAlert({ active: !popupAlert, msg: '' })
  }, [popupAlert])

  useEffect(() => {
    // 검색 결과 팝업 밖 클릭 시 결과 팝업 닫기
    const checkIfClickedOutside = (e) => {
      if (
        popup &&
        !popupAlert.active &&
        resultRef.current &&
        !resultRef.current.contains(e.target) &&
        !e.target.className.includes('serch_result')
      ) {
        setPopup(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [popup, popupAlert, setPopup])

  return (
    <>
      <div className="popup_wrap type02 popup_product_add">
        <div className="layer">&nbsp;</div>
        <div className="container scroll">
          <BtnClose onClick={handlePopup} />
          <div className="popup_header">
            <h3 className="popup_title">판매상품 리스트</h3>
          </div>
          <div className="popup_content">
            <div className="popup_search_wrap">
              {/* 상품검색 */}
              <div className="search_wrap">
                <input
                  type="text"
                  className="input"
                  placeholder="상품명"
                  autoFocus
                  onKeyPress={onPressEnter}
                  onChange={(e) => setSearch(e.target.value)}
                  title={'상품명'}
                />
              </div>
              <Button className={'linear_blue btn_search'} onClick={getSearchProduct}>검색</Button>

              {/* 검색결과 */}
              {popup && (
                <div className="search_popup" ref={resultRef}>
                  <ul className="search_list scroll">
                    {result.length > 0 ? (
                      result?.map((result, index) => (
                        <SearchResult
                          key={'serachResult_' + index}
                          data={result}
                          setProductList={setProductList}
                          productList={productList}
                          closePopup={closePopup}
                          setPopupAlert={setPopupAlert}
                        />
                      ))
                    ) : (
                      <div className="no_result">
                        <p className="msg">검색 결과가 없습니다.</p>
                      </div>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* 상품 검색 후 추가 */}
            <div className="product_add_list">
              <div className="table_list_wrap each_list_wrap view">
                <div className="table_header bind_header">
                  <div className="cell cell_num">No</div>
                  <div className="cell cell_name">상품명</div>
                  <div className="cell cell_price">판매가</div>
                  <div className="cell cell_cate">분류</div>
                </div>
                <ul className="table_list each_list">
                  {productList.length === 0 ? (
                    <li className="table_row each_item_row no_result_wrap">
                      <NoResult />
                    </li>
                  ) : (
                    productList?.map((product, index) => (
                      <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                        <SearchResultItem data={product} index={index} handleDel={handleDel} />
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* 묶음 상품에 추가 */}
          <div className="popup_bottom">
            <Button className={'full_blue'} onClick={applyProductList}>적용</Button>
          </div>
        </div>
      </div>
      {popupAlert?.active && (
        <PopupAlert
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={'확인'}
          handlePopup={handlePopupAlert}
        />
      )}
    </>
  )
}

export default PopupProdList
