const Tooltip = (props) => {
  const { title = '', content = '', className = '' } = props

  return (
    <div className={`info_tooltip_wrap ${className}`}>
      <button className={'btn_help'}>
        <span className="hide">정보살펴보기</span>
      </button>
      <div className="info_tooltip">
        <div className="tooltip_inner">
          <div className="tit_section">
            <p className="tit">{title}</p>
          </div>
          <p className="cnt">{content}</p>
        </div>
      </div>
    </div>
  )
}

export default Tooltip
