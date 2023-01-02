import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import Button from 'components/atomic/Button'
import ConfirmItem from 'components/event/apply/ConfirmItem'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'

const Confirm = (props) => {
  const { productList, onClickTab } = props
  const { id } = useParams()
  const onClickApplyEvent = useCallback(async () => {
    await Axios({
      url: API.EVENT.SELR_SAVE,
      method: 'post',
      data: { evntInfId: id, items: productList }
    }).then((response) => {
      if (response?.data?.code === '200') {
        onClickTab('COMPLETE')
      }
    })
  }, [])

  return (
    <>
      <div className="guide_wrap">
        <p className="tit">이벤트에 신청할 상품정보를 마지막으로 확인해주세요&#46;</p>
      </div>
      <div className="article_wrap">
        <div className="product_add_list">
          <div className="table_list_wrap each_list_wrap view">
            <div className="table_header bind_header">
              <div className="cell cell_num cb_none">No</div>
              <div className="cell cell_name">상품명</div>
              <div className="cell cell_price">판매가</div>
              <div className="cell cell_cate">분류</div>
            </div>
            {/*위 테이블의 리스트*/}
            <ul className="table_list each_list scroll">
              {productList?.map((eachProd, idx) => (
                <li className="table_row each_item_row" key={'each_prod_item_' + idx}>
                  <ConfirmItem data={eachProd} index={idx} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="btn_wrap">
        <Button className={'btn btn linear_blue'} onClick={() => onClickTab('SELECT')}>
          이전
        </Button>
        <Button className={'btn btn full_blue'} onClick={onClickApplyEvent}>
          이벤트 신청
        </Button>
      </div>
    </>
  )
}

export default Confirm
