import { useState, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PathConstants from 'modules/constants/PathConstants'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import Pagination from 'components/atomic/Pagination'
import QnaAdminItem from 'components/mypage/qnaAdmin/QnaAdminItem'

const QnaAdminList = (props) => {
  const history = useHistory()
  const [qnaAdminListData, setQnaAdminListData] = useState({})
  const [params, setParams] = useState({ page: 1, record: 10 })

  const handleLink = useCallback(() => {
    history.push(PathConstants.MY_PAGE_QNA_ADMIN_REGISTER)
  }, [])

  const handlePagination = (page) => {
    setParams({ ...params, page: page })
  }

  const getQnaAdminList = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_QNA_ADMIN_LIST,
      method: 'get',
      params: params
    }).then((response) => {
      if (response?.data?.code === '200') {
        setQnaAdminListData(response.data.data)
      }
    })
  }, [params])

  useEffect(() => {
    getQnaAdminList()
  }, [params])

  return (
    <div className="mypage ask">
      <div className="container">
        <BreadCrumbs {...props} />
        <div className="page_header">
          <div className="title_wrap">
            <h2 className="page_title">관리자 문의</h2>
          </div>
          <div className="btn_group">
            <Button className={'full_blue btn'} onClick={handleLink}>
              문의 등록
            </Button>
          </div>
        </div>
        <div className="ask_wrap">
          <div className="ask_list">
            <div className="ask_item tr">
              <div className="cell num">NO</div>
              <div className="cell type">유형</div>
              <div className="cell title">제목</div>
              <div className="cell date">등록일시</div>
              <div className="cell current">처리현황</div>
            </div>
            {qnaAdminListData?.list?.length > 0 ? (
              qnaAdminListData.list.map((item, idx) => (
                <QnaAdminItem
                  key={idx}
                  data={item}
                  index={idx}
                  params={params}
                  totalLength={qnaAdminListData.total}
                />
              ))
            ) : (
              <div className="no_ask_data">등록된 관리자 문의가 없습니다.</div>
            )}
            {qnaAdminListData?.totalPage > 0 && (
              <div className="pagination_wrap">
                <Pagination
                  page={qnaAdminListData?.page}
                  totalPages={qnaAdminListData?.totalPage}
                  handlePagination={(page) => handlePagination(page)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QnaAdminList
