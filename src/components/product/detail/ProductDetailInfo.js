import { useCallback, useContext, useState } from 'react'
import { UserContext } from 'modules/contexts/common/userContext'
import CardItem from 'components/product/CardItem'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import 'assets/style/toastui-editor.min.css'

const ProductDetailInfo = (props) => {

  const { productInfo, sellerInfo, returnInfo, relatedProductInfo, sellerMemberInfo } = props

  const userContext = useContext(UserContext)
  const [showTelNo, setShowTelNo] = useState(false)

  const onFormTelNo = useCallback((telNo) => { //전화번호 출력 형태
    if(telNo === null || telNo === undefined ){ 
      return
    }

    if(telNo?.search('-') < 0){  //전화번호가 '-' 없이 등록된 경우
      let value = telNo.replace(/[^0-9]/g, '')
      let result = ''
      let restNumber = ''
      if (value.startsWith('02')) {
        result = value.substr(0, 2)
        restNumber = value.substring(2)
      } else if (value.startsWith('1')) {
        restNumber = value
      } else {
        result = value.substr(0, 3)
        restNumber = value.substring(3)
      }
      if (restNumber.length === 7) {
        result = `${result}-${restNumber.substring(0, 3)}`
        result = `${result}-${restNumber.substring(3)}`
      } else {
        result = `${result}-${restNumber.substring(0, 4)}`
        result = `${result}-${restNumber.substring(4)}`
      }

      return result

    } else { //전화번호가 '-' 포함하여 등록된 경우
      return telNo
    }

  })

  return (
    <>
      <div className={'product_info_detail'}>
        <div
          className={'product_info_detail_content toastui-editor-contents'}
          dangerouslySetInnerHTML={{ __html: productInfo.dtlDesc }}
        />
      </div>
      {
        relatedProductInfo?.length !== 0 &&
          <div className="relative_prod_wrap">
            <div className="relative_prod_header">
              <p className="info">보고 계신 상품과 비슷한 제품들도 살펴보세요</p>
              <p className="section_title">관련 제품</p>
            </div>
            <div className="relative_prod_content">
              {relatedProductInfo.map((item, index) => (
                  <div className="relative_prod" key={index}>
                    <CardItem data={item} />
                  </div>
              ))}
              <div className="relative_prod_slide">
                <Swiper slidesPerView={1.2} spaceBetween={30} loop={true} className="mySwiper">
                  {relatedProductInfo.map((item, index) => (
                      <SwiperSlide key={index}>
                        <CardItem data={item} />
                      </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
      }


      <div className="info_table_wrap">
        <div className="info_wrap">
          <p className="info_title">판매자 정보</p>

          {/*pc일때*/}
          <table className="table info_table">
            <caption>판매자정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>상호명</th>
                <td>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.bplcNm
                    : `정회원부터 열람이 가능합니다.`}
                </td>
                <th>대표자명</th>
                <td>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.rprsntvNm
                    : `정회원부터 열람이 가능합니다.`}
                </td>
              </tr>
              <tr>
                <th>통신판매업신고번호</th>
                <td>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerMemberInfo?.csbStmtno
                    : `정회원부터 열람이 가능합니다.`}
                </td>
                <th>사업자등록번호</th>
                <td>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.bizrno
                    : `정회원부터 열람이 가능합니다.`}
                </td>
              </tr>
              <tr>
                <th>사업장주소</th>
                <td colSpan={3}>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.postNo && (`(${sellerInfo.postNo}) ${sellerInfo?.nwAdres} ${sellerInfo?.nwAdresDetail}`)
                    : `정회원부터 열람이 가능합니다.`}
                </td>
              </tr>
              <tr>
                <th>문의번호</th>
                <td colSpan={3}>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003' ? (
                    <div className="number_wrap">
                      {/* /!*클릭하여 확인 텍스트, 화살표 클릭시 top + on*!/ */}
                      <div className={showTelNo ? 'top' : 'top on'} onClick={() => setShowTelNo((prev) => !prev)}>
                        <p className="text">확인</p>
                        <img src={require('assets/images/ico_numchk_arrow.png').default} alt="" />
                      </div>
                      {showTelNo && (
                        <div className="bot">
                          <p className="text">{sellerInfo?.reprsntTelno ? onFormTelNo(sellerInfo.reprsntTelno) : ''}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    `정회원부터 열람이 가능합니다.`
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {/*모바일일때 tr 때문에 pc 모바일 두개로 나눔*/}
          <table className="table info_table info_table_mo">
            <caption>판매자정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              {/*정회원이 아닐경우 start*/}
              <tr>
                <th>상호명</th>
                <td colSpan={3}>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.bplcNm
                    : `정회원부터 열람이 가능합니다.`}
                </td>
              </tr>
              <tr>
                <th>대표자명</th>
                <td colSpan={3}>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.rprsntvNm
                    : `정회원부터 열람이 가능합니다.`}
                </td>
              </tr>
              <tr>
                <th>통신판매업신고번호</th>
                <td colSpan={3}>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.csbStmtno
                    : `정회원부터 열람이 가능합니다.`}
                </td>
              </tr>
              <tr>
                <th>사업자등록번호</th>
                <td colSpan={3}>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.bizrno
                    : `정회원부터 열람이 가능합니다.`}
                </td>
              </tr>
              <tr>
                <th>사업장주소</th>
                <td colSpan={3}>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003'
                    ? sellerInfo?.postNo && (`(${sellerInfo.postNo}) ${sellerInfo?.nwAdres} ${sellerInfo?.nwAdresDetail}`)
                    : `정회원부터 열람이 가능합니다.`}
                </td>
              </tr>
              <tr>
                <th>문의번호</th>
                <td colSpan={3}>
                  {userContext.state.userInfo.mmbrtypeId === 'SRS00002' ||
                   userContext.state.userInfo.mmbrtypeId === 'SRS00003' ? (
                    <div className="number_wrap">
                      {/* /!*클릭하여 확인 텍스트, 화살표 클릭시 top + on*!/ */}
                      <div className={showTelNo ? 'top on' : 'top'} onClick={() => setShowTelNo(true)}>
                        <p className="text">클릭하여 확인</p>
                        <img src={require('assets/images/ico_numchk_arrow.png').default} alt="" />
                      </div>
                      {showTelNo && (
                        <div className="bot">
                          <p className="text">{sellerInfo?.reprsntTelno ? onFormTelNo(sellerInfo.reprsntTelno) : ''}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    `정회원부터 열람이 가능합니다.`
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="info_wrap">
          <p className="info_title">반품&#47;교환정보</p>
          <table className="table">
            <caption>반품&#47;교환정보 테이블</caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th>
                  반품 &#47;교환 <br />
                  요청가능기간
                </th>
                <td colSpan={3}>{returnInfo?.rtgdInrcTrm}</td>
              </tr>
              <tr>
                <th>반품비용</th>
                <td colSpan={3}>{returnInfo?.rtgdExp}</td>
              </tr>
              <tr>
                <th>반품 &#47;교환 절차</th>
                <td colSpan={3}>{returnInfo?.rtgdInrcPrcd}</td>
              </tr>
              <tr>
                <th>
                  반품 &#47;교환이 <br />
                  불가능한 경우
                </th>
                <td colSpan={3}>{returnInfo?.rtgdInrcDsln}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
export default ProductDetailInfo
