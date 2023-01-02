import { useState, useEffect, useCallback } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { createKey } from 'modules/utils/MathUtils'
import BundleItem from 'components/product/BundleItem'
import Button from 'components/atomic/Button'

const BundleResult = () => {

  const [result, setResult] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectList, setSelectList] = useState({
    active: 'popularFlg',
    list: [
      { id: 'popularFlg', value: '인기순' },
      { id: 'orderByDate', value: '최신등록순' }
    ]
  })
  const [params, setParams] = useState({
    mainPageFlg: "list",
    type: 'PAGE', //PAGE: 페이징, SEARCH: 검색, ALL: 전체리스트
    popularFlg: 'Y', //인기순
    orderByDate: '', //최신순
    page: 1,
    record: 20,
    totalPage: 1,
    pdfInfoCon: '', //검색어
  })

  const handleForm = useCallback((e) => {
    setParams({ ...params, pdfInfoCon: e.target.value })
  }, [params, result, selectList])

  const onPressEnter = useCallback((e) => {
    e.key === 'Enter' && handleSearch()
  }, [params])

  // 상품 검색
  const handleSearch = useCallback(() => {
    setSelectList({ ...selectList, active: 'popularFlg' })
    if (params.pdfInfoCon?.length > 0) setParams({ ...params, type: 'SEARCH', page: 1, popularFlg: 'Y', orderByDate: '' }) //검색어 있으면 타입 - 검색으로
    else setParams({ ...params, type: 'ALL', page: 1, popularFlg: 'Y', orderByDate: '' }) //검색어가 없을면 타입 - 전체보기로
  }, [params, result, selectList])

  // 순서 플래그 검색
  const handleFilter = useCallback((e) => {
    setSelectList({ ...selectList, active: e.target.value })
    switch (e.target.value) {
      case 'popularFlg':
        setParams({ ...params, type: 'SEARCH', page: 1, popularFlg: 'Y', orderByDate: '' })
        break
      case 'orderByDate':
        setParams({ ...params, type: 'SEARCH', page: 1, popularFlg: '', orderByDate: 'Y' })
        break
    }
  }, [selectList, params])

  // 리스트 더보기
  const handleMoreList = useCallback(() => {
    params.page < params.totalPage && setParams({ ...params, page: params.page + 1 })
  }, [params])

  const getSearchResult = useCallback(async () => {
    setIsLoading(true)
    await Axios({
      url: API.MAIN.BUNDLE_LIST,
      method: 'get',
      params: params
    }).then(async (response) => {
      if (response?.data?.code === '200') {
        let newList = []
        if (params.page > 1) newList = result //페이지 더보기 일 때 기존 리스트 셋팅
        await newList.push(...response.data.data.list)
        setResult(newList)
        setParams({
          ...params,
          totalPage: response.data.data.totalPage
        })
      }
      setIsLoading(false)
    })
  }, [params, result])

  useEffect(() => {
    getSearchResult()
  }, [
    params.page,
    params.type,
    params.orderByDate,
    params.popularFlg
  ])

  return (
    <>
      <div className="product bind_prod_all">
        <div className="container default_size">
          <div className="product_container">
            <div className="page_header padding_none">
              <div className="title_wrap">
                <span className="page_title">묶음상품</span>
              </div>

              {/* 검색 */}
              <div className="info_wrap">
                <div className="search_wrap">
                  <input
                    type="text"
                    className="input"
                    placeholder="제품 검색"
                    id={'pdfInfoCon'}
                    value={params?.pdfInfoCon}
                    onChange={handleForm}
                    onKeyPress={onPressEnter}
                  />
                  <Button className="btn btn_search" onClick={handleSearch}>
                    <span className="hide">검색</span>
                  </Button>
                </div>
                <select className="select fw500" title={'filter'} value={selectList?.active} onChange={handleFilter} >
                  {selectList.list.map((sel, idx) => (
                    <option value={sel.id} key={sel.id + idx}>
                      {sel.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 리스트 */}
            {result?.length > 0 ? (
              <div className="combine_list">
                {result?.map((bundle, index) => (
                  <div className="combine_item_wrap" key={createKey()}>
                    <BundleItem data={bundle} handleRefreshList={getSearchResult} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="no_result_wrap">
                <div className="no_result">{isLoading ? '상품을 불러오고 있습니다.' : '등록된 상품이 없습니다.'}</div>
              </div>
            )}

            {/* 리스트 더보기 */}
            {params.page < params.totalPage && (
              <div className="btn_wrap more">
                <Button className="btn full_blue" onClick={handleMoreList}>더보기</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default BundleResult
