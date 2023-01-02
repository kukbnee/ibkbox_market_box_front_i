import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'components/atomic/Button'

const PayNone = () => {

  const history = useHistory()
  const handleLinkBack = useCallback(() => {
    history.goBack()
  }, [])

  return (
    <div className="paymentnone_container">
      <div className="paymentnone">
        <p className="title">
          결제 가능한 상품정보가 없습니다.
          <br />
          판매자에게 직접 문의해주세요.
        </p>
        <Button className={'full_blue req'} onClick={handleLinkBack}>이전화면으로 돌아가기</Button>
      </div>
    </div>
  )
}

export default PayNone
