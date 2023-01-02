import { useState, useEffect, useCallback } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import RequestEachItem from 'components/mypage/agency/RequestEachItem'
import NoRequestList from 'components/mypage/agency/NoRequestList'
import PopupAlert from 'components/PopupAlert'
import PopupRejectReason from 'components/mypage/agency/PopupRejectReason'
import NoResult from 'components/NoResult'

const AgencyList = (props) => {
  const { paramsList, agnecyList, listTotal, tabData, setListRefresh } = props
  const [isAlert, setIsAlert] = useState(false)
  const [isPopup, setIsPopup] = useState({
    active: false,
    msg: '',
    btnMsg: '닫기',
    btnMsg2: '',
    popItemState: ''
  })
  const [isReason, setIsReason] = useState({
    active: false,
    type: 'reason',
    text: '',
    title: '반려',
    btnMsg: '확인',
    reasonText: ''
  })
  const [paramsAction, setParamsAction] = useState({
    agenInfId: '',
    pcsnCon: ''
  })
  const [paramsReason, setParamsReason] = useState({ agenInfId: null })

  const popupMsgList = {
    sen: {
      COC01001: { msg: '에이전시 요청을 취소하시겠습니까?', btnMsg: '요청 취소', btnMsg2: '닫기', btnAction: 'cancel' },
      COC01003: {
        msg: '해당 제품의 에이전시를 취소하시겠습니까? \n 취소하면 더 이상 판매를 할 수 없습니다.',
        btnMsg: '에이전시 취소',
        btnMsg2: '닫기',
        btnAction: 'approvalCancel'
      }
    },
    rec: {
      COC01001: {
        msg: '해당 상품에 대해 에이전시를 승인하시겠습니까?',
        btnMsg: '승인',
        btnMsg2: '닫기',
        btnAction: 'approval'
      },
      COC01003: {
        msg: '해당 제품의 에이전시를 취소하시겠습니까?\n 취소하면 더 이상 판매를 할 수 없습니다.',
        btnMsg: '에이전시 취소',
        btnMsg2: '닫기',
        btnAction: 'approvalCancel'
      },
      COC01006: {
        msg: '승인 취소 해제를 진행하시겠습니까? \n취소를 해제하면 해당 에이전시가 다시 상품을 판매할 수 있습니다.',
        btnMsg: '취소해제',
        btnMsg2: '닫기',
        btnAction: 'approvalRecover'
      }
    }
  }

  const handlePopupOn = useCallback(
    (type, state, agenInfId) => {
      switch (type) {
        case 'confirm':
          {
            setIsPopup({
              ...isPopup,
              active: true,
              msg: popupMsgList?.[paramsList.agenSearchType]?.[state]?.msg,
              btnMsg: popupMsgList?.[paramsList.agenSearchType]?.[state]?.btnMsg,
              btnMsg2: popupMsgList?.[paramsList.agenSearchType]?.[state]?.btnMsg2,
              popItemState: state
            })
            setParamsAction({ ...paramsAction, agenInfId: agenInfId })
          }
          break
        case 'result':
          setIsPopup({
            ...isPopup,
            active: true,
            msg: state,
            btnMsg: '확인',
            btnMsg2: '',
            popItemState: ''
          })
          break
      }
    },
    [isPopup, paramsList, paramsAction]
  )

  const handlePopupOff = useCallback(
    (btnType) => {
      let btnActionType = popupMsgList?.[paramsList?.agenSearchType]?.[isPopup?.popItemState]?.btnAction
      if (btnType === 'btnMsg' && btnActionType != undefined) {
        switch (btnActionType) {
          case 'cancel': //취소
            postAgencyCancel()
            break
          case 'approval': //승인
            postAgencyApproval()
            break
          case 'approvalCancel': //승인취소
            postAgencyApprovalCancel()
            break
          case 'approvalRecover': //취소해제
            postAgencyApprovalRecover()
            break
        }
      } else {
        setIsPopup({ ...isPopup, active: false })
        setIsReason({ ...isReason, active: false })
      }
    },
    [isPopup, paramsList, isReason]
  )

  const handleReject = useCallback(
    (action, agenInfId) => {
      switch (action) {
        case 'reason':
          setParamsReason({ ...paramsReason, agenInfId: agenInfId })
          break
        case 'reject':
          {
            setIsReason({
              ...isReason,
              active: true,
              type: action,
              text: '반려사유를 입력해주세요. 최대 1,000자 까지 입력 가능합니다.',
              title: '반려하기',
              btnMsg: '반려'
            })
            setParamsAction({ ...paramsAction, agenInfId: agenInfId })
          }
          break
        case 'approvalReject':
          {
            if (paramsAction?.pcsnCon?.length > 0) postAgencyReject()
            else handleAlert()
          }
          break
      }
    },
    [paramsReason, isReason, paramsAction]
  )

  const onChangeRejectReasonText = useCallback(
    (e) => {
      setParamsAction({ ...paramsAction, pcsnCon: e.target.value })
    },
    [paramsAction]
  )

  const handleAlert = useCallback(() => {
    setIsAlert(!isAlert)
  }, [isAlert])

  const getAgencyReason = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_REASON,
      method: 'get',
      params: paramsReason
    }).then((response) => {
      if (response?.data?.code === '200') {
        setIsReason({
          ...isReason,
          active: true,
          type: 'reason',
          text: response.data.data?.pcsnCon,
          title: '반려사유',
          btnMsg: '확인'
        })
      }
    })
  }, [paramsReason])

  const postAgencyCancel = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_CANCEL,
      method: 'post',
      params: paramsAction
    }).then((response) => {
      let alertMsg = ''
      if (response?.data?.code === '200') {
        alertMsg = '취소 완료되었습니다.'
        setListRefresh()
      } else {
        alertMsg = response.data.data
      }
      handlePopupOn('result', alertMsg, '')
    })
  }, [paramsAction])

  const postAgencyReject = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_REJECT,
      method: 'post',
      params: paramsAction
    }).then((response) => {
      let alertMsg = ''
      if (response?.data?.code === '200') {
        alertMsg = '반려가 완료되었습니다.'
        setListRefresh()
      } else {
        alertMsg = response.data.data
      }
      setIsReason({ ...isReason, active: false })
      handlePopupOn('result', alertMsg, '')
    })
  }, [paramsAction, isReason])

  const postAgencyApproval = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_APPROVAL,
      method: 'post',
      data: paramsAction
    }).then((response) => {
      let alertMsg = ''
      if (response?.data?.code === '200') {
        alertMsg = '승인 완료되었습니다.'
        setListRefresh()
      } else {
        alertMsg = response.data.data
      }
      handlePopupOn('result', alertMsg, '')
    })
  }, [paramsAction])

  const postAgencyApprovalCancel = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_APPROVAL_CANCEL,
      method: 'post',
      params: paramsAction
    }).then((response) => {
      let alertMsg = ''
      if (response?.data?.code === '200') {
        alertMsg = '승인 취소 완료되었습니다.'
        setListRefresh()
      } else {
        alertMsg = response.data.data
      }
      handlePopupOn('result', alertMsg, '')
    })
  }, [paramsAction])

  const postAgencyApprovalRecover = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_AGENCY_APPROVAL_RECOVERY,
      method: 'post',
      params: paramsAction
    }).then((response) => {
      let alertMsg = ''
      if (response?.data?.code === '200') {
        alertMsg = '취소 해제 완료되었습니다.'
        setListRefresh()
      } else {
        alertMsg = response.data.data
      }
      handlePopupOn('result', alertMsg, '')
    })
  }, [paramsAction])


  useEffect(() => {
    if (paramsReason.agenInfId != null) {
      getAgencyReason()
    }
  }, [paramsReason])


  return (
    <>
      {isPopup?.active && (
        <PopupAlert
          handlePopup={(btnType) => handlePopupOff(btnType)}
          className={'popup_review_warning'}
          msg={isPopup?.msg}
          btnMsg={isPopup?.btnMsg}
          btnMsg2={isPopup?.btnMsg2}
        />
      )}
      {isReason?.active && (
        <PopupRejectReason handlePopup={(btnType) => handlePopupOff(btnType)} className={'reject_reason_popup'}>
          <div className="confirm_msg_wrap">
            <p className="title_text">{isReason?.title}</p>
            <div className="textarea_wrap">
              <textarea
                className="textarea scroll"
                placeholder={isReason?.text}
                disabled={isReason?.type === 'reject' ? false : true}
                onChange={(e) => onChangeRejectReasonText(e)}
                title={'reject'}
              />
            </div>
            <div className="button_wrap">
              <Button
                className="full_blue btn"
                onClick={() => {
                  isReason?.type === 'reject' ? handleReject('approvalReject') : handlePopupOff('close')
                }}
              >
                {isReason?.btnMsg}
              </Button>
            </div>
          </div>
        </PopupRejectReason>
      )}
      {isAlert && (
        <PopupAlert
          handlePopup={handleAlert}
          className={'popup_review_warning'}
          msg={'반려 사유를 입력해주세요.'}
          btnMsg={'확인'}
        />
      )}
      <div className="table_list_wrap each_list_wrap">
        <div className="table_header each_header req_each_item">
          <div className="cell cell_num">NO</div>
          <div className="cell cell_info">상품정보</div>
          <div className="cell cell_target">요청대상</div>
          <div className="cell cell_day">요청일</div>
          <div className="cell cell_state">상태</div>
        </div>
        <ul className="table_list each_list">
          {tabData?.cnt > 0 ? (
            agnecyList?.length > 0 ? (
              agnecyList?.map((item, index) => (
                <li className="table_row each_item_row" key={'each_prod_item_' + index}>
                  <RequestEachItem
                    data={item}
                    index={index}
                    paramsList={paramsList}
                    totalAgency={listTotal}
                    actionCheckAlert={(state, agenInfId) => handlePopupOn('confirm', state, agenInfId)}
                    actionReject={(action, agenInfId) => handleReject(action, agenInfId)}
                  />
                </li>
              ))
            ) : (
              <NoResult msg={'요청 내역이 없습니다.'} />
            )
          ) : (
            <li className="table_row each_item_row no_result_wrap">
              <NoRequestList isTab={paramsList.agenSearchType} />
            </li>
          )}
        </ul>
      </div>
    </>
  )
}

export default AgencyList
