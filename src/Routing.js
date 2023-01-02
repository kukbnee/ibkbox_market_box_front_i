import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Loading from 'components/Loading'
import PathConstants from 'modules/constants/PathConstants'
import CommonLayout from 'layouts/CommonLayout'
import ScrollToTop from 'modules/utils/ScrollToTop'

//라우터목록
const MainRouter = lazy(() => import('modules/routers/MainRouter').then(MainRouter))
const EventRouter = lazy(() => import('modules/routers/EventRouter').then(EventRouter))
const ProductRouter = lazy(() => import('modules/routers/ProductRouter').then(ProductRouter))
const FaqRouter = lazy(() => import('modules/routers/FaqRouter').then(FaqRouter))
const SellerStoreRouter = lazy(() => import('modules/routers/SellerStoreRouter').then(SellerStoreRouter))
const MyPageRouter = lazy(() => import('modules/routers/MyPageRouter').then(MyPageRouter))
const PaymentRouter = lazy(() => import('modules/routers/PaymentRouter').then(PaymentRouter))
const ErrorPage = lazy(() => import('pages/error/errorPage').then(ErrorPage))
const BuyerLetter = lazy(() => import('pages/product/buyerLatter').then(BuyerLetter))

const EsgRouting = (path) => {
  return location.href = `//${window.location.host}/esgLogin.html${path.location.search}&apiurl=${process.env.REACT_APP_API_URL}`;
}

const Routing = (props) => {

  //실행 타입 log 출력
  console.log(process.env.REACT_APP_RENDER_TYPE, " / ", process.env.REACT_APP_RENDER_VER);

  return (
    <BrowserRouter>
      <CommonLayout {...props}>
        <Suspense fallback={<Loading />}>
          <ScrollToTop>
            <Switch>
              <Route path={PathConstants.MAIN} component={(props) => <MainRouter {...props} />} />
              <Route path={PathConstants.EVENT} component={(props) => <EventRouter {...props} />} />
              <Route path={PathConstants.PRODUCT} component={(props) => <ProductRouter {...props} />} />
              <Route path={PathConstants.FAQ} component={(props) => <FaqRouter {...props} />} />
              <Route path={PathConstants.SELLER_STORE} component={(props) => <SellerStoreRouter {...props} />} />
              <Route path={`${PathConstants.MY_PAGE}*`} component={(props) => <MyPageRouter {...props} />} />
              <Route path={`${PathConstants.BUYER_LETTER}/:id`} component={(props) => <BuyerLetter {...props} />} />
              <Route path={PathConstants.PAYMENT} component={(props) => <PaymentRouter {...props} />} />
              <EsgRouting path={`/common/login`} />
              <Redirect path={'/'} to={PathConstants.MAIN} />
              <Route path={'*'} component={ErrorPage} />
            </Switch>
          </ScrollToTop>
        </Suspense>
      </CommonLayout>
    </BrowserRouter>
  )
}

export default Routing
