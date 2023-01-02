import { useState, useCallback, useEffect } from 'react'
import Checkbox from 'components/atomic/Checkbox'
import moment from 'moment'

const PatentInfo = (props) => {

  const { form, setForm, allPatentList, setAllPatentList, agenInfId } = props
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const [toggle, setToggle] = useState(true)

  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])
  
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const NoResult = () => (
    <li className="table_row">
      <div className="item_section">
        <p className="guide_text">본 사업자등록번호로 등록된 특허가 없습니다.</p>
      </div>
    </li>
  )
  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">상품 특허 정보</div>
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
              {/* #1 특허정보검색 영역 : 위 특허정보 "있음"을 선택! 하였을때만, 보여지는 영역 start */}
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">상품관련특허 선택</span>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="patent_search_area">
                      <div className="table_list_wrap type02">
                        <ul className="table_list">
                          {form?.patentList?.length === 0 || allPatentList.length === 0 ? (
                            <NoResult />
                          ) : (
                            <PatentComponent
                              width={windowSize.width}
                              allPatentList={allPatentList}
                              form={form}
                              setForm={setForm}
                              setAllPatentList={setAllPatentList}
                              agenInfId={agenInfId}
                            />
                          )}
                        </ul>
                      </div>
                    </div>
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

const PatentComponent = (props) => {
  const { width, form, allPatentList, setForm, setAllPatentList, agenInfId } = props

  const handleChecked = (index) => {
    const _allPatentList = [...allPatentList]
    _allPatentList[index].checked = _allPatentList[index].checked === 'Y' ? 'N' : 'Y'
    setAllPatentList([..._allPatentList])
    setForm(_allPatentList.filter((item) => item.checked === 'Y'))
  }
  return width > 700 ? (
    <li className={`table_row w700_off `}>
      <div className="inner_header">
        <div className="inner_cell patent_name">특허명</div>
        <div className="inner_cell int">IPC</div>
        <div className="inner_cell cpc">법적상태</div>
        <div className="inner_cell application_number">출원번호&#47;일자</div>
        <div className="inner_cell registration_number">등록번호&#47;일자</div>
        <div className={`inner_cell applicant `}>출원인</div>
        {!form?.agenInfId && <div className="inner_cell choice">선택</div>}
      </div>
      {/* map */}
      <div className={`patent_list_container scroll_light ${allPatentList?.length > 3 && `active`}`}>
        {allPatentList?.map((patent, index) => (
          <PcPatent
            key={`pc_patent_${index}`}
            isAgent={!form?.agenInfId}
            patent={patent}
            index={index}
            agenInfId={agenInfId}
            handleChecked={() => handleChecked(index)}
          />
        ))}
      </div>
    </li>
  ) : (
    <li className="w700_on">
      <div className="patent_card_container scroll_light">
        {allPatentList?.map((patent, index) => (
          <MobilePatent
            key={`mobile_patent_${index}`}
            isAgent={!form?.agenInfId}
            patent={patent}
            setForm={setForm}
            index={index}
            agenInfId={agenInfId}
            handleChecked={() => handleChecked(index)}
          />
        ))}
      </div>
    </li>
  )
}

const PcPatent = (props) => {
  const { isAgent, patent, index, handleChecked, agenInfId } = props

  return (
    <div className="inner_content">
      <div className="inner_cell patent_name">{patent.ptntNm}</div>
      <div className="inner_cell int">{patent.ptntIpc}</div>
      <div className="inner_cell applicant">{patent.ptntStts}</div>
      <div className="inner_cell application_number">
        {patent.ptntAlfrNo} ({moment(patent.ptntAlfrTs).format('YYYY.MM.DD')})
      </div>
      <div className="inner_cell registration_number">
        {patent?.ptntRtn && `${patent?.ptntRtn} ${moment(patent.ptntTs).format('YYYY.MM.DD')}`}
      </div>
      <div className={`inner_cell applicant `}>{patent.ptntRlocaus}</div>
      {isAgent && (
        <div className="inner_cell choice">
          <Checkbox
            id={`pc_patent_checked_${index}`}
            className={'type02'}
            checked={patent.checked === 'Y'}
            onChange={handleChecked}
            disabled={agenInfId ? true : false}
          />
        </div>
      )}
    </div>
  )
}
const MobilePatent = (props) => {
  const { isAgent, patent, index, handleChecked, agenInfId } = props
  return (
    <li className="table_row">
      <div className="inner_wrap top">
        <div className="inner_cell inner_cell_header patent_name">
          특허명
          {isAgent && (
            <Checkbox
              id={`moblie_patent_checked_${index}`}
              className={'type02'}
              checked={patent.checked === 'Y'}
              onChange={handleChecked}
              disabled={agenInfId ? true : false}
            />
          )}
        </div>
        <div className="inner_cell inner_cell_value patent_name">{patent.ptntNm}</div>
      </div>
      <div className="inner_wrap middle">
        <div className="half_wrap">
          <div className="inner_cell inner_cell_header int">IPC</div>
          <div className="inner_cell inner_cell_value int">{patent.ptntIpc}</div>
        </div>
        <div className="half_wrap">
          <div className="inner_cell inner_cell_header cpc">법적상태</div>
          <div className="inner_cell inner_cell_value cpc">{patent.ptntStts}</div>
        </div>
      </div>
      <div className="inner_wrap bottom">
        <div className="inner_cell inner_cell_header application_number">출원번호&#47;일자</div>
        <div className="inner_cell inner_cell_value application_number">
          {' '}
          {patent.ptntAlfrNo} ({moment(patent.ptntAlfrTs).format('YYYY.MM.DD')})
        </div>
      </div>
      <div className="inner_wrap bottom">
        <div className="inner_cell inner_cell_header registration_number">등록번호&#47;일자</div>
        <div className="inner_cell inner_cell_value registration_number">
          {' '}
          {patent?.ptntRtn && `${patent?.ptntRtn} ${moment(patent.ptntTs).format('YYYY.MM.DD')}`}
        </div>
      </div>
      <div className="inner_wrap bottom">
        <div className="inner_cell inner_cell_header applicant">출원인</div>
        <div className="inner_cell inner_cell_value applicant">{patent.ptntRlocaus}</div>
      </div>
    </li>
  )
}

export default PatentInfo
