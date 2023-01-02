import { useHistory } from 'react-router-dom'
import Header from 'components/Header'
import Footer from 'components/Footer'

const CommonLayout = (props) => {
    const history = useHistory()

    return (
        <div className={`${!history.location.pathname.includes('/buyerletter') && `wrap`} default_size`}>
            {!history.location.pathname.includes('/buyerletter') && <Header />}
            {props?.children}
            {!history.location.pathname.includes('/buyerletter') && <Footer />}
        </div>
    )
}
export default CommonLayout
