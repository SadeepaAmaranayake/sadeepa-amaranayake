import { useMemo, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Link,
  Stack,
  TextField,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';
import './App.css';
import MagicRings from './components/MagicRings';
import certificates from './data/certificates';
import Contact from "./components/contact";

const projects = [
  {
    id: '01',
    title: 'eCommerce Marketplace',
    category: 'Full-stack',
    summary: 'A production-oriented marketplace with product workflows, payments, media uploads, caching, and real-time capabilities.',
    detail: 'A full-stack marketplace built with a React and Redux frontend plus a modular Express API. The backend includes MongoDB, Redis, JWT authentication, Stripe payments, Cloudinary uploads, Socket.IO, Swagger documentation, validation, rate limiting, and security middleware.',
    tags: ['React', 'Express', 'MongoDB', 'Redis', 'Stripe'],
    accent: '#38bdf8',
    symbol: 'E',
    githubUrl: 'https://github.com/sadeepaghost/eCommerce-marketplace',
  },
  {
    id: '02',
    title: 'IC Marketplace',
    category: 'Laravel',
    summary: 'An AI-assisted marketplace for searching, comparing, and sourcing integrated circuits and electronic components.',
    detail: 'A TALL-stack marketplace with real-time component search, inventory and technical specifications, availability and pricing details, sourcing requests, and AI-assisted compatibility suggestions.',
    tags: ['Laravel', 'Livewire', 'PHP', 'Tailwind CSS'],
    accent: '#2563eb',
    symbol: 'I',
    githubUrl: 'https://github.com/sadeepaghost/IC-Marketplace-',
  },
  {
    id: '03',
    title: 'Real-Time Chat',
    category: 'Real-time',
    summary: 'A full-stack chat application with authenticated sessions and real-time messaging through WebSockets.',
    detail: 'A separate React and Vite client with Zustand state management, backed by an Express server using Socket.IO and JWT authentication. The repository separates routes, middleware, socket handlers, client pages, components, hooks, and stores.',
    tags: ['React', 'Node.js', 'Socket.IO', 'JWT', 'Zustand'],
    accent: '#60a5fa',
    symbol: 'C',
    githubUrl: 'https://github.com/sadeepaghost/chat-application',
  },
  {
    id: '04',
    title: 'Smart Study Buddy',
    category: 'TypeScript',
    summary: 'A component-driven study companion using Supabase, typed forms, query caching, dashboards, and tests.',
    detail: 'A React and TypeScript application built with Vite, Supabase, TanStack Query, React Hook Form, Zod, Tailwind CSS, Radix UI components, charts, and Vitest. The project demonstrates a broad modern frontend architecture with hosted data integration.',
    tags: ['TypeScript', 'Supabase', 'React Query', 'Tailwind CSS'],
    accent: '#0ea5e9',
    symbol: 'S',
    githubUrl: 'https://github.com/sadeepaghost/smart-study-buddy',
  },
  {
    id: '05',
    title: 'Habit Tracker',
    category: 'PHP',
    summary: 'A server-rendered habit replacement system with accounts, progress statistics, and focused activity areas.',
    detail: 'A compact PHP and MySQL application with registration and login, a user dashboard, stored progress data, statistics, and separate study, reading, and music activity workflows.',
    tags: ['PHP', 'MySQL', 'Authentication', 'CSS'],
    accent: '#0284c7',
    symbol: 'H',
    githubUrl: 'https://github.com/sadeepaghost/habit_tracker',
  },
];

const techStack = [
  {
    number: '01',
    category: 'Frontend',
    technologies: ['React.js', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Vite'],
  },
  {
    number: '02',
    category: 'Backend',
    technologies: ['Node.js', 'Express.js', 'REST APIs', 'JWT', 'Socket.IO'],
  },
  {
    number: '03',
    category: 'Database',
    technologies: ['MongoDB', 'Mongoose', 'MySQL', 'PostgreSQL', 'Redis'],
  },
  {
    number: '04',
    category: 'DevOps & Tools',
    technologies: ['Git', 'GitHub', 'Docker', 'Docker Compose', 'GitHub Actions', 'Nginx', 'Postman'],
  },
  {
    number: '05',
    category: 'Cloud & Deployment',
    technologies: ['MongoDB Atlas', 'Netlify', 'AWS'],
  },
];

const navItems = ['About', 'Work', 'Experience', 'Certificates', 'Contact'];

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#168BFF', contrastText: '#ffffff' },
    secondary: { main: '#38BDF8' },
    background: { default: '#030509', paper: '#0A111C' },
    text: { primary: '#F5F9FF', secondary: '#9DADBF' },
  },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    button: { fontWeight: 700, letterSpacing: '0.08em' },
  },
  shape: { borderRadius: 18 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 999 } } },
  },
});

function SectionLabel({ children }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }} className="section-label">
      <Box className="label-star">✦</Box>
      <Typography variant="overline">{children}</Typography>
    </Stack>
  );
}

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [result, setResult] = useState("");
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const categories = ['All', ...new Set(projects.map((project) => project.category))];
  const visibleProjects = useMemo(
    () => projects.filter((project) => filter === 'All' || project.category === filter),
    [filter]
  );

  const scrollTo = (section) => {
    document.getElementById(section.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setDrawerOpen(false);
  };

  const submitContact = async (event) => {
  event.preventDefault();

  setResult("Sending...");

  const formData = new FormData();

  formData.append(
    "access_key",
    process.env.REACT_APP_WEB3FORMS_ACCESS_KEY
  );

  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("message", form.message);

  try {
    const response = await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (data.success) {
      setResult("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } else {
      console.log("Web3Forms error:", data);
      setResult(data.message || "Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error(error);
    setResult("Unable to send message. Please try again.");
  }
};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="site-shell">
        <Box className="magic-rings-layer">
          <MagicRings
            color="#168BFF"
            colorTwo="#38BDF8"
            ringCount={6}
            speed={1}
            attenuation={10}
            lineThickness={2}
            baseRadius={0.35}
            radiusStep={0.1}
            scaleRate={0.1}
            opacity={1}
            blur={0}
            noiseAmount={0.1}
            rotation={0}
            ringGap={1.5}
            fadeIn={0.7}
            fadeOut={0.5}
            followMouse={false}
            mouseInfluence={0.2}
            hoverScale={1.2}
            parallax={0.05}
            clickBurst={false}
          />
        </Box>

        <AppBar position="fixed" elevation={0} className="nav-bar">
          <Container maxWidth="xl" className="wide-container">
            <Toolbar disableGutters>
              <Link href="#top" underline="none" color="inherit" className="wordmark" aria-label="Go to top">S<span>✦</span></Link>
              <Stack direction="row" spacing={4} className="desktop-nav">
                {navItems.map((item) => <Button color="inherit" key={item} onClick={() => scrollTo(item)}>{item}</Button>)}
              </Stack>
              <Button variant="outlined" color="primary" className="available-button" onClick={() => scrollTo('Contact')}>Available for work <span className="pulse-dot" /></Button>
              <IconButton className="menu-button" color="inherit" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">☰</IconButton>
            </Toolbar>
          </Container>
        </AppBar>

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ className: 'drawer-paper' }}>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close navigation" className="drawer-close">×</IconButton>
          {navItems.map((item) => <Button key={item} onClick={() => scrollTo(item)}>{item}</Button>)}
        </Drawer>

        <Box component="main" id="top">
          <Container maxWidth="xl" className="wide-container">
            <Box component="section" className="hero">
              <Typography className="eyebrow">DESIGNER · DEVELOPER · PROBLEM SOLVER</Typography>
              <Typography variant="h1">I create digital things<br />that feel <em>human.</em></Typography>
              <Typography className="hero-copy">I’m Sadeepa, a product designer and creative developer crafting thoughtful interfaces where clarity meets character.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} className="hero-actions">
                <Button variant="contained" size="large" onClick={() => scrollTo('Work')}>Explore my work <span>↘</span></Button>
                <Button variant="text" size="large" color="inherit" onClick={() => scrollTo('About')}>More about me →</Button>
              </Stack>
              <Typography className="scroll-note">SCROLL TO WANDER <span>↓</span></Typography>
            </Box>

            <Box component="section" id="about" className="section-block about-section">
              <Box className="portrait-constellation">
                <Box className="portrait-window">
                  <img src="/sadeepa-portrait.png" alt="Sadeepa standing outdoors" />
                  <span className="portrait-caption">Sadeepa · Designer & developer</span>
                </Box>
                <span className="orbit orbit-a" aria-hidden="true" />
                <span className="orbit orbit-b" aria-hidden="true" />
              </Box>
              <Box>
                <SectionLabel>About me</SectionLabel>
                <Typography variant="h2">FULL STACK<em> DEVELOPER</em></Typography>
                <Typography className="about-copy">I care about the invisible details: the pause before a transition, the sentence that removes doubt, the structure that lets a product grow. My work sits between systems thinking and visual storytelling.</Typography>
                <Typography className="about-copy">Away from the screen, I’m usually photographing quiet streets, collecting old print, or learning something impractical.</Typography>
                <Box className="skills-grid">
                  {['Product strategy', 'UX & interaction', 'Design systems', 'React development', 'Creative direction', 'Rapid prototyping'].map((skill, index) => <Typography key={skill}><span>0{index + 1}</span>{skill}</Typography>)}
                </Box>
              </Box>
            </Box>

            <Box component="section" id="work" className="section-block">
              <SectionLabel>Selected work</SectionLabel>
              <Stack direction={{ xs: 'column', md: 'row' }} gap={3} sx={{ justifyContent: 'space-between', alignItems: { md: 'end' } }} className="section-heading">
                <Typography variant="h2">Things I’ve helped<br />bring into orbit.</Typography>
                <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                  {categories.map((item) => <Chip key={item} label={item} clickable onClick={() => setFilter(item)} variant={filter === item ? 'filled' : 'outlined'} color={filter === item ? 'primary' : 'default'} />)}
                </Stack>
              </Stack>
              <Box className="project-grid">
                {visibleProjects.map((project) => (
                  <Box component="article" className="project-card" key={project.id} tabIndex={0} onClick={() => setSelectedProject(project)} onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}>
                    <Box className="project-art" sx={{ '--accent': project.accent }}>
                      <span className="project-number">{project.id}</span><span className="project-symbol">{project.symbol}</span><span className="planet-ring" />
                    </Box>
                    <Box className="project-body">
                      <Typography variant="overline">{project.category}</Typography>
                      <Typography variant="h4">{project.title}</Typography>
                      <Typography color="text.secondary">{project.summary}</Typography>
                      <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>{project.tags.map((tag) => <Chip key={tag} size="small" label={tag} variant="outlined" />)}</Stack>
                      <Button color="primary" className="case-link">View project ↗</Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box component="section" id="experience" className="section-block experience-section">
              <SectionLabel>Tech stack</SectionLabel>
              <Typography variant="h2">The tools behind<br />what I build.</Typography>
              <Typography className="stack-intro">A practical full-stack toolkit for building, shipping, and maintaining modern web applications.</Typography>
              <Box className="tech-stack-grid">
                {techStack.map((group) => (
                  <Box component="article" className="stack-card" key={group.category}>
                    <Stack direction="row" className="stack-card-heading">
                      <Typography variant="overline">{group.number}</Typography>
                      <Typography variant="h5">{group.category}</Typography>
                    </Stack>
                    <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                      {group.technologies.map((technology) => (
                        <Chip key={technology} label={technology} variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box component="section" id="certificates" className="section-block certificates-section">
              <SectionLabel>Certificates & credentials</SectionLabel>
              <Stack direction={{ xs: 'column', md: 'row' }} gap={3} sx={{ justifyContent: 'space-between', alignItems: { md: 'end' } }} className="certificate-heading">
                <Typography variant="h2">Learning backed<br />by real credentials.</Typography>
                <Typography className="certificate-intro">Verified course completion in development, DevOps, cloud, and AI fundamentals.</Typography>
              </Stack>
              <Box className="certificate-bar">
                {certificates.map((certificate, index) => (
                  <Box component="article" className="certificate-card" key={certificate.credentialId}>
                    <Stack direction="row" className="certificate-topline">
                      <Typography variant="overline">{String(index + 1).padStart(2, '0')}</Typography>
                      <Chip label={certificate.type} size="small" variant="outlined" />
                    </Stack>
                    <Box>
                      <Typography className="certificate-issuer">{certificate.issuer} · {certificate.date}</Typography>
                      <Typography variant="h5">{certificate.title}</Typography>
                    </Box>
                    <Typography className="credential-id">ID: {certificate.credentialId}</Typography>
                    <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                      {certificate.skills.map((skill) => <Chip key={skill} label={skill} size="small" />)}
                      <Chip label={certificate.duration} size="small" />
                    </Stack>
                    <Stack direction="row" spacing={1.5} className="certificate-actions">
                      <Button component="a" href={certificate.credentialUrl} target="_blank" rel="noopener noreferrer">Verify ↗</Button>
                      <Button component="a" href={certificate.pdfUrl} target="_blank" rel="noopener noreferrer" color="inherit">View PDF</Button>
                    </Stack>
                  </Box>
                ))}
              </Box>
              <Typography className="swipe-note">Scroll horizontally to view all credentials →</Typography>
            </Box>
          </Container>

          <Box component="section" id="contact" className="contact-section">
            <Container maxWidth="md">
              <SectionLabel>Say hello</SectionLabel>
              <Typography variant="h2">Have an idea in mind?<br /><em>Let’s make it real.</em></Typography>
              <Typography color="text.secondary">Tell me what you’re building, where it stands, and what kind of help you need.</Typography>
              <Box component="form" onSubmit={submitContact} className="contact-form">
                <TextField required label="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <TextField required type="email" label="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <TextField required multiline minRows={4} label="A little about your project" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                <Button type="submit" variant="contained" size="large">Send a message ↗</Button>
                {result && <Typography role="status" className="form-note">{result}</Typography>}
              </Box>
              <Divider />
              <Box component="footer" className="footer">
                <Typography>© 2026 Sadeepa. Made with intent.</Typography>
                <Stack direction="row" spacing={3}><Link href="https://www.linkedin.com" target="_blank">LinkedIn</Link><Link href="https://github.com" target="_blank">GitHub</Link><Link href="mailto:hello@sadeepa.dev">Email</Link></Stack>
              </Box>
            </Container>
          </Box>
        </Box>

        <Dialog open={Boolean(selectedProject)} onClose={() => setSelectedProject(null)} maxWidth="sm" fullWidth PaperProps={{ className: 'case-dialog' }}>
          {selectedProject && <><DialogTitle><Typography variant="overline" color="primary">{selectedProject.category}</Typography><Typography variant="h3">{selectedProject.title}</Typography></DialogTitle><DialogContent><Typography color="text.secondary">{selectedProject.detail}</Typography><Stack direction="row" gap={1} mt={3} sx={{ flexWrap: 'wrap' }}>{selectedProject.tags.map((tag) => <Chip key={tag} label={tag} variant="outlined" />)}</Stack></DialogContent><DialogActions><Button onClick={() => setSelectedProject(null)}>Close</Button><Button component="a" variant="contained" href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">View GitHub ↗</Button></DialogActions></>}
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}



export default App;
