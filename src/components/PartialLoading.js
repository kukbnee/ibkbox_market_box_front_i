import { Spinner } from 'react-spinners-css'

const Loading = () => {
    let styles = {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        minHeight: '150px',
        background: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    }

    let stylesP = {
        display: 'inline-block',
        textAlign: 'center',
    }

    return (
        <div style={styles}>
            <Spinner color={'#123abc'} style={{ transform: 'scale(0.7)' }}/>
            <p style={stylesP}>Loading...</p>
        </div>
    )
}

export default Loading
