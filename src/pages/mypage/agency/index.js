import { useState, useEffect, useCallback } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import moment from 'moment'
import BreadCrumbs from 'components/BreadCrumbs'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import Pagination from 'components/atomic/Pagination'
import Approval from 'pages/mypage/agency/Approval'
import OnProcess from 'pages/mypage/agency/OnProcess'
import Deprive from 'pages/mypage/agency/Deprive'
import AgencyList from 'pages/mypage/agency/AgencyList'
import NoResult from 'components/NoResult'

const Agency = (props) => {

  const [alertTooltip, setAlertTooltip] = useState(true)
  const [agnecyListData, setAgencyListData] = useState({ list: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [isPopup, setIsPopup] = useState({
    active: false,
    msg: '',
    btnMsg: '확인'
  })
  const [tabList, setTabList] = useState([
    { id: 'sen', name: '보낸요청', cnt: 0 },
    { id: 'rec', name: '받은요청', cnt: 0 }
  ])
  const [agenSttsList, setAgenSttsList] = useState({
    active: 'NONE_APPLY',
    applyData: {},
    list: [
      { id: 'NONE_APPLY', name: '미신청' },
      { id: 'COC01001', name: '요청' },
      { id: 'COC01003', name: '승인' },
      { id: 'COC01004', name: '반려' },
      { id: 'COC01006', name: '승인취소' }
    ]
  })
  const [paramsList, setParamsList] = useState({
    agenSearchType: 'sen',
    agenSearchFilter: '',
    page: 1,
    record: 10
  })
  const screenList = {
    NONE_APPLY: (
      <Approval
        onRequestApply={useCallback(() => {
          postAgencyApply()
        })}
      />
    ),
    COC01001: (
      <OnProcess
        applyData={agenSttsList.applyData}
        onRequestCancel={useCallback(() => {
          postAgencyApplyCancel()
        })}
      />
    ),
    COC01003: (
      <AgencyList
        paramsList={paramsList}
        agnecyList={agnecyListData?.list}
        listTotal={agnecyListData?.total}
        tabData={tabList?.filter((isTab) => isTab?.id === paramsList?.agenSearchType)?.[0]} //탭에 보이는 리스트 수
        setListRefresh={useCallback(() => {
          getAgencyList()
        })}
      />
    ),
    COC01004: <Deprive applyData={agenSttsList.applyData} agencyId={'COC01004'} />,
    COC01006: <Deprive applyData={agenSttsList.applyData} agencyId={'COC01006'} />
  }
  const filterSelectList = [
    { value: '', label: '전체' },
    { value: 'COC01001', label: '대기' },
    { value: 'COC01003', label: '승인' },
    { value: 'COC01004', label: '반려' },
    { value: 'COC01005', label: '취소' },
    { value: 'COC01006', label: '승인취소' }
  ]

  const handlePagination = (page) => {
    setParamsList({ ...paramsList, page: page })
  }

  const handlePopup = () => {
    setIsPopup({ ...isPopup, active: false })
  }

  const handleAlertTooltip = () => {
    setAlertTooltip(!alertTooltip)
  }

  const handleTab = (id) => {
    setParamsList({ ...paramsList, agenSearchType: id, agenSearchFilter: '', page: 1 })
  }

  const handleFilter = (e) => {
    setParamsList({ ...paramsList, agenSearchFilter: e.target.value, page: 1 })
  }

  const getStateTotal = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_STATE_TOTAL,
      method: 'get'
    }).then((response) => {
      if (response?.data?.code === '200') {
        setTabList([
          { id: 'sen', name: '보낸요청', cnt: response.data.data.senAgenTotal },
          { id: 'rec', name: '받은요청', cnt: response.data.data.recAgenTotal }
        ])
      }
    })
  }, [])

  const getAgencyApplyState = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_APPLY_DETAIL,
      method: 'get'
    }).then((response) => {
      if (response?.data?.code === '200' && response?.data?.data != null) {
        setAgenSttsList({
          ...agenSttsList,
          active: response.data.data.pcsnsttsId,
          applyData: response.data.data
        })
      }
    })
  }, [agenSttsList])

  const getAgencyList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_LIST,
      method: 'get',
      params: paramsList
    }).then((response) => {
      if (response?.data?.code === '200') {
        setAgencyListData(response.data.data)
      } else {
        setAgencyListData({ list: [] })
      }
      setIsLoading(false)
    })
  }, [paramsList])

  const postAgencyApply = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_APPLY,
      method: 'post'
    }).then((response) => {
      if (response?.data?.code === '200') {
        setIsPopup({
          ...isPopup,
          active: true,
          msg: `승인요청이 완료되었습니다.\n관리자 승인까지 최대 7일 소요됩니다.`
        })
        getAgencyApplyState()
      } else if (response?.data?.code != '200' && response?.data?.data) {
        setIsPopup({
          ...isPopup,
          active: true,
          msg: response.data.data
        })
      } else {
        setIsPopup({
          ...isPopup,
          active: true,
          msg: '처리 중 오류가 발생했습니다.\n관리자에게 문의 해주세요.'
        })
      }
    })
  }, [])

  const postAgencyApplyCancel = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_APPLY_CANCEL,
      method: 'post',
      params: { agenReqId: agenSttsList.applyData.agenReqId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setAgenSttsList({
          ...agenSttsList,
          active: 'NONE_APPLY',
          applyData: {}
        })
      }
    })
  }, [agenSttsList])

  useEffect(() => {
    setIsLoading(true)
    getStateTotal()
    getAgencyApplyState()
    getAgencyList()
  }, [paramsList])

  return (
    <>
      {isPopup?.active && (
        <PopupAlert
          handlePopup={handlePopup}
          className={'popup_review_warning'}
          msg={isPopup?.msg}
          btnMsg={isPopup?.btnMsg}
        />
      )}

      <div className="mypage product agency">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <h2 className="page_title">에이전시</h2>
          </div>
        </div>

        {/* 에이전시 승인일 */}
        {alertTooltip && agenSttsList?.active === 'COC01003' && (
          <div className="alert_tooltip_wrap">
            <div className="alert_tooltip">
              <p className="text">
                에이젼시 승인 완료 ({moment(agenSttsList?.applyData?.reqDate).format('YYYY-MM-DD')})
              </p>
              <Button className="btn close" onClick={handleAlertTooltip}>
                <span className="hide">닫기</span>
              </Button>
            </div>
          </div>
        )}

        <div className="product_container each_list_container">
          {/* 보낸요청, 받은 요청 탭 */}
          <div className="tab_header mo_tab_header">
            <ul className="tab_header_list">
              {tabList?.map((tab, idx) => (
                <li
                  className={`tab_header_item ${paramsList?.agenSearchType === tab.id ? 'active' : ''}`}
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                >
                  <span className="label">{tab.name}</span>
                  <Badge className={paramsList?.agenSearchType === tab.id ? 'badge full_blue' : 'badge full_grey'}>
                    {tab.cnt}
                  </Badge>
                </li>
              ))}
            </ul>

            {/* 리스트 필터 */}
            {paramsList.agenSearchType === 'sen' && agenSttsList?.active != 'COC01003' ? (
              <></>
            ) : (
              <div className="select_wrap">
                <select
                  className="select"
                  onChange={handleFilter}
                  value={paramsList?.agenSearchFilter}
                  title={`option`}
                >
                  {filterSelectList?.map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 리스트 화면 */}
          {isLoading ? (
            <NoResult msg={'데이터를 불러오는 중입니다.'} />
          ) : paramsList.agenSearchType === 'rec' ? (
            screenList?.['COC01003']
          ) : (
            screenList?.[agenSttsList?.active]
          )}

          {agnecyListData?.totalPage > 0 && (
            <div className="pagination_wrap">
              <Pagination
                page={agnecyListData?.page}
                totalPages={agnecyListData?.totalPage}
                handlePagination={(page) => handlePagination(page)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Agency
