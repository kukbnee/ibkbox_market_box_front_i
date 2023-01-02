import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import PathConstants from 'modules/constants/PathConstants'
import Button from 'components/atomic/Button'

const Deprive = (props) => {

  const {applyData, agencyId} = props
  const history = useHistory()
  const wordOfAgencyId = {
    COC01004: '반려',
    COC01006: '박탈'
  }
  const handleLink = useCallback(() => {
    history.push(PathConstants.MY_PAGE_QNA_ADMIN_REGISTER)
  }, [])

  return (
    <div className="agency_container">
      <div className="mypage agency"> 
          <div className="agency_container">
            <div className="agency_first ing deprive">
              <p className="title">에이전시 권한 요청이 {wordOfAgencyId?.[agencyId]}되었습니다&#46;</p>
              <div className="sub_wrap">
                <div className="sub_title blue division_line">
                  <p className="text">에이전시 요청 날짜</p>
                  <p>{applyData?.rgsnTs}</p>
                  <p className="date">{applyData?.reqDate ? moment(applyData?.reqDate).format('YYYY-MM-DD') : null}</p>
                </div>
                <div className="sub_title red division_line">
                  <p className="text">에이전시 요청 {wordOfAgencyId?.[agencyId]}일</p>
                  <p className="date">{applyData?.stateDate ? moment(applyData?.stateDate).format('YYYY-MM-DD') : null}</p>
                </div>
              </div>
              <p className="admin_check blue">자세한 사항은 관리자 문의를 통해서 확인해주세요.</p>
              <Button className={'full_blue req cancel ask'} onClick={handleLink}>관리자 문의하기</Button>
            </div>
          </div>
      </div>
    </div>
  )
}

export default Deprive
