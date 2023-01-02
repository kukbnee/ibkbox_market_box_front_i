import { useState, useEffect } from 'react'
import Button from 'components/atomic/Button'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import BundleItem from 'components/product/BundleItem'
import NoResult from 'components/NoResult'

const BundleList = (props) => {
  const { selrUsisId, searchForm, setSearchForm, setTotal } = props
  const [bundleList, setBundleList] = useState([])
  const [page, setPage] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const getBundleList = async () => {
    setIsLoading(true)
    await Axios({
      url: API.PRODUCT.SELLER_BUNDLE_LIST,
      method: 'post',
      data: { selrUsisId: selrUsisId, ...searchForm }
    }).then((response) => {
      if (response?.data?.code === '200') {
        if (response.data.data.page > 1) setBundleList([...bundleList, ...response?.data?.data.list])
        else if (response.data.data.page === 1) setBundleList([...response?.data?.data.list])
        setPage(response.data.data)
        setTotal(response.data.data.total)
      }
      setIsLoading(false)
    })
  }

  const onClickMore = () => {
    setSearchForm({ ...searchForm, page: searchForm.page + 1 })
  }

  useEffect(() => {
    getBundleList()
  }, [searchForm])

  return (
    <>
      <div className="bundle_product">
        <div className="combine_wrap">
          {bundleList.length > 0 ? (
            bundleList?.map((bundle, index) => (
              <BundleItem key={'d.content_' + index} data={bundle} handleRefreshList={() => getBundleList()} />
            ))
          ) : (<NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '데이터가 없습니다.'} />)}
        </div>
      </div>
      {page.page !== page.totalPage && page.totalPage > 0 && (
        <Button className={'btn full_blue'} onClick={onClickMore}>
          더보기
        </Button>
      )}
    </>
  )
}
export default BundleList
