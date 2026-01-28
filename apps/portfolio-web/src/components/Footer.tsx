import React from 'react';
import { FiInstagram, FiGithub, FiLinkedin } from 'react-icons/fi';

const Footer: React.FC = () => {
    const curYear: number = new Date().getFullYear();
    
    const handleInstagramClick = (): void => {
        window.open("https://www.instagram.com/abuuuuu.___", "_blank");
    };

    const handleGithubClick = (): void => {
        window.open("https://www.github.com/spexzee/", "_blank");
    };

    const handleLinkedinClick = (): void => {
        window.open("https://www.linkedin.com/in/abubakara-nadafa-a12b53169/", "_blank");
    };

    return (
        <div className='bg-black-100 h-[7em] flex justify-evenly flex-col align-middle'>
            <div className="copyright">
                <p className="text-white text-center mt-4">&copy; {curYear} Spexzee. All rights reserved</p>
            </div>
            <div className="flex gap-6 justify-center">
                <FiInstagram 
                    fontSize={27} 
                    className='cursor-pointer' 
                    onClick={handleInstagramClick} 
                />
                <FiGithub 
                    fontSize={27} 
                    className='cursor-pointer' 
                    onClick={handleGithubClick} 
                />
                <FiLinkedin 
                    fontSize={27} 
                    className='cursor-pointer' 
                    onClick={handleLinkedinClick} 
                />
            </div>
        </div>
    )
}

export default Footer;