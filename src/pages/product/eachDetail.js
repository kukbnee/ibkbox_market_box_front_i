import { useState, useEffect, useCallback, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import CardItem from 'components/product/detail/CardItem'
import ProductDetailInfo from 'components/product/detail/ProductDetailInfo'
import ProductQna from 'components/product/detail/ProductQna'
import ProductReview from 'components/product/ProductReview'
import ImgViewer from 'components/product/detail/ImgViewer'
import BasicInfo from 'components/product/detail/BasicInfo'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import Button from 'components/atomic/Button'
import Patent from 'components/product/detail/Patent'
import PathConstants from 'modules/constants/PathConstants'
import { UserContext } from 'modules/contexts/common/userContext'
import { addComma } from 'modules/utils/Common'
import moment from 'moment'
import { Swiper, SwiperSlide } from 'swiper/react'
import ProductDetailSlider02 from 'components/product/detail/ProductDetailSlider02'
import {createHeaderSeo} from "../../modules/utils/CustromSeo";

const EachDetail = () => {

  const { id } = useParams()
  const [productInfo, setProductInfo] = useState({})
  const [sellerInfo, setSellerInfo] = useState({})
  const [sellerHeader, setSellerHeader] = useState({})
  const [sellerMemberInfo, setSellerMemberInfo] = useState({})
  const [returnInfo, setReturnInfo] = useState({})
  const [relatedProductInfo, setRelatedProducInfo] = useState([])
  const [otherProductList, setOtherProductList] = useState([])
  const [imgList, setImgList] = useState([])
  const [videoList, setVideoList] = useState([])
  const [patentList, setPatentList] = useState([])
  const [omLinkList, setOmLinkList] = useState([])
  const [deliveryinfo, setDeliveryinfo] = useState([])
  const [deliveryCntInfoList, setDeliveryCntInfoList] = useState([])
  const [deliveryLocalInfoList, setDeliveryLocalInfoList] = useState([])

  const [tabList, setTabList] = useState({
    active: 'INFO',
    list: [
      { id: 'INFO', name: '상품정보' },
      { id: 'REVIEW', name: '리뷰' },
      { id: 'QNA', name: '상품문의' }
    ]
  })
  const userContext = useContext(UserContext)
  const tabScreenList = {
    INFO: (
      <ProductDetailInfo
        productInfo={productInfo}
        sellerInfo={sellerInfo}
        returnInfo={returnInfo}
        relatedProductInfo={relatedProductInfo}
        sellerMemberInfo={sellerMemberInfo}
        deliveryinfo={deliveryinfo}
      />
    ),
    REVIEW: <ProductReview />,
    QNA: <ProductQna productInfo={productInfo} />
  }

  const handleTab = (id) => { //상품정보/리뷰/문의 탭 전환
    setTabList({ ...tabList, active: id })
  }

  const handleLinkToSellerStore = () => { //판매자 상점으로 이동
    window.open(`${PathConstants.SELLER_STORE}/${productInfo?.selrUsisId}`, '_blank')
  }


  const getProductInfo = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.SINGLE_DETAIL,
      method: 'get',
      params: { pdfInfoId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setImgList([...response?.data?.data?.productFileList])
        setProductInfo(response?.data?.data?.productInfo)
        setOtherProductList(response?.data?.data?.sellerProductList)
        setSellerInfo(response?.data?.data?.sellerInfo)
        setReturnInfo(response?.data?.data?.productReturnInfo ?? {})
        setPatentList(response?.data?.data?.patentList)
        setRelatedProducInfo(response?.data?.data?.relatedProductList)
        setVideoList([...response.data.data.productVideoList])
        setSellerHeader(response?.data?.data?.sellerStoreHeader)
        setSellerMemberInfo(response?.data?.data?.sellerPageUserVO)
        setDeliveryinfo(response?.data?.data?.deliveryinfo)
        setDeliveryLocalInfoList(response?.data?.data?.deliveryLocalInfoList)
        setDeliveryCntInfoList(response?.data?.data?.deliveryCntInfoList)
        setOmLinkList([...response.data.data.productLinkList])

        //
        createHeaderSeo([
          {
            name : "og:title",
            content : response?.data?.data?.productInfo.pdfNm
          },
          {
            name : "og:description",
            content : response?.data?.data?.productInfo.brfDesc
          },
          {
            name : "og:url",
            content : window.location.href
          },
          {
            name : "og:image",
            // content : response?.data?.data?.productFileList[0].imgUrl
            content : window.location.origin+"/ibklogo.png"
          },
          {
            name : "twitter:title",
            content : response?.data?.data?.productInfo.pdfNm
          },
          {
            name : "twitter:description",
            content : response?.data?.data?.productInfo.brfDesc
          },
          {
            name : "twitter:image",
            // content : response?.data?.data?.productFileList[0].imgUrl
            content : window.location.origin+"/ibklogo.png"
          }
        ]);
      }
    })
  }, [id])

  const postProductViewCount = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.DETAIL_CLICK,
      method: 'post',
      data: { pdfInfoId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        return ''
      }
    })
  }, [])


  useEffect(() => {
    getProductInfo()
    postProductViewCount()
  }, [])


  return (
    <div className="product_detail">

      {/* 판매자 정보 */}
      <div className="product_company_wrap">
        {userContext?.state?.userInfo?.mmbrtypeId === 'SRS00004' || !userContext?.state?.userInfo?.mmbrtypeId ? (
            <></>
            ) : (
              <div className="product_company">
                <Button className="company_name" onClick={() => handleLinkToSellerStore()} style={{position: 'relative', zIndex: 1, cursor: 'pointer'}}>{sellerHeader?.bplcNm}</Button>
                <div className="info_list" style={{zIndex: 0}}>
                  <div className="info_item build">
                    <span className="text">설립 : {sellerHeader?.yearCnt ? sellerHeader?.yearCnt : ' - '}년차</span>
                  </div>
                  <div className="info_item venture">
                <span className="text">
                  {sellerHeader?.useEntrprsSe ? sellerHeader?.useEntrprsSe : `기업구분`} : {sellerHeader?.fondDe ? `${moment(sellerHeader?.fondDe).format('YYYY')}년` : ' - '}
                </span>
                  </div>
                  <div className="info_item trade">
                    <span className="text">수출입 : {sellerHeader?.imxprtSctnText ? sellerHeader?.imxprtSctnText : ' - '}</span>
                  </div>
                </div>
              </div>
            )
        }
      </div>

      <div className="section section01 padding-left-right01 mt-0">
        <div className="thumbnail_wrap">
          {/* 상품 이미지 */}
          <ImgViewer imgList={imgList} videoList={videoList} />

          {/* 상품 기본 정보 */}
          <BasicInfo
            productInfo={productInfo}
            setProduct={setProductInfo}
            onStore={handleLinkToSellerStore}
            sellerId={sellerInfo?.utlinsttId}
            deliveryinfo={deliveryinfo}
            deliveryCntInfoList={deliveryCntInfoList}
            deliveryLocalInfoList={deliveryLocalInfoList}
            sellerMemberInfo={sellerMemberInfo}
          />
        </div>
      </div>

      {/* 타사 구매 링크 */}
      {omLinkList?.length > 0 && (
        <div className="section section02 padding-left-right01 other_site">
          <p className="section_title">타 사이트 구매링크</p>
          <p className="info">다른 사이트에서도 해당 판매자의 상품을 구매 가능합니다&#46;</p>
          <div className="banner_wrap other_site">
            <ul className="thumb_list">
              <ProductDetailSlider02>
                {omLinkList?.map((market, index) => (
                    <SwiperSlide key={"link_"+index}>
                      <li className="thumb_item" key={'thumb_' + index}>
                        <Link className="thumb_item_link" to={{ pathname: market?.linkUrl }} target="_blank">
                          <p className="other_site_tit">{market?.linkTtl}</p>
                          <p className="other_site_url">{market?.linkUrl}</p>
                        </Link>
                      </li>
                    </SwiperSlide>
                ))}
              </ProductDetailSlider02>
            </ul>
          </div>
        </div>
      )}

      {/* 특허정보 */}
      {patentList.length > 0 ? <Patent patentList={patentList} /> : ''}

      {/* 판매자의 다른 상품들 */}
      {userContext?.state?.userInfo?.mmbrtypeId === 'SRS00004' || !userContext?.state?.userInfo?.mmbrtypeId ? (
        ''
      ) : (
        <div className="section section02 padding-left-right01">
          <p className="section_title">{productInfo?.selrUsisName}의 다른 상품들</p>
          <div className="other_product_wrap">
            <div className="other_product_list">
              {otherProductList
                .filter((_, index) => index < 3)
                .map((product, index) => (
                  <CardItem data={product} key={'other_prod_' + index} />
                ))}
              <div className="other_product_more">
                <div className="img_wrap">
                  <img src={sellerInfo?.logoImageFile} alt="" />
                </div>
                <p className="corp_info">같은 브랜드 상품을 한곳에서 모아볼 수 있어요&#33;</p>
                <p className="count">
                  총 <span className="cnt">{addComma(sellerInfo?.sellerProductTotalCnt)}</span>개
                </p>
                <Button className={'linear_blue link_more'} onClick={() => handleLinkToSellerStore()}>
                  브랜드샵 구경하러가기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상품 상세/리뷰/문의 */}
      <div className="section section03 padding-left-right01">
        <div className="tab_header center">
          <ul className="tab_header_list">
            {tabList?.list.map((tab) => (
              <li
                className={`tab_header_item ${tabList.active === tab.id ? 'active' : ''}`}
                key={tab.id}
                onClick={() => handleTab(tab.id)}
              >
                <span className="label">{tab.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={'tab_content_wrap'}>{tabScreenList?.[tabList.active]}</div>
      </div>
    </div>
  )
}

export default EachDetail
