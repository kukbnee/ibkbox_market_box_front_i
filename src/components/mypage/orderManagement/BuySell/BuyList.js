import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import moment from 'moment'
import BuyItem from 'components/mypage/orderManagement/BuySell/BuyItem'
import Search from 'components/mypage/orderManagement/BuySell/Search'
import PopupAlert from 'components/PopupAlert'
import PopupWithTitleAlert from 'components/PopupWithTitleAlert'
import { addComma } from 'modules/utils/Common'
import NoResult from 'components/NoResult'

const BuyList = (props) => {

  const { data, params, isLoading, setParams, setIsLoading, handleListRefresh } = props
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    type: null,
    class: 'popup_review_warning',
    title: null,
    msg: null,
    btnMsg: '확인'
  })
  const [paramsRecv, setParamsRecv] = useState({ //수령확인을 위한 params
    ordnInfoId: '',
    ordnPdfInfoSqn: ''
  })

  const handlePopupAlert = useCallback((btnType) => {
    if (popupAlert?.type === 'RECV' && btnType === 'btnMsg') postOrderReceiptCheck() //수령 완료 처리
    else if (popupAlert?.type === 'COMPLETE') handleListRefresh() //리스트 정보 업데이트

    setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: null, class: 'popup_review_warning', btnMsg: '확인' })
  }, [popupAlert, paramsRecv])

  const postOrderReceiptCheck = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ORDER_RECEIPT_CHECK,
      method: 'post',
      data: paramsRecv
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({ ...popupAlert, active: true, type: 'COMPLETE', class: 'popup_review_warning', msg: '수령완료 처리되었습니다.', btnMsg: '확인' })
        setParamsRecv({ //값 초기화
          ordnInfoId: '',
          ordnPdfInfoSqn: ''
        })
      } else if (response?.data?.code === '400' && response?.data?.message) {
        setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', class: 'popup_review_warning', msg: response.data.message })
      } else {
        setPopupAlert({ ...popupAlert, active: true, type: 'ALERT', class: 'popup_review_warning', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [popupAlert, paramsRecv])


  return (
    <>
      {(popupAlert?.active && popupAlert?.type === 'ALERT' || popupAlert?.active && popupAlert?.type === 'COMPLETE') && (
        <PopupAlert className={popupAlert.class} msg={popupAlert.msg} btnMsg={popupAlert.btnMsg} handlePopup={() => handlePopupAlert('close')} />
      )}
      {popupAlert?.active && popupAlert?.type === 'ADDRESS' && (
        <PopupWithTitleAlert className={popupAlert.class} title={popupAlert.title} msg={popupAlert.msg} btnMsg={popupAlert.btnMsg} handlePopup={() => handlePopupAlert('close')} />
      )}
      {popupAlert?.active && popupAlert?.type === 'RECV' && (
        <PopupAlert className={popupAlert.class} msg={popupAlert.msg} btnMsg={popupAlert.btnMsg} handlePopup={(btnType) => handlePopupAlert(btnType)} />
      )}

      <div className="card_content">
        <div className="search_filter_wrap">
          <Search
            params={params}
            setParams={setParams}
            handleSearch={handleListRefresh}
            setPopupAlert={setPopupAlert} />
        </div>
        <div className="list_wrap">
          {data?.list?.length > 0 ? (
            data.list.map((orderList, index) => (
              <div className="order_section_wrap" key={'buy_list_' + index}>
                <div className="section_header pc_version">
                  <div className="order_date_num_wrap">
                    <dl className="dl order_date">
                      <dt className="dt">주문일 &#58;</dt>
                      <dd className="dd">
                        &nbsp;<span className="date">{orderList?.rgsnTs ? moment(orderList?.rgsnTs).format('YYYY-MM-DD') : '-'}</span>
                      </dd>
                    </dl>
                    <dl className="dl order_num">
                      <dt className="dt">주문번호 &#58;</dt>
                      <dd className="dd">
                        &nbsp;<span className="num">{orderList?.cnttNoId}</span>
                      </dd>
                    </dl>
                  </div>
                  <div className="order_amount_view_wrap">
                    <dl className="dl order_amount">
                      <dt className="dt">총 주문금액 &#58;</dt>
                      <dd className="dd">
                        &nbsp;<span className="amount">{Number(orderList?.amt) > 0 ? addComma(Number(orderList.amt)) : 0}</span> 원
                      </dd>
                    </dl>
                    <Link
                      to={{ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_ORDER_DETAIL}/${orderList?.ordnInfoId}&buyer` }}
                      className="btn_detail_view">
                      주문상세보기
                    </Link>
                  </div>
                </div>
                <div className="section_header mobile_version">
                  <div className="order_wrap">
                    <div className="order_date_num_wrap">
                      <dl className="dl order_date">
                        <dt className="dt">주문일 &#58;</dt>
                        <dd className="dd">
                          &nbsp;<span className="date">{orderList?.rgsnTs ? moment(orderList?.rgsnTs).format('YYYY-MM-DD') : '-'}</span>
                        </dd>
                      </dl>
                      <dl className="dl order_num">
                        <dt className="dt">주문번호 &#58;</dt>
                        <dd className="dd">
                          &nbsp;<span className="num">{orderList?.cnttNoId}</span>
                        </dd>
                      </dl>
                    </div>
                    <Link
                      to={{ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_ORDER_DETAIL}/${orderList?.ordnInfoId}&buyer` }}
                      className="btn_detail_view">
                      주문상세보기
                    </Link>
                  </div>
                  <div className="order_amount_wrap">
                    <dl className="dl order_amount">
                      <dt className="dt">총 주문금액 &#58;</dt>
                      <dd className="dd">
                        &nbsp;<span className="amount">{Number(orderList?.amt) > 0 ? addComma(Number(orderList.amt)) : 0}</span> 원
                      </dd>
                    </dl>
                  </div>
                </div>
                <ul className="prod_list">
                  {orderList?.items?.map((item, index) => (
                    <li className="prod_item" key={'buyItemData_' + index}>
                      <BuyItem
                        data={item}
                        popupAlert={popupAlert}
                        setPopupAlert={setPopupAlert}
                        setParamsRecv={setParamsRecv}
                        setIsLoading={setIsLoading}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '구매내역이 없습니다.'} />
          )}
        </div>
      </div>
    </>
  )
}

export default BuyList
