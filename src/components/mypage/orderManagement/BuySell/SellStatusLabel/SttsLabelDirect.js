import { addComma } from 'modules/utils/Common'

const SttsLabelDirect = (props) => {

  const { data } = props

  return (
    <>
      <div className="self_delivery_type">
        <p className="tit">직접배송</p>
        <p className="detail_cnt">
          &#40;
          <span className="cost">{data?.dvrynone ? addComma(Number(data.dvrynone)) : ` -`}</span>&nbsp;원&#41;
        </p>
      </div>
    </>
  )
}

export default SttsLabelDirect
