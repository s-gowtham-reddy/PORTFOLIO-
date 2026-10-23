import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, Code2, Database, Download, GitBranch, Github, Layers3, Linkedin, Mail, Menu, Phone, Workflow, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams, Router as WouterRouter } from 'wouter';
import { profileLinks } from '@/lib/profile';

const { resume: resumeUrl, email, phone, github, linkedin } = profileLinks;

function syncCanonical(path?: string) {
  const existingCanonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const existingOgUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim();

  if (!path || !configuredSiteUrl) {
    existingCanonical?.remove();
    existingOgUrl?.remove();
    return;
  }

  try {
    const siteUrl = new URL(configuredSiteUrl);
    if (!['https:', 'http:'].includes(siteUrl.protocol)) throw new Error('Unsupported site URL protocol');
    const canonicalUrl = new URL(path, `${siteUrl.origin}/`).href;
    const canonical = existingCanonical ?? document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    if (!canonical.isConnected) document.head.appendChild(canonical);

    const ogUrl = existingOgUrl ?? document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = canonicalUrl;
    if (!ogUrl.isConnected) document.head.appendChild(ogUrl);
  } catch {
    existingCanonical?.remove();
    existingOgUrl?.remove();
  }
}

type Project = {
  slug: string; title: string; year: string; summary: string; outcome: string;
  tags: string[]; visual: 'flight' | 'code' | 'chat'; deck: string;
  context: string; objective: string; implementation: string[]; approach: string[];
  results: string; technologies: { name: string; role: string }[];
};

