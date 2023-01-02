import { useState, useEffect, useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import Badge from 'components/atomic/Badge'
import PopupAlert from 'components/PopupAlert'

const QnaAdminRegister = (props) => {
  const history = useHistory()
  const inputFile = useRef(null)
  const allowExtensions = ['jpg', 'JPG', 'PNG', 'png', 'ZIP', 'zip', 'PDF', 'pdf']
  const [isPopup, setIsPopup] = useState({
    state: false,
    msg: '',
    btnMsg: '확인'
  })
  const [qnaCtg, setQnaCtg] = useState({
    active: 'AIS00001',
    list: [
      { id: 'AIS00001', label: '배송' },
      { id: 'AIS00002', label: '구매' },
      { id: 'AIS00003', label: '판매' },
      { id: 'AIS00004', label: '에이전시' },
      { id: 'AIS00006', label: '이벤트' },
      { id: 'AIS00005', label: '기타' }
    ]
  })
  const [params, setParams] = useState({
    inquTypeId: 'AIS00001',
    inquSttId: 'AIS01001',
    ttl: '',
    con: '',
    adminQnaFileVOList: []
  })

  const handleCancel = useCallback(() => {
    history.goBack()
  }, [])

  const handlePopup = () => {
    setIsPopup({ ...isPopup, state: !isPopup })
  }

  const handleQnaType = (e) => {
    setQnaCtg({ ...qnaCtg, active: e.target.value })
    setParams({ ...params, inquTypeId: e.target.value })
  }

  const handleInputText = (e) => {
    let regExp = /[^a-z|A-Z|0-9|ㄱ-ㅎ|가-힣|`~!@#$%^&*()-_=+|[]{};:'",.<>|\s]/g
    let text = e.target.value.replace(regExp, '')
    setParams({ ...params, [e.target.id]: text })
  }

  const handleFileUploader = () => {
    if (params?.adminQnaFileVOList?.length < 5) {
      inputFile.current.click()
    } else {
      setIsPopup({
        ...isPopup,
        state: true,
        msg: '파일은 최대 5개까지 가능합니다.'
      })
      return
    }
  }

  const handleUploadFiles = async (e) => {
    if (e?.target?.files?.length === 0) {
      return
    }


    let file = e?.target?.files[0]
    let convertMegaBytes = Math.ceil(file?.size / 1024 ** 2)
    if (convertMegaBytes > 100) {
      setIsPopup({
        ...isPopup,
        state: true,
        msg: '파일용량은 최대 100MB까지만 업로드 가능합니다.'
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
          let fileList = params?.adminQnaFileVOList
          let newFile = { fileId: response.data.data.fileId, fileNm: response.data.data.fileNm }
          fileList.push(newFile)
          setParams({ ...params, adminQnaFileVOList: fileList })
        }
      })
    } else {
      setIsPopup({
        ...isPopup,
        state: true,
        msg: '파일형식은 .png, .jpg, .zip, .pdf 파일만 가능합니다.'
      })
    }
  }

  const handleChangeUploadFiles = (index) => {
    let newFileList = params?.adminQnaFileVOList
    newFileList.splice(index, 1)
    setParams({ ...params, adminQnaFileVOList: newFileList })
  }

  const handleRegister = useCallback(() => {
    if (params?.ttl?.length === 0) {
      setIsPopup({
        ...isPopup,
        state: true,
        msg: '제목을 입력해주세요.'
      })
    } else if (params?.con?.length === 0) {
      setIsPopup({
        ...isPopup,
        state: true,
        msg: '내용을 입력해주세요.'
      })
    } else {
      postQnaAdminSave()
    }
  }, [params])

  const postQnaAdminSave = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_QNA_ADMIN_SAVE,
      method: 'post',
      data: params
    }).then((response) => {
      if (response?.data?.code === '200') history.push(PathConstants.MY_PAGE_QNA_ADMIN_LIST)
      else setIsPopup({ ...isPopup, state: true, msg: '잠시 후 다시 시도해주세요.', btnMsg: '확인' })
    })
  }, [params, isPopup])

  const signNeed = () => {
    return <Badge className={'linear_full_pink'}>필수</Badge>
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
      <div className="mypage product each_write ask_register">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">관리자 문의 등록</h2>
            </div>
          </div>
          <div className="toggle_card_layout active">
            <div className="toggle_card_header">
              <div className="title">문의 등록</div>
            </div>
            <div className="toggle_card_container">
              <div className="table_list_wrap type02">
                <ul className="table_list ">
                  <li className="table_row regist">
                    <div className="item_section">
                      <div className="cell cell_label cell_header">
                        <span className="label">제목</span>
                        {signNeed()}
                      </div>
                      <div className="cell cell_value">
                        <div className="input_total_wrap mo_total">
                          <input
                            type="text"
                            className="input"
                            maxLength={300}
                            placeholder="제목을 입력하세요."
                            value={params?.ttl}
                            id={'ttl'}
                            onChange={(e) => handleInputText(e)}
                            title={'ttl'}
                          />
                          <span className="text_length_check">{params?.ttl?.length} &#47; 300</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="table_row regist">
                    <div className="item_section">
                      <div className="cell cell_label cell_header">
                        <span className="label">유형선택</span>
                      </div>
                      <div className="cell cell_value">
                        <div className="order_unit_wrap">
                          <select
                            className="select type02"
                            onChange={(e) => handleQnaType(e)}
                            value={qnaCtg?.active}
                            title={'qnaCtg'}
                          >
                            {qnaCtg?.list?.map((type, idx) => (
                              <option value={type.id} key={idx}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="table_row regist">
                    <div className="item_section">
                      <div className="cell cell_label cell_header">
                        <span className="label">내용</span>
                        {signNeed()}
                      </div>
                      <div className="cell cell_value ">
                        <div className="input_total_wrap mo_total">
                          <textarea
                            className="textarea height02 scroll"
                            placeholder={'내용을 입력해주세요.'}
                            maxLength={1000}
                            value={params?.con}
                            id={'con'}
                            onChange={(e) => handleInputText(e)}
                            title={`con`}
                          />
                          <span className="text_length_check">{params?.con?.length} &#47; 1,000</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="table_row regist">
                    <div className="item_section">
                      <div className="cell cell_label cell_header">
                        <span className="label lh">파일첨부(파일은 최대 5개까지 가능합니다.)</span>
                      </div>
                      <div className="cell cell_value file_add">
                        <div className="upload_wrap">
                          <Button className="btn full_blue" onClick={handleFileUploader}>
                            파일업로드
                          </Button>
                          <p className="text">*파일형식은 png, jpg, zip, pdf형식만 가능합니다.</p>
                        </div>
                        <input
                          type="file"
                          id="file"
                          ref={inputFile}
                          style={{ display: 'none' }}
                          onChange={(e) => handleUploadFiles(e)}
                          title={'file'}
                        />
                        {params?.adminQnaFileVOList?.length > 0
                          ? params?.adminQnaFileVOList?.map((item, index) => (
                              <div className="input_total_wrap file_add_wrap" key={index}>
                                <input
                                  type="text"
                                  className="input"
                                  placeholder={item.fileNm}
                                  readOnly={true}
                                  title={'fileNm'}
                                />
                                <div className="btn_wrap">
                                  <Button className="btn" onClick={() => handleChangeUploadFiles(index)}>
                                    <span className="hide">취소 버튼</span>
                                  </Button>
                                </div>
                              </div>
                            ))
                          : null}
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="page_bottom btn_group">
          <Button className={'linear_blue'} onClick={handleCancel}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleRegister}>
            등록
          </Button>
        </div>
      </div>
    </>
  )
}

export default QnaAdminRegister
