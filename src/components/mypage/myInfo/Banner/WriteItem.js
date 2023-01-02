import { useCallback, useRef } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import Checkbox from 'components/atomic/Checkbox'
import Button from 'components/atomic/Button'
import moment from 'moment'

const WriteItem = (props) => {
  const { data, index, params, setParams, setPopupAlert } = props
  const inputFile = useRef(null)
  const allowExtensions = ['jpg', 'jpeg', 'JPEG', 'JPG', 'PNG', 'png']

  const handleChangeForm = useCallback(
    (e) => {
      let bannerList = params
      bannerList[index][e.target.id] = e.target.value
      setParams([...bannerList])
    },
    [params, index]
  )

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
          let bannerList = [...params]
          bannerList[index]['fileId'] = response.data.data.fileId
          bannerList[index]['fileNm'] = response.data.data.fileNm
          bannerList[index]['imgUrl'] = response.data.data.imgUrl
          bannerList[index]['rgsnTsStr'] = moment().format('YYYY-MM-DD HH:mm:ss')
          setParams([...bannerList])
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

  const handleCheckbox = useCallback(
    (e) => {
      let bannerList = [...params]
      bannerList[index]['oppbYn'] = e.target.checked ? 'Y' : 'N'
      setParams([...bannerList])
    },
    [params, index]
  )

  const handleDel = useCallback(() => {
    let bannerList = [...params]
    bannerList.splice(index, 1)
    setParams([...bannerList])
  }, [params, index])

  return (
    <div className="home_banner_wrap">
      <div className="home_banner">
        <div className="table_list_wrap type02">
          <ul className="table_list">
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_label cell_header ">
                  <span className="label">배너 제목</span>
                </div>
                <div className="cell cell_value">
                  <div className="input_wrap">
                    <input
                      type="text"
                      className="input"
                      placeholder="배너 제목을 입력해 주세요"
                      id={'ttl'}
                      value={data?.ttl}
                      onChange={handleChangeForm}
                      title={'ttl'}
                    />
                  </div>
                </div>
              </div>
            </li>
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_label cell_header ">
                  <span className="label">배너 url</span>
                </div>
                <div className="cell cell_value">
                  <div className="input_wrap">
                    <input
                      type="text"
                      className="input"
                      placeholder="배너 링크를 입력해 주세요."
                      id={'url'}
                      value={data?.url}
                      onChange={handleChangeForm}
                      title={'url'}
                    />
                  </div>
                </div>
              </div>
            </li>
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_label cell_header ">
                  <span className="label">배너 이미지</span>
                </div>
                <div className="cell cell_value">
                  <div className="input_wrap">
                    <input
                      type="text"
                      className="input"
                      placeholder="필수 항목입니다."
                      value={data?.fileNm ? data.fileNm : ''}
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
                      className="btn linear_grey"
                      onClick={() => {
                        inputFile.current.click()
                      }}
                    >
                      파일찾기
                    </Button>
                  </div>
                </div>
              </div>
            </li>
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_label cell_header ">
                  <span className="label">공개 여부</span>
                </div>
                <div className="cell cell_cnt cell_value">
                  <div className="checkbox">
                    <Checkbox
                      key={'test'}
                      label={'공개'}
                      id={`oppbYn_${index}`}
                      checked={data?.oppbYn === 'Y' ? true : false}
                      onChange={handleCheckbox}
                    />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="delete_btn_wrap">
        <Button onClick={handleDel}>
          <div className="hide">삭제버튼</div>
        </Button>
      </div>
    </div>
  )
}

export default WriteItem
