import { useEffect, useRef, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import PathConstants from 'modules/constants/PathConstants'
import QnaUserChatBtnForm from 'components/mypage/qnaUser/QnaUserChatBtnForm'
const QnaUserChatItem = (props) => {

  const history = useHistory()
  const { data, handlePopup, setEstmSheet } = props
  const scrollRef = useRef();
  const msgSentFlgType = { //메세지 플래그별 className
    Y: {
      ESS02001: "message me",
      ESS02002: "message me",
      ESS02003: "message me gray",
      ESS02004: "message me cancel"
    },
    N: {
      ESS02001: "message",
      ESS02002: "message",
      ESS02003: "message gray",
      ESS02004: "message cancel"
    },
  }
  const msgTitleList = {
    ESS02001: "견적서 전달드립니다.",
    ESS02002: "견적서 전달드립니다.",
    ESS02003: "견적서 전달드립니다.",
    ESS02004: "견적이 취소 되었습니다.",
  }

  const handleEstimate = (type, index) => {
    if(type === 'pay') handleLinkPay(index)
    else if(type === 'detail' || type === 'cancel') setEstmSheet({ paramType: type, esttInfoId: data?.list[index]?.rfcdId, data: {} })
    else handlePopup(type)
  }

  const handleLinkPay = useCallback((index) => {
    history.push({
      pathname: `${PathConstants.PAYMENT}`,
      state: { type: 'ESTM', data: { esttInfoId: data?.list[index]?.rfcdId } }
    })
  }, [data])

  useEffect(() =>{
    scrollRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [data?.list])
  
  const msgItem = (item, idx) => {
    let isContinually = data?.list[idx]?.dpmpUserId === data?.list[idx-1]?.dpmpUserId ? true : false;
    let viewBody = <div />
    if(item?.messageFlg === "Y"){
      let con = <p>{item?.con?.split("\n").map((txt, index) => ( <span key={index}>{txt}<br /></span> ))}</p>
      viewBody = <div className="message_view">{con}</div>
    } else if(item?.messageFlg === "N"){
      viewBody = (
        <div className="message_view">
          <div className="request">
            <p className="text">{msgTitleList?.[item?.pcsnSttsId]}</p>
            <QnaUserChatBtnForm 
              index={idx}
              sentMessageFlg={item?.sentMessageFlg}
              pcsnSttsId={item?.pcsnSttsId}
              handleClickBtn={(type, index) => handleEstimate(type, index)} />
          </div>
        </div>
      )
    } else {
      return
    }

    let chatBoxClass
    if(msgSentFlgType?.[item?.sentMessageFlg]?.[item?.pcsnSttsId] != undefined){
      chatBoxClass = msgSentFlgType?.[item?.sentMessageFlg]?.[item?.pcsnSttsId]
    } else {
      chatBoxClass = msgSentFlgType?.[item?.sentMessageFlg]?.["ESS02001"]
    }

    return(
      <div className={chatBoxClass} key={idx}>
        {!isContinually && 
          <p className="info">
            <span className="info01">{item?.dpmpUserInfo?.bplcNm}</span>&nbsp;
            <span className="info01">{item?.dpmpUserInfo?.userNm}</span>&nbsp;
            <span className="info01">{item?.dpmpUserInfo?.authorCodeNm}</span>
          </p>
        }
        <div className="msg_view_wrap">
          {item?.sentMessageFlg === 'Y' && <p className="date">{item?.rgsnTs ? moment(item?.rgsnTs).format('YYYY-MM-DD HH:mm') : null}</p>}
          {viewBody}
          {item?.sentMessageFlg === 'N' && <p className="date">{item?.rgsnTs ? moment(item?.rgsnTs).format('YYYY-MM-DD HH:mm') : null}</p>}
        </div>
      </div>
    )
  }

  if(data?.list?.length > 0){
    return (
      <div className="msg_wrap">
        {data?.list?.map((item, idx) => msgItem(item, idx))}
        <div ref={scrollRef} />
      </div>
    )
  } else {
    return (
      <p className="explain">상품에 대해 메시지를 입력하거나 견적을 요청하면<br />해당 영역에 표시됩니다.</p>
    )
  }
}

export default QnaUserChatItem
