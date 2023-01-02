import React, {memo, useContext, useState, useCallback, useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from 'modules/contexts/common/userContext'
import Axios from 'modules/utils/Axios'
import API from 'modules/constants/API'
import Button from 'components/atomic/Button'
import Counter from 'components/Counter'
import PathConstants from 'modules/constants/PathConstants'
import { addComma } from 'modules/utils/Common'
import PopupCustom from 'components/PopupCustom'
import PopupAlert from 'components/PopupAlert'
import PopupAgencyRequest from 'components/product/detail/PopupAgencyRequest'
import Badge from 'components/atomic/Badge'

const BasicInfo = (props) => {
  const history = useHistory()
  const userContext = useContext(UserContext)
  const { productInfo, setProduct, onStore, sellerId, deliveryinfo, sellerMemberInfo, deliveryCntInfoList, deliveryLocalInfoList} = props
  const [counterVal, setCounterVal] = useState(1)
  const [addCartPopup, setAddCartPopup] = useState(false)
  const [loginPopup, setLoginPopup] = useState(false)
  const [popupAgency, setPopupAgency] = useState(false)
  const [popupAlert, setPopupAlert] = useState({ active: false, type: 'ALERT', msg: null, caseMsg: [], btnMsg: '확인' })

  const handleLoginPopup = () => { //로그인 팝업
    setLoginPopup(!loginPopup)
  }

  const handleAddCartPopup = () => { //장바구니 팝업
    setAddCartPopup(!addCartPopup)
    if(addCartPopup) userContext.actions.actAddCartCount()
  }

  const handlePopupAlert = useCallback((btnType) => { //alert 팝업
    //정회원 등록하러 메인박스 로그인으로 이동(팝업 꺼지면 안됨)
    if(btnType === 'btnMsg' && popupAlert?.type === 'USER_TYPE') window.open(`${process.env.REACT_APP_MAIN_BOX_URL}/member/login.do`)
    else setPopupAlert({ ...popupAlert, active: !popupAlert.active, type: 'ALERT', msg: null, caseMsg: [] })
  }, [popupAlert])

  const onClickLogin = () => { //로그인하기
    handleLoginPopup()
    window.esgLogin()
  }


  const handleAdd = () => { //상품 수량 변경(추가)
    if(productInfo?.ordnMxmmQtyYn === 'Y'){
      let result = productInfo?.ordnMxmmQty > counterVal ? counterVal+1 : productInfo?.ordnMxmmQty
      setCounterVal(result)
    }else{
      setCounterVal(counterVal + 1)
    }
  }

  const handleMinus = useCallback(() => { //상품 수량 변경(감소)
    let counterValue = counterVal - 1
    if (counterValue <= productInfo?.ordnMnmmQty) { //최소구매 수량인지 체크
      setCounterVal(productInfo?.ordnMnmmQty) 
      return
    }

    if(counterValue < 1){
      setCounterVal(1) //최소구매 수량은 1
    } else { 
      setCounterVal(counterValue)
    }

  }, [counterVal])

  const handleCntChange = (e) => { //상품 수량 변경(직접입력)
    let reqExp = /[^0-9]/g 
    let numberTxt = e.target.value ? parseInt(e.target.value.replace(reqExp, '')) : 0 //숫자만 입력 받기
    setCounterVal(numberTxt)
  }

  const handleCntOnBlur = () => { //상품 수량 변경(직접입력) 후 주문 수량 최소/최대 체크
    //최소 주문 수량 체크
    if(counterVal < productInfo?.ordnMnmmQty){
      setCounterVal(productInfo.ordnMnmmQty)
      setPopupAlert({
        ...popupAlert,
        active: true,
        type: 'ALERT',
        msg: `최소 구매 수량은 ${productInfo.ordnMnmmQty}개 입니다.`,
        caseMsg: []
      })
      return
    }
   
    //최대 주문 수량 체크
    if(productInfo?.ordnMxmmQtyYn === 'Y' && counterVal > productInfo?.ordnMxmmQty){
      setCounterVal(productInfo.ordnMxmmQty)
      setPopupAlert({
        ...popupAlert,
        active: true,
        type: 'ALERT',
        msg: `최대 구매 수량은 ${productInfo.ordnMxmmQty}개 입니다.`,
        caseMsg: []
      })
      return
    }
  }
 
  const handlePopupAgency = useCallback(() => {
    if(!userContext?.state?.userInfo?.isLogin ){
      handleLoginPopup()
      return;
    }

    if(sellerMemberInfo?.mmbrtypeId === 'SRS00001'){ //판매자가 준회원 일 때: 불가
      setPopupAlert({
        ...popupAlert,
        active: true,
        type: 'USER_TYPE',
        msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
        caseMsg: [
          '하단 우측의 정회원등록버튼 클릭',
          '메인BOX에서 로그인',
          '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
          '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
          '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
        ],
        btnMsg:'정회원 등록하러 가기',
        btnMsg2:'닫기'
      })
      return
    }

    if(userContext?.state?.userInfo?.mmbrtypeId === 'SRS00001'|| //회원유형(준회원/개인회원) -> 메인박스 이동
       userContext?.state?.userInfo?.mmbrtypeId === 'SRS00004'){
      setPopupAlert({ 
        ...popupAlert,
        active: true,
        type: 'USER_TYPE',
        msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
        caseMsg: [
          '하단 우측의 정회원등록버튼 클릭',
          '메인BOX에서 로그인',
          '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
          '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
          '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
        ],
        btnMsg:'정회원 등록하러 가기',
        btnMsg2:'닫기'
      })
    }

    if(userContext?.state?.userInfo?.mmbrtypeId === 'SRS00002'){ //회원유형(정회원)
      setPopupAlert({
        ...popupAlert,
        active: true,
        type: 'ALERT',
        msg: `에이전시 요청은 에이전시 권한이 승인(관리자 승인 최초 1회)된 계정만 진행가능합니다.\n마이페이지>에이전시>보낸요청에서 에이전시 요청을 진행해주세요.`,
        btnMsg:'확인'
      })
      return
    }

    if(userContext?.state?.userInfo?.mmbrtypeId === 'SRS00003'){ //회원유형(에이전시)
      setPopupAgency(!popupAgency)
      return
    }

  }, [popupAgency, userContext, sellerMemberInfo])

  
  const onLike = (wishFlg, pdfInfoId) => {
    if(!userContext?.state?.userInfo?.isLogin ){
      handleLoginPopup()
      return;
    }

    if(userContext?.state?.userInfo?.mmbrtypeId==="SRS00004"){
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: 'USER_TYPE',
        msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
        caseMsg: [
          '하단 우측의 정회원등록버튼 클릭',
          '메인BOX에서 로그인',
          '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
          '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
          '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
        ],
        btnMsg:'정회원 등록하러 가기',
        btnMsg2:'닫기'
      })
      return;
    }
    switch (wishFlg) {
      case 'Y':
        Axios({
          url: API.MAIN.WISH_DELETE,
          method: 'post',
          data: {
            pucsUsisId: userContext.state.userInfo.utlinsttId,
            pucsId: userContext.state.userInfo.userId,
            pdfInfoId: pdfInfoId
          }
        }).then((response) => {
          if (response?.data?.code === '200') {
            setProduct({ ...productInfo, wishFlg: 'N' })
          }
        })
        break
      case 'N':
        Axios({
          url: API.MAIN.WISH_SAVE,
          method: 'post',
          data: {
            pucsUsisId: userContext.state.userInfo.utlinsttId,
            pucsId: userContext.state.userInfo.userId,
            pdfInfoId: pdfInfoId
          }
        }).then((response) => {
          if (response?.data?.code === '200') {
            setProduct({ ...productInfo, wishFlg: 'Y' })
          }
        })
        break
    }
  }

  const addProductInCart = async () => {
    if(userContext?.state?.userInfo?.mmbrtypeId==="SRS00004"){
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: 'USER_TYPE',
        msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
        caseMsg: [
          '하단 우측의 정회원등록버튼 클릭',
          '메인BOX에서 로그인',
          '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
          '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
          '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
        ],
        btnMsg:'정회원 등록하러 가기',
        btnMsg2:'닫기'
      })
      return;
    }

    if(productInfo?.ordnQtyLmtnUsyn === 'Y' && counterVal < productInfo?.ordnMnmmQty){
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: 'ALERT',
        msg: `최소 구매 수량은 ${productInfo.ordnMnmmQty}개 입니다.`,
        caseMsg: []
      })
      return;
    }

    if (userContext.state.userInfo.isLogin)

    await Axios({
      url: API.MAIN.BASKET_SAVE,
      method: 'post',
      data: {
        pucsUsisId: userContext.state.userInfo.utlinsttId,
        pucsId: userContext.state.userInfo.userId,

        pdfInfoId: productInfo.pdfInfoId,
        pdfCnt: counterVal,
        utId: 'COC02001'
      }
    }).then((response) => {
      if (response?.data?.code === '200') {
        handleAddCartPopup()
      }
    })
    else handleLoginPopup()
  }

  const applyAgency = useCallback(
    async (agencyFlg) => {
      setPopupAgency(false)
      switch (agencyFlg) {
        case 'Y':
          Axios({
            url: API.PRODUCT.APPLY_AGENCY,
            method: 'get',
            params: { pdfId: productInfo.pdfInfoId }
          }).then((response) => {
            if (response?.data?.code === '200') setProduct({ ...productInfo, agenReqState: 'Y' })
            else setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: response.data.data, caseMsg: [] })
          })
          break
        case 'N':
          Axios({
            url: API.PRODUCT.APPLY_AGENCY,
            method: 'get',
            data: { pdfId: productInfo.pdfInfoId }
          }).then((response) => {
            if (response?.data?.code === '200') setProduct({ ...productInfo, agenReqState: 'N' })
            else setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: response.data.data, caseMsg: [] })
          })
          break
      }
    },
    [productInfo]
  )

  const handleProductPayment = useCallback(async () => {

    if(userContext?.state?.userInfo?.isLogin === false){
      setLoginPopup(true)
      return
    }

    if(userContext?.state?.userInfo?.mmbrtypeId === "SRS00004"){
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: 'USER_TYPE',
        msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
        caseMsg: [
          '하단 우측의 정회원등록버튼 클릭',
          '메인BOX에서 로그인',
          '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
          '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
          '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
        ],
        btnMsg:'정회원 등록하러 가기',
        btnMsg2:'닫기'
      })
      return;
    }

    if(productInfo?.ordnQtyLmtnUsyn === 'Y' && counterVal < productInfo?.ordnMnmmQty){
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: 'ALERT',
        msg: `최소 구매 수량은 ${productInfo.ordnMnmmQty}개 입니다.`,
        caseMsg: []
      })
      return;
    }

    if(productInfo?.ordnMxmmQtyYn === 'Y' && counterVal > productInfo?.ordnMxmmQty){
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: 'ALERT',
        msg: `최대 구매 수량은 ${productInfo.ordnMxmmQty}개 입니다.`,
        caseMsg: []
      })
      return;
    }

    await Axios({
      url: API.ORDER.PAY_PRODUCT,
      method: 'post',
      data: { addr: '', products: [{ orderQty: counterVal, pdfInfoId: productInfo?.pdfInfoId }] }
    }).then((response) => {
      if (response?.data?.code === '200') {
        history.push({
          pathname: `${PathConstants.PAYMENT}`,
          state: {
            type: 'PRODUCT',
            data: { addr: '', products: [{ orderQty: counterVal, pdfInfoId: productInfo?.pdfInfoId }] }
          }
        })
      } else {
        setPopupAlert({ ...popupAlert, active: !popupAlert.active, msg: response?.data?.message, caseMsg: [] })
      }
    })
  }, [counterVal,productInfo])

  const onQna=async()=>{
    if(!userContext?.state?.userInfo?.isLogin ){
      handleLoginPopup()
      return;
    }

    if(userContext?.state?.userInfo?.mmbrtypeId==="SRS00004"){ //개인회원
      setPopupAlert({
        ...popupAlert,
        active: !popupAlert.active,
        type: 'USER_TYPE',
        msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
        caseMsg: [
          '하단 우측의 정회원등록버튼 클릭',
          '메인BOX에서 로그인',
          '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
          '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
          '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
        ],
        btnMsg:'정회원 등록하러 가기',
        btnMsg2:'닫기'
      })
      return;
    }

    if(userContext?.state?.userInfo?.mmbrtypeId === 'SRS00001' ){ //준회원
      setPopupAlert({ 
        ...popupAlert,
        active: true,
        type: 'USER_TYPE',
        msg: `정회원 등록시에 사용가능한 메뉴입니다.\n\n정회원 등록은 다음과 같이 진행해주시길 바랍니다.`,
        caseMsg: [
          '하단 우측의 정회원등록버튼 클릭',
          '메인BOX에서 로그인',
          '로그인 후 좌측 메뉴에서 회사관리>사업자등록 메뉴에서 사업자 등록 진행',
          '사업자 등록을 진행 후 현재 창에서 새로고침(또는 F5버튼 클릭)',
          '정회원 인증 확인(정회원 여부는 커머스BOX>마이페이지>내정보에서 확인 가능합니다.)'
        ],
        btnMsg:'정회원 등록하러 가기',
        btnMsg2:'닫기'
      })
      return;

    }else{

      await Axios({
        url: API.PRODUCT.PRODUCT_DETAIL_QNA_SAVE,
        method: 'post',
        data: { pdfInfoId: productInfo.pdfInfoId }
      }).then((response) => {
        if(response?.data?.code === '200') {
          history.push({pathname: `${PathConstants.MY_PAGE_QNA_USER_VIEW}/${response.data.data}`, state: {inqrInfoId: response.data.data}})
        } else {
          setPopupAlert({ ...popupAlert, acive: true, type: 'ALERT', msg: '잠시 후 다시 시도해주세요.', caseMsg: []  })
        }
      })

    }}

  const onCart = ()=>{ //장바구니 담기 후 장바구니로 이동 클릭
    userContext.actions.actAddCartCount() //헤더 장바구니 카운트 업데이트
    history.push(PathConstants.MY_PAGE_CART) //장바구니 페이지로 이동
  }

  useEffect(()=>{
    setCounterVal(Number(productInfo?.ordnMnmmQty) > 0 ? Number(productInfo?.ordnMnmmQty) : 1)
  },[productInfo?.ordnMnmmQty])

  return (
    <>
      {/* 카테고리 depth */}
      <ul className="history_location_list">
        <li className="history_location_item">
          <Link to={{ pathname: PathConstants.PRODUCT, state: { depth: 2, ctgyCd: productInfo?.pdfCtgyId?.slice(2,4)} }}>{productInfo?.tms2ClsfNm}</Link>
        </li>
        <li className="history_location_item">
          <Link to={{ pathname: PathConstants.PRODUCT, state: { depth: 2, ctgyCd: productInfo?.pdfCtgyId?.slice(2,4)} }}>{productInfo?.tms3ClsfNm}</Link>
        </li>
        <li className="history_location_item">
          <Link to={{ pathname: PathConstants.PRODUCT, state: { depth: 2, ctgyCd: productInfo?.pdfCtgyId?.slice(2,4)} }}>{productInfo?.tms4ClsfNm}</Link>
        </li>
        <li className="history_location_item">
          <Link to={{ pathname: PathConstants.PRODUCT, state: { depth: 2, ctgyCd: productInfo?.pdfCtgyId?.slice(2,4)} }}>{productInfo?.tms5ClsfNm}</Link>
        </li>
      </ul>

      {/* 상품정보 */}
      <div className="product_info">
        <div className="product_name_wrap">
          {productInfo?.agenInfId && (
            <div className="badge_wrap">
              <Badge className="badge full_blue">에이전시</Badge>
            </div>
          )}
          <p className="product_name">{productInfo?.pdfNm}</p>
          <div className="product_model">{productInfo?.mdlnm}</div>
          {/*<div className="product_company">*/}
          {/*  <button className="company_name" onClick={() => onStore()}>*/}
          {/*    {productInfo?.selrUsisName}*/}
          {/*  </button>*/}
          {/*</div>*/}
        </div>
        {productInfo?.pdfSttsId === 'GDS00002' || productInfo?.pdfSttsId === 'GDS00005' ? ( 
          <div className="stop_sell_wrap">판매가 중지된 상품입니다.</div> 
        ) : (
          <>
            <div className="price_info">
              {/* 가격정보 */}
              {(userContext?.state?.userInfo?.mmbrtypeId === 'SRS00004' || !userContext?.state?.userInfo?.mmbrtypeId) ? (
                <div className="price">******원</div>
              ) : (
                productInfo.prcDscsYn==='Y' ? (
                  <div className="price">가격협의</div>
                ) : ( 
                  productInfo.salePrc > 0 ? (
                    <>
                      <div className="price pdf_detail_sale_price">{addComma(productInfo?.salePrc)}원</div>
                      <div className="price pdf_detail_ori_price">{addComma(productInfo?.pdfPrc)}원</div>
                    </>
                  ) : (
                    <div className="price">{addComma(productInfo?.pdfPrc)}원</div>
                  )
                )
              )}
              {userContext?.state?.userInfo?.utlinsttId !== sellerId || productInfo.prcDscsYn==='Y' ? <Button className={'full_blue'} onClick={onQna}>견적요청</Button> : ''}
            </div>

            {/* 최소구매수량 표시 */}
            {productInfo?.ordnQtyLmtnUsyn === 'Y' && (
              <dl className="dl volume_info">
                <dt>최소구매수량 :</dt>
                <dd>
                  <span className="count color_blue">{productInfo?.ordnMnmmQty}</span>개
                </dd>
              </dl>
            )}
          </>
        )}
      </div>

      <div className="product_introduce_wrap">
        <p className="product_name">{productInfo?.brfDesc}</p>
        <p className="product_introduce">{productInfo?.brfSubDesc}</p>
      </div>

      {!(productInfo?.pdfSttsId === 'GDS00002' || productInfo?.pdfSttsId === 'GDS00005') && ( //판매중지 상품이 아닐 때
        <>
          {deliveryinfo?.dvryTypeName ? (
              <div style={{paddingTop : '10px', color: '#878296'}}>
                <div>배송정보 : {deliveryinfo.dvryPtrnName}</div>
                <div style={{paddingTop : '10px', color: '#878296'}}>
                  (
                    기본 배송비: {deliveryinfo.dvryBscprce} 원
                    {
                      deliveryLocalInfoList?.map((item, index) =>
                          <span>{`${index == 0 ? " / " : ""} ${item.trl} : ${item.amt} 원 추가 ${index + 1 == deliveryLocalInfoList.length ? " " : ", "}`}</span>
                      )
                    }
                    {
                      deliveryCntInfoList?.map((item, index) =>
                          <span>{`${index == 0 ? " / " : ""} 구매수량 ${item.qty} 개 이상 : ${item.amt} 원 추가 ${index + 1 == deliveryCntInfoList.length ? " " : ", "}`}</span>
                      )
                    }
                  )
                </div>
              </div>  ) : <></>}
        <div className="purchase_wrap">
          <div className="purchase_inner">
            <Counter
              value={addComma(Number(counterVal))}
              handleAdd={handleAdd}
              handleMinus={handleMinus}
              handleInput={handleCntChange}
              onBlur={handleCntOnBlur}
            />
            <div className="btn_group">
              <Button className={'full_white'} onClick={addProductInCart}>
                장바구니
              </Button>
              <Button className={'full_black '} disabled={counterVal === 0} onClick={() => handleProductPayment()}>
                구매하기
              </Button>
            </div>
          </div>
          <div className="additional_wrap">
            <Button
              className={`btn_add_wish ${productInfo.wishFlg === 'Y' && 'active'}`}
              onClick={() => onLike(productInfo.wishFlg, productInfo.pdfInfoId)}
            >
              <span>위시리스트에 추가 {productInfo.wishFlg === 'Y' && '완료'}</span>
            </Button>

            {/* 에이전시인지 요청버튼 */}
            {userContext?.state?.userInfo?.utlinsttId != sellerId && (
              <Button className={`btn_add_agency ${productInfo?.agenReqState === 'Y' && 'active'}`} onClick={()=>handlePopupAgency() }>
                <span>{productInfo?.agenReqState === 'Y' ? '에이젼시 요청 완료' : '에이젼시 요청'}</span>
              </Button>
            )}
          </div>
        </div>
          </>
      )}


      {/* 로그인 팝업 */}
      {loginPopup && (
        <PopupCustom className={'register_info_popup add_cart_popup'} handlePopup={handleLoginPopup}>
          <div className="content">
            <div className="text">로그인이 필요합니다.</div>
          </div>
          <div className="btn_group">
            <Button className={'full_blue'} onClick={onClickLogin}>
              로그인하러 가기
            </Button>
          </div>
        </PopupCustom>
      )}

      {/* 장바구니 팝업 */}
      {addCartPopup && (
        <PopupCustom className={'register_info_popup add_cart_popup'} handlePopup={handleAddCartPopup}>
          <div className="content">
            <div className="text">상품이 장바구니에 담겼습니다.</div>
          </div>
          <div className="btn_group">
            <Button className={'full_blue'} onClick={onCart}>장바구니 바로가기</Button>
            <Button className={'full_blue'} onClick={handleAddCartPopup}>쇼핑 계속하기</Button>
          </div>
        </PopupCustom>
      )}
      
      {/* 에이전시 팝업 */}
      {popupAgency && <PopupAgencyRequest handlePopupAgency={handlePopupAgency} applyAgency={applyAgency} />}

      {/* alert 팝업 */}
      {popupAlert?.active && (
        <PopupAlert
          handlePopup={(btnType) => handlePopupAlert(btnType)}
          className={popupAlert?.caseMsg?.length ? 'popup_review_warning popup_unable_pay' : 'popup_review_warning'}
          msg={popupAlert?.msg}
          caseMsg={popupAlert?.caseMsg}
          btnMsg={popupAlert?.btnMsg}
          btnMsg2={popupAlert?.btnMsg2} 
        />
      )}
    </>
  )
}

export default memo(BasicInfo)
