import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import getWindowSize from 'modules/utils/getWindowSize'

const ProductDetailSlider02 = (props) => {
  const size = getWindowSize()
  const [sliderOption, setSliderOption] = useState({
    perView: 3.45,
    btw: 18
  })
  const { children } = props

  useEffect(() => {
    if (size.width > 768) {
      setSliderOption({
        perView: 3.45,
        btw: 18
      })
    } else if (size.width > 700) {
      setSliderOption({
        perView: 3.1,
        btw: 18
      })
    } else if (size.width > 650) {
      setSliderOption({
        perView: 2.85,
        btw: 18
      })
    } else if (size.width > 540) {
      setSliderOption({
        perView: 2.3,
        btw: 18
      })
    } else if (size.width > 450) {
      setSliderOption({
        perView: 1.85,
        btw: 18
      })
    } else if (size.width > 425) {
      setSliderOption({
        perView: 1.7,
        btw: 18
      })
    } else if (size.width > 375) {
      setSliderOption({
        perView: 1.45,
        btw: 18
      })
    } else if (size.width > 360) {
      setSliderOption({
        perView: 1.4,
        btw: 18
      })
    } else {
      setSliderOption({
        perView: 1.2,
        btw: 18
      })
    }
  }, [size])

  SwiperCore.use([Navigation])
  return (
    <div className=" product_detail_slider slider3_wrap">
      <div className="product_detail_slider_inner">
        <Swiper
          slidesPerView={sliderOption.perView}
          spaceBetween={sliderOption.btw}
          navigation={true}
          className="my_product_detail_slider"
        >
          {children}
        </Swiper>
      </div>
    </div>
  )
}

export default ProductDetailSlider02
