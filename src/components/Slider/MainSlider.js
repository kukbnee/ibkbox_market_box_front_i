import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const MainSlider = (props) => {
    const { data } = props

    SwiperCore.use([Navigation, Pagination, Autoplay])
    return (
        <div className="slider1_wrap">
            <Swiper
                pagination={{ clickable: true }}
                className="mySwiper"
                // autoplay={{ delay: '1000', disableOnInteraction: false }}
            >
                {data?.map((item, index) => (
                    <SwiperSlide key={'main_slider_' + index}>
                        <div className="main_gallery_item">
                            <div className="img_wrap">
                                <img
                                    src={item.imgUrl}
                                    style={{
                                        width: `100%`,
                                        height: `100%`,
                                        objectFit: `cover`
                                    }}
                                    alt=""
                                />
                            </div>
                            <div className="gallery_content">
                                <div className="gallery_inner">
                                    <p className="title" dangerouslySetInnerHTML={{__html: item.ttl}}/>
                                    <p className="content"dangerouslySetInnerHTML={{__html: item.con}}/>
                                    <div className="btn_group">
                                        <Link to={{ pathname: item.link }} target="_blank" className="full_blue">
                                            바로가기
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default MainSlider
