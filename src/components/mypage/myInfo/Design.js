import { useCallback, useState, useRef, useEffect } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'

const Design = (props) => {
  const { data, setMyData, setPopupAlert } = props
  const inputFile = useRef(null)
  const allowExtensions = ['jpeg', 'JPEG', 'jpg', 'JPG', 'PNG', 'png']
  const [isWrite, setIsWrite] = useState(false)
  const [params, setParams] = useState({
    userCpCon: '',
    sellerBgImgFileId: '',
    sellerBgImgFileNm: ''
  })

  const handleisWrite = useCallback(
    (type) => {
      switch (type) {
        case 'cancel':
          setIsWrite(!isWrite)
          setParams({
            userCpCon: data?.userCpCon != null ? data?.userCpCon : '',
            sellerBgImgFileId: data?.imgFileId != null ? data?.imgFileId : '',
            sellerBgImgFileNm: data?.imgName != null ? data?.imgName : ''
          })
          break
        case 'edit':
          setIsWrite(!isWrite)
          break
      }
    },
    [isWrite, data]
  )

  const handleChangeForm = (e) => {
    setParams({ ...params, [e.target.id]: e.target.value })
  }

  const handleUploadFiles = async (e) => {
    if (e?.target?.files?.length === 0) {
      return
    }


    let file = e?.target?.files[0]
    let convertMegaBytes = Math.ceil(file?.size / 1024 ** 2)
    if (convertMegaBytes > 100) {
      setPopupAlert({
        active: true,
        type: 'ALERT',
        msg: '파일용량은 최대 100MB까지만 업로드 가능합니다.',
        btnMsg: '확인'
      })
      return
    }

    const fileForm = new FormData()
    fileForm.append('file', file)
    let fileName = e.target.files[0]?.name?.split('.')
    if (allowExtensions.includes(fileName[fileName.length - 1])) {
      await Axios({
        url: API.FILE.UPLOAD,
        method: 'post',
        data: fileForm,
        fileUpload: true
      }).then((response) => {
        if (response?.data?.code === '200' && response?.data?.data != null) {
          setParams({
            ...params,
            sellerBgImgFileId: response.data.data.fileId,
            sellerBgImgFileNm: response.data.data.fileNm
          })
        }
      })
    } else {
      setPopupAlert({
        active: true,
        type: 'ALERT',
        msg: '파일형식은 .png, .jpg, .jpeg 파일만 가능합니다.',
        btnMsg: '확인'
      })
    }
  }

  const handleSave = useCallback(() => {
    if (params?.sellerBgImgFileId === '') {
      setPopupAlert({ active: true, type: 'ALERT', msg: '배경이미지를 업로드 해주세요.', btnMsg: '확인' })
      return
    }
    if (params?.userCpCon === '') {
      setPopupAlert({ active: true, type: 'ALERT', msg: '회사 소개를 입력해주세요.', btnMsg: '확인' })
      return
    }
    postInfoDesginSave()
  }, [params])

  const postInfoDesginSave = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_INFO_DESIGN_SAVE,
      method: 'post',
      data: params
    }).then((response) => {
      if (response?.data?.code === '200') {
        handleisWrite('edit')
        setMyData({
          ...data,
          userCpCon: params?.userCpCon,
          imgFileId: params?.sellerBgImgFileId,
          imgName: params?.sellerBgImgFileNm
        })
      }
    })
  }, [data, params])

  useEffect(() => {
    setParams({
      userCpCon: data?.userCpCon != null ? data?.userCpCon : '',
      sellerBgImgFileId: data?.imgFileId != null ? data?.imgFileId : '',
      sellerBgImgFileNm: data?.imgName != null ? data?.imgName : ''
    })
  }, [data])

  return (
    <>
      <div className="inner">
        <div className="tit_area">
          <p className="title">판매자 홈화면 디자인</p>
          {isWrite ? (
            <div className="btn_wrap">
              <Button className={'btn linear_blue'} onClick={() => handleisWrite('cancel')}>
                취소
              </Button>
              <Button className={'btn full_blue'} onClick={handleSave}>
                저장
              </Button>
            </div>
          ) : (
            <Button className={'btn full_blue edit'} onClick={() => handleisWrite('edit')}>
              수정
            </Button>
          )}
        </div>
        <div className="table_list_wrap">
          <ul className="table_list">
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_header">배경이미지</div>
                <input type="hidden" title={'hidden'} />
                {isWrite ? (
                  <div className="cell cell_cnt padding_none">
                    <input
                      type="text"
                      className="input readonly"
                      value={params?.sellerBgImgFileNm}
                      readOnly
                      title={'readonly'}
                    />
                    <input
                      type="file"
                      id="file"
                      ref={inputFile}
                      style={{ display: 'none' }}
                      multiple={false}
                      onChange={(e) => handleUploadFiles(e)}
                      title={'file'}
                    />
                    <Button
                      className={'btn linear_grey'}
                      onClick={() => {
                        inputFile.current.click()
                      }}
                    >
                      파일찾기
                    </Button>
                  </div>
                ) : (
                  <div className="cell cell_cnt infancy">{params?.sellerBgImgFileNm}</div>
                )}
              </div>
            </li>
            <li className="table_row">
              <div className="item_section flex_row_wrap">
                <div className="cell cell_header_full">회사 소개</div>
                {isWrite ? (
                  <div className="cell cell_cnt_full textarea_wrap mo_total">
                    <textarea
                      className="textarea"
                      id={'userCpCon'}
                      value={params?.userCpCon}
                      maxLength={90}
                      onChange={handleChangeForm}
                      title={'userCpCon'}
                    />
                    <div className="text_length">
                      <span className="length_count">{params?.userCpCon?.length}</span>
                      <span className="length_total">&#47;90</span>
                    </div>
                  </div>
                ) : (
                  <pre>
                    <div className="cell cell_cnt_full">{params?.userCpCon}</div>
                  </pre>
                )}
              </div>
            </li>
            {
              isWrite &&
                <div className="guide_text_wrap">
                  <p className="guide_text">* 홈 화면 배너의 적정 사이즈는 가로 768px, 세로 240px 입니다.</p>
                </div>
            }
          </ul>
        </div>
      </div>
    </>
  )
}

export default Design
