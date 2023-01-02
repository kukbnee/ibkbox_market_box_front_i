import { useState, useCallback, useRef } from 'react'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import Badge from 'components/atomic/Badge'

const ImgInfo = (props) => {
  const { form, setForm } = props
  const hiddenFileInputRef = useRef()
  const allowExtensions = ['jpeg', 'JPEG', 'jpg', 'JPG', 'PNG', 'png']

  const [toggle, setToggle] = useState(true)
  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  const onClickFindFile = useCallback(() => {
    hiddenFileInputRef.current.click()
  }, [])

  const onChangeImgFile = async (e) => {
    let file = e?.target?.files[0]
    const fileForm = new FormData()
    fileForm.append('file', file)
    let fileName = e.target.files[0]?.name?.split('.')
    if(file){
      if (allowExtensions.includes(fileName[fileName.length - 1])) {
        await Axios({
          url: API.FILE.UPLOAD,
          method: 'post',
          data: fileForm,
          fileUpload: true
        }).then((response) => {
          if (response.data.code === '200') {
            let _form = { ...form }
            _form.productFileList.push(response.data.data)
            setForm({ ...form })
          }
        })
      } else alert('지원하지 않는 형식의 파일입니다.')
    }

  }

  const removeImgFile = useCallback(
    (e) => {
      let _form = { ...form }
      _form.productFileList.splice(e.target.id, 1)
      setForm({ ..._form })
      hiddenFileInputRef.current.value = ''
    },
    [form]
  )

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">이미지정보</div>
        <div className="btn_group">
          <button className="btn_toggle_card" onClick={handleToggleState}>
            <span className="hide">카드 열고 닫기</span>
          </button>
        </div>
      </div>
      {toggle && (
        <div className="toggle_card_container">
          <div className="table_list_wrap type02 ">
            <ul className="table_list ">
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header ">
                    <span className="label">이미지등록</span>
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value">
                    <div className="img_upload_wrap">
                      <p className="info guide_txt">
                        &#183; 이미지는 최대 12개까지 등록 가능하며, 첫번째(가장 왼쪽 상단)로 등록된 이미지가
                        대표이미지가 되어 상품 목록에 노출됩니다.
                      </p>
                      <div className="img_upload_form_wrap">
                        <input type="file" hidden ref={hiddenFileInputRef} onChange={onChangeImgFile} title={'file'} />
                        <div className="img_upload_btn_wrap">
                          {form?.productFileList?.map((file, index) => (
                            <div className="btn_img_add" key={`imageFile_${index}`}>
                              <span className="hide">이미지업로드</span>
                              <img src={`${file?.imgUrl}`} alt="" />
                              <div className="img_edit">
                                <button className="btn_delete" title={'이미지 삭제'} id={index} onClick={removeImgFile}>
                                  <span className="hide">이미지삭제</span>
                                </button>
                              </div>
                            </div>
                          ))}

                          {form?.productFileList?.length < 12 && (
                            <button className="btn_plus" title={'이미지추가'} onClick={onClickFindFile}>
                              <span className="hide">이미지추가</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImgInfo
