import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const Slider = (props) => {
  const { children } = props

  SwiperCore.use([Navigation])
  return (
    <div className="slider3_wrap">
      <div className="slider3_inner">
        <Swiper slidesPerView={5} spaceBetween={19} navigation={true} className="mySwiper3">
          {children}
        </Swiper>
      </div>
    </div>
  )
}

export default Slider
