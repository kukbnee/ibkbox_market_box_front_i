import { useCallback, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import ConfirmItem from 'components/event/apply/ConfirmItem'
import Button from 'components/atomic/Button'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import moment from 'moment'
import PopupAlert from 'components/PopupAlert'

const Complete = (props) => {
  const { productList } = props
  const { id } = useParams()
  const history = useHistory()
  const [popupAlert, setPopupAlert] = useState(false)

  const handlePopupAlert = useCallback((type) => {
    if(type === 'btnMsg') CancelEvent() //이벤트 신청 취소
    setPopupAlert(!popupAlert)
  }, [popupAlert])

  const CancelEvent = useCallback(async() => {
    await Axios({
      url: API.EVENT.SELR_CANCEL,
      method: 'post',
      data: { evntInfId: id }
    }).then((response) => {
      if (response?.data?.code === '200') {
        handlePopupAlert('close')
        history.push(`${PathConstants.EVENT_DETAIL}/${id}`)
      }
    })
  }, [id])

  return (
    <div className="article_wrap">
      <div className="guide_wrap">
        <p className="tit">이벤트 신청이 완료되었습니다&#46;</p>
        <p className="exp">
          이벤트 신청현황은&nbsp;
          <span className="link_blue" onClick={() => history.push(PathConstants.MY_PAGE_EVENT)}>
            마이페이지 &#62; 이벤트관리
          </span>
          에서 확인 가능합니다&#46;
        </p>
        <p className="date">신청일시 &#58; {moment().format('YYYY-MM-DD HH:mm')}</p>
      </div>
      <div className="section_header">
        <div className="section_title">이벤트 신청 상품</div>
      </div>
      <div className="product_add_list">
        <div className="table_list_wrap each_list_wrap view">
          <div className="table_header bind_header">
            <div className="cell cell_num cb_none">No</div>
            <div className="cell cell_name">상품명</div>
            <div className="cell cell_price">판매가</div>
            <div className="cell cell_cate">분류</div>
          </div>
          {/*위 테이블의 리스트*/}
          <ul className="table_list each_list">
            {productList?.map((product, index) => (
              <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                <ConfirmItem data={product} index={index} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="btn_wrap">
        <Button className={'btn linear_blue'} onClick={() => handlePopupAlert('close')}>
          이벤트 신청 취소
        </Button>
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

export default Complete
