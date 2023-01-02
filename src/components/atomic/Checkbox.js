/******* @INFO
 type = default || reverse
 ******/

const Checkbox = (props) => {
  const { className, id, onChange, checked, label, ...other } = props

  return (
    <div className={`checkbox_wrap ${className}`}>
      <input type="checkbox" id={id} onChange={onChange} checked={checked} {...other} title={id ?? 'checkbox'} />
      <label htmlFor={id}>&nbsp;</label>
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default Checkbox
