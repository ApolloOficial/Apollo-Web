import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SearchInput } from '../../components/inputs/search-input'
import { useLayoutContext } from '../../hooks/useLayoutContext'
import { getHomeCards } from './home.config'
import './Home.css'

export default function Home() {
  const { user } = useLayoutContext()
  const [search, setSearch] = useState('')

  const firstName = user?.fullName.trim().split(/\s+/)[0]
  const cards = user ? getHomeCards(user.role) : []

  return (
    <section className="home">
      <div className="home__hero">
        <h1 className="home__title">
          {firstName
            ? `Olá, ${firstName}. O que você procura?`
            : 'Olá. O que você procura?'}
        </h1>
        <div className="home__search">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Busque por projetos, equipes e muito mais."
          />
        </div>
      </div>

      <ul className="home__cards">
        {cards.map(({ title, description, to, icon: CardIcon }) => (
          <li key={to}>
            <Link className="home-card" to={to}>
              <CardIcon className="home-card__icon" />
              <h2 className="home-card__title">{title}</h2>
              <p className="home-card__description">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
