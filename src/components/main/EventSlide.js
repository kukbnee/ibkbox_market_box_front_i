import Button from 'components/atomic/Button'
import CardItem from 'components/product/CardItem'
import PathConstants from 'modules/constants/PathConstants'
import { useHistory } from "react-router-dom"

const EventSlide = (props) => {

  const { event, handleOnCart } = props
  const history = useHistory()
  const handleEventDetailPage = () => {
      window.open(`${PathConstants.EVENT_DETAIL}/${event.evntInfId}`, "_blank");
      // history.push(`${PathConstants.EVENT_DETAIL}/${event.evntInfId}`)
  }

  return (
    <div className="event_inner">
      <div className="left_section">
        <div className="content">
          <p className="title">{event?.evntTtl}</p>
          <p className="content">{event?.evntCon}</p>
        </div>
        <Button className={'full_blue'} onClick={handleEventDetailPage}>전체보기</Button>
      </div>
      <div className="event_list">
        {event?.items?.map((eventItem, index) => (
          <div className="event_item" key={`event_item_${index}`}>
            <CardItem
              data={eventItem}
              buttonUiType={'OUT'}
              handleView={() => history.push('./product/detail')}
              handleOnCart={handleOnCart}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default EventSlide
