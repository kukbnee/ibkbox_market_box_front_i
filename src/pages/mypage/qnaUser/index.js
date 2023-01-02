import { useState, useEffect, useCallback } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Badge from 'components/atomic/Badge'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import QnaUserListItem from 'components/mypage/qnaUser/QnaUserListItem'
import NoResult from 'components/NoResult'
import Pagination from 'components/atomic/Pagination'

const QnaUserList = (props) => {

  const [qnaListData, setQnaListData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [tabList, setTabList] = useState({
    list: [
      { id: 'sen', label: '보낸 문의', cnt: 0 },
      { id: 'rec', label: '받은 문의', cnt: 0 }
    ]
  })
  const [searchTypeList, setSearchTypeList] = useState({
    active: 'pdfNm',
    list: [
      { id: 'pdfNm', value: '상품명' },
      { id: 'comCon', value: '문의대상' }
    ]
  })
  const [params, setParams] = useState({
    qnaSearchType: 'sen',
    page: 1,
    pdfNm: '',
    comCon: '',
    record: 10
  })

  const handleTab = useCallback((id) => { //받은문의, 보낸문의 탭
    setParams({
      ...params,
      qnaSearchType: id,
      page: 1,
      dfNm: '',
      comCon: ''
    })
    setSearchTypeList({ ...searchTypeList, active: 'pdfNm' })
  }, [params, searchTypeList])

  const handleSearchTypeList = useCallback((e) => { //검색 타입 - 상품명, 회사명
    setSearchTypeList({ ...searchTypeList, active: e.target.value })
    setParams({ ...params, pdfNm: '', comCon: '' })
  }, [params, searchTypeList])

  const onChangeSearchText = useCallback((e) => { //검색어 입력
    setParams({
      ...params,
      [searchTypeList?.active]: e.target.value
    })
  }, [params, searchTypeList])

  const handleSearch = useCallback(() => { //검색 실행
    getQnaList('SEARCH')
  }, [params, searchTypeList])

  const onPressEnter = useCallback((e) => {
    if (e.key === 'Enter') handleSearch('SEARCH')
  }, [params, searchTypeList])

  const handlePagination = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])


  const getQnaList = useCallback(async (isSearch) => {
    setIsLoading(true)
    await Axios({
      url: API.MYPAGE.MY_QNA_LIST,
      method: 'get',
      params: { ...params, page: isSearch != undefined ? 1 : params?.page }
    }).then((response) => {
      response?.data?.code === '200' && setQnaListData(response.data.data)
      setIsLoading(false)
    })
  }, [params])

  const getQnaListCnt = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_QNA_LIST_CNT,
      method: 'get'
    }).then((response) => {
      if (response?.data?.code === '200') {
        setTabList({
          list: [
            { id: 'sen', label: '보낸 문의', cnt: response.data.data.dpmpSumCnt },
            { id: 'rec', label: '받은 문의', cnt: response.data.data.rcvrSumCnt }
          ]
        })
      }
    })
  }, [])


  useEffect(() => {
    getQnaList()
    getQnaListCnt()
  }, [
    params.qnaSearchType,
    params.page
  ])


  return (
    <div className="mypage buy_sell buy_list_wrap inquiry_list  product agency">
      <div className="container">
        <BreadCrumbs {...props} />
        <div className="page_header">
          <div className="title_wrap">
            <h2 className="page_title">문의</h2>
          </div>
        </div>

        {/* 받은 문의, 보낸 문의 탭 */}
        <div className="buy_sell_container">
          <div className="card_layout">
            <div className="tab_header">
              <ul className="tab_header_list">
                {tabList.list.map((tab, idx) => (
                  <li
                    className={`tab_header_item ${params.qnaSearchType === tab.id ? 'active' : ''}`}
                    key={tab.id}
                    onClick={() => handleTab(tab.id)}
                  >
                    <span className="label">{tab.label}</span>
                    <Badge className={params.qnaSearchType === tab.id ? 'badge full_blue' : 'badge full_grey'}>
                      {tab.cnt}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            {/* 리스트 검색 */}
            <div className="card_content">
              <div className="search_filter_wrap">
                <ul className="table_list ">
                  <li className="table_row">
                    <div className="item_section section01">
                      <div className="cell cell_label cell_header ">검색</div>
                      <div className="cell cell_value">
                        <select
                          className="select type02"
                          onChange={(e) => handleSearchTypeList(e)}
                          value={searchTypeList?.active}
                          title={'searchTypeL'}
                        >
                          {searchTypeList?.list?.map((type, idx) => (
                            <option value={type.id} key={type.id + idx}>
                              {type.value}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          className="input"
                          value={params?.[searchTypeList?.active]}
                          onChange={(e) => onChangeSearchText(e)}
                          onKeyPress={onPressEnter}
                          title={'searchType'}
                        />
                        <Button className={'btn_search linear_grey'} onClick={handleSearch}>
                          찾기
                        </Button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="table_list_wrap each_list_wrap">
                <div className="table_header each_header req_each_item">
                  <div className="cell cell_num">No</div>
                  <div className="cell cell_info">상품정보</div>
                  <div className="cell cell_target">문의대상</div>
                  <div className="cell cell_day">최근메세지</div>
                  <div className="cell cell_state"></div>
                </div>
                <ul className="table_list each_list">

                  {/* 문의리스트 */}
                  {qnaListData?.list?.length > 0 ? (
                    qnaListData.list.map((item, idx) => (
                      <li className="table_row each_item_row" key={'each_prod_item_' + idx}>
                        <QnaUserListItem
                          data={item}
                          index={idx}
                          params={qnaListData}
                          totalLength={qnaListData.total}
                        />
                      </li>
                    ))
                  ) : (
                    <li className="table_row each_item_row no_result_wrap">
                      <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '문의 내역이 없습니다.'} />
                    </li>
                  )}
                </ul>
                
                {qnaListData?.totalPage > 0 && (
                  <div className="pagination_wrap">
                    <Pagination
                      page={qnaListData?.page}
                      totalPages={qnaListData?.totalPage}
                      handlePagination={(page) => handlePagination(page)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QnaUserList
