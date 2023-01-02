import {useCallback, useEffect, useState} from 'react'
import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'
import { addComma } from 'modules/utils/Common'

const PopupFreightService = (props) => {
  const { handlePopup, form, sellerInfo,file,selectedDeliveryCompany,setSelectedDeliveryCompany,index,setForm,setEstimateList,estimateList } = props

  const selectCompany = useCallback(()=>{

      if(!selectedDeliveryCompany?.esttAmt || !selectedDeliveryCompany?.company){
        return;
      }
      handlePopup()

  },[selectedDeliveryCompany])

  const handleConsulting = ()=>{
    window.open('http://121.172.114.138/chunilEsti/htmls/ask.jsp?JOBGBN=TB002')
  }

  const closePopup=()=>{
    let _form = [...form.deliveryProductServiceInfoList]
    setSelectedDeliveryCompany({entpInfoId: selectedDeliveryCompany?.entpInfoId, esttAmt: '', qty:selectedDeliveryCompany?.qty, company:'' })
    _form.splice(index,1)
    //_form[index] = {entpInfoId: selectedDeliveryCompany?.entpInfoId, esttAmt: '', qty:selectedDeliveryCompany?.qty, company:'' }
    setForm({...form, deliveryProductServiceInfoList: [..._form] })

    let _estimateList=[...estimateList]
    _estimateList.splice(index,1)
    setEstimateList([..._estimateList])
    handlePopup()
  }

  return (
    <div className="popup_wrap popup_bargain_register estimate freight_popup">
      <div className="layer">&nbsp;</div>
      <div className="container scroll">
        <BtnClose onClick={closePopup} />
        <div className="freight_tab_wrap">
          <div className="freight_tab_inner">
            <div className="freight_tab active">{selectedDeliveryCompany?.company}</div>
          </div>
        </div>
        <div className="freight_wrap">
          <div className="table_wrap">
            <ul className="table_list">
              <li className="table_item">
                <div className="cell cell_header cell_title">구분</div>
                <div className="cell cell_header cell_content">설명</div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">보내시는분 성명</div>
                <div className="cell cell_content">{sellerInfo?.rprsntvNm}</div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">보내시는분 전화번호</div>
                <div className="cell cell_content">{sellerInfo?.reprsntTelno}</div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">상품출고지</div>
                <div className="cell cell_content">{form?.rlontfAdr + ' ' + form?.rlontfDtad}</div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">제품포장단위</div>
                <div className="cell cell_content">{form?.prdtpcknUtId === 'DIS00001' ? '박스' : '파렛트'}</div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">내품가액(1box당)</div>
                <div className="cell cell_content">{form?.dchGdsPrc}원</div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">최대상품수(1box당)</div>
                <div className="cell cell_content">{form?.mxmmGdsCnt}개</div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">박스규격(부피)</div>
                <div className="cell cell_content">
                  <div className="content_list">
                    <p className="text">가로 : {form?.prdtBrdh}cm,</p>
                    <p className="text">세로 : {form?.prdtVrtc}cm,</p>
                    <p className="text">높이 : {form?.prdtAhgd}cm</p>
                  </div>
                </div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">박스규격(무게)</div>
                <div className="cell cell_content">{form?.prdtWgt} kg</div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">제품사진</div>
                <div className="cell cell_content pics">
                  {file && file?.fileNm ?
                      <div className="pic">{file.fileNm}</div>
                      :
                      <div className="pic"></div>
                  }
                </div>
              </li>
              <li className="table_item">
                <div className="cell cell_title">견적수량</div>
                <div className="cell cell_content">{selectedDeliveryCompany?.qty} 개</div>
              </li>
              {
                (selectedDeliveryCompany?.apiResultYn === 'Y') &&
                  <li className="table_item">
                    <div className="cell cell_title cell_price_title">예상견적</div>
                    <div className="cell cell_content cell_price_content">{addComma(selectedDeliveryCompany?.esttAmt)} 원</div>
                  </li>
              }
            </ul>
          </div>
          {
            selectedDeliveryCompany?.apiResultYn === 'N' ?
                <div className="delivery_not">
                  <p className="delivery_not_text">배송비를 불러오지 못했습니다.</p>
                  <p className="delivery_not_text">팝업창을 닫고 다시 시도하거나 다른 배송유형을 선택해주세요.</p>
                </div>
              : <></>
          }
          <div className="etc_wrap">
            <div className="sub_text">*도서/산간 지역의 경우 기본운임의 150%가 추가될 수 있습니다.</div>
            <Button className="btn full_blue consult" onClick={handleConsulting}>컨설팅문의</Button>
          </div>
          <div className="btn_wrap">
            <Button className="btn linear_blue" onClick={closePopup}>
              닫기
            </Button>
            {
              selectedDeliveryCompany?.apiResultYn === 'Y' ?
                  <Button className="btn full_blue" onClick={() => selectCompany()}>
                    선택
                  </Button>
                : <></>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupFreightService
