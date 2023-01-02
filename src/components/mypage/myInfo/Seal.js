import { useCallback, useRef, useState, useContext, useEffect } from 'react'
import Button from 'components/atomic/Button'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { UserContext } from 'modules/contexts/common/userContext'

const Seal = (props) => {

  const { data, setData, setPopupAlert } = props
  const [isWrite, setIsWrite] = useState(false)
  const userContext = useContext(UserContext)
  const hiddenFileInputRef = useRef()
  const allowExtensions = ['jpeg', 'JPEG', 'jpg', 'JPG', 'PNG', 'png']
  const [sealData, setSealData] = useState({
    rgslImgFileId: null,
    rgslImgFileUrl: null
  })

  const onClickFindFile = useCallback(() => {
    hiddenFileInputRef.current.click()
  }, [])

  const handleisWrite = useCallback((type) => {
    if (type === 'CANCEL') { //취소 누르면 SEAL 업로드 초기화
      if (data?.rgslImgFileId === null) { //기존에 인감이 등록되어 있지 않은 경우
        setSealData({
          rgslImgFileId: null,
          rgslImgFileUrl: null
        })
      } else { //기존에 인감이 등록되어 있는 경우
        setSealData({
          rgslImgFileId: data?.rgslImgFileId,
          rgslImgFileUrl: data?.rgslImgFileUrl
        })
      }
      setIsWrite(false)
    } else {
      setIsWrite(!isWrite)
    }
  }, [data, isWrite])

  const onChangeImgFile = useCallback(async (e) => {
    let file = e?.target?.files[0]
    if (file === undefined) return

    const fileForm = new FormData()
    fileForm.append('file', file)
    let fileName = e.target.files[0]?.name?.split('.')
    if (allowExtensions.includes(fileName[fileName.length - 1])) {
      await Axios({
        url: API.FILE.UPLOAD,
        method: 'post',
        data: fileForm,
        fileUpload: true
      }).then(async (response) => {
        if (response.data.code === '200' && response?.data?.data?.fileId) {
          setSealData({
            rgslImgFileId: response?.data?.data?.fileId,
            rgslImgFileUrl: response?.data?.data?.imgUrl
          })
        } else {
          setPopupAlert({
            active: true,
            type: 'ALERT',
            msg: '오류가 발생했습니다.\n잠시 후 다시 시도해주세요.',
            btnMsg: '확인'
          })
        }
      })
    } else {
      setPopupAlert({
        active: true,
        type: 'ALERT',
        msg: '지원하지 않는 형식의 파일입니다.',
        btnMsg: '확인'
      })
    }
  }, [data])

  const handleSave = useCallback(() => {
    if (sealData?.rgslImgFileId != null) sealUpload()
    else if (data?.rgslImgFileId != null && sealData?.rgslImgFileId === null) sealRemove()
    else handleisWrite('CANCEL')
  }, [data, sealData])

  const handleRemove = useCallback(() => {
    setSealData({
      rgslImgFileId: null,
      rgslImgFileUrl: null
    })
  }, [sealData])


  const sealUpload = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_SEAL_SAVE,
      method: 'post',
      data: { rgslImgFileId: sealData?.rgslImgFileId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setData({ //인감 정보 업데이트
          ...data,
          rgslImgAmnnTs: response?.data?.data?.amnnTs.split('T')[0],
          rgslImgFileId: response?.data?.data?.rgslImgFileId,
          rgslImgFileUrl: response?.data?.data?.imgUrl
        })
        setIsWrite(false) //수정모드 해제
        userContext?.actions?.getUserInfo() //유저 context 업데이트
      }
    })
  }, [sealData])

  const sealRemove = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_SEAL_DELETE,
      method: 'post',
      data: { rgslImgFileId: data?.rgslImgFileId }
    }).then((response) => {
      if (response?.data?.code === '200') {
        setData({ //인감 정보 업데이트
          ...data,
          rgslImgFileId: response?.data?.data?.rgslImgFileId,
          rgslImgFileUrl: response?.data?.data?.rgslImgFileUrl
        })
        setIsWrite(false) //수정모드 해제
        userContext?.actions?.getUserInfo() //유저 context 업데이트
      }
    })
  }, [data, sealData])


  useEffect(() => {
    if (data?.rgslImgFileId != null && data?.rgslImgFileUrl != null) {
      setSealData({
        rgslImgFileId: data?.rgslImgFileId,
        rgslImgFileUrl: data?.rgslImgFileUrl
      })
    }
  }, [data])


  return (
    <div className="inner min_height">
      <div className="tit_area">
        <div className="tit_inner">
          <p className="title">인감</p>
          <div className="info_tooltip_wrap">
            <button className={'btn_help'}>
              <span className="hide">정보살펴보기</span>
            </button>
            <div className="info_tooltip">
              <div className="tooltip_inner">
                <div className="tit_section">
                  <p className="tit">인감</p>
                  <button className="btn_delete_grey">
                    <span className="hide">삭제</span>
                  </button>
                </div>
                <p className="cnt nowrap">
                  PNG, JPG, JPEG 형식으로 등록 가능하며&#44;
                  <br /> 1개의 이미지만 등록 가능합니다&#46;
                </p>
              </div>
            </div>
          </div>
        </div>
        {isWrite ? (
          <div className="btn_wrap">
            <Button className={'btn linear_blue'} onClick={() => handleisWrite('CANCEL')}>취소</Button>
            <Button className={'btn full_blue'} onClick={handleSave}>저장</Button>
          </div>
        ) : (
          <Button className={'btn full_blue edit'} onClick={() => handleisWrite('REGISTER')}>
            {data?.rgslImgFileUrl ? '수정' : '등록'}
          </Button>
        )}
      </div>
      <div className="cnt_wrap">
        {isWrite ? (
          <div className="stamp_wrap" >
            <input type="file" hidden ref={hiddenFileInputRef} onChange={onChangeImgFile} title={'file'} />
            {sealData?.rgslImgFileUrl ? (
              <div className="stamp_container">
                <div className="stamp">
                  <img src={sealData?.rgslImgFileUrl} alt="" />
                  <div className="trash" onClick={handleRemove}>&nbsp;</div> {/* 서명 삭제 아이콘 */}
                </div>
              </div>
            ) : (
              <Button className={'btn linear_grey'} onClick={onClickFindFile} >인감등록하기</Button>
            )}
          </div>
        ) : (
          <div className="stamp_wrap">
            {data?.rgslImgFileUrl ? (
              <>
                <div className="stamp">
                  <img src={data?.rgslImgFileUrl} alt="" />
                </div>
                <div className="updated">
                  <p>
                    Updated :<span>&nbsp;{data?.rgslImgAmnnTs && data?.rgslImgAmnnTs.split('T')[0]}</span>
                  </p>
                </div>
              </>
            ) : (
              <p>인감을 등록하지 않았습니다</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Seal
