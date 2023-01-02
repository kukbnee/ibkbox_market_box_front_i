import { useState, useEffect, useCallback, useContext } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import BreadCrumbs from 'components/BreadCrumbs'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'
import PopupCustom from 'components/PopupCustom'
import EachList from 'components/mypage/product/Management/EachList'
import BindList from 'components/mypage/product/Management/BindList'
import BuyerList from 'components/mypage/product/Management/BuyerList'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import { UserContext } from 'modules/contexts/common/userContext'
import PathConstants from 'modules/constants/PathConstants'

const Management = (props) => {
  // 탭 헤더
  const location = useLocation()
  const history = useHistory()
  const userContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [tabList, setTabList] = useState({
    active: location?.state?.tab ?? 'each',
    list: [
      { id: 'each', name: '개별상품' },
      { id: 'bind', name: '묶음상품' },
      { id: 'buyer', name: '바이어상품' }
    ]
  })
  const [productCount, setProductCount] = useState({
    each: 0,
    bind: 0,
    buyer: 0
  })
  const [filterSelectList, setFilterSelectList] = useState({
    selected: 'A0',
    list: [
      { value: 'A0', label: '최신등록순' },
      { value: 'A2', label: '높은가격순' },
      { value: 'A1', label: '낮은가격순' }
    ]
  })
  const [isPopup, setIsPopup] = useState(false)
  const [remove, setRemove] = useState({ target: '' })
  const [addProduct, setAddProduct] = useState({ target: '' })
  const [rejectPopup, setRejectPopup] = useState(false)
  const [redirectUserInfo, setRedirectUserInfo] = useState(false)

  const handleTab = (id) => {
    setTabList({
      ...tabList,
      active: id
    })
  }

  const handleFilterSelect = (e) => {
    setFilterSelectList({
      ...filterSelectList,
      selected: e.target.value
    })
  }

  const handleReject = () => setRejectPopup(!rejectPopup)

  const handlePopup = () => {
    setIsPopup(!isPopup)
  }

  const handleRedirectUserInfo = () => setRedirectUserInfo(!redirectUserInfo)

  const handleRemove = () => {
    setRemove({ target: tabList.active })
  }

  const handleAdd = () => {
    if (userContext.state.userInfo.mmbrsttsId === 'AUA01001') { //회원타입이 "승인"만 이동

      if(userContext.state.userInfo.csbStmtno != null && userContext.state.userInfo.csbStmtno != undefined){ //통신판매업신고번호가 있을 때
        setAddProduct({ target: tabList.active })
      } else { //통신판매업신고번호가 없을 때
        setRedirectUserInfo(true)
      }
      
    } else {
      handleReject()
    }
  }

  const getProductsCountInfo = useCallback(async () => {
    await Axios({
      url: API.MYPAGE.MY_PRODUCT_HEADER,
      method: 'get'
    }).then((response) => {
      if (response?.data?.code === '200') {
        setProductCount({
          each: response?.data?.data?.singleProductCnt,
          bind: response?.data?.data?.bundleProductCnt,
          buyer: response?.data?.data?.buyerProductCnt
        })
        setLoading(true)
      }
    })
  }, [])

  const tabComponents = {
    each: (
      <EachList
        remove={remove}
        addProduct={addProduct}
        count={productCount.each}
        orderByFlg={filterSelectList.selected}
        getProductsCountInfo={getProductsCountInfo}
        setRemove={setRemove}
      />
    ),
    bind: (
      <BindList
        remove={remove}
        addProduct={addProduct}
        count={productCount.bind}
        getProductsCountInfo={getProductsCountInfo}
        setRemove={setRemove}
      />
    ),
    buyer: (
      <BuyerList
        remove={remove}
        addProduct={addProduct}
        count={productCount.buyer}
        getProductsCountInfo={getProductsCountInfo}
        setRemove={setRemove}
      />
    )
  }

  useEffect(() => {
    getProductsCountInfo()
  }, [])

  return (
    <div className="mypage product">
      {
        // 삭제 컨펌 팝업
        isPopup && (
          <PopupCustom handlePopup={handlePopup} className={'delete_confirm_popup'}>
            <div className="confirm_msg_wrap">
              <p className="msg">
                선택하신 <b className="highlight_blue">개별상품</b>을 <br />
                정말로 삭제하시겠습니까?
              </p>
              <div className="btn_group">
                <Button className={'full_blue'}>삭제</Button>
              </div>
            </div>
          </PopupCustom>
        )
      }

      {rejectPopup && (
        <PopupCustom handlePopup={handleReject} className={'delete_confirm_popup'}>
          <div className="confirm_msg_wrap">
            <p className="msg">
              판매자 자격이 박탈되어 상품 등록이 불가능합니다.
              <br /> 관리자에게 문의하세요.
            </p>
            <div className="btn_group">
              <Button className={'full_blue'} onClick={handleReject}>
                닫기
              </Button>
            </div>
          </div>
        </PopupCustom>
      )}

      {redirectUserInfo && ( //통신판매업신고 번호가 없을 때
        <PopupCustom handlePopup={handleRedirectUserInfo} className={'delete_confirm_popup'}>
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
      

      <div className="container">
        <BreadCrumbs {...props} />
        <div className="page_header">
          <h2 className="page_title">상품관리</h2>
          <div className="btn_group">
            <Button className={'linear_blue btn_delete'} onClick={handleRemove}>
              삭제
            </Button>
            <Button className={'full_blue btn_add'} onClick={handleAdd}>
              상품등록
            </Button>
          </div>
        </div>
        {/*each_list_container start*/}
        {loading && (
          <div className="product_container each_list_container">
            <div className="tab_header mo_tab_header">
              <ul className="tab_header_list">
                {tabList.list.map((tab) => (
                  <li
                    className={`tab_header_item ${tabList.active === tab.id ? 'active' : ''}`}
                    key={tab.id}
                    onClick={() => handleTab(tab.id)}
                  >
                    <span className="label">{tab.name}</span>
                    <Badge className={tabList.active === tab.id ? 'badge full_blue' : 'badge full_grey'}>
                      {productCount[tab.id]}
                    </Badge>
                  </li>
                ))}
              </ul>
              {tabList?.active === 'each' && (
                <div className="select_wrap">
                  <select
                    className="select"
                    onChange={handleFilterSelect}
                    value={filterSelectList.active}
                    title={'filter'}
                  >
                    {filterSelectList?.list.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {tabComponents[tabList.active]}
          </div>
        )}
        {/*each_list_container end*/}
      </div>
    </div>
  )
}

export default Management
