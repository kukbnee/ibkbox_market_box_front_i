import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import { addComma } from 'modules/utils/Common'

const CardItem = (props) => {

  const { data } = props
  const history = useHistory()

  const handleLinkDetail = useCallback(() => {
    history.push(`${PathConstants.PRODUCT_DETAIL}/${data.pdfInfoId}`)
  }, [data])

  return (
    <div className="card_item03">
      <div className="card_inner" onClick={handleLinkDetail}>
        <div className="img_wrap">
          {data?.imgUrl && <img src={data.imgUrl} alt={data.pdfNm} />}
        </div>
        <div className="content">
          <p className="name">{data?.pdfNm}</p>
          {
            data.prcDscsYn === 'Y' ? <p className="price">가격협의</p> : <p className="price">{Number(data?.salePrc) > 0 ? addComma(data?.salePrc) : addComma(data?.pdfPrc)}원</p>
          }

        </div>
      </div>
    </div>
  )
}

export default CardItem
