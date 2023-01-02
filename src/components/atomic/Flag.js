const Flag = (props) => {
  const { className = '', children } = props
  return <div className={`flag ${className}`}>{children}</div>
}

export default Flag
