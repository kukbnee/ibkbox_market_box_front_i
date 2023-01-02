import React, {forwardRef, useCallback, useContext, useEffect, useState} from 'react'
import Button from 'components/atomic/Button'
import Badge from 'components/atomic/Badge'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import { UserContext } from 'modules/contexts/common/userContext'

// 활성화 nav_menu + active
const NavMenu = (props, ref) => {
  const { handleNavMenu } = props
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [search, setSearch] = useState('')

  const userMenuList = [
    {
      url: PathConstants.MY_PAGE_MYINFO,
      name: '내정보',
      class: 'myinfo'
    },
    {
      url: PathConstants.MY_PAGE_PRODUCT,
      name: '상품관리',
      class: 'product'
    },
    {
      url: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/buySell`,
      name: '구매/판매',
      class: 'buysell'
    },
    {
      url: PathConstants.MY_PAGE_WISH,
      name: '위시리스트',
      class: 'wishlist'
    },
    {
      url: PathConstants.MY_PAGE_EVENT,
      name: '이벤트관리',
      class: 'event'
    },
    {
      url: PathConstants.MY_PAGE_ESTIMATION_LIST,
      name: '견적관리',
      class: 'estimate'
    },
    {
      url: PathConstants.MY_PAGE_AGENCY,
      name: '에이전시',
      class: 'agency'
    },
    {
      url: PathConstants.MY_PAGE_QNA_USER_LIST,
      name: '문의/답변',
      class: 'inquiry'
    },
    {
      url: PathConstants.MY_PAGE_QNA_ADMIN_LIST,
      name: '관리자 문의',
      class: 'oneonone'
    },
    {
      url: PathConstants.MY_PAGE_ALARM,
      name: '알람',
      class: 'alarm'
    }
  ]

  const onNavMenu = () => {
    if (handleNavMenu) {
      handleNavMenu()
    }
  }

  const onChangeSearch = useCallback((e) => setSearch(e.target.value), [search])

  const moveSearchResult = useCallback(() => {
    onNavMenu()
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

  const handleLink = useCallback(
    (url) => {
      if (userContext.state.userInfo.isLogin) {
        history.push(url)
        onNavMenu()
      } else
        window.location.href = `/`
    },
    [userContext.state.userInfo]
  )

  const onClickLogout = () => {
    userContext.actions.logout()
  }

  // ===== 로그인
  const onClickLogin = () => {
    window.esgLogin();
  }


  useEffect(() => {
  }, [userContext.state.userInfo.isLogin])

  return (
    <div className="nav_menu mobile" ref={ref}>
      <div className="layer" onClick={onNavMenu}>
        &nbsp;
      </div>
      <div className="panel_wrap">
        <ul className={`user_menu_list ${userContext.state.userInfo.isLogin ? "status_login" : "status_logout"}`}>
          {/*user_menu_item + active*/}
          <li className="user_menu_item ">
            <div className="header_search_wrap">
              <input
                type="text"
                className="input"
                onChange={onChangeSearch}
                value={search ? search : ''}
                title={'검색'}
                onKeyPress={onPressEnter}
              />
              <Button className={'btn_search'} onClick={moveSearchResult}>
                <span className="hide">검색</span>
              </Button>
            </div>
          </li>
          {
            userContext.state.userInfo.isLogin &&
              <>
                <li className="user_menu_item user_menu_item_alarm">
                  <Badge className={'badge full_grey'}>
                    {/*{userContext?.state.userInfo.alarmCnt ? userContext.state.userInfo.alarmCnt : 0}*/}
                  </Badge>
                  <Button className={'btn_alarm active'} onClick={() => handleLink(PathConstants.MY_PAGE_ALARM)}>
                    <span className="hide">알람</span>
                  </Button>
                </li>
                <li className="user_menu_item">
                  <Badge className={'badge full_skyblue'}>
                    {userContext?.state.userInfo.basketCnt ? userContext.state.userInfo.basketCnt : 0}
                  </Badge>
                  <Button className={'btn_cart'} onClick={() => handleLink(PathConstants.MY_PAGE_CART)}>
                    <span className="hide">장바구니</span>
                  </Button>
                </li>
              </>
          }
        </ul>
        {
          userContext.state.userInfo.isLogin ?
              <div className="nav_menu_wrap scroll">
                {userMenuList.map((menu) => (
                    <p className="nav_menu_item" onClick={() => handleLink(menu.url)} key={menu.name}>
                      {menu.name}
                    </p>
                ))}
                <p className="nav_menu_item" onClick={onClickLogout} key={`logout`}>
                  로그아웃
                </p>
              </div> : 
              <div className={"nav_menu_wrap"}>
                <div className="nav_login_box">
                  <p className="text">로그인을 해주세요</p>
                  <Button className={"btn full_blue"} onClick={onClickLogin}>로그인</Button>
                </div>
              </div>
        }
      </div>
    </div>
  )
}

const NavMenuRef = forwardRef(NavMenu)
export default NavMenuRef
