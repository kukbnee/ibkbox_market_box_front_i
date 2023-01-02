const Badge = (props) => {
  const { className = '', children } = props
  return <div className={`badge ${className}`}>{children}</div>
}

export default Badge
