import { useCallback, useState, useEffect } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import Contents from 'components/mypage/myInfo/Banner/Contents'
import Write from 'components/mypage/myInfo/Banner/Write'

const Banner = (props) => {

  const { data, originBannerList, setMyData, setPopupAlert } = props
  const [isWrite, setIsWrite] = useState(false)
  const [params, setParams] = useState([
    {
      fileId: '',
      imgptrnId: '',
      ttl: '',
      url: '',
      infoSqn: '',
      oppbYn: 'Y',
      fileNm: ''
    }
  ])

  const handleisWrite = useCallback((type) => {
    switch(type){
      case 'cancel':
        setIsWrite(!isWrite)
        if(params?.length && (params[0].ttl === '' || params[0].url === '' || params[0].fileId === '' || params[0].fileNm === '' )){ //하나도 작성 안하고서 취소 눌렀을 때
          setParams([
            {
              fileId: '',
              imgptrnId: '',
              ttl: '',
              url: '',
              infoSqn: '',
              oppbYn: 'Y',
              fileNm: ''
            }
          ])
          setMyData({ ...data, bannerInfoList: [] })
        } else {
          //원래 저장된 배너 정보 복원
          setParams( originBannerList )
          setMyData({ ...data, bannerInfoList: [ ...originBannerList ] })
        }
        break
      case 'edit':
        setIsWrite(!isWrite)
        break
    }
  }, [isWrite, data, params, originBannerList])


  const handleSave = useCallback(() => {
    let checkCnt = 0
    params.map((item) => {
      if(item.ttl?.length < 1){
        setPopupAlert({ active: true, type: 'ALERT', msg: '배너 제목을 입력해주세요.', btnMsg: '확인' })
        return
      }

      if(item.url?.length < 5){
        setPopupAlert({ active: true, type: 'ALERT', msg: '배너 URL을 입력해주세요.', btnMsg: '확인' })
        return
      }

      if(item.fileNm?.length < 1){
        setPopupAlert({ active: true, type: 'ALERT', msg: '배너 이미지를 업로드해주세요.', btnMsg: '확인' })
        return
      }

      checkCnt++
    })
    if(checkCnt === params.length) postInfoBannerSave()
  }, [params])

  const postInfoBannerSave = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_INFO_BANNER_SAVE,
      method: 'post',
      data: {sellerBannerList: params}
    }).then((response) => {
      if(response?.data?.code === '200'){
        handleisWrite('edit')
        setMyData({ ...data, bannerInfoList: [ ...params ] })
      } else {
        setPopupAlert({ active: true, type: 'ALERT', msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.', btnMsg: '확인' })
      }
    })
  }, [data, params])

  useEffect(() => {
    setParams( data.bannerInfoList )
  }, [data])

  return (
    <>
      <div className="inner">
        <div className="tit_area">
          <p className="title">홈화면 배너</p>
          {isWrite ? (
            <div className="btn_wrap">
              <Button className={'btn linear_blue'} onClick={() => handleisWrite('cancel')}>취소</Button>
              <Button className={'btn full_blue'} onClick={handleSave}>저장</Button>
            </div>
          ) : (
            <Button className={'btn full_blue edit'} onClick={() => handleisWrite('edit')}>수정</Button>
          )}
        </div>
        {isWrite ? (
          <Write params={params} setParams={setParams} setPopupAlert={setPopupAlert} />
        ) : (
          <Contents data={data.bannerInfoList} />
        )}
      </div>
    </>
  )
}

export default Banner
