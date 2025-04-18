import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Resume, Project } from './types';

// Register fonts with reliable CDN
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 'bold',
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Roboto',
    backgroundColor: '#f8fafc',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2pt solid #2563eb',
  },
  name: {
    fontSize: 28,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  contact: {
    fontSize: 12,
    marginBottom: 4,
    color: '#475569',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2563eb',
    borderBottom: '1pt solid #e2e8f0',
    paddingBottom: 8,
  },
  item: {
    marginBottom: 8,
    fontSize: 12,
    color: '#1e293b',
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1e293b',
  },
  projectDescription: {
    fontSize: 12,
    marginBottom: 8,
    color: '#475569',
    lineHeight: 1.5,
  },
  technologies: {
    fontSize: 10,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: 4,
    marginTop: 4,
  },
  technologyList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  technologyTag: {
    backgroundColor: '#e2e8f0',
    color: '#475569',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 10,
  },
});

interface ResumePDFProps {
  resume: Resume;
}

const ResumePDF = ({ resume }: ResumePDFProps) => {
  // Add error boundary for PDF generation
  try {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.name}>{resume.name}</Text>
            <Text style={styles.contact}>Email: {resume.email}</Text>
            <Text style={styles.contact}>Phone: {resume.phone}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education?.map((edu: string, index: number) => (
              <Text key={index} style={styles.item}>{edu}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience?.map((exp: string, index: number) => (
              <Text key={index} style={styles.item}>{exp}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {resume.skills?.map((skill: string, index: number) => (
              <Text key={index} style={styles.item}>{skill}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects?.map((project: Project, index: number) => (
              <View key={index} style={styles.item}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <Text style={styles.projectDescription}>{project.description}</Text>
                <View style={styles.technologies}>
                  <Text>Technologies:</Text>
                  <View style={styles.technologyList}>
                    {project.technologies?.map((tech: string, techIndex: number) => (
                      <Text key={techIndex} style={styles.technologyTag}>{tech}</Text>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  } catch (error) {
    console.error('Error generating PDF:', error);
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Error generating PDF. Please try again.</Text>
        </Page>
      </Document>
    );
  }
};

export default ResumePDF; 