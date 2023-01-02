import { useState, useCallback, useRef, useEffect } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import SearchResult from 'components/event/apply/SearchResult'
import PopupAlert from 'components/PopupAlert'

const Search = (props) => {
  const { productList, setProductList } = props
  const [search, setSearch] = useState('')
  const [result, setResult] = useState([])
  const [popup, setPopup] = useState(false)
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '' })
  const resultRef = useRef()

  const getSearchProduct = useCallback(async () => {
    await Axios({
      url: API.EVENT.PRODUCT,
      method: 'get',
      params: { pdfNm: search }
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

  //판매중지/중복상품 alert
  const handlePopupAlert = useCallback(() => {
    setPopupAlert({ active: !popupAlert, msg: '' })
  }, [popupAlert])

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        popup &&
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
  }, [popup, setPopup])

  return (
    <>
      <div className="search_wrap">
        <input
          type="text"
          className="input serch_result"
          placeholder="상품명을 입력해주세요&#46;"
          autoFocus
          onKeyPress={onPressEnter}
          onChange={(e) => setSearch(e.target.value)}
          title={'search'}
        />
      </div>
      <Button className={'linear_blue btn_search serch_result'} onClick={getSearchProduct}>
        검색
      </Button>
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

export default Search
