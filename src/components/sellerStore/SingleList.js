import { useState, useEffect } from 'react'
import Button from 'components/atomic/Button'
import CardItem from 'components/product/CardItem'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import NoResult from 'components/NoResult'

const SingleList = (props) => {
  const { selrUsisId, searchForm, setSearchForm, setTotal } = props
  const [singleList, setSingleList] = useState([])
  const [page, setPage] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const getSingleList = async () => {
    setIsLoading(true)
    await Axios({
      url: API.PRODUCT.SELLER_SINGLE_LIST,
      method: 'post',
      data: { selrUsisId: selrUsisId, ...searchForm }
    }).then((response) => {
      if (response?.data?.code === '200') {
        if (response.data.data.page > 1) setSingleList([...singleList, ...response?.data?.data.list])
        else if (response.data.data.page === 1) setSingleList([...response?.data?.data.list])
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
    getSingleList()
  }, [searchForm])

  return (
    <>
      <div className="indivisual_product">
        <div className="card_wrap">
          {singleList.length > 0 ? (
            singleList?.map((single, index) => (
              <CardItem data={single} key={'d.content_' + index} />
            ))
          ) : ( <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '데이터가 없습니다.'} /> )}
        </div>
      </div>
      {page.page < page.totalPage && (
        <Button className={'btn full_blue'} onClick={onClickMore}>
          더보기
        </Button>
      )}
    </>
  )
}
export default SingleList
