import { useState, useCallback, useEffect } from 'react'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import EventManageItem from 'components/mypage/event/EventItem'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import NoResult from 'components/NoResult'

const EventManage = (props) => {

  const [pageInfo, setPageInfo] = useState({}) //페이지 정보
  const [eventList, setEventList] = useState([]) //이벤트 리스트
  const [isLoading, setIsLoading] = useState(false)
  const [params, setParams] = useState({
    pgstId: 'ALL',
    page: 1,
    tabCode: 'ALL',
    record: 10,
    more: false
  })
  const [tabList, setTabList] = useState({
    ALL: '전체',
    ETS01001: '신청완료',
    ETS01002: '선정완료',
    ETS01003: '미선정'
  })
  const [filterSelectList, setFilterSelectList] = useState({ //리스트 정렬
    ALL: '전체',
    ETS00001: '진행중',
    ETS00002: '준비중',
    ETS00003: '마감'
  })

  const handleTab = (tabCode) => {
    setParams({ ...params, tabCode: tabCode })
  }

  const handleFilterSelect = (event) => {
    setParams({ ...params, pgstId: event.target.value })
  }

  const getEventList = useCallback(async () => {
    setIsLoading(true)
    await Axios({
      url: API.MYPAGE.MY_EVENT_LIST,
      method: 'get',
      params: { ...params, tabCode: params.tabCode === 'ALL' ? '' : params.tabCode }
    }).then((response) => {
      if (response?.data?.code === '200' && !params.more) setEventList(response.data.data.list)
      if (response?.data?.code === '200' && params.more) setEventList([...eventList, ...response.data.data.list])
      setPageInfo(response.data.data)
      setIsLoading(false)
    })
  }, [params])

  const onClickMore = useCallback(() => {
    setParams({ ...params, page: params.page + 1, more: true })
  }, [params])

  useEffect(() => {
    getEventList()
  }, [params])

  return (
    <div className="mypage agency product event_manage">
      <div className="container">
        <BreadCrumbs {...props} />
        <div className="page_header">
          <div className="title_wrap">
            <h2 className="page_title">이벤트관리</h2>
            <span className="detail_title">* 신청내용에 대한 자세한 내용은 신청현황에서 확인 가능합니다.</span>
          </div>
        </div>

        <div className="product_container bind_list_container">
          <div className="tab_header">
            <ul className="tab_header_list">
              {Object.keys(tabList)?.map((tab) => (
                <li
                  className={`tab_header_item ${tab === params.tabCode ? 'active' : ''}`}
                  key={tab}
                  onClick={() => handleTab(tab)}
                >
                  <span className="label">{tabList[tab]}</span>
                </li>
              ))}
            </ul>
            <div className="select_wrap">
              <select className="select" onChange={handleFilterSelect} value={params.pgstId} title={'pgstId'}>
                {Object.keys(filterSelectList)?.map((key) => (
                  <option value={key} key={filterSelectList[key]}>
                    {filterSelectList[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ul className="event_manage_list">
            {eventList?.length === 0 ? (
              <li className="event_manage_item">
                <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '이벤트 내역이 없습니다.'} />
              </li>
            ) : (
              <>
                {eventList?.map((event, index) => (
                  <EventManageItem data={event} key={'eventList_' + index} />
                ))}
                {pageInfo.totalPage !== pageInfo.page && (
                  <div className="more_wrap">
                    <Button className="btn full_blue more" onClick={onClickMore}>
                      더보기
                    </Button>
                  </div>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EventManage
