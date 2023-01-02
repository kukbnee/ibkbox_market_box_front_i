import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'
import Flag from 'components/atomic/Flag'
import PathConstants from 'modules/constants/PathConstants'

const EventItem = (props) => {
  const { data } = props
  const history = useHistory()
  const stateList = {
    ETS00001: {
      flag: 'full_blue',
      label: '진행중',
      content: `D-${data?.days}`
    },
    ETS00002: {
      flag: 'full_yellow',
      label: '준비중',
      content: data?.enlsDays > 0 ? `D-${data?.enlsDays}` : ``
    },
    ETS00003: {
      flag: 'full_black',
      label: '마감',
      content: ''
    }
  }
  const applyState = { 
    ETS01001: {
      label: '신청완료',
      class: 'type finish'
    },
    ETS01002: {
      label: '선정완료',
      class: 'type beSelect'
    },
    ETS01003: {
      label: '미선정',
      class: 'type noSelect'
    },
  }

  const moveEventPage = useCallback(() => history.push(`${PathConstants.EVENT_DETAIL}/${data.evntInfId}`), [])
  const moveCurrentState = useCallback(() => {
      history.push({
        pathname: `${PathConstants.MY_PAGE_EVENT_CURRENT_STATE}/${data.evntInfId}`,
        state: { applyState: data?.pgstId }
      })
  }, [data])

  return (
    <li className="event_manage_item">
      <div className="event_manage_item_wrap">
        <div className="info_wrap">
          <div className="img_wrap">
            <img src={data?.imgUrl} alt={data?.evntTtl} />
            <Flag className={stateList?.[data?.pgstId]?.flag}>
              <div className="flag_inner">
                <p className="label">{stateList?.[data?.pgstId]?.label}</p>
                <p className="content">{stateList?.[data?.pgstId]?.content}</p>
              </div>
            </Flag>
          </div>
          <div className="text_wrap">
            <p className="title">{data?.evntTtl}</p>
            <p className="text">{data?.evntCon}</p>
          </div>
        </div>
        <div className="button_wrap">
          {/*type + finish , noSelect,  beSelect*/}
          <p className={applyState?.[data.stateCode]?.class}>{applyState?.[data.stateCode]?.label}</p>
          <Button className="full_blue btn" onClick={moveEventPage}>
            이벤트페이지
          </Button>
          <Button className="linear_blue btn" onClick={moveCurrentState}>
            신청현황
          </Button>
        </div>
      </div>
    </li>
  )
}

export default EventItem
