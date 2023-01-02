import React, { lazy, Suspense, useLayoutEffect, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Loading from 'components/Loading'
import PathConstants from 'modules/constants/PathConstants'

//
const Main = lazy(() => import('pages/main').then(Main))
const MainSearchResult = lazy(() => import('pages/main/searchResult').then(Main))
const PopularResult = lazy(() => import('pages/main/popularResult').then(Main))
const BundleResult = lazy(() => import('pages/main/bundleResult').then(Main))
const CelebResult = lazy(() => import('pages/main/celebResult').then(Main))

const MainRouter = (props) => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={PathConstants.MAIN} component={() => <Main {...props} />} />
        <Route exact path={PathConstants.MAIN_SEARCH_RESULT} component={() => <MainSearchResult {...props} />} />
        <Route exact path={PathConstants.MAIN_POPULAR_RESULT} component={() => <PopularResult {...props} />} />
        <Route exact path={PathConstants.MAIN_BUNDLE_RESULT} component={() => <BundleResult {...props} />} />
        <Route exact path={PathConstants.MAIN_CELEB_RESULT} component={() => <CelebResult {...props} />} />
        <Redirect path={'/'} to={PathConstants.MAIN} />
      </Switch>
    </Suspense>
  )
}

export default MainRouter
