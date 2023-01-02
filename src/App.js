import React, { useLayoutEffect } from 'react'
import Routing from 'Routing'
import { UserProvider } from 'modules/contexts/common/userContext'
import { isIE } from 'react-device-detect'
import Loading from 'components/Loading'

//Provider list
const CommonProvider = ({ contexts, children }) =>
  contexts.reduce(
    (prev, context) =>
      React.createElement(context, {
        children: prev
      }),
    children
  )

const App = () => {
  return (
    <>
      {isIE ? (
        <div>
          <h1>지원하지 않는 브라우저입니다.</h1>
        </div>
      ) : (
        <CommonProvider contexts={[UserProvider]}>
          <Loading />
          <Routing />
        </CommonProvider>
      )}
    </>
  )
}

export default App
