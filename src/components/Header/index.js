import React, { useContext, useEffect, useState, useRef, memo, useCallback } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Badge from 'components/atomic/Badge'
import BargainAlert from 'components/BargainAlert'
import Button from 'components/atomic/Button'
import NavMenu from 'components/NavMenu'
import { UserContext } from 'modules/contexts/common/userContext'
import PathConstants from 'modules/constants/PathConstants'
import UserMenu from 'components/Header/UserMenu'
import PopupAlert from 'components/PopupAlert'
import {clear} from "core-js/internals/task";
import SessionTimeoutPopup from "../SessionTimeoutPopup";

const Header = () => {
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  const [userMenu, setUserMenu] = useState(false)
  const [userAlarm, setUserAlarm] = useState(false)

  const allProductList = [PathConstants.EVENT_DETAIL, PathConstants.SELLER_STORE]

  const checkUrl = () => {
    let result = false
    allProductList.map((item) => {
      result = result || location.pathname.includes(item)
    })
    return !result
  }

  const onClickLogin = () => {
    window.esgLogin();
  }

  const onClickLogout = () => {
    userContext.actions.logout()
  }

  // 모바일 메뉴 활성화 비활성화
  const navMenuRef = useRef(null)
  const handleNavMenu = () => {
    if (navMenuRef.current.classList.contains('active')) {
      navMenuRef.current.classList.remove('active')
    } else {
      navMenuRef.current.classList.add('active')
    }
  }

  const current1DepthPath = location?.pathname?.match(/\/[a-zA-Z0-9._-]+/gm)?.[0]

  // 20221229 추가
  // 세션 연장(jwt 토큰의 만료기간 연장)을 위한 타이머 및 팝업창 타이머

  /*
   * 타이머
   */
  const [sessionMin, setSessionMin] = useState(2)
  const [sessionSec, setSessionSec] = useState(0)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const time = useRef(120);
  const timerId = useRef(null);

  useEffect(() => {
    if(localStorage.getItem("token") && time.current > 0) {
      timerId.current = setInterval(() => {
        setSessionMin(parseInt(time.current / 60));
        setSessionSec(time.current % 60);
        time.current -= 1;
      }, 1000);
    }
    return () => clearInterval(timerId.current);
  }, [time]);

  useEffect(() => {
    if(localStorage.getItem("token")) {
      console.log(new Date().getTime());
      time.current = 120;
      timerId.current = null;
    }
  }, [localStorage.getItem("token")])

  useEffect(() => {
    if(time.current === 90) {
      setPopup(true)
    }

    if(time.current <= 0) {
      console.log("타임 아웃");
      clearInterval(timerId.current);
    }
  }, [sessionSec])

  const [popup, setPopup] = useState(false)

  const closePopup = useCallback((btnType) => {
    if (btnType === 'btnMsg') { //메인박스 로그인으로 이동
      alert("세션 갱신 완료~!")
      return
    }
    setPopup(false)
  }, [popup])

  const LoginMenu = () => {
    const [search, setSearch] = useState('')

    const onChangeSearch = useCallback((e) => setSearch(e.target.value), [search])

    const moveSearchResult = useCallback(() => {
      history.push({
        pathname: PathConstants.MAIN_SEARCH_RESULT,
        state: { search: search }
      })
    }, [search])

    const onPressEnter = useCallback(
      (e) => {
        e.key === 'Enter' && moveSearchResult()
      },
      [search]
    )

    return userContext?.state?.userInfo?.isLogin ? (
      <>
        {checkUrl() && (
          <li className="user_menu_item ">
            <div className="header_search_wrap">
              <input
                type="text"
                className="input"
                onChange={onChangeSearch}
                value={search ? search : ''}
                onKeyPress={onPressEnter}
                title={'검색'}
              />
              <Button className={'btn_search'} onClick={moveSearchResult}>
                <span className="hide">검색</span>
              </Button>
            </div>
          </li>
        )}
        <li className="user_menu_item user_menu_item_alarm">
          {userContext?.state?.userInfo?.alarmCnt === "Y" && <Badge className={'badge full_grey'} />}
          {/* <Badge className={'badge full_grey'}>
            {userContext?.state.userInfo.alarmCnt ? userContext.state.userInfo.alarmCnt : 0}
          </Badge> */}
          <Button className={`btn_alarm ${userAlarm ? `active` : ''}`} onClick={() => setUserAlarm(!userAlarm)}>
            <span className="hide">알람</span>
          </Button>
        </li>
        <li className="user_menu_item">
          <Button className={'btn_user'} onClick={() => setUserMenu(!userMenu)}>
            <span className="hide">마이페이지</span>
          </Button>
          <UserMenu userMenu={userMenu} setUserMenu={setUserMenu} onClickLogout={onClickLogout} />
        </li>
        <li className="user_menu_item">
          <Badge className={'badge full_skyblue'}>
            {userContext?.state.userInfo.basketCnt && Number(userContext?.state.userInfo.basketCnt) > 0
              ? userContext.state.userInfo.basketCnt
              : 0}
          </Badge>
          <Button className={'btn_cart'} onClick={() => history.push(PathConstants.MY_PAGE_CART)}>
            <span className="hide">장바구니</span>
          </Button>
        </li>
        {/*<button onClick={onClickLogout}>로그아웃</button>*/}
      </>
    ) : (
      <>
        <button onClick={onClickLogin}>로그인</button>
      </>
    )
  }

  return (
    <div className="header">
      <NavMenu handleNavMenu={handleNavMenu} ref={navMenuRef} />
      <div className="header_inner default_size">
        <h1 className="logo">
          <Link to={PathConstants.MAIN}>
            <img src={require('assets/images/logo.png').default} alt="logo" />
          </Link>
        </h1>
        <button className="btn_menu mobile" onClick={handleNavMenu}>
          <span className={'hide'}>모바일왼쪽메뉴</span>
          <span className="bar bar01">&nbsp;</span>
          <span className="bar bar02">&nbsp;</span>
          <span className="bar bar03">&nbsp;</span>
        </button>
        {checkUrl() ? (
          <ul className="nav_list">
            <li className={`nav_item ${current1DepthPath === PathConstants.PRODUCT && 'active'}`}>
              <Link to={PathConstants.PRODUCT}>상품</Link>
            </li>
            <li className={`nav_item ${current1DepthPath === PathConstants.EVENT && 'active'}`}>
              {/* <button onClick={onClickEvent}>이벤트</button> */}
              <Link to={PathConstants.EVENT}>이벤트</Link>
            </li>
            <li className={`nav_item ${current1DepthPath === PathConstants.FAQ && 'active'}`}>
              <Link to={PathConstants.FAQ}>FAQ</Link>
            </li>
          </ul>
        ) : (
          <ul className="nav_list">
            <li className="nav_item " key={'header_menu_type02_'}>
              <Link to={{ pathname: PathConstants.PRODUCT, state: { depth: 1, ctgyCd: '01', ctgyNm: '전체' } }}>
                전체상품 보러가기
              </Link>
            </li>
          </ul>
        )}
        <ul className="user_menu_list pc">
          <LoginMenu />
        </ul>
        <BargainAlert userAlarm={userAlarm} setUserAlarm={setUserAlarm} />
        {
          userContext?.state?.userInfo?.isLogin &&
          <span>{sessionMin}분 : {sessionSec}초</span>
        }
      </div>

      {popup && (
          // <PopupAlert
          //     className="popup_review_warning popup_unable_pay"
          //     msg={"자동 로그아웃까지 " + sessionSec > 0 ? sessionSec : 0  + "초 남았습니다 \n\n 연장 하시겠습니까?"}
          //     caseMsg=""
          //     btnMsg="연장"
          //     btnMsg2="닫기"
          //     handlePopup={(btnType) => closePopup(btnType)}
          // />
          <SessionTimeoutPopup
              timerSec={sessionSec}
              handlePopup={(btnType) => closePopup(btnType)}
          />
      )}
    </div>
  )
}

export default memo(Header)
