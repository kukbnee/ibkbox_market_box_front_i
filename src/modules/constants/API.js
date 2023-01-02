
const base = '/api'
const API = {
  EVENT: {
    EVENT_LIST: `${base}/event/list`,
    EVENT_DETAIL: `${base}/event/detail`,
    QUALIFICATION: `${base}/event/check/partici`,
    COUNTING: `${base}/event/state/total`,
    PRODUCT: `${base}/event/product`,
    SELR_SAVE: `${base}/event/selr/save`,
    SELR_CANCEL: `${base}/event/selr/cancel`,
    BANNER_LIST: `${base}/event/banner/list`
  },
  MAIN: {
    PRODUCT_BUNDLE_LIST: `${base}/main/product/bundle/list`,
    PRODUCT_BUNDLE_DETAIL: `${base}/main/product/bundle/detail`,
    BANNER_LIST: `${base}/main/banner/main/list`,
    SUB_BANNER_LIST: `${base}/main/banner/list`,
    EVENT_LIST: `${base}/main/event/list`,
    POPULAR_LIST: `${base}/main/single/popular/list`,
    WISH_SAVE: `${base}/main/wish/save`,
    WISH_DELETE: `${base}/main/wish/delete`,
    BUNDLE_LIST: `${base}/main/bundle/list`,
    CELEB_LIST: `${base}/main/celeb/list`,
    BASKET_SAVE: `${base}/main/basket/save`,
    POPUP_LIST: `${base}/main/popup/list`,
  },
  PRODUCT: {
    BANNER_LIST: `${base}/product/banner/list`,
    PRODUCT_CATEGORY_LIST: `${base}/product/category/depth/list`,
    PRODUCT_LIST: `${base}/product/list`,

    MY_PRODUCT_CATEGORY_LIST: `${base}/product/seller/category/parents/list`,
    PRODUCT_DETAIL_QNA_SAVE: `${base}/product/detail/qna/save`,
    APPLY_AGENCY: `${base}/product/detail/agency/request`,
    SINGLE_DETAIL: `${base}/product/detail`,
    SELLER_INFO: `${base}/product/detail/seller/header`,
    REVIEW_HEADER_INFO: `${base}/product/detail/review/header`,
    REVIEW_IMAGE_LIST: `${base}/product/detail/review/img/list`,
    REVIEW_LIST: `${base}/product/detail/review/list`,
    REVIEW_WRITE: `${base}/product/detail/review/save`,
    REVIEW_UPDATE: `${base}/product/detail/review/update`,
    REVIEW_DELETE: `${base}/product/detail/review/delete`,
    DETAIL_CLICK: `${base}/product/detail/seller/click`,

    BUNDLE_DETAIL: `${base}/product/detail/bundle`,
    BUNDLE_DETAIL_PRODUCT_LIST: `${base}/product/detail/bundle/product/list`,

    SELLER_STORE_DETAIL: `${base}/product/seller/store/header`,
    SELLER_CATEGORY_LIST: `${base}/product/seller/category/list`,
    SELLER_BANNER_LIST: `${base}/product/seller/banner/list`,
    SELLER_SINGLE_LIST: `${base}/product/seller/single/list`,
    SELLER_BUNDLE_LIST: `${base}/product/seller/bundle/list`,
    SELLER_STORE_HEADER: `${base}/product/seller/product/header`
  },
  HEADER: {
    PRODUCT_SINGLE_LIST: `${base}/header/single/list`,
    USER_INFO: `${base}/header/info`,
    ALARM_LIST: `${base}/header/alarm/list`,
    ALARM_READ: `${base}/header/alarm/check`
  },
  FAQ: {
    FAQ_LIST: `${base}/faq/list`
  },
  MYPAGE: {
    MY_INFO: `${base}/my/info`,
    MY_INFO_DESIGN_SAVE: `${base}/my/info/design/save`,
    MY_INFO_BANNER_SAVE: `${base}/my/info/banner/save`,
    MY_WISH_LIST: `${base}/my/wish/list`,
    MY_BASKET_LIST: `${base}/my/basket/list`,
    MY_BASKET_DELETE: `${base}/my/basket/delete`,
    MY_EVENT_LIST: `${base}/my/event/list`,
    MY_EVENT_STATE_DETAIL: `${base}/my/event/detail`,
    MY_EVENT_STATE_PRODUCT_LIST: `${base}/my/event/product`,
    MY_PRODUCT_HEADER: `${base}/my/product/header`,
    MY_SINGLE_PRODUCT_LIST: `${base}/my/product/single/list`,
    MY_SINGLE_PRODUCT_SAVE: `${base}/my/product/single/save`,
    MY_SINGLE_PRODUCT_DETAIL: `${base}/my/product/single/detail`,
    MY_SINGLE_PRODUCT_DELETE: `${base}/my/product/single/delete`,
    MY_BUNDLE_PRODUCT_LIST: `${base}/my/product/bundle/list`,
    MY_BUNDLE_PRODUCT_SAVE: `${base}/my/product/bundle/save`,
    MY_BUNDLE_SEARCH_PROUDCT_LIST: `${base}/my/product/bundle/save/list`,
    MY_BUNDLE_PRODUCT_DETAIL: `${base}/my/product/bundle/detail`,
    MY_BUNDLE_PRODUCT_DELETE: `${base}/my/product/bundle/delete`,
    MY_BUYER_PRODUCT_LIST: `${base}/my/product/buyer/list`,
    MY_BUYER_PRODUCT_SAVE: `${base}/my/product/buyer/save`,
    MY_BUYER_PRODUCT_DETAIL: `${base}/my/product/buyer/detail`,
    MY_BUYER_PRODUCT_DELETE: `${base}/my/product/buyer/delete`,
    MY_BUYER_PRODUCT_DELIVERY_LIST: `${base}/my/product/single/delivery/list`,
    MY_PATENT_LIST: `${base}/my/product/single/save/patent`,
    MY_PRODUCT_CATEGORY_LIST: `${base}/my/product/category/depth/list`,
    MY_SELLER_INFO: `${base}/my/product/seller`,
    MY_AGENCY_APPLY_DETAIL: `${base}/my/agency/apply/detail`,
    MY_AGENCY_APPLY: `${base}/my/agency/apply`,
    MY_AGENCY_APPLY_CANCEL: `${base}/my/agency/apply/cancel`,
    MY_AGENCY_STATE_TOTAL: `${base}/my/agency/state/total`,
    MY_AGENCY_LIST: `${base}/my/agency/list`,
    MY_AGENCY_CANCEL: `${base}/my/agency/cancel`,
    MY_AGENCY_REJECT: `${base}/my/agency/reject`,
    MY_AGENCY_REASON: `${base}/my/agency/reason`,
    MY_AGENCY_APPROVAL: `${base}/my/agency/approval`,
    MY_AGENCY_APPROVAL_CANCEL: `${base}/my/agency/approval/cancel`,
    MY_AGENCY_APPROVAL_RECOVERY: `${base}/my/agency/approval/recovery`,
    MY_QNA_LIST: `${base}/my/qna/list`,
    MY_QNA_LIST_CNT: `${base}/my/qna/list/cnt`,
    MY_QNA_DETAIL: `${base}/my/qna/detail`,
    MY_QNA_DETAIL_LIST: `${base}/my/qna/detail/list`,
    MY_QNA_SAVE: `${base}/my/qna/save`,
    MY_QNA_ADMIN_LIST: `${base}/my/qna/admin/list`,
    MY_QNA_ADMIN_DETAIL: `${base}/my/qna/admin/detail`,
    MY_QNA_ADMIN_SAVE: `${base}/my/qna/admin/save`,
    MY_QNA_ADMIN_DELETE: `${base}/my/qna/admin/delete`,
    MY_ESTIMATION_PRODUCT_ADD: `${base}/my/estimation/product/add`,
    MY_ESTIMATION_DELIVERY_LIST: `${base}/my/estimation/delivery/list`,
    MY_ESTIMATION_SAVE: `${base}/my/estimation/save`,
    MY_ESTIMATION_DETAIL: `${base}/my/estimation/detail`,
    MY_ESTIMATION_LIST: `${base}/my/estimation/list`,
    MY_ESTIMATION_LIST_CNT: `${base}/my/estimation/list/cnt`,
    MY_ESTIMATION_CANCEL: `${base}/my/estimation/cancel`,
    MY_ORDER_BUY_SELL_LIST_BADGE: `${base}/my/sales/header`,
    MY_ORDER_BUY_LIST: `${base}/my/sales/buy/list`,
    MY_ORDER_SELL_LIST: `${base}/my/sales/sell/list`,
    MY_ORDER_RETURN_REQUEST: `${base}/order/return/request`,
    MY_ORDER_RECEIPT_CHECK: `${base}/order/receipt/check`,
    MY_ORDER_RETURN_LIST: `${base}/order/return/list`,
    MY_ORDER_RETURN_DETAIL: `${base}/order/return/detail`,
    MY_SELLER_RETURN_INFO: `${base}/my/product/seller/rtin`,
    MY_ORDER_DVRY_INVOICE_UPDATE: `${base}/order/delivery/info/update`,
    MY_ORDER_DVRY_CARGO_LIST: `${base}/order/delivery/info/list`,
    MY_ORDER_DVRY_CARGO_REQUEST: `${base}/order/delivery/request`,
    MY_SEAL_SAVE: `${base}/my/info/seal/save`,
    MY_SEAL_DELETE: `${base}/my/info/seal/delete`,
    MY_ALARM_LIST: `${base}/my/info/alarm/list`,
    MY_ALARM_READ: `${base}/my/info/alarm/check`,
    MY_SELLER_SAVE: `${base}/my/info/seller/save`,
  },
  ORDER: {
    PAY_ESTIMATION: `${base}/order/pay/esm`,
    PAY_PRODUCT: `${base}/order/pay/product`,
    PAY_PRODUCT_ORDER: `${base}/order/pay/product/order`,
    PAY_ESTIMATION_ORDER: `${base}/order/pay/esm/order`,
    PAY_PRODUCT_ORDER_DETAIL: `${base}/order/detail`,
    PAY_PRODUCT_FREIGHT_INFO: `${base}/order/delivery/amt`,
    MY_ORDER_RETURN_STATE_COMPLETE: `${base}/order/return/completion`,
    MY_ORDER_RETURN_STATE_REJECT: `${base}/order/return/impossible`,
    MY_ORDER_CANCEL: `${base}/order/cancel`, //주문취소 승인(판매자)
    MY_ORDER_PAY_CANCEL: `${base}/order/pay/cancel`, //주문취소 완료(구매자)
    MY_ORDER_PRODUCT_DVRY_REQUEST: `${base}/order/dvry/request`, //주문 운송의뢰 요청
    MY_ORDER_PRODUCT_DVRY_CANCEL: `${base}/order/dvry/cancel` //주문 운송의뢰 취소
  },
  BOXPOS_PAY:{
    PAY_UTLAPCINFO : `${base}/pay/utlaplcinfo`, //판매자 가맹점 여부 체크
    PAY_LNKSTLMRGSN : `${base}/pay/lnkStlmRgsn`, //제휴사 연계결제 등록
    PAY_LNKSTLMPGRSINQ : `${base}/pay/lnkStlmPgrsInq`, //연계결제 여부
    PAY_PCRMTESTLMINQ : `${base}/pay/pcRmteStlmInq`, //PC원격결제 조회
    PAY_PCRMTESTLMCNCLRQSTPUSH : `${base}/pay/pcRmteStlmCnclRqstPush`, //PC원격결제 취소요청 푸시발송(판매자에게 취소요청을 보냄)
    PAY_LNKSTLMCNCL : `${base}/pay/lnkStlmCncl`, //결제 취소(구매자)
  },
  FILE: {
    UPLOAD: `${base}/file/upload`,
    DOWNLOAD: `${base}/file/download/` //{fileId}
  },
  LOGIN: {
    LOGOUT: `${base}/login/logout`,
    JWT_CHECK: `${base}/login/jwt/check`
  },
  AxiosInterceptors : [], //axios 비동기 목록
  TIMEROBJ : null, //api 시간제한을 체크하기 위한 변수
  TIMERCNT : 0, //1초씩증가
  LIMITCNT : 300000, //TIMERCNT가 도달하는 최대값으로 300=5분(300)초
  refreshCheck : true
}

export default API
