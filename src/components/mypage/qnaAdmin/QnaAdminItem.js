import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import moment from 'moment'

const QnaAdminItem = (props) => {

  const { data, index, params, totalLength} = props
  const history = useHistory()
  const stateLabelList = {
    AIS01001: { class: "cell current orange", label: "답변대기" },
    AIS01002: { class: "cell current blue", label: "답변완료" }
  }

  const handleLink = useCallback(() => {
    history.push({pathname: PathConstants.MY_PAGE_QNA_ADMIN_DETAIL, state: data})
  }, [])


  return (
    <div className="ask_item td" onClick={handleLink} style={{cursor: 'pointer'}}>
      <div className="cell num">{totalLength - ((params?.page - 1) * params?.record) - index}</div>
      <div className="cell type">{data?.inquTypeName}</div>
      <div className="cell title">
        <div className="title_wrap">{data?.ttl}</div>
      </div>
      <div className="cell mo_date">{data?.rgsnTs? moment(data?.rgsnTs).format('YYYY.MM.DD HH:mm:ss') : null}</div>
      <div className="cell date">{data?.rgsnTs? moment(data?.rgsnTs).format('YYYY.MM.DD HH:mm:ss') : null}</div>
      <div className={stateLabelList?.[data?.inquSttId]?.class}>{data?.inquSttName}</div>
      <div className="cell mo_title">
        <div className="title_wrap">{data?.ttl}</div>
      </div>
    </div>
  )
}

export default QnaAdminItem
