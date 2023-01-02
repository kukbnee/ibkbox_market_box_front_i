import { useState, useEffect, useCallback } from 'react'
import moment from 'moment'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Badge from 'components/atomic/Badge'
import BuyList from 'components/mypage/orderManagement/BuySell/BuyList'
import SellList from 'components/mypage/orderManagement/BuySell/SellList'
import Pagination from 'components/atomic/Pagination'


const BuySell = () => {

  const [listData, setListData] = useState({ list: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [params, setParams] = useState({
    stDt: null,
    edDt: null,
    pdfNm: '',
    selrUsisNm: '',
    ordnSttsId: '',
    page: 1,
    record: 10
  })
  const [tab, setTab] = useState({
    active: 'buyList',
    list: [
      { id: 'buyList', name: '구매내역', cnt: 0 },
      { id: 'sellList', name: '판매내역', cnt: 0 }
    ]
  })
  const tabList = {
    buyList: <BuyList
      data={listData}
      params={params}
      isLoading={isLoading}
      setParams={setParams}
      handleListRefresh={() => handleListRefresh()}
    />,
    sellList: <SellList
      data={listData}
      params={params}
      isLoading={isLoading}
      setParams={setParams}
      handleListRefresh={() => handleListRefresh()}
    />
  }

  const handleTab = useCallback((id) => {
    if(tab?.active === id) return
    
    setListData([])
    setTab({ ...tab, active: id })
    setParams({
      ...params,
      stDt: null,
      edDt: null,
      pdfNm: '',
      selrUsisNm: '',
      ordnSttsId: '',
      page: 1
    })
  }, [tab, params, listData])

  const handleListRefresh = useCallback(() => {
    setListData([])
    if (params?.page > 1) { //페이지가 2 이상일 경우 페이지 변경하여 useEffect 사용
      setParams({ ...params, page: 1 })
    } else { //페이지가 1일경우 api 바로 호출
      switch (tab?.active) {
        case 'buyList':
          getOrderBuyList()
          break
        case 'sellList':
          getOrderSellList()
          break
      }
    }
  }, [tab, params, listData])

  const handlePagination = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])


  const getOrderBuySellListBadge = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ORDER_BUY_SELL_LIST_BADGE,
      method: 'get'
    }).then((response) => {
      response?.data?.code === '200' && (
        setTab({
          ...tab,
          list: [
            { id: 'buyList', name: '구매내역', cnt: response?.data?.data?.buyCnt },
            { id: 'sellList', name: '판매내역', cnt: response?.data?.data?.sellCnt }
          ]
        })
      )
    })
  }, [tab])

  const getOrderBuyList = useCallback(async () => {
    setIsLoading(true)
    await Axios({
      url: API.MYPAGE.MY_ORDER_BUY_LIST,
      method: 'get',
      params: {
        ...params,
        stDt: params.stDt != null ? moment(params.stDt).format('YYYY-MM-DD') : null,
        edDt: params.edDt != null ? moment(params.edDt).format('YYYY-MM-DD') : null,
      }
    }).then(async (response) => {
      if (response?.data?.code === '200') setListData({ ...response.data.data })
      setIsLoading(false)
    })
  }, [tab, params, listData])

  const getOrderSellList = useCallback(async () => {
    setIsLoading(true)
    await Axios({
      url: API.MYPAGE.MY_ORDER_SELL_LIST,
      method: 'get',
      params: params
    }).then(async (response) => {
      if (response?.data?.code === '200') setListData({ ...response.data.data })
      setIsLoading(false)
    })
  }, [tab, params, listData])

  useEffect(async () => {
    getOrderBuySellListBadge()
    switch (tab.active) {
      case 'buyList':
        getOrderBuyList()
        break
      case 'sellList':
        getOrderSellList()
        break
    }
  }, [
    tab.active,
    params.ordnSttsId, //판매내역에서 조회
    params.page,
  ])

  return (
    <>
      <div className="buy_sell_container mg_top_container">
        <div className="card_layout">
          <div className="tab_header">
            <ul className="tab_header_list">
              {tab?.list?.map((element) => (
                <li
                  className={`tab_header_item ${tab.active === element.id ? 'active' : ''}`}
                  key={element.id}
                  onClick={() => handleTab(element.id)}
                >
                  <span className="label">{element.name}</span>
                  <Badge className={tab.active === element.id ? 'badge full_blue' : 'badge full_grey'}>
                    {element.cnt}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
          {tabList[tab.active]}
          {listData?.totalPage > 0 && (
            <div className="pagination_cover">
              <Pagination
                page={listData?.page}
                totalPages={listData?.totalPage}
                handlePagination={(page) => handlePagination(page)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default BuySell
