import React, { lazy, Suspense } from 'react'
import Loading from 'components/Loading'
import { Redirect, Route, Switch } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'

const Event = lazy(() => import('pages/event').then(Event))
const EventDetail = lazy(() => import('pages/event/detail').then(EventDetail))
const EventApply = lazy(() => import('pages/event/apply').then(EventApply))

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

const EventRouter = (props) => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path={PathConstants.EVENT} component={() => <Event {...props} />} />
        <Route exact path={`${PathConstants.EVENT_DETAIL}/:id`} component={() => <EventDetail {...props} />} />
        <LoginCheckRouter exact path={`${PathConstants.EVENT_APPLY}/:id`} component={() => <EventApply {...props} />} />
        <Redirect path={'/'} to={PathConstants.MAIN} />
      </Switch>
    </Suspense>
  )
}

export default EventRouter
