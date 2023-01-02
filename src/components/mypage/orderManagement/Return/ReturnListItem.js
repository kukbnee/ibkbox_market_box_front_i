import { useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import moment from 'moment'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'

const ReturnListItem = (props) => {

  const { data, isTab } = props
  const history = useHistory()
  const [popupAlert, setPopupAlert] = useState(false)
  const [paramsQna, setParamsQna] = useState({ pdfInfoId: null })
  const sttsList = {
    ODS00005: <p className="blue">반품요청</p>,
    ODS00006: <p className="red">반품불가</p>,
    ODS00007: <p className="blue">반품완료</p>
  }
  const askerInfo = {
    selr: (
      <>
        <p className="company">{data?.pucsBplcNm}</p>
        <p className="buyer">{data?.pucsNm}</p>
      </>
    ),
    buyer: <p className="company">{data?.selrBplcNm}</p>
  }

  const handlePopupAlert = useCallback(() => { //잠시 후 다시 시도해 달라는 팝업
    setPopupAlert(!popupAlert)
  }, [popupAlert])

  const handleQna = useCallback(() => { //문의하기 버튼 클릭
    setParamsQna({ ...paramsQna, pdfInfoId: data?.pdfInfoId })
  }, [data, paramsQna])

  const handleLinkReturnDetail = useCallback(() => { //반품 상세페이지로 이동
    history.push({pathname: `${PathConstants.MY_PAGE_ORDERMANAGEMENT_RETURN_DETAIL}/${data?.ordnInfoId}&${data?.infoSqn}&${isTab}`})
  }, [data, isTab])

  const postProductDetailQnaSave = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.PRODUCT_DETAIL_QNA_SAVE,
      method: 'post',
      data: paramsQna
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.push({ pathname: `${PathConstants.MY_PAGE_QNA_USER_VIEW}/${response.data.data}`, state: { inqrInfoId: response.data.data } })
      } else {
        handlePopupAlert()
      }
    })
  }, [paramsQna])

  useEffect(() => {
    if (paramsQna?.pdfInfoId != null) postProductDetailQnaSave() //문의 페이지 이동을 위한 id 값 서버에서 확인하기
  }, [paramsQna])

  return (
    <>
      {popupAlert && <PopupAlert handlePopup={handlePopupAlert} msg={'잠시 후 다시 시도해주세요'} btnMsg={'확인'} />}
      <div className="table_item return_item_pc">
        <div className="cell number">{data?.cnttNoId}</div>
        <div className="cell info">
          <div className="info_wrap">
            <div className="img_wrap">
              {data?.imgUrl && <img src={`${data?.imgUrl}`} alt={data?.pdfNm} />}
            </div>
            <div className="badge_text_wrap">
              {data?.agenState === 'Y' && (
                <div className="badge_wrap">
                  <Badge className="badge full_blue">에이전시</Badge>
                </div>
              )}
              <div className="text_wrap">
                <p className="text">{data?.pdfNm}</p>
                <div className="etc_wrap">
                  <p className="model">모델명:{data?.mdlnm}</p>
                  <p className="date">{data?.amnnTs ? moment(data.amnnTs).format('YYYY-MM-DD HH:mm') : null}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cell price">{data?.ttalAmt ? parseInt(data.ttalAmt).toLocaleString() : 0} 원</div>
        <div className="cell name">
          <div className="name_wrap">
            {askerInfo?.[isTab]}
          </div>
        </div>
        <div className="cell state">
          <div className="state_wrap">
            {sttsList?.[data?.ordnSttsId]}
            <Button className="btn full_blue" onClick={handleQna}>문의하기</Button>
            <Button className="btn full_blue" onClick={handleLinkReturnDetail}>상세보기</Button>
          </div>
        </div>
      </div>
      <div className="prod_item_mo return_item_mo">
        <div className="info_wrap w100">
          <div className="product_table_wrap">
            <div className="product_cell">
              <div className="name">주문번호</div>
              <div className="info">
                <div className="order_num">{data?.cnttNoId}</div>
              </div>
            </div>
          </div>
          <div className="product_wrap">
            <div className="img_wrap">
              {data?.imgUrl && <img src={`${data?.imgUrl}`} alt={data?.pdfNm} />}
            </div>
            <div className="text_wrap">
              {data?.agenState === 'Y' && (
                <div className="agency_wrap">
                  <Badge className="full_blue badge">에이전시</Badge>
                </div>
              )}
              <p className="title_wrap">{data?.pdfNm}</p>
              <p className="model">모델명:{data?.mdlnm}</p>
            </div>
          </div>
          <div className="product_table_wrap">
            <div className="product_cell">
              <div className="name">날짜</div>
              <div className="info">
                <p className="date">{data?.amnnTs ? moment(data.amnnTs).format('YYYY-MM-DD HH:mm') : null}</p>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">총 주문금액</div>
              <div className="info">
                <div className="pd_price">{data?.ttalAmt ? parseInt(data.ttalAmt).toLocaleString() : 0} 원</div>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">{isTab === 'selr' ? '구매자명' : '판매사명'}</div>
              <div className="info">
                {askerInfo?.[isTab]}
              </div>
            </div>
            <div className="product_cell">
              <div className="name">상태</div>
              <div className="info">
                <div className="btn_wrap">
                  <Button className="btn full_blue" onClick={handleQna}>문의하기</Button>
                  <Button className="btn full_blue" onClick={handleLinkReturnDetail}>상세보기</Button>
                </div>
                <div className="text_wrap">
                  {sttsList?.[data?.ordnSttsId]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ReturnListItem
