export interface FAQ {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
  followUps?: string[];
}

export const FAQS: FAQ[] = [

  // ── General / About ───────────────────────────────────────────────────────
  {
    id: "what-is-iciitp",
    keywords: ["what is", "iciitp", "ic-iitp", "innovation centre", "innovation center", "about iciitp", "who are you", "tell me about"],
    question: "What is IC-IITP?",
    answer:
      "**IC IITP** (Incubation Centre, IIT Patna) is India's leading ESDM and Medical Electronics Incubator, located on the 500+ acre campus of IIT Patna at Bihta, Patna. It is a ₹47.10 Crore collaboration between the Government of India (47%) and the Government of Bihar (53%), registered as IC IITP Society (Reg. No. 987, 2015–16).",
    followUps: ["What is IC-IITP's vision?", "What programs are available?", "What facilities does IC-IITP have?"],
  },
  {
    id: "vision-mission",
    keywords: ["vision", "mission", "goal", "objective", "purpose", "aim"],
    question: "What is IC-IITP's vision?",
    answer:
      "**Vision:** To be the leading technology business incubator in India for Electronic System Design & Manufacturing (ESDM), with a special focus on Medical Electronics.\n\n**Mission:** To work with innovative companies whose solutions make healthcare accessible and affordable for the common man.",
    followUps: ["What is IC-IITP's background?", "What programs are available?"],
  },
  {
    id: "background",
    keywords: ["background", "history", "established", "founded", "inception", "government", "make in india", "society"],
    question: "What is IC-IITP's background?",
    answer:
      "IC IITP was established under India's **MAKE IN INDIA** initiative. Since inception, IC IITP has screened over 1,000 business plans, supported 105+ startups across six incubation schemes, and operates in three primary domains: ESDM, Medical Electronics, and ICT. It is registered as a society (Reg. No. 987, 2015–16).",
    followUps: ["What is IC-IITP?", "Who leads IC-IITP?"],
  },
  {
    id: "location",
    keywords: ["where", "location", "address", "campus", "bihta", "patna", "situated", "iit patna campus"],
    question: "Where is IC-IITP located?",
    answer:
      "IC IITP is located at **IIT Patna, Amhara Road, Bihta, Patna – 801103, Bihar, India** on a 500+ acre campus.",
    followUps: ["How can I contact IC-IITP?"],
  },
  {
    id: "contact",
    keywords: ["contact", "email", "phone", "reach out", "get in touch", "call", "write to", "helpdesk"],
    question: "How can I contact IC-IITP?",
    answer:
      "General enquiries: **iciitp@iitp.ac.in**\n\nProgram-specific contacts:\n• Nidhi Prayas: nidhiprayas.ic@iitp.ac.in\n• Nidhi EIR: nidhieir.ic@iitp.ac.in\n• EDPI-2025: gopi_ic@iitp.ac.in\n\nYou can also use the **Contact page** on this website.",
    followUps: ["What programs are available?"],
  },
  {
    id: "stats",
    keywords: ["how many startups", "statistics", "numbers", "impact", "supported", "screened", "total startups", "funded startups"],
    question: "How many startups has IC-IITP supported?",
    answer:
      "IC IITP has:\n• Screened **1,000+ business plans**\n• Supported **105+ startups** across 6 schemes\n• **52 startups** via MeitY, **19** via Nidhi-EIR, **17** via Nidhi Prayas, **13** via SISF, **4** via GENESIS",
    followUps: ["What programs are available?", "What is IC-IITP's portfolio?"],
  },

  // ── Programs — Overview ───────────────────────────────────────────────────
  {
    id: "programs-list",
    keywords: ["programs", "programmes", "schemes", "funding schemes", "all programs", "list of programs", "available programs"],
    question: "What programs are available?",
    answer:
      "IC IITP runs **7 programs**:\n1. **Nidhi Prayas** – Prototype grant up to ₹10 lakh (DST)\n2. **Nidhi EIR** – EIR fellowship, ₹10K–₹30K/month stipend (DST)\n3. **GENESIS** – Deep-tech funding up to ₹50 lakh (MeitY)\n4. **SISF** – Seed Fund up to ₹20 lakh grant / ₹50 lakh investment (DPIIT)\n5. **BioNEST** – Biotech/MedTech incubation (BIRAC/DBT)\n6. **IC IITP Incubation** – Full-stack incubation with seed fund (IIT Patna)\n7. **MEITY Incubation** – Electronics & IT startup support (MeitY)",
    followUps: ["Tell me about Nidhi Prayas", "Tell me about GENESIS", "Tell me about BioNEST", "Tell me about SISF"],
  },

  // ── Nidhi Prayas ──────────────────────────────────────────────────────────
  {
    id: "nidhi-prayas",
    keywords: ["nidhi prayas", "prayas", "prototype grant", "dst", "₹10 lakh prototype"],
    question: "Tell me about Nidhi Prayas.",
    answer:
      "**Nidhi Prayas** is a DST prototype grant of up to **₹10 lakh** over 12–18 months.\n\n**Status:** Open (2025 call active)\n**Funder:** Dept. of Science & Technology (DST)\n**Contact:** nidhiprayas.ic@iitp.ac.in",
    followUps: ["Who is eligible for Nidhi Prayas?", "What sectors does Nidhi Prayas cover?", "How do I apply to Nidhi Prayas?"],
  },
  {
    id: "nidhi-prayas-eligibility",
    keywords: ["nidhi prayas eligib", "who can apply prayas", "prayas criteria", "prayas requirement"],
    question: "Who is eligible for Nidhi Prayas?",
    answer:
      "Eligible applicants for Nidhi Prayas:\n• Individual innovators, student teams, or early-stage ventures\n• Idea must be technology-driven with prototype potential\n• Must not have received prior DST Nidhi Prayas or EIR support\n• Willingness to develop the prototype at or near IC IITP",
    followUps: ["What sectors does Nidhi Prayas cover?", "How do I apply to Nidhi Prayas?"],
  },
  {
    id: "nidhi-prayas-sectors",
    keywords: ["prayas sector", "prayas domain", "prayas field", "prayas area"],
    question: "What sectors does Nidhi Prayas cover?",
    answer:
      "Nidhi Prayas supports: Agriculture, Healthcare, Clean Technology, Energy, Water, IoT, and Industry 4.0.",
    followUps: ["Tell me about Nidhi Prayas", "How do I apply to Nidhi Prayas?"],
  },
  {
    id: "nidhi-prayas-apply",
    keywords: ["apply nidhi prayas", "prayas application", "prayas form", "prayas apply", "prayas process", "prayas steps"],
    question: "How do I apply to Nidhi Prayas?",
    answer:
      "**Nidhi Prayas Application Process:**\n1. Download the application form from the Downloads page\n2. Email completed form to nidhiprayas.ic@iitp.ac.in\n3. Screening within 4 weeks of call closure (shortlisted only notified)\n4. Pitch to the Monitoring Committee\n5. Receive milestone-linked grant up to ₹10 lakh over 12–18 months",
    followUps: ["Who is eligible for Nidhi Prayas?"],
  },

  // ── Nidhi EIR ────────────────────────────────────────────────────────────
  {
    id: "nidhi-eir",
    keywords: ["nidhi eir", "eir", "entrepreneur in residence", "fellowship", "stipend", "dst nstedb"],
    question: "Tell me about Nidhi EIR.",
    answer:
      "**Nidhi EIR** is a 12-month Entrepreneur-in-Residence fellowship by DST-NSTEDB.\n\n• **Stipend:** ₹10,000–₹30,000/month\n• **Status:** Open (active call)\n• **Contact:** nidhieir.ic@iitp.ac.in\n• Fellows work full-time on their venture at IC IITP with mentors, lab access, and investor network.",
    followUps: ["Who is eligible for Nidhi EIR?", "What does Nidhi EIR provide?", "How do I apply to Nidhi EIR?"],
  },
  {
    id: "nidhi-eir-eligibility",
    keywords: ["eir eligib", "eir criteria", "eir requirement", "who can apply eir"],
    question: "Who is eligible for Nidhi EIR?",
    answer:
      "To be eligible for Nidhi EIR you must:\n• Be an Indian citizen\n• Have completed 4-year UG/PG in Science or Engineering (or 3-year degree + 2 years work experience)\n• Pursue the business idea full-time (no concurrent remuneration)\n• Propose one technology business idea with a formal business plan\n• Not be a promoter (>10% shares) in another company\n• Not have previously availed of any NIDHI-EIR grant",
    followUps: ["Who does Nidhi EIR prefer?", "How do I apply to Nidhi EIR?"],
  },
  {
    id: "nidhi-eir-preferences",
    keywords: ["eir preference", "eir prefer", "eir women", "eir social impact"],
    question: "Who does Nidhi EIR prefer?",
    answer:
      "Nidhi EIR gives preference to:\n• Ideas with large technology uncertainty or long gestation periods\n• Ideas leveraging IP from publicly funded research or academic institutions\n• Ideas with significant social impact or job-creation potential\n• **Women entrepreneurs**",
    followUps: ["Tell me about Nidhi EIR"],
  },
  {
    id: "nidhi-eir-support",
    keywords: ["eir support", "eir provides", "eir benefit", "eir offer"],
    question: "What does Nidhi EIR provide?",
    answer:
      "Nidhi EIR fellows receive:\n• Monthly stipend (₹10K–₹30K based on profile)\n• Office space and lab access at IC IITP\n• Assigned faculty and industry mentor\n• Access to IC IITP investor and corporate network\n• Guidance on idea-to-product conversion\n• Linkage to follow-on funding schemes post-fellowship",
    followUps: ["Tell me about Nidhi EIR", "How do I apply to Nidhi EIR?"],
  },
  {
    id: "nidhi-eir-apply",
    keywords: ["apply eir", "eir application", "eir form", "eir process", "eir steps"],
    question: "How do I apply to Nidhi EIR?",
    answer:
      "**Nidhi EIR Application Process:**\n1. Download the application form from the Downloads page\n2. Submit completed form to nidhieir.ic@iitp.ac.in\n3. Screening & shortlisting (4–8 weeks)\n4. Shortlisted candidates pitch to the Monitoring Committee\n5. Selected fellows receive an offer and onboard for 12-month residency",
    followUps: ["Who is eligible for Nidhi EIR?"],
  },

  // ── GENESIS ───────────────────────────────────────────────────────────────
  {
    id: "genesis",
    keywords: ["genesis", "gen next", "meity deep tech", "tier ii", "tier iii", "deep tech funding", "deep-tech"],
    question: "Tell me about GENESIS.",
    answer:
      "**GENESIS** (Gen-Next Support for Innovative Startups) is a MeitY scheme with ₹490 Crore outlay over 5 years, targeting ~1,600 deep-tech startups, especially in Tier-II/III cities.\n\nIC IITP is an official GENESIS incubation partner and has already incubated 4 startups under this scheme.",
    followUps: ["What are GENESIS funding verticals?", "What domains does GENESIS cover?", "Who is eligible for GENESIS?"],
  },
  {
    id: "genesis-verticals",
    keywords: ["genesis vertical", "genesis eir", "genesis pilot", "genesis matching", "genesis funding type", "genesis grant amount"],
    question: "What are GENESIS funding verticals?",
    answer:
      "GENESIS has 4 funding verticals:\n• **EIR** – Up to ₹10 lakh (ideation/PoC/prototype for UG/PG students or early founders)\n• **Pilot Funding** – Up to ₹40 lakh (validate and deploy MVP with corporates/PSUs)\n• **Matching Investment** – Up to ₹50 lakh (1:1 matched for market-ready startups raising from VCs/angels)\n• **Deep-Tech Funding** – Case-by-case (sustained R&D for long-gestation ventures)",
    followUps: ["Who is eligible for GENESIS?", "What domains does GENESIS cover?"],
  },
  {
    id: "genesis-domains",
    keywords: ["genesis domain", "genesis sector", "genesis area", "genesis technology", "genesis focus"],
    question: "What domains does GENESIS cover?",
    answer:
      "GENESIS covers: AI/ML, IoT, VLSI & Semiconductors, Cybersecurity, Blockchain, Quantum Computing, AR/VR/Spatial Tech, Electronic Design & Manufacturing, and Deep-Tech Software & Products.",
    followUps: ["What are GENESIS funding verticals?"],
  },
  {
    id: "genesis-eligibility",
    keywords: ["genesis eligib", "genesis criteria", "who can apply genesis", "genesis requirement"],
    question: "Who is eligible for GENESIS?",
    answer:
      "GENESIS eligibility requirements:\n• Technology startup based in or operating from Tier-II/III cities\n• Focus on GENESIS deep-tech domains (AI/ML, IoT, VLSI, Cybersecurity, etc.)\n• Only Indian citizens may apply (EIR vertical)\n• Must not have received >₹10 lakh in government grants previously\n• Must not have been previously supported under any MeitY scheme (EIR vertical)\n• DPIIT-registered startups preferred for Pilot and Matching Investment",
    followUps: ["What are GENESIS funding verticals?", "How do I apply?"],
  },

  // ── SISF ─────────────────────────────────────────────────────────────────
  {
    id: "sisf",
    keywords: ["sisf", "startup india seed fund", "seed fund", "dpiit", "startup india", "₹20 lakh", "₹50 lakh investment"],
    question: "Tell me about SISF.",
    answer:
      "**SISF** (Startup India Seed Fund Scheme) is a flagship DPIIT programme with ₹945 Crore total outlay. IC IITP is an approved SISF incubator and has supported 13 startups.\n\n• **Grant:** Up to ₹20 lakh (PoC/prototype, milestone-based)\n• **Investment:** Up to ₹50 lakh (convertible debentures for market entry)\n• **Duration:** 12 months (prototyping/PoC phase)",
    followUps: ["Who is eligible for SISF?", "How do I apply to SISF?", "What sectors does SISF cover?"],
  },
  {
    id: "sisf-eligibility",
    keywords: ["sisf eligib", "sisf criteria", "who can apply sisf", "sisf requirement", "sisf dpiit recognised"],
    question: "Who is eligible for SISF?",
    answer:
      "SISF eligibility:\n• DPIIT-recognised startup\n• Incorporated not more than 2 years before application\n• At least 51% shareholding by Indian promoters\n• Must not have received >₹10 lakh from other Government schemes\n• Must have a product/service idea with market fit and scaling scope\n• Technology must be core to the product, service, or business model",
    followUps: ["How do I apply to SISF?"],
  },
  {
    id: "sisf-apply",
    keywords: ["apply sisf", "sisf application", "sisf portal", "sisf process", "sisf steps"],
    question: "How do I apply to SISF?",
    answer:
      "**SISF Application Process:**\n1. Apply at seedfund.startupindia.gov.in — select IC IITP as preferred incubator\n2. IC IITP evaluates for domain fit and due diligence\n3. Seed Fund Management Committee grants final approval\n4. Funds disbursed in milestone-linked tranches over 12 months",
    followUps: ["Who is eligible for SISF?"],
  },
  {
    id: "sisf-sectors",
    keywords: ["sisf sector", "sisf domain", "sisf area"],
    question: "What sectors does SISF cover?",
    answer:
      "SISF at IC IITP covers: MedTech & Healthcare, IoT & Robotics, Defence & Space, Biotechnology, Clean Energy & Mobility, and Automobile Automation.",
    followUps: ["Tell me about SISF"],
  },

  // ── BioNEST ───────────────────────────────────────────────────────────────
  {
    id: "bionest",
    keywords: ["bionest", "bio nest", "biotech", "medtech incubation", "birac", "dbt", "life sciences", "medical imaging"],
    question: "Tell me about BioNEST.",
    answer:
      "**BioNEST-ICIITP** is a 10,000 sq ft dedicated Biotech and MedTech incubation wing at IC IITP, established under the BIRAC BioNEST scheme.\n\n**Status:** Call for Proposals 2 is currently active.\n**Focus:** Bio-Signal Processing, Medical Imaging, Biomedical Devices, Disease Screening & Diagnostics, Materials for Medical Applications.",
    followUps: ["What does BioNEST provide?", "Who is eligible for BioNEST?", "How do I apply to BioNEST?"],
  },
  {
    id: "bionest-support",
    keywords: ["bionest support", "bionest provide", "bionest benefit", "bionest facility", "bionest lab"],
    question: "What does BioNEST provide?",
    answer:
      "BioNEST incubatees get:\n• Mentorship on registration, patents, product definition, and business planning\n• Product design and prototyping support\n• Testing facilities and market trial support\n• Clinical studies via partner networks\n• Labs: PCB Prototyping, Product Design, 3D Printing, Testing & Validation\n• Co-working space, 8-seater meeting rooms, 30-seater conference facility\n• Assistance applying for BIRAC and DBT grant schemes\n• Investor interaction meets",
    followUps: ["Who is eligible for BioNEST?", "How do I apply to BioNEST?"],
  },
  {
    id: "bionest-eligibility",
    keywords: ["bionest eligib", "bionest criteria", "who can apply bionest"],
    question: "Who is eligible for BioNEST?",
    answer:
      "BioNEST accepts startups and companies in Biotech, MedTech, Life Sciences, or related areas — from idea stage to early scaling — that demonstrate a technology-led innovation with a healthcare or life sciences application.",
    followUps: ["How do I apply to BioNEST?"],
  },
  {
    id: "bionest-apply",
    keywords: ["apply bionest", "bionest application", "bionest form", "bionest process"],
    question: "How do I apply to BioNEST?",
    answer:
      "**BioNEST Application Process:**\n1. Download the BioNEST Call-2 application form from the Downloads page\n2. Domain expert review of submitted applications\n3. Shortlisted teams pitch to the Selection Committee\n4. Selected startups receive an offer of incubation\n5. Sign agreement and onboard",
    followUps: ["What does BioNEST provide?"],
  },

  // ── IC IITP Incubation ────────────────────────────────────────────────────
  {
    id: "iciitp-incubation",
    keywords: ["iciitp incubation", "ic iitp incubation", "flagship incubation", "full incubation", "incubation program", "incubate at iciitp", "resident incubation", "non-resident"],
    question: "Tell me about IC IITP Incubation Programme.",
    answer:
      "The **IC IITP Incubation Programme** is the centre's flagship program for deep-tech startups in ESDM and Medical Electronics.\n\n• **Duration:** 12–24 months (full) · 3 months (pre-incubation, free)\n• **Seed fund:** Up to ₹10 lakh\n• **Sectors:** ESDM, Medical Electronics, ICT, IoT, Robotics, Healthcare\n• Apply at: forms.gle/N3zGMVek5rDjJRDW8",
    followUps: ["What does IC IITP Incubation provide?", "What does IC IITP take in return?", "Who is eligible for IC IITP Incubation?"],
  },
  {
    id: "iciitp-incubation-support",
    keywords: ["incubation support", "incubation provide", "incubation benefit", "incubation offer", "incubation service"],
    question: "What does IC IITP Incubation provide?",
    answer:
      "IC IITP incubatees receive:\n• Business, technology, and product mentors\n• Seed fund up to ₹10 lakh\n• Fully furnished air-conditioned co-working office\n• Meeting and conference facilities\n• Internet & communication support\n• State-of-the-art labs: ESDM, PCB, Testing & Calibration, Mechanical Packaging, Micro-nano fabrication\n• Access to legal, audit, IP service providers",
    followUps: ["What does IC IITP take in return?"],
  },
  {
    id: "iciitp-equity",
    keywords: ["equity", "what does iciitp take", "iciitp terms", "incubation terms", "shares", "preference shares", "security deposit"],
    question: "What does IC IITP take in return for incubation?",
    answer:
      "IC IITP incubation terms:\n• **Resident Incubation:** 5% preference shares + consumable lab charges + ₹20,000 refundable security deposit\n• **Non-Resident Incubation:** 3% preference shares + pay-per-use lab charges\n• **Pre-Incubation (3 months):** No charges",
    followUps: ["Tell me about IC IITP Incubation Programme."],
  },

  // ── Facilities ────────────────────────────────────────────────────────────
  {
    id: "facilities-overview",
    keywords: ["facilities", "labs", "equipment", "infrastructure", "lab access", "what labs", "all facilities"],
    question: "What facilities does IC-IITP have?",
    answer:
      "IC IITP has **6 world-class labs** across a 30,000 sq ft facility:\n1. **Clean Room Lab** – Class-100 microfabrication\n2. **PCB Fabrication Lab** – End-to-end PCB prototyping\n3. **ESDM Lab** – Embedded systems & IoT development\n4. **Design & Simulation Lab** – CAD, EDA & ML workstations\n5. **Mechanical Packaging Lab** – 3D printing, laser cutting, CNC\n6. **Testing & Calibration Lab** – RF, high-frequency & EMI testing",
    followUps: ["Tell me about the Clean Room", "Tell me about the PCB lab", "Tell me about the ESDM lab", "Tell me about the Testing lab"],
  },
  {
    id: "clean-room",
    keywords: ["clean room", "cleanroom", "class 100", "microfabrication", "photolithography", "thin film", "sputtering", "evaporation"],
    question: "Tell me about the Clean Room.",
    answer:
      "The **Clean Room Lab** is a Class-100 controlled-environment facility for microfabrication and thin-film processing.\n\nKey equipment: Mask Aligner, RF/DC Sputtering, Thermal & E-Beam Evaporation, Spin Coater, Wet Chemical Bench, Optical Microscope, and Deionised Water System.",
    followUps: ["What facilities does IC-IITP have?"],
  },
  {
    id: "pcb-lab",
    keywords: ["pcb", "pcb fabrication", "pcb lab", "printed circuit board", "smt", "reflow", "bga", "lpkf"],
    question: "Tell me about the PCB lab.",
    answer:
      "The **PCB Fabrication Lab** enables end-to-end PCB prototyping from layout milling to SMT assembly.\n\nKey equipment: LPKF PROTOMAT S103 (milling/drilling), Reflow Oven, ERSA BGA Rework Station, Pick-and-Place Machine, Solder Paste Printer, Stereo Zoom Microscope, ESD Workbenches, and PCB Cleaning System.",
    followUps: ["What facilities does IC-IITP have?"],
  },
  {
    id: "esdm-lab",
    keywords: ["esdm lab", "embedded systems", "microcontroller", "arduino", "raspberry pi", "esp32", "fpga", "iot lab", "sensor"],
    question: "Tell me about the ESDM lab.",
    answer:
      "The **ESDM Lab** is an embedded systems and IoT development lab.\n\nKey equipment: Arduino (Uno/Mega/Nano), Raspberry Pi (4B/CM4), STM32/ESP32/RISC-V dev kits, FPGA boards (Xilinx/Intel), RF Module Kits (LoRa, Zigbee, BLE, NB-IoT), Sensor Suite, Motor Driver & Actuator Kit, and JTAG/SWD Debuggers.",
    followUps: ["What facilities does IC-IITP have?"],
  },
  {
    id: "design-sim-lab",
    keywords: ["design simulation", "design lab", "simulation lab", "matlab", "solidworks", "ansys", "cadence", "comsol", "cad", "eda"],
    question: "Tell me about the Design & Simulation Lab.",
    answer:
      "The **Design & Simulation Lab** offers software tools for electronic design automation, mechanical CAD, and embedded simulation.\n\nTools available: MATLAB/Simulink, SolidWorks, ANSYS, Cadence Virtuoso/Allegro, LTspice/Multisim, COMSOL Multiphysics, AutoCAD, Python/TensorFlow/PyTorch workstations, and High-Performance GPU workstations.",
    followUps: ["What facilities does IC-IITP have?"],
  },
  {
    id: "mech-packaging-lab",
    keywords: ["mechanical packaging", "mech packaging", "3d printing", "3d printer", "laser cutting", "cnc", "injection moulding", "enclosure"],
    question: "Tell me about the Mechanical Packaging Lab.",
    answer:
      "The **Mechanical Packaging Lab** supports rapid enclosure and product prototyping.\n\nKey equipment: Raise3D Pro 2 Plus (large-format FDM), Prusa i3 MK3S+, Kodama Trinus (FDM/SLA), CO₂ Laser Cutter/Engraver, Injection Moulding Machine (bench-top), CNC Milling Machine, and Vacuum Former.",
    followUps: ["What facilities does IC-IITP have?"],
  },
  {
    id: "test-cal-lab",
    keywords: ["testing calibration", "test cal", "oscilloscope", "spectrum analyzer", "vna", "rf testing", "emi", "tektronix", "logic analyzer", "thermal camera"],
    question: "Tell me about the Testing lab.",
    answer:
      "The **Testing & Calibration Lab** provides high-frequency measurement and calibration infrastructure.\n\nKey equipment: Tektronix DSA 8300 (up to 70 GHz), Vector Network Analyzer, Spectrum Analyzer, Digital Storage Oscilloscope, Arbitrary Waveform Generator, LCR Meter, Thermal Camera, Environmental Test Chamber, and ESD Test Equipment.",
    followUps: ["What facilities does IC-IITP have?"],
  },

  // ── Events ────────────────────────────────────────────────────────────────
  {
    id: "events-overview",
    keywords: ["events", "workshops", "training", "seminars", "programmes", "competitions", "upcoming events", "all events"],
    question: "What events does IC-IITP organise?",
    answer:
      "IC IITP organises:\n• **EDPI-2025** – 18-week online entrepreneurship programme (active)\n• **Ideathon 2.0** – BioTech/MedTech ideation competition (concluded)\n• **MedTech School** – 1-week intensive healthcare innovation programme (recurring)\n• **Technical Training Programme** – Short-term embedded/IoT/PCB training (recurring)",
    followUps: ["Tell me about EDPI-2025", "Tell me about the MedTech School", "Tell me about the Technical Training"],
  },
  {
    id: "edpi-2025",
    keywords: ["edpi", "edpi 2025", "entrepreneurship development", "moonpreneur", "online programme", "18 week"],
    question: "Tell me about EDPI-2025.",
    answer:
      "**EDPI-2025** (Entrepreneurship Development Programme for Innovators) is an 18-week online programme co-organised by IC IITP and **Moonpreneur** (Silicon Valley, IIT/IIM alumni).\n\n• **Schedule:** Every Tuesday, 7:00 PM – 8:00 PM\n• **Duration:** Dec 16, 2025 – Apr 30, 2026\n• **Covers:** Business model canvas, customer discovery, pitching\n• **Bonus:** Standout participants fast-tracked for IC IITP incubation\n• **Contact:** gopi_ic@iitp.ac.in / +91 7970872747",
    followUps: ["How do I register for EDPI-2025?"],
  },
  {
    id: "edpi-apply",
    keywords: ["edpi register", "edpi apply", "edpi registration", "join edpi"],
    question: "How do I register for EDPI-2025?",
    answer:
      "Register for EDPI-2025 via the **Events page** on this website or contact gopi_ic@iitp.ac.in / +91 7970872747.",
    followUps: ["Tell me about EDPI-2025"],
  },
  {
    id: "ideathon",
    keywords: ["ideathon", "ideathon 2.0", "biotech competition", "medtech competition", "innovation competition", "cash prize ideathon"],
    question: "Tell me about Ideathon 2.0.",
    answer:
      "**Ideathon 2.0** was a BioTech/MedTech ideation competition co-organised with Central University of South Bihar (CUSB Gaya).\n\n• **Status:** Concluded (March 2025)\n• **Prizes:** 1st ₹10,000 · 2nd ₹7,500 · 3rd ₹5,000\n• **Special:** Top 20 teams offered **BioNEST incubation** at IC IITP\n• **Themes:** Biotechnology, Medical Electronics, Life Sciences, Healthcare Innovation",
    followUps: ["Tell me about BioNEST", "What events does IC-IITP organise?"],
  },
  {
    id: "medtech-school",
    keywords: ["medtech school", "health technology", "medical device training", "cep", "continuing education", "medtech course"],
    question: "Tell me about the MedTech School.",
    answer:
      "The **MedTech School** is a 1-week intensive continuing education programme (CEP) for engineers, medical professionals, researchers, and entrepreneurs.\n\n**Topics:** Health tech landscape, medical device design & regulatory pathway, biomedical signal processing, clinical needs assessment, MedTech startup funding.\n\n**Fees:** ₹3,000 (UG/PG self-sponsored) to ₹10,000 (Industry/Academia)\n**Contact:** iciitp@iitp.ac.in",
    followUps: ["What events does IC-IITP organise?"],
  },
  {
    id: "training-programme",
    keywords: ["technical training", "training programme", "short course", "pcb training", "iot training", "embedded training", "matlab training"],
    question: "Tell me about the Technical Training Programme.",
    answer:
      "IC IITP offers recurring short-term technical training for students, faculty, and industry professionals.\n\n**Topics covered:** Embedded Systems & Microcontrollers, PCB Design and Fabrication, IoT and Wireless Communication, 3D Printing, MATLAB/Simulink, Medical Electronics Fundamentals.\n\nTraining schedules are announced on the **Notifications page**. Contact: iciitp@iitp.ac.in",
    followUps: ["What events does IC-IITP organise?"],
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  {
    id: "notifications",
    keywords: ["notification", "news", "announcement", "latest", "updates", "recent"],
    question: "Where can I find the latest notifications?",
    answer:
      "All official notifications are in the **Notifications** section:\n• **Call for Proposals** – Active proposals (Nidhi Prayas 2025, BioNEST Call-2)\n• **Careers** – Current job openings at IC IITP\n• **NIQ/Tender** – Procurement notices on eprocure.gov.in",
    followUps: ["Are there any open calls for proposals?", "Are there any job openings?"],
  },
  {
    id: "open-calls",
    keywords: ["open call", "active call", "call for proposals", "apply now", "current openings", "ongoing"],
    question: "Are there any open calls for proposals?",
    answer:
      "Currently active calls:\n• **Nidhi Prayas 2025** – DST grant up to ₹10 lakh. Email nidhiprayas.ic@iitp.ac.in\n• **BioNEST Call-2** – BIRAC/DBT MedTech incubation. Download form from Downloads page.",
    followUps: ["Tell me about Nidhi Prayas", "Tell me about BioNEST"],
  },
  {
    id: "careers",
    keywords: ["careers", "jobs", "vacancy", "recruitment", "hiring", "work at iciitp", "positions"],
    question: "Are there any job openings at IC-IITP?",
    answer:
      "IC IITP periodically recruits for roles in administration, technical operations, incubation management, and programme coordination. Past roles include Audit Officer, Chief Manager (BioNEST), Scientific Officer, Senior Executive (Marketing/Facility Management).\n\nCheck the **Notifications → Careers** page for current openings. Contact: iciitp@iitp.ac.in",
    followUps: ["How can I contact IC-IITP?"],
  },
  {
    id: "tenders",
    keywords: ["tender", "niq", "procurement", "vendor", "supplier", "eprocure"],
    question: "Where can I find IC-IITP tenders?",
    answer:
      "All IC IITP tenders and procurement notices are published on the **Government of India e-Procurement portal** at eprocure.gov.in. Contact iciitp@iitp.ac.in for queries.",
    followUps: ["How can I contact IC-IITP?"],
  },

  // ── Portfolio / Startups ──────────────────────────────────────────────────
  {
    id: "portfolio",
    keywords: ["portfolio", "startups", "incubated companies", "alumni startups", "ventures", "companies incubated"],
    question: "What is IC-IITP's startup portfolio?",
    answer:
      "IC IITP has supported **105+ startups** across 6 schemes. Notable incubatees include:\n• **Bionic Hope (Robo Bionics)** – Affordable prosthetic limbs using robotics & bio-signals\n• **Silifarm Technologies** – AgriTech IoT for precision farming\n• **Atlamedico Techsolutions** – MedTech diagnostics\n• **Wityliti Automation** – Intelligent manufacturing automation\n\nExplore the full list in the **Portfolio** section.",
    followUps: ["What programs are available?", "What is IC-IITP's impact?"],
  },
  {
    id: "impact",
    keywords: ["impact", "achievements", "milestones", "accomplishments", "track record", "success"],
    question: "What is IC-IITP's impact?",
    answer:
      "IC IITP's key milestones:\n• 1,000+ business plans screened\n• 105+ startups supported\n• 6 active funding schemes\n• 30,000 sq ft of world-class lab space\n• 10,000 sq ft BioNEST wing\n• Partnerships with DST, MeitY, BIRAC/DBT, DPIIT, IIT Patna",
    followUps: ["What programs are available?"],
  },

  // ── Team / Governance ────────────────────────────────────────────────────
  {
    id: "governance",
    keywords: ["governance", "board", "governing body", "president", "governing council", "who runs"],
    question: "Who leads IC-IITP?",
    answer:
      "IC IITP's Governing Body:\n• **President:** Prof. T.N. Singh (Director, IIT Patna)\n• **Vice President:** Mr. Sanjay Kumar (Registrar I/C, IIT Patna)\n• **Secretary:** Dr. Sudhir Kumar (Professor In-Charge, IC IITP)\n• **Treasurer:** Mr. Shambhu Kumar (Assistant Registrar F&A, IIT Patna)\n\nThe board also includes representatives from MeitY, Indian Angel Network, CII Bihar, and Govt. of Bihar.",
    followUps: ["Who are the IC-IITP staff?", "Who is on the Evaluation Team?"],
  },
  {
    id: "staff",
    keywords: ["staff", "team", "management", "general manager", "who works", "employees", "faculty"],
    question: "Who are the IC-IITP staff?",
    answer:
      "Key IC IITP staff:\n• **Professor In-Charge:** Dr. Sudhir Kumar\n• **General Manager:** Joseph P. Arackalan\n• **Chief Manager, BioNEST:** Dr. Kumar Siddharth Singh\n• **Senior Executives:** Lab Operations, IT, Incubation, Stores & Maintenance\n• **Programs Executive:** Deepti Anand (Zero Lab Bihar)\n\nVisit **About → Staff** for the full team.",
    followUps: ["Who leads IC-IITP?"],
  },
  {
    id: "evaluation-team",
    keywords: ["evaluation team", "expert committee", "selection committee", "evaluators", "mentors"],
    question: "Who is on the Evaluation Team?",
    answer:
      "The IC IITP Evaluation Team includes experts from:\n• IIT Patna, IIT Bombay, IIT Madras\n• King's College London (Dr. Prashant Jha)\n• Indian Angel Network (Mr. Sandro Stephen)\n• Azim Premji Philanthropic Initiatives\n• Industry (BHPL, Bigtalk Technologies)\n\nSee **About → Evaluation Team** for the full list.",
    followUps: ["Who leads IC-IITP?"],
  },

  // ── Downloads ─────────────────────────────────────────────────────────────
  {
    id: "downloads",
    keywords: ["download", "form", "pdf", "document", "brochure", "application form", "get form"],
    question: "Where can I download forms and documents?",
    answer:
      "All forms and documents are on the **Downloads page**. Available items include:\n• Nidhi Prayas 2025 Application Form (PDF)\n• BioNEST Call-2 Application Form (PDF)\n• Nidhi EIR Application Form (PDF)\n\nProgram-specific forms are also linked directly from each program's page.",
    followUps: ["How do I apply to Nidhi Prayas?", "How do I apply to BioNEST?"],
  },

  // ── General Apply ─────────────────────────────────────────────────────────
  {
    id: "how-apply",
    keywords: ["how to apply", "apply to iciitp", "join iciitp", "get incubated", "start application"],
    question: "How do I apply to IC-IITP?",
    answer:
      "Choose the program that fits your stage:\n• **Idea stage →** Nidhi Prayas, Nidhi EIR, or GENESIS EIR\n• **Prototype stage →** SISF, GENESIS Pilot, or IC IITP Incubation\n• **Scaling stage →** GENESIS Matching Investment\n• **BioTech/MedTech →** BioNEST\n\nVisit the **Programs** section, pick your program, and follow the application link or download the form.",
    followUps: ["What programs are available?", "How can I contact IC-IITP?"],
  },
];

export const GREETING =
  "Hi! I'm the IC-IITP assistant. Ask me anything about our programs, facilities, events, team, and more.";

export const FALLBACK =
  "I don't have specific information on that. Try the **Contact page** or email iciitp@iitp.ac.in for a direct answer.";

export const SUGGESTED_QUESTIONS = [
  "What programs are available?",
  "What facilities does IC-IITP have?",
  "How do I apply to IC-IITP?",
  "What events does IC-IITP organise?",
];
