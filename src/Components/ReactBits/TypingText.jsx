'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

const TextType = ({
  text,
  as: tag = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  paused = false,
  ...props
}) => {
  const Component = tag;
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const cursorRef = useRef(null);
  const cursorTweenRef = useRef(null);
  const containerRef = useRef(null);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!showCursor || !cursorRef.current) return;
    gsap.set(cursorRef.current, { opacity: 1 });
    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });
    cursorTweenRef.current = tween;
    return () => {
      tween.kill();
      cursorTweenRef.current = null;
    };
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    cursorTweenRef.current?.paused(paused);
  }, [paused, showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (!isVisible || paused) return;

    const currentText = textArray[currentTextIndex];
    if (typeof currentText !== 'string') return;
    const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;
    let timeout;

    // Schedule all state transitions, including sentence changes, outside the effect.
    if (isDeleting) {
      if (displayedText === '') {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          onSentenceComplete?.(currentText, currentTextIndex);
          setCurrentTextIndex(prev => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
        }, pauseDuration);
      } else {
        timeout = setTimeout(() => {
          setDisplayedText(prev => prev.slice(0, -1));
        }, deletingSpeed);
      }
    } else if (currentCharIndex < processedText.length) {
      const delay = getRandomSpeed() + (currentCharIndex === 0 && displayedText === '' ? initialDelay : 0);
      timeout = setTimeout(() => {
        setDisplayedText(prev => prev + processedText[currentCharIndex]);
        setCurrentCharIndex(prev => prev + 1);
      }, delay);
    } else {
      if (!loop && currentTextIndex === textArray.length - 1) return;
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    getRandomSpeed,
    onSentenceComplete,
    paused
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping && (currentCharIndex < (textArray[currentTextIndex]?.length ?? 0) || isDeleting);

  return (
    <Component ref={containerRef} className={`inline-block whitespace-pre-wrap tracking-tight ${className}`} {...props}>
      <span className='swarm-original-typing inline' style={{ color: getCurrentTextColor() || 'inherit' }}>
        {displayedText}
      </span>
      {showCursor && (
        <span
          ref={cursorRef}
          className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}
        >
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
};

export default TextType;
