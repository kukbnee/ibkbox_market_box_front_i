import { useState, useEffect, useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import Button from 'components/atomic/Button'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import PathConstants from 'modules/constants/PathConstants'
import ViewSetting from 'components/mypage/product/eachWrite/ViewSetting'
import BasicInfo from 'components/mypage/product/eachWrite/BasicInfo'
import SaleInfo from 'components/mypage/product/eachWrite/SaleInfo'
import ImgInfo from 'components/mypage/product/eachWrite/ImgInfo'
import DetailInfo from 'components/mypage/product/eachWrite/DetailInfo'
import ShipInfo from 'components/mypage/product/eachWrite/ShipInfo'
import VideoProduct from 'components/mypage/product/eachWrite/VideoProduct'
import LinkProduct from 'components/mypage/product/eachWrite/LinkProduct'
import SellerInfo from 'components/mypage/product/eachWrite/SellerInfo'
import PatentInfo from 'components/mypage/product/eachWrite/PatentInfo'
import PopupAlert from 'components/PopupAlert'
import PopupCustom from 'components/PopupCustom'


const EachWrite = (props) => {
  const { id } = useParams()
  const history = useHistory()
  const [isEditMode, setIsEditMode] = useState(false)
  const [viewSettingForm, setViewSettingForm] = useState({
    pdfCtgyId: '',
    pdfPgrsYn: 'Y',
    pdfSttsId: 'GDS00001'
  })
  const [basicInfoForm, setBasicInfoForm] = useState({
    pdfInfoId: '',
    selrUsisId: '',
    pdfNm: '',
    mdlnm: '',
    brfDesc: '',
    brfSubDesc: '',
    dtlDesc: undefined,
    ptntInfoYn: '',
    agenInfId: '',
    pdfKwrList: [],
    dtlDescLength: 0
  })
  const [saleInfoForm, setSaleInfoForm] = useState({
    pdfPrc: 0,
    comPrcutId: 'COC03001',
    comPdfutId: 'COC02001',
    salePrc: 0,
    prcDscsYn: 'N',
    esttUseEn: '',
    ordnQtyLmtnUsyn: 'N',
    ordnMnmmQty: 1,
    ordnMxmmQtyYn: 'N',
    ordnMxmmQty: 0
  })
  const [imgInfoForm, setImgInfoForm] = useState({ productFileList: [] })
  const [detailInfoForm, setDetailInfoForm] = useState({
    rtgdInrcTrm: '',
    rtgdExp: '',
    rtgdInrcPrcd: '',
    rtgdInrcDsln: ''
  })
  const [shipInfoForm, setShipInfoForm] = useState({
    dvryTypeId: 'GDS01001',
    dvryTypeName: '',
    dvryPtrnId: 'GDS02002',
    dvryPtrnName: '',
    dvrynonePtrnId: '',
    dvrynonePtrnName: '',
    entpInfoId: '',
    entpInfoName: '',
    dvryBscprce: 0,
    deliveryLocalInfoList: [],
    deliveryCntInfoList: [],
    deliveryCodeIndex: 0,

    fileId: '',
    cosg: '',
    cosgTpn: '',
    rlontfZpcd: '',
    rlontfAdr: '',
    rlontfDtad: '',
    prdtpcknUtId: 'DIS00001',
    dchGdsPrc: 0,
    mxmmGdsCnt: 0,
    prdtBrdh: 0,
    prdtVrtc: 0,
    prdtAhgd: 0,
    prdtWgt: 0
  })
  const [popupAlert, setPopupAlert] = useState({
    active: false,
    type: 'ALERT',
    msg: '',
    msgBtn: '확인'
  })
  const [videoProduct, setVideoProduct] = useState({ productVideoList: [] })
  const [linkProduct, setLinkProduct] = useState({ productLinkList: [] })
  const [sellerInfo, setSellerInfo] = useState({})
  const [patenInfo, setPatenInfo] = useState([])
  const [categoryList, setCategoryList] = useState({})
  const deliveryCode = [
    'GDS04001', //기본 배송비
    'GDS04002', //지역별 배송비
    'GDS04003', //수량별 배송비
    'GDS04004' //지역/수량별 배송비
    //GDS04005  화물서비스 견적
  ]
  const [allPatentList, setAllPatentList] = useState([])

  const setProductInfo = useCallback((productInfo) => {
    setViewSettingForm({
      pdfCtgyId: productInfo?.singleProduct?.pdfCtgyId,
      pdfPgrsYn: productInfo?.singleProduct?.pdfPgrsYn,
      pdfSttsId: productInfo?.singleProduct?.pdfSttsId
    })
    setBasicInfoForm({
      pdfInfoId: productInfo?.singleProduct?.pdfInfoId,
      selrUsisId: productInfo?.singleProduct?.selrUsisId,
      pdfNm: productInfo?.singleProduct?.pdfNm,
      mdlnm: productInfo?.singleProduct?.mdlnm,
      brfDesc: productInfo?.singleProduct?.brfDesc,
      brfSubDesc: productInfo?.singleProduct?.brfSubDesc,
      dtlDesc: productInfo?.singleProduct?.dtlDesc,
      ptntInfoYn: productInfo?.singleProduct?.ptntInfoYn,
      agenInfId: productInfo?.singleProduct?.agenInfId,
      pdfKwrList: productInfo?.pdfKwrList,
      dtlDescLength: productInfo?.singleProduct?.dtlDesc ? new Blob([productInfo?.singleProduct?.dtlDesc]).size : 0
    })
    setSaleInfoForm({
      pdfPrc: productInfo?.productSale?.pdfPrc,
      comPrcutId: productInfo?.productSale?.comPrcutId,
      comPdfutId: productInfo?.productSale?.comPdfutId,
      salePrc: productInfo?.productSale?.salePrc,
      prcDscsYn: productInfo?.productSale?.prcDscsYn,
      esttUseEn: productInfo?.productSale?.esttUseEn,
      ordnQtyLmtnUsyn: productInfo?.productSale?.ordnQtyLmtnUsyn,
      ordnMnmmQty: productInfo?.productSale?.ordnMnmmQty,
      ordnMxmmQtyYn: productInfo?.productSale?.ordnMxmmQtyYn,
      ordnMxmmQty: productInfo?.productSale?.ordnMxmmQty
    })
    setImgInfoForm({ productFileList: productInfo?.productFileList })
    setDetailInfoForm({
      rtgdInrcTrm: productInfo?.productReturn?.rtgdInrcTrm ?? '',
      rtgdExp: productInfo?.productReturn?.rtgdExp ?? '',
      rtgdInrcPrcd: productInfo?.productReturn?.rtgdInrcPrcd ?? '',
      rtgdInrcDsln: productInfo?.productReturn?.rtgdInrcDsln ?? ''
    })
    setShipInfoForm({
      dvryTypeId: productInfo?.deliveryinfo?.dvryTypeId,
      dvryTypeName: productInfo?.deliveryinfo?.dvryTypeName,
      dvryPtrnId: productInfo?.deliveryinfo?.dvryPtrnId,
      dvryPtrnName: productInfo?.deliveryinfo?.dvryPtrnName,
      dvrynonePtrnId: productInfo?.deliveryinfo?.dvrynonePtrnId,
      dvrynonePtrnName: productInfo?.deliveryinfo?.dvrynonePtrnName,
      entpInfoId: productInfo?.deliveryinfo?.entpInfoId,
      entpInfoName: productInfo?.deliveryinfo?.entpInfoName,
      dvryBscprce: productInfo?.deliveryinfo?.dvryBscprce,
      deliveryLocalInfoList: productInfo?.deliveryLocalInfoList,
      deliveryCntInfoList: productInfo?.deliveryCntInfoList,
      deliveryCodeIndex: deliveryCode.indexOf(productInfo?.deliveryinfo?.dvryPtrnId),

      fileId: productInfo?.deliveryBaseInfo?.fileId,
      fileNm: productInfo?.deliveryBaseInfo?.fileNm,
      cosg: productInfo?.deliveryBaseInfo?.cosg,
      cosgTpn: productInfo?.deliveryBaseInfo?.cosgTpn,
      rlontfZpcd: productInfo?.deliveryBaseInfo?.rlontfZpcd,
      rlontfAdr: productInfo?.deliveryBaseInfo?.rlontfAdr,
      rlontfDtad: productInfo?.deliveryBaseInfo?.rlontfDtad,
      prdtpcknUtId: productInfo?.deliveryBaseInfo?.prdtpcknUtId,
      dchGdsPrc: productInfo?.deliveryBaseInfo?.dchGdsPrc,
      mxmmGdsCnt: productInfo?.deliveryBaseInfo?.mxmmGdsCnt,
      prdtBrdh: productInfo?.deliveryBaseInfo?.prdtBrdh,
      prdtVrtc: productInfo?.deliveryBaseInfo?.prdtVrtc,
      prdtAhgd: productInfo?.deliveryBaseInfo?.prdtAhgd,
      prdtWgt: productInfo?.deliveryBaseInfo?.prdtWgt,
      deliveryProductServiceInfoList:productInfo?.deliveryProductServiceInfoList ,
    })
    setVideoProduct({ productVideoList: productInfo?.productVideoList })
    setLinkProduct({ productLinkList: productInfo?.productLinkList ? productInfo.productLinkList : []})

    setPatenInfo(productInfo?.patentList.filter((item) => item.checked === 'Y'))
    setAllPatentList([...productInfo?.patentList])
    // setSellerInfo({})
  }, [])

  const handleLinkBack = useCallback(() => {
    history.goBack()
  }, [])

  const handlePopupAlert = useCallback(() => {
    if (popupAlert.type === 'SAVE') history.push(PathConstants.MY_PAGE_PRODUCT)
    else setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: null, msgBtn: '확인' })
  }, [popupAlert])

  const saveProduct = useCallback(() => {
    //상품분류관련
    if (viewSettingForm?.pdfCtgyId === '') {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '카테고리를 입력해주세요.' })
      return
    }

    //상품정보관련
    if (basicInfoForm?.pdfNm === '') {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '상품명을 입력해주세요.' })
      return
    }
    if (basicInfoForm?.mdlnm === '') {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '모델명을 입력해주세요.' })
      return
    }
    if (basicInfoForm?.brfDesc === '') {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '요약설명을 입력해주세요.' })
      return
    }
    if (basicInfoForm?.brfSubDesc === '') {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '간략설명을 입력해주세요.' })
      return
    }
    if (basicInfoForm?.dtlDesc === '' || basicInfoForm?.dtlDesc === undefined || basicInfoForm?.dtlDesc === `<p><img class="ProseMirror-separator" alt=""><br class="ProseMirror-trailingBreak"></p>`) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '상세설명을 입력해주세요.' })
      return
    }
    if (basicInfoForm?.pdfKwrList?.length < 1) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '상품 키워드를 최소 1개 이상 입력해주세요.' })
      return
    }
    if (basicInfoForm?.dtlDescLength?.length > 3500000) {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        msg: '상품 상세설명이 너무 깁니다. 상세설명 길이를 줄여주세요.'
      })
      return
    }

    //가격관련
    if (saleInfoForm?.prcDscsYn === 'N' && Number(saleInfoForm?.pdfPrc) < 1) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '판매기본가를 입력해주세요.' })
      return
    }
    if (Number(saleInfoForm?.pdfPrc) < Number(saleInfoForm?.salePrc)) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '할인가는 판매기본가를 초과할 수 없습니다.' })
      return
    }
    if (Number(saleInfoForm?.ordnMnmmQty) < 1) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '최소 주문 수량은 1개 이상 입니다.' })
      return
    }
    if (saleInfoForm?.ordnMxmmQtyYn === 'Y' && Number(saleInfoForm?.ordnMnmmQty) > Number(saleInfoForm?.ordnMxmmQty)) {
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        msg: '최소 주문수량은 최대 주문수량을 초과할 수 없습니다.'
      })
      return
    }

    //타사이트 링크 관련
    if(linkProduct?.productLinkList && linkProduct?.productLinkList?.length > 0){
      for(let i=0; i<linkProduct?.productLinkList?.length; i++){
        if(!linkProduct?.productLinkList[i].linkTtl || !linkProduct?.productLinkList[i].linkUrl){
          setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '타 구매 사이트의 이름과 URL을 재확인 해주세요.' })
          return
        }
      }
    }

    //배송관련
    if (!shipInfoForm?.rlontfAdr || shipInfoForm?.rlontfAdr?.length < 1) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '상품 출고지를 입력해주세요.' })
      return
    }
    if (!shipInfoForm?.rlontfAdr || shipInfoForm?.rlontfDtad?.length < 1) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '상세 주소를 입력해주세요.' })
      return
    }
    if (!shipInfoForm?.dchGdsPrc || shipInfoForm?.dchGdsPrc == 0 ) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '내품가액(1box당)을 입력해주세요.' })
      return
    }
    if (!shipInfoForm?.prdtBrdh || shipInfoForm?.prdtBrdh == 0) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '박스규격(부피) 가로를 입력해주세요.' })
      return
    }
    if (shipInfoForm?.dvryPtrnId ==='GDS02002' && saleInfoForm.prcDscsYn === 'N' ) {
      if(shipInfoForm?.dvryBscprce == 0){
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '배송기본가를 입력해주세요.' })
        return
      }
    }
    if (shipInfoForm?.dvryPtrnId ==='GDS02001') {
      if(shipInfoForm?.deliveryProductServiceInfoList?.length===0){
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '화물서비스에 대한 정보를 입력해주세요.' })
        return
      }
      if(!shipInfoForm?.fileId){
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '화물서비스의 제품 사진을 등록해주세요.' })
        return
      }
      if(shipInfoForm?.deliveryProductServiceInfoList?.length>0){
        for(let i = 0; i<shipInfoForm?.deliveryProductServiceInfoList?.length; i++){
          if(!shipInfoForm?.deliveryProductServiceInfoList[i].esttAmt) {return}
        }
      }
    }
    if (!shipInfoForm?.prdtVrtc || shipInfoForm?.prdtVrtc == 0) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '박스규격(부피) 세로를 입력해주세요.' })
      return
    }
    if (!shipInfoForm?.prdtAhgd || shipInfoForm?.prdtAhgd == 0) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '박스규격(부피) 높이를 입력해주세요.' })
      return
    }
    if (!shipInfoForm?.prdtWgt || shipInfoForm?.prdtWgt == 0) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '박스규격(무게)를 입력해주세요.' })
      return
    }
    if (!shipInfoForm?.mxmmGdsCnt || shipInfoForm?.mxmmGdsCnt == 0) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '최대상품수(1box당)를 입력해주세요.' })
      return
    }
    if (imgInfoForm?.productFileList?.length < 1) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '이미지를 등록해주세요.' })
      return
    }

    //동영상정보관련
    if(videoProduct?.productVideoList && videoProduct?.productVideoList?.length>0){
      for(let i=0; i<videoProduct?.productVideoList?.length; i++){
        if(!videoProduct?.productVideoList[i].fileId || !videoProduct?.productVideoList[i].pictTtl || !videoProduct?.productVideoList[i].pictUrl){
          setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '제품 영상 정보를 입력해주세요.' })
          return
        }
      }
    }

    //판매자정보관련
    if(sellerInfo?.csbStmtno === null || sellerInfo?.csbStmtno === undefined || sellerInfo?.csbStmtno?.length < 1){
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'CSBSTMTNO' })
      return
    }

    //반품교환관련
    if (
      detailInfoForm?.rtgdExp === '' ||
      detailInfoForm?.rtgdInrcDsln === '' ||
      detailInfoForm?.rtgdInrcPrcd === '' ||
      detailInfoForm?.rtgdInrcTrm === ''
    ) {
      setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '반품/교환정보를 입력해주세요.' })
      return
    }

    //저장
    postSingleProductSave()

  }, [
    viewSettingForm,
    basicInfoForm,
    saleInfoForm,
    shipInfoForm,
    imgInfoForm,
    videoProduct,
    linkProduct,
    patenInfo,
    sellerInfo,
    detailInfoForm
  ])
  
  const getSellerInfo = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_SELLER_INFO,
      method: 'get'
    }).then((response) => {
      response?.data?.code === '200' && setSellerInfo(response.data.data)
    })
  }, [])

  const getProductInfo = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_SINGLE_PRODUCT_DETAIL,
      method: 'get',
      params: { pdfInfoId: id }
    }).then((response) => {
      response?.data?.code === '200' && setProductInfo(response.data.data)
    })
  }, [])

  const getCategory = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_PRODUCT_CATEGORY_LIST,
      method: 'get',
      params: { parentCode: '01' }
    }).then((response) => {
      response?.data?.code === '200' && setCategoryList(response.data.data)
    })
  }, [])

  const postSingleProductSave = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_SINGLE_PRODUCT_SAVE,
      method: 'post',
      data: {
        ...viewSettingForm,
        ...basicInfoForm,
        ...saleInfoForm,
        ...shipInfoForm,
        ...imgInfoForm,
        ...videoProduct,
        ...linkProduct,
        patentList: [...patenInfo],
        ...sellerInfo,
        ...detailInfoForm
      }
    }).then((response) => {
      if (response.data.code === '200') setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'SAVE', msg: '상품 정보가 저장되었습니다.' })
      else setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: '저장 중 오류가 발생했습니다\n잠시 후 다시 시도해주세요.' })
    })
  }, [
    viewSettingForm,
    basicInfoForm,
    saleInfoForm,
    shipInfoForm,
    imgInfoForm,
    videoProduct,
    linkProduct,
    patenInfo,
    sellerInfo,
    detailInfoForm,
    popupAlert
  ])

  const getPatent = useCallback(async () => {
    if (!id)
      await Axios({
        url: API.MYPAGE.MY_PATENT_LIST,
        method: 'get'
      }).then((response) => {
        response?.data?.code === '200' && setAllPatentList(response.data.data.list)
      })
  }, [])

  const getSellerReturnInfo = useCallback(async () => {
    if (!id)
      await Axios({
        url: API.MYPAGE.MY_SELLER_RETURN_INFO,
        method: 'get'
      }).then((response) => {
        if (response?.data?.code === '200' && response?.data?.data != null) {
          setDetailInfoForm({
            rtgdInrcTrm: response.data.data.rtgdInrcTrm ?? '',
            rtgdExp: response.data.data.rtgdExp ?? '',
            rtgdInrcPrcd: response.data.data.rtgdInrcPrcd ?? '',
            rtgdInrcDsln: response.data.data.rtgdInrcDsln ?? ''
          })
        }
      })
  }, [])

  useEffect(() => {
    if (id != undefined) { //수정일 경우
      setIsEditMode(true)
      getProductInfo()
    }
    getSellerInfo()
    getCategory()
    getPatent()
    getSellerReturnInfo()
  }, [])


  return (
    <>
      {popupAlert?.active && popupAlert?.type != 'CSBSTMTNO' && (  //alert 팝업
        <PopupAlert
          className={'popup_warning'}
          msg={popupAlert?.msg}
          btnMsg={popupAlert?.msgBtn}
          handlePopup={handlePopupAlert}
        />
      )}
      {popupAlert?.active && popupAlert?.type === 'CSBSTMTNO' && (  //통신판매업신고번호 팝업
        <PopupCustom handlePopup={handlePopupAlert} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              통신판매업신고번호를 저장 후 상품 등록해주세요.<br />
              통신판매업신고번호는 마이페이지  &gt; 내정보에서 확인 및 수정이 가능합니다.
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={() => history.push(PathConstants.MY_PAGE_MYINFO)}>
                등록하러가기
              </Button>
            </div>
          </div>
        </PopupCustom>
      )}

      <div className="mypage product each_write ">
        <div className="container">
          <BreadCrumbs {...props} />
          <div className="page_header">
            <div className="title_wrap">
              <h2 className="page_title">개별상품</h2>
              <p className="sub_title">{id ? `수정` : `등록`}</p>
            </div>
            <div className="btn_group">
              <Button className={'linear_blue btn_delete'} onClick={handleLinkBack}>
                취소
              </Button>
              <Button className={'full_blue btn_add'} onClick={saveProduct}>
                저장
              </Button>
            </div>
          </div>
          <ViewSetting form={viewSettingForm} setForm={setViewSettingForm} categoryList={categoryList} />
          <BasicInfo form={basicInfoForm} setForm={setBasicInfoForm} isEditMode={isEditMode} />
          <SaleInfo form={saleInfoForm} setForm={setSaleInfoForm} />
          <LinkProduct form={linkProduct} setForm={setLinkProduct} />
          <ShipInfo form={shipInfoForm} setForm={setShipInfoForm} sellerInfo={sellerInfo} saleInfo={saleInfoForm} />
          <ImgInfo form={imgInfoForm} setForm={setImgInfoForm} />
          <VideoProduct form={videoProduct} setForm={setVideoProduct} />
          <PatentInfo
            form={patenInfo}
            setForm={setPatenInfo}
            allPatentList={allPatentList}
            setAllPatentList={setAllPatentList}
            agenInfId={basicInfoForm?.agenInfId}
          />
          <SellerInfo sellerInfo={sellerInfo} />
          <DetailInfo form={detailInfoForm} setForm={setDetailInfoForm} />
        </div>
        <div className="page_bottom btn_group">
          <Button className={'linear_blue'} onClick={handleLinkBack}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={saveProduct}>
            저장
          </Button>
        </div>
      </div>
    </>
  )
}

export default EachWrite
