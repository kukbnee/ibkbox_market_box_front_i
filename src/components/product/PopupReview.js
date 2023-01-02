import { useEffect, useCallback } from 'react'
import { BtnClose } from 'components/atomic/IconButtons'
import StarRatings from 'react-star-ratings'
import moment from 'moment'
import { createKey } from 'modules/utils/MathUtils'

const PopupReview = (props) => {

  const { data, handlePopup } = props

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

  useEffect(() => { // 뒷 화면 스크롤 방지
    document.body.style.cssText = `
      position: fixed; 
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `

    return () => {
      const scrollY = document.body.style.top
      document.body.style.cssText = ''
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1)
    }
  }, [])

  return (
    <div className="popup_wrap type02 popup_review">
      <div className="layer">&nbsp;</div>
      <div className="container scroll">
        <BtnClose onClick={handlePopup} />
        <div className="popup_content">
          <div className="review_container">
            <div className="review_content_top">
              <div className="review_top_left">
                <StarRatings
                  rating={data?.revVal}
                  starRatedColor="#ffcc00"
                  starDimension="15px"
                  starSpacing="1px"
                  numberOfStars={5}
                  name="rating"
                />
                <p className="user_name">{data?.pucsUsisName}{data?.rgsnUserName ? ` ${onFormSecretName(data.rgsnUserName)}` : null}</p>
              </div>
              <div className="review_top_right">
                <p className="review_date">{data?.rgsnTsStr ? moment(data.rgsnTsStr).format('YYYY/MM/DD') : '-'}</p>
              </div>
            </div>

            {/* 텍스트, 이미지 */}
            <div className="review_pic_container scroll">
              <pre>
                <div className="review_content">{data?.revCon}</div>
              </pre>
              {/* 이미지 */}
              {data?.reviewFileList?.length > 0 && data.reviewFileList.map((file) => (
                <div className="review_picture" key={createKey()}>
                  <img src={file.imgUrl} alt={data?.pucsUsisName} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupReview
