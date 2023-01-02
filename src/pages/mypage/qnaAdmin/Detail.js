import { useState, useEffect, useContext, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { UserContext } from 'modules/contexts/common/userContext'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import moment from 'moment'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'

const QnaAdminDetail = (props) => {
  const history = useHistory()
  const location = useLocation()
  const admInquInfId = location?.state?.admInquInfId
  const userContext = useContext(UserContext)
  const [qnaDetailData, setQnaDetailData] = useState({})
  const [isPopup, setIsPopup] = useState({
    state: false,
    msg: '',
    btnMsg: '확인'
  })
  const stateLabelList = {
    AIS01001: { class: 'orange', label: '답변대기' },
    AIS01002: { class: 'blue', label: '답변완료' }
  }

  const handleLinkBack = useCallback(() => {
    history.goBack()
  }, [])

  const handlePopup = () => {
    setIsPopup({ ...isPopup, state: !isPopup })
  }

  const handleAttechedFile = (fileId) => {
    getFileDownload(fileId)
  }

  const handleQnaDelete = useCallback(() => {
    postQnaAdminDelete()
  }, [])

  const getQnaAdminDetail = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_QNA_ADMIN_DETAIL,
      method: 'get',
      params: { admInquInfId: admInquInfId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setQnaDetailData(response.data.data)
      }
    })
  }, [admInquInfId])

  const getFileDownload = useCallback(async (fileId) => {
    await Axios({
      url: API.FILE.DOWNLOAD + fileId,
      method: 'get',
      params: fileId
    }).then((response) => {
      if (response?.status === 200 && response?.request?.responseURL != null) {
        window.open(response.request.responseURL)
      } else {
        setIsPopup({
          ...isPopup,
          state: true,
          msg: '파일을 다운로드 할 수 없습니다.'
        })
      }
    })
  }, [])

  const postQnaAdminDelete = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_QNA_ADMIN_DELETE,
      method: 'post',
      data: { admInquInfId: admInquInfId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        handleLinkBack()
      }
    })
  }, [admInquInfId])

  useEffect(() => {
    getQnaAdminDetail()
  }, [admInquInfId])

  const contentsSpace = (con) => {
    return (
      <div className="table_list content scroll">
        <div className="cell conBody" style={{whiteSpace: 'pre-line'}}>{con}</div>
      </div>
    )
  }

  return (
    <>
      {isPopup?.state && (
        <PopupAlert
          handlePopup={(btnType) => handlePopup(btnType)}
          className={'popup_review_warning'}
          msg={isPopup?.msg}
          btnMsg={isPopup?.btnMsg}
        />
      )}
      <div className="mypage product each_write ask_detail">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">관리자 문의 상세</h2>
            </div>
          </div>
          <div className="ask_detail_layout detail_layout">
            <div className="table_wrap">
              <div className="table_list">
                <div className="cell td">제목</div>
                <div className="cell tr">
                  <div className="title_wrap">{qnaDetailData?.adminQnaVO?.ttl}</div>
                </div>
              </div>
              <div className="table_list">
                <div className="cell td">유형</div>
                <div className="cell tr">{qnaDetailData?.adminQnaVO?.inquTypeName}</div>
              </div>
              <div className="table_list double">
                <div className="cell td">등록일</div>
                <div className="cell tr">
                  {qnaDetailData?.adminQnaVO?.rgsnTs
                    ? moment(qnaDetailData?.adminQnaVO?.rgsnTs).format('YYYY.MM.DD HH:mm:ss')
                    : null}
                </div>
                <div className="cell td">답변상태</div>
                <div className="cell tr">
                  <p className={stateLabelList?.[qnaDetailData?.adminQnaVO?.inquSttId]?.class}>
                    {qnaDetailData?.adminQnaVO?.inquSttName}
                  </p>
                </div>
              </div>
              {contentsSpace(qnaDetailData?.adminQnaVO?.con)}
              <div className="table_list">
                <div className="cell td last">첨부파일</div>
                <div className="cell tr">
                  <div className="button_wrap">
                    {qnaDetailData?.adminQnaVO?.adminQnaFileVOList?.length > 0
                      ? qnaDetailData.adminQnaVO.adminQnaFileVOList.map((item, idx) => (
                          <Button key={idx} className="btn blue" onClick={() => handleAttechedFile(item?.fileId)}>
                            {item?.fileNm}
                          </Button>
                        ))
                      : <span>첨부된 파일이 없습니다.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {qnaDetailData?.adminQnaAnswerVOList?.length > 0 ? (
            <div className="ask_detail_layout detail_layout layout2">
              <div className="table_wrap">
                <div className="table_list double">
                  <div className="cell td">담당자</div>
                  <div className="cell tr">IBK관리자</div>
                  <div className="cell td">등록일시</div>
                  <div className="cell tr">
                    {qnaDetailData?.adminQnaAnswerVOList[0]?.rgsnTs
                      ? moment(qnaDetailData?.adminQnaAnswerVOList[0]?.rgsnTs).format('YYYY.MM.DD HH:mm:ss')
                      : null}
                  </div>
                </div>
                {contentsSpace(qnaDetailData?.adminQnaAnswerVOList[0]?.admCon)}
              </div>
            </div>
          ) : null}
        </div>
        <div className="page_bottom btn_group">
          <Button className={'linear_blue'} onClick={handleLinkBack}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={handleQnaDelete}>
            삭제
          </Button>
        </div>
      </div>
    </>
  )
}

export default QnaAdminDetail
