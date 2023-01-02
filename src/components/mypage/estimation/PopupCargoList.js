import { useState, useCallback, useEffect } from 'react'
import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'
import CargoOrderItem from 'components/mypage/estimation/CargoOrderItem'
import { addComma } from 'modules/utils/Common'

const PopupCargoList = (props) => {

  const { type, cargoData, closePopup, handleSelectCargoEnt } = props
  const [tabList, setTabList] = useState({
    active: 0,
    list: []
  })
  const completeButton = {
    estimation: <Button className={tabList?.list[tabList?.active]?.apiResultYn === "Y" ? "btn full_blue" : "btn full_grey"} onClick={() => handleSelectCargoEntp()}>선택완료</Button>,
    address: <Button className="btn full_blue">선택완료 및 배송정보</Button>,
  }


  const handleTab = (index) => {
    setTabList({ ...tabList, active: index })
  }

  const handleSelectCargoEntp = useCallback(() => {
    if (tabList?.list[tabList?.active]?.apiResultYn === "Y") handleSelectCargoEnt(tabList?.list[tabList?.active])
    else return
  }, [tabList])


  useEffect(() => {
    let newTabList = []
    if (cargoData?.dvryEntps?.length) {
      cargoData?.dvryEntps?.map((item, index) => { newTabList.push({ ...item, id: index }) })
      setTabList({ active: newTabList[0].id, list: newTabList })
    }
  }, [cargoData])

  const deliveryFee = () => {
    if (tabList?.list[tabList?.active]?.apiResultYn === "Y") {
      return (
        <div className="table_wrap">
          <ul className="table_list">
            <li className="table_item">
              <div className="cell cell_title cell_price_title">배송비</div>
              <div className="cell cell_content cell_price_content">{tabList?.list[tabList?.active]?.dvrynone ? addComma(Number(tabList?.list[tabList?.active]?.dvrynone)) : 0} 원</div>
            </li>
          </ul>
        </div>
      )
    } else {
      return (
        <div className="delivery_not">
          <p className="delivery_not_text">배송비를 불러오지 못했습니다.</p>
          <p className="delivery_not_text">팝업창을 닫고 다시 시도하거나 다른 배송유형을 선택해주세요.</p>
        </div>
      )
    }
  }

  return (
    <div className="popup_wrap popup_bargain_register estimate freight_popup">
      <div className="layer">&nbsp;</div>
      <div className="container scroll">
        <BtnClose onClick={closePopup} />
        <div className="freight_tab_wrap">
          <div className="freight_tab_inner">
            {tabList?.list?.map((item, index) => (
              <div key={index} className={`freight_tab ${tabList?.active === index ? 'active' : ''}`} onClick={() => handleTab(index)}>{item.entpNm}</div>
            ))}
          </div>
        </div>
        <div className="freight_wrap">
          <div className="tab_inner_wrap scroll">
            <div className="table_inner">
              <p className="ship_title">배송정보</p>
              <div className="table_wrap">
                <ul className="table_list">
                  <li className="table_item">
                    <div className="cell cell_header cell_title">구분</div>
                    <div className="cell cell_header cell_content text_center">내용</div>
                  </li>
                  <li className="table_item">
                    <div className="cell cell_title">보내시는분 성명(업체명)</div>
                    <div className="cell cell_content">{cargoData?.bplcNm}</div>
                  </li>
                  <li className="table_item">
                    <div className="cell cell_title">보내시는분 전화번호</div>
                    <div className="cell cell_content">{cargoData?.reprsntTelno}</div>
                  </li>
                  <li className="table_item">
                    <div className="cell cell_title">상품출고지</div>
                    <div className="cell cell_content">{cargoData?.rlontfAdr} {cargoData?.rlontfDtad}</div>
                  </li>
                  <li className="table_item">
                    <div className="cell cell_title">받는 분 성명</div>
                    <div className="cell cell_content">{cargoData?.rcarNm}</div>
                  </li>
                  <li className="table_item">
                    <div className="cell cell_title">받는 분 전화번호</div>
                    <div className="cell cell_content">{cargoData?.rcarCnplone}</div>
                  </li>
                  <li className="table_item">
                    <div className="cell cell_title">받는 분 주소</div>
                    <div className="cell cell_content">{cargoData?.rcarAdr} {cargoData?.rcarDtlAdr}</div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="table_inner">
              <p className="ship_title">배송상품</p>
              {cargoData?.items?.length > 0 ? (
                cargoData.items.map((item, index) => <CargoOrderItem key={index} data={item} />)
              ) : (
                null
              )}
            </div>
          </div>
          {deliveryFee()}
          <div className="btn_wrap ship_request">
            <Button className="btn linear_blue" onClick={closePopup}>닫기</Button>
            {completeButton?.[type]}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupCargoList
