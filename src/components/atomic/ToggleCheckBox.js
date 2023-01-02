const ToggleCheckBox = (props) => {
  const { id, label, reverse = false, onChange, checked } = props

  return (
    <div className={`toggle_checkbox ${reverse ? 'reverse' : ''}`}>
      <input type="checkbox" id={id} onChange={onChange} checked={checked} title={'toggle'} />
      <label htmlFor={id}>&nbsp;</label>
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export default ToggleCheckBox
