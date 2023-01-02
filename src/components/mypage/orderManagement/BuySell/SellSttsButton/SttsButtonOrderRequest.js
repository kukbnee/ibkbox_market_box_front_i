import Button from 'components/atomic/Button'

const SttsButtonOrderRequest = (props) => {

    const { handleButton } = props

    return (
        <>
            <div className="btn_group">
                <Button className="btn full_blue btn_ship_info_write" onClick={() => handleButton()}>배송요청</Button>
            </div>
        </>
    )
}

export default SttsButtonOrderRequest
