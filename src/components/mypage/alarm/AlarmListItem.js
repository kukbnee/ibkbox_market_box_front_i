import { useContext } from 'react'
import Button from 'components/atomic/Button'
import { getTotalNumberBoard } from "modules/utils/MathUtils"
import {useHistory} from "react-router-dom"
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import { UserContext } from 'modules/contexts/common/userContext'


const AlarmListItem = (props) => {
    const history = useHistory();
    const userContext = useContext(UserContext)
    const { data, paging } = props

    // ===== 알람 읽음 처리
    const handleReadAlarm = async (id, url) => {
        await Axios({
            url: API.MYPAGE.MY_ALARM_READ,
            method: 'post',
            data: { alrtSndgNo: id }
        }).then((response) => {
            if (response?.data?.code === '200') {
                userContext?.actions?.getUserInfo() //유저 context 업데이트
                handleLink(url)
            }
        })
    }

    // ===== url로 이동
    const handleLink = (url) => {
        /*
        * router 를 쓰기위해 앞의 url(https://devcommerce.ibkbox.net)을 걷어냄
        * */
        // let urlList = url.split('/');
        // let routerUrl = ""
        // for(let i=0; i<urlList.length; i++) {
        //     if(i > 3) {
        //         routerUrl += "/" + urlList[i]
        //     }
        // }

        //배포
        let routerUrl = url.replace(process.env.REACT_APP_URL, '')
        //개발
        // let routerUrl = url.replace('https://devcommerce.ibkbox.net', '')

        history.push(routerUrl)
    }


  return (
    <div className="notice_item" style={{cursor: 'pointer'}} onClick={() => handleReadAlarm(data.alrtSndgNo, data.pcLinkUrlCon)}>
      <div className="cell number">{getTotalNumberBoard(paging.total, paging.page, paging.record, paging.index)}</div>
      <div className="cell text" style={{width: '58%'}}>
        <div className="text_wrap" style={{display: 'inline-block'}}>{data.alrtCon}</div>
      </div>
      <div className="cell date">
        <p className="text01">{data.alrtSndgTs.split(" ")[0]}</p>
        <p className="text01 mt">{data.alrtSndgTs.split(" ")[1]}</p>
      </div>
      <div className="cell view">
        <Button className="btn linear_grey" >상세보기</Button>
      </div>
    </div>
  )
}

export default AlarmListItem
