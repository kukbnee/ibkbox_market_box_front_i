import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import { SwiperSlide } from 'swiper/react'
import StarRating from 'components/atomic/StarRating'
import Button from 'components/atomic/Button'
import Slider from 'components/product/detail/Slider'
import ReviewItem from 'components/product/ReviewItem'
import Pagination from 'components/atomic/Pagination'
import PopupReview from 'components/product/PopupReview'
import PopupAlert from 'components/PopupAlert'
import PopupCustom from 'components/PopupCustom'
import NoResult from 'components/NoResult'
import { createKey } from 'modules/utils/MathUtils'

const ProductReview = (props) => {

  const { id } = useParams()
  const [reviews, setReviews] = useState([])
  const [reviewHeaderInfo, setReviewHeaderInfo] = useState([])
  const [reviewImgList, setReviewImgList] = useState([])
  const [popupAlert, setPopupAlert] = useState({ active: false, type: 'ALERT', msg: '', btnMsg: '확인' })
  const [popupLogin, setPopupLogin] = useState(false)
  const [params, setParams] = useState({
    page: 1,
    record: 10,
    revInfId: '' //리뷰 id
  })

  const handlePopupAlert = useCallback((type) => { //일반 alert 팝업
    setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '' })
    if (type === 'btnMsg' && popupAlert?.type === 'DELETE') postReviewDelete()
  }, [popupAlert])

  const handleLoginPopup = useCallback((type) => { //로그인 팝업
    setPopupLogin(!popupLogin)
    if (type === 'login') window.esgLogin()
  }, [popupLogin])

  const handlePagination = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])

  const handleReviewDelete = useCallback((revInfId) => { //리뷰 삭제
    setPopupAlert({ ...popupAlert, active: true, type: 'DELETE', msg: '리뷰를 삭제 하시겠습니까?' })
    setParams({ ...params, revInfId: revInfId })
  }, [params, popupAlert])


  const getReviewHeaderInfo = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.REVIEW_HEADER_INFO,
      method: 'get',
      params: { pdfInfoId: id }
    }).then((response) => {
      if (response.data.code === '200') setReviewHeaderInfo(response.data.data)
    })
  }, [id])

  const getReviewList = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.REVIEW_LIST,
      method: 'get',
      params: {
        ...params,
        pdfInfoId: id,
      }
    }).then((response) => {
      if (response.data.code === '200') setReviews(response.data.data)
    })
  }, [id, params])

  const getReviewImgList = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.REVIEW_IMAGE_LIST,
      method: 'get',
      params: { pdfInfoId: id }
    }).then((response) => {
      if (response.data.code === '200') setReviewImgList(response.data.data.list)
    })
  }, [id])

  const postReviewDelete = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.REVIEW_DELETE,
      method: 'post',
      data: { revInfId: params?.revInfId }
    }).then((response) => {
      if (response.data.code === '200') getReviewList()
      else setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
    })
  }, [params, popupAlert])


  useEffect(() => {
    getReviewList()
    getReviewImgList()
    getReviewHeaderInfo()
  }, [id])


  return (
    <>
      {/*상품구매 후 작성 가능 메세지 팝업*/}
      {popupAlert?.active && popupAlert?.type === 'ALERT' && (
        <PopupAlert
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={'확인'}
          handlePopup={() => handlePopupAlert('close')}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'DELETE' && (
        <PopupAlert
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={'삭제하기'}
          handlePopup={(type) => handlePopupAlert(type)}
        />
      )}
      {/* 로그인 팝업 */}
      {popupLogin && (
        <PopupCustom className={'register_info_popup add_cart_popup'} handlePopup={() => handleLoginPopup('close')}>
          <div className="content">
            <div className="text">로그인이 필요합니다.</div>
          </div>
          <div className="btn_group">
            <Button className={'full_blue'} onClick={() => handleLoginPopup('login')}>
              로그인하러 가기
            </Button>
          </div>
        </PopupCustom>
      )}

      <div className="product_review_wrap">
        <div className="product_tit_header">
          <div className="title_wrap">
            <p className="title">구매후기({reviewHeaderInfo?.totalReviewCnt ?? 0})</p>
            <div className="star_wrap">
              {reviewHeaderInfo?.totalReviewValue && (
                <StarRating activeCnt={reviewHeaderInfo?.totalReviewValue ?? 0} maxCnt={5} />
              )}
            </div>
          </div>
        </div>
        {reviews?.list?.length > 0 ? (
          <>
            {/* 이미지 슬라이드 */}
            <div className="product_picture_wrap">
              <SlideImg reviewImgList={reviewImgList} />
            </div>

            {/* 리뷰리스트 */}
            <ul className="product_review_list">
              {reviews?.list?.map((review, idx) => (
                <li className="product_review_item" key={createKey()}>
                  <ReviewItem
                    data={review}
                    reviewImg={review?.reviewFileList?.length ? review.reviewFileList[0].imgUrl : null}
                    handleReviewDelete={(revInfId) => handleReviewDelete(revInfId)}
                  />
                </li>
              ))}
            </ul>

            {reviews?.totalPage > 0 && (
              <div className="pagination_wrap">
                <Pagination
                  page={reviews?.page}
                  totalPages={reviews?.totalPage}
                  handlePagination={(page) => handlePagination(page)}
                />
              </div>
            )}
          </>
        ) : (
          <NoResult msg={'등록된 구매후기가 없습니다'} />
        )}
      </div>
    </>
  )
}

const SlideImg = (props) => { //이미지 슬라이드

  const { reviewImgList } = props
  const [reviewPopup, setReviewPoup] = useState(false)
  const [imageList, setImageList] = useState([])
  const [clickedItem, setClickedItem] = useState({})

  const handlePopupView = useCallback((review) => {
    setClickedItem({ ...review })
    setReviewPoup(!reviewPopup)
  }, [reviewPopup])

  useEffect(() => {
    const _imageList = reviewImgList && reviewImgList.filter((item) => item?.reviewFileList.length > 0 ?? item?.reviewFileList[0])
    setImageList([..._imageList])
  }, [reviewImgList])

  return (
    <Slider>
      {imageList?.length > 0 && imageList?.map((review) => (
        <SwiperSlide key={createKey()}>
          <div className="main_gallery_item" onClick={() => handlePopupView(review)}>
            <div className="img_wrap">
              <img src={review?.reviewFileList[0]?.imgUrl} alt="" />
            </div>
          </div>
        </SwiperSlide>
      ))}
      {reviewPopup && <PopupReview data={clickedItem} handlePopup={handlePopupView} />} {/* 리뷰 팝업 */}
    </Slider>
  )
}

export default ProductReview
