export const Front_End = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content=" Welcome to Chiku AI!  A Smart Artificial Intelligence Bot Designed with Love by Murali ">
  <meta itemprop="name" content="Chiku AI">
  <meta itemprop="description" content="Discover Chiku AI – Your Friendly AI Companion, Created by Murali . Explore the future of AI with this innovative project! ">
  <meta itemprop="image" content="https://i.imgur.com/8nMNz4E.jpeg">
  <meta content="Chiku AI" property="og:site_name">
  <meta property="og:type" content="website">
  <meta content="https://yourwebsite.com/" property="og:url">
  <meta content="Chiku AI" property="og:title">
  <meta content="https://i.imgur.com/8nMNz4E.jpeg" property="og:image">
  <meta content=" Welcome to Chiku AI!  A Smart Artificial Intelligence Bot Designed with Love by Murali " property="og:description">

  <title>Chiku AI</title>
  <link rel="icon" href="https://i.imgur.com/8nMNz4E.jpeg" type="image/x-icon">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">

  <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
  <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
  <script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

  <style>
    
    :root {
      --cyan:    #00f5ff;
      --magenta: #ff00aa;
      --green:   #00ff88;
      --red:     #ff2255;
      --purple:  #8855ff;
      --glass:   rgba(255,255,255,0.045);
      --glass-border: rgba(255,255,255,0.1);
      --text:    #e8eaf6;
      --text-dim: rgba(232,234,246,0.6);
    }

    
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Rajdhani', sans-serif;
      background: #020814;
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
      line-height: 1.6;
    }

    
    #particle-canvas {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    
    #gradient-overlay {
      position: fixed;
      inset: 0;
      z-index: 1;
      opacity: 0.35;
      pointer-events: none;
    }

    
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      z-index: 2;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0,0,0,0.03) 2px,
        rgba(0,0,0,0.03) 4px
      );
      pointer-events: none;
    }

    
    .page-wrapper {
      position: relative;
      z-index: 3;
      max-width: 900px;
      margin: 0 auto;
      padding: 0 20px 60px;
    }

    
    nav {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 28px;
      background: rgba(2,8,20,0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--glass-border);
    }

    .nav-logo {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 1.1rem;
      letter-spacing: 4px;
      color: var(--cyan);
      text-shadow: 0 0 12px var(--cyan);
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 28px;
      list-style: none;
    }

    .nav-links a {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.78rem;
      letter-spacing: 2px;
      color: var(--text-dim);
      text-decoration: none;
      text-transform: uppercase;
      transition: color 0.3s, text-shadow 0.3s;
    }

    .nav-links a:hover {
      color: var(--cyan);
      text-shadow: 0 0 8px var(--cyan);
    }

    .nav-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem;
      color: var(--green);
    }

    .status-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 6px var(--green);
      animation: blink 1.8s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    
    .hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      align-items: center;
      min-height: 90vh;
      padding: 60px 0 40px;
    }

    .hero-left {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border: 1px solid var(--cyan);
      border-radius: 30px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem;
      letter-spacing: 3px;
      color: var(--cyan);
      text-transform: uppercase;
      width: fit-content;
      animation: fadeUp 0.8s ease both;
    }

    .hero-badge::before {
      content: '';
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--cyan);
      box-shadow: 0 0 8px var(--cyan);
      animation: blink 1.5s infinite;
    }

    .hero-title {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: clamp(2.8rem, 6vw, 5rem);
      line-height: 1.05;
      letter-spacing: 2px;
      animation: fadeUp 0.9s ease 0.1s both;
    }

    .hero-title .line-cyan { color: var(--cyan); text-shadow: 0 0 30px var(--cyan); }
    .hero-title .line-white { color: #fff; }
    .hero-title .line-dim { color: var(--text-dim); font-size: 0.55em; letter-spacing: 8px; font-weight: 400; display: block; margin-top: 6px; font-family: 'Share Tech Mono', monospace; }

    .hero-typed {
      font-family: 'Share Tech Mono', monospace;
      font-size: 1rem;
      color: var(--text-dim);
      min-height: 48px;
      animation: fadeUp 1s ease 0.2s both;
    }

    .hero-typed .typed-cursor { color: var(--cyan); }

    .hero-cta-group {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      animation: fadeUp 1s ease 0.3s both;
    }

    
    .hero-right {
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeUp 1s ease 0.2s both;
    }

    .neko-frame {
      position: relative;
      width: 280px;
      height: 280px;
    }

    .neko-ring {
      position: absolute;
      inset: -16px;
      border-radius: 50%;
      border: 2px solid transparent;
      background: linear-gradient(135deg, var(--cyan), var(--magenta)) border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      animation: spin 6s linear infinite;
    }

    .neko-ring-2 {
      position: absolute;
      inset: -30px;
      border-radius: 50%;
      border: 1px solid transparent;
      background: linear-gradient(225deg, var(--purple), var(--cyan)) border-box;
      -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
      animation: spin 10s linear infinite reverse;
      opacity: 0.5;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .neko-frame img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid rgba(0,245,255,0.3);
      box-shadow: 0 0 40px rgba(0,245,255,0.25), 0 0 80px rgba(0,245,255,0.1);
      transition: opacity 0.5s ease, transform 0.4s ease;
    }

    .neko-frame img:hover { transform: scale(1.04); }
    .neko-frame img.fading { opacity: 0; }

    .neko-frame .neko-glow {
      position: absolute;
      inset: 10px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    
    .glitch-wrap {
      text-align: center;
      padding: 20px 0 10px;
    }

    .glitch {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(1.5rem, 4vw, 2.4rem);
      font-weight: 900;
      letter-spacing: 8px;
      color: #fff;
      text-transform: uppercase;
      position: relative;
      display: inline-block;
    }

    .glitch::before, .glitch::after {
      content: attr(data-glitch);
      position: absolute;
      top: 0; left: 0;
      width: 100%;
      height: 100%;
    }

    .glitch::before {
      color: var(--cyan);
      animation: glitch-anim 3.5s infinite;
      clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
      transform: translateX(-3px);
    }

    .glitch::after {
      color: var(--magenta);
      animation: glitch-anim 3.5s infinite reverse;
      clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
      transform: translateX(3px);
    }

    @keyframes glitch-anim {
      0%, 85%, 100% { transform: translateX(0); opacity: 0; }
      86% { transform: translateX(-4px); opacity: 0.8; }
      88% { transform: translateX(4px); opacity: 0.6; }
      90% { transform: translateX(-2px); opacity: 0.9; }
      92% { transform: translateX(0); opacity: 0; }
    }

    
    .section-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }

    .section-header h2 {
      font-family: 'Orbitron', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 5px;
      text-transform: uppercase;
      color: var(--cyan);
      white-space: nowrap;
    }

    .section-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, var(--cyan), transparent);
      opacity: 0.4;
    }

    
    .about-card {
      background: var(--glass);
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      padding: 36px 40px;
      backdrop-filter: blur(16px);
      margin-bottom: 60px;
      position: relative;
      overflow: hidden;
      animation: fadeUp 1s ease 0.2s both;
    }

    .about-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 60%; height: 1px;
      background: linear-gradient(90deg, var(--cyan), transparent);
    }

    .about-card::after {
      content: '';
      position: absolute;
      bottom: 0; right: 0;
      width: 40%; height: 1px;
      background: linear-gradient(270deg, var(--magenta), transparent);
    }

    .about-card p {
      font-size: 1.05rem;
      line-height: 1.8;
      color: var(--text-dim);
      font-weight: 400;
    }

    
    .stat-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    .stat-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(0,245,255,0.05);
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.78rem;
      letter-spacing: 1px;
    }

    .stat-badge ion-icon { color: var(--cyan); font-size: 1rem; }

    
    .control-section {
      margin-bottom: 60px;
      animation: fadeUp 1s ease 0.3s both;
    }

    .control-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .ctrl-btn {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 28px 20px;
      border-radius: 16px;
      border: 1px solid var(--glass-border);
      background: var(--glass);
      backdrop-filter: blur(16px);
      text-decoration: none;
      font-family: 'Orbitron', sans-serif;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      transition: all 0.35s ease;
      overflow: hidden;
      cursor: pointer;
    }

    .ctrl-btn .btn-icon {
      font-size: 2rem;
      transition: transform 0.3s ease;
    }

    .ctrl-btn.cyan {
      color: var(--cyan);
      border-color: rgba(0,245,255,0.3);
    }

    .ctrl-btn.cyan:hover {
      background: rgba(0,245,255,0.1);
      border-color: var(--cyan);
      box-shadow: 0 0 30px rgba(0,245,255,0.2), inset 0 0 30px rgba(0,245,255,0.05);
      transform: translateY(-3px);
    }

    .ctrl-btn.cyan:hover .btn-icon { transform: scale(1.2) rotate(10deg); }

    .ctrl-btn.red {
      color: var(--red);
      border-color: rgba(255,34,85,0.3);
    }

    .ctrl-btn.red:hover {
      background: rgba(255,34,85,0.1);
      border-color: var(--red);
      box-shadow: 0 0 30px rgba(255,34,85,0.2), inset 0 0 30px rgba(255,34,85,0.05);
      transform: translateY(-3px);
    }

    .ctrl-btn.red:hover .btn-icon { transform: scale(1.2) rotate(-10deg); }

    
    .ctrl-btn::before {
      content: '';
      position: absolute;
      top: -2px; left: -100%;
      width: 100%; height: 2px;
      transition: left 0.5s ease;
    }

    .ctrl-btn.cyan::before { background: linear-gradient(90deg, transparent, var(--cyan)); }
    .ctrl-btn.red::before  { background: linear-gradient(90deg, transparent, var(--red)); }

    .ctrl-btn:hover::before { left: 100%; }

    
    .credits-section {
      margin-bottom: 60px;
      animation: fadeUp 1s ease 0.4s both;
    }

    .profiles-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .profile-card {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 20px;
      padding: 20px 24px;
      background: var(--glass);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      backdrop-filter: blur(16px);
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .profile-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0;
      width: 3px; height: 100%;
      background: linear-gradient(180deg, var(--cyan), var(--magenta));
      border-radius: 3px 0 0 3px;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .profile-card:hover::before { opacity: 1; }

    .profile-card:hover {
      background: rgba(255,255,255,0.07);
      border-color: rgba(0,245,255,0.25);
      transform: translateX(6px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }

    .profile-avatar {
      width: 64px; height: 64px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid rgba(0,245,255,0.3);
      box-shadow: 0 0 16px rgba(0,245,255,0.15);
      flex-shrink: 0;
      transition: box-shadow 0.3s;
    }

    .profile-card:hover .profile-avatar {
      box-shadow: 0 0 24px rgba(0,245,255,0.35);
      border-color: var(--cyan);
    }

    .profile-avatar img {
      width: 100%; height: 100%;
      object-fit: cover;
    }

    .profile-info h3 {
      font-family: 'Orbitron', sans-serif;
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 4px;
    }

    .profile-info .role {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem;
      color: var(--cyan);
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .profile-info p {
      font-size: 0.88rem;
      color: var(--text-dim);
    }

    .profile-arrow {
      color: var(--text-dim);
      font-size: 1.2rem;
      transition: color 0.3s, transform 0.3s;
    }

    .profile-card:hover .profile-arrow {
      color: var(--cyan);
      transform: translateX(4px);
    }

    
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2,8,20,0.85);
      backdrop-filter: blur(16px);
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
    }

    .modal-overlay.active {
      opacity: 1;
      pointer-events: all;
    }

    .modal-box {
      width: 90%;
      max-width: 420px;
      background: rgba(8,16,40,0.95);
      border: 1px solid rgba(0,245,255,0.25);
      border-radius: 24px;
      padding: 40px 32px;
      text-align: center;
      box-shadow: 0 0 60px rgba(0,245,255,0.1), 0 40px 80px rgba(0,0,0,0.5);
      transform: scale(0.92) translateY(20px);
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .modal-overlay.active .modal-box {
      transform: scale(1) translateY(0);
    }

    .modal-avatar {
      width: 100px; height: 100px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 auto 20px;
      border: 2px solid var(--cyan);
      box-shadow: 0 0 30px rgba(0,245,255,0.3);
    }

    .modal-avatar img { width: 100%; height: 100%; object-fit: cover; }

    .modal-box h3 {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 3px;
      margin-bottom: 8px;
    }

    .modal-box .modal-role {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.75rem;
      color: var(--cyan);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .modal-box p {
      color: var(--text-dim);
      line-height: 1.7;
      font-size: 0.95rem;
    }

    .modal-close {
      margin-top: 24px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.78rem;
      letter-spacing: 2px;
      color: var(--text-dim);
      cursor: pointer;
      transition: color 0.3s;
    }

    .modal-close:hover { color: var(--red); }

    
    .source-section {
      text-align: center;
      margin-bottom: 60px;
      animation: fadeUp 1s ease 0.5s both;
    }

    .github-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 18px 40px;
      border-radius: 50px;
      border: 1px solid rgba(0,255,136,0.4);
      background: rgba(0,255,136,0.06);
      color: var(--green);
      font-family: 'Orbitron', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      text-decoration: none;
      transition: all 0.35s ease;
      position: relative;
      overflow: hidden;
    }

    .github-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0,255,136,0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .github-btn:hover {
      border-color: var(--green);
      box-shadow: 0 0 30px rgba(0,255,136,0.2), 0 0 60px rgba(0,255,136,0.08);
      transform: translateY(-3px);
    }

    .github-btn:hover::before { opacity: 1; }
    .github-btn ion-icon { font-size: 1.4rem; }

    
    footer {
      border-top: 1px solid var(--glass-border);
      padding: 40px 20px;
      text-align: center;
    }

    .footer-inner {
      max-width: 900px;
      margin: 0 auto;
    }

    .footer-logo {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: 6px;
      color: var(--cyan);
      text-shadow: 0 0 20px var(--cyan);
      margin-bottom: 12px;
    }

    .footer-quote {
      font-style: italic;
      font-size: 0.9rem;
      color: var(--text-dim);
      margin-bottom: 16px;
    }

    .footer-copy {
      font-family: 'Share Tech Mono', monospace;
      font-size: 0.72rem;
      color: rgba(255,255,255,0.25);
      letter-spacing: 2px;
    }

    .footer-copy span { color: var(--cyan); }

    
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    
    @media (max-width: 700px) {
      nav { padding: 12px 16px; }
      .nav-links { display: none; }

      .hero {
        grid-template-columns: 1fr;
        min-height: auto;
        padding: 40px 0 30px;
        text-align: center;
      }

      .hero-right { order: -1; }
      .neko-frame { width: 200px; height: 200px; }

      .hero-badge { margin: 0 auto; }
      .hero-cta-group { justify-content: center; }

      .control-grid { grid-template-columns: 1fr; }

      .profile-card { grid-template-columns: auto 1fr; }
      .profile-arrow { display: none; }

      .about-card { padding: 24px 20px; }

      .stat-row { flex-direction: column; }
    }

    @media (max-width: 420px) {
      .hero-title { font-size: 2.2rem; }
    }
  </style>
</head>
<body>

<canvas id="particle-canvas"></canvas>
<div id="gradient-overlay"></div>

<nav>
  <a class="nav-logo" href="#">CHIKU AI</a>
  <ul class="nav-links">
    <li><a href="#about">About</a></li>
    <li><a href="#control">Control</a></li>
    <li><a href="#credits">Credits</a></li>
    <li><a href="#source">Source</a></li>
  </ul>
  <div class="nav-status">
    <div class="status-dot"></div>
    ONLINE
  </div>
</nav>

<div class="page-wrapper">

  
  <section class="hero">
    <div class="hero-left">
      <div class="hero-badge">AI · v2.0 · TypeScript</div>

      <h1 class="hero-title">
        <span class="line-white">CHIKU</span>
        <span class="line-cyan">AI</span>
        <span class="line-dim">Your AI Companion</span>
      </h1>

      <div class="hero-typed">
        <span id="typed-text"></span>
      </div>

      <div class="hero-cta-group">
        <a href="#control" class="ctrl-btn cyan" style="padding:14px 28px; border-radius:50px; flex-direction:row; width:auto;">
          <ion-icon name="flash-outline" class="btn-icon" style="font-size:1.2rem;"></ion-icon>
          Get Started
        </a>
        <a href="#about" class="ctrl-btn red" style="padding:14px 28px; border-radius:50px; flex-direction:row; width:auto;">
          <ion-icon name="information-circle-outline" class="btn-icon" style="font-size:1.2rem;"></ion-icon>
          Learn More
        </a>
      </div>
    </div>

    <div class="hero-right">
      <div class="neko-frame">
        <div class="neko-ring"></div>
        <div class="neko-ring-2"></div>
        <div class="neko-glow"></div>
        <img id="nekos-image" src="https://i.imgur.com/DUZZoAO.jpeg" alt="Chiku">
      </div>
    </div>
  </section>

  
  <div class="glitch-wrap">
    <div class="glitch" data-glitch="CHIKU AI">CHIKU AI</div>
  </div>

  
  <section id="about" style="margin-top:60px; margin-bottom:0;">
    <div class="section-header">
      <h2>About</h2>
      <div class="section-line"></div>
    </div>

    <div class="about-card">
      <p>
        Chiku AI is a unique bot built with the elegance of TypeScript by Murali, featuring a collection of beautiful and powerful commands. It represents the boundless possibilities that artificial intelligence brings to the world — symbolizing innovation, creativity, and the future. AI has the power to transform industries, empower individuals, and create solutions once thought impossible. With Chiku, we take a step closer to unlocking the extraordinary potential of intelligent technology.
      </p>
      <div class="stat-row">
        <div class="stat-badge">
          <ion-icon name="code-slash-outline"></ion-icon>
          TypeScript
        </div>
        <div class="stat-badge">
          <ion-icon name="terminal-outline"></ion-icon>
          Telegram Bot
        </div>
        <div class="stat-badge">
          <ion-icon name="flash-outline"></ion-icon>
          AI Powered
        </div>
        <div class="stat-badge">
          <ion-icon name="heart-outline"></ion-icon>
          Made with Love
        </div>
      </div>
    </div>
  </section>

  
  <section id="control" style="margin-top:60px;">
    <div class="section-header">
      <h2>Control</h2>
      <div class="section-line"></div>
    </div>
    <div class="control-section">
      <div class="control-grid">
        <a href="/chikuon" class="ctrl-btn cyan">
          <ion-icon name="power-outline" class="btn-icon"></ion-icon>
          Chiku On
        </a>
        <a href="/chikuoff" class="ctrl-btn red">
          <ion-icon name="power-outline" class="btn-icon"></ion-icon>
          Chiku Off
        </a>
      </div>
    </div>
  </section>

  
  <section id="credits">
    <div class="section-header">
      <h2>Developer &amp; Credits</h2>
      <div class="section-line"></div>
    </div>

    <div class="credits-section">
      <div class="profiles-grid">

        <div class="profile-card" id="card1">
          <div class="profile-avatar">
            <img src="https://i.imgur.com/BCVwgBq.jpeg" alt="Murali">
          </div>
          <div class="profile-info">
            <h3>Murali</h3>
            <div class="role">Lead Developer</div>
            <p>The visionary developer behind every line of code</p>
          </div>
          <ion-icon name="chevron-forward-outline" class="profile-arrow"></ion-icon>
        </div>

        <div class="profile-card" id="card2">
          <div class="profile-avatar">
            <img src="https://i.imgur.com/eXuZECu.jpeg" alt="Mr Hazex">
          </div>
          <div class="profile-info">
            <h3>Mr Hazex</h3>
            <div class="role">API Provider</div>
            <p>API provider and owner of some exclusive APIs</p>
          </div>
          <ion-icon name="chevron-forward-outline" class="profile-arrow"></ion-icon>
        </div>

        <div class="profile-card" id="card3">
          <div class="profile-avatar">
            <img src="https://i.imgur.com/Hw3eL3c.jpeg" alt="Ashlynn Repository">
          </div>
          <div class="profile-info">
            <h3>Ashlynn Repository</h3>
            <div class="role">API Owner</div>
            <p>Owner of some exclusive APIs</p>
          </div>
          <ion-icon name="chevron-forward-outline" class="profile-arrow"></ion-icon>
        </div>

      </div>
    </div>
  </section>

  
  <section id="source">
    <div class="section-header">
      <h2>Source Code</h2>
      <div class="section-line"></div>
    </div>
    <div class="source-section">
      <a href="https://github.com/Itz-Murali/Chiku-Ai" class="github-btn" target="_blank" rel="noopener">
        <ion-icon name="logo-github"></ion-icon>
        View on GitHub
      </a>
    </div>
  </section>

</div>

<footer>
  <div class="footer-inner">
    <div class="footer-logo">CHIKU AI</div>
    <div class="footer-quote">"Coding is the art of turning imagination into reality."</div>
    <div class="footer-copy">Crafted with magic by <span>Murali</span> &nbsp;·&nbsp; © 2024 All rights reserved.</div>
  </div>
</footer>

<div class="modal-overlay" id="modal1">
  <div class="modal-box">
    <div class="modal-avatar"><img src="https://i.imgur.com/BCVwgBq.jpeg" alt="Murali"></div>
    <h3>Murali</h3>
    <div class="modal-role">Lead Developer</div>
    <p>The visionary developer behind every line of code. Creator of Chiku AI.</p>
    <div class="modal-close" onclick="closeModal('modal1')">
      <ion-icon name="close-circle-outline"></ion-icon> Close
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal2">
  <div class="modal-box">
    <div class="modal-avatar"><img src="https://i.imgur.com/eXuZECu.jpeg" alt="Mr Hazex"></div>
    <h3>Mr Hazex</h3>
    <div class="modal-role">API Provider</div>
    <p>API provider and owner of some exclusive APIs powering Chiku AI's capabilities.</p>
    <div class="modal-close" onclick="closeModal('modal2')">
      <ion-icon name="close-circle-outline"></ion-icon> Close
    </div>
  </div>
</div>

<div class="modal-overlay" id="modal3">
  <div class="modal-box">
    <div class="modal-avatar"><img src="https://i.imgur.com/Hw3eL3c.jpeg" alt="Ashlynn Repository"></div>
    <h3>Ashlynn Repository</h3>
    <div class="modal-role">API Owner</div>
    <p>Owner of some exclusive APIs that help make Chiku AI extraordinary.</p>
    <div class="modal-close" onclick="closeModal('modal3')">
      <ion-icon name="close-circle-outline"></ion-icon> Close
    </div>
  </div>
</div>

<script>

(function() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['rgba(0,245,255,', 'rgba(136,85,255,', 'rgba(255,0,170,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = (Math.random() - 0.5) * 0.25;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,245,255,${0.06 * (1 - dist/100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

(function() {
  const el = document.getElementById('gradient-overlay');
  const cols = [
    "#1b1b2f","#16213e","#0f3460","#53354a","#2e2e3a",
    "#0d1b2a","#1c2541","#1e2022","#202040","#191d32"
  ];
  let step = 0, speed = 0.004;
  let idx = [0,1,2,3];

  function hex2rgb(h) {
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  }

  function lerp(a,b,t) { return Math.round(a + (b-a)*t); }

  function tick() {
    const [r1,g1,b1] = hex2rgb(cols[idx[0]]);
    const [r2,g2,b2] = hex2rgb(cols[idx[1]]);
    const [r3,g3,b3] = hex2rgb(cols[idx[2]]);
    const [r4,g4,b4] = hex2rgb(cols[idx[3]]);
    const lc = `rgb(${lerp(r1,r2,step)},${lerp(g1,g2,step)},${lerp(b1,b2,step)})`;
    const rc = `rgb(${lerp(r3,r4,step)},${lerp(g3,g4,step)},${lerp(b3,b4,step)})`;
    el.style.background = `linear-gradient(135deg, ${lc}, ${rc})`;
    step += speed;
    if (step >= 1) {
      step = 0;
      idx[0] = idx[1];
      idx[2] = idx[3];
      idx[1] = (idx[1] + 1 + Math.floor(Math.random() * (cols.length-1))) % cols.length;
      idx[3] = (idx[3] + 1 + Math.floor(Math.random() * (cols.length-1))) % cols.length;
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

window.addEventListener('DOMContentLoaded', () => {
  new Typed('#typed-text', {
    strings: [
      'Smart AI · Built with TypeScript',
      'Powerful Telegram Bot',
      'Innovation · Creativity · Future',
      'Designed with Love by Murali '
    ],
    typeSpeed: 45,
    backSpeed: 25,
    backDelay: 2000,
    loop: true,
    cursorChar: ''
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('nekos-image');

  async function fetchNeko() {
    try {
      const res = await fetch('https://nekos.life/api/v2/img/neko');
      const data = await res.json();
      if (data.url) {
        img.classList.add('fading');
        setTimeout(() => {
          img.src = data.url;
          img.classList.remove('fading');
        }, 500);
      }
    } catch(e) {  }
  }

  fetchNeko();
  setInterval(fetchNeko, 4500);
});

function openModal(id) {
  document.getElementById(id).classList.add('active');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

document.getElementById('card1').addEventListener('click', () => openModal('modal1'));
document.getElementById('card2').addEventListener('click', () => openModal('modal2'));
document.getElementById('card3').addEventListener('click', () => openModal('modal3'));

['modal1','modal2','modal3'].forEach(id => {
  document.getElementById(id).addEventListener('click', function(e) {
    if (e.target === this) closeModal(id);
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['modal1','modal2','modal3'].forEach(id => closeModal(id));
  }
});
</script>
</body>
</html>

            
`;
  
        

export const ChikuOnPage = `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ðŸš€ Chiku AI is now online and ready to chat! ðŸ¤– Let's connect and experience the power of artificial intelligence! ðŸŒ">
  <meta itemprop="name" content="Chiku AI Online Page">
  <meta itemprop="description" content="Chiku AI is live! ðŸ¤– Ready to chat, assist, and entertain.">
  <meta itemprop="image" content="https://i.imgur.com/t5V92tj.jpeg">
  <meta property="og:site_name" content="Chiku AI Online Page">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://yourwebsite.com/">
  <meta property="og:title" content="Chiku AI Online Page">
  <meta property="og:image" content="https://i.imgur.com/t5V92tj.jpeg">
  <meta property="og:description" content="ðŸš€ Chiku AI is now online and ready to chat!">
  <title>Chiku AI â€” Online</title>
  <link rel="icon" href="https://i.imgur.com/t5V92tj.jpeg" type="image/jpeg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js"></script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --cyan: #00f5ff;
      --cyan-dim: rgba(0, 245, 255, 0.15);
      --cyan-glow: rgba(0, 245, 255, 0.4);
      --green: #39ff14;
      --green-dim: rgba(57, 255, 20, 0.12);
      --bg: #060a12;
      --surface: rgba(255, 255, 255, 0.04);
      --surface-hover: rgba(255, 255, 255, 0.07);
      --border: rgba(255, 255, 255, 0.08);
      --text: #e8edf5;
      --text-muted: rgba(232, 237, 245, 0.55);
      --font-display: 'Oxanium', sans-serif;
      --font-body: 'DM Sans', sans-serif;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    
    .bg-canvas {
      position: fixed;
      inset: 0;
      z-index: -2;
      background: var(--bg);
    }

    #gradient-layer {
      position: fixed;
      inset: 0;
      z-index: -3;
      opacity: 0.6;
    }

    .grid-overlay {
      position: fixed;
      inset: 0;
      z-index: -1;
      background-image:
        linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
    }

    .noise-layer {
      position: fixed;
      inset: 0;
      z-index: -1;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      pointer-events: none;
    }

    .orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
      z-index: -1;
    }
    .orb-1 { width: 400px; height: 400px; background: rgba(0, 245, 255, 0.06); top: -100px; right: -100px; animation: orb-drift 20s ease-in-out infinite; }
    .orb-2 { width: 300px; height: 300px; background: rgba(100, 0, 255, 0.07); bottom: 10%; left: -80px; animation: orb-drift 25s ease-in-out infinite reverse; }
    .orb-3 { width: 200px; height: 200px; background: rgba(57, 255, 20, 0.04); bottom: 30%; right: 5%; animation: orb-drift 18s ease-in-out infinite 5s; }

    @keyframes orb-drift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -40px) scale(1.05); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
    }

    
    .page-wrap {
      width: 100%;
      max-width: 680px;
      padding: 60px 20px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
    }

    
    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      opacity: 0;
      transform: translateY(-30px);
      animation: reveal-down 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
    }

    .avatar-ring {
      position: relative;
      width: 160px;
      height: 160px;
      flex-shrink: 0;
    }

    .avatar-ring::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, #00f5ff, #6400ff, #39ff14, #ff0099, #00f5ff);
      animation: spin 4s linear infinite;
      z-index: 0;
    }

    .avatar-ring::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, #00f5ff, #6400ff, #39ff14, #ff0099, #00f5ff);
      animation: spin 4s linear infinite;
      filter: blur(12px);
      opacity: 0.6;
      z-index: -1;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .avatar-ring img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      z-index: 1;
      background: #0a0f1a;
      display: block;
      margin: 5px;
      transition: opacity 0.4s ease;
    }

    .avatar-ring img.loading { opacity: 0.4; }

    .ai-name {
      font-family: var(--font-display);
      font-size: clamp(2rem, 6vw, 3rem);
      font-weight: 800;
      letter-spacing: 0.04em;
      background: linear-gradient(135deg, #fff 30%, var(--cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;
      line-height: 1;
    }

    .ai-tagline {
      font-size: 0.95rem;
      color: var(--text-muted);
      font-weight: 300;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: center;
    }

    
    .card {
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 28px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      position: relative;
      overflow: hidden;
      opacity: 0;
      transform: translateY(24px);
    }

    .card::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 20px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(0,245,255,0.15), transparent 60%, rgba(57,255,20,0.08));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }

    .card.anim-1 { animation: reveal-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; }
    .card.anim-2 { animation: reveal-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.5s forwards; }

    @keyframes reveal-up {
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes reveal-down {
      to { opacity: 1; transform: translateY(0); }
    }

    
    .status-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .card-label {
      font-family: var(--font-display);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .live-badge {
      display: flex;
      align-items: center;
      gap: 7px;
      background: rgba(57, 255, 20, 0.1);
      border: 1px solid rgba(57, 255, 20, 0.25);
      border-radius: 100px;
      padding: 5px 12px;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 8px var(--green);
      animation: pulse-green 2s ease infinite;
    }

    @keyframes pulse-green {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.7; }
    }

    .live-label {
      font-family: var(--font-display);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.15em;
      color: var(--green);
      text-transform: uppercase;
    }

    .status-title {
      font-family: var(--font-display);
      font-size: clamp(1.4rem, 4vw, 1.9rem);
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
      line-height: 1.2;
    }

    .status-title .accent { color: var(--cyan); }

    .status-desc {
      font-size: 0.95rem;
      color: var(--text-muted);
      line-height: 1.7;
      font-weight: 300;
    }

    .status-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 22px;
    }

    .stat-item {
      background: var(--cyan-dim);
      border: 1px solid rgba(0, 245, 255, 0.12);
      border-radius: 12px;
      padding: 14px 10px;
      text-align: center;
    }

    .stat-value {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--cyan);
      display: block;
    }

    .stat-label {
      font-size: 0.72rem;
      color: var(--text-muted);
      letter-spacing: 0.05em;
      margin-top: 3px;
      display: block;
    }

    
    .creator-inner {
      display: flex;
      gap: 22px;
      align-items: flex-start;
    }

    .creator-avatar-wrap {
      position: relative;
      flex-shrink: 0;
      width: 90px;
      height: 90px;
    }

    .creator-avatar-wrap::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, #ff0099, #6400ff, #00f5ff, #ff0099);
      animation: spin 6s linear infinite;
      z-index: 0;
    }

    .creator-avatar-wrap img {
      width: 86px;
      height: 86px;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      z-index: 1;
      display: block;
      margin: 2px;
      background: #0a0f1a;
    }

    .creator-info { flex: 1; min-width: 0; }

    .creator-name-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }

    .creator-name {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
    }

    .creator-role-badge {
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--cyan);
      background: var(--cyan-dim);
      border: 1px solid rgba(0,245,255,0.2);
      border-radius: 100px;
      padding: 3px 9px;
      white-space: nowrap;
    }

    .creator-bio {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.65;
      font-weight: 300;
      margin-top: 6px;
    }

    .creator-message {
      margin-top: 14px;
      padding: 12px 16px;
      background: rgba(255,255,255,0.03);
      border-left: 2px solid var(--cyan);
      border-radius: 0 10px 10px 0;
      font-size: 0.86rem;
      color: var(--text-muted);
      font-style: italic;
    }

    .creator-message strong { color: var(--text); font-style: normal; }

    
    .btn-row {
      display: flex;
      gap: 12px;
      margin-top: 22px;
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      min-width: 130px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 20px;
      border-radius: 12px;
      font-family: var(--font-display);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.25s;
      border-radius: inherit;
    }

    .btn:hover::before { opacity: 1; }

    .btn-cyan {
      background: var(--cyan-dim);
      color: var(--cyan);
      border: 1px solid rgba(0, 245, 255, 0.3);
    }

    .btn-cyan::before { background: rgba(0, 245, 255, 0.08); }

    .btn-cyan:hover {
      color: #fff;
      background: rgba(0, 245, 255, 0.18);
      border-color: var(--cyan);
      box-shadow: 0 0 24px rgba(0, 245, 255, 0.25), 0 0 60px rgba(0, 245, 255, 0.1);
      transform: translateY(-2px);
    }

    .btn-green {
      background: var(--green-dim);
      color: var(--green);
      border: 1px solid rgba(57, 255, 20, 0.3);
    }

    .btn-green::before { background: rgba(57, 255, 20, 0.08); }

    .btn-green:hover {
      color: #fff;
      background: rgba(57, 255, 20, 0.16);
      border-color: var(--green);
      box-shadow: 0 0 24px rgba(57, 255, 20, 0.2), 0 0 60px rgba(57, 255, 20, 0.08);
      transform: translateY(-2px);
    }

    .btn svg { width: 16px; height: 16px; flex-shrink: 0; }

    
    footer {
      width: 100%;
      margin-top: auto;
      padding: 40px 20px 30px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      border-top: 1px solid var(--border);
      opacity: 0;
      animation: reveal-up 1s cubic-bezier(0.22, 1, 0.36, 1) 1s forwards;
    }

    .footer-name {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.08em;
    }

    .footer-quote {
      font-size: 0.82rem;
      color: var(--text-muted);
      font-style: italic;
      font-weight: 300;
      max-width: 360px;
    }

    .footer-copy {
      font-size: 0.75rem;
      color: rgba(232, 237, 245, 0.3);
      margin-top: 6px;
      letter-spacing: 0.04em;
    }

    .footer-passion {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .footer-passion span {
      color: #ffd234;
      text-shadow: 0 0 10px rgba(255, 200, 0, 0.4);
    }

    
    

    
    @media (max-width: 480px) {
      .page-wrap { padding: 40px 16px 0; gap: 20px; }
      .card { padding: 20px; }
      .creator-inner { flex-direction: column; align-items: center; text-align: center; }
      .creator-name-row { justify-content: center; }
      .creator-message { border-left: none; border-top: 2px solid var(--cyan); border-radius: 10px; text-align: left; }
      .status-stats { grid-template-columns: repeat(2, 1fr); }
      .btn-row { flex-direction: column; }
      .btn { min-width: 100%; }
      .avatar-ring { width: 130px; height: 130px; }
      .avatar-ring img { width: 120px; height: 120px; margin: 5px; }
    }

    @media (min-width: 640px) {
      .creator-inner { gap: 28px; }
    }
  </style>
</head>
<body>

  
  <div id="gradient-layer"></div>
  <div class="grid-overlay"></div>
  <div class="noise-layer"></div>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>

  <div class="page-wrap">

    
    <div class="avatar-section">
      <div class="avatar-ring">
        <img id="chiku-image" src="" alt="Chiku AI" class="loading">
      </div>
      <div>
        <h1 class="ai-name">Chiku AI</h1>
        <p class="ai-tagline" id="typed-tagline"></p>
      </div>
    </div>

    
    <div class="card anim-1">
      <div class="status-header">
        <span class="card-label">System Status</span>
        <div class="live-badge">
          <div class="live-dot"></div>
          <span class="live-label">Live</span>
        </div>
      </div>
      <h2 class="status-title"><span class="accent">Chiku</span> is online</h2>
      <p class="status-desc">Active and ready to assist. Start your conversation now and explore endless possibilities with AI-powered intelligence.</p>
      <div class="status-stats">
        <div class="stat-item">
          <span class="stat-value">24/7</span>
          <span class="stat-label">Uptime</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">~0s</span>
          <span class="stat-label">Latency</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">âˆž</span>
          <span class="stat-label">Queries</span>
        </div>
      </div>
    </div>

    
    <div class="card anim-2">
      <span class="card-label" style="display:block; margin-bottom:18px;">Meet the Creator</span>
      <div class="creator-inner">
        <div class="creator-avatar-wrap">
          <img src="https://i.imgur.com/dnCKkp2.jpeg" alt="Murali">
        </div>
        <div class="creator-info">
          <div class="creator-name-row">
            <span class="creator-name">Murali</span>
            <span class="creator-role-badge">Lead Dev</span>
          </div>
          <p class="creator-bio">
            What started as a fun experiment during my free time has grown into something truly exciting. I built Chiku AI from the ground up â€” and it keeps evolving.
          </p>
        </div>
      </div>
      <div class="creator-message">
        <strong>Be part of the journey!</strong> Join the community on Telegram at <strong>@ChikuBots</strong> and see what we're building together.
      </div>
      <div class="btn-row">
        <a href="https://t.me/ChikuBots" class="btn btn-cyan">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          Join Us
        </a>
        <a href="https://Itz-Murali.github.io" class="btn btn-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Portfolio
        </a>
      </div>
    </div>

  </div>

  <footer>
    <span class="footer-name">Murali</span>
    <p class="footer-quote">"Code is like poetry â€” every line tells a story of creation."</p>
    <p class="footer-copy">Â© 2024 Murali Â· All rights reserved</p>
    <p class="footer-passion">Crafted with passion by <span>Murali</span></p>
  </footer>

  <script>
    new Typed('#typed-tagline', {
      strings: ['Your AI companion.', 'Ready to assist.', 'Always online.', 'Powered by passion.'],
      typeSpeed: 48,
      backSpeed: 28,
      backDelay: 1800,
      loop: true,
      showCursor: false
    });

    const img = document.getElementById('chiku-image');
    async function fetchNeko() {
      try {
        const res = await fetch('https://nekos.life/api/v2/img/neko');
        const data = await res.json();
        const tmp = new Image();
        tmp.onload = () => { img.src = data.url; img.classList.remove('loading'); };
        tmp.src = data.url;
      } catch {
        img.src = 'https://i.imgur.com/Wp2uh69.jpeg';
        img.classList.remove('loading');
      }
    }
    fetchNeko();
    setInterval(fetchNeko, 5000);

    const colors = [
      "#0d1b2a","#1b263b","#0f1923","#1a1a2e","#0f3460",
      "#2c3e50","#212121","#263238","#2d3436","#1c1c1c",
      "#2b2d42","#3a3d5c","#0a0f1a","#141824","#0e1628"
    ];
    let step = 0, speed = 0.006;
    let indices = [0, 1, 2, 3];
    const gradLayer = document.getElementById('gradient-layer');

    function hexToRgb(hex) {
      return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
    }

    function lerpColor(a, b, t) {
      const [r1,g1,b1] = hexToRgb(a), [r2,g2,b2] = hexToRgb(b);
      return `rgb(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)})`;
    }

    function animateGradient() {
      const c1 = lerpColor(colors[indices[0]], colors[indices[1]], step);
      const c2 = lerpColor(colors[indices[2]], colors[indices[3]], step);
      gradLayer.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
      step += speed;
      if (step >= 1) {
        step %= 1;
        indices[0] = indices[1];
        indices[2] = indices[3];
        indices[1] = (indices[1] + 1 + Math.floor(Math.random() * (colors.length - 1))) % colors.length;
        indices[3] = (indices[3] + 1 + Math.floor(Math.random() * (colors.length - 1))) % colors.length;
      }
      requestAnimationFrame(animateGradient);
    }
    animateGradient();
  </script>
</body>
</html>

`;

export const ChikuOffPage = `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ðŸš« Chiku AI is currently offline. Stay tuned for updates! ðŸ”§ A Smart Artificial Intelligence Bot Made by Murali â¤ï¸">
  <meta itemprop="name" content="Chiku AI">
  <meta itemprop="description" content="Chiku AI is offline for maintenance. We'll be back soon! ðŸ’« Designed with love by Murali ðŸŒŸ">
  <meta itemprop="image" content="https://i.imgur.com/Rztzqfm.jpeg">
  <meta content="Chiku AI" property="og:site_name">
  <meta property="og:type" content="website">
  <meta content="https://yourwebsite.com/" property="og:url">
  <meta content="Chiku AI" property="og:title">
  <meta content="https://i.imgur.com/Rztzqfm.jpeg" property="og:image">
  <meta content="ðŸš« Chiku AI is currently offline. Stay tuned for updates! ðŸ”§ A Smart Artificial Intelligence Bot Made by Murali â¤ï¸" property="og:description">
  <title>Chiku AI</title>
  <link rel="icon" href="https://i.imgur.com/Rztzqfm.jpeg" type="image/x-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Quicksand:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --cyan: #00f5ff;
      --pink: #ff2d78;
      --purple: #9b59ff;
      --green: #00ff88;
      --bg: #04040f;
      --bg2: #080818;
      --glass: rgba(255,255,255,0.04);
      --glass-border: rgba(255,255,255,0.10);
      --glow-cyan: 0 0 20px rgba(0,245,255,0.4), 0 0 60px rgba(0,245,255,0.15);
      --glow-pink: 0 0 20px rgba(255,45,120,0.4), 0 0 60px rgba(255,45,120,0.15);
      --glow-green: 0 0 20px rgba(0,255,136,0.4), 0 0 60px rgba(0,255,136,0.15);
    }

    html { scroll-behavior: smooth; }

    body {
      min-height: 100vh;
      background: var(--bg);
      font-family: 'Quicksand', sans-serif;
      color: #e8e8f0;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
      position: relative;
    }

    
    #stars-canvas {
      position: fixed;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 20% 10%, rgba(155,89,255,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 80% 80%, rgba(0,245,255,0.10) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,45,120,0.06) 0%, transparent 70%);
      z-index: 0;
      pointer-events: none;
    }

    
    .page {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 680px;
      padding: 0 20px 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    
    .header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28px 0 0;
      opacity: 0;
      animation: fadeSlideDown 0.8s ease forwards 0.1s;
    }

    .header-brand {
      font-family: 'Orbitron', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.3em;
      color: rgba(255,255,255,0.3);
      text-transform: uppercase;
    }

    .header-badge {
      display: flex;
      align-items: center;
      gap: 7px;
      background: rgba(255,45,120,0.12);
      border: 1px solid rgba(255,45,120,0.3);
      border-radius: 50px;
      padding: 5px 14px;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--pink);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background: var(--pink);
      border-radius: 50%;
      animation: pulse-red 1.4s ease-in-out infinite;
    }

    @keyframes pulse-red {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,45,120,0.7); }
      50% { box-shadow: 0 0 0 6px rgba(255,45,120,0); }
    }

    
    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 48px;
      gap: 20px;
    }

    
    .avatar-ring {
      position: relative;
      width: 180px;
      height: 180px;
      flex-shrink: 0;
      opacity: 0;
      animation: scaleIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.4s;
    }

    .avatar-ring::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: conic-gradient(
        #ff2d78, #9b59ff, #00f5ff, #00ff88, #9b59ff, #ff2d78
      );
      animation: spin 4s linear infinite;
      z-index: 0;
    }

    .avatar-ring::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: conic-gradient(
        #ff2d78, #9b59ff, #00f5ff, #00ff88, #9b59ff, #ff2d78
      );
      animation: spin 4s linear infinite;
      filter: blur(10px);
      opacity: 0.6;
      z-index: 0;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .avatar-inner {
      position: absolute;
      inset: 4px;
      border-radius: 50%;
      overflow: hidden;
      z-index: 1;
      background: var(--bg);
    }

    .avatar-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
      transition: opacity 0.5s ease;
    }

    
    .hero-name {
      font-family: 'Orbitron', monospace;
      font-size: clamp(2rem, 7vw, 2.8rem);
      font-weight: 900;
      letter-spacing: 0.04em;
      background: linear-gradient(135deg, var(--cyan) 0%, var(--purple) 50%, var(--pink) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-align: center;
      opacity: 0;
      animation: fadeSlideUp 0.7s ease forwards 0.6s;
    }

    .hero-sub {
      font-size: 0.9rem;
      color: rgba(255,255,255,0.4);
      letter-spacing: 0.15em;
      text-transform: uppercase;
      text-align: center;
      opacity: 0;
      animation: fadeSlideUp 0.7s ease forwards 0.75s;
    }

    
    .card {
      width: 100%;
      background: var(--glass);
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      padding: 28px 32px;
      position: relative;
      overflow: hidden;
      opacity: 0;
    }

    .card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    }

    .card.status-card {
      margin-top: 36px;
      animation: fadeSlideUp 0.7s ease forwards 0.9s;
    }

    .card.creator-card {
      margin-top: 24px;
      animation: fadeSlideUp 0.7s ease forwards 1.1s;
      text-align: center;
    }

    
    .status-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .card-label {
      font-family: 'Orbitron', monospace;
      font-size: 0.7rem;
      letter-spacing: 0.25em;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .card-title {
      font-family: 'Orbitron', monospace;
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--cyan);
      text-shadow: var(--glow-cyan);
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,45,120,0.1);
      border: 1px solid rgba(255,45,120,0.25);
      border-radius: 50px;
      padding: 6px 14px;
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--pink);
      letter-spacing: 0.1em;
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--glass-border), transparent);
      margin: 16px 0;
    }

    .status-desc {
      font-size: 1rem;
      line-height: 1.7;
      color: rgba(255,255,255,0.65);
    }

    .status-desc strong {
      color: var(--cyan);
    }

    
    .creator-avatar-wrap {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto 20px;
    }

    .creator-avatar-wrap::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: conic-gradient(var(--purple), var(--cyan), var(--pink), var(--purple));
      animation: spin 5s linear infinite;
    }

    .creator-avatar-inner {
      position: absolute;
      inset: 3px;
      border-radius: 50%;
      overflow: hidden;
      background: var(--bg);
    }

    .creator-avatar-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .creator-name-text {
      font-family: 'Orbitron', monospace;
      font-size: 1.35rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }

    .creator-role-badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(155,89,255,0.2), rgba(0,245,255,0.1));
      border: 1px solid rgba(155,89,255,0.35);
      border-radius: 50px;
      padding: 4px 14px;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--purple);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }

    .creator-bio {
      font-size: 0.95rem;
      line-height: 1.75;
      color: rgba(255,255,255,0.55);
      margin-bottom: 16px;
    }

    .creator-message {
      font-size: 0.92rem;
      color: rgba(255,255,255,0.5);
      line-height: 1.6;
      background: rgba(0,245,255,0.04);
      border-left: 3px solid var(--cyan);
      border-radius: 0 12px 12px 0;
      padding: 10px 16px;
      text-align: left;
      margin-bottom: 28px;
    }

    .creator-message strong {
      color: var(--cyan);
    }

    
    .btn-row {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 28px;
      border-radius: 14px;
      font-family: 'Quicksand', sans-serif;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.05em;
      text-decoration: none;
      cursor: pointer;
      border: none;
      outline: none;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .btn:hover::before { opacity: 1; }
    .btn:hover { transform: translateY(-2px); }
    .btn:active { transform: translateY(0); }

    .btn-cyan {
      background: linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,245,255,0.08));
      border: 1px solid rgba(0,245,255,0.4);
      color: var(--cyan);
      box-shadow: 0 4px 20px rgba(0,245,255,0.1);
    }

    .btn-cyan::before {
      background: rgba(0,245,255,0.08);
    }

    .btn-cyan:hover {
      box-shadow: var(--glow-cyan), 0 4px 20px rgba(0,245,255,0.2);
      border-color: rgba(0,245,255,0.7);
    }

    .btn-green {
      background: linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.08));
      border: 1px solid rgba(0,255,136,0.4);
      color: var(--green);
      box-shadow: 0 4px 20px rgba(0,255,136,0.1);
    }

    .btn-green::before {
      background: rgba(0,255,136,0.08);
    }

    .btn-green:hover {
      box-shadow: var(--glow-green), 0 4px 20px rgba(0,255,136,0.2);
      border-color: rgba(0,255,136,0.7);
    }

    .btn svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    
    .stats-row {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 24px;
      opacity: 0;
      animation: fadeSlideUp 0.7s ease forwards 1.25s;
    }

    .stat-card {
      background: var(--glass);
      border: 1px solid var(--glass-border);
      border-radius: 16px;
      padding: 18px 12px;
      text-align: center;
      backdrop-filter: blur(12px);
    }

    .stat-value {
      font-family: 'Orbitron', monospace;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--cyan);
      text-shadow: var(--glow-cyan);
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 0.72rem;
      color: rgba(255,255,255,0.35);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    
    .footer {
      width: 100%;
      margin-top: 56px;
      border-top: 1px solid var(--glass-border);
      padding: 28px 20px;
      text-align: center;
      position: relative;
      z-index: 1;
      opacity: 0;
      animation: fadeSlideUp 0.7s ease forwards 1.4s;
    }

    .footer-name {
      font-family: 'Orbitron', monospace;
      font-size: 1.1rem;
      font-weight: 700;
      background: linear-gradient(90deg, var(--cyan), var(--purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }

    .footer-quote {
      font-size: 0.88rem;
      font-style: italic;
      color: rgba(255,255,255,0.3);
      max-width: 420px;
      margin: 0 auto 12px;
      line-height: 1.6;
    }

    .footer-copy {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.2);
      letter-spacing: 0.05em;
    }

    .footer-heart {
      color: var(--pink);
      animation: heartbeat 1.5s ease infinite;
      display: inline-block;
    }

    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    
    @keyframes fadeSlideDown {
      from { opacity: 0; transform: translateY(-20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(30px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.5); }
      to   { opacity: 1; transform: scale(1); }
    }

    
    @media (max-width: 480px) {
      .page { padding: 0 16px 48px; }
      .card { padding: 22px 20px; }
      .hero { margin-top: 36px; }
      .avatar-ring { width: 150px; height: 150px; }
      .stats-row { grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .stat-card { padding: 14px 8px; }
      .stat-value { font-size: 1.1rem; }
      .btn-row { flex-direction: column; align-items: stretch; }
      .btn { justify-content: center; }
      .status-header { flex-direction: column; align-items: flex-start; }
    }

    
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: rgba(155,89,255,0.4); border-radius: 3px; }
  </style>
</head>
<body>

  <canvas id="stars-canvas"></canvas>

  <div class="page">

    
    <header class="header">
      <div class="header-brand">Chiku AI &nbsp;/&nbsp; v2.0</div>
      <div class="header-badge">
        <span class="pulse-dot"></span>
        Offline
      </div>
    </header>

    
    <section class="hero">
      <div class="avatar-ring">
        <div class="avatar-inner">
          <img id="chiku-image" src="" alt="Chiku AI Avatar">
        </div>
      </div>
      <h1 class="hero-name">Chiku AI</h1>
      <p class="hero-sub">Smart Â· Creative Â· Intelligent</p>
    </section>

    
    <div class="card status-card">
      <div class="status-header">
        <div>
          <div class="card-label">Current Status</div>
          <div class="card-title">System Update</div>
        </div>
        <div class="status-pill">
          <span class="pulse-dot"></span>
          Offline
        </div>
      </div>
      <div class="divider"></div>
      <p class="status-desc">
        Chiku AI is currently <strong>resting</strong> â€” undergoing scheduled maintenance to become smarter and more powerful. Please check back soon to unlock its boundless knowledge and creativity.
      </p>
    </div>

    
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">24/7</div>
        <div class="stat-label">Support</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">AI</div>
        <div class="stat-label">Powered</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">âˆž</div>
        <div class="stat-label">Creativity</div>
      </div>
    </div>

    
    <div class="card creator-card">
      <div class="card-label" style="margin-bottom:18px;">Meet the Creator</div>

      <div class="creator-avatar-wrap">
        <div class="creator-avatar-inner">
          <img src="https://i.imgur.com/dnCKkp2.jpeg" alt="Murali">
        </div>
      </div>

      <div class="creator-name-text">Murali</div>
      <div class="creator-role-badge">Lead Developer</div>

      <p class="creator-bio">
        Greetings! I'm Murali, the mastermind behind this bot. What started as a fun experiment during my spare time has grown into something truly exciting and enjoyable.
      </p>

      <div class="creator-message">
        <strong>ðŸ’¬ Message:</strong> Be a part of our journey! Join us on Telegram at <strong>@ChikuBots</strong>.
      </div>

      <div class="btn-row">
        <a href="https://t.me/ChikuBots" class="btn btn-cyan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Join Us
        </a>
        <a href="https://Itz-Murali.github.io" class="btn btn-green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Portfolio
        </a>
      </div>
    </div>

  </div>

  
  <footer class="footer">
    <div class="footer-name">Murali</div>
    <p class="footer-quote">"Coding is an art where every line tells a tale of imagination."</p>
    <p class="footer-copy">
      Â© 2026 Murali Â· All Rights Reserved &nbsp;Â·&nbsp; Made with <span class="footer-heart">â™¥</span>
    </p>
  </footer>

  <script>
    
    (function() {
      const canvas = document.getElementById('stars-canvas');
      const ctx = canvas.getContext('2d');
      let stars = [];
      const N = 140;

      function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      function initStars() {
        stars = [];
        for (let i = 0; i < N; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.4 + 0.2,
            a: Math.random(),
            da: (Math.random() - 0.5) * 0.008,
            vx: (Math.random() - 0.5) * 0.12,
            vy: (Math.random() - 0.5) * 0.12,
            hue: Math.random() < 0.3 ? 280 : Math.random() < 0.5 ? 180 : 220
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const s of stars) {
          s.a += s.da;
          if (s.a <= 0 || s.a >= 1) s.da *= -1;
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = canvas.width;
          if (s.x > canvas.width) s.x = 0;
          if (s.y < 0) s.y = canvas.height;
          if (s.y > canvas.height) s.y = 0;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue}, 100%, 80%, ${s.a * 0.8})`;
          ctx.fill();
        }
        requestAnimationFrame(draw);
      }

      resize();
      initStars();
      draw();
      window.addEventListener('resize', () => { resize(); initStars(); });
    })();

    
    async function fetchNekoImage() {
      const img = document.getElementById('chiku-image');
      try {
        const res  = await fetch('https://nekos.life/api/v2/img/neko');
        const data = await res.json();
        const next = new Image();
        next.onload = () => {
          img.style.opacity = '0';
          setTimeout(() => { img.src = data.url; img.style.opacity = '1'; }, 200);
        };
        next.src = data.url;
      } catch {
        img.src = 'https://i.imgur.com/Wp2uh69.jpeg';
      }
    }

    fetchNekoImage();
    setInterval(fetchNekoImage, 5000);
  </script>

</body>
</html>

`;

export const ErrorPage2 = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 Page</title>
  <style>
    
    .page_404 {
      padding: 40px 0;
      background: #fff;
      font-family: "Arvo", serif;
    }

    .page_404 img {
      width: 100%;
    }

    .four_zero_four_bg {
      background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
      height: 400px;
      background-position: center;
    }

    .four_zero_four_bg h1 {
      font-size: 80px;
    }

    .four_zero_four_bg h3 {
      font-size: 80px;
    }

    .link_404 {
      color: #fff !important;
      padding: 10px 20px;
      background: #39ac31;
      margin: 20px 0;
      display: inline-block;
      text-decoration: none;
    }

    .contant_box_404 {
      margin-top: -50px;
    }

    .text-center {
      text-align: center;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .row {
      display: flex;
      justify-content: center;
    }

    .col-sm-12 {
      width: 100%;
    }

    .col-sm-10 {
      width: 83.33%;
    }

    .col-sm-offset-1 {
      margin-left: 8.33%;
    }
  </style>
</head>
<body>
  <section class="page_404">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="col-sm-10 col-sm-offset-1 text-center">
            <div class="four_zero_four_bg">
              <h1 class="text-center">404</h1>
            </div>
            <div class="contant_box_404">
              <h3 class="h2">Look like you're lost</h3>
              <p>The page you are looking for is not available!</p>
              <a href="" class="link_404">Go to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</body>
</html>
`;

export const ErrorPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ðŸš¨ Oops! Page Not Found! ðŸ˜± Something went wrong. Letâ€™s get back on track soon! âš¡">
  <meta itemprop="name" content="Error - Page Not Found">
  <meta itemprop="description" content="Oops! Looks like you've landed on a page that doesnâ€™t exist. Donâ€™t worry, weâ€™re working on it! ðŸ”§">
  <meta itemprop="image" content="https://i.imgur.com/Re3KkOj.jpeg">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  
  <title>Error - Page Not Found</title>
  <link rel="icon" href="https://i.imgur.com/Re3KkOj.jpeg" type="image/x-icon">

  <meta content="Error - Page Not Found" property="og:site_name">
  <meta property="og:type" content="website">
  <meta content="https://yourwebsite.com/" property="og:url">
  <meta content="Error - Page Not Found" property="og:title">
  <meta content="https://i.imgur.com/Re3KkOj.jpeg" property="og:image">
  <meta content="ðŸš¨ Oops! Page Not Found! ðŸ˜± Something went wrong. Letâ€™s get back on track soon! âš¡" property="og:description">
  <link href="https://fonts.googleapis.com/css?family=Tomorrow&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Tomorrow', sans-serif;
      height: 100vh;
      background-image: linear-gradient(to top, #2e1753, #1f1746, #131537, #0d1028, #050819);
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .text {
      position: absolute;
      top: 10%;
      color: #fff;
      text-align: center;
    }
    h1 {
      font-size: 50px;
    }
    .star {
      position: absolute;
      width: 2px;
      height: 2px;
      background: #fff;
      right: 0;
      animation: starTwinkle 3s infinite linear;
    }
    .astronaut img {
      width: 100px;
      position: absolute;
      top: 55%;
      animation: astronautFly 6s infinite linear;
    }
    @keyframes astronautFly {
      0% {
        left: -100px;
      }
      25% {
        top: 50%;
        transform: rotate(30deg);
      }
      50% {
        transform: rotate(45deg);
        top: 55%;
      }
      75% {
        top: 60%;
        transform: rotate(30deg);
      }
      100% {
        left: 110%;
        transform: rotate(45deg);
      }
    }
    @keyframes starTwinkle {
      0% {
        background: rgba(255, 255, 255, 0.4);
      }
      25% {
        background: rgba(255, 255, 255, 0.8);
      }
      50% {
        background: rgba(255, 255, 255, 1);
      }
      75% {
        background: rgba(255, 255, 255, 0.8);
      }
      100% {
        background: rgba(255, 255, 255, 0.4);
      }
    }
  </style>
</head>
<body>
  <div class="text">
    <div>ERROR</div>
    <h1>404</h1>
    <hr>
    <div>Something Error Occured See Your Logs</div>
  </div>

  <div class="astronaut">
    <img src="https://images.vexels.com/media/users/3/152639/isolated/preview/506b575739e90613428cdb399175e2c8-space-astronaut-cartoon-by-vexels.png" alt="Astronaut">
  </div>

  <script>
    document.addEventListener("DOMContentLoaded", function () {
      var body = document.body;
      setInterval(createStar, 100);

      function createStar() {
        var right = Math.random() * 500;
        var top = Math.random() * screen.height;
        var star = document.createElement("div");
        star.classList.add("star");
        body.appendChild(star);
        setInterval(runStar, 10);
        star.style.top = top + "px";

        function runStar() {
          if (right >= screen.width) {
            star.remove();
          }
          right += 3;
          star.style.right = right + "px";
        }
      }
    });
  </script>
</body>
</html>

`;


