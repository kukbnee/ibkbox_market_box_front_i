import { addComma } from 'modules/utils/Common'

const CargoOrderItem = (props) => {

  const { data } = props

  const categoryForm = () =>{
    if(data?.tms2ClsfNm && data?.tms3ClsfNm && data?.tms4ClsfNm && data?.tms5ClsfNm){
      return data?.tms2ClsfNm + " > " + data?.tms3ClsfNm + " > " + data?.tms4ClsfNm + " > " + data?.tms5ClsfNm
    } else {
      return
    }
  }

  return (
    <div className="table_wrap">
      <ul className="table_list">
        <li className="table_item">
          <div className="cell cell_header cell_title">구분</div>
          <div className="cell cell_header cell_content text_center">내용</div>
        </li>
        <li className="table_item">
          <div className="cell cell_title">상품명</div>
          <div className="cell cell_content">{data?.pdfNm}</div>
        </li>
        <li className="table_item">
          <div className="cell cell_title">카테고리</div>
          <div className="cell cell_content">{categoryForm()}</div>
        </li>
        <li className="table_item">
          <div className="cell cell_title">내품가액</div>
          <div className="cell cell_content">{data?.dchGdsPrc ? addComma(Number(data.dchGdsPrc)) : 0} 원</div>
        </li>
        <li className="table_item">
          <div className="cell cell_title">제품규격(부피)</div>
          <div className="cell cell_content">
            <div className="content_list">
              <p className="text">가로 : {data?.prdtBrdh ? addComma(Number(data.prdtBrdh)) : 0} Cm,</p>
              <p className="text">세로 : {data?.prdtVrtc ? addComma(Number(data.prdtVrtc)) : 0} Cm,</p>
              <p className="text">높이 : {data?.prdtAhgd ? addComma(Number(data.prdtAhgd)) : 0} Cm</p>
            </div>
          </div>
        </li>
        <li className="table_item">
          <div className="cell cell_title">제품규격(무게)</div>
          <div className="cell cell_content">{data?.prdtWgt ? data?.prdtWgt : 0} kg</div>
        </li>
        <li className="table_item">
          <div className="cell cell_title">수량</div>
          <div className="cell cell_content">{data?.ordnQty ? addComma(Number(data.ordnQty)) : 0} 개</div>
        </li>
      </ul>
    </div>
  )
}

export default CargoOrderItem
