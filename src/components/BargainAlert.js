import { useRef, useEffect, useState, useContext} from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import Loading from 'components/PartialLoading'
import NoResult from 'components/NoResult'
import moment from "moment"
import { createKey } from 'modules/utils/MathUtils'
import { UserContext } from 'modules/contexts/common/userContext'

const BargainAlert = (props) => {

  const { userAlarm, setUserAlarm } = props
  const menuRef = useRef()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [alarmList, setAlarmList] = useState(null);

  // ===== 알람목록
  const getList = async () => {
    await Axios({
      url: API.HEADER.ALARM_LIST,
      method: 'get'
    }).then((response) => {
      if (response?.data?.code === '200') {
        setAlarmList(response.data.data.list)
      }
    })
  }

  // ===== 알람 읽음 처리
  const handleReadAlarm = async (id, url) => {
    await Axios({
      url: API.HEADER.ALARM_READ,
      method: 'post',
      data: { alrtSndgNo: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        userContext?.actions?.getUserInfo() //유저 context 업데이트
        handleLink(url)
      }
    })

  }

  // ===== 알람목록으로 이동
  const handleLinkMyAlarm = () => {
    setUserAlarm(false)
    history.push(PathConstants.MY_PAGE_ALARM)
  }

  // ===== url로 이동
  const handleLink = (url) => {
    /*
    * router 를 쓰기위해 앞의 url(https://devcommerce.ibkbox.net)을 걷어냄
    * */
    // let urlList = url.split('/');
    // let routerUrl = ""
    // for(let i=0; i<urlList.length; i++) {
    //   if(i > 3) {
    //     routerUrl += "/" + urlList[i]
    //   }
    // }

    //배포
    let routerUrl = url.replace(process.env.REACT_APP_URL, '')
    //개발
    // let routerUrl = url.replace('https://devcommerce.ibkbox.net', '')

    setUserAlarm(false)
    history.push(routerUrl)
  }


  useEffect(async () => {
    if(userAlarm) await getList();
    const checkIfClickedOutside = (e) => {
      if (userAlarm && menuRef.current && !menuRef.current.contains(e.target) && e.target.className !== 'menu_popup') {
        setUserAlarm(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [userAlarm])

  useEffect(async () => {

  }, [])


  return (
      <div className={`alert_wrap ${userAlarm && `active`}`} ref={menuRef}>
        <div className="bargain_alert">
          <div className="alert_top">
            <p className="title">알람({!alarmList || alarmList?.length <= 0 ? 0 : alarmList.length})</p>
            <button className="view_all" onClick={handleLinkMyAlarm}>전체보기</button>
          </div>
          { !alarmList && <Loading/> }
          {
            alarmList?.length <= 0 ? <NoResult msg={"메세지 알람이 없습니다."} /> :
                <ul className="alert_list">
                  {/*alert_list + active  alrtRcvYn */}
                  {
                    alarmList?.map((item) => (
                        <li
                            className={`alert_item ${item.alrtRcvYn === "Y" ? "active" : ""}`}
                            key={createKey()}
                            onClick={() => handleReadAlarm(item.alrtSndgNo, item.pcLinkUrlCon)}
                            style={{ cursor: 'pointer' }}
                        >
                          <p className="text">{item.alrtCon}</p>
                          <p className="date">{moment(item.alrtSndgTs).format('YYYY-MM-DD')}</p>
                        </li>
                    ))
                  }
                </ul>

          }

        </div>
      </div>
  )
}

export default BargainAlert