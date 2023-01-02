import { Spinner } from 'react-spinners-css'

const Loading = (props) => {

  const { display } = props

  let styles = {
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: '1000',
    // display: 'flex',
    display: display != undefined ? display : 'none',
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }

  let stylesP = {
    display: 'inline-block',
    textAlign: 'center',
    marginTop: '10px'
  }

  return (
    <div style={styles} id="loadingstate">
      <Spinner color={'#123abc'} />
      <p style={stylesP}>Loading...</p>
    </div>
  )
}

export default Loading
