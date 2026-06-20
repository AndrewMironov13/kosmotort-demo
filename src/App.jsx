import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Star,
  X,
} from 'lucide-react'
import AnimatedShaderHero from './components/ui/animated-shader-hero'
import InkReveal from './components/ui/ink-reveal'
import LiquidGlassLink from './components/ui/liquid-glass-link'
import WarmAurora from './components/ui/warm-aurora'
import { business, faqs, process, reviews } from './content'

const navigation = [
  ['О нас', '#about'],
  ['Каталог', '#catalog'],
  ['Процесс', '#process'],
  ['Отзывы', '#reviews'],
  ['Контакты', '#contacts'],
]

const categories = [
  {
    title: 'Свадебные',
    text: 'Ярусные композиции для главного дня. Стоимость — от 2 600 ₽/кг.',
    image: 'images/kosmotort-berry-wedding.webp',
    className: 'category-card--large',
  },
  {
    title: 'Индивидуальные',
    text: 'Пришлите идею или фото — адаптируем оформление под ваш праздник.',
    image: 'images/kosmotort-sculptural-cake.webp',
    className: '',
  },
  {
    title: 'Детские',
    text: 'Яркие сюжетные торты под любимую тему ребёнка.',
    image: 'images/kosmotort-kids-cake.webp',
    className: '',
  },
  {
    title: 'Десерты с витрины',
    text: 'Меренговые рулеты и готовые десерты. Напишите нам — расскажем, что есть сегодня.',
    image: 'images/kosmotort-meringue-rolls.webp',
    className: 'category-card--wide',
  },
]

function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      elements.forEach((element) => element.classList.add('is-revealed'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

function Logo({ light = false }) {
  return (
    <a className={`logo ${light ? 'logo--light' : ''}`} href="#top" aria-label="Космоторт — наверх">
      Космо<span>торт</span>
    </a>
  )
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="header">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Главная навигация">
          {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <LiquidGlassLink className="order-button" href={business.vk} target="_blank" rel="noreferrer">
          Заказать торт
        </LiquidGlassLink>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Мобильная навигация">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}<ArrowRight size={17} />
            </a>
          ))}
          <a href={business.phoneHref}>{business.phone}<Phone size={17} /></a>
        </nav>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <AnimatedShaderHero />
      <div className="hero-copy hero-enter">
        <div className="pill">✦ ДЗЕРЖИНСК · АВТОРСКАЯ КОНДИТЕРСКАЯ</div>
        <h1>Искусство,<br />воплощённое<br />в десертах</h1>
        <div className="hero-description">
          <p>
            «Космоторт» — кондитерская в Дзержинске, где готовят торты на заказ,
            нежные бенто-торты и десерты для витрины.
          </p>
          <p>
            Мы поможем подобрать начинку, вес и оформление под ваш повод: день
            рождения, свадьбу, детский праздник или просто сладкий подарок. Если
            у вас уже есть идея — пришлите фото или референс, а мы подскажем, как
            лучше воплотить её в торте.
          </p>
        </div>
        <div className="hero-actions">
          <LiquidGlassLink className="button button--dark" href={business.vk} target="_blank" rel="noreferrer">
            Заказать торт <i />
          </LiquidGlassLink>
          <a className="button button--outline" href="#catalog">Смотреть каталог</a>
        </div>
        <div className="hero-stats">
          <a href={business.reviews} target="_blank" rel="noreferrer">
            <strong>4,9</strong><span>РЕЙТИНГ<br />НА ЯНДЕКС КАРТАХ</span>
          </a>
          <a href={business.reviews} target="_blank" rel="noreferrer">
            <strong>60</strong><span>ОТЗЫВОВ<br />ПОКУПАТЕЛЕЙ</span>
          </a>
        </div>
      </div>

      <div className="hero-media hero-media-enter">
        <div className="hero-visual-frame">
          <img src="images/kosmotort-berry-wedding.webp" alt="Свадебный торт Космоторт с ягодами" />
          <InkReveal />
        </div>
        <a className="hero-quote" href={business.reviews} target="_blank" rel="noreferrer">
          <div><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div>
          <blockquote>«Оформление полностью совпадает с запросом, а главное — он очень вкусный!»</blockquote>
          <span>ЕКАТЕРИНА Ф. · ЯНДЕКС КАРТЫ</span>
        </a>
      </div>

      <a className="scroll-down" href="#about">
        <span>ЛИСТАЙТЕ</span><ArrowDown size={18} />
      </a>
    </section>
  )
}

function About() {
  return (
    <section className="about section" id="about">
      <div className="about-copy" data-reveal>
        <div className="section-kicker">О НАС</div>
        <h2>Каждый торт —<br /><em>маленькая вселенная</em><br />вкуса</h2>
        <p>
          Расскажите нам о празднике, количестве гостей и пожеланиях по вкусу.
          Мы предложим подходящий формат — большой торт, бенто-торт или десерты
          для праздничного стола.
        </p>
        <p>
          Оформление можно создать по вашей идее или адаптировать понравившийся
          референс. До начала работы согласуем начинку, вес, декор, дату и стоимость.
        </p>
        <div className="about-features">
          <article><h3>По вашей идее</h3><p>Пришлите фото — адаптируем дизайн под ваш повод</p></article>
          <article><h3>Ваш любимый вкус</h3><p>Поможем подобрать начинку, вес и формат торта</p></article>
          <article><h3>К нужной дате</h3><p>Заранее согласуем срок приготовления и получение</p></article>
          <article><h3>Рядом</h3><p>Дзержинск, улица Терешковой, 20</p></article>
        </div>
      </div>

      <div className="about-images" data-reveal data-reveal-direction="right">
        <img className="about-image about-image--top" src="images/kosmotort-wedding-rose.webp" alt="Свадебный торт Космоторт с цветами" loading="lazy" />
        <img className="about-image about-image--bottom" src="images/kosmotort-interior.webp" alt="Интерьер кондитерской Космоторт" loading="lazy" />
      </div>
    </section>
  )
}

function CategoryCard({ item }) {
  return (
    <article className={`category-card ${item.className}`} data-reveal>
      <img src={item.image} alt={`Работа Космоторт: ${item.title}`} loading="lazy" />
      <div className="category-shade" />
      <div className="category-copy">
        <h3>{item.title}</h3>
        <p>{item.text}</p>
      </div>
    </article>
  )
}

