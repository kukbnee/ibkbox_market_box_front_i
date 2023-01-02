import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import Checkbox from 'components/atomic/Checkbox'
import BuyerListItem from 'components/mypage/product/Management/BuyerListItem'
import NoResult from 'components/NoResult'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'
import Pagination from 'components/atomic/Pagination'

const ProdBuyerList = (props) => {
  const { remove, addProduct, getProductsCountInfo, count, setRemove } = props
  const history = useHistory()
  const [buyerList, setBuyerList] = useState([])
  const [checkAll, setCheckAll] = useState({ id: 'prod_buyer_item_', value: 'NO', status: false })
  const [checkList, setCheckList] = useState([])
  const [popup, setPopup] = useState(false)
  const [buyerPage, setBuyerPage] = useState({ //params로 직접 연결시 페이징하면서 no 바뀌는 문제가 있어 별도의 state로 관리
    page: 1,
    record: 10,
    totalPage: 1,
    total: 0
  })
  const [params, setParams] = useState({
    page: 1,
    record: 10,
    totalPage: 1,
    total: 0
  })

  const handleCheckboxAll = useCallback(() => {
    setBuyerList(
      buyerList.map((item) => {
        return { ...item, checked: !checkAll.status }
      })
    )
    setCheckAll({
      ...checkAll,
      status: !checkAll.status
    })
  }, [buyerList, checkAll])

  const handleCheckbox = useCallback(
    (id) => {
      setBuyerList(
        buyerList.map((item) => {
          return { ...item, checked: item.buyerInfId === id ? !item.checked : item.checked }
        })
      )
    },
    [buyerList]
  )

  const handlePopup = useCallback(() => {
    setPopup(false)
    setRemove({ target: '' })
  }, [remove, popup, checkList])

  const deleteBuyer = useCallback(() => {
    postDeleteBuyer()
  }, [remove, popup, checkList])

  const handlePagination = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])

  const getBuyerList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BUYER_PRODUCT_LIST,
      method: 'get',
      params: { page: params.page }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setBuyerList(response.data.data.list)
        setParams({ ...params, totalPage: response.data.data.totalPage, total: response.data.data.total })
        setBuyerPage({ 
          ...buyerPage,
          totalPage: response.data.data.totalPage,
          total: response.data.data.total,
          page: response.data.data.page,
        })
      }
    })
  }, [params, buyerPage])

  const postDeleteBuyer = useCallback(async () => { //다수삭제
    await Axios({
      url: API.MYPAGE.MY_BUYER_PRODUCT_DELETE,
      method: 'post',
      data: checkList
    }).then((response) => {
      if (response?.data?.code === '200') {
        setCheckList([])
        handlePopup()
        getProductsCountInfo()
        getBuyerList()
      }
    })
  }, [remove, popup, checkList])

  useEffect(() => {
    if (remove.target === 'buyer') {
      if (checkList?.length > 0) setPopup(true)
      else setRemove({ target: '' })
    }
  }, [remove, popup, checkList])

  useEffect(() => {
    addProduct.target === 'buyer' && history.push(PathConstants.MY_PAGE_PRODUCT_BUYER_WRITE)
  }, [addProduct])

  useEffect(() => {
      getBuyerList()
  }, [params.page])

  // 체크 수에 따라 전체체크 여부 확인
  useEffect(() => {
    let checkedCnt = 0
    let newList = []
    buyerList?.map((item) => {
      if (item.checked) {
        checkedCnt = checkedCnt + 1
        newList.push(item)
      }
    })
    setCheckList(newList)
    if (checkedCnt > 0 && checkedCnt === buyerList?.length) setCheckAll({ ...checkAll, status: true })
    else setCheckAll({ ...checkAll, status: false })
  }, [buyerList])

  return (
    <>
      <div className="table_list_wrap buyer_list_wrap">
        <div className="table_header buyer_header">
          <div className="cell cell_num">
            <Checkbox
              className={'type02'}
              id={`prod_buyer_item_all`}
              label={'No'}
              onChange={() => handleCheckboxAll()}
              checked={checkAll.status}
            />
          </div>
          <div className="cell cell_bind">바이어 상품명</div>
          <div className="cell cell_cnt">상품수</div>
          <div className="cell cell_url">동적URL</div>
          <div className="cell cell_date">등록일</div>
        </div>
        <ul className="table_list buyer_list">
          {buyerList.length !== 0 ? (
            buyerList?.map((product, index) => (
              <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                <BuyerListItem 
                  data={product}
                  index={index}
                  handleCheckbox={(id) => handleCheckbox(id)}
                  getProductsCountInfo={getProductsCountInfo}
                  getBuyerList={getBuyerList}
                  pageInfo={buyerPage}
                />
              </li>
            ))
          ) : (
            <li className="table_row each_item_row no_result_wrap">
              <NoResult msg={count > 0 ? '상품 정보를 불러오는 중입니다.' : '등록된 상품이 없습니다.'} />
            </li>
          )}
        </ul>
      </div>

      {/* 페이징 */}
      {buyerPage?.totalPage > 0 && (
        <div className="pagination_wrap">
          <Pagination
            page={buyerPage?.page}
            totalPages={buyerPage?.totalPage}
            handlePagination={(page) => handlePagination(page)}
          />
        </div>
      )}

      {/* 상품 삭제 확인 alert */}
      {popup && (
        <PopupCustom handlePopup={handlePopup} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              선택하신 <b className="highlight_blue">바이어상품</b>을 <br />
              정말로 삭제하시겠습니까?
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={deleteBuyer}>
                삭제
              </Button>
            </div>
            <p className="etc_text">* 바이어상품에 포함된 개별상품은 삭제되지 않습니다.</p>
          </div>
        </PopupCustom>
      )}
    </>
  )
}

export default ProdBuyerList
