import { useState, useEffect } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ResumePDF from './ResumePDF'
import { Resume } from './types'
import './App.css'

function App() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newResume, setNewResume] = useState<Partial<Resume>>({
    name: '',
    email: '',
    phone: '',
    education: [''],
    experience: [''],
    skills: [''],
    projects: [{
      title: '',
      description: '',
      technologies: ['']
    }]
  });

  // Fetch resumes from backend
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/resumes');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResumes(data);
        setError(null);
      } catch (err) {
        setError('Could not connect to the backend. Please make sure it is running.');
        console.error('Error fetching resumes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // Create a new resume
  const handleCreateResume = async () => {
    try {
      // Validate required fields
      if (!newResume.name || !newResume.email || !newResume.phone) {
        setError('Please fill in all required fields (Name, Email, Phone)');
        return;
      }

      // Create new resume
      const response = await fetch('http://localhost:5000/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResume),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdResume = await response.json();
      setResumes([createdResume]); // Set to only the new resume
      setNewResume({
        name: '',
        email: '',
        phone: '',
        education: [''],
        experience: [''],
        skills: [''],
        projects: [{
          title: '',
          description: '',
          technologies: ['']
        }]
      });
      setError(null);
    } catch (err) {
      setError('Failed to create resume. Please try again.');
      console.error('Error creating resume:', err);
    }
  };

  // Update form fields
  const handleInputChange = (field: keyof Resume, value: string | string[]) => {
    setNewResume(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add new entry to array fields
  const handleAddEntry = (field: 'education' | 'experience' | 'skills') => {
    setNewResume(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  // Update array field entry
  const handleArrayFieldChange = (field: 'education' | 'experience' | 'skills', index: number, value: string) => {
    setNewResume(prev => {
      const updatedArray = [...(prev[field] || [])];
      updatedArray[index] = value;
      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };

  // Add new project
  const handleAddProject = () => {
    setNewResume(prev => ({
      ...prev,
      projects: [...(prev.projects || []), {
        title: '',
        description: '',
        technologies: ['']
      }]
    }));
  };

  // Update project field
  const handleProjectChange = (index: number, field: 'title' | 'description' | 'technologies', value: string | string[]) => {
    setNewResume(prev => {
      const updatedProjects = [...(prev.projects || [])];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value
      };
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  // Add technology to project
  const handleAddTechnology = (projectIndex: number) => {
    setNewResume(prev => {
      const updatedProjects = [...(prev.projects || [])];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        technologies: [...(updatedProjects[projectIndex].technologies || []), '']
      };
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  // Update technology
  const handleTechnologyChange = (projectIndex: number, techIndex: number, value: string) => {
    setNewResume(prev => {
      const updatedProjects = [...(prev.projects || [])];
      const updatedTechnologies = [...(updatedProjects[projectIndex].technologies || [])];
      updatedTechnologies[techIndex] = value;
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        technologies: updatedTechnologies
      };
      return {
        ...prev,
        projects: updatedProjects
      };
    });
  };

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className="app">
      <h1>Resume Builder</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="resume-form">
        <h2>Create New Resume</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={newResume.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={newResume.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            placeholder="Phone"
            value={newResume.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>

        <div className="array-fields">
          <h3>Education</h3>
          {newResume.education?.map((edu, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                placeholder={`Education ${index + 1}`}
                value={edu}
                onChange={(e) => handleArrayFieldChange('education', index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={() => handleAddEntry('education')}>Add Education</button>
        </div>

        <div className="array-fields">
          <h3>Experience</h3>
          {newResume.experience?.map((exp, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                placeholder={`Experience ${index + 1}`}
                value={exp}
                onChange={(e) => handleArrayFieldChange('experience', index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={() => handleAddEntry('experience')}>Add Experience</button>
        </div>

        <div className="array-fields">
          <h3>Skills</h3>
          {newResume.skills?.map((skill, index) => (
            <div key={index} className="form-group">
              <input
                type="text"
                placeholder={`Skill ${index + 1}`}
                value={skill}
                onChange={(e) => handleArrayFieldChange('skills', index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={() => handleAddEntry('skills')}>Add Skill</button>
        </div>

        <div className="array-fields">
          <h3>Projects</h3>
          {newResume.projects?.map((project, projectIndex) => (
            <div key={projectIndex} className="project-group">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) => handleProjectChange(projectIndex, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) => handleProjectChange(projectIndex, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              <div className="technologies-group">
                <h4>Technologies Used</h4>
                {project.technologies?.map((tech, techIndex) => (
                  <div key={techIndex} className="form-group">
                    <input
                      type="text"
                      placeholder={`Technology ${techIndex + 1}`}
                      value={tech}
                      onChange={(e) => handleTechnologyChange(projectIndex, techIndex, e.target.value)}
                    />
                  </div>
                ))}
                <button onClick={() => handleAddTechnology(projectIndex)}>Add Technology</button>
              </div>
            </div>
          ))}
          <button onClick={handleAddProject}>Add Project</button>
        </div>

        <button className="create-button" onClick={handleCreateResume}>
          Create Resume
        </button>
      </div>

      <div className="resumes-list">
        <h2>Your Resumes</h2>
        {resumes.map((resume) => (
          <div key={resume.id} className="resume-item">
            <h3>{resume.name}</h3>
            <p>Email: {resume.email}</p>
            <p>Phone: {resume.phone}</p>
            
            <div className="resume-details">
              <h4>Education</h4>
              <ul>
                {resume.education.map((edu, index) => (
                  <li key={index}>{edu}</li>
                ))}
              </ul>
            </div>

            <div className="resume-details">
              <h4>Experience</h4>
              <ul>
                {resume.experience.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            </div>

            <div className="resume-details">
              <h4>Skills</h4>
              <ul>
                {resume.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>

            <div className="resume-details">
              <h4>Projects</h4>
              {resume.projects?.map((project, index) => (
                <div key={index} className="project-item">
                  <h5>{project.title}</h5>
                  <p>{project.description}</p>
                  <div className="technologies">
                    <h6>Technologies Used:</h6>
                    <ul>
                      {project.technologies?.map((tech, techIndex) => (
                        <li key={techIndex}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className="resume-actions">
              <PDFDownloadLink
                document={<ResumePDF resume={resume} />}
                fileName={`${resume.name.replace(/\s+/g, '-').toLowerCase()}-resume.pdf`}
              >
                {({ loading, error }) => {
                  if (error) {
                    return <div>Error generating PDF</div>;
                  }
                  return loading ? 'Generating PDF...' : 'Download PDF';
                }}
              </PDFDownloadLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App; 