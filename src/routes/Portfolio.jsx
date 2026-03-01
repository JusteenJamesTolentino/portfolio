import TextType from '../Components/ReactBits/TypingText';
import ClickSpark from '../Components/ReactBits/ClickSpark';
import CardSwap, { Card } from '../Components/ReactBits/CardSwap';
import { projectCards } from '../utils/projectCards';
import { serviceCards } from '../utils/serviceCards';
import { cardSwapCards } from '../utils/cardSwapCards';
import { contactCards } from '../utils/contactCards';

function App() {
  return (
    <ClickSpark className="overflow-x-hidden" sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <div className='navbar fixed top-0 left-0 right-0 z-50 bg-base-300 px-3 md:px-6 shadow-sm'>
        <div className='navbar-start'>
          <p className='text-base sm:text-lg md:text-xl font-bold'>JusteenDev</p>
        </div>
        <div className='navbar-center'></div>
        <div className='navbar-end gap-1 sm:gap-2'>
          <a className='btn btn-ghost btn-sm sm:btn-md' href="#projects">Services</a>
          <a className='btn btn-ghost btn-sm sm:btn-md' href="#contact">Contact</a>
        </div>
      </div>

      <div className='hero bg-base-200 min-h-screen pt-20 sm:pt-24'>
        <div className='hero-content px-4 text-center'>
          <div className='max-w-md'>
            <TextType className='text-3xl sm:text-4xl md:text-5xl font-extrabold' text={["Hello my i am ", "JusteenDev", "A Fullstack Developer"]} typingSpeed={75} pauseDuration={1500} showCursor cursorCharacter='|' deletingSpeed={50} variableSpeedEnabled={false} variableSpeedMin={60} variableSpeedMax={120} cursorBlinkDuration={0.5} />
            <div className='py-4 sm:py-6'>
              <p className='text-lg sm:text-xl font-semibold'> "Simplicity is prerequisite for reliability."</p>
              <p> — Edsger W. Dijkstra </p>
            </div>
          </div>
        </div>
      </div>

      <div className='p-5 bg-neutral text-neutral-content'>
        <div className='w-full p-5 flex flex-col gap-4 items-start max-w-6xl mx-auto'>
          <div className='p-5'>
            <h1 className='text-3xl sm:text-4xl font-bold'>Projects</h1>
          </div>

          <div className='py-2 px-5'>
            <h1 className='text-xl sm:text-2xl font-bold'>Management Systems</h1>
          </div>

          <div className='flex flex-row flex-nowrap gap-2 p-2 pb-3 w-full overflow-x-auto shadow-sm'>
            {projectCards.map((project) => (
              <div key={project.title} className="card bg-base-300 w-60 flex-none shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">{project.title}</h2>
                  <p>{project.description}</p>
                  <div className="card-actions justify-center py-5 hover:scale-105 transition-transform duration-300">
                    <button className="btn btn-primary w-full" disabled={project.disabled}>{project.cta}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id='projects' className='hero min-h-screen bg-neutral text-neutral-content max-[768px]:place-items-start'>
        <div className='hero-content w-full max-w-6xl flex-col items-start text-left px-4 sm:px-6 max-[768px]:pt-6'>
          <div className='p-5'>
            <h1 className='text-3xl sm:text-4xl font-bold'>Services</h1>
            <p className='mt-2 text-sm sm:text-base opacity-80'>Focused development services for websites and student projects.</p>
          </div>

          <div className='flex flex-row flex-wrap gap-4 items-center justify-center w-full'>
            {serviceCards.map((service) => (
              <div key={service.title} className='border text-justify border-white/40 rounded-lg p-4 w-72 lg:w-80 h-40 lg:min-h-50 shrink-0 flex flex-col items-center gap-2 snap-start flex-none'>
                <h1 className='text-lg sm:text-xl py-2 font-bold'>{service.title}</h1>
                <p className='text-sm'>{service.description}</p>
              </div>
            ))}
          </div>

          <div className='relative w-full h-130 sm:h-140 md:h-150'>
            <CardSwap width={420} height={300} cardDistance={40} verticalDistance={48} delay={5000} pauseOnHover={false}>
              {cardSwapCards.map((cardItem) => (
                <Card key={cardItem.title} className='p-6 sm:p-8 flex flex-col justify-center gap-3 bg-black text-white border-white/40'>
                  <h3 className='text-xl sm:text-2xl font-bold'>{cardItem.title}</h3>
                  <p>{cardItem.description}</p>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>


      <div id='contact' className='hero min-h-screen bg-neutral text-neutral-content max-[768px]:place-items-start'>
        <div className='hero-content w-full max-w-6xl flex-col items-start text-left px-4 sm:px-6 max-[768px]:pt-6'>
          <div className='p-5'>
            <h1 className='text-3xl sm:text-4xl font-bold'>Contact</h1>
            <p className='mt-2 text-sm sm:text-base opacity-80'>Get in touch with me for any inquiries or projects.</p>
          </div>

          <div className='flex flex-row flex-wrap w-full gap-4 items-center justify-center'>
            {contactCards.map((contact) => (
              <div key={contact.title} className='border text-justify border-white/40 rounded-lg p-4 w-72 sm:w-80 min-h-40 shrink-0 flex flex-col items-center justify-center gap-2'>
                <a
                  href={contact.href}
                  target={contact.external ? '_blank' : undefined}
                  rel={contact.external ? 'noopener noreferrer' : undefined}
                  className='w-full text-center'
                >
                  <h1 className='text-lg sm:text-xl py-2 font-bold'>{contact.title}</h1>
                  <p className='text-sm opacity-80 wrap-break-word'>{contact.value}</p>
                </a>
              </div>
            ))}
          </div>
          
        </div>
      </div>

    </ClickSpark>
  )
}

export default App
