(() => {
  const desktop = document.querySelector('.desktop-canvas');
  const windows = [...document.querySelectorAll('[data-window]')];
  const activeApp = document.querySelector('#active-app');
  const dockGuide = document.querySelector('#dock-guide');
  const menuPopover = document.querySelector('#menu-popover');
  const spotlight = document.querySelector('#spotlight');
  const spotlightQuery = document.querySelector('#spotlight-query');
  const spotlightResults = document.querySelector('#spotlight-results');
  let topZ = 20;
  const findWindow = id => document.querySelector(`[data-window="${id}"]`);
  const dockFor = id => document.querySelector(`.dock [data-open="${id}"]`);
  const searchItems = [
    { id:'about', title:'About ANYAA', detail:'RPI ECSE ’30 · writer · KE2JDL', terms:'about me bio anyaa introduction rpi ecse class 2030 polytechnic ham amateur radio technician ke2jdl' },
    { id:'projects', title:'Completed engineering work', detail:'NASA HUNCH and applied AI at OdysseyRe', terms:'projects work engineering case studies resume nasa hunch mars trash ejector waste of space fdr odysseyre applied ai' },
    { id:'resume', title:'Résumé', detail:'Education, experience, coursework, and contact', terms:'resume cv education experience coursework contact skills pdf' },
    { id:'awards', title:'Awards & honors', detail:'2025 VLD state champion + selected honors', terms:'awards honors accomplishments recognition finalist champion debate vld state dean list math fair ap scholar nyscame ncfl' },
    { id:'writing', title:'Writing', detail:'An Ode to You + Substack', terms:'writing book author an ode to you amazon substack essays' },
    { id:'notes', title:'Current semester', detail:'Diff eq, ECSE, CS, songwriting, and CAD', terms:'ideas notes coursework classes semester differential equations intro ecse computer science songwriting engineering communications cad radio polytechnic learning' },
    { id:'photos', title:'Photo archive', detail:'Life, lately', terms:'photos archive life travel places' },
    { id:'terminal', title:'Technical details', detail:'Stack, skills, and contact links', terms:'resume cv technical stack skills contact' },
    { id:'messages', title:'Message ANYAA', detail:'Ask a quick question', terms:'message chat questions contact anyaa' }
  ];
  const projectDetails = {
    mars: {
      number:'01', eyebrow:'AEROSPACE SYSTEMS · NASA HUNCH', title:'Mars Trash Ejector', meta:'Lead Programmer · 2026 · Final Design Review',
      summary:'A crew-safe, modular Mars trash-ejection prototype built for NASA HUNCH, combining an airlock, slip-gear mechanism, sensor interlocks, and a clear operator interface.',
      cards:[
        ['System architecture','Arduino Uno control, 128×32 I²C OLED, six RGB status LEDs, continuous-rotation hatch servo, and a limit switch checked every 10 ms.'],
        ['Ejection mechanism','A stepper-driven rack and pinion with a slip gear, custom carbon-fiber plate, plunger, and 125:1 transmission ratio.'],
        ['Safety logic','Hatch-position and latch-engagement sensing block an unsafe cycle; a mid-cycle abort halts motion, preserves pressure state, and requires a manual reset.'],
        ['Validated outcome','Eight trials averaged 0.66 m vertical height, 0.37 s airtime, 0.33 m horizontal travel, and 0.91 m/s horizontal velocity. The project advanced to Final Design Review, and NASA retained the completed prototype.']
      ],
      tags:['ARDUINO','STEPPER MOTOR','125:1 DRIVE','SAFETY INTERLOCKS','OLED','FDR'],
      photo:'assets/fdr-team-with-erin-overcash.jpg',
      photoAlt:'Waste of Space team with NASA astronaut Erin Overcash at Final Design Review',
      photoCaption:'Waste of Space with NASA astronaut Erin Overcash at Final Design Review · April 2026',
      image:'assets/mars-trash-ejector-poster.jpg',
      imageAlt:'Waste of Space Mars Trash Ejector engineering poster',
      links:[
        ['Live project site','https://hhhwasteofspace.weebly.com/'],
        ['Project brochure','assets/waste-of-space-brochure.pdf'],
        ['Engineering poster','assets/waste-of-space-poster.pdf']
      ]
    },
    odyssey: {
      number:'02', eyebrow:'APPLIED AI · ODYSSEYRE', title:'AI Tools at OdysseyRe', meta:'AI Engineering Intern · Summer 2025 · Completed',
      summary:'Internal tools that applied AI and automation to practical insurance and legal workflows.',
      cards:[
        ['The challenge','Turn dense, high-stakes information into structured signals people could review more consistently and efficiently.'],
        ['My contribution','Built tools for legal-risk assessment and data automation, keeping the human decision-maker in the loop.'],
        ['Engineering process','Worked from real operational needs, iterated with stakeholders, and shaped the output so it was useful beyond a technical demo.'],
        ['Outcome','Presented the work to more than 100 engineers and translated the system for both technical and non-technical audiences.']
      ],
      tags:['APPLIED AI','AUTOMATION','RISK ASSESSMENT','COMMUNICATION']
    }
  };
  const notePages = {
    semester: `<time>RPI · ECSE ’30</time><h2>Current coursework</h2><p class="note-lede">Five courses across mathematics, computing, electrical engineering, design communication, and songwriting.</p><div class="course-list"><span><b>01</b>Differential Equations</span><span><b>02</b>Introduction to ECSE</span><span><b>03</b>Computer Science I</span><span><b>04</b>Songwriting Workshop</span><span><b>05</b>Engineering Communications / CAD</span></div><p class="note-foot">Rensselaer Polytechnic Institute · Class of 2030</p>`,
    radio: `<time>AMATEUR RADIO</time><h2>KE2JDL</h2><p class="note-lede">FCC Technician class amateur radio license.</p><label><input type="checkbox" checked> Pass Technician license exam</label><label><input type="checkbox"> Log more contacts from campus</label><label><input type="checkbox"> Build and test an antenna</label><label><input type="checkbox"> Document equipment and results</label><p class="note-foot">Callsign: KE2JDL</p>`,
    poly: `<time>CAMPUS NEWSPAPER</time><h2>The Polytechnic</h2><p class="note-lede">Reporting and writing for RPI’s student newspaper.</p><label><input type="checkbox"> Interview notes</label><label><input type="checkbox"> Sources and links</label><label><input type="checkbox"> Draft</label><label><input type="checkbox"> Fact check</label><p class="note-foot">Published clips can be added here.</p>`,
  };

  function focusWindow(win) {
    if (!win) return;
    windows.forEach(item => item.classList.remove('focused'));
    win.classList.add('focused');
    win.style.zIndex = ++topZ;
    activeApp.textContent = win.dataset.app || 'Finder';
  }
  function hideSystemPanels() {
    menuPopover.hidden = true; spotlight.hidden = true;
    document.querySelectorAll('[data-menu].menu-active').forEach(button => button.classList.remove('menu-active'));
  }
  function openWindow(id) {
    const win = findWindow(id);
    if (!win) return;
    windows.forEach(item => { if (item !== win) item.classList.remove('active', 'focused', 'minimized'); });
    win.classList.remove('minimized'); win.classList.add('active');
    dockFor(id)?.classList.add('running');
    focusWindow(win); hideSystemPanels();
    dockGuide?.classList.add('dismissed');
  }
  function closeWindow(win) {
    win.classList.remove('active', 'focused', 'minimized', 'maximized');
    dockFor(win.dataset.window)?.classList.remove('running');
    activeApp.textContent = 'ANYAA’s Portfolio';
  }
  function showMenu(button, name) {
    const menus = {
      apple: `<button data-open="about"><b>About This Portfolio</b></button><hr><button data-action="show-desktop">Show Desktop</button><button data-open="messages">Message ANYAA…</button><hr><span class="menu-meta">Designed and built by Anyaa.</span>`,
      file: `<button data-open="about">Open About</button><button data-open="projects">Open Projects</button><button data-open="resume">Open Résumé</button><button data-open="awards">Open Awards</button><hr><span class="disabled">Print Portfolio…</span>`,
      edit: `<span class="disabled">Undo</span><hr><span class="disabled">Cut</span><span class="disabled">Copy</span><span class="disabled">Paste</span>`,
      view: `<button data-action="show-desktop">Show Desktop</button><button data-action="reset-windows">Reset Window Position</button><hr><span class="menu-meta">Double-click a title bar to maximize.</span>`,
      window: `<button data-action="minimize-front">Minimize Front Window</button><button data-action="close-front">Close Front Window</button><hr><button data-open="messages">Messages</button>`,
      help: `<div class="menu-help"><b>How to explore</b><p>Use the Dock to open each part of the portfolio. One window stays up at a time.</p><p>Try Search for “resume,” “projects,” or “about me.” Drag any title bar to move a window.</p></div><hr><button data-open="messages">Ask ANYAA instead…</button>`,
      wifi: `<div class="wifi-menu"><div><b>Wi-Fi</b><span class="toggle-on">On</span></div><hr><small>CURRENT NETWORK</small><strong><i></i> NY-WHEREVER-WIFI-WORKS</strong><p>Current location: Troy, New York<br>Station: KE2JDL · Technician</p><hr><small>PREFERRED CONDITIONS</small><span>window seat</span><span>matcha nearby</span><span>notifications off</span></div>`
    };
    const wasOpen = !menuPopover.hidden && button.classList.contains('menu-active');
    hideSystemPanels(); if (wasOpen) return;
    menuPopover.innerHTML = menus[name] || ''; menuPopover.hidden = false; button.classList.add('menu-active');
    const rect = button.getBoundingClientRect();
    const width = name === 'help' || name === 'wifi' ? 250 : 205;
    menuPopover.style.width = `${width}px`;
    menuPopover.style.left = `${Math.min(innerWidth - width - 8, Math.max(8, rect.left))}px`;
  }
  function renderSearch(query = '') {
    const normalized = query.trim().toLowerCase();
    const matches = searchItems.filter(item => !normalized || `${item.title} ${item.detail} ${item.terms}`.toLowerCase().includes(normalized));
    spotlightResults.innerHTML = `<small>${normalized ? 'SEARCH RESULTS' : 'SUGGESTED SEARCHES'}</small>${matches.length ? matches.map((item,index) => `<button data-open="${item.id}" class="${index === 0 ? 'selected' : ''}"><span class="result-icon">${item.title.charAt(0)}</span><span><b>${item.title}</b><em>${item.detail}</em></span><kbd>↵</kbd></button>`).join('') : '<p class="no-results">No exact match. Try “projects,” “resume,” or “about me.”</p>'}`;
  }
  function showSpotlight() {
    hideSystemPanels(); spotlight.hidden = false; spotlightQuery.value = ''; renderSearch(); spotlightQuery.focus();
  }

  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-open]');
    if (opener) { openWindow(opener.dataset.open); return; }
    const menuButton = event.target.closest('[data-menu]');
    if (menuButton) { event.stopPropagation(); showMenu(menuButton, menuButton.dataset.menu); return; }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action) {
      const front = windows.find(item => item.classList.contains('focused'));
      if (action === 'show-desktop') windows.forEach(item => item.classList.remove('active', 'focused'));
      if (action === 'reset-windows' && front) { front.style.left = ''; front.style.top = ''; }
      if (action === 'minimize-front' && front) { front.classList.add('minimized'); setTimeout(() => front.classList.remove('active'), 240); }
      if (action === 'close-front' && front) closeWindow(front);
      hideSystemPanels(); return;
    }
    if (!event.target.closest('#menu-popover') && !event.target.closest('#spotlight')) hideSystemPanels();
  });
  document.querySelector('#search-trigger').addEventListener('click', event => { event.stopPropagation(); showSpotlight(); });
  spotlight.addEventListener('click', event => { if (event.target === spotlight) hideSystemPanels(); });
  spotlightQuery.addEventListener('input', () => renderSearch(spotlightQuery.value));
  spotlightQuery.addEventListener('keydown', event => { if (event.key === 'Enter') { const first = spotlightResults.querySelector('[data-open]'); if (first) openWindow(first.dataset.open); } });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hideSystemPanels();
    if ((event.metaKey || event.ctrlKey) && event.code === 'Space') { event.preventDefault(); showSpotlight(); }
  });

  windows.forEach(win => {
    const bar = win.querySelector('.window-bar');
    win.addEventListener('pointerdown', () => focusWindow(win));
    win.querySelector('.close').addEventListener('click', event => { event.stopPropagation(); closeWindow(win); });
    win.querySelector('.minimize').addEventListener('click', event => { event.stopPropagation(); win.classList.add('minimized'); setTimeout(() => win.classList.remove('active'), 240); });
    win.querySelector('.maximize').addEventListener('click', event => { event.stopPropagation(); win.classList.toggle('maximized'); focusWindow(win); });
    bar.addEventListener('dblclick', event => { if (!event.target.closest('button')) win.classList.toggle('maximized'); });
    let drag = null;
    bar.addEventListener('pointerdown', event => {
      if (event.target.closest('button') || win.classList.contains('maximized') || innerWidth <= 700) return;
      const rect = win.getBoundingClientRect(); drag = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      bar.setPointerCapture(event.pointerId); focusWindow(win);
    });
    bar.addEventListener('pointermove', event => {
      if (!drag) return;
      const host = desktop.getBoundingClientRect();
      const left = Math.min(Math.max(0, host.width - win.offsetWidth), Math.max(0, event.clientX - host.left - drag.x));
      const top = Math.min(Math.max(0, host.height - win.offsetHeight - 72), Math.max(0, event.clientY - host.top - drag.y));
      win.style.left = `${left}px`; win.style.top = `${top}px`;
    });
    const endDrag = () => { drag = null; }; bar.addEventListener('pointerup', endDrag); bar.addEventListener('pointercancel', endDrag);
  });

  const projectDetail = document.querySelector('#project-detail');
  const projectDetailContent = document.querySelector('#project-detail-content');
  document.querySelectorAll('[data-project-detail]').forEach(button => button.addEventListener('click', event => {
    event.stopPropagation();
    const project = projectDetails[button.dataset.projectDetail];
    if (!project) return;
    const links = project.links?.map(([label,url]) => `<a href="${url}" target="_blank" rel="noreferrer">${label} ↗</a>`).join('') || '';
    const photo = project.photo ? `<figure class="case-fdr-photo"><img src="${project.photo}" alt="${project.photoAlt}"><figcaption>${project.photoCaption}</figcaption></figure>` : '';
    const media = project.image ? `<figure class="case-media"><img src="${project.image}" alt="${project.imageAlt}"><figcaption>Technical poster · open the full-resolution artifact above</figcaption></figure>` : '';
    projectDetailContent.innerHTML = `<div class="case-head"><span>${project.number} / ${project.eyebrow}</span><h2>${project.title}</h2><p>${project.meta}</p></div><p class="case-summary">${project.summary}</p>${links ? `<div class="case-links">${links}</div>` : ''}${photo}<div class="case-grid">${project.cards.map(([title,copy]) => `<article><span>${title}</span><p>${copy}</p></article>`).join('')}</div><div class="case-tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>${media}`;
    projectDetail.hidden = false;
    projectDetail.scrollTop = 0;
  }));
  document.querySelector('#project-back')?.addEventListener('click', () => { projectDetail.hidden = true; });

  const noteContent = document.querySelector('#note-content');
  document.querySelectorAll('[data-note]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-note]').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    noteContent.innerHTML = notePages[button.dataset.note] || notePages.radio;
  }));

  const answers = {
    study: ['What are you studying?', 'I’m pursuing a dual degree in Electrical Engineering and Computer &amp; Systems Engineering at RPI, class of 2030. Right now I’m taking Differential Equations, Intro to ECSE, Computer Science I, Songwriting Workshop, and Engineering Communications/CAD.'],
    nasa: ['Tell me about NASA', 'I led programming for our NASA HUNCH Mars Trash Ejector. Across 8 trials, it averaged 0.33 m of horizontal travel at 0.91 m/s. I programmed control logic, operator feedback, a 10 ms hatch-safety check, and the abort sequence. We reached Final Design Review, and NASA retained the completed prototype.'],
    odyssey: ['What did you do at OdysseyRe?', 'I built internal AI prototypes for legal-risk assessment and data automation, then presented the work and its limits to more than 100 people across IT and engineering.'],
    skills: ['What are your technical skills?', 'Systems engineering, prototyping, CAD, Arduino, Raspberry Pi, sensor integration, web development, and UX design. Debate and writing also made technical communication one of my strongest skills.'],
    now: ['What are you doing now?', 'I’m about a month into RPI, so the honest answer is coursework, getting involved with <i>The Polytechnic</i>, and learning the campus. I’m also using my FCC Technician license and handheld amateur radio under callsign KE2JDL.'],
    awards: ['Which award means the most?', 'NASA HUNCH Final Design Review means a lot because it represents a completed engineering system that NASA chose to retain. I’m also proud of becoming the 2025 Varsity Lincoln-Douglas New York State Champion and placing 27th nationally in Public Forum at NCFL Grand Nationals.'],
    writing: ['You wrote a book?', 'I did! It’s called <i>An Ode to You</i>, and it’s about resilience, loss, grief, and purpose. There’s an Amazon link in the Writing app.'],
    radio: ['Why amateur radio?', 'I hold an FCC Technician class amateur radio license and use a handheld radio. My callsign is KE2JDL.'],
    debate: ['How did debate shape you?', 'Debate taught me to explain complicated ideas clearly, listen closely, and defend a decision with evidence. I was the 2025 Varsity Lincoln-Douglas New York State Champion.'],
    ncfl: ['NCFL Grand Nationals?', 'I competed in Public Forum at NCFL Grand Nationals in Chicago with my partner Noah Berlin. We broke to double-octofinals and placed 27th nationally. You can find our photo in the Photos app.'],
    poly: ['What’s The Poly?', '<i>The Polytechnic</i> is RPI’s student newspaper. It’s one of the places where my engineering brain and writing brain get to coexist.'],
    likes: ['Quick facts about you', 'Matcha, the color blue, writing, and interfaces with carefully considered details.'],
    outside: ['Outside of class?', 'I work with <i>The Polytechnic</i>, hold the amateur radio callsign KE2JDL, and write. I also published <i>An Ode to You</i>.'],
    resume: ['Can I see your résumé?', 'Yes. Open the Résumé file on the desktop or choose Résumé from the File menu. I’m also rebuilding it to reflect college and my current work.'],
    contact: ['How do I reach you?', 'Email me at <a href="mailto:sachda2@rpi.edu">sachda2@rpi.edu</a>, or find me on <a href="https://github.com/anyaasachdev" target="_blank" rel="noreferrer">GitHub</a> and <a href="https://www.linkedin.com/in/anyaasachdev/" target="_blank" rel="noreferrer">LinkedIn</a>.']
  };
  function appendMessage(question, answer) {
    const thread = document.querySelector('#message-thread');
    const outgoing = document.createElement('div'); outgoing.className = 'bubble outgoing'; outgoing.textContent = question;
    const incoming = document.createElement('div'); incoming.className = 'bubble incoming'; incoming.innerHTML = answer;
    thread.append(outgoing, incoming); thread.scrollTop = thread.scrollHeight;
  }
  document.querySelectorAll('[data-question]').forEach(button => button.addEventListener('click', () => {
    const [question, answer] = answers[button.dataset.question];
    document.querySelectorAll('.message-topics [data-question]').forEach(item => item.classList.remove('active'));
    button.classList.add('active'); appendMessage(question, answer);
  }));
  const messageKeywords = [
    ['nasa', /nasa|hunch|mars|trash|ejector|fdr/], ['odyssey', /odyssey|intern|insurance|artificial intelligence|\bai\b/],
    ['study', /study|studying|rpi|ecse|college|major|school|degree/], ['now', /right now|currently|college life|campus/], ['skills', /skill|technical|technology|arduino|raspberry|cad/], ['writing', /write|writing|book|ode|substack|author/],
    ['radio', /radio|ham|callsign|ke2jdl/], ['ncfl', /ncfl|grand nationals|public forum|noah/], ['debate', /debate|vld|lincoln.?douglas|state champ/], ['poly', /poly|newspaper|journalism/], ['outside', /outside|songwriting|fun/],
    ['resume', /resume|résumé|cv/], ['awards', /award|honor|achievement|recognition/], ['contact', /contact|email|reach|github|linkedin/], ['likes', /like|facts|personality|about you|who are you/]
  ];
  document.querySelector('#message-composer')?.addEventListener('submit', event => {
    event.preventDefault(); const input = document.querySelector('#message-input'); const question = input.value.trim(); if (!question) return;
    const match = messageKeywords.find(([,pattern]) => pattern.test(question.toLowerCase()));
    const answer = match ? answers[match[0]][1] : 'I haven’t added that answer yet. Try one of the questions above, or email me at <a href="mailto:sachda2@rpi.edu">sachda2@rpi.edu</a>.';
    appendMessage(question, answer); input.value = '';
  });
  dockGuide?.querySelector('button').addEventListener('click', () => dockGuide.classList.add('dismissed'));
  function updateClock() {
    const now = new Date();
    const weekday = now.toLocaleDateString([], { weekday:'short' }); const month = now.toLocaleDateString([], { month:'short' });
    const time = now.toLocaleTimeString([], { hour:'numeric', minute:'2-digit' });
    document.querySelector('#clock').textContent = `${weekday} ${month} ${now.getDate()} ${time}`;
  }
  updateClock(); setInterval(updateClock, 30000); focusWindow(findWindow('about'));
})();
