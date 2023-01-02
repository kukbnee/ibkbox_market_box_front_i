import ContentsItem from 'components/mypage/myInfo/Banner/ContentsItem'

const Content = (props) => {

  const { data } = props

  return (
    <>
      {data?.length > 0 ? (
        <div className="homeview_banner_wrap">
          {data.map((item, index) => (
            <ContentsItem data={item} key={index} />
          ))}
        </div>
      ) : (
        <div className="homeview_banner_nodata">등록된 배너가 없습니다. 배너는 최대 3개까지 등록 가능합니다.</div>
      )}
    </>
  )
}

export default Content
