import React, { lazy, Suspense, useLayoutEffect, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Loading from 'components/Loading'
import PathConstants from 'modules/constants/PathConstants'

//
const Payment = lazy(() => import('pages/payment').then(Payment))
const PayResult = lazy(() => import('pages/payment/PayResult').then(PayResult))
const PayNotResult = lazy(() => import('pages/payment/PayNotResult').then(PayNotResult))

const PaymentRouter = (props) => {
    return (
        <Suspense fallback={<Loading />}>
            <Switch>
                <Route exact path={PathConstants.PAYMENT} component={() => <Payment {...props} />} />
                <Route exact path={PathConstants.PAYMENT_NOT_RESULT} component={() => <PayNotResult {...props} />} />
                <Route exact path={`${PathConstants.PAYMENT_RESULT}/:id`} component={() => <PayResult {...props} />} />
            </Switch>
        </Suspense>
    )
}

export default PaymentRouter
