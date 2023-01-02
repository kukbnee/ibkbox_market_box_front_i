import { useEffect, useState, useCallback, useContext } from 'react'
import EntryPoint from 'pages/mypage/product/entryPoint'
import Management from 'pages/mypage/product/Management'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { UserContext } from 'modules/contexts/common/userContext'
import BreadCrumbs from 'components/BreadCrumbs'

const Product = (props) => {
  const userContext = useContext(UserContext)
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(false)
  
  const getProductList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_SINGLE_PRODUCT_LIST,
      method: 'get',
      params: {
        page: 1,
        record: 10,
        orderByFlg: '0'
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setProductList(response.data.data.list)
        setLoading(true)
      }
    })
  }, [])

  useEffect(() => {
    getProductList()
  }, [])

  return (
    <div className="mypage product main">
      {loading ? (
        <>{productList.length === 0 ? <EntryPoint {...props} /> : <Management {...props} />}</>
      ) : (
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <h2 className="page_title">상품관리</h2>
          </div>
        </div>
      )}
    </div>
  )
}

export default Product
