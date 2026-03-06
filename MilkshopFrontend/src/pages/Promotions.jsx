import Section from '../components/Section'

function Promotions() {
  const promos = [
    { title: 'Promo 1', text: 'Placeholder promo description.' },
    { title: 'Promo 2', text: 'Another placeholder.' },
  ]
  return (
    <Section>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Promotions</h1>
      <ul className="space-y-4">
        {promos.map((p, i) => (
          <li key={i}>
            <h2 className="font-semibold">{p.title}</h2>
            <p className="text-gray-600 text-sm">{p.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default Promotions
