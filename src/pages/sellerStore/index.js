import { useCallback, useEffect, useState } from 'react'
import Gallery from 'components/sellerStore/Gallery'
import BreadCrumbs from 'components/BreadCrumbs'
import Checkbox from 'components/atomic/Checkbox'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'
import SellerStoreSlider from 'components/Slider/SellerStoreSlider'
import 'assets/style/sellerStore.css'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import { useParams } from 'react-router-dom'
import SingleList from 'components/sellerStore/SingleList'
import BundleList from 'components/sellerStore/BundleList'
import {createHeaderSeo} from "../../modules/utils/CustromSeo";

const sellerStore = (props) => {
  const { id } = useParams()
  const [storeInfo, setStoreInfo] = useState({})
  const [categoryList, setCategoryList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState({
    checked: '',
    pdfCnt: '',
    pdfCtgyName: '',
    oneCtgyId: '--',
    thrCtgyId: '--',
    twoCtgyId: '--',
    forCtgyId: '--'
  })
  const [total, setTotal] = useState(0) //총 상품 수
  const [bgList, setBgList] = useState({}) //홈화면 배경 이미지 리스트
  const [bannerList, setBannerList] = useState({}) //배너 리스트(공개만)
  const [selectList, setSelectList] = useState({
    active: 'popularFlg',
    single: [
      { value: 'popularFlg', label: '인기순' },
      { value: 'orderByDeal', label: '거래순' },
      { value: 'orderByDate', label: '최신등록순' }
    ],
    bind: [
      { value: 'popularFlg', label: '인기순' },
      { value: 'orderByDate', label: '최신등록순' }
    ]
  })
  const [searchForm, setSearchForm] = useState({
    pdfInfoCon: '',
    page: 1,
    record: 20,
    oneCtgyId: '--',
    twoCtgyId: '--',
    thrCtgyId: '--',
    forCtgyId: '--',
    total: 0,
    popularFlg: 'Y', //인기순
    orderByDeal: '', //거래순
    orderByDate: '' //최신등록순
  })
  const [tabList, setTabList] = useState({
    active: 'single',
    list: [
      { id: 'single', name: '개별상품', cnt: 0 },
      { id: 'bind', name: '묶음상품', cnt: 0 }
    ]
  })
  const [searchInput, setSearchInput] = useState('') //검색어

  const handleCheckbox = (category) => {
    setSelectedCategory({ ...category })
    setSearchForm({
      ...searchForm,
      page: 1,
      oneCtgyId: category.oneCtgyId,
      twoCtgyId: category.twoCtgyId,
      thrCtgyId: category.thrCtgyId,
      forCtgyId: category.forCtgyId,
      pdfInfoCon: '', //검색어 초기화
      popularFlg: 'Y', //인기순으로
      orderByDeal: '',
      orderByDate: ''
    })
    setSearchInput('') //검색어 초기화
    setTabList({ ...tabList, active: 'single' }) //카테고리는 개별상품만
    setSelectList({ ...selectList, active: 'popularFlg' }) //리스트 플래그
  }

  const selectedCheck = (category, selectedCategory) => {
    return (
      category.oneCtgyId + category.twoCtgyId + category.thrCtgyId + category.forCtgyId ===
      selectedCategory.oneCtgyId + selectedCategory.twoCtgyId + selectedCategory.thrCtgyId + selectedCategory.forCtgyId
    )
  }

  const handleTab = useCallback((id) => {
    setSearchForm({ //탭 바꾸면 인기순, 페이지 1, 검색어 초기화
      ...searchForm,
      page: 1,
      popularFlg: 'Y',
      orderByDeal: '',
      orderByDate: '',
      pdfInfoCon: '',
      oneCtgyId: '--',
      twoCtgyId: '--',
      thrCtgyId: '--',
      forCtgyId: '--',
    })
    setTotal(0)
    setSearchInput('')
    setTabList({ ...tabList, active: id })
    setSelectedCategory({ //탭 바꾸면 카테고리 전체로
      checked: '',
      pdfCnt: '',
      pdfCtgyName: '',
      oneCtgyId: '--',
      thrCtgyId: '--',
      twoCtgyId: '--',
      forCtgyId: '--'
    })
  }, [searchForm, total, searchInput, selectList, selectedCategory])

  const onClickMore = useCallback(() => {
    setSearchForm({ ...searchForm, page: searchForm.page + 1 })
  }, [searchForm])

  const onChangeSearchInput = useCallback((e) => { //검색어 입력
    setSearchInput(e.target.value)
  }, [searchInput])

  const onChangeSelectBox = useCallback((e) => {
    setSelectList({ ...selectList, active: e.target.value }) //선택한 플래그 보이기
    // 리스트 플래그 검색
    switch (e.target.value) {
      case 'popularFlg':
        setSearchForm({
          ...searchForm,
          popularFlg: 'Y', orderByDeal: '', orderByDate: '',
          page: 1,
        })
        break
      case 'orderByDeal':
        setSearchForm({
          ...searchForm,
          popularFlg: '', orderByDeal: 'Y', orderByDate: '',
          page: 1,
        })
        break
      case 'orderByDate':
        setSearchForm({
          ...searchForm,
          popularFlg: '', orderByDeal: '', orderByDate: 'Y',
          page: 1,
        })
        break
    }
  }, [searchForm, selectList, searchInput])

  const onClickSearch = useCallback(() => { //검색하기
    setSelectList({ ...selectList, active: 'popularFlg' }) //리스트 플래그
    setSearchForm({ //검색하면 인기순, 페이지 1, 검색어 초기화
      ...searchForm,
      page: 1,
      popularFlg: 'Y',
      orderByDeal: '',
      orderByDate: '',
      pdfInfoCon: searchInput,
      oneCtgyId: '--',
      twoCtgyId: '--',
      thrCtgyId: '--',
      forCtgyId: '--',
    })
    setSelectedCategory({ //검색하면 카테고리 전체로
      checked: '',
      pdfCnt: '',
      pdfCtgyName: '',
      oneCtgyId: '--',
      thrCtgyId: '--',
      twoCtgyId: '--',
      forCtgyId: '--'
    })
  }, [searchForm, selectList, searchInput, selectedCategory])

  const onPressEnter = useCallback((e) => {
    e.key === 'Enter' && onClickSearch()
  }, [searchForm, searchInput])



  const getStoreInfo = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.SELLER_STORE_DETAIL,
      method: 'get',
      params: { selrUsisId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setStoreInfo(response?.data?.data)

        //
        createHeaderSeo([
          {
            name : "og:title",
            content : response?.data?.data.bplcNm
          },
          {
            name : "og:description",
            content : response?.data?.data.userCpCon
          },
          {
            name : "og:url",
            content : window.location.href
          },
          {
            name : "og:image",
            content : window.location.origin+"/ibklogo.png"
          },
          {
            name : "twitter:title",
            content : response?.data?.data.bplcNm
          },
          {
            name : "twitter:description",
            content : response?.data?.data.userCpCon
          },
          {
            name : "twitter:image",
            content : window.location.origin+"/ibklogo.png"
          }
        ]);
      }
    })
  }, [id])

  const getCategoryList = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.SELLER_CATEGORY_LIST,
      method: 'post',
      data: { selrUsisId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setCategoryList(response?.data?.data?.list)
      }
    })
  }, [id])

  const getBannerList = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.SELLER_BANNER_LIST,
      method: 'post',
      data: { selrUsisId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        let bannerOpenList = response?.data?.data?.sellerBannerList?.filter((item) => item.oppbYn === 'Y') //공개된 배너만
        setBgList(response?.data?.data?.sellerBgImg)
        setBannerList(bannerOpenList)
      }
    })
  }, [id])

  const getTabCount = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.SELLER_STORE_HEADER,
      method: 'get',
      params: { selrUsisId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setTabList({
          ...tabList,
          list: [
            { id: 'single', name: '개별상품', cnt: response.data.data.singleSize },
            { id: 'bind', name: '묶음상품', cnt: response.data.data.bundleSize }
          ]
        })
      }
    })
  }, [id, tabList])

  useEffect(() => {
    getBannerList()
    getCategoryList()
    getStoreInfo()
    getTabCount()
  }, [])

  return (
    <div className="sellerstore default_size">
      <div className="container">
        <Gallery storeInfo={storeInfo} imgUrl={bgList?.imgUrl} />
        <BreadCrumbs {...props} />
        <div className="section01">
          <div className="section01_wrap padding-left-right01">
            <p className="title">카테고리</p>
            <div className={`category ${bannerList?.length < 1 && 'no_banner'}`}>
              <div className="category_left scroll_light">
                <ul className="cate_list">
                  <li className="cate_item">
                    {categoryList?.map((category, index) => (
                      <div
                        className="cate_row"
                        key={category.oneCtgyId + category.twoCtgyId + category.thrCtgyId + category.forCtgyId}
                        onClick={() => handleCheckbox(category)}
                      >
                        <Checkbox
                          id={category.oneCtgyId + category.twoCtgyId + category.thrCtgyId + category.forCtgyId}
                          label={category.pdfCtgyName}
                          onChange={() => handleCheckbox(category)}
                          checked={selectedCheck(category, selectedCategory)}
                        />
                        <label
                          htmlFor={category.oneCtgyId + category.twoCtgyId + category.thrCtgyId + category.forCtgyId}
                        >
                          {category.pdfCnt}
                        </label>
                      </div>
                    ))}
                  </li>
                </ul>
              </div>
              {bannerList?.length > 0 && (
                <div className="category_right">
                  <SellerStoreSlider data={bannerList} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="section02">
          <div className="section02_wrap padding-left-right01">
            <div className="tab_header">
              <ul className="tab_header_list">
                {tabList.list.map((tab) => (
                  <li
                    className={`tab_header_item ${tabList.active === tab.id ? 'active' : ''}`}
                    key={tab.id}
                    onClick={() => handleTab(tab.id)}
                  >
                    <span className="label">{tab.name}</span>
                    <Badge className={tabList.active === tab.id ? 'badge full_blue' : 'badge full_grey'}>
                      {tab.cnt}
                    </Badge>
                  </li>
                ))}
              </ul>
              <div className="tab_header_right">
                <div className="search_wrap">
                  <input
                    type="text"
                    className="input"
                    placeholder="제품 검색"
                    value={searchInput}
                    onChange={onChangeSearchInput}
                    onKeyPress={onPressEnter}
                    title={'search'}
                  />
                  <Button className="btn btn_search" onClick={onClickSearch}>
                    <span className="hide">검색</span>
                  </Button>
                </div>
                <select className="select" onChange={onChangeSelectBox} title={`selectList`} value={selectList?.active}>
                  {selectList?.[tabList.active]?.map((item, index) => (
                    <option value={item.value} key={item.value + index}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {total > 0 && (
              <div className="search_result">
                총 <span className="blue">{total}개</span>의 상품이 검색되었습니다.
              </div>
            )}
            {tabList.active === 'single' ? (
              <SingleList
                selrUsisId={id}
                searchForm={searchForm}
                setSearchForm={setSearchForm}
                onClickMore={onClickMore}
                setTotal={setTotal}
              />
            ) : (
              <BundleList
                selrUsisId={id}
                searchForm={searchForm}
                setSearchForm={setSearchForm}
                onClickMore={onClickMore}
                setTotal={setTotal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default sellerStore
