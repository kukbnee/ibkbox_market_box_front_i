import { BtnClose } from 'components/atomic/IconButtons'
import Button from 'components/atomic/Button'
import { useState } from 'react'
import Radio from 'components/atomic/Radio'

const EstimateItem04 = (props) => {
  // 배송유형 라디오버튼 리스트
  const [deleveryType, setDeleveryType] = useState({
    selected: 'type01',
    radioList: [
      { id: 'type01', value: '직접배송' },
      { id: 'type02', value: '배송비없음' },
      { id: 'type03', value: '구매자가 직접 수령' },
      { id: 'type04', value: '화물서비스 이용' }
    ]
  })
  const handleDelivery = (e) => {
    setDeleveryType({
      ...deleveryType,
      selected: e.target.id
    })
  }

  const { handlePopup } = props
  return (
    <div className="popup_wrap popup_bargain_register estimate estimateItem type02 type04">
      <div className="layer">&nbsp;</div>
      <div className="container scroll">
        <div className="popup_header">
          <h3 className="popup_title">견적서</h3>
          <BtnClose onClick={handlePopup} />
        </div>
        {/*estimate_content start*/}
        <div className="estimate_content">
          <div className="sub_header">
            <p className="title">견적내역</p>
          </div>
          <div className="estimate_responsive_wrap">
            {/*table_wrap start*/}
            <div className="table_wrap">
              <div className="table_inner">
                <div className="cell_wrap cell_tr">
                  <div className="cell num">NO</div>
                  <div className="cell name">상품명</div>
                  <div className="cell unitprice">단가(원)</div>
                  <div className="cell quantity">주문수량</div>
                  <div className="cell unit">단위</div>
                  <div className="cell money">금액(원)</div>
                </div>
                <div className="cell_wrap cell_td">
                  <div className="cell num">1</div>
                  <div className="cell name">
                    {/*이미지가 있으면 */}
                    <div className="contents_wrap">
                      <div className="img_wrap">
                        <img src={require('assets/images/tmp/img_cont04.png').default} alt="" />
                      </div>
                      <div className="name_text">도요토미 반사식 석유 난로 RS</div>
                    </div>
                  </div>
                  <div className="cell unitprice">15,000</div>
                  <div className="cell quantity">2</div>
                  <div className="cell unit">개</div>
                  <div className="cell money">15,000</div>
                </div>

                <div className="cell_wrap cell_td">
                  <div className="cell num">2</div>
                  <div className="cell name">
                    {/*이미지가 없으면*/}
                    <div className="name_text">도요토미 반사식 석유 난로 RSabasdfsdafdsaf</div>
                  </div>
                  <div className="cell unitprice">15,000</div>
                  <div className="cell quantity">2</div>
                  <div className="cell unit">개</div>
                  <div className="cell money">15,000</div>
                </div>
                <div className="cell_wrap cell_td">
                  <div className="result">
                    <div className="amount">
                      <p className="text01">공급가액 : 30,000</p>
                      <p className="text02">부가세(VAT) : 3,000원</p>
                    </div>
                    <div className="total">총액 : 33,000원</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*table_wrap end*/}
          {/* 견적요청하기 반응형 start*/}
          <div className="estimate_responsive_design">
            <div className="table_content type01 type02">
              {/*1개일때는 공급가액, 부가세, 총액이 다 노출됨
                2개이상일때는 맨 마지막에만 공급가액, 부가세, 총액이 노출됨
              */}
              <div className="estimate_resp_mo">
                <div className="cell tr accent">1</div>
                <div className="cell through pdname">
                  <div className="title">상품명</div>
                  <div className="info_c">
                    <div className="contents_wrap">
                      <div className="img_wrap">
                        <img src={require('assets/images/tmp/img_goods01.png').default} alt="" />
                      </div>
                      <div className="text_wrap">
                        <p className="desc">도요토미 반사식 석유 난로 RSRSRSRSRSR</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cell through">
                  <div className="title">단가(원)</div>
                  <div className="info_c">15,000</div>
                </div>
                <div className="cell through">
                  <div className="title">주문수량</div>
                  <div className="info_c">2</div>
                </div>
                <div className="cell through">
                  <div className="title">단위</div>
                  <div className="info_c">개</div>
                </div>
                <div className="cell through">
                  <div className="title">금액(원)</div>
                  <div className="info_c">15,000</div>
                </div>
                <div className="cell through">
                  <div className="etc_text_wrap">
                    <p className="etc_name">공급가액:30,000</p>
                    <p className="line" />
                    <p className="etc_name">부가세(VAT):3,000원</p>
                  </div>
                </div>
                <div className="cell through">
                  <div className="title">총액</div>
                  <div className="info_c textright">34,000 원</div>
                </div>
              </div>

              <div className="estimate_resp_mo">
                <div className="cell tr accent">2</div>
                <div className="cell through pdname">
                  <div className="title">상품명</div>
                  <div className="info_c">
                    <div className="contents_wrap">
                      <div className="text_wrap">
                        <p className="desc">도요토미 반사식 석유 난로 RSRSRSRSRSR</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cell through">
                  <div className="title">단가(원)</div>
                  <div className="info_c">15,000</div>
                </div>
                <div className="cell through">
                  <div className="title">주문수량</div>
                  <div className="info_c">2</div>
                </div>
                <div className="cell through">
                  <div className="title">단위</div>
                  <div className="info_c">개</div>
                </div>
                <div className="cell through">
                  <div className="title">금액(원)</div>
                  <div className="info_c">15,000</div>
                </div>
              </div>

              <div className="estimate_resp_mo">
                <div className="cell tr accent">3</div>
                <div className="cell through pdname">
                  <div className="title">상품명</div>
                  <div className="info_c">
                    <div className="contents_wrap">
                      <div className="img_wrap">
                        <img src={require('assets/images/tmp/img_goods01.png').default} alt="" />
                      </div>
                      <div className="text_wrap">
                        <p className="desc">도요토미 반사식 석유 난로 RSRSRSRSRSR</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cell through">
                  <div className="title">단가(원)</div>
                  <div className="info_c">15,000</div>
                </div>
                <div className="cell through">
                  <div className="title">주문수량</div>
                  <div className="info_c">2</div>
                </div>
                <div className="cell through">
                  <div className="title">단위</div>
                  <div className="info_c">개</div>
                </div>
                <div className="cell through">
                  <div className="title">금액(원)</div>
                  <div className="info_c">15,000</div>
                </div>
                <div className="cell through">
                  <div className="etc_text_wrap">
                    <p className="etc_name">공급가액:30,000</p>
                    <p className="line" />
                    <p className="etc_name">부가세(VAT):3,000원</p>
                  </div>
                </div>
                <div className="cell through">
                  <div className="title">총액</div>
                  <div className="info_c textright">34,000 원</div>
                </div>
              </div>
            </div>
          </div>
          {/* 견적요청하기 반응형 end */}
          {/*배송유형 start*/}

          {/*발송하기 - 화물서비스 상세 start*/}
          <div className="sub_header type02 type04">
            <p className="title">배송유형</p>
          </div>
          <div className="delivery_price_wrap">
            <div className="delivery_left">화물서비스 이용</div>
            <div className="delivery_right">
              <p className="blue subtext">
                이용 택배사 : <span className="bold">천일화물</span>
              </p>
            </div>
          </div>
          {/*발송하기 - 화물서비스 상세 end*/}

          {/*상세보기(화물) start*/}
          <div className="sub_header type02 type04">
            <p className="title">배송비 입력</p>
          </div>
          <div className="delivery_price_wrap">
            <div className="delivery_left">화물서비스 이용</div>
            <div className="delivery_right">
              <p className="blue subtext">
                이용 택배사 : <span className="bold">천일화물</span>
              </p>
            </div>
          </div>
          {/*상세보기(화물) end*/}

          {/*상세보기(직접배송) start*/}
          <div className="sub_header type02 type04">
            <p className="title">배송비 입력</p>
          </div>
          <div className="delivery_price_wrap">
            <div className="delivery_left">배송비</div>
            <div className="delivery_right">
              <p className="price">5,000원</p>
            </div>
          </div>
          {/*상세보기(직접배송) end*/}

          {/*상세보기 start*/}
          <div className="sub_header type02 type04">
            <p className="title">배송비 입력</p>
          </div>
          <div className="delivery_price_wrap">
            <div className="delivery_left">상품 수령위치</div>
            <div className="delivery_right">
              <p className="address">제주특별자치도 서귀포시 남원읍 중산간동로7227번길 111-10</p>
            </div>
          </div>
          {/*상세보기 end*/}





          <div className="delivery_result">
            <p className="deli_price">배송비 : 15,000 원</p>
            <div className="deli_subprice">
              <p className="price01">결제 금액 : 33,000원(견적 총액) + 15,000(배송비)</p>
              <p className="price02">총 : 48,000 원</p>
            </div>
          </div>
          <div className="stamp_wrap">
            <div className="text_wrap">
              <p className="text01">위와 같이 견적을 발송합니다.</p>
              <p className="text01">(주)꺼죠히터</p>
              {/*인감등록일때 밑에 div 보입니다.*/}
              {/*<p className="text02 peach">인감을 등록해주세요. </p>*/}
            </div>
            <div className="stamp_img">
              {/*인감등록 아닐때는 img_wrap div 지워주세요.*/}
              <div className="img_wrap">
                <img src={require('assets/images/tmp/tmp_stamp.png').default} alt="인감" />
              </div>
              {/*인감등록일때 밑에 div 보입니다.*/}
              {/*<Button className="btn add">*/}
              {/*  <span className="hide">add btn</span>*/}
              {/*</Button>*/}
            </div>
          </div>
          {/*배송유형end*/}

          {/*button_wrap start*/}
          <div className="button_wrap">
            <Button className="linear_blue btn">닫기</Button>
            {/*발송하기 - 화물서비스 상세 일때는 견적요청 > 견적취소 full_blue > full_peach*/}
            <Button className="full_blue btn">결제하기</Button>
          </div>
          {/*button_wrap end*/}
          <p className="etc_text">*IBK는 결제 및 판매에 직접 관여하지 않으며, 책임은 각 판매업체에 있습니다.</p>
        </div>
        {/*estimate_content end*/}
      </div>
    </div>
  )
}

export default EstimateItem04
