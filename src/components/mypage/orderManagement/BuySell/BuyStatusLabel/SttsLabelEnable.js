const SttsLabelEnable = (props) => {

  const { data } = props
  const sttsLabel = {
    ODS00001: '주문완료',
    ODS00005: '반품요청',
    ODS00007: '반품완료',
  }

  return (
    <>
      <div className="status_step status">
        <p className="blue">{sttsLabel?.[data?.ordnSttsId]}</p>
      </div>
    </>
  )
}

export default SttsLabelEnable
