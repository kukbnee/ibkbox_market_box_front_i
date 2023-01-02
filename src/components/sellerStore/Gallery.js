import React from 'react'
import moment from 'moment'

const Gallery = (props) => {

  const { imgUrl, storeInfo } = props

  return (
    <div className="gallery03">
      <div className="gallery03_wrap">
        {/* 이미지 */}
        {imgUrl ? (
          <img src={imgUrl} alt={storeInfo?.bplcNm} className="gallery03_img" />
        ) : (
          <img src={require('assets/images/tmp/tmp_store_gallery03.png').default} alt="default_store" />
        )}
        <div className="content_wrap">
          <div className="text">
            <p className="sub_title">{storeInfo?.bplcNm}</p>
            <p className="com_intro">{storeInfo?.userCpCon?.split("\n").map((txt, index) => (<span key={index}>{txt}<br /></span>))}</p>
          </div>
          <ul className="info_list">
            <li className="info_item item01">
              <p className="text01">설립</p>
              <p className="text02">{storeInfo?.yearCnt ? storeInfo?.yearCnt : ' - '}년차</p>
            </li>
            <li className="info_item item02">
              <p className="text01">{storeInfo?.useEntrprsSe ? storeInfo?.useEntrprsSe : '기업구분'}</p>
              <p className="text02">{storeInfo?.fondDe ? `${moment(storeInfo?.fondDe).format('YYYY')}년` : '-'}</p>
            </li>
            <li className="info_item item03">
              <p className="text01">수출입</p>
              <p className="text02">{storeInfo?.imxprtSctnText ? storeInfo?.imxprtSctnText : '-'}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Gallery
