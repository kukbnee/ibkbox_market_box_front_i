import { useState, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import Button from 'components/atomic/Button'
import SellItem from 'components/mypage/orderManagement/BuySell/SellItem'
import PopupAlert from 'components/PopupAlert'
import PopupWithTitleAlert from 'components/PopupWithTitleAlert'
import DeliveryInfoInput from 'components/mypage/orderManagement/BuySell/DeliveryInfoInput'
import DeliveryNumInput from 'components/mypage/orderManagement/BuySell/DeliveryNumInput'
import PopupCargoList from 'components/mypage/estimation/PopupCargoList'
import NoResult from 'components/NoResult'

const SellList = (props) => {
  const { data, params, isLoading, setParams, handleListRefresh } = props
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    type: null,
    class: 'popup_review_warning',
    title: null,
    msg: null,
    btnMsg: '확인'
  })
  const [popupDvry, setPopupDvry] = useState({
    active: false,
    type: null
  })
  const [filterType, setFilterType] = useState({
    active: '',
    list: [
      { id: '', value: '전체' },
      { id: 'ODS00001', value: '주문완료' },
      { id: 'ODS00002', value: '주문취소 승인' },
      { id: 'ODS00008', value: '주문취소 완료' },
      { id: 'ODS00003', value: '배송중' },
      { id: 'ODS00004', value: '배송완료' },
      { id: 'ODS00005', value: '반품요청' },
      { id: 'ODS00006', value: '반품불가' },
      { id: 'ODS00007', value: '반품완료' },
    ]
  })
  const [paramsDvry, setParamsDvry] = useState({
    pcsvcmpPtrnId: '', //택배회사 코드
    pcsvcmpNm: '', //택배회사(기타)일  경우 직접 입력
    mainnbNo: '', //운송장번호
    ordnInfoId: '',
    ordnPdfInfoSqn: 0,
    pdfInfoId: null,
  })
  const [cargoList, setCargoList] = useState({})

  const handleFilter = useCallback(
    (e) => {
      setFilterType({ ...filterType, active: e.target.value })
      setParams({ ...params, page: 1, ordnSttsId: e.target.value })
    },
    [filterType, params]
  )

  const handlePopupAlert = useCallback(() => {
    if (popupAlert?.type === 'complete') {
      handleListRefresh() //기능 완료 팝업이면 리스트 다시 부르기
      setParamsDvry({ //기능 완료 팝업이면 dvry state 초기화
        pcsvcmpPtrnId: '',
        pcsvcmpNm: '',
        mainnbNo: '',
        ordnInfoId: '',
        ordnPdfInfoSqn: 0,
        pdfInfoId: null
      })
    }
    setPopupAlert({ //alert 팝업 state 초기화
      ...popupAlert,
      active: !popupAlert.active,
      type: null,
      class: 'popup_review_warning',
      btnMsg: '확인'
    })
  }, [popupAlert])

  const handlePopupDvry = useCallback(() => { //운송장입력/화물서비스 선택 팝업 닫기
    setPopupDvry({ active: false, type: null })
  }, [popupDvry])

  const handlePopupDvryInfo = useCallback((type) => { //운송장입력/화물서비스 선택 팝업
    switch (type) {
      case 'inputInvoice': //운송장입력
        setPopupDvry({ ...popupDvry, active: true, type: 'inputInvoice' })
        break
      case 'selectCargo': //화물서비스 선택
        getDvryCargoList()
        break
      case 'close':
        handlePopupDvry()
        break
    }
  }, [paramsDvry, popupDvry])

  const handlePopupAlertDvryInvoice = useCallback((type) => { //운송장번호 입력 팝업
    switch (type) {
      case 'save':
        if (paramsDvry.pcsvcmpPtrnId != '' && paramsDvry.mainnbNo != '') postDvryInvoiceUpdate()
        else setPopupAlert({ ...popupAlert, active: true, type: 'alert', msg: '택배회사와 송장번호를 재확인 해주세요.' })
        break
      case 'close':
        handlePopupDvry()
        setParamsDvry({ //입력한 운송장번호 초기화
          pcsvcmpPtrnId: '',
          pcsvcmpNm: '',
          mainnbNo: '',
          ordnInfoId: '',
          ordnPdfInfoSqn: 0,
          pdfInfoId: null
        })
        break
    }
  }, [paramsDvry, popupAlert, popupDvry])

  const handlePopupAlertDvryCargo = useCallback((type, cargoData) => { //화물서비스 선택 팝업
    switch (type) {
      case 'save':
        postDvryCargoRequest(cargoData)
        break
      case 'close':
        handlePopupDvry()
        break
    }
  }, [paramsDvry, popupDvry])

  const postDvryInvoiceUpdate = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ORDER_DVRY_INVOICE_UPDATE,
      method: 'post',
      data: paramsDvry
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({ ...popupAlert, active: true, type: 'complete', msg: '배송정보가 입력되었습니다.' })
        handlePopupDvry()
      } else if (response?.data?.code === '400' && response?.data?.message != null) {
        setPopupAlert({ ...popupAlert, active: true, type: 'alert', msg: response.data.message })
      } else {
        setPopupAlert({ ...popupAlert, active: true, type: 'alert', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [paramsDvry, popupAlert, paramsDvry])

  const getDvryCargoList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ORDER_DVRY_CARGO_LIST,
      method: 'get',
      params: paramsDvry
    }).then((response) => {
      if (response?.data?.code === '200') {
        setCargoList(response?.data?.data?.list[0])
        setPopupDvry({ active: true, type: 'selectCargo' })
      } else if (response?.data?.code === '400' && response?.data?.message != null) {
        setPopupAlert({ ...popupAlert, active: true, type: 'alert', msg: response.data.message })
      } else {
        setPopupAlert({ ...popupAlert, active: true, type: 'alert', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [paramsDvry, popupAlert, popupDvry])

  const postDvryCargoRequest = useCallback(async (cargoData) => {
    await Axios({
      url: API.MYPAGE.MY_ORDER_DVRY_CARGO_REQUEST,
      method: 'post',
      data: {
        ...cargoData,
        ordnInfoId: paramsDvry?.ordnInfoId,
        ordnPdfInfoSqn: paramsDvry?.ordnPdfInfoSqn
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setPopupAlert({
          ...popupAlert,
          active: true,
          type: 'complete',
          msg: '해당 운송업체에 배송요청이 완료되었습니다.\n배송비는 상품 픽업시 결제 부탁드립니다.'
        })
        handlePopupDvry()
      } else if (response?.data?.code === '400' && response?.data?.message != null) {
        setPopupAlert({ ...popupAlert, active: true, type: 'alert', msg: response.data.message })
      } else {
        setPopupAlert({ ...popupAlert, active: true, type: 'alert', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.' })
      }
    })
  }, [paramsDvry, popupAlert, popupDvry])

  return (
    <>
      {popupDvry?.active && popupDvry?.type === 'dvryInfo' && ( //운송장번호 입력/화물서비스 선택 팝업
        <DeliveryInfoInput
          pdfInfoId={paramsDvry?.pdfInfoId}
          handlePopup={(type) => handlePopupDvryInfo(type)}
        />
      )}
      {popupDvry?.active && popupDvry?.type === 'inputInvoice' && ( //운송장번호 입력 팝업
        <DeliveryNumInput
          paramsDvry={paramsDvry}
          setParamsDvry={setParamsDvry}
          handlePopup={(type) => handlePopupAlertDvryInvoice(type)}
        />
      )}
      {popupDvry?.active && popupDvry?.type === 'selectCargo' && ( //화물서비스 업체 선택 팝업
        <PopupCargoList
          type={'estimation'}
          cargoData={cargoList}
          closePopup={() => handlePopupAlertDvryCargo('close')}
          handleSelectCargoEnt={(cargo) => handlePopupAlertDvryCargo('save', cargo)}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'address' && ( //주소 확인 팝업
        <PopupWithTitleAlert
          className={popupAlert.class}
          title={popupAlert.title}
          msg={popupAlert.msg}
          btnMsg={popupAlert.btnMsg}
          handlePopup={handlePopupAlert}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'alert' && ( //alert 팝업
        <PopupAlert
          className={popupAlert.class}
          msg={popupAlert.msg}
          btnMsg={popupAlert.btnMsg}
          handlePopup={handlePopupAlert}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'complete' && ( //complete 팝업
        <PopupAlert
          className={popupAlert.class}
          msg={popupAlert.msg}
          btnMsg={popupAlert.btnMsg}
          handlePopup={handlePopupAlert}
        />
      )}

      <div className="card_content">
        <div className="select_filter_wrap">
          <select className={'select'} onChange={handleFilter} value={filterType?.active} title={'filterType'}>
            {filterType.list.map((status, idx) => (
              <option key={status.id + idx} value={status.id}>
                {status.value}
              </option>
            ))}
          </select>
          <span className="etc_text blue">
            &#42;직접배송한 경우&#44; 배송정보를 입력해야 구매자가 배송상태를 알 수 있습니다&#46;
          </span>
        </div>
        <div className="table_list_wrap type02 ">
          <div className="pc_version">
            <table className="table">
              <thead>
                <tr className="item_section">
                  <th className="cell cell_header num">No</th>
                  <th className="cell cell_header order_num">주문번호</th>
                  <th className="cell cell_header product">상품명</th>
                  <th className="cell cell_header delivery_type">배송유형</th>
                  <th className="cell cell_header payment_amount">총 결제금액</th>
                  <th className="cell cell_header buyer_name">구매자명</th>
                  <th className="cell cell_header estimate">견적</th>
                  <th className="cell cell_header status">상태</th>
                </tr>
              </thead>
              {data?.list?.length > 0 ? (
                data.list.map((orderList, orderIndex) => (
                  <tbody key={'sell_list_' + orderIndex}>
                    {orderList?.items?.map((item, index) => (
                      <tr className="item_section" key={index}>
                        {index === 0 && (
                          <>
                            <td className="cell cell_value num" rowSpan={orderList.items.length}>
                              <div className="inner_wrap">
                                <p className="number">{data?.total - orderIndex}</p>
                              </div>
                            </td>
                            <td className="cell cell_value order_num" rowSpan={orderList.items.length}>
                              <div className="inner_wrap">
                                <Link
                                  to={{ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_ORDER_DETAIL}/${orderList?.ordnInfoId}&selr` }}
                                  className="order_detail"
                                >
                                  주문상세
                                </Link>
                                <p className="order_number">{orderList.cnttNoId}</p>
                              </div>
                            </td>
                          </>
                        )}
                        <SellItem
                          type={'pc'}
                          key={'sellItemData_' + index}
                          data={item}
                          index={index}
                          popupAlert={popupAlert}
                          popupDvry={popupDvry}
                          paramsDvry={paramsDvry}
                          setPopupAlert={setPopupAlert}
                          setPopupDvry={setPopupDvry}
                          setParamsDvry={setParamsDvry}
                        />
                      </tr>
                    ))}
                  </tbody>
                ))
              ) : (
                <tbody>
                  <tr className="item_section">
                    <td className="cell cell_value no_result_wrap" colSpan="8">
                      <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '판매내역이 없습니다.'} />
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
          <div className="mobile_version">
            {data?.list?.length > 0 ? (
              data.list.map((orderList, index) => (
                <div className="order_num_list_wrap" key={index}>
                  <div className="resp_head">
                    <dl className="dl order_num">
                      <dt className="dt">주문번호 &#58;</dt>
                      <dd className="dd">
                        &nbsp;<span className="num">{orderList.rnum}</span>
                      </dd>
                    </dl>
                    <Link
                      to={{ pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_ORDER_DETAIL}/${orderList?.ordnInfoId}&selr` }}
                      className="btn_detail_view"
                    >
                      주문상세보기
                    </Link>
                  </div>
                  {orderList?.items?.map((item, index) => (
                    <SellItem
                      type={'mo'}
                      key={'sellItemData_' + index}
                      data={item}
                      index={index}
                      amnnTs={orderList.amnnTs}
                      popupAlert={popupAlert}
                      popupDvry={popupDvry}
                      paramsDvry={paramsDvry}
                      setPopupAlert={setPopupAlert}
                      setPopupDvry={setPopupDvry}
                      setParamsDvry={setParamsDvry}
                    />
                  ))}
                </div>
              ))
            ) : (
              <ul className="table_list each_list">
                <li className="table_row each_item_row no_result_wrap">
                  <NoResult msg={isLoading ? '데이터를 불러오고 있습니다.' : '판매내역이 없습니다.'} />
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SellList
