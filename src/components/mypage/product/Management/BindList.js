import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import Checkbox from 'components/atomic/Checkbox'
import BindListItem from 'components/mypage/product/Management/BindListItem'
import NoResult from 'components/NoResult'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'
import Pagination from 'components/atomic/Pagination'

const ProdBindList = (props) => {
  const { remove, addProduct, getProductsCountInfo, count, setRemove } = props
  const history = useHistory()
  const [bundleList, setBundleList] = useState([])
  const [checkAll, setCheckAll] = useState({ id: 'prod_bundle_item_', value: 'NO', status: false })
  const [checkList, setCheckList] = useState([])
  const [popup, setPopup] = useState(false)
  const [bundlePage, setBundlePage] = useState({ //params로 직접 연결시 페이징하면서 no 바뀌는 문제가 있어 별도의 state로 관리
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
    setBundleList(
      bundleList.map((item) => {
        return { ...item, checked: !checkAll.status }
      })
    )
    setCheckAll({
      ...checkAll,
      status: !checkAll.status
    })
  }, [bundleList, checkAll])

  const handleCheckbox = useCallback(
    (id) => {
      setBundleList(
        bundleList.map((item) => {
          return { ...item, checked: item.bunInfId === id ? !item.checked : item.checked }
        })
      )
    },
    [bundleList]
  )

  const handlePopup = useCallback(() => {
    setPopup(false)
    setRemove({ target: '' })
  }, [remove, popup, checkList])

  const deleteBundle = useCallback(() => {
    postDeleteBind()
  }, [remove, popup, checkList])

  const handlePagination = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])

  const getBundleList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_BUNDLE_PRODUCT_LIST,
      method: 'get',
      params: { page: params.page }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setBundleList(response.data.data.list)
        setParams({ ...params, totalPage: response.data.data.totalPage, total: response.data.data.total })
        setBundlePage({
          ...bundlePage,
          totalPage: response.data.data.totalPage,
          total: response.data.data.total,
          page: response.data.data.page,
        })
      }
    })
  }, [params, bundlePage])

  const postDeleteBind = useCallback(async () => { //다수삭제
    await Axios({
      url: API.MYPAGE.MY_BUNDLE_PRODUCT_DELETE,
      method: 'post',
      data: checkList
    }).then((response) => {
      if (response?.data?.code === '200') {
        setCheckList([])
        handlePopup()
        getProductsCountInfo()
        getBundleList()
      }
    })
  }, [remove, popup, checkList])

  useEffect(() => {
    if (remove.target === 'bind') {
      if (checkList?.length > 0) setPopup(true)
      else setRemove({ target: '' })
    }
  }, [remove, popup, checkList])

  useEffect(() => {
    addProduct.target === 'bind' && history.push(PathConstants.MY_PAGE_PRODUCT_BIND_WRITE)
  }, [addProduct])

  useEffect(() => {
    getBundleList()
  }, [params.page])

  // 체크 수에 따라 전체체크 여부 확인
  useEffect(() => {
    let checkedCnt = 0
    let newList = []
    bundleList?.map((item) => {
      if (item.checked) {
        checkedCnt = checkedCnt + 1
        newList.push(item)
      }
    })
    setCheckList(newList)
    if (checkedCnt > 0 && checkedCnt === bundleList?.length) setCheckAll({ ...checkAll, status: true })
    else setCheckAll({ ...checkAll, status: false })
  }, [bundleList])


  return (
    <>
      <div className={`table_list_wrap bind_list_wrap`}>
        <div className="table_header bind_header">
          <div className="cell cell_num">
            <Checkbox
              className={'type02'}
              id={`prod_bundle_item_all`}
              label={'No'}
              onChange={() => handleCheckboxAll()}
              checked={checkAll.status}
            />
          </div>
          <div className="cell cell_bind">묶음명</div>
          <div className="cell cell_cnt">상품수</div>
          <div className="cell cell_cate">분류</div>
          <div className="cell cell_date">등록일</div>
        </div>
        <ul className="table_list bind_list">
          {bundleList.length !== 0 ? (
            bundleList?.map((bindProd, index) => (
              <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                <BindListItem
                  data={bindProd}
                  index={index}
                  handleCheckbox={(id) => handleCheckbox(id)}
                  getProductsCountInfo={getProductsCountInfo}
                  getBundleList={getBundleList}
                  pageInfo={bundlePage}
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
      {bundlePage?.totalPage > 0 && (
        <div className="pagination_wrap">
          <Pagination
            page={bundlePage?.page}
            totalPages={bundlePage?.totalPage}
            handlePagination={(page) => handlePagination(page)}
          />
        </div>
      )}

      {/* 상품 삭제 확인 alert */}
      {popup && (
        <PopupCustom handlePopup={handlePopup} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              선택하신 <b className="highlight_blue">묶음상품</b>을 <br />
              정말로 삭제하시겠습니까?
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={deleteBundle}>
                삭제
              </Button>
            </div>
            <p className="info">묶음상품에 포함된 개별상품은 삭제되지 않습니다.</p>
          </div>
        </PopupCustom>
      )}
    </>
  )
}

export default ProdBindList
