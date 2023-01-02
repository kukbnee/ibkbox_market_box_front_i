export const BtnClose = (props) => {
  const { ...other } = props
  return (
    <button className={'ico_btn_close'} title={'닫기'} {...other}>
      <span className="hide">닫기</span>
    </button>
  )
}

export default {
  BtnClose
}
