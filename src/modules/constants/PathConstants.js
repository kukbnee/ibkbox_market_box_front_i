const PathConstants = {
  // depth 1
  MAIN: '/main',
  EVENT: '/event', // 이벤트
  EVENT_APPLY: '/event/apply', // 이벤트 신청
  FAQ: '/faq', // FAQ
  MY_PAGE: '/mypage', // 마이페이지
  BUYER_LETTER: '/buyerletter', //바이어레터
  SELLER_STORE: '/sellerstore', // 상품 > 판매자상점
  PAYMENT: '/payment', //결제
  LOGIN: '/login', //로그인
  LOGOUT: '/logout', //로그아웃

  // depth 2
  MAIN_SEARCH_RESULT: '/main/searchresult', // 메인 > 검색 결과
  MAIN_POPULAR_RESULT: '/main/popularResult', // 메인 > 인기상품 > 더보기
  MAIN_BUNDLE_RESULT: '/main/bundleResult', // 메인 > 묶음상품 > 더보기
  MAIN_CELEB_RESULT: '/main/celebResult', // 메인 > 셀럽초이스 > 더보기
  PRODUCT: '/product', // 상품 > 상품리스트
  PRODUCT_DETAIL: '/product/detail', // 상품 > 상품상세
  PRODUCT_BIND_DETAIL: '/product/bindetail', // 상품 > 묶음상품리스트
  EVENT_DETAIL: '/event/detail', // 이벤트 > 이벤트뷰
  MY_PAGE_MYINFO: '/mypage/myInfo', // 마이페이지 > 내정보
  MY_PAGE_PRODUCT: '/mypage/product', // 마이페이지 > 상품관리
  MY_PAGE_ORDERMANAGEMENT: '/mypage/ordermanagement', //마이페이지 > 구매/판매(주소 사용 안함)
  MY_PAGE_WISH: '/mypage/wish', // 마이페이지 > 위시리스트
  MY_PAGE_EVENT: '/mypage/event', // 마이페이지 > 이벤트관리
  MY_PAGE_ESTIMATION: '/mypage/estimation', //마이페이지 > 견적관리(주소 사용 안함)
  MY_PAGE_AGENCY: '/mypage/agency', // 마이페이지 > 에이전시
  MY_PAGE_QNA_USER: '/mypage/qnauser', //마이페이지 > 문의/답변(주소 사용 안함)
  MY_PAGE_QNA_ADMIN: '/mypage/qnaadmin', //마이페이지 > 문의/답변(주소 사용 안함)
  MY_PAGE_ALARM: '/mypage/alarm', //마이페이지 > 알람
  PAYMENT_RESULT: '/payment/result', //결제하기 > 결제상세
  PAYMENT_NOT_RESULT: '/payment/not/result', //결제하기 > 결제상세 > 결제취소 안내 화면

  // depth 3
  MY_PAGE_PRODUCT_EACH_WRITE: '/mypage/product/eachwrite', // 마이페이지 > 상품관리 > 개별상품 등록
  MY_PAGE_PRODUCT_BIND_WRITE: '/mypage/product/bindwrite', // 마이페이지 > 상품관리 > 묶음상품 등록
  MY_PAGE_PRODUCT_BIND_VIEW: '/mypage/product/bindview', // 마이페이지 > 상품관리 > 묶음상품 상세
  MY_PAGE_PRODUCT_BUYER_WRITE: '/mypage/product/buyerwrite', // 마이페이지 > 상품관리 > 바이어상품 등록
  MY_PAGE_ORDERMANAGEMENT_LIST: '/mypage/ordermanagement/list', // 마이페이지 > 구매/판매 > 목록
  MY_PAGE_ORDERMANAGEMENT_BUY_REVIEW: '/mypage/ordermanagement/review', // 마이페이지 > 구매/판매> 리뷰작성
  MY_PAGE_ORDERMANAGEMENT_ORDER_DETAIL: '/mypage/ordermanagement/order', // 마이페이지 > 구매/판매> 주문상세
  MY_PAGE_ORDERMANAGEMENT_RETURN: '/mypage/ordermanagement/return', // 마이페이지 > 구매/판매 > 반품(주소 사용 안함)
  MY_PAGE_EVENT_CURRENT_STATE: '/mypage/event/currentstate', // 마이페이지 > 이벤트 > 이벤트 신청 현황
  MY_PAGE_ESTIMATION_LIST: '/mypage/estimation/list', //마이페이지 > 견적관리 > 목록
  MY_PAGE_QNA_USER_LIST: '/mypage/qnauser/list', //마이페이지 > 문의/답변 > 목록
  MY_PAGE_QNA_USER_VIEW: '/mypage/qnauser/view', //마이페이지 > 문의/답변 > 문의하기
  MY_PAGE_QNA_ADMIN_LIST: '/mypage/qnaadmin/list', //마이페이지 > 관리자 문의 > 목록
  MY_PAGE_QNA_ADMIN_DETAIL: '/mypage/qnaadmin/detail', //마이페이지 > 관리자문의 > 상세
  MY_PAGE_QNA_ADMIN_REGISTER: '/mypage/qnaadmin/register', //마이페이지 > 관리자문의 > 등록하기
  MY_PAGE_CART: '/mypage/myInfo/Cart', // 마이페이지 > 장바구니

  // depth 4
  MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL: '/mypage/ordermanagement/return/detail', // 마이페이지 > 구매/판매> 반품 > 상세
  MY_PAGE_ORDERMANAGEMENT_RETURN_REQUEST: '/mypage/ordermanagement/return/request', // 마이페이지 > 구매/판매> 반품 > 요청
}
export default PathConstants
