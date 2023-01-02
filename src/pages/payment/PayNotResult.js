import BreadCrumbs from "../../components/BreadCrumbs";

const PayNotResult = (props) => {
    return (
        <>
            <div className="mypage product each_write ask_detail paydetail">
                <div className="container">
                    <BreadCrumbs {...props} />
                    <div className="toggle_card_layout active">
                        <div className="toggle_card_header">
                            <div className="title">주문내역</div>
                        </div>
                        <div className="no_save_wrap">
                            <div className="no_save_text_wrap">
                                <p className="no_save_text">현재, 결제정보 데이터 오류로 인해,</p>
                                <p className="no_save_text">결제는 완료되었으나 커머스BOX내에 결제내역에 표시되지 않습니다.</p>
                            </div>
                            <div className="no_save_text_wrap">
                                <p className="no_save_text">이러한 경우, 결제정보를 확인하기 위해서는 결제취소 후</p>
                                <p className="no_save_text">재결제가 필요합니다.</p>
                            </div>
                            <div className="no_save_text_wrap">
                                <p className="no_save_text">판매자에게 직접 문의하여 결제취소를 문의해주시길 바랍니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PayNotResult