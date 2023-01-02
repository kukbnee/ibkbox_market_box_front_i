import {useCallback, useRef, useEffect, useContext} from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import { UserContext } from 'modules/contexts/common/userContext'

const UserMenu = (props) => {
  const { userMenu, setUserMenu, onClickLogout } = props
  const userContext = useContext(UserContext)
  const history = useHistory()
  const menuRef = useRef()
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
    },
  ]

  const handleLink = useCallback((url) => {
    history.push(url)
    setUserMenu(false)
  }, [])

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (userMenu && menuRef.current && !menuRef.current.contains(e.target) && e.target.className !== 'menu_popup') {
        setUserMenu(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [userMenu])

  return (
    <div className={`header_user_menu_wrap ${userMenu && `active`}`} ref={menuRef}>
      {/*header_user_menu_wrap + active 활성화*/}
      <div className={'header_user_menu_inner'}>
        <ul className="header_user_menu_list">
          {userMenuList.map((menu, idx) => (
              /* 개인회원은 메뉴를 표시하지 않음*/
              userContext?.state?.userInfo?.mmbrtypeId != 'SRS00004' ? (
                <li
                  key={'header_user_menu_item' + idx}
                  className={`header_user_menu_item ${menu.class}`}
                  onClick={() => handleLink(menu.url)}
                >
                  <span className="user_menu_label">{menu.name}</span>
                </li>
              ) : (<></>)
          ))}
          <li
              key={'header_user_menu_item_logout'}
              className={`header_user_menu_item logout`}
              onClick={onClickLogout}
          >
            <span className="user_menu_label">로그아웃</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserMenu
