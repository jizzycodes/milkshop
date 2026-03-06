import { useInView } from '../hooks/useInView'

function Reveal({ children, as: Component = 'div', delay = 0, className = '' }) {
  const [ref, inView] = useInView()

  return (
    <Component
      ref={ref}
      className={
        `opacity-0 translate-y-3 transition-all duration-500 ease-soft will-change-transform ` +
        `${inView ? 'opacity-100 translate-y-0' : ''} ` +
        className
      }
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}

export default Reveal