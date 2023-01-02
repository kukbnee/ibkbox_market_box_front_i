import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const SellerStoreSlider = (props) => {
  
  const { data } = props
  SwiperCore.use([Navigation, Pagination, Autoplay])

  return (
    <div className="slider2_wrap">
      <Swiper
        pagination={{ clickable: true }}
        className="mySwiper"
        autoplay={{ delay: '4000', disableOnInteraction: false }}
      >
        {data.map((d, idx) => {
          if (d.oppbYn === 'Y') {
            return (
              <SwiperSlide key={'slider2_' + idx}>
                <div className="main_gallery_item">
                  {d?.url?.includes('ibkbox.net') ?
                    <Link to={d.url.split('ibkbox.net')[1]}>
                      <div className="img_wrap">
                        <img src={d.imgUrl} alt="" />
                      </div>
                    </Link>
                    :
                    <a href={d?.url} target="_blank" rel="noreferrer">
                      <div className="img_wrap">
                        <img src={d.imgUrl} alt="" />
                      </div>
                    </a>
                  }
                </div>
              </SwiperSlide>
            )
          }
        })}
      </Swiper>
    </div>
  )
}

export default SellerStoreSlider
