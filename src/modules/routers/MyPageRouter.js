import { lazy, Suspense } from 'react'
import Loading from 'components/Loading'
import { Route, Switch, Redirect } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'

const Cart = lazy(() => import('pages/mypage/Cart').then(Cart))
const WishList = lazy(() => import('pages/mypage/wish').then(WishList)) // 위시리스트
// agency
const Agency = lazy(() => import('pages/mypage/agency').then(Agency)) // 승인 현황, 리스트
// myInfo
const MyInfo = lazy(() => import('pages/mypage/myInfo').then(MyInfo)) // 내정보
// product
const Product = lazy(() => import('pages/mypage/product').then(Product)) // 개별상품 목록
const EachWrite = lazy(() => import('pages/mypage/product/eachWrite').then(EachWrite)) // 개별상품 수정
const BindWrite = lazy(() => import('pages/mypage/product/bindWrite').then(BindWrite)) // 묶음상품 수정
const BuyerWrite = lazy(() => import('pages/mypage/product/buyerWrite').then(BuyerWrite)) // 바이어상품 목록
const OrderManagementList = lazy(() => import('pages/mypage/orderManagement').then(OrderManagementList)) // 구매/판매 목록
const OrderManagementReview = lazy(() => import('pages/mypage/orderManagement/review').then(OrderManagementReview)) // 구매/판매 > 리뷰작성
const OrderManagementOrderDetail = lazy(() => import('pages/mypage/orderManagement/OrderDetail').then(OrderManagementOrderDetail)) // 구매/판매 > 주문상세
const OrderManagementReturnDetail = lazy(() => import('pages/mypage/orderManagement/ReturnDetail').then(OrderManagementReturnDetail)) // 구매/판매 > 반품상세
const OrderManagementReturnRequest = lazy(() => import('pages/mypage/orderManagement/ReturnRequest').then(OrderManagementReturnRequest)) // 구매/판매 > 반품상세
//event
const Event = lazy(() => import('pages/mypage/event').then(Event)) // 이벤트 목록
const EventCurrentState = lazy(() => import('pages/mypage/event/currentState').then(EventCurrentState)) // 이벤트 신청현황
//qna
const QnaAdminList = lazy(() => import('pages/mypage/qnaAdmin').then(QnaAdminList)) // 관리자 문의,관리자문의 리스트
const QnaAdminDetail = lazy(() => import('pages/mypage/qnaAdmin/Detail').then(QnaAdminDetail)) // 관리자문의 상세
const QnaAdminRegister = lazy(() => import('pages/mypage/qnaAdmin/Register').then(QnaAdminRegister)) // 관리자문의 등록하기
const QnaUserList = lazy(() => import('pages/mypage/qnaUser').then(QnaUserList)) // 문의
const QnaUserView = lazy(() => import('pages/mypage/qnaUser/View').then(QnaUserView)) // 문의하기 첫화면
//estimation
const EstimationList = lazy(() => import('pages/mypage/estimation').then(EstimationList)) // 견적관리
//alarm : 작업예정
const AlarmList = lazy(() => import('pages/mypage/alarm').then(AlarmList)) // 알람 리스트

const LoginCheckRouter = ({ component: Component, ...rest }) => {
  if(localStorage.getItem('token') && localStorage.getItem('type') != 'SRS00004'){
    return (
      <Route {...rest} render={(props) => <Component {...props} />} />
    )
  }else{
    return (
      <Redirect path={'/'} to={PathConstants.MAIN} />
    )
  }
}

const MyPageRouter = (props) => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_CART} component={() => <Cart {...props} />} />
        {/*agency*/}
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_AGENCY} component={() => <Agency {...props} />} />
        {/*myInfo*/}
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_MYINFO} component={() => <MyInfo {...props} />} />
        {/*product*/}
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_PRODUCT} component={() => <Product {...props} />} />
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_PRODUCT_EACH_WRITE} component={() => <EachWrite {...props} />} />
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_PRODUCT_EACH_WRITE}/:id?`} component={() => <EachWrite {...props} />}/>
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_PRODUCT_BIND_WRITE} component={() => <BindWrite {...props} />} />
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_PRODUCT_BIND_WRITE}/:id?`} component={() => <BindWrite {...props} />}/>
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_PRODUCT_BUYER_WRITE} component={() => <BuyerWrite {...props} />} />
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_PRODUCT_BUYER_WRITE}/:id?`} component={() => <BuyerWrite {...props} />}/>
        {/*orderManagement*/}
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/:tabType?`} component={() => <OrderManagementList {...props} />} />
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_ORDERMANAGEMENT_BUY_REVIEW}/:id?`} component={() => <OrderManagementReview {...props} />}/>
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_ORDERMANAGEMENT_ORDER_DETAIL}/:id&:type`} component={() => <OrderManagementOrderDetail {...props} />}/>
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL}/:id&:infoSqn&:type`} component={() => <OrderManagementReturnDetail {...props} />}/>
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_REQUEST}/:id`} component={() => <OrderManagementReturnRequest {...props} />}/>
        {/*event*/}
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_EVENT} component={() => <Event {...props} />} />
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_EVENT_CURRENT_STATE}/:id`} component={() => <EventCurrentState {...props} />}/>
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_WISH} component={() => <WishList {...props} />} />
        {/* oneonone */}
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_QNA_ADMIN_LIST} component={() => <QnaAdminList {...props} />} />
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_QNA_ADMIN_DETAIL} component={() => <QnaAdminDetail {...props} />} />
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_QNA_ADMIN_REGISTER} component={() => <QnaAdminRegister {...props} />}/>
        {/* inquiry */}
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_QNA_USER_LIST} component={() => <QnaUserList {...props} />} />
        <LoginCheckRouter exact path={`${PathConstants.MY_PAGE_QNA_USER_VIEW}/:id`} component={() => <QnaUserView {...props} />} />
        {/* estimation */}
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_ESTIMATION_LIST} component={() => <EstimationList {...props} />} />
        {/* alarm */}
        <LoginCheckRouter exact path={PathConstants.MY_PAGE_ALARM} component={() => <AlarmList {...props} />} />
        <Redirect path={'/'} to={PathConstants.MAIN} />
      </Switch>
    </Suspense>
  )
}
export default MyPageRouter
