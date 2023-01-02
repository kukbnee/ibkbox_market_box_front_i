import { useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CardItem from 'components/product/CardItem'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import moment from 'moment'
import {createHeaderSeo} from "../../modules/utils/CustromSeo";

const BuyerLetter = () => {

  const { id } = useParams()
  const [buyerInfo, setBuyerInfo] = useState([])
  const [productList, setProductList] = useState([])

  const getBuyerInfo = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BUYER_PRODUCT_DETAIL,
      method: 'get',
      params: { 
        buyerInfId: id,
        buyerFlg: '' //비로그인도 가능
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setBuyerInfo(response.data.data.buyerProductInfo)
        setProductList(response.data.data.buyerProductList)

        //
        createHeaderSeo([
          {
            name : "og:title",
            content : response.data.data.buyerProductInfo.ttl
          },
          {
            name : "og:description",
            content : response.data.data.buyerProductInfo.con
          },
          {
            name : "og:url",
            content : window.location.href
          },
          {
            name : "og:image",
            content : response.data.data.buyerProductInfo.imgUrl
          },
          {
            name : "twitter:title",
            content : response.data.data.buyerProductInfo.ttl
          },
          {
            name : "twitter:description",
            content : response.data.data.buyerProductInfo.con
          },
          {
            name : "twitter:image",
            content : response.data.data.buyerProductInfo.imgUrl
          }
        ]);
      }
    })
  }, [])

  useEffect(() => {
    getBuyerInfo()
  }, [])
  

  return (
    <div className="wrap buyer_letter_view default_size">
      <div className="letter_view_container">
        <div className="letter_view_wrap">
          <div className="letter_view">
            <div className="letter_header">
              <div className="header_top">
                <div className="email">
                  <div className="email_wrap">
                    <p className="title">from</p>
                    <p className="address">{buyerInfo?.senEml}</p>
                  </div>
                  <div className="email_wrap">
                    <p className="title">to</p>
                    <p className="address">{buyerInfo?.recEml}</p>
                  </div>
                </div>
                <p className="date">{buyerInfo?.rgsnTs ? moment(buyerInfo.rgsnTs).format('YYYY-MM-DD') : null}</p>
              </div>
              <div className="header_bot">
                <div className="img_wrap">
                  {buyerInfo?.imgUrl && (<img src={buyerInfo.imgUrl} alt={`${buyerInfo?.selrUsisNm}'s logo`} />)}
                </div>
              </div>
            </div>
            <div className="letter_board_wrap">
              <h2 className="title">{buyerInfo?.ttl}</h2>
              <div className="letter_board">{buyerInfo?.con}</div>
            </div>
            <div className="product_list_wrap">
              <p className="title">
                {buyerInfo?.selrUsisNm} Products <span>({productList?.length ?? 0})</span>
              </p>
              <ul className="product_list">
                {productList?.map((product, index) => (
                  <li className="product_item" key={'productList' + index}>
                    <CardItem data={product} buyerLatter={true} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="letter_footer">
              <p>&copy; {moment(buyerInfo?.amnnTs ? buyerInfo?.amnnTs : buyerInfo?.rgsnTs).format('YYYY')} {buyerInfo?.selrUsisNm} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyerLetter
