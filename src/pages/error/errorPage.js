import Header from 'components/Header'

const ErrorPage = () => {
  return (
    <div className="wrap">
      <Header />
      <div className="err_page">
        <div className="err_page_inner">
          <p className="text">오류가 발생하였습니다&#46;</p>
          <p className="sub_text">네트워크의 연결을 확인하거나 관리자에게 문의해주세요&#46;</p>
          <p className="sub_text">TEL&#46; 02&#45;000&#45;0000 &#47; e-mail &#58; asd@asd&#46;co&#46;kr</p>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
