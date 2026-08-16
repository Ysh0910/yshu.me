export const DEFAULT_PROJECT_IMAGE = '/project-dummy.png';

export const PROJECTS_DATA = [
  {
    id: 'helscan',
    name: 'HelScan',
    team: 'solo',
    image: '/helscan.png',
    description: 'Rider safety app that turns a QR code into an emergency medical ID — first responders scan it to instantly see blood group, allergies, and emergency contacts, translated into the language they read.',
    highlights: [
      'Built the full stack: React/Vite client + Express/MongoDB API',
      'Auto-generates a printable QR profile card with multilingual translation',
      'Public rider profile viewable via a single scan, no app install required'
    ],
    liveUrl: 'https://helscan.vercel.app',
    githubUrl: 'https://github.com/Ysh0910/HelScan'
  },
  {
    id: 'shardpredict',
    name: 'ShardPredict',
    team: 'solo',
    image: '/ShardPredict.png',
    description: 'A decentralized prediction market — users create yes/no markets, bet with ETH/SHM, and disputed resolutions get AI-verified automatically.',
    highlights: [
      'Wrote the Solidity smart contract (ReentrancyGuard + CEI pattern) for on-chain betting and payouts',
      'Integrated Gemini AI to auto-verify disputed market resolutions',
      'Built the MetaMask/Ethers.js wallet flow and live betting-pool UI'
    ],
    liveUrl: 'https://shardpredict.vercel.app',
    githubUrl: 'https://github.com/Ysh0910/Shardpredict'
  },
  {
    id: 'netra',
    name: 'Netra',
    team: 'team',
    image: '/Netra.png',
    description: 'An offline-first tactical telemetry system for teams with zero connectivity — live squad vitals, positions, and an edge-AI voice copilot, running entirely on a local mesh with no cloud dependency.',
    contribution: 'Built the commander dashboard and the MQTT mesh integration layer connecting live telemetry, voice commands, and the edge AI\'s responses.',
    videoUrl: 'https://youtu.be/I-IU97HUxvA',
    githubUrl: 'https://github.com/Ysh0910/NetraAI'
  },
  {
    id: 'sanjaya',
    name: 'Sanjaya',
    team: 'team',
    image: '/Sanjaya.png',
    description: 'A full-stack traffic intelligence platform for Bangalore — enter two locations and it predicts congestion cause and delay via a TabNet model, then returns optimized routes on a live map.',
    contribution: 'Developed the spatial mapping and route-optimization logic connecting the ML backend to the live map frontend.',
    githubUrl: 'https://github.com/javagaltejasvi46/mini-project'
  },
  {
    id: 'outreach-pipeline',
    name: 'Outreach Pipeline',
    team: 'solo',
    image: '/Outreach_pipeline.jpg',
    description: 'A CLI tool that automates cold outreach end-to-end — give it a company domain, it finds lookalike companies, resolves decision-makers\' work emails, and sends personalized emails, all in one command.',
    highlights: [
      'Chained 4 external APIs (Ocean.io, Prospeo, Eazyreach, Brevo) into one pipeline',
      'Built a confirmation step showing a summary + email preview before anything sends',
      'Originally built as a take-home assignment for a SDE Intern role'
    ],
    githubUrl: 'https://github.com/Ysh0910/outreach-pipeline'
  },
  {
    id: 'kmrl',
    name: 'KMRL',
    team: 'team',
    image: '/KMRL.png',
    description: 'An automated train induction planning system for Kochi Metro — ingests data from multiple sources (ad contracts, maintenance schedules, wear-and-tear metrics) and generates the nightly induction list.',
    contribution: 'Built the frontend dashboards for visualizing induction schedules and system status.',
    githubUrl: 'https://github.com/Ysh0910/KMRL'
  },
  {
    id: 'easysuthu',
    name: 'Easysuthu',
    team: 'solo',
    image: '/easysuthu.png',
    description: 'A full-stack Airbnb-style booking platform — browse listings on a live map, filter by category, book, and leave star-rated reviews.',
    highlights: [
      'Built auth (Passport), image uploads (Cloudinary), and Mapbox geocoding end-to-end',
      'Implemented ownership-based access control for listing edit/delete',
      'Node.js/Express/MongoDB backend with EJS server-rendered views'
    ],
    githubUrl: 'https://github.com/Ysh0910/easysuthu'
  },
  {
    id: 'dhanvantri',
    name: 'Dhanvantri',
    team: 'team',
    image: DEFAULT_PROJECT_IMAGE,
    description: 'A hand-gesture-controlled patient records system paired with BLE wearable integration for real-time vitals tracking.',
    contribution: 'Built the BLE wearable scripts (Mi Band and Firebolt smartwatch integration), the complete frontend (patient registration, reports & records), and connected it end-to-end with the backend and IoT devices.',
    githubUrl: 'https://github.com/Ysh0910/Dhanvantri'
  },
  {
    id: 'jiva',
    name: 'JIVA',
    team: 'team',
    image: '/project-dummy.png',
    description: 'An AI-personalized diet and workout planner — takes your stats and goals, and Gemini generates a full meal plan and 7-day workout schedule.',
    contribution: 'Built the complete frontend and integrated it with the FastAPI + Gemini backend to display the generated diet and workout plans.',
    githubUrl: 'https://github.com/Ysh0910/JIVA'
  },
  {
    id: 'csp',
    name: 'CSP',
    team: 'solo',
    image: '/CSP.png',
    description: 'A full-stack ML app that predicts student career success from academic and skill data using a Random Forest model, with live confidence scores and model performance dashboards.',
    highlights: [
      'Built the FastAPI + scikit-learn inference backend and React/TypeScript dashboard',
      '~87% accuracy, ~90% ROC-AUC on the trained model',
      'Dockerized full stack with prediction history tracking'
    ],
    githubUrl: 'https://github.com/Ysh0910/Student_Career_Sucess_Predictor'
  },
  {
    id: 'ai-evaluator',
    name: 'AI Evaluator',
    team: 'solo',
    image: DEFAULT_PROJECT_IMAGE,
    description: 'An automated exam grading system — feeds question papers, student answers, and reference material through Gemini to generate grades with detailed feedback.',
    highlights: [
      'Built on Google\'s Agent Development Kit (ADK) + Gemini for agentic grading',
      'PDF ingestion pipeline for questions, answers, and textbook references',
      'Built-in retry/backoff logic for API rate limits'
    ],
    videoUrl: 'https://youtu.be/MUGQeQdLQkg?si=avwex86n9l9KOaaF',
    githubUrl: 'https://github.com/Ysh0910/AI_Evaluator'
  },
  {
    id: 'jihva',
    name: 'Jihva',
    team: 'team',
    image: '/Jihva.png',
    description: 'A full speech-intelligence pipeline with a retro steampunk UI — transcribes audio, separates speakers, analyzes sentiment per speaker, extracts keywords, and summarizes, all from one recording.',
    contribution: 'Built the React/Vite frontend (control panel, live transcript terminal, sentiment analytics, keyword and summary views) and connected it to the FastAPI backend pipeline.',
    githubUrl: 'https://github.com/saughhm09/Jihva'
  }
];
