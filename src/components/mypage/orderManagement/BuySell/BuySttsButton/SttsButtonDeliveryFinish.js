import Button from 'components/atomic/Button'

const SttsButtonDeliveryFinish = (props) => {

  const { pdfInfoId, isReviewed, handleButton } = props

  return (
    <>
      {isReviewed === "N" && pdfInfoId != null && (<Button className="btn full_blue btn_review" onClick={() => handleButton('review')}>리뷰작성</Button>)}
      <Button className="btn full_blue btn_return" onClick={() => handleButton('re_request')}>반품요청</Button>
    </>
  )
}

export default SttsButtonDeliveryFinish
