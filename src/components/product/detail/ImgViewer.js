import { memo, useState, useEffect } from 'react'
import { SwiperSlide } from 'swiper/react'
import ProductDetailSlider from 'components/product/detail/ProductDetailSlider'
import YouTube from 'react-youtube'

const ImgaViewer = (props) => {
  const { imgList, videoList } = props
  const [active, setActive] = useState({})

  const handleActive = (item) => {
    setActive(item)
  }

  const handleVideoId = (item) => {
    const urlList = ['https://www.youtube.com/watch?v=', 'https://youtu.be/']
    return item.pictUrl.split(urlList.filter((url) => item.pictUrl.includes(url))?.[0])?.[1]
  }

  useEffect(() => {
    setActive(imgList?.[0])
  }, [imgList])

  return (
    <>
      <div className="img_wrap">
        {active?.fileType === 'video' ? (
          <YouTube
            videoId={handleVideoId(active)}
            id={'pdf_video'}
            style={{
              width: '100%',
              height: '100%'
            }}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 1, //자동재생 O
                loop: 0, //반복재생 없음
                rel: 0, //관련 동영상 표시하지 않음
                modestbranding: 1, // 컨트롤 바 youtube 로고를 표시하지 않음
                origin: process.env.REACT_APP_URL //postMessage 에러
              }
            }}
            onEnd={(e) => {
              e.target.stopVideo(0)
            }}
          />
        ) : (
          active?.imgUrl && (<img src={active?.imgUrl} alt={"product_img"} />)
        )}
      </div>
      <ul className="thumb_list">
        <ProductDetailSlider>
          {[...videoList, ...imgList]?.map((img, index) => (
            <SwiperSlide key={'slider3_' + index}>
              <li
                className={`thumb_item ${img?.pictUrl && 'video'} ${active?.fileId === img?.fileId ? 'active' : ''}`}
                key={'thumb_' + index}
                onClick={() => handleActive(img)} >
                <img src={img.imgUrl}  alt={`이미지`} />
              </li>
            </SwiperSlide>
          ))}
        </ProductDetailSlider>
      </ul>
    </>
  )
}

export default memo(ImgaViewer)
