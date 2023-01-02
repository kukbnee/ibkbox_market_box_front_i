import { useState, useCallback, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import Checkbox from 'components/atomic/Checkbox'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import PopupAlert from 'components/PopupAlert'
import PathConstants from 'modules/constants/PathConstants'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'

const BuyerListItem = (props) => {
  const { data, index, getBuyerList, pageInfo, getProductsCountInfo, handleCheckbox } = props
  const history = useHistory()
  const menuRef = useRef(null)
  const [isModal, setIsModal] = useState(false)
  const [popup, setPopup] = useState(false)
  const [copyPopup, setCopyPopup] = useState(false)

  const onModal = useCallback(() => {
    setIsModal(!isModal)
  }, [isModal])

  const handlePopup = useCallback(() => setPopup(!popup), [popup])

  const moveWritePage = useCallback(() => {
    history.push(`${PathConstants.MY_PAGE_PRODUCT_BUYER_WRITE}/${data.buyerInfId}`)
  }, [data])

  const onClickCopy = () => { setCopyPopup(true) }

  const closePopup = useCallback(() => setCopyPopup(false), [])

  const deleteBuyer = useCallback(async() => { //개별삭제
    await Axios({
      url: API.MYPAGE.MY_BUYER_PRODUCT_DELETE,
      method: 'post',
      data: [{ buyerInfId: data.buyerInfId }]
    }).then((response) => {
      if (response.data.code === '200') {
        handlePopup()
        getBuyerList()
        getProductsCountInfo()
      }
    })
  }, [popup])

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (isModal && menuRef.current && !menuRef.current.contains(e.target) && e.target.className !== 'menu_popup') {
        setIsModal(false)
      }
    }
    document.addEventListener('mousedown', checkIfClickedOutside)
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside)
    }
  }, [isModal])

  return (
    <>
      <div className="item_section prod_buyer_item prod_buyer_item_pc">
        <div className="cell cell_num">
          <Checkbox
            className={'type02'}
            id={`prod_buyer_item_${index}`}
            label={pageInfo?.total - ((pageInfo?.page - 1) * pageInfo?.record) - index}
            checked={data.checked ?? false}
            onChange={() => handleCheckbox(data?.buyerInfId)}
          />
        </div>
        <div className="cell cell_bind">
          <div className="content_wrap">
            <div className="img_wrap" onClick={moveWritePage}>
              <img src={data.imgUrl} alt={data.ttl} />
            </div>
            <div className="contents" onClick={moveWritePage}>
              <p className="title">{data.ttl}</p>
              <p className="content">{data.con}</p>
            </div>
          </div>
        </div>
        <div className="cell cell_cnt">{data.pdfCnt}</div>
        <div className="cell cell_url">
          <CopyToClipboard
            text={`${process.env.REACT_APP_URL}${PathConstants.BUYER_LETTER}/${data.buyerInfId}`}
            onCopy={onClickCopy}
          >
            <Button className={'btn_copy linear_grey'}>복사</Button>
          </CopyToClipboard>
        </div>
        <div className="cell cell_date">
          <div className="flex_row_wrap">
            <p className="reg_date">{moment(data.rgsnTs).format('YYYY-MM-DD')}</p>
          </div>
        </div>
        {/*기능 더보기 버튼*/}
        <div className="btn_edit_modal_wrap" ref={menuRef}>
          <div className="btn_edit_modal_inner">
            <button className={`btn_edit_modal ${isModal ? 'active' : ''}`} onClick={onModal}>
              <span className="hide">수정 삭제 팝업</span>
            </button>
            {isModal && (
              <div className="edit_modal_wrap">
                <button className="btn_edit" onClick={moveWritePage}>
                  수정
                </button>
                <button className="btn_edit" onClick={handlePopup}>
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/*반응형*/}
      <div className="prod_item_mo">
        <div className="num_wrap">
          <Checkbox
            className={'type02'}
            id={`prod_buyer_item_${index}`}
            label={pageInfo?.total - ((pageInfo?.page - 1) * pageInfo?.record) - index}
            checked={data.checked ?? false}
            onChange={() => handleCheckbox(data?.bunInfId)}
          />
        </div>
        <div className="info_wrap">
          <div className="product_wrap">
            <div className="img_wrap">
              <img src={data.imgUrl} alt={data.ttl} />
            </div>
            <div className="text_wrap">
              <p className="title_wrap">{data.ttl}</p>
              <p className="comment">{data.con}</p>
              <div className="btn_edit_modal_wrap">
                <div className="btn_edit_modal_inner">
                  <button className={`btn_edit_modal ${isModal ? 'active' : ''}`} onClick={onModal}>
                    <span className="hide">수정 삭제 팝업</span>
                  </button>
                  {isModal && (
                    <div className="edit_modal_wrap">
                      <button className="btn_edit" onClick={moveWritePage}>
                        수정
                      </button>
                      <button className="btn_edit" onClick={handlePopup}>
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="product_table_wrap">
            <div className="product_cell">
              <div className="name">상품수</div>
              <div className="info">
                <div className="pd_num">{data.pdfCnt}</div>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">동적 url</div>
              <div className="info">
                <CopyToClipboard
                  text={`${process.env.REACT_APP_URL}${PathConstants.BUYER_LETTER}/${data.buyerInfId}`}
                  onCopy={onClickCopy}
                >
                  <Button className={'btn_copy linear_grey'}>복사</Button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">등록일</div>
              <div className="info">
                <p className="date text-left">{moment(data.rgsnTs).format('YYYY-MM-DD')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {popup && (
        <PopupCustom handlePopup={handlePopup} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              선택하신 <b className="highlight_blue">바이어상품</b>을 <br />
              정말로 삭제하시겠습니까?
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={deleteBuyer}>
                삭제
              </Button>
            </div>
            <p className="etc_text">* 바이어상품에 포함된 개별상품은 삭제되지 않습니다.</p>
          </div>
        </PopupCustom>
      )}
      {copyPopup && (
        <PopupAlert
          className={'event_popup_wrap wide buyer_popup'}
          msg={'주소가 복사 되었습니다.\n 원하시는 곳에 ctrl+v 또는 붙여넣기를 해주세요.'}
          btnMsg={'확인'}
          handlePopup={closePopup}
        />
      )}
    </>
  )
}

export default BuyerListItem
