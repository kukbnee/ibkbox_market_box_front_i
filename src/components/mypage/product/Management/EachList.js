import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import EachItem from 'components/mypage/product/Management/EachListItem'
import Checkbox from 'components/atomic/Checkbox'
import NoResult from 'components/NoResult'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'
import Pagination from 'components/atomic/Pagination'

const EachList = (props) => {
  const { remove, addProduct, getProductsCountInfo, setRemove, count, orderByFlg } = props
  const history = useHistory()
  const [productList, setProductList] = useState([])
  const [checkAll, setCheckAll] = useState({ id: 'prod_each_item_all', value: 'NO', status: false })
  const [checkList, setCheckList] = useState([])
  const [popup, setPopup] = useState(false)
  const [eachPage, setEachPage] = useState({ //params로 직접 연결시 페이징하면서 no 바뀌는 문제가 있어 별도의 state로 관리
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
    setProductList(
      productList.map((item) => {
        return { ...item, checked: !checkAll.status }
      })
    )
    setCheckAll({
      ...checkAll,
      status: !checkAll.status
    })
  }, [productList, checkAll])

  const handleCheckbox = useCallback(
    (id) => {
      setProductList(
        productList.map((item) => {
          return { ...item, checked: item.pdfInfoId === id ? !item.checked : item.checked }
        })
      )
    },
    [productList]
  )

  const handlePopup = useCallback(() => {
    setPopup(false)
    setRemove({ target: '' })
  }, [remove, popup, checkList])

  const deleteProduct = useCallback(() => {
    postDeleteProduct()
  }, [remove, popup, checkList])

  const handlePagination = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])

  const getProductList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_SINGLE_PRODUCT_LIST,
      method: 'get',
      params: {
        orderByFlg: orderByFlg,
        page: params.page
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setProductList(response.data.data.list)
        setParams({ ...params, totalPage: response.data.data.totalPage, total: response.data.data.total })
        setEachPage({ 
          ...eachPage,
          totalPage: response.data.data.totalPage,
          total: response.data.data.total,
          page: response.data.data.page,
        })
      }
    })
  }, [orderByFlg, params, eachPage])

  const postDeleteProduct = useCallback(async () => { //다수삭제
    await Axios({
      url: API.MYPAGE.MY_SINGLE_PRODUCT_DELETE,
      method: 'post',
      data: checkList
    }).then((response) => {
      if (response?.data?.code === '200') {
        setCheckList([])
        handlePopup()
        getProductsCountInfo()
        getProductList()
      }
    })
  }, [remove, popup, checkList])

  useEffect(() => {
    if (remove.target === 'each') {
      if (checkList?.length > 0) setPopup(true)
      else setRemove({ target: '' })
    }
  }, [remove, popup, checkList])

  useEffect(() => {
    addProduct.target === 'each' && history.push(PathConstants.MY_PAGE_PRODUCT_EACH_WRITE)
  }, [addProduct])

  useEffect(() => {
    getProductList()
  }, [orderByFlg, params.page])

  useEffect(() => {
    let checkedCnt = 0
    let newList = []
    productList?.map((item) => {
      if (item.checked) {
        checkedCnt = checkedCnt + 1
        newList.push(item)
      }
    })
    setCheckList(newList)
    if (checkedCnt === productList?.length) setCheckAll({ ...checkAll, status: true })
    else setCheckAll({ ...checkAll, status: false })
  }, [productList])

  return (
    <div className="table_list_wrap each_list_wrap">
      <div className="table_header each_header">
        <div className="cell cell_num">
          <Checkbox
            className={'type02'}
            id={`prod_each_item_all`}
            label={'No'}
            onChange={() => handleCheckboxAll()}
            checked={checkAll.status}
          />
        </div>
        <div className="cell cell_name">상품명</div>
        <div className="cell cell_price">판매가&#47;상태</div>
        <div className="cell cell_cate">분류</div>
        <div className="cell cell_stock">최소구매</div>
        <div className="cell cell_date">등록일</div>
      </div>
      <ul className="table_list each_list">
        {productList.length !== 0 ? (
          <>
            {productList?.map((product, idx) => (
              <li className="table_row each_item_row" key={'each_prod_item_' + idx}>
                <EachItem
                  data={product}
                  index={idx}
                  handleCheckbox={(id) => handleCheckbox(id)}
                  getProductList={getProductList}
                  getProductsCountInfo={getProductsCountInfo}
                  pageInfo={eachPage}
                />
              </li>
            ))}
          </>
        ) : (
          <li className="table_row each_item_row no_result_wrap">
            <NoResult msg={count > 0 ? '상품 정보를 불러오는 중입니다.' : '등록된 상품이 없습니다.'} />
          </li>
        )}
      </ul>

      {/* 페이징 */}
      {eachPage?.totalPage > 0 && (
        <div className="pagination_wrap">
          <Pagination
            page={eachPage?.page}
            totalPages={eachPage?.totalPage}
            handlePagination={(page) => handlePagination(page)}
          />
        </div>
      )}

      {/* 상품 삭제 확인 alert */}
      {popup && (
        <PopupCustom handlePopup={handlePopup} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              선택하신 <b className="highlight_blue">개별상품</b>을 <br />
              정말로 삭제하시겠습니까?
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={deleteProduct}>
                삭제
              </Button>
            </div>
          </div>
        </PopupCustom>
      )}
    </div>
  )
}

export default EachList
