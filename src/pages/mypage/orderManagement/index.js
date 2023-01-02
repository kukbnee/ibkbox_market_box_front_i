import { useState, useCallback, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'
import BuySell from 'components/mypage/orderManagement/BuySell'
import Return from 'components/mypage/orderManagement/Return'

const OrderManagement = (props) => {

  const history = useHistory()
  const { tabType } = useParams()
  const [tab, setTab] = useState({
    active: 'buySell',
    list: [
      { id: 'buySell', label: '구매/판매' },
      { id: 'return', label: '반품 요청' }
    ]
  })
  const tabList = {
    buySell: <BuySell />,
    return: <Return />
  }

  const handleTab = useCallback((id) => {
    history.push({ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_LIST}/${id}`})
  }, [])

  useEffect(() => {
    if(tabType) setTab({ ...tab, active: tabType })
  }, [])

  return (
    <>
      <div className="mypage buy_sell buy_list_wrap sell_list_wrap return buy_sell_return">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="trade_tab_wrap">
            <ul className="trade_tab_inner">
              {tab?.list?.map((element, idx) => (
                <li
                  className={`trade_tab ${tab.active === element.id ? 'active' : ''}`}
                  key={element.id}
                  onClick={() => handleTab(element.id)}
                >
                  {element.label}
                </li>
              ))}
            </ul>
          </div>
          {tabList?.[tab.active]}
        </div>
      </div>
    </>
  )
}

export default OrderManagement
