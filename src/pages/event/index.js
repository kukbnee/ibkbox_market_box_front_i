import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'assets/style/event.css'
import 'swiper/swiper-bundle.css'
import 'swiper/swiper.min.css'
import CardItem from 'components/event/CardItem'
import { createKey } from 'modules/utils/MathUtils'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'

const event = (props) => {

  const [eventList, setEventList] = useState([])
  const [eventCount, setEventCount] = useState({
    eventTotalCnt: 0,
    eventReadyCnt: 0,
    eventIngCnt: 0,
    eventEndCnt: 0
  })
  const [bannerList, setBannerList] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(999)
  const [tabList, setTabList] = useState({
    active: '',
    list: [
      { id: 'eventTotalCnt', code: '', text: '전체' },
      { id: 'eventIngCnt', code: 'ETS00001', text: '진행중' },
      { id: 'eventReadyCnt', code: 'ETS00002', text: '준비중' },
      { id: 'eventEndCnt', code: 'ETS00003', text: '마감' }
    ]
  })

  const handleTabCode = (code) => {
    setPage(1)
    setTabList({
      ...tabList,
      active: code
    })
  }

  const onChangeSearch = useCallback((e) => {
      setPage(1)
      setSearch(e.target.value)
    },[search])

  const onPressEnter = useCallback((e) => {
    if (e.key === 'Enter') getEventList()
  }, [search])

  const getEventList = useCallback(async () => {
    await Axios({
      url: API.EVENT.EVENT_LIST,
      method: 'get',
      params: {
        pgstId: tabList.active,
        evntTtl: search,
        page: page,
        record: 10
      }
    }).then((response) => {
      if (response?.data?.code === '200' && page === 1) {
        setEventList(response?.data?.data.list)
        setTotalPage(response?.data?.data.totalPage)
      }
      if (response?.data?.code === '200' && page !== 1) {
        setEventList([...eventList, ...response?.data?.data.list])
      }
    })
  }, [search, tabList, page])

  const getEventCount = useCallback(async () => {
    await Axios({
      url: API.EVENT.COUNTING,
      method: 'get'
    }).then((response) => {
      response?.data?.code === '200' && setEventCount({...response.data.data})
    })
  }, [search, tabList])

  const getEventBanner = useCallback(async () => {
    await Axios({
      url: API.EVENT.BANNER_LIST,
      method: 'get',
      params: {bantypeId: 'BNS00004'}
    }).then((response) => {
      response?.data?.code === '200' && setBannerList(response.data.data.list)
    })
  }, [search, tabList])

  const onClickMore = useCallback(() => {
    setPage(page + 1)
  }, [page])

  useEffect(() => {
    getEventList()
    getEventCount()
    getEventBanner()
  }, [tabList, page])


  return (
    <div className="event">
      <div className="container default_size">
        {bannerList.length > 0 && <div className="gallery02">
          <Swiper
              pagination={{ clickable: true }}
              loop={true}
              autoplay={{ delay: '5000', disableOnInteraction: false }}>
            {bannerList?.map((banner, index) => (
                <SwiperSlide key={`banner_${index}`}>
                  <Link to={{ pathname: banner.link }} target="_blank" className="img_wrap">
                    <img src={banner.imgUrl} alt={banner.ttl} className="gallery02_img" />
                  </Link>
                </SwiperSlide>
            ))}
          </Swiper>
        </div>}
        <div className="event_tab_wrap padding-left-right01">
          <div className="tab_header" style={{paddingTop: '10px'}}>
            <ul className="tab_header_list">
              {tabList.list.map((tab) => (
                <li
                  className={`tab_header_item ${tabList.active === tab.code ? 'active' : ''}`}
                  key={tab.id}
                  onClick={() => handleTabCode(tab.code)}
                >
                  <span className="label">{tab.text}</span>
                  <span className="cnt">&#40;{eventCount?.[tab?.id]}&#41; </span>
                </li>
              ))}
            </ul>
            <div className="search_wrap">
              <input
                type="text"
                className="input"
                title={'search'}
                onChange={onChangeSearch}
                onKeyPress={onPressEnter}
              />
              <button className="btn btn_search" onClick={getEventList}>
                <span className="hide">검색</span>
              </button>
            </div>
          </div>
          <ul className="list_wrap">
            {!eventList || eventList.length <= 0 && <NoResult msg={'이벤트 목록이 없습니다.'}/>}
            {eventList?.map((event) => (
              <li className="list_item" key={createKey()}>
                <CardItem data={event} />
              </li>
            ))}
          </ul>
          {(!eventList || eventList.length <= 0) || (totalPage !== page) && (
            <Button className="btn full_blue more_btn" onClick={onClickMore}>
              더보기
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}



export default event
