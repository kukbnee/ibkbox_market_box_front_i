import { useCallback } from 'react'
import Button from 'components/atomic/Button'

const SellerInfo = (props) => {

  const { data, setPopupAlert } = props

  const handleEdit = useCallback(() => {
    setPopupAlert({ active: true, type: 'MAIN_BOX', msg: null, btnMsg: null })
  })

  return (
    <div className="inner">
      <div className="tit_area">
        <p className="title">판매자 정보</p>
        <Button className={'btn full_blue edit'} onClick={handleEdit}>수정</Button>
      </div>
      <div className="table_list_wrap">
        <ul className="table_list">
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">상호명</div>
              <div className="cell cell_cnt">{data?.bplcNm}</div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">대표자</div>
              <div className="cell cell_cnt">{data?.rprsntvNm}</div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">대표연락처</div>
              <div className="cell cell_cnt">{data?.reprsntTelno}</div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">사업장 주소</div>
              <div className="cell cell_cnt">
                {Object.keys(data).length > 0 ? (
                  data?.nwAdres != ' ' ? (
                    `${data?.postNo != null ? '(' + data.postNo + ')' : ''} ${data?.nwAdres != null ? data.postNo : ''} ${data?.nwAdresDetail != null ? data.postNo : ''}`
                  ) : (
                    `${data?.postNo != null ? '(' + data.postNo + ')' : ''}) ${data?.adres != null ? data.postNo : ''} ${data?.detailAdres != null ? data.postNo : ''}`
                  )
                ) : (
                  null
                )}
              </div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">사업자등록번호</div>
              <div className="cell cell_cnt">{data?.bizrno}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SellerInfo
