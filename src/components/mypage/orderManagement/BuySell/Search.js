import { useCallback, useState } from 'react'
import moment from 'moment'
import Calendar from 'components/atomic/Calendar'
import Button from 'components/atomic/Button'

const Search = (props) => {
  const { params, setParams, handleSearch, setPopupAlert } = props
  const [monthList, setMonthList] = useState({
    active: '',
    list: [
      { id: 'days15', name: '15일' },
      { id: 'days30', name: '1개월' },
      { id: 'days60', name: '2개월' },
      { id: 'days90', name: '3개월' }
    ]
  })
  const [typeList, setTypeList] = useState({
    active: 'pdfNm',
    list: [
      { id: 'pdfNm', value: '상품명' },
      { id: 'selrUsisNm', value: '판매사명' }
    ]
  })

  const handleMonthList = useCallback((id) => { //기간 선택(15일/1개월/2개월/3개월)
    if (id === monthList.active) { //기존 날짜 해제
      setMonthList({ ...monthList, active: '' })
      setParams({
        ...params,
        stDt: null,
        edDt: null
      })
      return
    }

    setMonthList({ ...monthList, active: id })
    switch (id) {
      case 'days15': //15일
        setParams({
          ...params,
          stDt: Date.parse(moment().subtract(15, 'days').calendar()),
          edDt: Date.parse(moment())
        })
        break
      case 'days30': //1개월
        setParams({
          ...params,
          stDt: Date.parse(moment().subtract(1, 'months').calendar()),
          edDt: Date.parse(moment())
        })
        break
      case 'days60': //2개월
        setParams({
          ...params,
          stDt: Date.parse(moment().subtract(2, 'months').calendar()),
          edDt: Date.parse(moment())
        })
        break
      case 'days90': //3개월
        setParams({
          ...params,
          stDt: Date.parse(moment().subtract(3, 'months').calendar()),
          edDt: Date.parse(moment())
        })
        break
    }
  }, [typeList, monthList, params])

  const handleTypeList = useCallback((e) => { //검색 주제 변경
    setTypeList({ ...typeList, active: e.target.value })
    setParams({ ...params, pdfNm: '', selrUsisNm: ''})
  }, [typeList, monthList, params])

  const onChangeCalendarStart = useCallback((date) => { //달력 시작일
    setMonthList({ ...monthList, active: '' }) //날짜 선택 초기화
    setParams({ ...params, stDt: date })
  }, [params, monthList])

  const onChangeCalendarEnd = useCallback((date) => { //달력 종료일
    setMonthList({ ...monthList, active: '' }) //날짜 선택 초기화
    if (date < params?.stDt) { //입력 날짜 검증
      setPopupAlert({
        active: true,
        type: 'alert',
        class: 'popup_review_warning',
        msg: '날짜를 재확인 해주세요.',
        btnMsg: '확인'
      })
      setParams({ ...params, stDt: null, edDt: null })
      return
    }
    setParams({ ...params, edDt: date })
  }, [params, monthList])

  const handelSearchText = useCallback((e) => { //검색어 입력
    setParams({ ...params, [e.target.id]: e.target.value })
  }, [monthList, params])

  
  const handleButton = useCallback((type) => {
    switch (type) {
      case 'INIT': //버튼-초기화
        setMonthList({ ...monthList, active: '' }) //날짜 선택 초기화
        setParams({ //params 초기화
          stDt: null,
          edDt: null,
          pdfNm: '',
          selrUsisNm: '',
          ordnSttsId: '',
          page: 1,
          record: 10
        })
        break
      case 'SEARCH': //버튼-검색
        if ((params?.stDt === null && params?.edDt != null) || (params?.stDt != null && params?.edDt === null)) setPopupAlert({ active: true, type: 'ALERT', class: 'popup_review_warning', msg: '날짜를 입력해주세요.', btnMsg: '확인' })
        else if (params?.stDt > params?.edDt) setPopupAlert({ active: true, type: 'ALERT', class: 'popup_review_warning', msg: '날짜를 재확인 해주세요.', btnMsg: '확인' })
        else handleSearch() //검색하기
        break
    }
  })




  return (
    <ul className="table_list ">
      <li className="table_row">
        <div className="item_section section01">
          <div className="cell cell_label cell_header ">날짜 선택</div>
          <div className="cell cell_value">
            <div className="month_list tab_header type02">
              <ul className="tab_header_list">
                {monthList.list.map((month, idx) => (
                  <li
                    className={`tab_header_item ${monthList.active === month.id ? 'active' : ''}`}
                    key={month.id}
                    onClick={() => handleMonthList(month.id)}
                  >
                    <span className="label">{month.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="datepicker_btn_wrap">
              <div className="datepicker_input_wrap">
                <div className="datepicker_input">
                  <Calendar valueType={'dash'} date={params?.stDt} onChange={(date) => onChangeCalendarStart(date)} />
                </div>
                <div className="datepicker_input">
                  <Calendar valueType={'dash'} date={params?.edDt} onChange={(date) => onChangeCalendarEnd(date)} />
                </div>
              </div>
              <Button className={'btn_search full_blue'} onClick={() => handleButton('INIT')}>
                초기화
              </Button>
            </div>
          </div>
        </div>
      </li>
      <li className="table_row">
        <div className="item_section section03">
          <div className="cell cell_label cell_header ">검색</div>
          <div className="cell cell_value">
            <select
              className="select type02"
              onChange={(e) => handleTypeList(e)}
              value={typeList.active}
              title={'type'}
            >
              {typeList.list.map((type, idx) => (
                <option value={type.id} key={type.id + idx}>
                  {type.value}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="input"
              id={typeList?.active}
              value={params?.[typeList?.active]}
              onChange={(e) => handelSearchText(e)}
              title={'mainnbNo'}
            />
            <Button className={'btn_search full_blue'} onClick={() => handleButton('SEARCH')}>
              검색
            </Button>
          </div>
        </div>
      </li>
    </ul>
  )
}

export default Search
