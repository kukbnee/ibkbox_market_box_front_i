import { useCallback, useState, useEffect, useRef } from 'react'
import { useHistory, useLocation, useParams } from "react-router-dom"
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import StarRatings from 'react-star-ratings'
import Button from 'components/atomic/Button'
import { addComma } from 'modules/utils/Common'
import Badge from 'components/atomic/Badge'
import PopupAlert from 'components/PopupAlert'
import { createKey } from 'modules/utils/MathUtils'

const Review = (props) => {

  const { id } = useParams()
  const history = useHistory()
  const location = useLocation()
  const hiddenFileInputRef = useRef()
  const allowExtensions = ['jpg', 'JPG', 'PNG', 'png', 'jpeg', 'JPEG']
  const [productInfo, setProductInfo] = useState({}) //상품정보
  const [starValue, setStarValue] = useState(0) //별점
  const [orderInfo, setOrderInfo] = useState({
    ordnInfoId: '',
    pdfInfoId: '',
    rgsnTs: '',
    qty: 0,
    ttalAmt: 0,
  })
  const [paramsReview, setParamsReview] = useState({
    revInfId: '', //리뷰 id(수정일 때만 사용)
    revCon: '', //리뷰 텍스트
    reviewFileList: [] //리뷰 이미지 첨부
  })
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    msg: '',
    msgBtn: '확인'
  })

  const handlePopupAlert = useCallback(() => {
    setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: null })
  }, [popupAlert])

  const handleLinkToDetail = useCallback(() => { //상품 상세로 이동
    history.push(`${PathConstants.PRODUCT_DETAIL}/${orderInfo?.pdfInfoId}`)
  }, [orderInfo])

  const onChangeForm = useCallback((e) => { //후기 입력
    let regExp = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g //이모지 제거
    let reviewText = e.target.value.replace(regExp, '')
    setParamsReview({ ...paramsReview, revCon: reviewText })
  }, [paramsReview])

  const handleStarValue = useCallback((rating) => { //별점
    setStarValue(rating)
  }, [])

  const onClickFindFile = useCallback(() => {
    hiddenFileInputRef.current.click()
  }, [])

  const onChangeImgFile = useCallback(async (e) => { //이미지 추가
    let file = e?.target?.files[0]
    if (file === undefined) return
    const fileForm = new FormData()
    fileForm.append('file', file)
    let fileName = e.target.files[0]?.name?.split('.')
    if (allowExtensions.includes(fileName[fileName.length - 1])) {
      await Axios({
        url: API.FILE.UPLOAD,
        method: 'post',
        data: fileForm,
        fileUpload: true
      }).then((response) => {
        if (response?.data?.code === '200') {
          setParamsReview({
            ...paramsReview,
            reviewFileList: [...paramsReview.reviewFileList, { ...response.data.data }]
          })
        }
      })
    } else {
      setPopupAlert({ ...popupAlert, active: true, msg: '지원하지 않는 형식의 파일입니다.' })
    }
  }, [paramsReview])

  const removeImgFile = useCallback((e) => { //이미지 제거
    let _reviewFileList = [...paramsReview.reviewFileList]
    _reviewFileList.splice(e.target.id, 1)
    setParamsReview({
      ...paramsReview,
      reviewFileList: [..._reviewFileList]
    })
    hiddenFileInputRef.current.value = ''
  }, [paramsReview])

  const handleReviewSave = useCallback(() => {
    if (starValue < 1) {
      setPopupAlert({ ...popupAlert, active: true, msg: '평점을 매겨주세요.' })
      return
    }
    if (paramsReview?.revCon?.length < 1) {
      setPopupAlert({ ...popupAlert, active: true, msg: '상품 후기를 입력해주세요.' })
      return
    }

    if (id) postReviewUpdate() //리뷰 수정
    else postReviewSave() //리뷰 저장

  }, [id, starValue, paramsReview, popupAlert])


  const getProductInfo = useCallback(async (pdfInfoId) => {
    await Axios({
      url: API.PRODUCT.SINGLE_DETAIL,
      method: 'get',
      params: { pdfInfoId: pdfInfoId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setProductInfo({
          ...response?.data?.data?.productInfo,
          imgUrl: response?.data?.data?.productFileList[0]?.imgUrl
        })
      }
    })
  }, [])

  const postReviewSave = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.REVIEW_WRITE,
      method: 'post',
      data: {
        ...orderInfo,
        ...paramsReview,
        revVal: starValue.toString()
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.push({ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/buySell` }) //구매판매내역으로 이동
      } else {
        setPopupAlert({ ...popupAlert, active: true, msg: '리뷰 작성에 실패했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [orderInfo, paramsReview, starValue, popupAlert])

  const postReviewUpdate = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.REVIEW_UPDATE,
      method: 'post',
      data: {
        ...orderInfo,
        ...paramsReview,
        revVal: starValue.toString()
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.goBack() //리뷰작성 완료하면 뒤로가기
      } else {
        setPopupAlert({ ...popupAlert, active: true, msg: '리뷰 수정에 실패했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [orderInfo, paramsReview, starValue, popupAlert])


  useEffect(() => {
    if (location) {
      getProductInfo(location?.state?.pdfInfoId)
      setOrderInfo({ ...location?.state })
    }

    if (id) { //리뷰 수정일 때
      setParamsReview({
        revInfId: location?.state?.revInfId,
        revCon: location?.state?.revCon,
        reviewFileList: location?.state?.reviewFileList
      })
      setStarValue(location?.state?.revVal)
    }
  }, [location, id])


  return (
    <>
      {popupAlert?.active && (
        <PopupAlert
          className={'popup_warning'}
          msg={popupAlert?.msg}
          btnMsg={popupAlert?.msgBtn}
          handlePopup={handlePopupAlert}
        />
      )}

      <div className="mypage buy_sell buy_list_wrap each_write">
        <div className="container">
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">리뷰 작성</h2>
            </div>
          </div>
          <div className="buy_sell_container">
            <div className="card_layout">
              <div className="bsreview">
                <div className="bsreview_list">
                  <div className="bsreview_item">
                    <div className="content">
                      <div className="img_wrap">
                        {productInfo?.imgUrl && <img src={productInfo.imgUrl} alt={productInfo.pdfNm} onClick={handleLinkToDetail} />}
                      </div>
                      <div className="text_wrap">
                        <div className="title_badge_wrap">
                          {productInfo?.agenInfId && (
                            <div className="badge_wrap">
                              <Badge className="badge full_blue">에이전시</Badge>
                            </div>
                          )}
                          <p className="title">{productInfo?.pdfNm}</p>
                        </div>
                        <p className="type">{productInfo?.mdlnm}</p>
                        <p className="date">주문일자: {orderInfo?.rgsnTs}</p>
                      </div>
                    </div>
                    <div className="price_wrap">
                      <p className="price">{`${addComma(Number(orderInfo?.ttalAmt))}원`}</p>
                      <p className="number">{`( ${addComma(Number(orderInfo?.qty))}개 )`}</p>
                    </div>
                  </div>
                </div>
                <div className="bsreview_rating">
                  <p className="title">평점</p>
                  <StarRatings
                    rating={starValue}
                    starRatedColor="orange"
                    starHoverColor="orange"
                    starDimension={'30px'}
                    starSpacing={'0px'}
                    changeRating={handleStarValue}
                    numberOfStars={5}
                    name="rating"
                  />
                </div>
                <div className="review_write">
                  <div className="textarea_wrap">
                    <textarea
                      className="textarea scroll"
                      placeholder="상품에 대한 솔직한 후기를 남겨주세요."
                      title={'review'}
                      value={paramsReview?.revCon ?? ''}
                      onChange={onChangeForm}
                      maxLength={800}
                    />
                    <span className="text_length_check">({paramsReview.revCon.length}&#47;800)</span>
                  </div>
                </div>
                <div className="review_upload">
                  <div className="img_upload_form_wrap">
                    <input type="file" hidden ref={hiddenFileInputRef} onChange={onChangeImgFile} title={'file'} />
                    <div className="img_upload_btn_wrap">
                      <div className="img_upload_btn_wrap">
                        {/* 이미지 */}
                        {paramsReview?.reviewFileList?.map((file, index) => (
                          <div className="btn_img_add" key={createKey()}>
                            <span className="hide"> 이미지업로드</span>
                            <img src={`${file?.imgUrl}`} alt="" />
                            <div className="img_edit">
                              <Button className="btn_delete" title={'이미지 삭제'} id={index} onClick={removeImgFile}>
                                <span className="hide">이미지삭제</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                        {paramsReview?.reviewFileList?.length < 5 && (
                          <button className="btn_plus" title={'이미지추가'} onClick={onClickFindFile}>
                            <span className="hide">이미지추가</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="explain">* 후기 사진은 최대 5개까지만 등록 가능합니다.</p>
                </div>
                <div className="review_button">
                  <Button className="full_blue btn" onClick={handleReviewSave}>리뷰 작성</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Review
