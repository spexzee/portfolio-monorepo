import React, { useState, useEffect, useRef } from "react";
import { Tilt } from "react-tilt";
import { Tabs, Tab, Box } from "@mui/material";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { useGetProjects } from "../API/projects";
import MyButton from '../components/MyButton';
import SimpleLoader from '../components/SimpleLoader';
import { Project, ProjectTech } from "../constants";

interface ProjectCardProps {
  index?: number;
  name: string;
  description: string;
  technologies: ProjectTech[];
  image: string;
  source_code_link: string;
  demo_link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  description,
  technologies,
  image,
  source_code_link,
  demo_link
}) => {

  return (
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt='project_image'
            className='w-full h-full object-cover rounded-2xl'
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='my-4 flex flex-wrap gap-2'>
          {Array.isArray(technologies) && technologies.map((tag: ProjectTech) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
        <div onClick={() => window.open(demo_link, "_blank")}>
          <MyButton />
        </div>
      </Tilt>
  );
};

const Works: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [shouldFetchProjects, setShouldFetchProjects] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Only call the API when shouldFetchProjects is true
  const { data: projects = [], isLoading, error } = useGetProjects(shouldFetchProjects);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !shouldFetchProjects) {
          setShouldFetchProjects(true);
          // Once we've triggered the fetch, we can disconnect the observer
          observer.disconnect();
        }
      },
      {
        // Trigger when 10% of the section is visible
        threshold: 0.1,
        // Add some margin to trigger slightly before the section is fully visible
        rootMargin: '50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [shouldFetchProjects]);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const getFilteredProjects = () => {
    if (activeTab === 'all') {
      return projects;
    }
    return projects.filter(project => project.category === activeTab);
  };

  const filteredProjects = getFilteredProjects();

  // Show loader while loading (only if we've started fetching)
  if (shouldFetchProjects && isLoading) {
    return (
      <div ref={sectionRef}>
        <div>
          <p className={`${styles.sectionSubText} `}>My work</p>
          <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
        </div>
        <SimpleLoader />
      </div>
    );
  }

  // Show error message if there's an error (only if we've started fetching)
  if (shouldFetchProjects && error) {
    return (
      <div ref={sectionRef}>
        <div>
          <p className={`${styles.sectionSubText} `}>My work</p>
          <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-500 text-[18px]">Failed to load projects. Please try again later.</p>
        </div>
      </div>
    );
  }

  // If we haven't started fetching yet, show a placeholder
  if (!shouldFetchProjects) {
    return (
      <div ref={sectionRef}>
        <div>
          <p className={`${styles.sectionSubText} `}>My work</p>
          <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
        </div>
        
        <div className='w-full flex' id="projects">
          <div
            className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
          >
            Following projects showcases my skills and experience through
            real-world examples of my work. Each project is briefly described with
            links to code repositories and live demos in it. It reflects my
            ability to solve complex problems, work with different technologies,
            and manage projects effectively.
          </div>
        </div>
        
        {/* Show placeholder content */}
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-secondary text-[16px]">Scroll down to load projects...</p>
        </div>
      </div>
    );
  }
  if (Array.isArray(filteredProjects) && filteredProjects.length === 0) {
    return (
      <>
        <div>
          <p className={`${styles.sectionSubText} `}>My work</p>
          <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-yellow-500 text-[18px]">No projects uploaded.</p>
        </div>
      </>
    );
  }

  return (
    <div ref={sectionRef}>
      <div>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </div>

      <div className='w-full flex' id="projects">
        <div
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </div>
      </div>

      {/* MUI Tabs */}
      <Box sx={{ width: '100%', mt: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#915EFF',
            },
            '& .MuiTab-root': {
              color: '#aaa6c3',
              fontWeight: 'bold',
              fontSize: '1rem',
              textTransform: 'uppercase',
              '&.Mui-selected': {
                color: '#915EFF',
              },
              '&:hover': {
                color: '#915EFF',
              },
            },
          }}
        >
          <Tab label="ALL" value="all" />
          <Tab label="FRONTEND" value="frontend" />
          <Tab label="FULL-STACK" value="fullstack" />
          <Tab label="TOOLS" value="tools" />
        </Tabs>
      </Box>

      <div className='mt-20 flex flex-wrap gap-7'>
        {filteredProjects.map((project: Project, index: number) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "");