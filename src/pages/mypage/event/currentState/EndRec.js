import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import moment from 'moment'
import Button from 'components/atomic/Button'
import Pagination from 'components/atomic/Pagination'
import NoResult from 'components/NoResult'
import CurrentStateItem from 'components/mypage/event/CurrentStateItem'

const EndRec = (props) => {

  const history = useHistory()
  const { eventInfo } = props
  const [selectedList, setSelectedList] = useState({})
  const [nonSelectedList, setNonSelectedList] = useState({})
  const [params, setParams] = useState({
    selectPage: 1,
    NonSelectPage: 1,
    record: 10
  })
  const titleList = {
    Y: '이벤트 선정 상품은 이벤트 페이지 상세에 노출됩니다.',
    N: '이벤트 신청에 선정되지 않았습니다.'
  }

  const handlePage = useCallback((type, page) => {
    setParams({ ...params, [type]: page })
  }, [params])

  const getSelectPdfList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_EVENT_STATE_PRODUCT_LIST,
      method: 'get',
      params: {
        ...params,
        evntInfId: eventInfo?.evntInfId,
        pcsnsttsId: 'ETS01002',
        page: params.selectPage
      }
    }).then((response) => {
      if (response?.data?.code === '200') setSelectedList(response.data.data)
    })
  }, [eventInfo, params])

  const getNonSelectPdfList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_EVENT_STATE_PRODUCT_LIST,
      method: 'get',
      params: {
        ...params,
        evntInfId: eventInfo?.evntInfId,
        pcsnsttsId: 'ETS01003',
        page: params.NonSelectPage
      }
    }).then((response) => {
      if (response?.data?.code === '200') setNonSelectedList(response.data.data)
    })
  }, [eventInfo, params])

  useEffect(() => {
    getSelectPdfList()
    getNonSelectPdfList()
  }, [eventInfo, params])

  return (
    <div className="product_container bind_list_container">
      <div className="event_apply_wrap">
        <div className="event_apply_alert">
          <p className="text">{titleList?.[eventInfo?.evntPickedState]}</p>
          {eventInfo?.receiptDate ? <p className="date">신청일시 : {moment(eventInfo.receiptDate).format('YYYY-MM-DD HH:mm')}</p> : null}
        </div>
        <div className="event_apply_inner">
          <div className="section_product_list">
            <div className="section_header">
              <div className="section_title">이벤트 선정 상품</div>
            </div>
            <div className="product_add_list">
              <div className="table_list_wrap each_list_wrap view">
                <div className="table_header bind_header">
                  <div className="cell cell_num">No</div>
                  <div className="cell cell_name">상품명</div>
                  <div className="cell cell_price">판매가</div>
                  <div className="cell cell_cate">분류</div>
                </div>
                <ul className="table_list each_list">
                  {selectedList?.list?.length < 1 ? (
                    <li className="table_row each_item_row">
                      <NoResult />
                    </li>
                  ) : (
                    selectedList?.list?.map((product, index) => (
                      <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                        <CurrentStateItem data={product} index={index} />
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
          <p className="etc_text blue">{`* 관리자 선정 태그가 있는 경우, 관리자가 이벤트 신청 여부와 상관없이 선정한 상품으로 진행중인 이벤트 상세페이지에 표시됩니다.`}</p>
          <div className="pagination_wrap">
            <Pagination
              page={selectedList?.page}
              totalPages={selectedList.totalPage > 0 ? selectedList?.totalPage : 1}
              handlePagination={(page) => handlePage('selectPage', page)}
            />
          </div>
        </div>
        <div className="event_apply_inner">
          <div className="section_product_list">
            <div className="section_header">
              <div className="section_title">이벤트 미선정 상품</div>
            </div>
            <div className="product_add_list">
              <div className="table_list_wrap each_list_wrap view">
                <div className="table_header bind_header">
                  <div className="cell cell_num">No</div>
                  <div className="cell cell_name">상품명</div>
                  <div className="cell cell_price">판매가</div>
                  <div className="cell cell_cate">분류</div>
                </div>
                <ul className="table_list each_list">
                  {nonSelectedList?.list?.length === 0 ? (
                    <li className="table_row each_item_row">
                      <NoResult />
                    </li>
                  ) : (
                    nonSelectedList?.list?.map((product, index) => (
                      <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                        <CurrentStateItem data={product} index={index} />
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="pagination_wrap">
            <Pagination
              page={nonSelectedList?.page}
              totalPages={nonSelectedList.totalPage > 0 ? nonSelectedList?.totalPage : 1}
              handlePagination={(page) => handlePage('selectPage', page)}
            />
          </div>
        </div>
        <div className="go_event_view">
          <Button className="btn linear_blue" onClick={() => history.goBack()}>이벤트 관리 화면으로 이동</Button>
        </div>
      </div>
    </div>
  )
}

export default EndRec
