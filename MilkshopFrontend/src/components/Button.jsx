function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`ui-btn border border-border-color bg-white text-text-secondary hover:bg-green-light hover:text-text-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
