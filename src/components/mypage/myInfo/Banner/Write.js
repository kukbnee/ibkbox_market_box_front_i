import { useCallback, useEffect } from 'react'
import Button from 'components/atomic/Button'
import WriteItem from 'components/mypage/myInfo/Banner/WriteItem'

const Write = (props) => {

  const { params, setParams, setPopupAlert } = props

  const handleAddInput = useCallback(() => {
    let blankItem = {
      fileId: '',
      imgptrnId: '',
      ttl: '',
      url: '',
      infoSqn: '',
      oppbYn: 'Y',
      fileNm: ''
    }
    let bannerList = params
    bannerList.push(blankItem)
    setParams([ ...bannerList ])
  }, [params])

  useEffect(() => {
    if(params?.length === 0) handleAddInput()
  }, [])

  return (
    <>
      <div className="guide_text_wrap">
        <p className="guide_text">* 배너 이미지는 jpg, png, jpeg 형식만 가능하며 최대 3개까지 등록 가능합니다.</p>
        <p className="guide_text">* 배너 이미지의 적정 사이즈는 가로 498px, 세로 280px 입니다.</p>
        <p className="guide_text">* 배너 url은 주소 앞에 https://를 입력해주셔야 정상적으로 이동합니다.</p>
      </div>
      {params?.length > 0 && (
        params.map((item, index) => (
          <WriteItem 
            key={index}
            data={item} 
            index={index}
            params={params}
            setParams={setParams}
            setPopupAlert={setPopupAlert} />
        ))
      )}
      {params?.length < 3 && (
        <div className="more_btn_wrap">
          <Button onClick={handleAddInput}><span className="hide">추가하기</span></Button>
        </div>
      )}
    </>
  )
}

export default Write
