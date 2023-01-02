import { useState, useCallback, useRef } from 'react'
import Button from 'components/atomic/Button'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'

const VideoProduct = (props) => {
  const { form, setForm } = props

  const [toggle, setToggle] = useState(true)
  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  const addVideo = useCallback(() => {
    setForm({
      productVideoList: [
        ...form.productVideoList,
        {
          infoSqn: '',
          fileId: '',
          pictTtl: '',
          pictUrl: ''
        }
      ]
    })
  }, [form])

  const onChangeForm = useCallback(
    (e, index) => {
      let _form = { ...form }
      _form.productVideoList[index][e.target.id] = e.target.value
      setForm({ ..._form })
    },
    [form]
  )

  const removeVideo = useCallback(
    (e, index) => {
      let _form = { ...form }
      _form.productVideoList.splice(index, 1)
      setForm({ ..._form })
    },
    [form]
  )

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">제품 영상</div>
        <div className="btn_group">
          <button className="btn_toggle_card" onClick={handleToggleState}>
            <span className="hide">카드 열고 닫기</span>
          </button>
        </div>
      </div>
      {toggle && (
        <div className="toggle_card_container">
          {/*table_list_wrap start*/}
          <div className="table_list_wrap type02 ">
            <ul className="table_list ">
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">영상 등록</span>
                  </div>
                  <div className="cell cell_value regist cell_full_value">
                    <div className="regist_info_wrap">
                      <p className="text">&#183; 영상 썸네일 등록은 jpg, png, jpeg 형식만 가능합니다&#46;</p>
                      <p className="text">
                        &#183; 영상 url은 유튜브 영상만 가능합니다&#46; &#40;최대 5개까지 가능&#41;
                      </p>
                    </div>

                    {form?.productVideoList?.length > 0 && (
                      <div className="order_volume_limit">
                        {form?.productVideoList?.map((video, index) => (
                          <VideoInfoItem
                            key={`videoItem_${index}`}
                            form={form}
                            setForm={setForm}
                            video={video}
                            index={index}
                            onChangeForm={onChangeForm}
                            removeVideo={removeVideo}
                          />
                        ))}
                      </div>
                    )}
                    {form?.productVideoList?.length < 5 && (
                      <div className="btn_wrap">
                        <Button className="btn more_btn" onClick={addVideo} />
                      </div>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
          {/*table_list_wrap end*/}
        </div>
      )}
    </div>
  )
}

const VideoInfoItem = (props) => {
  const { video, index, onChangeForm, removeVideo, form, setForm } = props
  const [file, setFile] = useState({
    amnnUserName: null,
    fileEtns: '',
    fileId: '',
    fileNm: video?.fileNm ?? '',
    filePath: '',
    filePtrn: '',
    fileSize: 0,
    imgFileId: null,
    imgUrl: '',
    rgsnUserName: null,
    rvsRnum: null
  })
  const hiddenFileInputRef = useRef()
  const allowExtensions = ['jpg', 'JPG', 'PNG', 'png', 'jpeg', 'JPEG']

  const onClickFindFile = useCallback(() => {
    hiddenFileInputRef.current.click()
  }, [])

  const onChangeImgFile = async (e) => {
    let file = e?.target?.files[0]
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
        if (response.data.code === '200') {
          let _form = { ...form }
          _form.productVideoList[index].fileId = response.data.data.fileId
          setFile(response.data.data)
          setForm({ ..._form })
        }
      })
    } else alert('지원하지 않는 형식의 파일입니다.')
  }

  return (
    <div className="order_volume_limit_wrap">
      {/*order_volume_limit_table start*/}
      <div className="table_list_wrap type02">
        <ul className="table_list video">
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_label cell_header cell_header_video">
                <span className="label">영상 제목</span>
              </div>
              <div className="cell cell_value cell_value_video">
                <div className="input_wrap">
                  {/*영상제목 최대 200자까지 입력*/}
                  <input
                    type="text"
                    className="input"
                    placeholder="필수 항목입니다."
                    maxLength="200"
                    id={'pictTtl'}
                    value={video?.pictTtl}
                    onChange={(e) => onChangeForm(e, index)}
                    title={'pictTtl'}
                  />
                </div>
              </div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_label cell_header cell_header_video">
                <span className="label">영상 url</span>
              </div>
              <div className="cell cell_value cell_value_video">
                <div className="input_wrap">
                  <input
                    type="text"
                    className="input"
                    placeholder="필수 항목입니다."
                    value={video?.pictUrl}
                    id={'pictUrl'}
                    onChange={(e) => onChangeForm(e, index)}
                    title={'pictUrl'}
                  />
                </div>
              </div>
            </div>
          </li>
          <li className="table_row">
            <div className="item_section">
              <div className="cell cell_label cell_header cell_header_video">
                <span className="label">영상 썸네일</span>
              </div>
              <div className="cell cell_value cell_value_video">
                <div className="input_wrap">
                  <input
                    type="text"
                    className="input"
                    placeholder="필수 항목입니다."
                    value={file.fileNm}
                    disabled
                    title={'fileNm'}
                  />
                  <input type="file" hidden ref={hiddenFileInputRef} onChange={onChangeImgFile} title={'file'} />
                  <Button className="btn full_blue" onClick={onClickFindFile}>
                    파일찾기
                  </Button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="delete_btn_wrap">
        <Button onClick={(e) => removeVideo(e, index)}>
          <div className="hide">삭제버튼</div>
        </Button>
      </div>
    </div>
  )
}

export default VideoProduct