const projects: Project[] = [
  {
    slug: 'flight-safety-risk-analysis', title: 'Integrated Flight Safety and Risk Analysis', year: '2026',
    summary: 'A predictive risk assessment system exploring how aviation datasets can surface potential safety risks.',
    outcome: '91.2% accuracy · 0.88 F1-score · 10-fold cross-validation',
    tags: ['Python', 'Scikit-learn', 'Tableau', 'Plotly'], visual: 'flight',
    deck: 'Comparing classification models and turning their findings into an interactive view of risk.',
    context: 'Aviation safety analysis can benefit from examining patterns in historical data. This project explored predictive risk assessment using aviation datasets, with the intent of making analytical findings easier to inspect.',
    objective: 'Develop a system that identifies potential flight-safety risks, compare two classification approaches, and communicate risk scores and findings through interactive visualizations.',
    implementation: [
      'Prepared a predictive risk assessment workflow using Python and Scikit-learn.',
      'Implemented Random Forest and Logistic Regression models for comparison.',
      'Created interactive Tableau and Plotly dashboards to present risk scores and analytical findings.',
      'Presented the work as research into proactive incident prevention—not as a deployed aviation operations system.',
    ],
    approach: ['The models frame the task as risk classification, estimating whether a record belongs to a risk category.', '10-fold cross-validation evaluates each model across multiple train/validation splits rather than relying on one split.', 'Accuracy reports the share of correct predictions overall; the F1-score combines precision and recall, offering a useful view when the balance between missed risks and false alerts matters.', 'Dashboard views make model output and analytical findings easier to explore.'],
    results: 'The project reported 91.2% accuracy and a 0.88 F1-score using 10-fold cross-validation. These are model-evaluation results for this academic project. They are not measures of data-pipeline performance or evidence of operational deployment.',
    technologies: [{name:'Python',role:'Data preparation and model workflow.'},{name:'Scikit-learn',role:'Random Forest and Logistic Regression implementation and evaluation.'},{name:'Tableau',role:'Interactive dashboard presentation.'},{name:'Plotly',role:'Interactive charts for risk scores and findings.'}],
  },
  {
    slug: 'llm-powered-code-reviewer', title: 'LLM-Powered Code Reviewer', year: '2025',
    summary: 'A code-review platform that turns submitted Python and Java code into correction suggestions and contextual explanations.',
    outcome: 'API-integrated review flow for clearer, more approachable debugging.',
    tags: ['Python', 'OpenAI API', 'REST APIs'], visual: 'code',
    deck: 'A practical application workflow: submit code, request analysis, return useful feedback.',
    context: 'Early-stage developers can find programming errors difficult to diagnose and understand. This project explored a more approachable way to get contextual code feedback.',
    objective: 'Build a platform for reviewing Python and Java submissions that generates correction suggestions and explains programming errors in context.',
    implementation: ['Built application logic to accept Python and Java code submissions.', 'Integrated the OpenAI API to analyze submitted code.', 'Returned correction suggestions alongside contextual explanations of identified programming errors.', 'Automated the review workflow to make debugging more understandable for early-stage developers.'],
    approach: ['A submission enters the application as code for review.', 'The application integrates with the OpenAI API to request an analysis.', 'The resulting output is presented as a correction suggestion with an explanation, connecting an API response to a practical developer workflow.', 'The project demonstrates API integration and automation; no claims are made about production deployment or review accuracy.'],
    results: 'The verified capability is an automated review workflow for Python and Java code that provides suggestions and contextual explanations. Quantitative performance results were not specified.',
    technologies: [{name:'Python',role:'Application and review-workflow logic.'},{name:'OpenAI API',role:'Code analysis integration.'},{name:'REST APIs',role:'Connecting application behavior with the external analysis service.'}],
  },
  {
    slug: 'career-guidance-chatbot', title: 'Career Guidance Chatbot', year: '2024',
    summary: 'A conversational tool that recommends career paths based on a person’s skills, interests, and target roles.',
    outcome: 'NLP input processing combined with classification and transparent rules.',
    tags: ['Python', 'Flask', 'NLTK', 'Scikit-learn'], visual: 'chat',
    deck: 'A backend workflow that transforms natural-language input into relevant career suggestions.',
    context: 'Career choices can be difficult to map to an individual’s skills and interests. This project explored how natural-language processing and decision logic could support more relevant recommendations.',
    objective: 'Develop an AI-driven chatbot that processes user input and recommends career paths aligned with skills, interests, and target roles.',
    implementation: ['Built a Flask application for the chatbot experience.', 'Used NLP techniques to process natural-language user input.', 'Applied a Naive Bayes classifier and rule-based decision logic.', 'Generated recommendations intended to be more interpretable and relevant to each user profile.'],
    approach: ['A user describes their skills, interests, and target roles in natural language.', 'NLTK-based processing prepares the input for the classification workflow.', 'A Naive Bayes classifier contributes a predicted category; rule-based logic filters or shapes the resulting suggestions.', 'The application presents career recommendations based on the processed profile.'],
    results: 'The project demonstrates a recommendation flow that combines natural-language input, classification, and rule-based logic. No quantitative recommendation-quality metrics were specified.',
    technologies: [{name:'Python',role:'Application logic and processing workflow.'},{name:'Flask',role:'Backend framework for the chatbot.'},{name:'NLTK',role:'Natural-language input processing.'},{name:'Scikit-learn',role:'Naive Bayes classification.'}],
  },
];

const navItems = [
  ['About', 'about'], ['Experience', 'experience'], ['Projects', 'projects'],
  ['Skills', 'skills'], ['Research', 'research'], ['Contact', 'contact'],
];

