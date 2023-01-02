import React, { useCallback, useEffect, useRef, useState } from 'react'
import Button from 'components/atomic/Button'
import { BtnClose } from 'components/atomic/IconButtons'
import Radio from 'components/atomic/Radio'
import FreightService from 'components/mypage/product/eachWrite/FreightService'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import { addComma } from 'modules/utils/Common'
import PopupAlert from 'components/PopupAlert'

const AdditionalInfo = (props) => {
  const { form, setForm, sellerInfo } = props
  const hiddenFileInputRef = useRef()
  const [file, setFile] = useState({fileNm:form?.fileNm})
  const [popup, setPopup] = useState(false)
  const [estimateList, setEstimateList] = useState(form?.deliveryProductServiceInfoList)


  const allowExtensions = ['jpeg', 'JPEG', 'jpg', 'JPG', 'PNG', 'png']
  const packageUnit = [
    { id: 'DIS00001', label: '박스' },
    { id: 'DIS00002', label: '파렛트' }
  ]

  const handlePagekageUnit = useCallback(
    (e) => {
      setForm({
        ...form,
        prdtpcknUtId: e.target.id
      })
    },
    [form]
  )


  const handlePopup = useCallback(() => setPopup(!popup), [popup])

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
          setForm({ ...form, fileId: response.data.data.fileId })
          setFile(response.data.data)
        }
      })
    } else alert('지원하지 않는 형식의 파일입니다.')
  }

  const removeImgFile = useCallback(() => {
    setForm({ ...form, fileId: '' })
    setFile({
      amnnUserName: null,
      fileEtns: '',
      fileId: '',
      fileNm: '',
      filePath: '',
      filePtrn: '',
      fileSize: 0,
      imgFileId: null,
      imgUrl: '',
      rgsnUserName: null,
      rvsRnum: null
    })
    hiddenFileInputRef.current.value = ''
  }, [form, file])

  const addEstimate =() => {
    setEstimateList([...estimateList, {}])
  }

  useEffect(()=>{
    if(estimateList === undefined) setEstimateList([])
  },[])

  return (
    <>
     <div className="freight_service_wrap">
        <div className="table_list_wrap type02">
          <ul className="table_list freight_service">
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_label cell_header cell_title">
                  <span className="label">구분</span>
                </div>
                <div className="cell cell_value cell_header cell_title">
                  <span className="label">설명</span>
                </div>
              </div>
            </li>
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_label cell_header ">
                  <span className="label">제품포장단위</span>
                </div>
                <div className="cell cell_value">
                  {packageUnit.map((unit) => (
                    <Radio
                      className={'type02'}
                      key={unit.id}
                      label={unit.label}
                      id={unit.id}
                      onChange={handlePagekageUnit}
                      checked={unit.id === form.prdtpcknUtId}
                    />
                  ))}
                </div>
              </div>
            </li>
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_label cell_header ">
                  <span className="label">제품사진</span>
                </div>
                <div className="cell cell_value grid">
                  <div className="input_wrap release">
                    <input type="file" hidden ref={hiddenFileInputRef} onChange={onChangeImgFile} title={'file'} />
                    <Button className="btn full_blue" onClick={onClickFindFile}>
                      파일찾기
                    </Button>
                  </div>
                  <div className="input_wrap release productimg">
                    {Object.keys(file).length > 0 && file?.fileNm !== ''&& file?.fileNm !== null && (
                      <>
                        <input type="text" className="input" value={file.fileNm} disabled title={'search'} />
                        <Button className="del" onClick={removeImgFile}>
                          <span className="hide">삭제버튼</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="freight_service_wrap sec">
        <div className="table_list_wrap type02">
          <ul className="table_list freight_service">
            <li className="table_row">
              <div className="item_section">
                <div className="cell cell_label cell_header ">
                  <span className="label">
                    견적 비교 및<br />
                    택배사 선택
                  </span>
                </div>
                <div className="cell cell_value grid grid_unset">
                  {estimateList && estimateList.map((estimate, index) => (
                    <EstimateListItem
                      key={index}
                      handlePopup={handlePopup}
                      sellerInfo={sellerInfo}
                      file={file}
                      form={form}
                      setForm={setForm}
                      estimate={estimate}
                      index={index}
                      estimateList={estimateList}
                      setEstimateList={setEstimateList}
                    />
                  ))}
                  <Button className="btn full_blue quantity" onClick={addEstimate}>
                    수량별 조건 추가
                  </Button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="sub_text">
          <p className="text">* 내품가액이 300만 원이 넘어가면 배송조회가 되지 않을 수 있습니다.</p>
          <p className="text">* 내품가액 : 박스 또는 파렛트 안의 상품 가격입니다.</p>
        </div>
      </div>
    </>
  )
}

const EstimateListItem = (props) => {
  const { form, setForm, sellerInfo,file,estimate,index,setEstimateList,estimateList } = props
  const [selectedDeliveryCompany, setSelectedDeliveryCompany] = useState({ entpInfoId: estimate?.entpInfoId, esttAmt: estimate?.esttAmt, qty:estimate?.qty, company:estimate?.entpInfoName, apiResultYn:estimate?.apiResultYn})
  const [popup, setPopup] = useState(false)
  const [isPop, setIsPop] = useState(false)
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: null, btnMsg: '확인' })
  const handlePopupAlert = useCallback(() => {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: null })
    }, [popupAlert])

  const handlePopup = useCallback(() => {
      setPopup(!popup)
    },[popup])

  const getFreightEstimate = async()=>{
    handlePopup()
    if(checkInfo()  ){
      await Axios({
        url: API.MYPAGE.MY_BUYER_PRODUCT_DELIVERY_LIST,
        method: 'post',
        data: {
          rlontfZpcd: form?.rlontfZpcd,
          rlontfAdr: form?.rlontfAdr,
          rlontfDtad: form?.rlontfDtad,
          pdfNm: form?.dvrynonePtrnName === '' ? '상품' : form?.dvrynonePtrnName,
          prdtBrdh: form?.prdtBrdh,
          prdtVrtc: form?.prdtVrtc,
          prdtAhgd: form?.prdtAhgd,
          prdtWgt: form?.prdtWgt,
          mxmmGdsCnt: form?.mxmmGdsCnt,
          dchGdsPrc: form?.dchGdsPrc,
          prdtpcknUtId: form?.prdtpcknUtId,
          estiQty: selectedDeliveryCompany?.qty,
          productFileList: [
            {
              fileId: form?.fileId
            }
          ]
        }
      }).then((response) => {
        if (response?.data?.code === '200') {

          let _form = [...form.deliveryProductServiceInfoList]
          setSelectedDeliveryCompany({
            entpInfoId: response?.data?.data?.list[0]?.dvryEntps[0]?.entpInfoId,
            esttAmt: response?.data?.data?.list[0]?.dvryEntps[0]?.dvrynone,
            qty:selectedDeliveryCompany?.qty,
            company:response?.data?.data?.list[0]?.dvryEntps[0]?.entpNm,
            apiResultYn:response?.data?.data?.list[0]?.dvryEntps[0]?.apiResultYn,
          })

          _form[index] = {
            entpInfoId: response?.data?.data?.list[0]?.dvryEntps[0]?.entpInfoId,
            esttAmt: response?.data?.data?.list[0]?.dvryEntps[0]?.dvrynone,
            qty:selectedDeliveryCompany?.qty,
            company:response?.data?.data?.list[0]?.dvryEntps[0]?.entpNm,
            apiResultYn:response?.data?.data?.list[0]?.dvryEntps[0]?.apiResultYn,
          }

          setForm({...form, deliveryProductServiceInfoList: [..._form] })
          setIsPop(true)
        }else if(response?.data?.code === '400'){
          setPopupAlert({ ...popupAlert, type: 'alert', msg: '잠시 후 다시 시도해주세요.'  })
        }
      })
    }
  }

  const handleUnitCount =
      (e) => {
        setSelectedDeliveryCompany({...selectedDeliveryCompany, qty: e.target.value})
      }
  const checkInfo = () => {
    if (
        !Number(form.dchGdsPrc) ||
        !Number(form.prdtAhgd) ||
        !Number(form.prdtBrdh) ||
        !Number(form.prdtVrtc) ||
        !Number(form.prdtWgt) ||
        !Number(selectedDeliveryCompany.qty) ||
        selectedDeliveryCompany.qty == 0
    ) {
      return false
    }
    if (form.rlontfAdr.length === 0 || form.rlontfDtad.length === 0 || form.rlontfZpcd.length === 0) return false

    return true
  }

  useEffect(()=>{


  },[selectedDeliveryCompany,form])
  return (
    <>
      {popupAlert?.active && <PopupAlert handlePopup={handlePopupAlert} msg={popupAlert?.msg} />}
      {popup && checkInfo() && isPop ? (
          <FreightService
              handlePopup={handlePopup}
              form={form}
              sellerInfo={sellerInfo}
              setSelectedDeliveryCompany={setSelectedDeliveryCompany}
              selectedDeliveryCompany={selectedDeliveryCompany}
              file={file}
              setForm={setForm}
              index={index}
              setEstimateList={setEstimateList}
              estimateList={estimateList}
          />
      ) : null}
      {popup && !checkInfo() ? <ConfirmPopUp handlePopup={handlePopup}></ConfirmPopUp> : null}
      <div className="input_wrap release">
        <div className="input_total_wrap input_won area_add">
          <input
            type="number"
            className="input ta_right"
            placeholder={0}
            id={'qty'}
            onChange={handleUnitCount}
            value={selectedDeliveryCompany?.qty || ''}
            title={'qty'}
          />
          <span className="unit">개 이하로 구매</span>
        </div>
        <Button className="btn full_blue on" onClick={getFreightEstimate}>
          운송 업체 선택
        </Button>
      </div>
      {selectedDeliveryCompany.qty && selectedDeliveryCompany.company &&
          <div className="com_info">
            <p className="text">
            * 선택된 운송업체 : <span className="bold">{selectedDeliveryCompany?.company}</span> / 예상견적 : {addComma(selectedDeliveryCompany.esttAmt)}원
            </p>
        </div>
      }

    </>
  )
}

const ConfirmPopUp = (props) => {
  const { handlePopup } = props

  return (
    <div className={`popup_wrap popup delete_confirm_popup ship_estimate_list`}>
      <div className="layer">&nbsp;</div>
      <div className="container">
        <BtnClose onClick={handlePopup} />
        <div className="popup_content">
          <div className="confirm_msg_wrap">
            <p className="msg">아래 내용이 입력되어야 견적확인이 가능합니다.</p>
            <div className="estimate_list">
              <p className="list">-상품출고지</p>
              <p className="list">-내품가액</p>
              <p className="list">-제품규격(부피)</p>
              <p className="list">-제품규격(무게)</p>
              <p className="list">-구매 수량</p>
            </div>
            <div className="btn_group">
              <Button className="full_blue" onClick={handlePopup}>
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfo
