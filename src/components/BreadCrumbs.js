import React from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import LabelConstants from 'modules/constants/LabelConstants'

const BreadCrumbs = (props) => {

  const history = useHistory()

  // prettier-ignore
  const page1DepthItems = { //depth 1
    [PathConstants.MY_PAGE]: { link: null, label: LabelConstants.MY_PAGE }, //마이페이지
    [PathConstants.PRODUCT]: { link: PathConstants.PRODUCT, label: LabelConstants.PRODUCT }, //상품
    [PathConstants.SELLER_STORE]: { link: PathConstants.SELLER_STORE, label: LabelConstants.SELLER_STORE }, //판매자상점
    [PathConstants.PAYMENT]: { link: PathConstants.PAYMENT, label: LabelConstants.PAYMENT }, //결제하기
  }

  // prettier-ignore
  const page2DepthItems = { //depth 2
    [PathConstants.MY_PAGE_MYINFO]: { link: PathConstants.MY_PAGE_MYINFO, label: LabelConstants.MY_PAGE_MYINFO }, //마이페이지 > 내정보
    [PathConstants.MY_PAGE_PRODUCT]: { link: PathConstants.MY_PAGE_PRODUCT, label: LabelConstants.MY_PAGE_PRODUCT }, //마이페이지 > 상품관리
    [PathConstants.MY_PAGE_ORDERMANAGEMENT]: { link: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/buySell`, label: LabelConstants.MY_PAGE_ORDERMANAGEMENT }, //마이페이지 > 구매/판매(라벨만 사용)
    [PathConstants.MY_PAGE_WISH]: { link: PathConstants.MY_PAGE_WISH, label: LabelConstants.MY_PAGE_WISH }, //마이페이지 > 위시리스트
    [PathConstants.MY_PAGE_EVENT]: { link: PathConstants.MY_PAGE_EVENT, label: LabelConstants.MY_PAGE_EVENT }, //마이페이지 > 이벤트관리
    [PathConstants.MY_PAGE_ESTIMATION]: { link: PathConstants.MY_PAGE_ESTIMATION_LIST, label: LabelConstants.MY_PAGE_ESTIMATION }, //마이페이지 > 견적관리(라벨만 사용)
    [PathConstants.MY_PAGE_AGENCY]: { link: PathConstants.MY_PAGE_AGENCY, label: LabelConstants.MY_PAGE_AGENCY }, //마이페이지 > 에이전시
    [PathConstants.MY_PAGE_QNA_USER]: { link: PathConstants.MY_PAGE_QNA_USER_LIST, label: LabelConstants.MY_PAGE_QNA_USER }, //마이페이지 > 문의/답변(라벨만 사용)
    [PathConstants.MY_PAGE_QNA_ADMIN]: { link: PathConstants.MY_PAGE_QNA_ADMIN_LIST, label: LabelConstants.MY_PAGE_QNA_ADMIN }, //마이페이지 > 관리자문의(라벨만 사용)
    [PathConstants.MY_PAGE_ALARM]: { link: PathConstants.MY_PAGE_ALARM, label: LabelConstants.MY_PAGE_ALARM }, //마이페이지 > 알람
    [PathConstants.PAYMENT_RESULT]: { link: PathConstants.PAYMENT_RESULT, label: LabelConstants.PAYMENT_RESULT }, //결제하기 > 결제상세
  }

  // prettier-ignore
  const page3DepthItems = { //depth 3
    [PathConstants.MY_PAGE_PRODUCT_EACH_WRITE]: { link: PathConstants.MY_PAGE_PRODUCT_EACH_WRITE, label: LabelConstants.MY_PAGE_PRODUCT_EACH_WRITE }, //마이페이지 > 상품관리 > 개별상품 등록
    [PathConstants.MY_PAGE_PRODUCT_BIND_WRITE]: { link: PathConstants.MY_PAGE_PRODUCT_BIND_WRITE, label: LabelConstants.MY_PAGE_PRODUCT_BIND_WRITE }, //마이페이지 > 상품관리 > 묶음상품 등록
    [PathConstants.MY_PAGE_PRODUCT_BUYER_WRITE]: { link: PathConstants.MY_PAGE_PRODUCT_BUYER_WRITE, label: LabelConstants.MY_PAGE_PRODUCT_BUYER_WRITE }, //마이페이지 > 상품관리 > 상품관리 > 바이어상품 등록
    [PathConstants.MY_PAGE_PRODUCT_BIND_VIEW]: { link: PathConstants.MY_PAGE_PRODUCT_BIND_VIEW, label: LabelConstants.MY_PAGE_PRODUCT_BIND_VIEW }, //마이페이지 > 상품관리 > 묶음상품 상세
    [PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST]: { link: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/buySell`, label: LabelConstants.MY_PAGE_ORDERMANAGEMENT_LIST }, //마이페이지 > 구매/판매 > 목록
    [PathConstants.MY_PAGE_ORDERMANAGEMENT_BUY_REVIEW]: { link: null, label: LabelConstants.MY_PAGE_ORDERMANAGEMENT_BUY_REVIEW }, //마이페이지 > 구매/판매> 리뷰작성
    [PathConstants.MY_PAGE_ORDERMANAGEMENT_ORDER_DETAIL]: { link: null, label: LabelConstants.MY_PAGE_ORDERMANAGEMENT_ORDER_DETAIL }, //마이페이지 > 구매/판매> 주문상세
    [PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN]: { link: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/return`, label: LabelConstants.MY_PAGE_ORDERMANAGEMENT_RETURN }, //마이페이지 > 구매/판매> 반품(라벨만 사용)
    [PathConstants.MY_PAGE_EVENT_CURRENT_STATE]: { link: null, label: LabelConstants.MY_PAGE_EVENT_CURRENT_STATE }, //마이페이지 > 이벤트 > 이벤트 신청현황
    [PathConstants.MY_PAGE_ESTIMATION_LIST]: { link: PathConstants.MY_PAGE_ESTIMATION_LIST, label: LabelConstants.MY_PAGE_ESTIMATION_LIST }, //마이페이지 > 견적관리 > 목록
    [PathConstants.MY_PAGE_QNA_USER_LIST]: { link: PathConstants.MY_PAGE_QNA_USER_LIST, label: LabelConstants.MY_PAGE_QNA_USER_LIST }, //마이페이지 > 문의/답변 > 목록
    [PathConstants.MY_PAGE_QNA_USER_VIEW]: { link: null, label: LabelConstants.MY_PAGE_QNA_USER_VIEW }, //마이페이지 > 문의/답변 > 문의하기
    [PathConstants.MY_PAGE_QNA_ADMIN_LIST]: { link: PathConstants.MY_PAGE_QNA_ADMIN_LIST, label: LabelConstants.MY_PAGE_QNA_ADMIN_LIST }, //마이페이지 > 관리자문의 > 목록
    [PathConstants.MY_PAGE_QNA_ADMIN_DETAIL]: { link: PathConstants.MY_PAGE_QNA_ADMIN_DETAIL, label: LabelConstants.MY_PAGE_QNA_ADMIN_DETAIL }, //마이페이지 > 관리자문의 > 상세
    [PathConstants.MY_PAGE_QNA_ADMIN_REGISTER]: { link: null, label: LabelConstants.MY_PAGE_QNA_ADMIN_REGISTER }, //마이페이지 > 관리자문의 > 문의하기
  }

  const page4DepthItems = { //depth 4
    [PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL]: { link: null, label: LabelConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL }, //마이페이지 > 구매/판매> 반품 > 반품상세
    [PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_REQUEST]: { link: null, label: LabelConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_REQUEST }, //마이페이지 > 구매/판매> 반품 > 반품요청
  }

  const getBreadCrumbListFromObject = (pagePath, ...augments) => {
    try {
      // '/1depth/2depth/3depth/4depth' -> ['/1depth', '/2depth', '/3depth', '/4depth]
      const currentPagePaths = pagePath.match(/(\/[a-zA-Z0-9]+)/g)

      // ['/1depth', '/2depth', '/3depth', '/4depth'] -> ['/1depth', '/1depth/2depth', '/1depth/2depth/3depth', '/1depth/2depth/3depth/4depth']
      const menus = currentPagePaths.map((menu, idx) => currentPagePaths.slice(0, idx + 1).join(''))

      // [page1DepthItems, page2DepthItems, page3DepthItems, page4DepthItems]-> [{link: '1link', label: 1label}, {link: '2link', label: 2label}, ...]
      return augments.filter((item, idx) => item[menus[idx]]).map((item, idx) => item[menus[idx]])
    } catch (e) {
      console.error(e)
    }
  }
  const breadCrumbList = getBreadCrumbListFromObject(
    props.location?.pathname,
    page1DepthItems,
    page2DepthItems,
    page3DepthItems,
    page4DepthItems
  )

  const handleLinkMypages = (menu) => {
    if(menu?.link === null ) return //link 불가
    history.push(menu.link)
  }

  return (
    <div className="bread_crumbs01 padding-left-right01">
      <ul className="menu_list">
        <li className="menu_item">
          <button className="home" onClick={() => history.push(PathConstants.MAIN)}>
            <span className="hide">홈</span>
          </button>
        </li>
        {breadCrumbList?.map(
          (menu, index) =>
            menu?.label !== '홈' && (
              <li className="menu_item" key={`breadCrumb_${index}`}>
                <button className="menu" onClick={() => handleLinkMypages(menu)}>
                  {menu?.label}
                </button>
              </li>
            )
        )}
      </ul>
    </div>
  )
}

export default BreadCrumbs
