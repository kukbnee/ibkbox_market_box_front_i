/******* @INFO
 type = type02 || ""
 ******/

const Counter = (props) => {

  const { type = '', value, handleAdd, handleMinus, handleInput, onBlur } = props

  if (type === 'type03') { //장바구니 팝업 카운터
    return (
      <div className={'counter_vertical_wrap type03'}>
        <button className="btn_minus" onClick={handleMinus}>
          <span className="hide">빼기</span>
        </button>
        <input type="text" value={value} onChange={handleInput} title={'count'} onBlur={onBlur} maxLength={10} />
        <button className="btn_add" onClick={handleAdd}>
          <span className="hide">더하기</span>
        </button>
      </div>
    )
  } else if (type === 'type02') { //장바구니 페이지 카운터
    return (
      <div className={'counter_vertical_wrap'}>
        <button className="btn_minus" onClick={handleMinus}>
          <span className="hide">빼기</span>
        </button>
        <input type="text" value={value} onChange={handleInput} title={'count'} onBlur={onBlur} maxLength={10} />
        <button className="btn_add" onClick={handleAdd}>
          <span className="hide">더하기</span>
        </button>
      </div>
    )
  } else { //상품 상세 카운터
    return (
      <div className={'counter_wrap'}>
        <input type="text" value={value} onChange={handleInput} title={'count'} onBlur={onBlur} maxLength={10} />
        <div className="controller">
          <button className="btn_add" onClick={handleAdd}>
            <span className="hide">더하기</span>
          </button>
          <button className="btn_minus" onClick={handleMinus}>
            <span className="hide">빼기</span>
          </button>
        </div>
      </div>
    )
  }
}

export default Counter
