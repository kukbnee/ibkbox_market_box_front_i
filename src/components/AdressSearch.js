import React, { Suspense } from 'react'
import DaumPostcode from 'react-daum-postcode'
import { BtnClose } from 'components/atomic/IconButtons'
import Loading from 'components/Loading'

const AdressSearch = (props) => {
  const { closePopup, setAddress } = props

  return (
    <div className="popup_wrap popup_bargain_register estimate estimateItem type02 type04">
      <div className="layer">&nbsp;</div>
      <div className="container scroll popup_post">
        우편 주소 검색
        <div className="popup_header">
          <BtnClose onClick={closePopup} />
        </div>
        <div className="post_search_wrap">
            <Suspense fallback={<Loading />}>
                <DaumPostcode onComplete={setAddress} popupTitle={'우편 주소 검색'} {...props} />
            </Suspense>
        </div>
      </div>
    </div>
  )
}

export default AdressSearch