function ResumeLink({ className = 'button' }: { className?: string }) {
  return <a className={className} href={resumeUrl} download="Gowtham-Reddy-Syamala-Resume.pdf" data-testid="link-download-resume">
    <Download size={15} aria-hidden="true" /><span>Download Resume</span>
  </a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    if (!open) return;
    navRef.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);
  const hrefFor = (id: string) => location === '/' ? `#${id}` : `/#${id}`;
  return <header className="topbar">
    <div className="wrap nav">
      <Link href="/" className="wordmark" aria-label="Gowtham Reddy Syamala — home" data-testid="link-home">
        <span className="mark">GRS</span><span>Gowtham Reddy Syamala</span>
      </Link>
      <nav ref={navRef} className={`nav-links${open ? ' open' : ''}`} aria-label="Main navigation" id="primary-navigation">
        {navItems.map(([label, id]) => <a key={id} href={hrefFor(id)} onClick={() => setOpen(false)} data-testid={`link-nav-${id}`}>{label}</a>)}
      </nav>
      <div className="nav-actions">
        <ResumeLink className="nav-resume" />
        <button ref={toggleRef} className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)} data-testid="button-mobile-menu">
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
    </div>
  </header>;
}

function DataFlow({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? 'case-visual' : 'hero-art'} role="img" aria-label="Conceptual data flow: source, transform, validate, serve. This illustrates engineering interests, not a deployed pipeline.">
    <div className={compact ? 'art-frame' : 'art-frame'}>
      <span className="art-caption">Conceptual workflow / not production infrastructure</span>
      <svg className="flow-svg" viewBox="0 0 500 360" aria-hidden="true">
        <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#536dfe" /></marker></defs>
        <path d="M95 110 C 170 110, 165 170, 230 170 S 300 230, 365 230" fill="none" stroke="#536dfe" strokeWidth="2" markerEnd="url(#arrow)" className="flow-path" />
        <path d="M95 250 C 170 250, 165 190, 230 190 S 300 130, 365 130" fill="none" stroke="#97a2b2" strokeWidth="1.5" strokeDasharray="3 7" />
        <g className="flow-node"><rect x="34" y="81" width="122" height="58" rx="2" fill="#f5f4ef" stroke="#17202c" /><circle cx="53" cy="110" r="6" fill="#c6f36b" /><text x="67" y="107" fill="#121923" fontSize="10" fontFamily="DM Mono">SOURCE</text><text x="67" y="122" fill="#657080" fontSize="8" fontFamily="DM Mono">raw inputs</text></g>
        <g className="flow-node"><rect x="181" y="141" width="127" height="58" rx="2" fill="#121923" /><circle cx="201" cy="170" r="6" fill="#536dfe" /><text x="216" y="167" fill="#f5f4ef" fontSize="10" fontFamily="DM Mono">TRANSFORM</text><text x="216" y="182" fill="#b8c0c9" fontSize="8" fontFamily="DM Mono">shape & process</text></g>
        <g className="flow-node"><rect x="344" y="91" width="122" height="58" rx="2" fill="#f5f4ef" stroke="#17202c" /><circle cx="363" cy="120" r="6" fill="#c6f36b" /><text x="377" y="117" fill="#121923" fontSize="10" fontFamily="DM Mono">VALIDATE</text><text x="377" y="132" fill="#657080" fontSize="8" fontFamily="DM Mono">check outputs</text></g>
        <g className="flow-node"><rect x="344" y="201" width="122" height="58" rx="2" fill="#f5f4ef" stroke="#17202c" /><circle cx="363" cy="230" r="6" fill="#536dfe" /><text x="377" y="227" fill="#121923" fontSize="10" fontFamily="DM Mono">SERVE</text><text x="377" y="242" fill="#657080" fontSize="8" fontFamily="DM Mono">useful outcomes</text></g>
        <text x="36" y="304" fill="#657080" fontSize="8" fontFamily="DM Mono">PYTHON / SQL / ETL / APIS</text>
        <text x="407" y="304" fill="#657080" fontSize="8" fontFamily="DM Mono">FIG. 01</text>
      </svg>
      {!compact && <div className="art-stamp">RAW DATA<br />→<br />USEFUL</div>}
    </div>
  </div>;
}

