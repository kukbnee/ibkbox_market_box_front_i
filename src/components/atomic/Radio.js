/******* @INFO
 type = default || reverse
 ******/
const Radio = (props) => {
  const { className = '', type = 'default', id, label, onChange, SubComponent, ...other } = props

  return (
    <>
      <div className={`radio_wrap ${type === 'reverse' ? 'reverse' : ''} ${className}`}>
        <input type="radio" id={id} onChange={onChange} {...other} title={'radio'} />
        <label htmlFor={id}>&nbsp;</label>
        <label htmlFor={id}>{label}</label>
      </div>
      {SubComponent && <SubComponent />}
    </>
  )
}

export default Radio
