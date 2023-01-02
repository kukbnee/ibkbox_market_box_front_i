import { useState, useEffect, useCallback, useContext, useRef } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'
import EstimateProductInfo from 'components/mypage/qnaUser/estimate/EstimateProductInfo'
import EstimateDeliveryInfo from 'components/mypage/qnaUser/estimate/EstimateDeliveryInfo'
import PopupAlert from 'components/PopupAlert'
import { UserContext } from 'modules/contexts/common/userContext'

const EstimationForm = (props) => {

  const { mainItemInfo, handlePopup } = props
  const userContext = useContext(UserContext)
  const fileUploadRef = useRef()
  const allowExtensions = ['jpg', 'JPG', 'PNG', 'png', 'jpeg', 'JPEG']
  const [productInfo, setProductInfo] = useState([])
  const [deliveryInfo, setDeliverytInfo] = useState({})
  const [popupAlert, setPopupAlert] = useState({ active: false, msg: '', msgBtn: '확인' })
  const [isSignature, setIsSignature] = useState(false)

  const handlePopupAlert = useCallback(() => {
    setPopupAlert({ ...popupAlert, active: !popupAlert })
  }, [popupAlert])

  const handleFileUploader = useCallback(() => {
    fileUploadRef.current.click()
  }, [])

  const onChangeImgFile = useCallback(async (e) => {
    let file = e?.target?.files[0]
    if(file === undefined) return

    
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
          sealUpload({ rgslImgFileId: response.data?.data?.fileId })
        }
      })
    } else {
      setPopupAlert({ ...popupAlert, active: true, msg: '.jpg, .png, .jpeg 파일만 업로드 가능합니다.' })
    }
  }, [userContext, popupAlert])

 
  const saveEstimation = useCallback(async () => { //저장 validations
    let checkBlockPdf = false
    let blockPdfCode = [ 'GDS00002', 'GDS00003', 'GDS00005' ]
    let pdfInfoIdCnt = 0
    await productInfo.map((pdf) => { //견적 발송 가능한 상품 리스트인ㅌ지 체크
      if(blockPdfCode.includes(pdf.pdfSttsId)) checkBlockPdf = true //판매중지 상품 체크
      if(pdf.pdfInfoId != null) pdfInfoIdCnt = pdfInfoIdCnt + 1 //직접입력 상품만 있는지 체크
    })

    if(checkBlockPdf){
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '견적 상품에 판매중지 상품이 있습니다.\n판매중지 상품은 견적을 발송 할 수 없습니다.' })
      return
    }
    if(productInfo?.length < 1) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '상품을 추가 해주세요.' })
      return
    }
    if(pdfInfoIdCnt < 1) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '직접입력 상품만으론 견적을 발송할 수 없습니다.\n상품을 추가 해주세요.' })
      return
    }
    if(deliveryInfo?.dvryPtrnId === "GDS02002" && deliveryInfo?.dvrynone === 0) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '배송비를 입력 해주세요.' })
      return
    }
    if(deliveryInfo?.dvryPtrnId === "GDS02004" && deliveryInfo?.rcarZpcd === "") {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '주소를 입력 해주세요.' })
      return
    }
    if(deliveryInfo?.dvryPtrnId === "GDS02001" && deliveryInfo?.rlontfZpcd === "") {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '상품 출고지 주소를 입력 해주세요.' })
      return
    }
    if( (deliveryInfo?.dvryPtrnId === "GDS02001" && deliveryInfo?.rcarZpcd === "" ) ||
        (deliveryInfo?.dvryPtrnId === "GDS02001" && deliveryInfo?.rcarNm === "" ) ||
        (deliveryInfo?.dvryPtrnId === "GDS02001" && deliveryInfo?.rcarCnplone === "" )) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '받는 분 정보를 입력 해주세요.' })
      return
    }
    if(deliveryInfo?.dvryPtrnId === "GDS02001" && deliveryInfo?.entpInfoId === "") {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '화물서비스를 선택 해주세요.' })
      return
    }
    if(!isSignature) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: '인감을 등록 해주세요.' })
      return
    }

    postEstimationSave()
    
  }, [productInfo, deliveryInfo, isSignature, userContext])

  const postEstimationSave = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_ESTIMATION_SAVE,
      method: 'post',
      data: {
        ...deliveryInfo,
        inqrInfoId: mainItemInfo?.inqrInfoId,
        items: productInfo,
        rgslImgFileId: userContext?.state?.userInfo?.rgslImgFileId, //인감 이미지 id
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        handlePopup('send')
        setProductInfo([]) //상품정보 초기화
      } else {
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: response.data.message })
      }
    })
  }, [ productInfo, deliveryInfo, userContext ])

  const sealUpload = useCallback(async (params)=>{
    await Axios({
      url: API.MYPAGE.MY_SEAL_SAVE,
      method: 'post',
      data: params
    }).then((response) => {
      if (response?.data?.code === '200') {
        userContext?.actions?.getUserInfo() //유저 context 업데이트
        setIsSignature(true)
      }
    })
  }, [])


  useEffect(() => {
    //인감 url 정보가 있는지 체크
    if(userContext?.state?.userInfo?.rgslImgFileUrl) setIsSignature(true)
  }, [userContext?.state?.userInfo])


  const signature = () => {
    //인감부분 ui
    if(userContext?.state?.userInfo?.rgslImgFileUrl){
      return(
        <div className="img_wrap">
          <img src={userContext.state.userInfo.rgslImgFileUrl} alt={userContext.state.userInfo.bplcNm} />
        </div>
      )
    } else {
      return (
        <Button className="btn add" onClick={handleFileUploader}>
          <span className="hide">인감 등록</span>
        </Button>
      )
    }
  }

  return (
    <>
      <div className="popup_wrap popup_bargain_register estimate estimateItem">
        <div className="layer">&nbsp;</div>
        <div className="container scroll">
          <div className="popup_header">
            <h3 className="popup_title">견적서</h3>
            <BtnClose onClick={() => handlePopup('close')} />
          </div>
          <div className="estimate_content">
            <EstimateProductInfo mainItem={mainItemInfo} handleUpdateProduct={setProductInfo} />
            <EstimateDeliveryInfo productInfo={productInfo} handleUpdateDelivery={setDeliverytInfo} />
            <div className="stamp_wrap">
              <div className="text_wrap">
                <p className="text01">위와 같이 견적을 발송합니다.</p>
                <p className="text01">{mainItemInfo?.selrUsisName}</p>
                <input type="file" hidden ref={fileUploadRef} onChange={onChangeImgFile} title={'file'} />
                {!isSignature && <p className="text02 peach">인감을 등록해주세요.</p>}
              </div>
              <div className="stamp_img">
                {signature()}
              </div>
            </div>
            <div className="button_wrap">
              <Button className="linear_blue btn" onClick={() => handlePopup('close')}>취소</Button>
              <Button className="full_blue btn" onClick={saveEstimation}>견적 발송</Button>
            </div>
            <p className="etc_text">*IBK는 결제 및 판매에 직접 관여하지 않으며, 책임은 각 판매업체에 있습니다.</p>
          </div>
        </div>
      </div>
      {popupAlert?.active && <PopupAlert className={'popup_review_warning'} msg={popupAlert?.msg} btnMsg={popupAlert?.msgBtn} handlePopup={handlePopupAlert} />}
    </>
  )
}

export default EstimationForm
