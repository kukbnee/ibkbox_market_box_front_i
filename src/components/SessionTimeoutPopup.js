import React, {useEffect} from 'react';
import {BtnClose} from "./atomic/IconButtons";
import Button from "./atomic/Button";

const SessionTimeoutPopup = ({handlePopup, timerSec = 0}) => {

    const onPopup = (btnType) => {
        if (handlePopup) handlePopup(btnType)
    }

    useEffect(() => {
    }, []);

    return (
        <div className={`popup_wrap popup_alert popup_review_warning popup_unable_pay`}>
            <div className="layer">&nbsp;</div>
            <div className="container">
                <BtnClose onClick={() => onPopup('close')} />
                <div className="popup_content">
                    <p className="msg">{`자동 로그아웃까지 ${timerSec}초 남았습니다. \n\n 연장 하시겠습니까?`}</p>
                </div>
                <div className="popup_footer">
                    <Button className={'btn linear_blue'} onClick={() => onPopup('btnMsg2')}>
                        닫기
                    </Button>
                    <Button className={'btn full_blue'} onClick={() => onPopup('btnMsg')}>
                        연장
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SessionTimeoutPopup;