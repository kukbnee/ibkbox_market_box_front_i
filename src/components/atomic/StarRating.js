import { useState, useEffect } from 'react'
const StarRating = (props) => {
  const { activeCnt = 2, maxCnt = 5 } = props

  const [starList, setStarList] = useState([])

  const handleSetStarList = () => {
    let activeCntVal = activeCnt
    let maxCntVal = maxCnt

    if (activeCntVal > maxCntVal) {
      activeCntVal = 0
    }

    let newList = []
    for (let i = 0; i < maxCntVal; i++) {
      newList.push({
        value: i,
        active: activeCntVal > i
      })
    }
    setStarList(newList)
  }

  useEffect(() => {
    handleSetStarList()
  }, [])

  if (starList) {
    return (
      <ul className="star_rating">
        {starList.map((star, idx) => (
          <li className={`star_rating_item ${star.active ? 'active' : ''}`} key={'star_rating_item_' + idx}>
            <span className="ico_star">&nbsp;</span>
          </li>
        ))}
      </ul>
    )
  }
}

export default StarRating
