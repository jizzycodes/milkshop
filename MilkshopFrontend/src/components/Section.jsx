function Section({ children, className = '' }) {
  return (
    <section className={`max-w-6xl mx-auto px-4 py-8 ${className}`}>
      {children}
    </section>
  )
}

export default Section
