import React from 'react';
import { styles } from '../styles';

const Hero: React.FC = () => {
  const handleClickResume = (): void => {
    window.open('https://drive.google.com/file/d/1YzGqfLszQ4SSC3CxHoGW5UvEHu7YiAkW/view?usp=sharing');
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
          <button className="button-resume mt-20 bg-violet-500" role="button" onClick={handleClickResume}>
            <span className="text">Resume</span>
            <span></span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
