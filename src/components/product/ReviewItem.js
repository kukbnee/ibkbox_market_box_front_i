import { useState, useCallback, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from 'modules/contexts/common/userContext'
import PathConstants from 'modules/constants/PathConstants'
import StarRatings from 'react-star-ratings'
import moment from 'moment'
import Button from 'components/atomic/Button'
import PopupReview from 'components/product/PopupReview'

const ReviewItem = (props) => {

  const { data, reviewImg, handleReviewDelete } = props
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [reviewPopup, setReviewPoup] = useState(false)

  const handlePopupView = useCallback(() => {
    setReviewPoup(!reviewPopup)
  }, [reviewPopup])

  const handleReviewEdit = useCallback(() => {
    history.push({
      pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_BUY_REVIEW}/${data?.revInfId}`,
      state: {
        pdfInfoId: data?.pdfInfoId,
        rgsnTs: data?.ordnTsStr ? moment(data?.ordnTsStr).format('YYYY-MM-DD') : '-', //주문일
        qty: data?.qty,
        ttalAmt: data?.ttalAmt,
        ordnInfoId: data?.ordnInfoId,
        revInfId: data?.revInfId,
        revVal: data?.revVal,
        revCon: data?.revCon,
        reviewFileList: data?.reviewFileList,
      }
    })
  }, [data])

  const onFormSecretName = useCallback((name) => {
    if(name === null || name === undefined){
      return
    }

    let nameArr = name.split('')
    let newForm = ''
    nameArr.map((letter, index) => {
      if(index === 0 || index === nameArr.length -1) newForm = newForm + letter
      else newForm = newForm + "*"
    })

    return newForm

  }, [data])


  return (
    <>
      <div className="review_item" onClick={handlePopupView}>
        <div className="review_content">
          <div className="review_content_top">
            <StarRatings
              rating={data?.revVal}
              starRatedColor="#ffcc00"
              starDimension="15px"
              starSpacing="1px"
              numberOfStars={5}
              name="rating"
            />
            <p className="user_name">{data?.pucsUsisName}{data?.rgsnUserName ? ` ${onFormSecretName(data.rgsnUserName)}` : null}</p>
            {data?.pucsUsisId === userContext?.state?.userInfo?.utlinsttId && (
              <div className="button_wrap">
                <Button className="btn full_blue" onClick={handleReviewEdit}>수정</Button>
                <Button className="btn full_blue" onClick={() => handleReviewDelete(data?.revInfId)}>삭제</Button>
              </div>
            )}
          </div>
          <pre>
            <div className="review_content_text">{data?.revCon}</div>
          </pre>
        </div>
        <div className="review_picture">
          <p className="review_date">{data?.rgsnTsStr ? moment(data?.rgsnTsStr).format('YYYY/MM/DD') : null}</p>
          <p className="img_wrap">
            {reviewImg != null && <img src={reviewImg} alt={data?.pucsUsisName} />}
          </p>
        </div>
      </div>
      {reviewPopup && <PopupReview data={data} handlePopup={handlePopupView} />} {/* 리뷰 팝업 */}
    </>
  )
}

export default ReviewItem
