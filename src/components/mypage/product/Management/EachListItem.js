import { useState, useCallback, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Checkbox from 'components/atomic/Checkbox'
import Badge from 'components/atomic/Badge'
import PopupCustom from 'components/PopupCustom'
import Button from 'components/atomic/Button'
import PathConstants from 'modules/constants/PathConstants'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import moment from 'moment'
import { addComma } from 'modules/utils/Common'

const EachListItem = (props) => {
  const { data, index, pageInfo, getProductList, getProductsCountInfo, handleCheckbox } = props
  const history = useHistory()
  const menuRef = useRef(null)
  const [isModal, setIsModal] = useState(false)
  const [popup, setPopup] = useState(false)

  const onModal = useCallback(() => {
    setIsModal(!isModal)
  }, [isModal])

  const handlePopup = useCallback(() => setPopup(!popup), [popup])

  const moveFixPage = useCallback(() => {
    history.push(`${PathConstants.MY_PAGE_PRODUCT_EACH_WRITE}/${data.pdfInfoId}`)
  }, [data])

  const deleteProduct = useCallback(async () => { //개별삭제
    await Axios({
      url: API.MYPAGE.MY_SINGLE_PRODUCT_DELETE,
      method: 'post',
      data: [{ pdfInfoId: data.pdfInfoId }]
    }).then((response) => {
      if (response.data.code === '200') {
        handlePopup()
        getProductList()
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
      <div className="item_section prod_each_item prod_each_item_pc">
        <div className="cell cell_num">
          <Checkbox
            className={'type02'}
            id={`prod_each_item_${index}`}
            label={pageInfo?.total - ((pageInfo?.page - 1) * pageInfo?.record) - index}
            checked={data.checked ?? false}
            onChange={() => handleCheckbox(data?.pdfInfoId)}
          />
        </div>
        <div className="cell cell_name">
          <div className="content_wrap">
            <div className="img_wrap" onClick={moveFixPage}>
              <img src={data.imgUrl} alt={data.pdfNm} />
            </div>
            <div className="text_wrap">
              {data?.agenInfId && (
                <div className="agency_wrap">
                  <Badge className="full_blue badge">에이전시</Badge>
                </div>
              )}
              <p className="name" onClick={moveFixPage}>
                {data.pdfNm}
              </p>
            </div>
          </div>
        </div>
        <div className="cell cell_price">
          <div className={`flex_row_wrap gap_change ${data.salePrc > 0 ? 'add_margin' : ''}`}>
            {/* 가격정보 */}
            {(data?.pdfSttsId === 'GDS00005' || data?.pdfSttsId === 'GDS00006') ? (
              <p className="red text_though">{data?.pdfSttsName}</p>
            ) : (
              data?.prcDscsYn === 'Y' ? (
                <p className="price">가격협의</p>
              ) : (
                Number(data.salePrc) > 0 ? (
                  <>
                    <p className="price text_through">{addComma(data.pdfPrc)} 원</p>
                    <p className="price">{addComma(data.salePrc)} 원</p>
                  </>
                ) : (
                  <p className="price">{addComma(data.pdfPrc)} 원</p>
                )
              )
            )}
            {/* 진열상태/판매상태 */}
            {data?.pdfSttsId !== 'GDS00005' && data?.pdfSttsId !== 'GDS00006' && (
              <div className="textno_badge_wrap">
                {data?.pdfSttsId === 'GDS00001' ? (
                  <Badge className="badge full_blue">판매함</Badge>
                ) : (
                  <Badge className="badge full_grey">판매안함</Badge>
                )}
                {data?.pdfPgrsYn === 'Y' ? (
                  <Badge className="badge full_green">진열함</Badge>
                ) : (
                  <Badge className="badge full_orange">진열안함</Badge>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="cell cell_cate">{data.pdfCtgyName}</div>

        <div className="cell cell_stock">
          <div className="flex_row_wrap">
            <p className="least_cnt">
              {data?.ordnMnmmQty > 0 ? parseInt(data.ordnMnmmQty).toLocaleString() + '개' : ' - '}
            </p>
          </div>
        </div>

        <div className="cell cell_date">
          <div className="flex_row_wrap">
            <p className="reg_date">{moment(data.rgsnTs).format('YYYY-MM-DD')}</p>
          </div>
        </div>

        <div className="btn_edit_modal_wrap" ref={menuRef}>
          <div className="btn_edit_modal_inner">
            <button className={`btn_edit_modal ${isModal ? 'active' : ''}`} onClick={onModal}>
              <span className="hide">수정 삭제 팝업</span>
            </button>
            {isModal && (
              <div className="edit_modal_wrap">
                <button className="btn_edit" onClick={moveFixPage}>
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
            id={`prod_each_item_${index}`}
            label={pageInfo?.total - ((pageInfo?.page - 1) * pageInfo?.record) - index}
            checked={data.checked ?? false}
            onChange={() => handleCheckbox(data?.pdfInfoId)}
          />
        </div>
        <div className="info_wrap">
          <div className="product_wrap">
            <div className="img_wrap" onClick={moveFixPage}>
              <img src={data.imgUrl} alt={data.pdfNm} />
            </div>
            <div className="text_wrap">
              {data?.agenInfId && (
                <div className="agency_wrap">
                  <Badge className="full_blue badge">에이전시</Badge>
                </div>
              )}
              <p className="title_wrap" onClick={moveFixPage}>
                {data.pdfNm}
              </p>
              <p className="type">{data.pdfCtgyName}</p>
              <div className="btn_edit_modal_wrap">
                <div className="btn_edit_modal_inner">
                  <button className={`btn_edit_modal ${isModal ? 'active' : ''}`} onClick={onModal}>
                    <span className="hide">수정 삭제 팝업</span>
                  </button>
                  {isModal && (
                    <div className="edit_modal_wrap">
                      <button className="btn_edit" onClick={moveFixPage}>
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
              <div className="name">판매가/상태</div>
              <div className="info">
                <div className="text_badge_wrap">
                  {/* 진열상태/판매상태 */}
                  {data?.pdfSttsId !== 'GDS00005' && data?.pdfSttsId !== 'GDS00006' && (
                    <>
                      {data?.pdfSttsId === 'GDS00001' ? (
                        <Badge className="badge full_blue">판매함</Badge>
                      ) : (
                        <Badge className="badge full_grey">판매안함</Badge>
                      )}
                      {data?.pdfPgrsYn === 'Y' ? (
                        <Badge className="badge full_green">진열함</Badge>
                      ) : (
                        <Badge className="badge full_orange">진열안함</Badge>
                      )}
                    </>
                  )}
                </div>
                {/* 가격정보 */}
                {(data?.pdfSttsId === 'GDS00005' || data?.pdfSttsId === 'GDS00006') ? (
                  <p className="red alert">{data?.pdfSttsName}</p>
                ) : (
                  data?.prcDscsYn === 'Y' ? (
                    <p className="price">가격협의</p>
                  ) : (
                    Number(data.salePrc) > 0 ? (
                      <div className="change_price_wrap">
                        <p className="before_price">{addComma(data.pdfPrc)} 원</p>
                        <p className="change_price">{addComma(data.salePrc)} 원</p>
                      </div>
                    ) : (
                      <p className="price">{addComma(data.pdfPrc)} 원</p>
                    )
                  )
                )}
              </div>
            </div>
            <div className="product_cell">
              <div className="name">최소구매</div>
              <div className="info">
                <p className="least">
                  {data?.ordnMnmmQty > 0 ? parseInt(data.ordnMnmmQty).toLocaleString() + '개' : ' - '}
                </p>
              </div>
            </div>
            <div className="product_cell">
              <div className="name">등록일</div>
              <div className="info">
                <p className="date">{moment(data.rgsnTs).format('YYYY-MM-DD')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 삭제 확인 ALERT */}
      {popup && (
        <PopupCustom handlePopup={handlePopup} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              선택하신 <b className="highlight_blue">개별상품</b>을 <br />
              정말로 삭제하시겠습니까?
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={deleteProduct}>
                삭제
              </Button>
            </div>
          </div>
        </PopupCustom>
      )}
    </>
  )
}

export default EachListItem
