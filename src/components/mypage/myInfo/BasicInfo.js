import { useCallback } from 'react'
import Button from 'components/atomic/Button'

const BasicInfo = (props) => {

  const { data, setPopupAlert } = props

  const handleEdit = useCallback(() => {
    setPopupAlert({ active: true, type: 'MAIN_BOX', msg: null, btnMsg: null })
  })

  const addressForm = useCallback(() => {
    // console.log(data)
    return (
      <>
        {data?.nwAdres != ' ' ? (
          `${data?.postNo != null ? '(' + data.postNo + ')' : ''} ${data?.nwAdres != null ? data.nwAdres : ''} ${data?.nwAdresDetail != null ? data.nwAdresDetail : ''}`
        ) : (
          `${data?.postNo != null ? '(' + data.postNo + ')' : ''} ${data?.adres != null ? data.adres : ''} ${data?.detailAdres != null ? data.detailAdres : ''}`
        )}
      </>
    )
  }, [data])

  return (
    <div className="inner mrg_top">
      <div className="tit_area">
        <p className="title">기본정보</p>
        <Button className={'btn full_blue edit'} onClick={handleEdit}>수정</Button>
      </div>
      <div className="table_list_wrap">
        <ul className="table_list">
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">이메일 (아이디)</div>
              <div className="cell cell_cnt">{data?.email}</div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">이름</div>
              <div className="cell cell_cnt">{data?.userNm}</div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">휴대전화</div>
              <div className="cell cell_cnt">{data?.moblphonNo}</div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">회사 주소</div>
              <div className="cell cell_cnt">{Object.keys(data).length > 0 ? addressForm() : ''}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BasicInfo
