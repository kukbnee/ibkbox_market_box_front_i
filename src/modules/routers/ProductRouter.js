import React, { lazy, Suspense, useLayoutEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'

const Product = lazy(() => import('pages/product').then(Product))
const EachDetail = lazy(() => import('pages/product/eachDetail').then(EachDetail))
const BindDetail = lazy(() => import('pages/product/bindDetail').then(BindDetail))

const ProductRouter = (props) => {
  return (
    <Suspense>
      <Switch>
        <Route exact path={PathConstants.PRODUCT} component={() => <Product {...props} />} />
        <Route exact path={`${PathConstants.PRODUCT_DETAIL}/:id`} component={() => <EachDetail {...props} />} />
        <Route exact path={`${PathConstants.PRODUCT_BIND_DETAIL}/:id`} component={() => <BindDetail {...props} />} />
        <Redirect path={'/'} to={PathConstants.MAIN} />
      </Switch>
    </Suspense>
  )
}

export default ProductRouter
