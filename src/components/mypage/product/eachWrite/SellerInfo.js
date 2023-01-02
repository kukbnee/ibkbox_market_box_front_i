import { useState, useCallback } from 'react'

const SellerInfo = (props) => {

  const { sellerInfo } = props
  const [toggle, setToggle] = useState(true)

  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">판매자 정보</div>
        <div className="btn_group">
          <button className="btn_toggle_card" onClick={handleToggleState}>
            <span className="hide">카드 열고 닫기</span>
          </button>
        </div>
      </div>
      {toggle && (
        <div className="toggle_card_container">
          <div className="table_list_wrap type02 ">
            <ul className="table_list ">
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">상호명</span>
                  </div>
                  <div className="cell cell_value03 cell_full_value">
                    <p className="default_title">{sellerInfo?.bplcNm}</p>
                  </div>
                  <div className="cell cell_label cell_header brnone cell_full_header">
                    <span className="label">대표자명</span>
                  </div>
                  <div className="cell cell_value03 brnone cell_full_value">
                    <p className="default_title">
                      {sellerInfo?.bplcNm} &#47; {sellerInfo?.rprsntvNm}
                    </p>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">통신판매업신고번호</span>
                  </div>
                  <div className="cell cell_value03 cell_full_value">
                    <p className="default_title">{sellerInfo?.csbStmtno}</p>
                  </div>
                  <div className="cell cell_label cell_header brnone cell_full_header">
                    <span className="label">사업자등록번호</span>
                  </div>
                  <div className="cell cell_value03 brnone cell_full_value">
                    <p className="default_title">{sellerInfo?.bizrno}</p>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">사업장주소</span>
                  </div>
                  <div className="cell cell_value04 cell_full_value">
                    <p className="default_title">
                      {sellerInfo?.nwAdres && !sellerInfo?.nwAdres===''
                        ? `${sellerInfo?.nwAdres} ${sellerInfo?.nwAdresDetail}`
                        : `${sellerInfo?.adres} ${sellerInfo?.detailAdres }`}
                    </p>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">문의번호</span>
                  </div>
                  <div className="cell cell_value04 cell_full_value">
                    <p className="default_title">{sellerInfo?.reprsntTelno}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerInfo
