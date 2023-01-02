import React, { useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import Flag from 'components/atomic/Flag'
import Button from 'components/atomic/Button'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import PopupAlert from 'components/PopupAlert'
import moment from 'moment'
import PathConstants from 'modules/constants/PathConstants'

const CardItem = (props) => {
  const { data } = props
  const location = useLocation()
  const [popup, setPopup] = useState(false)
  const stateList = {
    ETS00001: {
      flag: 'full_blue',
      label: '진행중',
      content: `D-${data.days}`
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

  const onClickCopy = useCallback(() => setPopup(!popup), [popup])

  const handleLinkEventDetail = useCallback(() => {
    window.open(`${PathConstants.EVENT_DETAIL}/${data.evntInfId}`, '_blank')
  }, [data])

  return (
    <>
      {popup && (
          <PopupAlert
            handlePopup={onClickCopy}
            className={'event_popup_wrap wide'}
            msg={'주소가 복사 되었습니다.\n 원하시는 곳에 ctrl+v 또는 붙여넣기를 해주세요.'}
            btnMsg={'확인'}
          />
        )}
      <div className="card_item02">
        <div className="card_box" onClick={handleLinkEventDetail}>
          <Flag className={stateList?.[data?.pgstId]?.flag}>
            <div className="flag_inner">
              <p className="label">{stateList?.[data?.pgstId]?.label}</p>
              <p className="content">{stateList?.[data?.pgstId]?.content}</p>
            </div>
          </Flag>
          <div className="img_wrap">
            <img src={data?.imgUrl} width="100%" alt={data.evntTtl} />
          </div>
          <div className="txt_wrap">
            <p className="tit">{data?.evntTtl}</p>
            <p className="cnt">{data?.evntCon}</p>
            <div className="date_wrap">
              <p className="date">
                신청 기간 &#58; {moment(data?.enlsSldyTs).format('YYYY/MM/DD')} ~ {moment(data?.enlsCldyTs).format('YYYY/MM/DD')}
              </p>
              <p className="date">
                진행 기간 &#58; {moment(data?.evntStdyTs).format('YYYY/MM/DD')} ~ {moment(data?.evntFndaTs).format('YYYY/MM/DD')}
              </p>
            </div>
          </div>
        </div>
        <CopyToClipboard text={`${process.env.REACT_APP_URL}${PathConstants.EVENT_DETAIL}/${data.evntInfId}`} onCopy={onClickCopy}>
          <Button className={'btn linear_grey'}>주소복사</Button>
        </CopyToClipboard>
      </div>
    </>
  )
}

export default CardItem
