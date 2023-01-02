import { useState, useEffect, useCallback } from 'react'
import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'
import Pagination from 'components/atomic/Pagination'
import Checkbox from 'components/atomic/Checkbox'
import PopupAddProductItem from 'components/mypage/qnaUser/estimate/PopupAddProductItem'

const PopupAddProduct = (props) => {

  const { data, pageParams, pdfList, handlePopup, handlePagination, setAddNewProducts } = props
  const [addList, setAddList] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)


  const handlePage = useCallback((page) => {
    handlePagination({ ...pageParams, page: page })
    setIsCheckedAll(false)
  }, [isCheckedAll, pageParams])

  const handleCheckbox = useCallback((list) => {
    //체크 할 때마다 리스트 내 체크 수 카운팅
    let checkCnt = 0
    list?.map((item) => { if (item.isChecked) checkCnt = checkCnt + 1 })
    if (checkCnt === data?.data?.list?.length) setIsCheckedAll(true) //전체체크
    else setIsCheckedAll(false) //전체체크 해제
    setAddList([...list])
  }, [data, addList, isCheckedAll])

  const handleCheckAll = useCallback(() => { // 전체체크
    let list = [...addList]
    list.map((item) => {
      if (item.checkDisabled) return
      else if (item?.isChecked === undefined) item.isChecked = !isCheckedAll
      else item['isChecked'] = !isCheckedAll
    })
    setAddList([...list])
    setIsCheckedAll(!isCheckedAll)
  }, [addList, isCheckedAll])


  const saveAddProduct = useCallback(() => {
    let selectList = []
    addList.map((item) => { if (item.checkDisabled != true && item.isChecked) selectList.push(item) })
    setAddNewProducts(selectList)
  }, [addList])


  useEffect(() => {
    let regList = data?.data?.list
    if (regList?.length) {
      regList.map((item, index) => { //추가 불가능한 상품 체크
        let findIndex = pdfList.findIndex((element) => {
          if (element.pdfInfoId === item.pdfInfoId) return true //문의방 대표 상품
        })

        if (findIndex >= 0) {
          regList[index]['isChecked'] = true
          regList[index].checkDisabled = true
        }

        if((item.pdfSttsId === "GDS00002") || //판매중지
          (item?.pdfSttsId === "GDS00003") || //판매보류
          (item?.pdfSttsId === "GDS00005")){  //관리자 판매중지
          regList[index]['isChecked'] = true
          regList[index].checkDisabled = true
        }
      })
    }
    handleCheckbox(regList)
  }, [data, pdfList])


  return (
    <div className="popup_wrap popup_bargain_register estimate estimateItem type02">
      <div className="layer">&nbsp;</div>
      <div className="container scroll">
        <div className="popup_header">
          <h3 className="popup_title">상품추가</h3>
          <BtnClose onClick={handlePopup} />
        </div>
        <div className="estimate_content">
          <div className="sub_header">
            <p className="title">판매상품</p>
          </div>
          <div className="product_add_list_wrap">
            <div className="product_add_list">
              <div className="table_list_wrap each_list_wrap view">
                <div className="table_header bind_header">
                  <div className="cell cell_num cb_none">
                    <Checkbox
                      className={'type02'}
                      id={`prod_each_item_all`}
                      label={""}
                      onChange={() => handleCheckAll()}
                      checked={isCheckedAll}
                    />
                  </div>
                  <div className="cell cell_name w55">상품명</div>
                  <div className="cell cell_price">판매가</div>
                  <div className="cell cell_cate">분류</div>
                </div>
                <ul className="table_list each_list">
                  {addList?.length > 0
                    ? addList.map((item, idx) => (
                      <li className="table_row each_item_row" key={'each_prod_item_' + idx}>
                        <PopupAddProductItem
                          data={item}
                          index={idx}
                          addList={addList}
                          handleCheckbox={(list) => handleCheckbox(list)}
                          setIsCheckedAll={setIsCheckedAll} />
                      </li>
                    ))
                    : null
                  }
                </ul>
              </div>
            </div>
          </div>
          {data?.data?.totalPage > 0 &&
            <div className="pagination_wrap">
              <Pagination
                page={data?.data?.page}
                totalPages={data?.data?.totalPage}
                handlePagination={(page) => handlePage(page)}
              />
            </div>
          }
          <div className="button_wrap">
            <Button className="linear_blue btn" onClick={handlePopup}>취소</Button>
            <Button className="full_blue btn" onClick={saveAddProduct}>선택완료</Button>
          </div>
          <p className="etc_text">*IBK는 상품에 직접 관여하지 않으며, 책임은 각 판매업체에 있습니다.</p>
        </div>
      </div>
    </div>
  )
}

export default PopupAddProduct
