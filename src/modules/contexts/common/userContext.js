import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'

//Context API 생성 초기화
const UserContext = React.createContext({
  state: { userInfo: {} },
  actions: {
    getUserInfo: () => {},
    logout: () => {},
    actAddCartCount: () => {},
    actDelCartCount: () => {}
  }
})
const { Provider } = UserContext

const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    isLogin: false, //로그인 여부
    // userMenu: [], //사용자 메뉴목록
    // userType: false, //시스템 관리자 여부 체크
    // userData: {}, //회원기본 정보
    alarmCnt: "N", //알람 갯수
    basketCnt: 0 //장바구니 담은 갯수 
  })

  const getUserInfo = useCallback(async () => {
    return await Axios({
      url: API.HEADER.USER_INFO,
      method: 'get'
    }).then((response) => {
      if (response?.status === 200 && response?.data?.data.userId != null) {
          setUserInfo({
            ...response.data.data,
            isLogin: true, //로그인 여부
          })
        /*console.log("사용자 정보 가져오기 성공 및 업데이트!");*/
        return response.data.data;
      } else {
        /*console.log("사용자 정보 가져오기 실패!");*/
        return false;
      }
    })
  }, [])

  const logout = useCallback(async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('type')
    setUserInfo({
      isLogin: false, //로그인 여부
      // userMenu: [], //사용자 메뉴목록
      // userType: false, //시스템 관리자 여부 체크
      // userData: {}, //회원기본 정보
      alarmCnt: 0, //알람 갯수
      basketCnt: 0 //장바구니 담은 갯수 
    })
    window.location.href = process.env.REACT_APP_URL
  }, [])

  const actAddCartCount = () => {
    getUserInfo()
  }

  const actDelCartCount = (cnt) => {
    setUserInfo({ ...userInfo, basketCnt: userInfo.basketCnt - cnt })
  }

  const value = {
    state: { userInfo },
    actions: { getUserInfo, logout, setUserInfo, actAddCartCount, actDelCartCount }
  }

  useEffect(async() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      const getUserResponse = await getUserInfo();
      if(!getUserResponse){
        logout();
      }
    }
  }, []);

  return <Provider value={value}>{children}</Provider>
}

export { UserContext, UserProvider }
