import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import CardItem from 'components/product/CardItem'
import Button from 'components/atomic/Button'
import {createHeaderSeo} from "../../modules/utils/CustromSeo";

const BindDetail = () => {
  const { id } = useParams()
  const [bundleInfo, setBundleInfo] = useState({})
  const [bundleProductList, setBundleProductList] = useState([])
  const [selectList, setSelectList] = useState({
    selected: 'N',
    list: [
      { id: 'N', value: '인기순' },
      { id: 'Y', value: '최신등록순' }
    ]
  })
  const [params, setParams] = useState({
    bunInfId: id,
    pdfInfoCon: '',
    orderByDate: 'N'
  })

  const onChangeListOrder = useCallback(
    (e) => {
      setSelectList({ ...selectList, selected: e.target.value })
      setParams({ ...params, orderByDate: e.target.value })
    },
    [selectList, params]
  )

  const onChangeSearchInput = useCallback(
    (e) => {
      setParams({ ...params, pdfInfoCon: e.target.value })
    },
    [params]
  )

  const onPressSearchEnter = useCallback(
    (e) => {
      e.key === 'Enter' && onSearchList()
    },
    [params]
  )

  const onSearchList = useCallback(() => {
    getBundleProductList()
  }, [params])

  const getBundleInfo = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.BUNDLE_DETAIL,
      method: 'get',
      params: { bunInfId: id }
    }).then((response) => {
      if(response?.data?.code === '200'){
        setBundleInfo(response.data.data)

        //
        createHeaderSeo([
          {
            name : "og:title",
            content : response.data.data.pdfNm
          },
          {
            name : "og:description",
            content : response.data.data.pdfCon
          },
          {
            name : "og:url",
            content : window.location.href
          },
          {
            name : "og:image",
            // content : response.data.data.imgUrl
            content : window.location.origin+"/ibklogo.png"
          },
          {
            name : "twitter:title",
            content : response.data.data.pdfNm
          },
          {
            name : "twitter:description",
            content : response.data.data.pdfCon
          },
          {
            name : "twitter:image",
            // content : response.data.data.imgUrl
            content : window.location.origin+"/ibklogo.png"
          }
        ]);
      }
    })
  }, [])

  const getBundleProductList = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.BUNDLE_DETAIL_PRODUCT_LIST,
      method: 'get',
      params: params
    }).then((response) => {
      response?.data?.code === '200' && setBundleProductList(response.data.data.list)
    })
  }, [params])

  useEffect(() => {
    getBundleInfo()
    getBundleProductList()
  }, [])

  useEffect(() => {
    getBundleProductList()
  }, [params.orderByDate])

  return (
    /*wrap start*/
    <div className="product bind_product">
      {/*container start*/}
      <div className="container default_size">
        {/*gallery_wrap start*/}
        <div className="gallery_wrap">
          <img src={bundleInfo?.imgUrl} alt="" className="img" />
          <div className="gallery_content_wrap">
            <div className="brand_wrap">
              <img src={require('assets/images/ico_auth.png').default} alt="" />
              <p className="brand">{bundleInfo?.selrUsisName}</p>
            </div>
            <p className="title">{bundleInfo?.pdfNm}</p>
            <p className="content">{bundleInfo?.pdfCon}</p>
          </div>
        </div>
        {/*gallery_wrap end*/}

        {/*cnt_wrap start*/}
        <div className="product_container">
          <div className="section_header flex-btw-center bind_prod_header">
            <p className="total">
              총 <span className="highlight_blue">{bundleProductList?.length}</span>개 상품
            </p>

            {/* 필수 - 기능 추가 (검색, 필터링) */}
            <div className="section_right_wrap">
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
              <select className="select" value={selectList?.selected} onChange={onChangeListOrder} title={'selectList'}>
                {selectList.list.map((sel, idx) => (
                  <option value={sel.id} key={sel.id + idx}>
                    {sel.value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/*product_list start*/}
          <ul className="product_list">
            {bundleProductList?.map((product, index) => (
              <li className="product_item" key={'productList' + index}>
                <CardItem data={product} />
              </li>
            ))}
          </ul>
          {/*product_list end*/}
        </div>
        {/*cnt_wrap end*/}
      </div>
      {/*container end*/}
    </div>
    /*wrap end*/
  )
}

export default BindDetail
