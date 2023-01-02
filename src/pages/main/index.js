import React, { useEffect, useCallback, useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'
import MainSlider from 'components/Slider/MainSlider'
import CardItem from 'components/product/CardItem'
import BundleItem from 'components/product/BundleItem'
import EventSlide from 'components/main/EventSlide'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import { createKey } from 'modules/utils/MathUtils'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { UserContext } from 'modules/contexts/common/userContext'
import PathConstants from 'modules/constants/PathConstants'
import AddPopup from 'components/mypage/cart/AddPopup'
import PopupAlert from 'components/PopupAlert'
import PopupCustom from 'components/PopupCustom'
import Button from 'components/atomic/Button'
import MainPopup from "components/MainPopup";
import moment from "moment";
import {createHeaderSeo} from "../../modules/utils/CustromSeo";

const Main = () => {

  const history = useHistory()
  const userContext = useContext(UserContext)
  SwiperCore.use([Navigation, Pagination, Autoplay])

  const [bannerList, setBannerList] = useState([])
  const [subBannerList, setSubBannerList] = useState([])
  const [eventList, setEventList] = useState([])
  const [popularList, setPopularList] = useState([])
  const [bundleList, setBundleList] = useState([])
  const [celebList, setCelebList] = useState([])
  const [popupCartPdf, setPopupCartPdf] = useState({})
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    type: 'ALERT',
    msg: '',
    btnMsg: '닫기'
  })
  // const [popupData, setPopupData] = useState([])
  const [popupList, setPopupList] = useState([])

  const handleCateLink = useCallback((obj) => {
    if (obj.useYn == 'N') {
      return
    }

    history.push({
      pathname: PathConstants.PRODUCT,
      state: { depth: obj.depth, ctgyCd: obj.ctgyCd, ctgyNm: obj.ctgyNm }
    })
  }, [])

  const handleOnCart = useCallback((pdfInfo) => { //장바구니 담기
    if (!userContext.state.userInfo.isLogin) { //로그인 안됬을 때
      setPopupAlert({ ...popupAlert, active: true, type: "LOGIN", msg: "" })
      return
    }

    if (userContext?.state?.userInfo?.mmbrtypeId === "SRS00004") { //개인회원일 때
      setPopupAlert({ ...popupAlert, active: true, type: "ALERT", msg: `해당 기능은 기업회원만 가능합니다.`, btnMsg: '닫기' })
      return
    }

    if (pdfInfo != undefined) {
      setPopupCartPdf(pdfInfo)
      setPopupAlert({ ...popupAlert, active: true, type: "CART", msg: "" })
    }
  }, [popupAlert, userContext])

  const popupAlertInit = useCallback(() => { //팝업 init
    setPopupAlert({ active: false, type: "ALERT", msg: "", btnMsg: "닫기" })
  }, [])

  const onClickLogin = () => { //로그인하기
    popupAlertInit()
    window.esgLogin()
  }

  const getBannerList = useCallback(async () => {
    await Axios({
      url: API.MAIN.BANNER_LIST,
      method: 'get'
    }).then((response) => {
      if(response?.data?.code === '200'){
        setBannerList(response.data.data.list)

        if(response.data.data.list.length == 0){
          createHeaderSeo([
            {
              name : "og:title",
              content : "커머스BOX"
            },
            {
              name : "og:description",
              content : "IBKBOX의 온라인 B2B 커머스 몰 입니다."
            },
            {
              name : "og:url",
              content : window.location.href
            },
            {
              name : "og:image",
              content : window.location.origin+"/ibklogo.png"
            },
            {
              name : "twitter:title",
              content : "커머스BOX"
            },
            {
              name : "twitter:description",
              content : "IBKBOX의 온라인 B2B 커머스 몰 입니다."
            },
            {
              name : "twitter:image",
              content : window.location.origin+"/ibklogo.png"
            }
          ]);
        }else{
          createHeaderSeo([
            {
              name : "og:title",
              content : response.data.data.list[0].ttl
            },
            {
              name : "og:description",
              content : response.data.data.list[0].con
            },
            {
              name : "og:url",
              content : window.location.href
            },
            {
              name : "og:image",
              // content : response.data.data.list[0].imgUrl
              content : window.location.origin+"/ibklogo.png"
            },
            {
              name : "twitter:title",
              content : response.data.data.list[0].ttl
            },
            {
              name : "twitter:description",
              content : response.data.data.list[0].con
            },
            {
              name : "twitter:image",
              // content : response.data.data.list[0].imgUrl
              content : window.location.origin+"/ibklogo.png"
            }
          ]);
        }
      }
    })
  }, [])

  const getSubBannerList = useCallback(async () => {
    await Axios({
      url: API.MAIN.SUB_BANNER_LIST,
      method: 'get'
    }).then((response) => {
      response?.data?.code === '200' && setSubBannerList(response.data.data.list)
    })
  }, [])

  const getEventList = useCallback(async () => {
    await Axios({
      url: API.MAIN.EVENT_LIST,
      method: 'get'
    }).then((response) => {
      response?.data?.code === '200' && setEventList(response.data.data.list)
    })
  }, [])

  const getPopularList = useCallback(async () => {
    await Axios({
      url: API.MAIN.POPULAR_LIST,
      method: 'get',
      params: {
        page: 1,
        record: 8
      }
    }).then((response) => {
      response?.data?.code === '200' && setPopularList(response.data.data.list)
    })
  }, [])

  const getBundleList = useCallback(async () => {
    await Axios({
      url: API.MAIN.BUNDLE_LIST,
      method: 'get',
      params: {
        mainPageFlg: "main",
        page: 1,
        record: 2 //운영자포털에서 최대 2개까지만 설정 가능함
      }
    }).then((response) => {
      response?.data?.code === '200' && setBundleList(response.data.data.list)
    })
  }, [])

  const getCelebList = useCallback(async () => {
    await Axios({
      url: API.MAIN.CELEB_LIST,
      method: 'get',
      params: {
        page: 1,
        record: 8
      }
    }).then((response) => {
      response?.data?.code === '200' && setCelebList(response.data.data.list)
    })
  }, [])

  const getPopupList = useCallback(async () => {
    await Axios({
      url: API.MAIN.POPUP_LIST,
      method: 'get',
    }).then((response) => {
      response?.data?.code === '200' && handleSetPopupList(response.data.data.list)
    })
  }, [])


  /* ===== main popup */

  // 오늘하루 안보기 제외후 목록 세팅
  const handleSetPopupList = (dataList) => {
    let list = dataList
    list.map((popup) => {
      if(localStorage.getItem(popup.popupInfId)) {
        const localDate = moment(localStorage.getItem(popup.popupInfId)).format('YYYYMMDD');
        const todayDate = moment(new Date()).format('YYYYMMDD');
        if(localDate <= todayDate) {
          // 보임
          localStorage.removeItem(popup.popupInfId)
        } else {
          // 안보임
          list = list.filter(li => li.popupInfId !== popup.popupInfId);
        }
      }
    })
    setPopupList(list)
  }
  // 팝업 닫기
  const handleMainPopup = (id) => {
    const tempList = popupList.filter((popup) => popup.popupInfId !== id);
    if(tempList.length <= 0) {
      setPopupList(null)
    } else {
      setPopupList(tempList)
    }
  }
  // 오늘하루 보지 않기
  const handleNoSeeMore = (e, id) => {
    if(e.target.checked) {
      let today = new Date();
      let expires = new Date(today.setDate(today.getDate() + 1));
      localStorage.setItem(id, expires)
    } else {
      localStorage.removeItem(id)
    }
  }

  const syncFu = useCallback(() => {
    getCelebList()
    getPopularList()
  }, [])

  useEffect(() => {
    getBannerList()
    getSubBannerList()
    getEventList()
    getPopularList()
    getBundleList()
    getCelebList()
    getPopupList()
  }, [])

  return (
    <>
      {/*메인 팝업 start */}
      { popupList?.length > 0 && <MainPopup data={popupList} handleMainPopup={handleMainPopup} handleNoSeeMore={handleNoSeeMore}/> }
      {/*메인 팝업 end */}
      {/* 로그인 팝업 */}
      {popupAlert?.active && popupAlert?.type === 'LOGIN' && (
        <PopupCustom className={'register_info_popup add_cart_popup'} handlePopup={popupAlertInit}>
          <div className="content">
            <div className="text">로그인이 필요합니다.</div>
          </div>
          <div className="btn_group">
            <Button className={'full_blue'} onClick={onClickLogin}>
              로그인하러 가기
            </Button>
          </div>
        </PopupCustom>
      )}
      {/* 장바구니 팝업 */}
      {popupAlert?.active && popupAlert?.type === 'CART' && (<AddPopup product={popupCartPdf} handlePopup={popupAlertInit} />)}
      {/* alert 팝업 */}
      {popupAlert?.active && popupAlert?.type === 'ALERT' && (<PopupAlert msg={popupAlert?.message} btnMsg={popupAlert?.btnMsg} handlePopup={popupAlertInit} />)}


      <div className="main">
        <div className="container default_size">
          {bannerList?.length > 0 && (
            <div className="main_gallery_wrap">
              <MainSlider data={bannerList} />
            </div>
          )}
          <div className="category_wrap">
            <div className="category_header">
              <p className="title">중소기업 제품카테고리</p>
              <p className="info">
                지금 바로 대한민국 최고의 중소기업의 제품정보를 빠르게 확인하고
                <br /> 다른 기업들과 네트워킹을 통해 원하는 가격을 협상해보세요.
              </p>
            </div>
            <div className="menu_blocks">
              <p
                className="name block block1"
                onClick={() => handleCateLink({ depth: 2, ctgyCd: '02', ctgyNm: '출산/육아', useYn: 'Y' })}
              >
                출산/육아
              </p>
              <p
                className="name block block2"
                onClick={() => handleCateLink({ depth: 4, ctgyCd: '080204', ctgyNm: ['도서/취미/펫', '악기/취미', '꽃배달'], useYn: 'Y' })}
              >
                꽃배달
              </p>
              <p
                className="name block block3"
                onClick={() => handleCateLink({ depth: 4, ctgyCd: '030101', ctgyNm: ['트렌드패션', '여성', '여성의류'], useYn: 'Y' })}
              >
                여성의류
              </p>
              <p
                className="name block block4"
                onClick={() => handleCateLink({ depth: 2, ctgyCd: '03', ctgyNm: '트렌드패션', useYn: 'Y' })}
              >
                트렌드패션
              </p>
              <p
                className="name block block5"
                onClick={() => handleCateLink({ depth: 4, ctgyCd: '080203', ctgyNm: ['도서/취미/펫', '악기/취미', '꽃/원예'], useYn: 'Y' })}
              >
                꽃/원예
              </p>
              <p
                className="name block block6"
                onClick={() => handleCateLink({ depth: 4, ctgyCd: '030201', ctgyNm: ['트렌드패션', '남성', '남성의류'], useYn: 'Y' })}
              >
                남성의류
              </p>
            </div>
            <div
              className="btn_group"
              onClick={() => handleCateLink({ depth: 1, ctgyCd: '01', ctgyNm: '전체', useYn: 'Y' })}
            >
              전체 카테고리
            </div>
          </div>
          {subBannerList.length > 0 && (
            <div className="banner_wrap">
              <Swiper pagination={{ clickable: true }} loop={true} className="mySwiper">
                {subBannerList?.map((banner, index) => (
                  <SwiperSlide key={`banner_${index}`}>
                    <Link to={{ pathname: banner.link }} target="_blank" className="img_wrap">
                      <img src={banner.imgUrl} alt="배너" />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {eventList.length > 0 && (
            <div className="event_wrap mo_card_wrap">
              <Swiper
                pagination={{ clickable: true }}
                className="mainEventSlider"
                autoplay={{ delay: '5000', disableOnInteraction: false }}
                style={{ overflow: 'flex' }}
              >
                {eventList?.map((event, index) => (
                  <SwiperSlide key={`event_${index}`}>
                    <EventSlide event={event} handleOnCart={(pdfInfo) => handleOnCart(pdfInfo)} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <div className="popular_wrap padding-left-right01">
            <div className="section_header flex-btw-end">
              <h3 className="title">인기상품</h3>
              <Link to={PathConstants.MAIN_POPULAR_RESULT} className="btn_more">
                더보기
              </Link>
            </div>
            <ul className="popular_list">
              {popularList.map((popularItem) => (
                <li className="popular_item" key={createKey()}>
                  <CardItem
                    data={popularItem}
                    buttonType="in"
                    syncInfo={{ type: 'popular', syncFu: syncFu }}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="combine_wrap padding-left-right01">
            <div className="section_header flex-btw-end">
              <h3 className="title">묶음상품</h3>
              <Link to={PathConstants.MAIN_BUNDLE_RESULT} className="btn_more">
                더보기
              </Link>
            </div>
            <div className="combine_list">
              {bundleList?.map((bundle) => (
                <div className="combine_item_wrap" key={createKey()}>
                  <BundleItem
                      data={bundle}
                      handleView={() => history.push('./product/detail')}
                      handleRefreshList={() => getBundleList()} />
                </div>
              ))}
            </div>
          </div>

          <div className="celeb_wrap padding-left-right01">
            <div className="section_header flex-btw-end">
              <h3 className="title">셀럽쵸이스</h3>
              <Link to={PathConstants.MAIN_CELEB_RESULT} className="btn_more">
                더보기
              </Link>
            </div>
            <ul className="celeb_list">
              {celebList.map((product) => (
                <li className="celeb_item" key={createKey()}>
                  <CardItem
                    data={product}
                    buttonType="in"
                    handleView={() => history.push('./product/detail')}
                    syncInfo={{ type: 'celeb', syncFu: syncFu }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

export default Main
