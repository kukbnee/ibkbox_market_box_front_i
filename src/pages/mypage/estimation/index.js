import { useState, useEffect, useCallback } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import BreadCrumbs from 'components/BreadCrumbs'
import Pagination from 'components/atomic/Pagination'
import Badge from 'components/atomic/Badge'
import PopupAlert from 'components/PopupAlert'
import EstimationListItem from 'components/mypage/estimation/EstimationListItem'
import EstimationSheet from 'pages/mypage/estimation/EstimationSheet'
import NoResult from 'components/NoResult'

const EstimationList = (props) => {

  const [estmList, setEstmList] = useState({})
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '', btnMsg: '확인' })
  const [estmSheet, setEstmSheet] = useState({ active: false, data: null })
  const [isLoading, setIsLoading] = useState(false)
  const [tabList, setTabList] = useState([
    { id: 'rec', name: '받은요청', cnt: 0 },
    { id: 'sen', name: '보낸요청', cnt: 0 }
  ])
  const [filterList, setFilterList] = useState({
    active: '',
    list: [
      { value: '', label: '전체' },
      { value: 'ESS02001', label: '대기' },
      { value: 'ESS02002', label: '결제완료' },
      { value: 'ESS02003', label: '취소' }
    ]
  })
  const [paramsList, setParamsList] = useState({
    estimationSearchType: 'rec',
    pcsnSttsId: '',
    page: 1,
    record: 10
  })
  const [paramsEstm, setParamsEstm] = useState({ esttInfoId: null, paramType: null })

  const handleTab = (id) => {
    setFilterList({ ...filterList, active: '' })
    setParamsList({ ...paramsList, estimationSearchType: id, pcsnSttsId: '', page: 1 })
  }

  const handleFilter = (e) => {
    setFilterList({ ...filterList, active: e.target.value })
    setParamsList({ ...paramsList, pcsnSttsId: e.target.value, page: 1 })
  }

  const handlePagination = (page) => {
    setParamsList({ ...paramsList, page: page })
  }

  const handlePopup = () => {
    setPopupAlert({ ...popupAlert, active: !popupAlert.active })
  }

  const handleSheet = useCallback((type) => {
    setEstmSheet({ active: !estmSheet.active, data: null })
    setParamsEstm({ esttInfoId: null, paramType: null })
    if (type === 'refresh') getEstimationList() //리스트 새로고침
  }, [estmSheet])


  const getEstimationListCnt = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_LIST_CNT,
      method: 'get',
      params: { estimationSearchType: paramsList?.estimationSearchType }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setTabList([
          { id: 'rec', name: '받은요청', cnt: response.data.data.rcvrSumCnt },
          { id: 'sen', name: '보낸요청', cnt: response.data.data.dpmpSumCnt }
        ])
      }
    })
  }, [paramsList])

  const getEstimationList = useCallback(async () => {
    setIsLoading(true)
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_LIST,
      method: 'get',
      params: paramsList
    }).then((response) => {
      if (response?.data?.code === '200') setEstmList(response.data.data)
      setIsLoading(false)
    })
  }, [paramsList])

  const getEstimationDetail = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_DETAIL,
      method: 'get',
      params: paramsEstm
    }).then((response) => {
      if (response?.data?.code === '200') setEstmSheet({ active: !estmSheet.active, data: response.data.data })
    })
  }, [paramsEstm])

  const postEstimationCancel = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_CANCEL,
      method: 'post',
      data: paramsEstm
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({ ...popupAlert, active: true, msg: '견적이 취소되었습니다.' })
        getEstimationList()
      }
    })
  }, [paramsEstm])


  useEffect(() => {
    getEstimationListCnt()
    getEstimationList()
  }, [paramsList])

  useEffect(() => {
    if (paramsEstm?.esttInfoId != null && paramsEstm?.paramType === 'detail') getEstimationDetail()
    if (paramsEstm?.esttInfoId != null && paramsEstm?.paramType === 'cancel') postEstimationCancel()
  }, [paramsEstm])


  return (
    <>
      {/* 견적서 상세보기 */}
      {estmSheet?.active && <EstimationSheet data={estmSheet?.data} handlePopup={(type) => handleSheet(type)} />}
      {popupAlert?.active && ( //alert 팝업
        <PopupAlert
          className={'popup_review_warning'}
          msg={popupAlert?.msg}
          btnMsg={popupAlert?.btnMsg}
          handlePopup={handlePopup}
        />
      )}

      <div className="mypage product agency">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <h2 className="page_title">견적관리</h2>
          </div>
          <div className="product_container each_list_container">
            <div className="tab_header estimate_header">
              <ul className="tab_header_list">
                {tabList?.map((tab, idx) => (
                  <li
                    className={`tab_header_item ${paramsList?.estimationSearchType === tab.id ? 'active' : ''}`}
                    key={tab.id}
                    onClick={() => handleTab(tab.id)}
                  >
                    <span className="label">{tab.name}</span>
                    <Badge className={paramsList.estimationSearchType === tab.id ? 'badge full_blue' : 'badge full_grey'}>
                      {tab.cnt}
                    </Badge>
                  </li>
                ))}
              </ul>
              <div className="select_wrap mo_none">
                <select className="select" onChange={handleFilter} value={filterList?.active} title={'filter'}>
                  {filterList?.list?.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {tabList?.filter((isTab) => isTab?.id === paramsList?.estimationSearchType)?.[0]?.cnt > 0 ? ( //견적 리스트 데이터가 있는지 체크
              <div className="table_list_wrap each_list_wrap">
                <div className="table_header each_header req_each_item">
                  <div className="cell cell_num">NO</div>
                  <div className="cell cell_info">상품정보</div>
                  <div className="cell cell_target">요청대상</div>
                  <div className="cell cell_day">요청일시</div>
                  <div className="cell cell_state">상태</div>
                  <div className="mo_select">
                    <div className="select_wrap">
                      <select className="select" onChange={handleFilter} value={filterList?.active} title={'filter'}>
                        {filterList?.list?.map((option) => (
                          <option value={option.value} key={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 견적 리스트 */}
                <ul className="table_list each_list">
                  {estmList?.list?.length > 0 ? (
                    estmList.list.map((item, index) => (
                      <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                        <EstimationListItem
                          data={item}
                          index={index}
                          params={estmList}
                          totalEstm={estmList.total}
                          paramsEstm={paramsEstm}
                          listType={paramsList?.estimationSearchType}
                          setParamsEstm={setParamsEstm}
                        />
                      </li>
                    ))
                  ) : (
                    <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '견적 내역이 없습니다.'} />
                  )}
                </ul>
              </div>
            ) : ( //견적 리스트가 아예 없을 때
              <div className="not_approval">
                <p className="text">
                  {paramsList?.estimationSearchType == 'sen' && ('보낸 요청이 없습니다.')}
                  {paramsList?.estimationSearchType == 'rec' && ('받은 요청이 없습니다.')}
                </p>
              </div>
            )}

            {estmList?.totalPage > 0 && (
              <div className="pagination_wrap">
                <Pagination
                  page={estmList?.page}
                  totalPages={estmList?.totalPage}
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

export default EstimationList
