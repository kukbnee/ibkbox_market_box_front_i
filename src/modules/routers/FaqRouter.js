import React, { lazy, Suspense, useLayoutEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import Loading from 'components/Loading'

const Faq = lazy(() => import('pages/faq').then(Faq))

const FaqRouter = (props) => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route path={PathConstants.FAQ} component={(props) => <Faq {...props} />} />
        <Redirect path={'/'} to={PathConstants.MAIN} />
      </Switch>
    </Suspense>
  )
}
export default FaqRouter
