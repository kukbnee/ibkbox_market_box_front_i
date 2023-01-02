import { useState, useEffect, useCallback } from 'react'
import BreadCrumbs from 'components/BreadCrumbs'
import CardItem from 'components/wish/CardItem'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Pagination from 'components/atomic/Pagination'
import PopupAlert from 'components/PopupAlert'

const Wish = (props) => {

  const [wishDate, setWishData] = useState({ list: [] })
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '' })
  const [params, setParams] = useState({
    page: 1,
    record: 12
  })

  const handlePagination = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])

  const handlePopupAlert = useCallback(() => { //alert 팝업
    setPopupAlert({ active: false, msg: '' })
  }, [popupAlert])

  const getWishList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_WISH_LIST,
      method: 'get',
      params: params
    }).then((response) => {
      if (response?.data?.code === '200') {
        setWishData(response.data.data)
      } else if (response?.data?.code === '400' && response?.data?.data) {
        setPopupAlert({ active: true, msg: response.data.data })
      } else {
        setPopupAlert({ active: true, msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [params])

  useEffect(() => {
    getWishList()
  }, [params])

  return (
    <>
      {popupAlert?.active && (
        <PopupAlert className={'popup_review_warning'} msg={popupAlert?.msg} btnMsg={'확인'} handlePopup={handlePopupAlert} />
      )}
      <div className="wishList">
        <div className="container default_size">
          <BreadCrumbs {...props} />
          <div className="wishList_wrap">
            <p className="title">위시리스트</p>
            <div className="article_wrap">
              {/* 리스트 영역 */}
              {wishDate?.list?.length > 0 ? (
                <ul className="product_list">
                  {wishDate.list.map((wishItem, idx) => (
                    <li className="product_item" key={'productList' + idx}>
                      <CardItem data={wishItem} getWishList={getWishList} setPopupAlert={setPopupAlert} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="guide_txt">
                  좋아요 또는 위시리스트에 추가를 누르면
                  <br />
                  해당 영역에 상품 목록이 표시됩니다&#46;
                </p>
              )}

              {/* 페이지 영역 */}
              {wishDate?.totalPage > 0 && (
                <div className="pagination_wrap">
                  <Pagination
                    page={wishDate.page}
                    totalPages={wishDate.totalPage}
                    handlePagination={(page) => handlePagination(page)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Wish
