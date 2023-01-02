import { useState, useCallback } from 'react'
import Button from 'components/atomic/Button'

const FaqItem = (props) => {

  const { item } = props
  const [open, setOpen] = useState(false)
  const handleOpen = useCallback(() => setOpen(!open), [open])

  return (
    <li className={`faq_item ${open ? 'on' : ''}`}>
      <div className="faq_group" onClick={handleOpen}>
        <p className="text">{item?.ttl}</p>
        <Button><span className="hide">버튼</span></Button>
      </div>
      {open && (
        <div className="faq_group_item">
          <div className="faq_group_text">
            {item?.con?.split("\n").map((txt, index) => ( <span key={index}>{txt}<br /></span> ))}
          </div>
        </div>
      )}
    </li>
  )
}

export default FaqItem
