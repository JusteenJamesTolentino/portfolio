import { useRef } from 'react';
import { motion as Motion, useScroll, useTransform } from 'motion/react';

// Note: intentionally ignores prefers-reduced-motion per owner's request,
// so the scroll effects run for everyone.

function ScrollZoomHero({ secondImage, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const secondOpacity = useTransform(scrollYProgress, [0.45, 0.85], [0, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.9]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);

  return (
    <div ref={ref} className='relative h-[170vh]'>
      <div className='sticky top-0 h-screen overflow-hidden flex items-center justify-center'>
        <Motion.div
          aria-hidden='true'
          style={{
            scale: bgScale,
            backgroundImage: "url('/hero-night-street.jpg')",
          }}
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        />
        {secondImage && (
          <Motion.div
            aria-hidden='true'
            style={{
              scale: bgScale,
              opacity: secondOpacity,
              backgroundImage: `url('${secondImage}')`,
            }}
            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          />
        )}
        <Motion.div
          aria-hidden='true'
          style={{ opacity: overlayOpacity }}
          className='absolute inset-0 bg-black'
        />
        <Motion.div
          style={{
            opacity: contentOpacity,
            scale: contentScale,
          }}
          className='relative z-10 px-4 text-center pt-16'
        >
          {children}
        </Motion.div>
      </div>
    </div>
  );
}

export default ScrollZoomHero;
