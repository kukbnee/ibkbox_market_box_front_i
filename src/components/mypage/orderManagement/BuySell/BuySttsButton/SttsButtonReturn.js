import Button from 'components/atomic/Button'

const SttsButtonReturn = (props) => {

  const { handleButton } = props

  return (
    <>
      <Button className="btn full_blue btn_return_detail" onClick={() => handleButton('re_detail')}>반품상세</Button>
    </>
  )
}

export default SttsButtonReturn
