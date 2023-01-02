import React, { useState, useCallback, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import CardItem from 'components/product/CardItem'
import { createKey } from 'modules/utils/MathUtils'
import { addComma } from 'modules/utils/Common'
import Button from 'components/atomic/Button'

const Product = ({ props }) => {
  const location = useLocation()
  const [selectList, setSelectList] = useState({
    selected: 'orderByDate',
    list: [
      { id: 'orderByDate', value: '최신순' },
      { id: 'popularFlg', value: '조회순' },
      { id: 'inquFlg', value: '문의순' }
    ]
  })

  const [bannerList, setBannerList] = useState([]) //상품배너
  const [categoryList, setCategoryList] = useState({}) //카테고리 정보
  const [productList, setProductList] = useState([]) //상품목록
  const [breadcrumb, setBreadcrumb] = useState([]) //breadcrumb
  const [depthOneInit] = useState({ ctgyCd: '01', ctgyNm: '전체' }) //초기공통값
  const [depthOneInfo, setDepthOneInfo] = useState(
    location?.state?.depth == 1 && location?.state?.ctgyCd != '' ? location?.state : depthOneInit
  ) //2자리
  const [depthTwoInfo, setDepthTwoInfo] = useState(
    location?.state?.depth == 2 && location?.state?.ctgyCd != '' ? location?.state 
    : location?.state?.depth > 2 && location?.state?.ctgyCd != '' ? { ...location?.state, ctgyCd: location?.state?.ctgyCd?.substr(0,2), ctgyNm: location?.state?.ctgyNm[0] }
    : ''
  ) //2자리
  const [depthThrInfo, setDepthThrInfo] = useState(
    location?.state?.depth == 3 && location?.state?.ctgyCd != '' ? { ...location?.state, ctgyCd: location?.state?.ctgyCd?.substr(2,2), ctgyNm: location?.state?.ctgyNm[1] }
    : location?.state?.depth > 3 && location?.state?.ctgyCd != '' ? { ...location?.state, ctgyCd: location?.state?.ctgyCd?.substr(2,2), ctgyNm: location?.state?.ctgyNm[1] }
    : ''
  ) //2자리
  const [depthForInfo, setDepthForInfo] = useState(
    location?.state?.depth == 4 && location?.state?.ctgyCd != '' ? { ...location?.state, ctgyCd: location?.state?.ctgyCd?.substr(4,2), ctgyNm: location?.state?.ctgyNm[2] }
    : location?.state?.depth > 4 && location?.state?.ctgyCd != '' ? { ...location?.state, ctgyCd: location?.state?.ctgyCd?.substr(4,2), ctgyNm: location?.state?.ctgyNm[2] }
    : ''
  ) //2자리
  const [depthFivInfo, setDepthFivInfo] = useState(
    location?.state?.depth == 5 && location?.state?.ctgyCd != '' ? { ...location?.state, ctgyCd: location?.state?.ctgyCd?.substr(6,2), ctgyNm: location?.state?.ctgyNm[3] }
    : ''
  ) //2자리
  const [catePopupState, setCatePopupState] = useState(false) //카테고리 팝업 오픈 여부
  const [params, setParams] = useState({
    page: 1,
    record: 20,
    totalPage: 1, //전체 페이지 수
    total: 0, //전체 상품 수
    oneCtgyId: depthOneInfo.ctgyCd,
    twoCtgyId: depthTwoInfo.ctgyCd,
    thrCtgyId: depthThrInfo.ctgyCd,
    forCtgyId: depthForInfo.ctgyCd,
    fivCtgyId: depthFivInfo.ctgyCd,
    pdfInfoCon: '',
    popularFlg: '', //조회순
    orderByDate: 'Y', //최신순
    inquFlg: '' //문의순
  })

  //팝업이 닫힐때 선택한 카테고리 목록으로 정보 업데이트
  const handleClose = useCallback(() => {
    setCatePopupState(false)
  })

  //대분류 클릭시
  const onClickCategory = useCallback((obj) => {
    if (obj.useYn === 'N') {
      return
    }

    const setData = { ctgyCd: obj.ctgyCd.substr(2, 2), ctgyNm: obj.ctgyNm }

    setDepthTwoInfo(setData) //useState로 사용시 getProductList()함수에서 바로 사용할수 없으므로, 함수인자로 우선 전달 처리
    setDepthThrInfo('') //대분류 선택시 팝업으로 타고 들어간 중/소분류 카테고리 초기화
    setDepthForInfo('') //대분류 선택시 팝업으로 타고 들어간 중/소분류 카테고리 초기화
    setDepthFivInfo('') //대분류 선택시 팝업으로 타고 들어간 중/소분류 카테고리 초기화
    setSelectList({ ...selectList, selected: 'orderByDate' }) //리스트 플래그 최신순으로 변경
    setParams({ ...params, popularFlg: '', inquFlg: '', orderByDate: 'Y', pdfInfoCon: '', page: 1 }) //리스트 플래그 '최신순', 검색어 삭제, 페이지 1로 변경

    // getProductList(depthOneInfo, setData, depthThrInfo, depthForInfo, depthFivInfo) //useEffect로 call
  }, [params, selectList])

  const onChangeSearchInput = useCallback((e) => {
    setParams({ ...params, pdfInfoCon: e.target.value })
  }, [params])

  const onPressSearchEnter = useCallback((e) => {
    e.key === 'Enter' && onSearchList()
  }, [params])

  const onSearchList = useCallback((type) => {
    setParams({ ...params, popularFlg: '', inquFlg: '', orderByDate: 'Y', page: 1 })
    setSelectList({ ...selectList, selected: 'orderByDate' })
    getProductList(depthOneInfo, depthTwoInfo, depthThrInfo, depthForInfo, depthFivInfo)
  }, [params, selectList, depthOneInfo, depthTwoInfo, depthThrInfo, depthForInfo, depthFivInfo])

  const onChangeSelectBox = useCallback((e) => {
    //리스트 검색조건
    switch (e.target.value) {
      case 'popularFlg':
        setParams({ ...params, popularFlg: 'Y', inquFlg: '', orderByDate: '', page: 1 })
        break
      case 'inquFlg':
        setParams({ ...params, popularFlg: '', inquFlg: 'Y', orderByDate: '', page: 1 })
        break
      case 'orderByDate':
        setParams({ ...params, popularFlg: '', inquFlg: '', orderByDate: 'Y', page: 1 })
        break
    }
    setSelectList({ ...selectList, selected: e.target.value })
  }, [params, selectList])

  const getBannerList = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.BANNER_LIST,
      method: 'get'
    }).then((response) => {
      if (response?.data?.code === '200') {
        setBannerList(response.data.data.list)
      }
    })
  })

  const getCategory = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.PRODUCT_CATEGORY_LIST,
      method: 'get',
      params: { parentCode: depthOneInit.ctgyCd }
    }).then((response) => {
      if (response?.data?.code === '200') {
        response.data.data.depthOne[0].ctgyNm = depthOneInit.ctgyNm
        setCategoryList(response.data.data)
      }
    })
  }, [])

  const getProductList = useCallback(
    async (depthOneInfo, depthTwoInfo, depthThrInfo, depthForInfo, depthFivInfo) => {
      // console.log("목록 검색 : ", depthOneInfo.ctgyCd, depthTwoInfo.ctgyCd, depthThrInfo.ctgyCd, depthForInfo.ctgyCd, depthFivInfo.ctgyCd);
      // console.log("목록 명 : ", depthOneInfo.ctgyNm, depthTwoInfo.ctgyNm, depthThrInfo.ctgyNm, depthForInfo.ctgyNm, depthFivInfo.ctgyNm);
      // console.log("params--->",params)

      let paramData = params
      paramData.oneCtgyId = depthOneInfo.ctgyCd
      paramData.twoCtgyId = depthTwoInfo.ctgyCd
      paramData.thrCtgyId = depthThrInfo.ctgyCd
      paramData.forCtgyId = depthForInfo.ctgyCd
      paramData.fivCtgyId = depthFivInfo.ctgyCd

      await Axios({
        url: API.PRODUCT.PRODUCT_LIST,
        method: 'get',
        params: paramData
      }).then((response) => {
        if (response?.data?.code === '200') {
          let newList = []
          if(params.page > 1) newList = productList
          newList.push( ...response.data.data.list )
          setProductList(newList)
          setParams({ 
            ...params,
            totalPage: response.data.data.totalPage, //전체 페이지 수
            total: response.data.data.total, //전체 상품 수
          })
        }
      })

      let breadcrumbList = []
      depthTwoInfo.ctgyNm && depthTwoInfo.ctgyNm != '' ? breadcrumbList.push(depthTwoInfo.ctgyNm) : null
      depthThrInfo.ctgyNm && depthThrInfo.ctgyNm != '' ? breadcrumbList.push(depthThrInfo.ctgyNm) : null
      depthForInfo.ctgyNm && depthForInfo.ctgyNm != '' ? breadcrumbList.push(depthForInfo.ctgyNm) : null
      depthFivInfo.ctgyNm && depthFivInfo.ctgyNm != '' ? breadcrumbList.push(depthFivInfo.ctgyNm) : null
      setBreadcrumb(breadcrumbList)
    },
    [params, productList, selectList]
  )

  // 리스트 더보기
  const handleMoreList = useCallback(() => {
    params.page < params.totalPage && setParams({ ...params, page: params.page + 1 })
  }, [params, productList])

  useEffect(() => {
    getBannerList()
    getCategory()
    getProductList(depthOneInfo, depthTwoInfo, depthThrInfo, depthForInfo, depthFivInfo)
    SwiperCore.use([Navigation, Pagination, Autoplay])
  }, [])

  useEffect(() => {
    getProductList(depthOneInfo, depthTwoInfo, depthThrInfo, depthForInfo, depthFivInfo)
  }, [
    params.page,
    params.popularFlg,
    params.inquFlg,
    params.orderByDate,
    depthOneInfo, depthTwoInfo, depthThrInfo, depthForInfo, depthFivInfo
  ])

  return (
    <>
      {catePopupState && (
        <CategoryList
          handleClose={handleClose}
          categoryList={categoryList}
          getDepth={{
            OneInfo: depthOneInfo,
            TwoInfo: depthTwoInfo,
            ThrInfo: depthThrInfo,
            ForInfo: depthForInfo,
            FivInfo: depthFivInfo
          }}
          setDepth={{
            OneInfo: setDepthOneInfo,
            TwoInfo: setDepthTwoInfo,
            ThrInfo: setDepthThrInfo,
            ForInfo: setDepthForInfo,
            FivInfo: setDepthFivInfo
          }}
        />
      )}

      <div className="product bg_white">
        <div className="container default_size">
          {bannerList?.length > 0 && (
            <div className="gallery_wrap">
              <Swiper pagination={{ clickable: true }} loop={true} className="mySwiper">
                {bannerList.map((item, index) => (
                  <SwiperSlide key={createKey()}>
                    <Link to={{ pathname: item.link }} target="_blank" className="img_wrap">
                      <img src={item.imgUrl} alt={item.ttl} />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <div className="category_list_wrap ">
            <ul className="category_list scroll">
              <li
                className={`category_item ${depthOneInfo.ctgyCd === '01' && (depthTwoInfo.ctgyCd == undefined || depthTwoInfo.ctgyCd == '')
                    ? 'active'
                    : ''
                  }`}
                key={createKey()}
                onClick={() => onClickCategory(depthOneInit)}
              >
                전체
              </li>
              {categoryList.depthTwo?.map((item, index) => (
                <li
                  className={`category_item ${`${depthOneInfo.ctgyCd + depthTwoInfo.ctgyCd}` === item.ctgyCd ? 'active' : item.useYn === 'Y' ? ''
                      : 'no_data'
                    }`}
                  key={createKey()}
                  onClick={() => onClickCategory(item)}
                >
                  {item.ctgyNm}
                </li>
              ))}
            </ul>
            {categoryList && categoryList.depthTwo?.length > 0 ? (
              <button className="btn_more" onClick={() => setCatePopupState(!catePopupState)}>
                <span className="hide">더보기</span>
              </button>
            ) : null}
          </div>

          <div className="product_container">
            <div className="search_breadscrumb">{breadcrumb.join(' > ')}</div>

            <div className="section_header">
              <div className="section_header_left">
                <div className="search_result">
                  총 <span className="blue">{addComma(Number(params.total))}개</span>의 상품이 검색되었습니다.
                </div>
              </div>
              <div className="section_header_right all_list">
                <div className="search_wrap">
                  <input
                    type="text"
                    className="input"
                    placeholder="제품 검색"
                    value={params?.pdfInfoCon}
                    onChange={onChangeSearchInput}
                    onKeyPress={onPressSearchEnter}
                    title={'pdfInfoCon'}
                  />
                  <Button className="btn btn_search" onClick={onSearchList}>
                    <span className="hide">검색</span>
                  </Button>
                </div>
                <select className="select" onChange={onChangeSelectBox} title={'selectList'} value={selectList?.selected}>
                  {selectList.list.map((sel, idx) => (
                    <option value={sel.id} key={sel.id + idx}>
                      {sel.value}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {productList?.length > 0 ? (
              <>
                <ul className="product_list">
                  {productList.map((item, index) => (
                    <li className="product_item" key={createKey()}>
                      <CardItem data={item} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="no_data_wrap">검색 결과가 없습니다.</div>
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

const CategoryList = (props) => {
  const { handleClose, categoryList, getDepth, setDepth } = props

  const [depthOneList, setDepthOneList] = useState([])
  const [depthTwoList, setDepthTwoList] = useState([])
  const [depthThrList, setDepthThrList] = useState([])
  const [depthForList, setDepthForList] = useState([])
  const [depthFivList, setDepthFivList] = useState([])

  const cateSetting = useCallback((obj) => {
    if (obj.useYn === 'N') {
      return
    }

    if (obj.act === '_two') {
      setDepthThrList(categoryList.depthThr.filter((item) => item.ctgyParentCd == obj.ctgyCd))
      setDepthFivList([])

      if (obj.init === 'Y') {
        //parent component
        setDepth.TwoInfo({
          ctgyCd: obj.ctgyCd.substr(2, 2),
          ctgyNm: categoryList.depthTwo.filter((item) => item.ctgyCd == obj.ctgyCd.substr(0, 4))[0].ctgyNm
        }) //0102 => 02
        setDepth.ThrInfo('') //linit
        setDepth.ForInfo('') //linit
        setDepth.FivInfo('') //linit
      }
    } else if (obj.act === '_for') {
      setDepthFivList(categoryList.depthFiv.filter((item) => item.ctgyParentCd == obj.ctgyCd))

      if (obj.init === 'Y') {
        //parent component
        setDepth.TwoInfo({
          ctgyCd: obj.ctgyCd.substr(2, 2),
          ctgyNm: categoryList.depthTwo.filter((item) => item.ctgyCd == obj.ctgyCd.substr(0, 4))[0].ctgyNm
        }) //01020304 => 02
        setDepth.ThrInfo({
          ctgyCd: obj.ctgyCd.substr(4, 2),
          ctgyNm: categoryList.depthThr.filter((item) => item.ctgyCd == obj.ctgyCd.substr(0, 6))[0].ctgyNm
        }) //01020304 => 03
        setDepth.ForInfo({
          ctgyCd: obj.ctgyCd.substr(6, 2),
          ctgyNm: categoryList.depthFor.filter((item) => item.ctgyCd == obj.ctgyCd.substr(0, 8))[0].ctgyNm
        }) //01020304 => 04
        setDepth.FivInfo('') //linit
      }
    } else if (obj.act === '_fiv') {
      if (obj.init === 'Y') {
        //parent component

        const twoData = {
          ctgyCd: obj.ctgyCd.substr(2, 2),
          ctgyNm: categoryList.depthTwo.filter((item) => item.ctgyCd == obj.ctgyCd.substr(0, 4))[0].ctgyNm
        }
        const thrData = {
          ctgyCd: obj.ctgyCd.substr(4, 2),
          ctgyNm: categoryList.depthThr.filter((item) => item.ctgyCd == obj.ctgyCd.substr(0, 6))[0].ctgyNm
        }
        const forData = {
          ctgyCd: obj.ctgyCd.substr(6, 2),
          ctgyNm: categoryList.depthFor.filter((item) => item.ctgyCd == obj.ctgyCd.substr(0, 8))[0].ctgyNm
        }
        const fivData = {
          ctgyCd: obj.ctgyCd.substr(8, 2),
          ctgyNm: categoryList.depthFiv.filter((item) => item.ctgyCd == obj.ctgyCd.substr(0, 10))[0].ctgyNm
        }

        setDepth.TwoInfo(twoData) //0102030405 => 02
        setDepth.ThrInfo(thrData) //0102030405 => 03
        setDepth.ForInfo(forData) //0102030405 => 04
        setDepth.FivInfo(fivData) //0102030405 => 05

        handleClose()
      }
    }
  })

  useEffect(() => {
    setDepthTwoList(categoryList.depthTwo)
    setDepthForList(categoryList.depthFor) //3차와4차를 그룹단위로 뿌려야 함으로 3차변경시 if로 걸러냄

    getDepth.TwoInfo != ''
      ? cateSetting({
        ctgyNm: getDepth.TwoInfo.ctgyNm,
        ctgyCd: getDepth.OneInfo.ctgyCd + getDepth.TwoInfo.ctgyCd,
        useYn: 'Y',
        act: '_two',
        init: 'N'
      })
      : {}
    getDepth.ForInfo != ''
      ? cateSetting({
        ctgyNm: getDepth.ForInfo.ctgyNm,
        ctgyCd: getDepth.OneInfo.ctgyCd + getDepth.TwoInfo.ctgyCd + getDepth.ThrInfo.ctgyCd + getDepth.ForInfo.ctgyCd,
        useYn: 'Y',
        act: '_for',
        init: 'N'
      })
      : {}
    getDepth.FivInfo != ''
      ? cateSetting({
        ctgyNm: getDepth.ForInfo.ctgyNm,
        ctgyCd:
          getDepth.OneInfo.ctgyCd +
          getDepth.TwoInfo.ctgyCd +
          getDepth.ThrInfo.ctgyCd +
          getDepth.ForInfo.ctgyCd +
          getDepth.FivInfo.ctgyCd,
        useYn: 'Y',
        act: '_fiv',
        init: 'N'
      })
      : {}
  }, [])

  return (
    <>
      <div className="product_category_wrap">
        <div className="product_category scroll">
          <div className="depth1">
            <p className="title">
              카테고리
              <button onClick={handleClose}>
                <img src={require('assets/images/ico_close1.png').default} alt="" />
              </button>
            </p>
            <div className="cate_list">
              {depthTwoList &&
                depthTwoList.map((obj, idx) => (
                  <p
                    className={`cate_item ${obj.ctgyCd == getDepth.OneInfo.ctgyCd + getDepth.TwoInfo.ctgyCd ? 'item-active' : ''
                      } ${obj?.useYn === 'Y' ? 'black' : 'grey'}`}
                    key={createKey()}
                    onClick={() => cateSetting({ ...obj, act: '_two', init: 'Y' })}
                  >
                    {obj.ctgyNm}
                    <img src={require('assets/images/icon_arr_right.png').default} alt="" />
                  </p>
                ))}
            </div>
          </div>
          <div className="depth2">
            {depthThrList &&
              depthThrList.map((sel, idx) => (
                <div className="depth2_item" key={createKey()}>
                  <p className="title">{sel.ctgyNm}</p>
                  <div className="cate_list">
                    {depthForList &&
                      depthForList.map((obj, idx) =>
                        obj.ctgyParentCd == sel.ctgyCd ? (
                          <div
                            className={`cate_item ${obj.ctgyCd ==
                                getDepth.OneInfo.ctgyCd +
                                getDepth.TwoInfo.ctgyCd +
                                getDepth.ThrInfo.ctgyCd +
                                getDepth.ForInfo.ctgyCd
                                ? 'item-active'
                                : ''
                              } ${obj?.useYn === 'Y' ? 'black' : 'grey'}`}
                            key={createKey()}
                            onClick={() => cateSetting({ ...obj, act: '_for', init: 'Y' })}
                          >
                            {obj.ctgyNm}
                          </div>
                        ) : null
                      )}
                  </div>
                </div>
              ))}
          </div>
          <div className="depth3">
            <div className="cate_list">
              {depthFivList &&
                depthFivList.map((obj, idx) => (
                  <div
                    className={`cate_item ${obj.ctgyCd ==
                        getDepth.OneInfo.ctgyCd +
                        getDepth.TwoInfo.ctgyCd +
                        getDepth.ThrInfo.ctgyCd +
                        getDepth.ForInfo.ctgyCd +
                        getDepth.FivInfo.ctgyCd
                        ? 'item-active'
                        : ''
                      } ${obj?.useYn === 'Y' ? 'black' : 'grey'}`}
                    key={createKey()}
                    onClick={() => cateSetting({ ...obj, act: '_fiv', init: 'Y' })}
                  >
                    {obj.ctgyNm}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product
