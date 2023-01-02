import { useState, useRef, useCallback, useEffect } from 'react'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import Badge from 'components/atomic/Badge'

const BuyerContents = (props) => {
  const { form, setForm } = props
  const [file, setFile] = useState({})
  const hiddenFileInputRef = useRef()
  const allowExtensions = ['jpg', 'JPG', 'JPEG', 'jpeg', 'PNG', 'png'] //업로드 가능 파일

  const onClickFindFile = useCallback(() => {
    hiddenFileInputRef.current.click()
  }, [])

  //이미지 업로드
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

  const getBuyerFirstData = useCallback(async() =>{
    await Axios({
      url: API.MYPAGE.MY_BUYER_PRODUCT_LIST,
      method: 'get',
      params: { page: 1 }
    }).then((response) => {
      if (response?.data?.code === '200') {
        if(response.data.data.list[0].buyerInfId != null) {
          getBuyerDetail(response.data.data.list[0].buyerInfId);
        }
      }
    })
  },[])

  const getBuyerDetail = useCallback(async(id) => {
    await Axios({
      url: API.MYPAGE.MY_BUYER_PRODUCT_DETAIL,
      method: 'get',
      params: { 
        buyerInfId: id,
        buyerFlg: 'selr' //로그인만 가능
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        if(response.data.data.buyerProductInfo != null) {
          setForm({
            ...form,
            fileId: response.data.data.buyerProductInfo.fileId,
            imgUrl: response.data.data.buyerProductInfo.imgUrl
          })
        }
      }
    })
  },[])

  useEffect(() => {
    getBuyerFirstData(); //이미지정보 가져오기
  }, [])

  useEffect(() => {
    setFile({
      imgUrl: form?.imgUrl ?? ''
    })
  }, [form])

  return (
    <div className="section section_product_info buyer_add">
      <div className="section_header">
        <div className="section_title">작성하기</div>
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
                  <span>보내는사람</span>
                  <Badge className={'linear_full_pink'}>필수</Badge>
                </div>
              </th>
              <td>
                <div className="input_wrap">
                  <input
                    type="text"
                    className="input"
                    id={'senEml'}
                    onChange={onChangeForm}
                    value={form?.senEml}
                    title={'senEml'}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <div className="essential_badge_wrap">
                  <span>받는사람</span>
                  <Badge className={'linear_full_pink'}>필수</Badge>
                </div>
              </th>
              <td>
                <div className="input_wrap">
                  <input
                    type="text"
                    className="input"
                    id={'recEml'}
                    onChange={onChangeForm}
                    value={form?.recEml}
                    title={'recEml'}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <div className="essential_badge_wrap">
                  <span>제목</span>
                  <Badge className={'linear_full_pink'}>필수</Badge>
                </div>
              </th>
              <td>
                <div className="input_wrap">
                  <input
                    type="text"
                    className="input"
                    id={'ttl'}
                    onChange={onChangeForm}
                    value={form?.ttl}
                    title={'ttl'}
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <div className="essential_badge_wrap">
                  <span>내용</span>
                  <Badge className={'linear_full_pink'}>필수</Badge>
                </div>
              </th>
              <td>
                <div className="textarea_wrap">
                  <textarea className="textarea" id={'con'} onChange={onChangeForm} value={form?.con} title={'con'} />
                </div>
              </td>
            </tr>
            <tr>
              <th>
                <div className="essential_badge_wrap">
                  <span>회사로고</span>
                  <Badge className={'linear_full_pink'}>필수</Badge>
                </div>
              </th>
              <td>
                <input type="file" hidden ref={hiddenFileInputRef} onChange={onChangeImgFile} title={'file'} />
                <div className="img_wrap" onClick={onClickFindFile}>
                  {form?.fileId ? (
                    <img alt="" src={file.imgUrl} />
                  ) : (
                    <button className="btn_img_add">
                      <span className="hide">대표이미지추가</span>
                    </button>
                  )}
                </div>
                <p className="sub_text">권장 300px * 80px</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BuyerContents
