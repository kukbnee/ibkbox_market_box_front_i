import { useCallback, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import moment from 'moment'
import Button from 'components/atomic/Button'
import Pagination from 'components/atomic/Pagination'
import NoResult from 'components/NoResult'
import CurrentStateItem from 'components/mypage/event/CurrentStateItem'
import PopupAlert from 'components/PopupAlert'

const Apply = (props) => {

  const history = useHistory()
  const { eventInfo, movePageEvent } = props
  const [pdfList, setPdfList] = useState({})
  const [popupAlert, setPopupAlert] = useState(false)
  const [params, setParams] = useState({
    page: 1,
    record: 10
  })

  const handlePopupAlert = useCallback((type) => {
    if (type === 'btnMsg') CancelEvent() //이벤트 신청 취소
    setPopupAlert(!popupAlert)
  }, [popupAlert])

  const handlePage = useCallback((page) => {
    setParams({ ...params, page: page })
  }, [params])

  const getProductList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_EVENT_STATE_PRODUCT_LIST,
      method: 'get',
      params: {
        ...params,
        evntInfId: eventInfo?.evntInfId,
        pcsnsttsId: '',
      }
    }).then((response) => {
      if (response?.data?.code === '200') setPdfList(response.data.data)
    })
  }, [eventInfo, params])

  const CancelEvent = useCallback(async () => {
    await Axios({
      url: API.EVENT.SELR_CANCEL,
      method: 'post',
      data: { evntInfId: eventInfo?.evntInfId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        handlePopupAlert('close')
        history.goBack()
      }
    })
  }, [eventInfo, popupAlert])

  useEffect(() => {
    getProductList()
  }, [eventInfo, params])

  return (
    <div className="product_container bind_list_container">
      <div className="event_apply_wrap">
        <div className="event_apply_alert">
          <p className="text">이벤트 신청이 완료되었습니다&#46;</p>
          {eventInfo?.receiptDate ? <p className="date">신청일시 : {moment(eventInfo.receiptDate).format('YYYY-MM-DD HH:mm')}</p> : null}
        </div>
        <div className="event_apply_inner">
          <div className="section_product_list">
            <div className="section_header">
              <div className="section_title">이벤트 신청 상품</div>
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
                  {pdfList?.list?.length < 1 ? (
                    <li className="table_row each_item_row">
                      <NoResult />
                    </li>
                  ) : (
                    pdfList?.list?.map((product, index) => (
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
              page={pdfList?.page}
              totalPages={pdfList.totalPage > 0 ? pdfList?.totalPage : 1}
              handlePagination={(page) => handlePage(page)}
            />
          </div>
        </div>
        <div className="go_event_view">
          <Button className="btn linear_blue" onClick={movePageEvent}>이벤트 화면으로 이동</Button>
          <Button className="btn linear_blue" onClick={() => handlePopupAlert('close')}>이벤트 신청 취소</Button>
        </div>
      </div>
      {popupAlert && (
        <PopupAlert
          className={'event_popup_wrap'}
          msg={'이벤트 신청을 취소하시겠습니까?'}
          btnMsg={'취소'}
          handlePopup={(type) => handlePopupAlert(type)}
        />
      )}
    </div>
  )
}

export default Apply
