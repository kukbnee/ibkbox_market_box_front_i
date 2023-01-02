import Button from 'components/atomic/Button'

const QnaUserChatBtnForm = (props) => {

  const { index, sentMessageFlg, pcsnSttsId, handleClickBtn } = props
  const msgSentFlgType = {
    Y: {
      ESS02001: <div className="btn_wrap">
                  <Button className="btn full_peach" onClick={() => handleEstimate('cancel')}>견적취소</Button>
                  <Button className="btn full_blue" onClick={(idx) => handleEstimate('detail', idx)}>상세보기</Button>
                </div>,
      ESS02002: <div className="btn_wrap">
                  <Button className="btn linear_blue" onClick={() => handleEstimate('detail')}>상세보기</Button>
                </div>,
      ESS02003: <p className="cancel_text">취소된 견적입니다.</p>,
      ESS02004: <div className="btn_wrap">
                  <Button className="btn linear_blue" onClick={() => handleEstimate('detail')}>상세보기</Button>
                </div>,
    },
    N: {
      ESS02001: <div className="btn_wrap">
                  <Button className="btn linear_blue" onClick={() => handleEstimate('detail')}>상세보기</Button>
                  <Button className="btn full_blue" onClick={() => handleEstimate('pay')}>결제하기</Button>
                </div>,
      ESS02002: <div className="btn_wrap">
                  <Button className="btn linear_blue" onClick={() => handleEstimate('detail')}>상세보기</Button>
                </div>,
      ESS02003: <p className="cancel_text">취소된 견적입니다.</p>,
      ESS02004: <div className="btn_wrap">
                  <Button className="btn linear_blue" onClick={() => handleEstimate('detail')}>상세보기</Button>
                </div>,
    },
  }

  const handleEstimate = (type) => {
    handleClickBtn(type, index)
  }

  if(sentMessageFlg && pcsnSttsId) return msgSentFlgType?.[sentMessageFlg]?.[pcsnSttsId]
  else return null
}

export default QnaUserChatBtnForm
