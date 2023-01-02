import moment from 'moment'

const ContentsItem = (props) => {

  const { data } = props

  const openTypeList = {
    Y: <div className="type on">공개중</div>,
    N: <div className="type">비공개</div>
  }

  return (
    <div className="homeview_banner">
      <div className="info">
        <div className="img_wrap">
          {data?.imgUrl ? <img src={data.imgUrl} alt={data?.fileNm} /> : null}
        </div>
        <div className="contents_wrap">
          <p className="name">{data?.ttl}</p>
          <div className="content">
            <div className="date">등록 : {data?.rgsnTsStr ? moment(data.rgsnTsStr).format('YYYY-MM-DD') : null}</div>
            <div className="url">{data?.url}</div>
          </div>
        </div>
      </div>
      {openTypeList?.[data?.oppbYn]}
    </div>
  )
}

export default ContentsItem
