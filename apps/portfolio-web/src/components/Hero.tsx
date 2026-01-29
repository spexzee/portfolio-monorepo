import React, { useState, useEffect } from 'react';
import { styles } from '../styles';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const FALLBACK_RESUME_URL = 'https://drive.google.com/file/d/1YzGqfLszQ4SSC3CxHoGW5UvEHu7YiAkW/view?usp=sharing';

const Hero: React.FC = () => {
  const [resumeUrl, setResumeUrl] = useState<string>(FALLBACK_RESUME_URL);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResumeUrl = async () => {
      try {
        const res = await fetch(`${API_URL}/api/config/resume_url`);
        if (res.ok) {
          const data = await res.json();
          if (data.config?.value) {
            setResumeUrl(data.config.value);
          }
        }
      } catch (error) {
        console.warn('Failed to fetch resume URL, using fallback:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResumeUrl();
  }, []);

  const handleClickResume = (): void => {
    if (!isLoading) {
      window.open(resumeUrl, '_blank');
    }
  }

  return (
    <section className={`relative w-full h-screen mx-auto`}>
      <div
        className={`absolute inset-0 top-[120px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div>
          <h1 className={`${styles.heroHeadText} text-white`}>
            I'm <span className='text-[#915EFF]'>Spexzee</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            I am a passionate Front-End React Developer,<br className='sm:block hidden' />
            from Bengaluru 📍
          </p>
          <button
            className="button-resume mt-20 bg-violet-500"
            role="button"
            onClick={handleClickResume}
            disabled={isLoading}
          >
            <span className="text">{isLoading ? 'Loading...' : 'Resume'}</span>
            <span></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

