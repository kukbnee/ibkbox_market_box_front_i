import { useState, useEffect, useCallback } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import EstimateProductItem from 'components/mypage/qnaUser/estimate/EstimateProductItem'
import PopupAddProduct from 'components/mypage/qnaUser/estimate/PopupAddProduct'
import { addComma } from 'modules/utils/Common'
import PopupAlert from 'components/PopupAlert'

const EstimateProductInfo = (props) => {

  const { mainItem, handleUpdateProduct } = props
  const [pdfList, setPdfList] = useState([])
  const [popupAlert, setPopupAlert] = useState(false)
  const [popupAdd, setPopupAdd] = useState({
    active: false,
    data: []
  })
  const [params, setParams] = useState({
    page: 1,
    record: 10
  })

  const handlePopup = () => {
    setPopupAdd({ ...popupAdd, active: !popupAdd })
    setParams({ ...params, page: 1 })
  }

  const handlePopupAlert = useCallback(() => {
    setPopupAlert(false)
  }, [popupAlert])

  const handleItemChangeValue = (update, index) => {
    let newPdfList = pdfList
    newPdfList[index] = update
    setPdfList([...newPdfList])
  }

  const handleItemDelete = (index) => {
    let newPdfList = pdfList
    newPdfList.splice(index, 1)
    setPdfList([...newPdfList])
  }

  const handleProductAddDirect = () => {
    let netItem = {
      esttPdfPtrnId: 'ESS01002',
      comPdfutId: 'COC02001',
      imgUrl: null,
      ordnQty: 0,
      salePrc: 0,
      pdfPrc: 0, //salePrc가 1원 이상이지 않을때 표시용
      pdfNm: '',
      selrUsisId: mainItem?.selrUsisId,
      gearPdfInfoId: ''
    }
    setPdfList([...pdfList, netItem])
  }

  const setAddNewProducts = (list) => {
    if (list?.length) {
      list.map((item) => {
        let newPdfList = pdfList
        item.ordnQty = 1
        item.salePrc = item?.salePrc ? Number(item?.salePrc) : 0
        item.totalPrc = 0
        newPdfList.push(item)
        setPdfList([...newPdfList])
      })
    }
    handlePopup()
  }


  const getPopProductAddList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_PRODUCT_ADD,
      method: 'get',
      params: params
    }).then((response) => {
      if (response.data.code === '200') setPopupAdd({ ...popupAdd, active: true, data: response.data.data })
    })
  }, [params])


  useEffect(() => {
    if (mainItem?.pdfInfoId) { //문의id 대상 상품을 상품 리스트 1번에 등록하기
      let blockPdfCode = ['GDS00002', 'GDS00003', 'GDS00005']
      let orderItem = mainItem
      if (blockPdfCode.includes(orderItem.pdfSttsId)) { //판매중지 상품
        orderItem['ordnQty'] = 0
        orderItem['salePrc'] = 0
        setPopupAlert(true)
      } else { //정상제품
        orderItem['ordnQty'] = mainItem?.pdfNm ? 1 : 0
        orderItem['salePrc'] = Number(mainItem?.salePrc) > 0 ? Number(mainItem?.salePrc) : Number(mainItem?.pdfPrc)
        orderItem['totalPrc'] = 0
        orderItem['esttPdfPtrnId'] = 'ESS01001'
        orderItem['comPdfutId'] = 'COC02001'
        orderItem['gearPdfInfoId'] = mainItem?.pdfInfoId
      }
      setPdfList([orderItem])
    }
  }, [mainItem])

  useEffect(() => {
    if (pdfList?.length > 0) { //상품 수 입력에 따라 숫자 및 총 합계액 업데이트
      pdfList.map((item) => {
        item['totalCnt'] = Number(item?.ordnQty)
        if (Number(item?.salePrc) > 0) {
          item['totalPrc'] = Math.floor(Number(item?.salePrc) * Number(item?.ordnQty))
        } else {
          item['totalPrc'] = Math.floor(Number(item?.pdfPrc) * Number(item?.ordnQty))
        }
      })
    }
    handleUpdateProduct(pdfList)
  }, [pdfList])


  useEffect(() => { //추가할 상품 리스트 가져오기
    if (popupAdd?.active) getPopProductAddList()
  }, [params])


  const calcTotalPrice = useCallback((uiType) => { //상품 총액
    let supplyPrc = 0
    if (pdfList?.length > 0) {
      pdfList.map((item) => {
        if (Number(item?.salePrc) > 0) {
          supplyPrc = supplyPrc + Math.floor(Number(item?.salePrc) * Number(item?.ordnQty))
        } else {
          supplyPrc = supplyPrc + Math.floor(Number(item?.pdfPrc) * Number(item?.ordnQty))
        }
      })
    }

    if (uiType) { //모바일화면에서 보임
      return (
        <div className="estimate_responsive_design" style={{}}>
          <div className="table_content type01 type02">
            <div className="cell through">
              <div className="title">총액</div>
              <div className="info_c textright">{`${addComma(Number(supplyPrc))} 원`}</div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="result">
          <div className="amount"></div>
          <div className="total">총액 : {`${addComma(Number(supplyPrc))} 원`}</div>
        </div>
      )
    }
  }, [pdfList])

  return (
    <>
      {popupAdd?.active &&
        <PopupAddProduct
          data={popupAdd}
          pageParams={params}
          pdfList={pdfList}
          setAddNewProducts={(list) => setAddNewProducts(list)}
          handlePopup={handlePopup}
          handlePagination={setParams} />
      }
      {popupAlert &&
        <PopupAlert
          className={'popup_review_warning'}
          msg={'견적 상품에 판매중지 상품이 있습니다.\n판매중지 상품은 견적을 발송 할 수 없습니다.'}
          btnMsg={'확인'}
          handlePopup={handlePopupAlert} />
      }
      <div className="sub_header">
        <p className="title">견적내역</p>
        <div className="btn_wrap">
          <Button className="btn full_blue" onClick={getPopProductAddList}>상품추가</Button>
          <Button className="btn full_blue" onClick={handleProductAddDirect}>직접입력</Button>
        </div>
      </div>
      <div className="estimate_responsive_wrap">
        <div className="table_wrap">
          <div className="table_inner">
            <div className="cell_wrap cell_tr">
              <div className="cell num">NO</div>
              <div className="cell name">상품명</div>
              <div className="cell unitprice">단가</div>
              <div className="cell quantity">주문수량</div>
              <div className="cell unit">단위</div>
              <div className="cell money">금액</div>
              <div className="cell del"></div>
            </div>
            {pdfList?.length > 0
              ? pdfList.map((item, index) => (
                <EstimateProductItem
                  key={index}
                  type={'form'}
                  index={index}
                  isNarrow={false}
                  item={item}
                  handleItemChangeValue={(update, index) => handleItemChangeValue(update, index)}
                  handleItemDelete={(index) => handleItemDelete(index)} />
              ))
              : null
            }
            <div className="cell_wrap cell_td">
              {calcTotalPrice(false)}
            </div>
          </div>
        </div>
      </div>
      <div className="estimate_responsive_design">
        <div className="table_content type01 type02">
          {pdfList?.length > 0
            ? pdfList.map((item, index) => (
              <EstimateProductItem
                key={index}
                type={'form'}
                index={index}
                isNarrow={true}
                item={item}
                handleItemChangeValue={(update, index) => handleItemChangeValue(update, index)}
                handleItemDelete={(index) => handleItemDelete(index)} />
            ))
            : null
          }
          {calcTotalPrice(true)}
        </div>
      </div>
    </>
  )
}

export default EstimateProductInfo
