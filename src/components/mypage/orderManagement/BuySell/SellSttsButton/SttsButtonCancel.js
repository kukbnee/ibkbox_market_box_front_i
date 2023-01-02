import moment from 'moment'

const SttsButtonCancel = (props) => {

  const { date, ordnSttsId } = props

  return (
    <>
      <div className="status_step status">
        <p className="peach order_cancel">{ordnSttsId === 'ODS00002' ? '주문취소 승인' : '주문취소 완료'}</p>
      </div>
      {date && (
        <div className="sub_txt_wrap">
          <p className="cancel_date peach">{moment(date).format('YYYY.MM.DD')}</p>
        </div>
      )}
    </>
  )
}

export default SttsButtonCancel
