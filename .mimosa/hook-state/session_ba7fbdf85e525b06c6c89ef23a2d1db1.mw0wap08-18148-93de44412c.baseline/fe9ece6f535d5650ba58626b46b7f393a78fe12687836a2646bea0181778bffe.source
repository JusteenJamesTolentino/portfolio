import ContactForm from '../../Components/ContactForm';
import { contactCards } from '../../utils/contactCards';

function ContactApp({ openBrowser }) {
  return (
    <div className='mx-auto max-w-xl space-y-4'>
      <div className='grid gap-2 sm:grid-cols-3'>
        {contactCards.map(contact => (
          contact.href.startsWith('http') ? (
            <button key={contact.title} type='button' onClick={() => openBrowser(contact.href)} className='rounded-xl border border-white/10 bg-white/5 p-3 text-center hover:bg-white/10'>
              <p className='text-xs font-bold text-pink-200'>{contact.title}</p>
              <p className='mt-1 truncate text-[10px] text-white/50'>{contact.value}</p>
            </button>
          ) : (
            <a key={contact.title} href={contact.href} className='rounded-xl border border-white/10 bg-white/5 p-3 text-center hover:bg-white/10'>
              <p className='text-xs font-bold text-pink-200'>{contact.title}</p>
              <p className='mt-1 truncate text-[10px] text-white/50'>{contact.value}</p>
            </a>
          )
        ))}
      </div>
      <ContactForm />
    </div>
  );
}

export default ContactApp;
