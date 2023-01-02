import { useEffect, useState } from 'react'
import { Swiper } from 'swiper/react'
import SwiperCore, { Navigation } from 'swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import getWindowSize from 'modules/utils/getWindowSize'

const ProductDetailSlider = (props) => {
  const size = getWindowSize()
  const [sliderOption, setSliderOption] = useState({
    perView: 4,
    btw: 7
  })
  const { children } = props

  useEffect(() => {
    if (size.width < 650) {
      setSliderOption({
        perView: 3,
        btw: 7
      })
    } else {
      setSliderOption({
        perView: 4,
        btw: 7
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

export default ProductDetailSlider
