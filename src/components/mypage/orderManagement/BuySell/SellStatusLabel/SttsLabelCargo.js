import { addComma } from 'modules/utils/Common'

const SttsLabelCargo = (props) => {

  const { data } = props
  
  return (
    <>
      <div className="cargo_type">
        <p className="tit">화물서비스 이용</p>
        <p className="detail_cnt">
          &#40;
          <span className="cargo_company">{data?.entpNm}</span>&nbsp;&#58;
          <br />
          <span className="cost">{data?.dvrynone ? addComma(Number(data.dvrynone)) : 0}</span>&nbsp;원&#41;
        </p>
      </div>
    </>
  )
}

export default SttsLabelCargo
