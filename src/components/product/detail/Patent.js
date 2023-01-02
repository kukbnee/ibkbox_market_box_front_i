import moment from 'moment'

const Patent = (props) => {
  const { patentList } = props
  return (
    <div className="section section02 padding-left-right01">
      <p className="section_title">특허 정보</p>

      <div className="patent_wrap">
        <div className="parent_cover">
          <div className="patent tr">
            <div className="cell info01">특허명</div>
            <div className="cell info02">IPC</div>
            <div className="cell info03">법적상태</div>
            <div className="cell info04">출원번호/일자</div>
            <div className="cell info05">출원인</div>
            <div className="cell info06">등록번호/일자</div>
          </div>

          {patentList?.map((patent, index) => (
            <div className="patent td" key={index}>
              <div className="cell info01">{patent.ptntNm}</div>
              <div className="cell info02">{patent.ptntIpc}</div>
              <div className="cell info03">{patent.ptntStts}</div>
              <div className="cell info04">{`${patent.ptntAlfrNo} (${moment(patent.ptntAlfrTs).format(
                'YYYY.MM.DD'
              )})`}</div>
              <div className="cell info05">{patent.ptntRlocaus}</div>
              <div className="cell info06">{patent.ptntRtn &&`${patent.ptntRtn} (${moment(patent.ptntTs).format('YYYY.MM.DD')})`}</div>
            </div>
          ))}
        </div>
      </div>

      {patentList?.map((patent, index) => (
        <div className="patent_responsive_design" key={index}>
          <div className="table_content">
            <div className="cell tr">특허명</div>
            <div className="cell td">{patent.ptntNm}</div>
            <div className="cell tr">IPC</div>
            <div className="cell td">
              <p>{patent.ptntIpc}</p>
            </div>
            <div className="cell tr">법적상태</div>
            <div className="cell td">
              <p>{patent.ptntStts}</p>
            </div>
            <div className="cell through">
              <div className="title">출원번호/일자</div>
              <div className="info">
                <p className="text02">{patent.ptntAlfrNo}</p>
                <p className="text02">({moment(patent.ptntAlfrTs).format('YYYY.MM.DD')})</p>
              </div>
            </div>
            <div className="cell through">
              <div className="title">출원인</div>
              <div className="info">{patent.ptntRlocaus}</div>
            </div>
            <div className="cell through">
              <div className="title">등록번호/일자</div>
              <div className="info">
                <p className="text02">{patent.ptntRtn}</p>
                <p className="text02">{patent.ptntTs && (`(${moment(patent.ptntTs).format('YYYY.MM.DD')})`)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Patent
