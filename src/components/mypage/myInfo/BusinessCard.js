import { useCallback } from 'react'
import Button from 'components/atomic/Button'
import html2canvas from 'html2canvas'

const BusinessCard = (props) => {

  const { myData } = props

  const handleDownload = useCallback(() => {
    html2canvas(document.querySelector("#capture")).then(canvas => {
      let link = document.createElement('a')
      document.body.appendChild(link)
      link.href = canvas.toDataURL('image/png')
      link.download = `${myData?.bplcNm}-download.png`
      link.click()
      document.body.removeChild(link)
    })
  }, [myData])

  return (
    <div className="inner">
      <div className="tit_area">
        <p className="title">명함</p>
        <Button className={'btn full_blue edit save'} onClick={handleDownload}>명함 저장</Button>
      </div>
      <div className="cnt_wrap">
        <div className="business_card" id="capture">
          <p className="url">{myData?.hmpgAdres}</p>
          <p className="company">{myData?.bplcNm}</p>
          <div className="person">
            <p className="duty">{myData?.authorCodeNm}</p>
            <p className="name">{myData?.userNm}</p>
          </div>
          <div className="connect_wrap">
            <div className="connect_inner">
              {myData?.moblphonNo && (<p>TEL : <span>{myData.moblphonNo}</span></p>)}
              {myData?.reprsntFxnum && (<p>FAX : <span>{myData.reprsntFxnum}</span></p>)}
              <p>{myData?.email}</p>
            </div>
            <div className="connect_inner">
              <p className="address">{myData?.postNo && (`(${myData.postNo}) ${myData?.nwAdres} ${myData?.nwAdresDetail}`)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessCard
