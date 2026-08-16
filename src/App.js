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

const projects = [
  {
    id: '01',
    title: 'Astra Finance',
    category: 'Product Design',
    summary: 'A calm, data-rich wealth platform that turns complex portfolios into clear next steps.',
    detail: 'I designed the end-to-end product experience, from account linking to portfolio forecasting. The modular system reduced decision friction and made dense financial data feel approachable on every screen.',
    tags: ['UX Strategy', 'Design System', 'Fintech'],
    accent: '#c084fc',
    symbol: 'A',
  },
  {
    id: '02',
    title: 'Nocturne Studio',
    category: 'Creative Development',
    summary: 'An immersive digital home for a sound studio, built around rhythm, motion, and atmosphere.',
    detail: 'A fast editorial site with art-directed transitions and a lightweight audio sampler. Motion responds to user intent while reduced-motion preferences remain fully supported.',
    tags: ['React', 'Motion', 'Web Audio'],
    accent: '#818cf8',
    symbol: 'N',
  },
  {
    id: '03',
    title: 'Field Notes',
    category: 'Front-end',
    summary: 'A field research workspace for collecting observations and finding patterns in messy data.',
    detail: 'I built the responsive component system and accessible interaction model. Offline-first capture and clear information hierarchy let research teams stay focused in the field.',
    tags: ['TypeScript', 'Accessibility', 'PWA'],
    accent: '#ff8fa3',
    symbol: 'F',
  },
  {
    id: '04',
    title: 'Orbit Archive',
    category: 'Product Design',
    summary: 'A visual knowledge library that connects ideas without turning organization into a chore.',
    detail: 'Research, prototyping, and interface design for a spatial archive. The final model balances serendipitous discovery with predictable search and keyboard-first navigation.',
    tags: ['Research', 'Prototyping', 'SaaS'],
    accent: '#a9b8ff',
    symbol: 'O',
  },
];

const experience = [
  ['2024 — NOW', 'Independent designer & developer', 'Building focused digital products for early-stage teams.'],
  ['2021 — 2024', 'Senior Product Designer · Northstar', 'Led product design and helped grow a shared design system.'],
  ['2018 — 2021', 'Creative Developer · Studio Coda', 'Made expressive, performant web experiences for global brands.'],
];

const navItems = ['About', 'Work', 'Experience', 'Contact'];

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#A855F7', contrastText: '#ffffff' },
    secondary: { main: '#818CF8' },
    background: { default: '#070711', paper: '#111126' },
    text: { primary: '#F7F5FF', secondary: '#B7B5CC' },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 },
    h2: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 },
    h3: { fontFamily: '"Cormorant Garamond", serif', fontWeight: 600 },
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
  const [sent, setSent] = useState(false);
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

  const submitContact = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`);
    setSent(true);
    window.location.href = `mailto:hello@sadeepa.dev?subject=${subject}&body=${body}`;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="site-shell">
        <Box className="magic-rings-layer">
          <MagicRings
            color="#A855F7"
            colorTwo="#6366F1"
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
          <Container maxWidth="lg">
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
          <Container maxWidth="lg">
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
                      <Button color="primary" className="case-link">View case study ↗</Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box component="section" id="experience" className="section-block experience-section">
              <SectionLabel>Experience</SectionLabel>
              <Typography variant="h2">A few stops along<br />the way.</Typography>
              <Box className="timeline">
                {experience.map(([date, role, description]) => (
                  <Box className="timeline-row" key={date}><Typography variant="overline">{date}</Typography><Box><Typography variant="h5">{role}</Typography><Typography color="text.secondary">{description}</Typography></Box><span>✦</span></Box>
                ))}
              </Box>
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
                {sent && <Typography role="status" className="form-note">Your email app should now be open with the message ready to send.</Typography>}
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
          {selectedProject && <><DialogTitle><Typography variant="overline" color="primary">{selectedProject.category}</Typography><Typography variant="h3">{selectedProject.title}</Typography></DialogTitle><DialogContent><Typography color="text.secondary">{selectedProject.detail}</Typography><Stack direction="row" gap={1} mt={3} sx={{ flexWrap: 'wrap' }}>{selectedProject.tags.map((tag) => <Chip key={tag} label={tag} variant="outlined" />)}</Stack></DialogContent><DialogActions><Button onClick={() => setSelectedProject(null)}>Close</Button><Button variant="contained" href={`mailto:hello@sadeepa.dev?subject=${encodeURIComponent(`Tell me more about ${selectedProject.title}`)}`}>Ask about this work</Button></DialogActions></>}
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;
