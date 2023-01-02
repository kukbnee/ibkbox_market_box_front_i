import moment from 'moment'

const SttsLabelDisable = (props) => {

  const { data } = props
  const sttsLabel = {
    ODS00002: '주문취소 승인',
    ODS00006: '반품불가',
    ODS00008: '주문취소 완료',
  }

  return (
    <>
      <div className="status">
        <p className="peach">{sttsLabel?.[data?.ordnSttsId]}</p>
      </div>
      {data?.ordnSttsId === 'ODS00008' && <p className="cancel_date peach">{data?.amnnTs && moment(data.amnnTs).format('YYYY.MM.DD')}</p>}
    </>
  )
}

export default SttsLabelDisable
