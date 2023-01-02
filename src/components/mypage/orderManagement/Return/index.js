import { useState, useCallback, useEffect } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Badge from 'components/atomic/Badge'
import ReturnListItem from 'components/mypage/orderManagement/Return/ReturnListItem'
import NoResult from 'components/NoResult'
import Pagination from 'components/atomic/Pagination'

const Return = (props) => {

  const [returnData, setReturnData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [tabList, setTabList] = useState({
    active: 'selr',
    list: [
      { id: 'selr', name: '받은요청', cnt: 0 },
      { id: 'buyer', name: '보낸요청', cnt: 0 }
    ]
  })
  const [filter, setFilter] = useState({
    active: '',
    list: [
      { id: '', label: '전체' },
      { id: 'ODS00005', label: '반품요청' },
      { id: 'ODS00006', label: '반품불가' },
      { id: 'ODS00007', label: '반품완료' }
    ]
  })
  const [params, setParams] = useState({
    returnType: 'selr',
    ordnSttsId: '',
    page: 1,
    record: 10
  })

  const handlePagination = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])

  const handleTab = useCallback((id) => {
    setTabList({ ...tabList, active: id })
    setParams({ ...params, returnType: id, page: 1 })
    setFilter({ ...filter, active: '' })
  }, [tabList, params, filter])

  const handleStatusList = useCallback((e) => {
    setFilter({ ...filter, active: e.target.value })
    setParams({ ...params, ordnSttsId: e.target.value, page: 1 })
  }, [filter, params])

  const getReturnList = useCallback(async () => {
    setIsLoading(true)
    await Axios({
      url: API.MYPAGE.MY_ORDER_RETURN_LIST,
      method: 'get',
      params: params
    }).then((response) => {
      if (response?.data?.code === '200') {
        setReturnData(response.data.data)
        setTabList({
          ...tabList,
          list: [
            { id: 'selr', name: '받은요청', cnt: response.data.data.recTotal },
            { id: 'buyer', name: '보낸요청', cnt: response.data.data.senTotal }
          ]
        })
      }
      setIsLoading(false)
    })
  }, [params, tabList])

  useEffect(() => {
    getReturnList()
  }, [params])

  return (
    <>
      <div className="return_container mg_top_container mt_0">
        <div className="card_layout">
          <div className="tab_header mo_tab_header">
            <ul className="tab_header_list">
              {tabList?.list.map((tab, idx) => (
                <li
                  className={`tab_header_item ${tabList.active === tab.id ? 'active' : ''}`}
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                >
                  <span className="label">{tab.name}</span>
                  <Badge className={tabList?.active === tab.id ? 'badge full_blue' : 'badge full_grey'}>
                    {tab.cnt}
                  </Badge>
                </li>
              ))}
            </ul>
            <div className="select_inner">
              <select className={'select'} onChange={handleStatusList} value={filter?.active} title={'filterType'}>
                {filter?.list?.map((code, idx) => (
                  <option key={code.id + idx} value={code.id}>
                    {code.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="table_list_wrap">
            <div className="table_header">
              <div className="cell number">주문번호</div>
              <div className="cell info">상품정보</div>
              <div className="cell price">총 주문금액</div>
              <div className="cell name">{tabList?.active === 'buyer' ? '판매자명' : '구매자명'}</div>
              <div className="cell state">상태</div>
            </div>
            <ul className="table_list">
              {returnData?.lists?.list?.length > 0 ? (
                returnData.lists.list.map((item, idx) => (
                  <li className="table_list_item" key={'table_list_item' + idx}>
                    <ReturnListItem data={item} isTab={tabList.active} />
                  </li>
                ))
              ) : (
                <li className="table_list_item no_result_wrap">
                  <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '반품내역이 없습니다.'} />
                </li>
              )}
            </ul>
            {returnData?.lists?.totalPage > 0 && (
              <div className="pagination_wrap">
                <Pagination
                  page={returnData?.lists?.page}
                  totalPages={returnData?.lists?.totalPage}
                  handlePagination={(page) => handlePagination(page)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Return
