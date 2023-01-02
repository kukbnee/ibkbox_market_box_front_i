import { useState, useCallback, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import moment from 'moment'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import 'assets/style/event.css'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import CardItem from 'components/product/CardItem'
import Flag from 'components/atomic/Flag'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import { UserContext } from 'modules/contexts/common/userContext'
import NoResult from 'components/NoResult'
import { createHeaderSeo } from 'modules/utils/CustromSeo'

const EventView = () => {
  const { id } = useParams()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [event, setEvent] = useState()
  const [popup, setPopup] = useState({
    active: false,
    type: 'COPY',
    COPY: {
      className: 'event_popup_wrap wide',
      msg: '주소가 복사 되었습니다.\n 원하시는 곳에 ctrl+v 또는 붙여넣기를 해주세요.',
      caseMsg: [],
      btnMsg: '확인'
    },
    QUALIFICATION: {
      className: 'event_popup_wrap narrow',
      msg: '로그인한 회원만 이벤트 신청이 가능합니다.\n 지금 로그인을 하시겠습니까?',
      caseMsg: [],
      btnMsg: '로그인하러가기'
    },
    USERTYPECHECK: {
      className: 'popup_review_warning popup_unable_pay',
      msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
      caseMsg: [
        '하단 우측의 정회원등록버튼 클릭',
        '메인BOX에서 로그인',
        '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
        '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
        '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
      ],
      btnMsg: '정회원 등록하러 가기',
      btnMsg2: '닫기',
    }
  })

  const getEventDetail = useCallback(() => {
    Axios({
      url: API.EVENT.EVENT_DETAIL,
      method: 'get',
      params: { evntInfId: id }
    }).then((response) => {
      if(response?.data?.code === '200'){
        setEvent(response.data.data);

        //
        createHeaderSeo([
          {
            name : "og:title",
            content : response.data.data.evntTtl
          },
          {
            name : "og:description",
            content : response.data.data.evntCon
          },
          {
            name : "og:url",
            content : window.location.href
          },
          {
            name : "og:image",
            // content : response.data.data.imgUrl
            content : window.location.origin+"/ibklogo.png"
          },
          {
            name : "twitter:title",
            content : response.data.data.evntTtl
          },
          {
            name : "twitter:description",
            content : response.data.data.evntCon
          },
          {
            name : "twitter:image",
            // content : response.data.data.imgUrl
            content : window.location.origin+"/ibklogo.png"
          }
        ]);
      }
    })
  }, [id])

  const stateList = {
    ETS00001: {
      flag: 'full_blue',
      label: '진행중',
      content: `D-${event?.days}`
    },
    ETS00002: {
      flag: 'full_yellow',
      label: '준비중',
      content: event?.enlsDays > 0 ? `D-${event?.enlsDays}` : ``
    },
    ETS00003: {
      flag: 'full_black',
      label: '마감',
      content: ''
    }
  }

  const getQualifications = useCallback(async (callback, setAlert) => {
    // await Axios({
    //   url: API.EVENT.QUALIFICATION,
    //   method: 'get',
    //   params: { evntInfId: id }
    // }).then((response) => {
    //   if (response?.data?.code === '200' && response?.data?.data?.eventUsedState === 'Y')
    //     history.push(`${PathConstants.EVENT_APPLY}/${id}`)
    // })
    history.push(`${PathConstants.EVENT_APPLY}/${id}`)
  }, [])

  const onClickApply = () => {
    if (userContext?.state?.userInfo?.isLogin) {
      if (userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
        userContext.state.userInfo.mmbrtypeId === 'SRS00003') {
        getQualifications();
      } else {
        setPopup({ ...popup, active: true, type: 'USERTYPECHECK' })
      }
    } else {
      setPopup({ ...popup, active: true, type: 'QUALIFICATION' })
    }
  }

  const onClickCopy = () => {
    setPopup({ ...popup, active: true, type: 'COPY' })
  }

  const closePopup = useCallback((btnType) => {
    if (btnType === 'btnMsg' && popup.type === 'USERTYPECHECK') { //메인박스 로그인으로 이동
      window.open(`${process.env.REACT_APP_MAIN_BOX_URL}/member/login.do`)
      return
    }

    if (btnType === 'btnMsg' && popup.type === 'QUALIFICATION') window.esgLogin() //로그인
    setPopup({ ...popup, active: false })
  }, [popup])

  useEffect(() => {
    getEventDetail()
  }, [])


  const ProductView = () => {
    switch (event?.pgstId) {
      case 'ETS00002': {
        let fromNowApply = moment(event?.enlsSldyTs).fromNow() //모집 시작일
        let fromNowProcess = moment(event?.evntStdyTs).fromNow() //이벤트 시작일
        let checkApply = fromNowApply.search('ago') //모집 시작했는지 확인
        let checkProcess = fromNowProcess.search('ago') //이벤트 시작했는지 확인

        return (
          <>
            {event?.evntUsedState === 'Y' && event?.reqDate != null ? (
              <div className="event_apply_notice">
                <div className="guide_wrap">
                  <p className="tit">이벤트 신청이 완료되었습니다&#46;</p>
                  <p className="exp">
                    이벤트 신청현황은&nbsp;
                    <span className="link_blue" onClick={() => history.push(PathConstants.MY_PAGE_EVENT)}>
                      마이페이지 &#62; 이벤트관리
                    </span>
                    에서 확인 가능합니다&#46;
                  </p>
                  <p className="date">신청일시 &#58; {moment(event.reqDate).format('YYYY-MM-DD HH:mm')}</p>
                </div>
              </div>
            ) : event?.evntUsedState === 'Y' && event?.reqDate == null ? (
              <div className="event_apply_notice">

                <div className="inner">
                  <p className="comment">해당 이벤트에 등록될 상품을 신청해보세요&#46;</p>
                  <Button className={'btn linear_blue'} onClick={onClickApply}>이벤트 신청</Button>
                </div>
              </div>
            ) : (
              <div className="event_apply_notice">

                <div className="inner">
                  <p className="comment">
                    {checkApply < 0 && checkProcess < 0 ? (
                      `이벤트가 곧 시작될 예정입니다.` //모집, 이벤트 시작 전
                    ) : (
                      `이벤트가 곧 시작될 예정입니다. (이벤트 신청 마감)` //모집, 이벤트 중 하나 시작 후
                    )}
                    <br />잠시만 기다려주세요!
                  </p>
                </div>
              </div>
            )}
          </>
        )
      }
      case 'ETS00001': {
        if (event?.items?.length <= 0) {
          return <NoResult msg={'등록된 상품이 없습니다.'} />
        } else {
          return (
            event?.items?.length > 0 && (
              <ul className="product_list">
                {event?.items?.map((product, index) => (
                  <li className="product_item" key={'productList' + index}>
                    <CardItem data={product} />
                  </li>
                ))}
              </ul>
            )
          )
        }
      }
      case 'ETS00003': {
        if (event && event?.items?.length > 0) {
          return getEventList(event)
        } else {
          return <NoResult msg={'등록된 상품이 없습니다.'} />
        }
      }
    }
  }

  // 이벤트 목록 출력
  const getEventList = (data) => {
    return <ul className="product_list">
      {data?.items?.map((product, index) => (
        <li className="product_item" key={'productList' + index}>
          <CardItem data={product} />
        </li>
      ))}
    </ul>
  }

  return (
    <div className="wrap event_view default_size ">
      <div className="container default_size">
        <div className="list_item_expansion">
          <div className="img_wrap">
            <img src={event?.imgUrl} alt={event?.evntTtl} className="big_img" />
          </div>
          <div className="txt_wrap">
            <p className="tit">{event?.evntTtl}</p>
            <p className="cnt">{event?.evntCon}</p>
            <div className="btn_wrap">
              <CopyToClipboard text={`${process.env.REACT_APP_URL}${location.pathname}`} onCopy={onClickCopy}>
                <Button className={'btn linear_grey'}>주소복사</Button>
              </CopyToClipboard>
              <div className="date_wrap">
                <p className="date">
                  신청 기간 &#58; {moment(event?.enlsSldyTs).format('YYYY/MM/DD')} ~ {moment(event?.enlsCldyTs).format('YYYY/MM/DD')}
                </p>
                <p className="date">
                  진행 기간 &#58; {moment(event?.evntStdyTs).format('YYYY/MM/DD')} ~ {moment(event?.evntFndaTs).format('YYYY/MM/DD')}
                </p>
              </div>
            </div>
            <Flag className={stateList?.[event?.pgstId]?.flag}>
              <div className="flag_inner">
                <p className="label">{stateList?.[event?.pgstId]?.label}</p>
                <p className="content">{stateList?.[event?.pgstId]?.content}</p>
              </div>
            </Flag>
          </div>
        </div>
        <div className="tab_header">
          <ul className="tab_header_list">
            <li className={`tab_header_item 'active' `}>
              <span className="label">상품</span>
              <span className="cnt">&#40;{event?.items?.length ?? 0}&#41;</span>
            </li>
          </ul>
        </div>
        {event?.pgstId && <ProductView />}
      </div>

      {popup?.active && (
        <PopupAlert
          className={popup[popup.type].className}
          msg={popup[popup.type].msg}
          caseMsg={popup[popup.type].caseMsg}
          btnMsg={popup[popup.type].btnMsg}
          btnMsg2={popup[popup.type].btnMsg2}
          handlePopup={(btnType) => closePopup(btnType)}
        />
      )}
    </div>
  )
}

export default EventView