function FlightVisual() {
  return <div className="flight-graphic" aria-hidden="true">
    <svg viewBox="0 0 360 190">
      <circle cx="180" cy="95" r="65" fill="none" stroke="#9ba9d8" strokeDasharray="2 5" />
      <circle cx="180" cy="95" r="42" fill="none" stroke="#aeb8d6" />
      <path d="M30 130 C80 120 103 46 153 76 S232 158 323 45" fill="none" stroke="#536dfe" strokeWidth="2" strokeDasharray="6 5" />
      <path d="M172 91 l16 4 -12 4 -7 16 -4 -1 2 -14 -12 -4 1 -3 13 1 6 -9 3 1z" fill="#121923" />
      <circle cx="85" cy="110" r="5" fill="#c6f36b" stroke="#121923" />
      <circle cx="280" cy="78" r="5" fill="#536dfe" stroke="#121923" />
      <text x="23" y="162" fontSize="9" fill="#657080" fontFamily="DM Mono">RISK CLASSIFICATION</text>
      <text x="234" y="172" fontSize="9" fill="#657080" fontFamily="DM Mono">MODEL COMPARISON</text>
      <path d="M23 174H115" stroke="#121923" strokeWidth=".7" />
    </svg>
  </div>;
}
function ProjectVisual({ type }: { type: Project['visual'] }) {
  if (type === 'flight') return <div className="project-visual"><span className="visual-label">01 / Predictive analysis</span><FlightVisual /></div>;
  if (type === 'code') return <div className="project-visual"><span className="visual-label">02 / Code feedback flow</span><div className="code-window" aria-label="Illustrative code review preview">
    <div className="code-top"><i /><i /><i /></div><div><span className="code-muted">review(</span><span className="code-accent">submission</span><span className="code-muted">)</span></div>
    <div><span className="code-muted">→ </span>analyze<span className="code-muted">(code)</span></div>
    <div className="code-muted"># correction suggestion</div><div><span className="code-accent">explain</span><span className="code-muted">(issue, context)</span></div>
  </div></div>;
  return <div className="project-visual"><span className="visual-label">03 / Input → recommendation</span><div className="chat-preview" aria-label="Illustrative career guidance conversation">
    <div className="chat-head"><span className="chat-avatar">CG</span> CAREER GUIDANCE / SESSION</div>
    <div className="bubble">I enjoy working with data and solving problems.</div>
    <div className="bubble answer">Let’s connect your interests with possible roles.</div>
    <div className="bubble">Skills · interests · target roles</div>
  </div></div>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className="project-card" data-testid={`card-project-${project.slug}`}>
    <ProjectVisual type={project.visual} />
    <div className="project-info">
      <div className="project-topline"><span>Selected work / 0{index + 1}</span><span>{project.year}</span></div>
      <h3>{project.title}</h3><p>{project.summary}</p>
      <div className="project-outcome">{project.outcome}</div>
      <div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
      <Link className="project-link" href={`/projects/${project.slug}`} data-testid={`link-case-${project.slug}`}>Read case study <ArrowRight size={15} /></Link>
    </div>
  </article>;
}

