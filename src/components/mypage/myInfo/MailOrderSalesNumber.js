import { useCallback, useState, useEffect, useContext } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import { UserContext } from 'modules/contexts/common/userContext'

const MailOrderSalesNumber = (props) => {

  const { data, setData, setPopupAlert } = props
  const userContext = useContext(UserContext)
  const [isEdit, setIsEdit] = useState(false)
  const [reportNum, setReportNum] = useState('') //임시 저장

  const handleisEdit = useCallback((type) => {
    switch (type) {
      case 'cancel': {
        setIsEdit(!isEdit)
        setReportNum(data.csbStmtno)
        break
      }
      case 'edit':
        setIsEdit(!isEdit)
        break
    }
  }, [isEdit, data])

  const onChangeForm = useCallback((e) => {
    setReportNum(e.target.value)
  }, [reportNum])

  const postSaveNum = useCallback(async() => {
    await Axios({
      url: API.MYPAGE.MY_SELLER_SAVE,
      method: 'post',
      data: { csbStmtno: reportNum }
    }).then((response) => {
      if (response?.data?.code === '200') {
        let myInfo = data
        myInfo['csbStmtno'] = reportNum
        setData({ ...myInfo })
        setIsEdit(!isEdit)
        userContext?.actions?.getUserInfo() //유저 context 업데이트
      } else if (response?.data?.code != '200' && response?.data?.message){
        setPopupAlert({ active: true, type: 'ALERT', msg: response.data.message, btnMsg: '확인' })
      } else {
        setPopupAlert({ active: true, type: 'ALERT', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.', btnMsg: '확인' })
      }
    })
  }, [data, reportNum])

  useEffect(() => {
    if (data.bplcNm && data?.oriBplcNm === undefined) {
      setReportNum(data.csbStmtno)
    }
  }, [data])


  return (
    <div className="inner">
      <div className="tit_area">
        <p className="title">통신판매업신고번호</p>
        {isEdit ? (
          <div className="btn_wrap">
            <Button className={'btn linear_blue'} onClick={() => handleisEdit('cancel')}>
              취소
            </Button>
            <Button className={'btn full_blue'} onClick={postSaveNum}>
              저장
            </Button>
          </div>
        ) : (
          <Button className={'btn full_blue edit'} onClick={() => handleisEdit('edit')}>
            수정
          </Button>
        )}
      </div>
      <div className="table_list_wrap">
        <ul className="table_list">
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_header">통신판매업신고번호</div>
              <div className="cell cell_cnt">
                {isEdit ? (
                  <input
                    type="text"
                    className="input"
                    id={'csbStmtno'}
                    title={'csbStmtno'}
                    value={reportNum}
                    onChange={onChangeForm}
                  />
                ) : (
                  data?.csbStmtno
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default MailOrderSalesNumber
