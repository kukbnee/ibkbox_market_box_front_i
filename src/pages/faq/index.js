import { useState, useEffect, useCallback } from 'react'
import API from 'modules/constants/API'
import Axios from 'modules/utils/Axios'
import FaqItem from 'components/faq/FaqItem'
import NoResult from 'components/NoResult'

const Faq = (props) => {

  const [faqList, setFaqList] = useState([])

  const getFaqList = useCallback(async () => {
    await Axios({
      url: API.FAQ.FAQ_LIST,
      method: 'get',
      params: {
        page: 1,
        record: 20
      }
    }).then((response) => {
      response?.data?.code === '200' && setFaqList(response.data.data.list)
    })
  }, [])

  useEffect(() => {
    getFaqList()
  }, [])

  return (
    <div className="product">
      <div className="container default_size">
        <div className="faq_wrap">
          <div className="faq_top">
            <p className="faq_title">FAQ</p>
            <p className="faq_subtitle">자주 묻는 질문</p>
          </div>
          <div className="faq_content">
            <ul className="faq_list">
              {faqList?.length > 0 ? faqList?.map((item, index) => (
                <FaqItem key={index} item={item} />
              )) : <NoResult msg={"등록된 FAQ가 없습니다."} />}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Faq
