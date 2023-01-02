import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import moment from 'moment'
import Button from 'components/atomic/Button'
import ProductInfo from 'components/mypage/estimation/ProductInfo'

const QnaUserListItem = (props) => {

  const { data, index, params, totalLength } = props
  const history = useHistory()
  const inquiryUser = {
    Y: data?.selrUsisName,
    N: data?.inquUsisName
  }

  const linkProductDetail = useCallback(() => {
    history.push({pathname: `${PathConstants.MY_PAGE_QNA_USER_VIEW}/${data?.inqrInfoId}`, state: data})
  }, [data])

  return (
    <div className="item_section req_each_item inq_each_item">
      <div className="cell cell_num">{totalLength - ((params?.page - 1) * params?.record) - index}</div>
      <ProductInfo
        type={'QNA'}
        classCell={"cell cell_info"}
        classWrap={"content_wrap"}
        classPrcWrap={"flex_row_wrap"}
        textColor={"#333139"}
        data={data}
        handleLink={linkProductDetail}
      />
      <div className="cell cell_target">
        <div className="flex_row_wrap">
          <p className="req_com">{inquiryUser?.[data?.inquYn]}</p>
        </div>
      </div>
      <div className="cell cell_day">
        {data?.lastMessageDt ? moment(data?.lastMessageDt).format('YYYY-MM-DD') : null}
        <br />
        {data?.lastMessageDt ? moment(data?.lastMessageDt).format('HH:mm') : null}
      </div>
      <div className="cell cell_state">
        <Button className={data?.cnfaYn === "N" ? "btn full_blue widthsm on" : "btn full_blue widthsm"} onClick={linkProductDetail}>메시지</Button>
      </div>
    </div>
  )
}

export default QnaUserListItem
