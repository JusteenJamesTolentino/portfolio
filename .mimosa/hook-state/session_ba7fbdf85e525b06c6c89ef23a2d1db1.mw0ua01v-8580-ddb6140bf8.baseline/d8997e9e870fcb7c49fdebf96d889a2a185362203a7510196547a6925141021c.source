import { useState } from 'react';

// Submits via a prefilled mailto compose until a real backend
// (Firestore or Formspree) is wired up.
const CONTACT_EMAIL = 'justeen0x24@gmail.com';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (form.message.trim().length < 10) next.message = 'Message should be at least 10 characters.';
    return next;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name.trim()}`);
    const body = encodeURIComponent(`${form.message.trim()}\n\n${form.name.trim()} (${form.email.trim()})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className='card border border-white/40 rounded-lg text-neutral-content shadow-md w-full'>
      <div className='card-body gap-4'>
        <h3 className='card-title text-center'>Send me a message</h3>

        <div>
          <label className='label pb-1' htmlFor='contact-name'>Name</label>
          <input
            id='contact-name'
            name='name'
            type='text'
            placeholder='Your name'
            value={form.name}
            onChange={handleChange}
            aria-invalid={Boolean(errors.name)}
            className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
          />
          {errors.name && <p className='text-error text-sm mt-1'>{errors.name}</p>}
        </div>

        <div>
          <label className='label pb-1' htmlFor='contact-email'>Email</label>
          <input
            id='contact-email'
            name='email'
            type='email'
            placeholder='you@example.com'
            value={form.email}
            onChange={handleChange}
            aria-invalid={Boolean(errors.email)}
            className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
          />
          {errors.email && <p className='text-error text-sm mt-1'>{errors.email}</p>}
        </div>

        <div>
          <label className='label pb-1' htmlFor='contact-message'>Message</label>
          <textarea
            id='contact-message'
            name='message'
            rows={5}
            placeholder='Tell me about your project or inquiry...'
            value={form.message}
            onChange={handleChange}
            aria-invalid={Boolean(errors.message)}
            className={`textarea textarea-bordered w-full ${errors.message ? 'textarea-error' : ''}`}
          />
          {errors.message && <p className='text-error text-sm mt-1'>{errors.message}</p>}
        </div>

        <div className='card-actions justify-center'>
          <button type='submit' className='btn btn-primary w-full sm:w-auto'>Send Message</button>
        </div>

        {sent && (
          <div role='status' className='alert alert-success text-sm'>
            <span>Your email app should open with the message ready, just hit send there.</span>
          </div>
        )}
      </div>
    </form>
  );
}

export default ContactForm;
