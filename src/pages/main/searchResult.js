import { useState, useEffect, useCallback } from 'react'
import CardItem from 'components/product/CardItem'
import Badge from 'components/atomic/Badge'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'

const SearchResult = (props) => {
  const { search } = props.location.state
  const [result, setResult] = useState([])
  const [selectList, setSelectList] = useState({
    active: 'popularFlg',
    list: [
      { id: 'popularFlg', value: '인기순' },
      { id: 'orderByDeal', value: '거래순' },
      { id: 'orderByDate', value: '최신등록순' }
    ]
  })
  const [params, setParams] = useState({
    page: 1,
    record: 20,
    totalPage: 1, //총 페이지 수
    total: 0, //총 상품 수
    popularFlg: 'Y', //인기순
    orderByDeal: '', //거래순
    orderByDate: '', //최신등록순
  })

  // 순서 플래그 검색
  const handleFilter = useCallback((e) => {
    setSelectList({ ...selectList, active: e.target.value })
    if (e.target.value === 'popularFlg') setParams({ ...params, page: 1, popularFlg: 'Y', orderByDeal: '', orderByDate: '' })
    else if (e.target.value === 'orderByDeal') setParams({ ...params, page: 1, popularFlg: '', orderByDeal: 'Y', orderByDate: '' })
    else if (e.target.value === 'orderByDate') setParams({ ...params, page: 1, popularFlg: '', orderByDeal: '', orderByDate: 'Y' })
  }, [selectList, params])

  // 리스트 더보기
  const handleMoreList = useCallback(() => {
    params.page < params.totalPage && setParams({ ...params, page: params.page + 1 })
  }, [params])

  const getSearchResult = useCallback(async () => {
    await Axios({
      url: API.HEADER.PRODUCT_SINGLE_LIST,
      method: 'get',
      params: {
        ...params,
        pdfInfoCon: search
      }
    }).then(async (response) => {
      if (response?.data?.code === '200') {
        let newList = [] //리스트 초기화
        if(params.page > 1) newList = result //더보기 눌렀을 때만 기존 리스트 셋팅
        await newList.push( ...response.data.data.list )
        setResult(newList)
        setParams({
          ...params,
          totalPage: response.data.data.totalPage,
          total: response.data.data.total
        })
      }
    })
  }, [search, params, result])

  useEffect(() => {
    getSearchResult()
  }, [
    search,
    params.page,
    params.popularFlg,
    params.orderByDeal,
    params.orderByDate
  ])

  // 검색결과 없을 때
  const SeachFail = () => {
    return (
      <div className="product">
        <div className="container default_size">
          <div className="product_container search_result">
            <div className="no_result_wrap">
              <div className="no_result">검색 결과가 없습니다.</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 검색 결과 있을 때
  const SeachSuccess = () => {
    return (
      <>
        <div className="product popular_celeb">
          <div className="container default_size">
            <div className="product_container search_result">
              <div className="section_header">
                <div className="section_header_left">
                  <span className="title">{`검색결과 : ${search}`}</span>
                  <Badge className="badge full_blue">{params?.total}</Badge>
                </div>

                {/* 플래그 검색 */}
                <div className="section_header_right">
                  <select className="select fw500" title={'filter'} value={selectList?.active} onChange={handleFilter}>
                    {selectList.list.map((sel, idx) => (
                      <option value={sel.id} key={sel.id + idx}>
                        {sel.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 리스트 */}
              <ul className="product_list">
                {result?.map((data, index) => (
                  <li className="product_item" key={'productList' + index}>
                    <CardItem data={data} />
                  </li>
                ))}
              </ul>

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

  return result?.length > 0 ? <SeachSuccess /> : <SeachFail />
}

export default SearchResult