function Catalog() {
  return (
    <section className="catalog section" id="catalog">
      <div className="catalog-heading" data-reveal>
        <div>
          <div className="section-kicker">КАТАЛОГ</div>
          <h2>Категории, в каждой из<br />которых —<br /><em>своя история</em></h2>
        </div>
        <p>
          Выберите подходящий формат и расскажите нам о вашем поводе. Подберём
          начинку и оформление, а точную стоимость рассчитаем до оформления заказа.
        </p>
      </div>
      <div className="category-grid">
        {categories.map((item) => <CategoryCard item={item} key={item.title} />)}
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="process section" id="process">
      <div className="center-heading" data-reveal>
        <div className="section-kicker">ПРОЦЕСС</div>
        <h2>Как мы <em>работаем</em></h2>
        <p>Четыре понятных этапа, чтобы превратить идею в готовый заказ.</p>
      </div>

      <div className="timeline">
        {process.map((step, index) => (
          <article
            className={index % 2 === 0 ? 'timeline-row' : 'timeline-row timeline-row--reverse'}
            key={step.number}
            data-reveal
            style={{ '--reveal-delay': `${index * 70}ms` }}
          >
            <div className="timeline-number">{step.number}</div>
            <span className="timeline-dot" />
            <div className="timeline-copy">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Reviews() {
  const cards = [...reviews, ...reviews]
  return (
    <section className="reviews" id="reviews">
      <div className="reviews-heading section" data-reveal>
        <div>
          <div className="section-kicker">ОТЗЫВЫ</div>
          <h2>Слова, которые<br /><em>согревают сердце</em></h2>
        </div>
        <a href={business.reviews} target="_blank" rel="noreferrer">
          Рейтинг 4,9 · 60 отзывов <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="review-marquee">
        <div className="review-track">
          {cards.map((review, index) => (
            <article className="review-card" key={`${review.name}-${index}`}>
              <div className="quote-mark">”</div>
              <blockquote>{review.text}</blockquote>
              <div className="review-author">
                <strong>{review.name}</strong>
                <span>{review.meta}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const [active, setActive] = useState(0)
  return (
    <section className="faq section">
      <div className="center-heading" data-reveal>
        <div className="section-kicker">FAQ</div>
        <h2>Коротко <em>о главном</em></h2>
      </div>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <article className={active === index ? 'is-open' : ''} key={item.question}>
            <button type="button" aria-expanded={active === index} onClick={() => setActive(active === index ? -1 : index)}>
              <span>{item.question}</span><ChevronDown size={20} />
            </button>
            {active === index && <p>{item.answer}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer className="contact" id="contacts">
      <WarmAurora />
      <div className="contact-inner">
        <div className="contact-copy" data-reveal>
          <div className="section-kicker">КОНТАКТЫ</div>
          <h2>Создадим ваш<br /><em>идеальный</em> торт</h2>
          <p>
            Напишите дату, примерный вес или количество гостей и приложите
            референс. Мы предложим подходящий вариант и заранее рассчитаем стоимость.
          </p>
          <div className="contact-buttons">
            <LiquidGlassLink className="button button--gold" href={business.phoneHref}>
              Позвонить сейчас
            </LiquidGlassLink>
            <a className="button button--dark-outline" href={business.vk} target="_blank" rel="noreferrer">Написать в VK</a>
          </div>
        </div>

        <div className="contact-cards" data-reveal data-reveal-direction="right">
          <a href={business.phoneHref}>
            <span className="contact-icon"><Phone size={18} /></span>
            <div><small>ТЕЛЕФОН</small><strong>{business.phone}</strong></div>
            <ArrowUpRight size={18} />
          </a>
          <a href={business.vk} target="_blank" rel="noreferrer">
            <span className="contact-icon"><MessageCircle size={18} /></span>
            <div><small>СОЦСЕТИ</small><strong>vk.com/cosmotort_dzr</strong></div>
            <ArrowUpRight size={18} />
          </a>
          <a href={business.yandex} target="_blank" rel="noreferrer">
            <span className="contact-icon"><MapPin size={18} /></span>
            <div><small>АДРЕС</small><strong>{business.address}</strong><p>{business.city} · ежедневно 09:00–20:00</p></div>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>

      <div className="map">
        <iframe
          src="https://yandex.ru/map-widget/v1/?ll=43.450225%2C56.236263&mode=search&oid=18620999359&ol=biz&z=16"
          title="Космоторт на Яндекс Картах"
          loading="lazy"
          allowFullScreen
        />
      </div>

      <div className="footer-line">
        <Logo light />
        <a href="#top">Наверх ↑</a>
      </div>
    </footer>
  )
}

function MobileContactBar() {
  return (
    <div className="mobile-contact-bar">
      <a href={business.phoneHref}><Phone size={19} /><span>Позвонить</span></a>
      <a href={business.vk} target="_blank" rel="noreferrer"><MessageCircle size={19} /><span>ВКонтакте</span></a>
    </div>
  )
}

function App() {
  useRevealOnScroll()

  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <About />
        <Catalog />
        <Process />
        <Reviews />
        <Faq />
      </main>
      <Contact />
      <MobileContactBar />
    </div>
  )
}

export default App
