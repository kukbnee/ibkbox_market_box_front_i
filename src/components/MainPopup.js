import IconClose from 'assets/images/ico_cancel_white.png'

const MainPopup = (props) => {
    const {data, handleMainPopup, handleNoSeeMore} = props

    return(
        <div className="main_popup_wrap">
            {
                data?.map((item, idx) => (
                    <div className="main_popup_item"
                         key={"main_popup_item_" + idx}
                         style={{
                             top: `${idx === 0 ? 10 : 150 * idx}px`,
                             left: '10px'
                         }}
                    >
                        <button
                            className={'main_popup_close'}
                            title={"팝업닫기"}
                            onClick={() => handleMainPopup(item?.popupInfId)}
                        >
                            <img src={IconClose} alt="팝업닫기"/>
                        </button>
                        <a href={item?.link} target={'_blank'} rel="noreferrer" style={{display: 'block', width: '100%', minHeight: '150px'}}>
                            <img src={item?.imgUrl} alt={item?.ttl} style={{width: '100%'}} />
                        </a>
                        <div className="today_closing_wrap">
                            <input type="checkbox" id={item?.popupInfId} onChange={e => handleNoSeeMore(e, item.popupInfId)} />
                            <label htmlFor={item?.popupInfId} style={{cursor: 'pointer'}}>오늘 하루 열지 않음</label>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default MainPopup