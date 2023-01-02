import React, { lazy, Suspense, useLayoutEffect } from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
const SellerStore = lazy(() => import('pages/sellerStore'))

const SellerStoreRouter = (props) => {
  return (
    <Suspense>
      <Switch>
        <Route exact path={`${PathConstants.SELLER_STORE}/:id`} component={() => <SellerStore {...props} />} />
        <Redirect path={'/'} to={PathConstants.MAIN} />
      </Switch>
    </Suspense>
  )
}

export default SellerStoreRouter