function Home() {
  useEffect(() => {
    syncCanonical('/');
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      root.style.scrollBehavior = previousScrollBehavior;
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <div className="site-shell">
    <Header />
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <span className="hero-index">PORTFOLIO / 2026</span>
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-copy reveal">
              <span className="eyebrow hero-kicker">Data engineering · software development</span>
              <h1 id="hero-title">I build reliable software and turn <span>data</span> into something useful.</h1>
              <p className="hero-intro">I’m Gowtham Reddy Syamala, a Data Science graduate with experience building Python backend components, integrating REST APIs, and developing automated data-processing workflows. I’m focused on reliable data systems and useful engineering outcomes.</p>
              <div className="hero-meta"><span>CHENNAI, INDIA</span><i className="dot" /><span>PYTHON / SQL / ETL / APIS</span></div>
              <div className="hero-actions"><a className="button" href="#projects" data-testid="link-explore-work">Explore My Work <ArrowDown size={15} /></a><ResumeLink className="button button-secondary" /></div>
            </div>
            <DataFlow />
          </div>
          <div className="hero-bottomline"><span>ENGINEERING INTERESTS, MADE VISIBLE</span><span>SCROLL TO EXPLORE&nbsp; ↓</span></div>
        </div>
      </section>
      <section className="evidence" aria-label="Selected verified highlights">
        <div className="wrap evidence-row">
          <div className="evidence-label">Selected evidence<br />from study & project work</div>
          <div className="evidence-item"><strong>8.0/10</strong><span>B.E. GPA</span></div>
          <div className="evidence-item lime"><strong>91.2%</strong><span>Aviation model accuracy*</span></div>
          <div className="evidence-item lime"><strong>0.88</strong><span>Aviation model F1-score*</span></div>
          <div className="evidence-item"><strong>10-fold</strong><span>Cross-validation*</span></div>
        </div>
        <div className="wrap" style={{paddingTop: 12, color:'#a7afb8', font:'9px var(--app-font-mono)'}}>*Flight safety project model evaluation; not pipeline or employment metrics.</div>
      </section>
      <section className="section about" id="about">
        <div className="wrap about-grid">
          <aside className="about-aside"><span className="about-index">01 — HOW I THINK</span><div className="about-note">From a Data Science foundation toward the systems that move, organize, and make information useful.</div></aside>
          <div className="about-copy"><span className="eyebrow">About & engineering approach</span><h2>Good engineering makes the useful thing dependable.</h2>
            <p>My academic foundation is in Data Science. Through software engineering internship work and applied projects, I’ve become especially interested in the systems around data: backend logic, APIs, processing workflows, and the care it takes to make an output understandable and useful.</p>
            <p>I’m pursuing Data Engineer and Junior Data Engineer roles, bringing transferable experience in Python, SQL, ETL concepts, automation, and application development—while continuing to grow as an engineer.</p>
            <div className="principles">
              <article className="principle"><b>01 / PURPOSE</b><h3>Solve a defined problem.</h3><p>Start with the need, then shape software around it.</p></article>
              <article className="principle"><b>02 / PROCESS</b><h3>Make information systematic.</h3><p>Process deliberately and validate what comes out.</p></article>
              <article className="principle"><b>03 / CLARITY</b><h3>Make it useful to people.</h3><p>Build applications that can be understood and maintained.</p></article>
            </div>
          </div>
        </div>
      </section>
      <section className="section experience" id="experience">
        <div className="wrap"><div className="section-head"><div><span className="eyebrow">Professional experience</span><h2>Software engineering, close to the data.</h2></div><p>Internship experience in backend components, APIs, and automated processing—grounded in collaborative software development.</p></div>
          <article className="experience-panel">
            <div className="experience-side"><span className="eyebrow">Industry experience / 01</span><h3>CredInsight</h3><span className="job">Software Engineer Intern</span><span className="place">CHENNAI, INDIA<br />DEC 2025 — JUN 2026</span></div>
            <div className="experience-body"><span className="experience-date">DECEMBER 2025 — JUNE 2026</span><p>Contributed to a live stock insights platform by developing and maintaining Python backend components, translating product requirements into production-oriented implementations, and connecting frontend and backend services through REST APIs.</p>
              <ul className="responsibility-list">
                <li>Built and maintained Python backend components.</li><li>Built and consumed REST APIs across frontend and backend services.</li><li>Wrote data-processing and automation scripts.</li><li>Contributed to feature work, code reviews, debugging, and software quality.</li><li>Used Git within standard development workflows.</li></ul>
              <div className="tag-row">{['Python backend','REST APIs','Data processing','Automation','Git','Debugging'].map(t=><span className="tag" key={t}>{t}</span>)}</div>
            </div>
          </article>
        </div>
      </section>
      <section className="section focus">
        <div className="wrap focus-layout">
          <div className="focus-copy"><span className="eyebrow">Data engineering focus</span><h2>From raw inputs to reliable outcomes.</h2><p>My current strengths connect application engineering with data workflows: processing with Python, working with SQL and databases, integrating APIs, and automating repeatable tasks. The diagram is a conceptual flow—not a claim of a production pipeline I’ve deployed.</p><a className="project-link" href="#skills">Explore technical skills <ArrowRight size={15} /></a></div>
          <div>
            <DataFlow compact />
            <div className="focus-list">
              <div className="focus-item"><span className="num">01</span><div><strong>Python processing</strong><small>Scripts, data handling, backend logic</small></div></div>
              <div className="focus-item"><span className="num">02</span><div><strong>SQL & databases</strong><small>Relational and document database fundamentals</small></div></div>
              <div className="focus-item"><span className="num">03</span><div><strong>ETL & integrations</strong><small>Move, transform, connect information</small></div></div>
              <div className="focus-item"><span className="num">04</span><div><strong>Validate & maintain</strong><small>Debugging, Git, useful outputs</small></div></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section projects" id="projects">
        <div className="wrap"><div className="section-head"><div><span className="eyebrow">Selected projects / 2024—2026</span><h2>Work worth opening up.</h2></div><p>Three applied projects, each with a different problem and technical path. Open a case study for the implementation detail.</p></div>
          <div className="project-list">{projects.map((project, index)=><ProjectCard key={project.slug} project={project} index={index} />)}</div>
        </div>
      </section>
      <section className="section skills" id="skills">
        <div className="wrap"><div className="section-head"><div><span className="eyebrow">Technical skills</span><h2>Tools I can put to work.</h2></div><p>Organized around the work I’m targeting. Skills listed reflect my resume; no proficiency scores or unsupported tools.</p></div>
          <div className="skill-grid">
            <SkillGroup number="01" title="Programming" content="Python · SQL · PL/SQL · Java · C" icon={<Code2 size={16} />} />
            <SkillGroup number="02" title="Data processing & ML" content="ETL pipelines · Pandas · NumPy · Scikit-learn · NLP · LLM integration" icon={<Workflow size={16} />} />
            <SkillGroup number="03" title="Databases" content="MySQL · Oracle Database · MongoDB" icon={<Database size={16} />} />
            <SkillGroup number="04" title="Backend & APIs" content="Flask · REST APIs · Object-oriented programming · Data structures and algorithms" icon={<Layers3 size={16} />} />
            <SkillGroup number="05" title="Visualization & analytics" content="Tableau · Power BI · Matplotlib · Plotly · Advanced Excel" icon={<BookOpen size={16} />} />
            <SkillGroup number="06" title="Development tools" content="Git · Jupyter Notebook · Linux" icon={<GitBranch size={16} />} />
          </div>
        </div>
      </section>
      <section className="section research" id="research">
        <div className="wrap"><div className="section-head"><div><span className="eyebrow">Research & publication</span><h2>Research with a practical question.</h2></div><p>A distinct strand of my work: predictive risk assessment and proactive incident prevention.</p></div>
          <article className="research-paper">
            <div className="paper-mark" aria-hidden="true">P.01</div>
            <div className="paper-content"><span className="paper-date">Presented / March 2026</span><h3>“An Integrated Flight Safety and Risk Analysis System Using Machine Learning”</h3><p>Research into predictive risk assessment using aviation datasets, comparing machine-learning models and presenting analytical findings through interactive visualizations. The work was presented at ICECBE 2026.</p></div>
            <div className="conference">ICECBE 2026<br />International Conference on Research and Innovation in Smart and Sustainable Solutions in Electrical, Communication and Biomedical Engineering<br /><br />K.S.R. College of Engineering · INTI International University, Malaysia</div>
          </article>
        </div>
      </section>
      <section className="section education">
        <div className="wrap"><div className="section-head"><div><span className="eyebrow">Education & certifications</span><h2>Foundations for the next stage.</h2></div></div>
          <div className="education-grid">
            <div className="education-list">
              <article className="edu-item"><span className="edu-date">SEP 2022<br />MAY 2026</span><div><h3>Sathyabama Institute of Science and Technology</h3><p>B.E. in Computer Science and Engineering (Data Science) · Chennai, India</p><span className="edu-grade">GPA 8.0 / 10</span></div></article>
              <article className="edu-item"><span className="edu-date">JUN 2020<br />MAY 2022</span><div><h3>Sri Chaitanya Junior College</h3><p>Board of Intermediate Education · Khammam, India</p><span className="edu-grade">93%</span></div></article>
            </div>
            <div className="certs"><h3>Certifications</h3><div className="cert-item"><span className="cert-icon"><Check size={15}/></span><div><strong>Machine Learning Course</strong><small>COGNIBOT</small></div></div><div className="cert-item"><span className="cert-icon"><Check size={15}/></span><div><strong>Oracle Certified Foundation Associate</strong><small>ORACLE</small></div></div></div>
          </div>
        </div>
      </section>
      <Contact />
    </main>
  </div>;
}

function SkillGroup({number,title,content,icon}:{number:string;title:string;content:string;icon:ReactNode}) {
  return <article className="skill-group"><h3>{icon}<span>{number}</span>{title}</h3><p>{content}</p></article>;
}

function Contact() {
  return <footer className="contact" id="contact">
    <div className="wrap"><div className="contact-grid">
      <div><span className="eyebrow">Contact / next conversation</span><h2>Have a data problem worth solving?</h2><p>I’m interested in Data Engineer and Junior Data Engineer opportunities, and in teams building useful data workflows and software. If my experience could fit what you’re working on, let’s talk.</p></div>
      <div className="contact-actions">
        <a className="contact-link" href={`mailto:${email}`} data-testid="link-email"><span><Mail size={17}/>{email}</span><ArrowUpRight size={16}/></a>
        <a className="contact-link" href={`tel:${phone.replaceAll(' ', '')}`} data-testid="link-phone"><span><Phone size={17}/>{phone}</span><ArrowUpRight size={16}/></a>
        <a className="contact-link" href={github} target="_blank" rel="noopener noreferrer" data-testid="link-github"><span><Github size={17}/>GitHub</span><ArrowUpRight size={16}/></a>
        <a className="contact-link" href={linkedin} target="_blank" rel="noopener noreferrer" data-testid="link-linkedin"><span><Linkedin size={17}/>LinkedIn</span><ArrowUpRight size={16}/></a>
        <a className="contact-link" href={resumeUrl} download="Gowtham-Reddy-Syamala-Resume.pdf" data-testid="link-footer-resume"><span><Download size={17}/>Download resume (PDF)</span><ArrowUpRight size={16}/></a>
      </div>
    </div><div className="contact-footer"><span>© {new Date().getFullYear()} GOWTHAM REDDY SYAMALA</span><span>FROM RAW DATA TO RELIABLE SYSTEMS</span><a className="footer-top" href="#top" onClick={(event)=>{event.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}} data-testid="link-back-to-top">Back to top ↑</a></div></div>
  </footer>;
}

function ProjectPage() {
  const params = useParams<{slug:string}>();
  const project = projects.find(item => item.slug === params.slug);
  useEffect(() => {
    document.title = project ? `${project.title} — Gowtham Reddy Syamala` : 'Page not found — Gowtham Reddy Syamala';
    syncCanonical(project ? `/projects/${project.slug}` : undefined);
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const summary = project
      ? `${project.deck} A project case study by Gowtham Reddy Syamala.`
      : 'The requested page could not be found. Explore Gowtham Reddy Syamala’s Data Engineering portfolio.';
    description?.setAttribute('content', summary);
    document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', document.title);
    document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', summary);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', document.title);
    document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', summary);
    return () => { document.title = 'Gowtham Reddy Syamala — Data Engineer Portfolio'; };
  }, [project]);
  if (!project) return <NotFound />;
  const currentIndex = projects.findIndex(p=>p.slug===project.slug);
  const next = projects[(currentIndex + 1) % projects.length];
  return <div className="site-shell"><Header /><main>
    <section className="case-hero"><div className="wrap">
      <Link className="back-link" href="/#projects"><ArrowLeft size={14}/> All projects</Link>
      <div className="case-hero-grid"><div><span className="eyebrow">Case study / {project.year}</span><h1>{project.title}</h1><p className="case-deck">{project.deck}</p><div className="case-meta">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div><ProjectVisual type={project.visual}/></div>
    </div></section>
    <div className="case-main"><div className="wrap case-layout">
      <nav className="case-toc" aria-label="Case study contents"><span>On this page</span>{[['context','Context & problem'],['objective','Objective'],['implementation','My implementation'],['approach','Technical approach'],['technologies','Technologies'],['results','Verified results'],['limits','Scope & limits']].map(([id,label])=><a href={`#${id}`} key={id}>{label}</a>)}</nav>
      <article className="case-sections">
        <section id="context"><span className="eyebrow">01 / The problem space</span><h2>Context and problem</h2><p>{project.context}</p></section>
        <section id="objective"><span className="eyebrow">02 / What I set out to do</span><h2>Objective</h2><p>{project.objective}</p></section>
        <section id="implementation"><span className="eyebrow">03 / Contribution</span><h2>My implementation</h2><ul>{project.implementation.map((item,i)=><li key={i}>{item}</li>)}</ul></section>
        <section id="approach"><span className="eyebrow">04 / How the pieces fit</span><h2>Technical approach</h2><ul>{project.approach.map((item,i)=><li key={i}>{item}</li>)}</ul>{project.visual==='flight'&&<div className="result-box"><div className="result-stat"><strong>91.2%</strong><span>ACCURACY</span></div><div className="result-stat"><strong>0.88</strong><span>F1-SCORE</span></div><div className="result-stat"><strong>10-fold</strong><span>CROSS-VALIDATION</span></div></div>}</section>
        <section id="technologies"><span className="eyebrow">05 / Technology roles</span><h2>Technologies and their roles</h2><div className="tool-roles">{project.technologies.map(tool=><div className="tool-role" key={tool.name}><strong>{tool.name}</strong><span>{tool.role}</span></div>)}</div></section>
        <section id="results"><span className="eyebrow">06 / Evidence</span><h2>Verified results</h2><p>{project.results}</p></section>
        <section id="limits"><span className="eyebrow">07 / Scope & limits</span><h2>What this project does—and doesn’t—claim</h2><p>This case study is limited to the work and outcomes documented in my project record. It does not imply an operational deployment, unreported dataset scale, business impact, or performance beyond the verified results above.</p>{project.visual==='flight'&&<p>The reported model metrics belong to this academic flight-safety project only; they should not be read as measures of production data engineering.</p>}</section>
        <div className="case-next"><div><small>Next case study</small><strong>{next.title}</strong></div><Link className="button" href={`/projects/${next.slug}`}>Read next <ArrowRight size={15}/></Link></div>
      </article>
    </div></div>
    <Contact />
  </main></div>;
}

function NotFound() {
  return <div className="site-shell"><Header/><main className="not-found"><div className="not-found-inner"><span className="eyebrow">404 / Not found</span><h1>This page isn’t in the dataset.</h1><p>The address may have changed, or the page may not exist. Head back to the portfolio to continue exploring.</p><Link href="/" className="button" data-testid="link-not-found-home">Return to home <ArrowRight size={15}/></Link></div></main><Contact/></div>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/:slug" component={ProjectPage} />
      <Route component={NotFound} />
    </Switch>
  </WouterRouter>;
}

export default App;
