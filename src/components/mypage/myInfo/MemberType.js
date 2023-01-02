import Checkbox from 'components/atomic/Checkbox'

const MemberType = (props) => {
  const { data } = props

  return (
    <div className="inner">
      <div className="tit_area">
        <p className="title">회원구분</p>
      </div>
      <div className="table_list_wrap">
        <ul className="table_list">
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">
                회원타입
                <div className="info_tooltip_wrap">
                  <button className={'btn_help'}>
                    <span className="hide">정보살펴보기</span>
                  </button>
                  <div className="info_tooltip">
                    <div className="tooltip_inner">
                      <div className="tit_section">
                        <p className="tit">회원타입</p>
                        <button className="btn_delete_grey">
                          <span className="hide">삭제</span>
                        </button>
                      </div>
                      <p className="cnt nowrap">
                        정회원 등록 완료 후에 세금계산서 발행&#44;
                        <br />
                        에이전시 신청 등 가능합니다&#46;
                        <br />
                        정회원은 사업자인증을 진행한 회원입니다&#46;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cell cell_cnt">{data?.mmbrtypeName}</div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">
                판매타입
                <div className="info_tooltip_wrap">
                  <button className={'btn_help'}>
                    <span className="hide">정보살펴보기</span>
                  </button>
                  <div className="info_tooltip">
                    <div className="tooltip_inner">
                      <div className="tit_section">
                        <p className="tit">판매타입</p>
                        <button className="btn_delete_grey">
                          <span className="hide">삭제</span>
                        </button>
                      </div>
                      <p className="cnt nowrap">
                        본인이 직접 등록한 제품일 경우 셀러를&#44;
                        <br />
                        본인이 직접 등록하지 않은 제품을 판매대행
                        <br />
                        할 수 있는 권한이 획득된 경우 에이전시에도
                        <br />
                        체크되어있습니다&#46;
                        <br />
                        <br />
                        에이전시는 마이페이지 &#62; 에이전시에서
                        <br />
                        신청가능합니다&#46;
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cell cell_cnt">
                <div className="checkbox">
                  <Checkbox label={'셀러'} checked={data?.mmbrtypeId === 'SRS00004' ? false : true} readOnly />
                  <Checkbox label={'에이전시'} checked={data?.mmbrtypeId === 'SRS00003' ? true : false} readOnly />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MemberType
