import { useState, useEffect, useCallback } from 'react'
import BreadCrumbs from 'components/BreadCrumbs'
import Pagination from 'components/atomic/Pagination'
import NoResult from 'components/NoResult'
import AlarmListItem from 'components/mypage/alarm/AlarmListItem'
import Axios from "modules/utils/Axios"
import API from "modules/constants/API"
import { createKey } from "modules/utils/MathUtils"

const MyAlarm = (props) => {

  const [alarmList, setAlarmList] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [params, setParams] = useState({ page: 1 })

  const handlePagination = useCallback(
    (page) => {
      setParams({ ...params, page: page })
    },
    [params]
  )

  const getList = async () => {
    setIsLoading(true)
    await Axios({
      url: API.MYPAGE.MY_ALARM_LIST,
      method: 'get',
      params: params
    }).then((response) => {
      if (response?.data?.code === '200') {
        setAlarmList(response.data.data)
      }
      setIsLoading(false)
    })
  }


  useEffect(async () => {
    await getList()
  }, [params])


  return (
    <div className="mypage">
      <div className="container">
        <BreadCrumbs {...props} />
        <div className="page_header">
          <h2 className="page_title">알람</h2>
        </div>
        <div className="product_container">
          <div className="notice_list_title">
            <p className="title">알람 목록</p>
          </div>
          <div className="notice_list">
            {alarmList?.list?.length > 0 ? (
              alarmList.list.map((item, index) => (
                <AlarmListItem
                  data={item}
                  key={createKey()}
                  paging={{
                    total: alarmList.total,
                    page: alarmList.page,
                    record: alarmList.record,
                    index: index
                  }}
                />
              ))
            ) : (
              <NoResult msg={isLoading? '데이터를 불러오고 있습니다' : '알람이 없습니다.'} />
            )}
          </div>
          {alarmList?.totalPage > 0 && (
            <div className="pagination_wrap">
              <Pagination
                page={alarmList?.page}
                totalPages={alarmList?.totalPage}
                handlePagination={(page) => handlePagination(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyAlarm
