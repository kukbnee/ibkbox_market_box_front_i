import { useState, useRef, useCallback, useEffect } from 'react'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import Badge from 'components/atomic/Badge'

const BindContents = (props) => {
  const { form, setForm } = props
  const [file, setFile] = useState({})
  const hiddenFileInputRef = useRef()
  const allowExtensions = ['jpg', 'JPG', 'JPEG', 'jpeg', 'PNG', 'png']

  const onClickFindFile = useCallback(() => {
    hiddenFileInputRef.current.click()
  }, [])

  const onChangeImgFile = async (e) => {
    let file = e?.target?.files[0]
    if(file === undefined) return //이미지 업로드 취소
    
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
          setFile({ ...response.data.data })
          setForm({ ...form, fileId: response.data.data.fileId, imgUrl: response.data.data.imgUrl })
        }
      })
    } else alert('지원하지 않는 형식의 파일입니다.')
  }

  const onChangeForm = useCallback(
    (e) => {
      let _form = { ...form }
      _form[e.target.id] = e.target.value
      setForm({ ..._form })
    },
    [form]
  )

  useEffect(() => {
    setFile({
      imgUrl: form?.imgUrl ?? ''
    })
  }, [form])

  return (
    <div className="section section_product_info">
      <input type="file" hidden ref={hiddenFileInputRef} onChange={onChangeImgFile} title={'file'} />
      <div className="section_header">
        <div className="essential_badge_wrap">
          <div className="section_title">대표이미지</div>
          <Badge className={'linear_full_pink'}>필수</Badge>
          <div className="guide_text_wrap">
            <p className="guide_text highlight_blue" style={{fontWeight: 'normal', fontSize: '12px', margin: '2px 0 0 5px'}}>
              * 홈 화면 배너의 적정 사이즈는 가로 768px, 세로 300px 입니다.
            </p>
          </div>
        </div>
      </div>
      <div className="img_wrap" onClick={onClickFindFile}>
        {form?.fileId ? (
          <img alt={file.fileNm} src={file.imgUrl}/>
        ) : (
          <button className="btn_img_add">
            <span className="hide">대표이미지추가</span>
          </button>
        )}
      </div>
      <div className="info_table">
        <table className="table">
          <caption>상품명, 상품내용 상세 테이블</caption>
          <colgroup>
            <col width={'20%'} />
            <col width={'80%'} />
          </colgroup>
          <tbody>
            <tr>
              <th>
                <div className="essential_badge_wrap">
                  <span>상품명</span>
                  <Badge className={'linear_full_pink'}>필수</Badge>
                </div>
              </th>
              <td>
                <div className="input_total_wrap mo_total">
                  <input
                    type="text"
                    className="input"
                    id={'pdfNm'}
                    onChange={onChangeForm}
                    value={form?.pdfNm}
                    title={'pdfNm'}
                    maxLength={20}
                  />
                  <span className="text_length_check hidden">{form?.pdfNm ? form?.pdfNm.length : 0} &#47; 20</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <div className="essential_badge_wrap">
                  <span>상품내용</span>
                  <Badge className={'linear_full_pink'}>필수</Badge>
                </div>
              </th>
              <td>
                <div className="input_total_wrap mo_total">
                  <div className="textarea_wrap">
                    <textarea
                      className="textarea"
                      id={'pdfCon'}
                      onChange={onChangeForm}
                      value={form?.pdfCon}
                      title={'pdfCon'}
                      maxLength={200}
                    />
                  </div>
                  <span className="text_length_check hidden">{form?.pdfCon ? form?.pdfCon.length : 0} &#47; 200</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BindContents
