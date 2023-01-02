import { useState, useCallback, useRef, useEffect } from 'react'
import { Editor } from '@toast-ui/react-editor'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import Badge from 'components/atomic/Badge'
import Tooltip from 'components/Tooltip'
import { strTrim } from 'modules/utils/Common'
import fontSize from "tui-editor-plugin-font-size"

import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import 'assets/style/toastui-editor.min.css'
import 'assets/style/toastui-editor-color.css'
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";

const BasicInfo = (props) => {
  const { form, setForm, isEditMode } = props
  const [keyword, setKeyword] = useState('')
  const [toggle, setToggle] = useState(true)
  const editorNewRef = useRef()
  const editorEditRef = useRef()
  const handleToggleState = useCallback(() => setToggle(!toggle), [toggle])

  const onChangeForm = useCallback(
    (e) => {
      let _form = { ...form }
      _form[e.target.id] = e.target.value
      setForm({ ..._form })
    },
    [form]
  )

  const onChangeKeyword = useCallback((e) => setKeyword(e.target.value === ',' ? '' : e.target.value), [keyword])

  const onKeyPressKeyword = useCallback((e) => {
      //엔터키
      if(e.charCode === 13){
        if(form.pdfKwrList.length >= 20) {
          setKeyword('')
          alert('키워드 등록은 최대 20개까지 하실 수 있습니다.')
        }else{
          let targetText = strTrim(e.target.value);
          if(targetText == ""){
            return;
          }

          const kwrData = targetText.split(",");
          kwrData.map((item,idx)=>{
            let _form = {...form}
            let chkData = _form.pdfKwrList.filter(data => data.kwr.indexOf(item) !== -1);
            if(chkData.length == 0 && strTrim(item) != "" && form.pdfKwrList.length <= 20) {
              _form.pdfKwrList.push({kwr: item})
              setKeyword('')
              setForm({..._form})
            }else{
              setKeyword('');
            }
          });
        }
      }
    },
    [form, keyword]
  )

  const removeKeyword = useCallback(
    (e) => {
      let _form = { ...form }
      _form.pdfKwrList.splice(e.target.id, 1)
      setForm({ ..._form })
    },
    [form]
  )

  const byteSize = (str) => {
    return new Blob([str]).size
  }

  const onChangeEditor = useCallback(() => {
    if (isEditMode) {
      setForm({
        ...form,
        dtlDesc: editorEditRef.current.getInstance().getHTML(),
        dtlDescLength: byteSize(editorEditRef.current.getInstance().getHTML())
      })
    } else {
      setForm({
        ...form,
        dtlDesc: editorNewRef.current.getInstance().getHTML(),
        dtlDescLength: byteSize(editorNewRef.current.getInstance().getHTML())
      })
    }
  }, [form])

  useEffect(() => {
    if (!document.querySelector('.toastui-editor-pseudo-clipboard')?.title)
      document.querySelector('.toastui-editor-pseudo-clipboard').title = 'editor'
  }, [form])

  return (
    <div className="toggle_card_layout active">
      <div className="toggle_card_header">
        <div className="title">기본 정보</div>
        <div className="btn_group">
          <button className="btn_toggle_card" onClick={handleToggleState}>
            <span className="hide">카드 열고 닫기</span>
          </button>
        </div>
      </div>
      {toggle && (
        <div className="toggle_card_container">
          {/*table_list_wrap start*/}
          <div className="table_list_wrap type02 basicInfo ">
            <ul className="table_list ">
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">상품명</span>
                    <Tooltip title={'상품명'} content={'판매페이지 및 목록에 노출되는 상품명입니다.'} />
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <input
                        id="pdfNm"
                        type="text"
                        className="input"
                        maxLength={250}
                        placeholder="예시) 플라워 미니 원피스"
                        onChange={onChangeForm}
                        value={form.pdfNm}
                        title={'pdfNm'}
                      />
                      <span className="text_length_check">{form?.pdfNm?.length} &#47; 250</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">모델명</span>
                    <Tooltip title={'모델명'} content={'브랜드와 품번을 적어주세요.'} />
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <input
                        id={'mdlnm'}
                        type="text"
                        className="input"
                        maxLength={100}
                        onChange={onChangeForm}
                        value={form.mdlnm}
                        title={'mdlnm'}
                      />
                      <span className="text_length_check">{form?.mdlnm?.length} &#47; 100</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">상품 요약설명</span>
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <input
                        id={'brfDesc'}
                        type="text"
                        className="input"
                        maxLength={100}
                        onChange={onChangeForm}
                        value={form.brfDesc}
                        title={'brfDesc'}
                      />
                      <span className="text_length_check">{form?.brfDesc?.length} &#47; 100</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">상품 간략설명</span>
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <textarea
                        id={'brfSubDesc'}
                        className="textarea height01"
                        placeholder={'상품의 간단한 추가 정보를 입력할수 있습니다. '}
                        maxLength={255}
                        onChange={onChangeForm}
                        value={form.brfSubDesc}
                        title={'brfSubDesc'}
                      />
                      <span className="text_length_check">{form?.brfSubDesc?.length} &#47; 255</span>
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label letter_spacing">상품 상세설명</span>
                    <Tooltip title={'상품 상세설명'} content={'상품에 대한 설명을 구체적으로 적어주세요.'} />
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value cell_full_value cell_header">
                    <div className="input_total_wrap mo_total">
                      <div className="text_editor">
                        {isEditMode && form.dtlDesc && (
                          <Editor
                            initialValue={form.dtlDesc}
                            placeholder="내용을 작성해주세요."
                            previewStyle="vertical"
                            initialEditType="wysiwyg"
                            plugins={[fontSize,colorSyntax]}
                            useCommandShortcut={true}
                            ref={editorEditRef}
                            onChange={onChangeEditor}
                            height="750px"
                          />
                        )}
                        {!isEditMode && (
                          <Editor
                            placeholder="내용을 작성해주세요."
                            previewStyle="vertical"
                            initialEditType="wysiwyg"
                            plugins={[fontSize,colorSyntax]}
                            useCommandShortcut={true}
                            ref={editorNewRef}
                            onChange={onChangeEditor}
                            height="750px"
                          />
                        )}
                      </div>
                      {/* <p className="text_length_check">{form?.dtlDescLength} &#47; 500</p> */}
                    </div>
                  </div>
                </div>
              </li>
              <li className="table_row">
                <div className="item_section">
                  <div className="cell cell_label cell_header cell_full_header">
                    <span className="label">상품 키워드</span>
                    <Badge className={'linear_full_pink'}>필수</Badge>
                  </div>
                  <div className="cell cell_value tag_add cell_full_value">
                    <div className="input_total_wrap mo_total">
                      <input
                        type="text"
                        className="input"
                        placeholder={'키워드는 ‘,(콤마)’로 구분해주시고 Enter key(엔터키)를 누르시면 키워드가 등록됩니다.'}
                        maxLength={100}
                        onChange={onChangeKeyword}
                        onKeyPress={onKeyPressKeyword}
                        value={keyword}
                        title={'keyword'}
                      />
                      <br/>
                      <span className="text_length_check">{keyword?.length} &#47; 100</span>
                    </div>
                    {/*category_tag_wrap start*/}
                    <div className="category_tag_wrap">
                      {form?.pdfKwrList?.map((item, index) => (
                        <div className="tag_wrap" key={`keywordItem_${index}`}>
                          <span className="tag">{item.kwr}</span>
                          <button className="btn_delete_blue" id={index} onClick={removeKeyword}>
                            <span className="hide">삭제</span>
                          </button>
                        </div>
                      ))}
                    </div>

                    {/*category_tag_wrap end*/}
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

export default BasicInfo
