import { useState, useCallback, } from 'react'
import Select from 'components/event/apply/Select'
import Confirm from 'components/event/apply/Confirm'
import Complete from 'components/event/apply/Complete'
import 'assets/style/event.css'

const Apply = () => {
  const [tab, setTab] = useState('SELECT')
  const [productList, setProductList] = useState([])

  const onClickTab = useCallback((value) => setTab(value), [])

  const tabList = {
    SELECT: <Select productList={productList} setProductList={setProductList} onClickTab={onClickTab} />,
    CONFIRM: <Confirm productList={productList} onClickTab={onClickTab} />,
    COMPLETE: <Complete productList={productList} />
  }

  return (
    <div className="event_apply select confirm complete">
      <div className="container default_size">
        <div className="event_apply_wrap">
          <p className="title">이벤트 신청</p>
          {tab !== 'COMPLETE' && (
            <div className="progress_tab_wrap">
              <div className={`tab ${tab === `SELECT` && `now`}`}>
                1&#46; 신청상품 선택
              </div>
              <div className={`tab ${tab === `CONFIRM` && `now`}`}>
                2&#46; 최종확인 및 신청
              </div>
            </div>
          )}
          {tabList[tab]}
        </div>
      </div>
    </div>
  )
}

export default Apply
