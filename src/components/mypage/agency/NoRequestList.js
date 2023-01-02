const NoRequestList = (props) => {

  const { isTab } = props

  return (
    <>
      {isTab === 'sen' && (
        <div className="not_approval">
          <p className="text">보낸 요청이 없습니다.</p>
          <p className="sub_text">
            에이젼시 요청은 원하는 상품의 상세 페이지에서 에이전시 요청을 통해
            <br />
            판매자에게 에이전시를 요청할 수 있습니다.
            <br />
            에이전시 요청을 통해 승인된 판매 상품은 마이페이지 &gt; 상품관리 &gt; 개별상품에 자동 등록됩니다.
          </p>
          <div className="etc_text_wrap">
            <p className="etc_text">
              * 단, 판매자 정보, 반품/교환정보는 상대 판매자가 아닌 본 계정의 정보 및 최근 반품. 교환정보로
              설정됩니다.
            </p>
            <p className="etc_text">
              * 에이전시를 수행하고 있는 제품에 대한 판매관리는 본 계정이 수행하며 IBK는 판매에 대해 관여하지
              않습니다.
            </p>
          </div>
        </div>
      )}
      {isTab === 'rec' && (
        <div className="not_approval">
          <p className="text">받은 요청이 없습니다.</p>
          <p className="sub_text">
            등록한 판매상품에 대해 타 판매자가 에이전시를 요청하면
            <br />
            해당 화면에 표시됩니다.
          </p>
        </div>
      )}
    </>
  )
}

export default NoRequestList
