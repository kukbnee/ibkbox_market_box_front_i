import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import moment from 'moment'
import PathConstants from 'modules/constants/PathConstants'
import Button from 'components/atomic/Button'
import ProductInfo from 'components/mypage/estimation/ProductInfo'

const RequestEachItem = (props) => {

  const history = useHistory()
  const { data, index, paramsList, totalAgency, actionReject, actionCheckAlert } = props
  const [itemState, setItemState] = useState('')
  const [requesterInfo, setRequesterInfo] = useState({
    reqName: '',
    reqCoName: ''
  })
  const [paramsQna, setParamsQna] = useState({ pdfInfoId: null })
  const reqList = {
    sen: { reqName: data?.recRprsntvNm, reqCoName: data?.recBplcNm },
    rec: { reqName: data?.senRprsntvNm, reqCoName: data?.senBplcNm },
  }
  const buttonList = {
    sen: {
      COC01001: <Button className="btn full_peach full" onClick={() => handleCheckAlert(itemState)}>취소</Button>,
      COC01003: <Button className="btn full_peach full" onClick={() => handleCheckAlert(itemState)}>취소</Button>,
      COC01004: <Button className="btn linear_grey empty" onClick={() => handleReject('reason')}>반려사유보기</Button>
    },
    rec: {
      COC01001:
        <>
          <Button className="btn full_blue widthsm" onClick={() => handleCheckAlert(itemState)}>승인</Button>
          <Button className="btn full_peach widthsm" onClick={() => handleReject('reject')}>반려</Button>
        </>,
      COC01003: <Button className="btn linear_blue widthsm" onClick={() => handleCheckAlert(itemState)}>취소</Button>,
      COC01004: <Button className="btn linear_grey empty" onClick={() => handleReject('reason')}>반려사유보기</Button>,
      COC01006: <Button className="btn linear_grey empty" onClick={() => handleCheckAlert(itemState)}>취소해제</Button>,
    }
  }
  const itemStateList = {
    COC01001: <p className="orange">대기</p>,
    COC01003: <p className="blue">승인</p>,
    COC01004: <p className="peach">반려</p>,
    COC01005: <p className="peach">취소</p>,
    COC01006: <p className="peach">승인취소</p>
  }

  const handleCheckAlert = (state) => {
    actionCheckAlert(state, data?.agenInfId)
  }

  const handleReject = (action) => {
    actionReject(action, data?.agenInfId)
  }

  const handleQna = () => {
    setParamsQna({ ...paramsQna, pdfInfoId: data?.pdfInfoId })
  }


  const postProductDetailQnaSave = useCallback(async () => {
    await Axios({
      url: API.PRODUCT.PRODUCT_DETAIL_QNA_SAVE,
      method: 'post',
      data: paramsQna
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.push({ pathname: `${PathConstants.MY_PAGE_QNA_USER_VIEW}/${response.data.data}`, state: { inqrInfoId: response.data.data } })
      }
    })
  }, [paramsQna])


  useEffect(() => {
    setRequesterInfo(reqList?.[paramsList?.agenSearchType])
    setItemState(data?.pcsnsttsId)
  }, [data])

  useEffect(() => {
    if (paramsQna?.pdfInfoId != null) {
      postProductDetailQnaSave()
    }
  }, [paramsQna])


  return (
    <div className="item_section req_each_item">
      <div className="cell cell_num">{totalAgency - ((paramsList?.page - 1) * paramsList?.record) - index}</div>
      <ProductInfo
        type={'AGENCY'}
        classCell={"cell cell_info"}
        classWrap={"content_wrap"}
        classPrcWrap={"flex_row_wrap"}
        textColor={"#333139"}
        data={data}
      />
      <div className="cell cell_target">
        <div className="flex_row_wrap" style={{textAlign: 'center'}}>
          <p className="req_name">{requesterInfo?.reqCoName}</p>
          <p className="req_com">{requesterInfo?.reqName}</p>
          <Button className="linear_grey btn" onClick={handleQna}>문의하기</Button>
        </div>
      </div>
      <div className="cell cell_day">{moment(data?.agenRegDate).format('YYYY-MM-DD')}</div>
      <div className="cell cell_state">
        {itemStateList?.[itemState]}
        {buttonList?.[paramsList?.agenSearchType]?.[itemState]}
      </div>
    </div>
  )
}

export default RequestEachItem
