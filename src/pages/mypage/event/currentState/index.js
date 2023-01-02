import { useState, useCallback, useEffect } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import EndRec from 'pages/mypage/event/currentState/EndRec'
import Apply from 'pages/mypage/event/currentState/Apply'

const CurrentState = (props) => {
  const location = useLocation()
  const applyState = location?.state?.applyState
  const { id } = useParams()
  const history = useHistory()
  const [eventInfo, setEventInfo] = useState({pgstId: ''})

  const getEventStateDetail = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_EVENT_STATE_DETAIL,
      method: 'get',
      params: {evntInfId: id}
    }).then((response) => {
      if (response?.data?.code === '200') setEventInfo(response.data.data.data)
    })
  }, [id])

  const movePageEvent = useCallback(() => {
    history.push(`${PathConstants.EVENT_DETAIL}/${id}`)
  }, [id])

  useEffect(() => {
    getEventStateDetail()
  }, [])

  const tabList = {
    ETS00001: ( <EndRec eventInfo={eventInfo} /> ), //진행중
    ETS00002: ( <Apply eventInfo={eventInfo} movePageEvent={movePageEvent} /> ), //준비중
    ETS00003: ( <EndRec eventInfo={eventInfo} /> ) //마감
  }

  return (
    <div className="mypage product event_apply view">
      <div className="container">
        <BreadCrumbs {...props} />
        <div className="page_header">
          <div className="title_wrap">
            <h2 className="page_title">신청현황</h2>
          </div>
        </div>
        {tabList[applyState]}
      </div>
    </div>
  )
}

export default CurrentState
