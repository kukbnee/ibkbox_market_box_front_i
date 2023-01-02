import Button from 'components/atomic/Button'

const SttsButtonReturn = (props) => {

  const { ordnSttsId, handleButton } = props
  const dvrySttsLabel = {
    ODS00005: '반품요청',
    ODS00006: '반품불가',
    ODS00007: '반품완료',
  }

  return (
    <>
      <div className="status_step status">
        <p className="grey">{dvrySttsLabel?.[ordnSttsId]}</p>
      </div>
      <div className="btn_group">
        <Button className="btn full_blue btn_return_detail" onClick={() => handleButton('re_detail')}>반품상세</Button>
      </div>
    </>
  )
}

export default SttsButtonReturn
