/**
 * ============================================================================
 * VYGA.EXE — CENTRAL CUSTOMIZATION FILE
 * ============================================================================
 * Everything personal is grouped right here so you can customize dates,
 * passwords, photo captions, BTS songs, quiz answers, roast awards, and
 * the birthday letter in seconds.
 */

window.VYGA_CONFIG = {
  site: {
    name: "VYGA.EXE",
    tagline: "THE WORLD'S MOST QUESTIONABLE BIRTHDAY CELEBRATION.",
    footerTagline: "VYGA.EXE — TOO ICONIC TO BE NORMAL. TOO ARMY TO BE ORDINARY. 💜🎀"
  },

  /**
   * BIRTHDAY COUNTDOWN CONFIGURATION
   * Configured for Vyga's birthday: 17/11/2026 (November 17, 2026).
   * Change `year`, `month` (1-12), and `day` (1-31) here anytime,
   * or omit `year` (`null`) to count down to the next annual occurrence.
   * Set `forceBirthdayToday: true` to always preview the Birthday Day celebration.
   */
  birthdayDate: {
    year: 2026,
    month: 11,
    day: 17,
    isoDate: "2026-11-17",
    forceBirthdayToday: false,
    demoDaysAhead: 7
  },

  countdownGate: {
    enabled: true,
    badge: "SYSTEM LOCKED // WAIT FOR 17/11/2026",
    lockedTitle: "WAIT FOR IT, VYGA.",
    lockedSubtitle:
      "Access to VYGA.EXE is sealed until the birthday countdown reaches zero on 17/11/2026.",
    lockedButtonLabel: "🔒 Locked Until Countdown Finishes (17/11/2026)",
    lockedAttemptMessages: [
      "Nice try! No sneaking in early — come back when the timer hits 00:00:00:00! ⏳😂",
      "Access denied! Even a Certified Main Character has to wait for 17/11/2026. 💜",
      "Patience, Vyga! Clicking faster will not speed up Earth's orbit around the sun. 🌍✨"
    ],
    unlockedBadge: "COUNTDOWN COMPLETE // 17/11/2026",
    unlockedTitle: "IT'S OFFICIALLY VYGA DAY!",
    unlockedSubtitle:
      "The wait is over! Welcome to the most questionable birthday celebration on the internet.",
    unlockedButtonLabel: "🎉 ENTER VYGA.EXE 💜🎀"
  },

  /**
   * SECRET BIRTHDAY VAULT CONFIGURATION
   * Change `correctAnswer` to whatever secret word or inside joke you want.
   * Matching is case-insensitive and trims extra spaces.
   */
  secretVault: {
    correctAnswer: "birthday",
    hint: "Hint: It's the exact reason this entire chaotic website exists today. (Default: birthday)",
    wrongResponses: [
      "Access denied! Even Vyga's overthinking wouldn't guess that password.",
      "Nope! Security alert: unauthorized snack thief detected.",
      "Incorrect! Try something less complicated — no 14-season plot twists needed.",
      "System says no. Have you tried checking the hint button? 👀"
    ],
    unlockHeading: "ACCESS GRANTED!",
    unlockMessage:
      "Congratulations, Vyga. You have officially unlocked another year of being iconic, dramatic and slightly confusing.",
    unlockReward:
      "Your reward:\nUnlimited cake, unlimited happiness and absolutely no assignments today. 💗",
    vipCoupon: "VIP PASS #VYGA-01 • Redeemable for 1x Free Birthday Treat & Zero Homework Guilt"
  },

  hero: {
    warningBadge: "BIRTHDAY ALERT // STATUS: ACADEMICALLY SUSPICIOUS",
    heading: "OH NO. IT'S VYGA DAY.",
    subtitle:
      "Breaking news: One academically suspicious human has completed another trip around the sun.",
    authorityNotice:
      "Authorities have confirmed that Vyga has officially become one year older. Her maturity level, however, remains under investigation.",
    surprisePopups: [
      "🚨 Alert: Cake consumption is legally mandatory for Vyga today.",
      "💜 System Diagnosis: 99% ARMY, 1% pretending to focus in class.",
      "🎭 Live Update: Vyga just said 'I'm almost ready' — ETA: 47 minutes.",
      "🎀 Emergency Memo: All assignments have been temporarily ignored in honour of Vyga Day.",
      "✨ Fun Fact: Background music automatically plays whenever Vyga enters a room."
    ]
  },

  breakingNews: {
    network: "VNN • VYGA NEWS NETWORK",
    mainHeadline: "BREAKING: LOCAL CLASSMATE GETS OLDER. STILL NOT WISER.",
    subBanner: "LIVE DESK COVERAGE • CLASSROOM CHAOS DIVISION • SPECIAL BIRTHDAY EDITION",
    tickerItems: [
      "URGENT: Vyga spotted saying 'just five more minutes' for the 6th consecutive hour",
      "WEATHER: 100% chance of confetti, dramatic reactions, and sudden BTS tangents",
      "FINANCE: Local bakery stocks surged ahead of Vyga Day cake acquisition",
      "TECH: Vyga's typing indicator seen blinking for 12 minutes, followed by 'ok'",
      "EDUCATION: Researchers still studying how she survives deadlines on pure vibes",
      "CULTURE: Purple hearts trending globally after ARMY birthday broadcast"
    ],
    reporters: [
      {
        name: "Correspondent Mia (Front Row Desk)",
        location: "Outside Lecture Hall B",
        quote:
          "\"I asked Vyga if she started the assignment. She stared into the distance like a K-drama lead and changed the subject to snacks. Truly inspiring.\""
      },
      {
        name: "Field Anchor Leo (Group Chat Bureau)",
        location: "Unread Messages Dept.",
        quote:
          "\"Our cameras caught her active on social media 3 minutes ago, yet the class group question remains unanswered since last Tuesday.\""
      },
      {
        name: "Chief Analyst Zara (Cake Security)",
        location: "Celebration Command",
        quote:
          "\"Good news for the nation: frosting reserves are secured, candles are armed, and no boring birthday wishes are permitted inside the perimeter.\""
      }
    ],
    cards: [
      {
        id: "mood-swings",
        category: "SCIENCE",
        timestamp: "08:14 AM",
        title: "Scientists Cannot Understand Vyga's Mood Swings.",
        subtitle: "One second it's peaceful, the next second a minor inconvenience triggers a season finale.",
        illustration: "mood",
        fullReport:
          "A multi-semester study conducted by exhausted classmates confirmed that Vyga's emotional forecast can shift from 'sunshine and giggles' to 'dramatic sigh over a missing pen' within 0.4 seconds. Snacks and BTS clips remain the only proven stabilizers."
      },
      {
        id: "excessive-drama",
        category: "CLASSROOM",
        timestamp: "10:02 AM",
        title: "Classroom Witnesses Report Excessive Drama.",
        subtitle: "Minor everyday events reportedly narrated like high-budget cinema.",
        illustration: "drama",
        fullReport:
          "Multiple eyewitnesses near the back benches reported that a simple 2-minute story somehow featured three plot twists, four sound effects, and an intense cliffhanger before the professor finished taking attendance."
      },
      {
        id: "reply-speed",
        category: "INVESTIGATION",
        timestamp: "12:45 PM",
        title: "Reply Speed Remains Under Investigation.",
        subtitle: "Seen online at 2:00 PM. Actual reply expected next fiscal quarter.",
        illustration: "reply",
        fullReport:
          "Digital forensics confirmed Vyga definitely saw the notification. Experts believe she typed three paragraphs in her head, got distracted by a reel, and decided mentally replying counted as communication."
      },
      {
        id: "cake-secured",
        category: "FOOD ALERT",
        timestamp: "02:30 PM",
        title: "Cake Supplies Have Been Secured.",
        subtitle: "Emergency frosting reserves deployed to guarantee maximum birthday joy.",
        illustration: "cake",
        fullReport:
          "Special celebration units confirmed full compliance with birthday pastry protocols. Strict orders have been issued: Vyga gets the biggest slice, zero calorie counting is allowed, and second helpings are mandatory."
      },
      {
        id: "main-character",
        category: "CULTURE",
        timestamp: "04:15 PM",
        title: "Experts Confirm Main Character Syndrome.",
        subtitle: "Cinematic soundtrack allegedly follows her down every hallway.",
        illustration: "spotlight",
        fullReport:
          "Campus observers noticed an unexplained spotlight effect whenever Vyga walks in late holding an iced drink. Sources say she treats ordinary Tuesdays like an award-show red carpet."
      },
      {
        id: "maintenance-mode",
        category: "SYSTEM",
        timestamp: "06:09 PM",
        title: "Vyga's Brain Has Entered Maintenance Mode.",
        subtitle: "Please insert good food, sleep, or a BTS comeback to reboot.",
        illustration: "brain",
        fullReport:
          "Following several hours of overthinking hypothetical scenarios from 2022, Vyga's CPU temporarily paused operations. Recommended recovery protocol: birthday cake, laughter, and zero stress."
      }
    ]
  },

  roastAwards: [
    {
      id: "award-1",
      number: "01",
      title: "CEO of Overthinking.",
      description: "Can turn a simple message into a 14-season psychological thriller.",
      badge: "OVERTHINKING DEPT.",
      speech: "\"Wait—why did they put a period at the end of 'okay'? Let me analyze this for 4 hours.\"",
      trophyStyle: "crown"
    },
    {
      id: "award-2",
      number: "02",
      title: "Minister of Five More Minutes.",
      description: "Time is a social construct, especially when Vyga is getting ready.",
      badge: "CHRONOLOGY BENDER",
      speech: "\"I'm literally walking out the door right now!\" (Still deciding on shoes.)",
      trophyStyle: "hourglass"
    },
    {
      id: "award-3",
      number: "03",
      title: "Professional Reply Delayer.",
      description: "Online 24/7. Replies in three to five business centuries.",
      badge: "GHOSTING HALL OF FAME",
      speech: "\"OMG I'm so sorry I didn't see this!!\" (Sent 11 days after reading the preview.)",
      trophyStyle: "bubble"
    },
    {
      id: "award-4",
      number: "04",
      title: "Best Actress in a Minor Crisis.",
      description: "A tiny inconvenience deserves an Oscar-winning performance.",
      badge: "DRAMA ACADEMY",
      speech: "\"My life is officially ruined\" — over dropping one fry.",
      trophyStyle: "star"
    },
    {
      id: "award-5",
      number: "05",
      title: "Selective Memory Champion.",
      description: "Forgets important things but remembers random incidents from years ago.",
      badge: "ARCHIVES DIVISION",
      speech: "\"No idea where my notes are, anyway remember what you wore on October 14th four years ago?\"",
      trophyStyle: "brain"
    },
    {
      id: "award-6",
      number: "06",
      title: "Certified Main Character.",
      description: "Background music starts playing when she enters the classroom.",
      badge: "ICONIC ENERGY",
      speech: "\"Please hold your applause, yes I arrived three minutes after the bell.\"",
      trophyStyle: "spotlight"
    },
    {
      id: "award-7",
      number: "07",
      title: "Most Likely to Abandon Everything for a BTS Comeback.",
      description: "Priorities are priorities. ARMY business comes first.",
      badge: "BORAHAE PRIORITY",
      speech: "\"Assignments are temporary. BTS comeback teasers are eternal.\"",
      trophyStyle: "purpleheart"
    },
    {
      id: "award-8",
      number: "08",
      title: "Lifetime Achievement in Classroom Chaos.",
      description: "For making ordinary college days unnecessarily entertaining.",
      badge: "LEGENDARY CLASSMATE",
      speech: "\"Honestly, without me this class would just be notes and silence. You're welcome.\"",
      trophyStyle: "cup"
    }
  ],

  /**
   * THE MUSEUM OF VYGA — DEFAULT PLACEHOLDERS
   * Uses custom illustrated scrapbook art (never stock photos of strangers).
   * You can replace images directly in the browser via upload/drag-and-drop
   * or swap `imageUrl` here with local paths like "./assets/vyga-1.jpg".
   */
  photoMuseum: [
    {
      id: "exhibit-1",
      tag: "EXHIBIT #01",
      caption: "Evidence that she occasionally behaves normally.",
      illustrationType: "normal",
      rotation: -2
    },
    {
      id: "exhibit-2",
      tag: "EXHIBIT #02",
      caption: "Main character energy. Background character decisions.",
      illustrationType: "mainchar",
      rotation: 1.8
    },
    {
      id: "exhibit-3",
      tag: "EXHIBIT #03",
      caption: "An extremely rare moment of innocence.",
      illustrationType: "innocent",
      rotation: -1.4
    },
    {
      id: "exhibit-4",
      tag: "EXHIBIT #04",
      caption: "Exhibit A: The face of someone who definitely completed the assignment.",
      illustrationType: "assignment",
      rotation: 2.2
    },
    {
      id: "exhibit-5",
      tag: "EXHIBIT #05",
      caption: "Live footage of Vyga pretending she wasn't just listening to BTS.",
      illustrationType: "army",
      rotation: -1.6
    },
    {
      id: "exhibit-6",
      tag: "EXHIBIT #06",
      caption: "Drop a real photo of Vyga here to complete the museum archives!",
      illustrationType: "placeholder",
      rotation: 1.2
    }
  ],

  miniGames: {
    quizQuestions: [
      {
        question: "What is Vyga's natural habitat?",
        options: [
          {
            text: "A cozy bed wrapped in blankets scrolling while ignoring notifications",
            points: 20,
            feedback: "Correct! Peak comfort zone achieved. Do not disturb unless bearing snacks."
          },
          {
            text: "Front row of the library 3 hours before sunrise",
            points: 5,
            feedback: "Suspiciously optimistic! Let's be honest, Vyga prefers five more minutes."
          },
          {
            text: "Wherever good food and spontaneous drama coexist",
            points: 20,
            feedback: "100% accurate! Put snacks and tea in one room and she spawns instantly."
          },
          {
            text: "Waiting room for a BTS concert ticket queue",
            points: 20,
            feedback: "Iconic ARMY reflexes! Fingers warmed up and Wi-Fi prayers activated."
          }
        ]
      },
      {
        question: "How does she react to assignments?",
        options: [
          {
            text: "Stares at the deadline, overthinks, then suddenly finishes it with main-character adrenaline",
            points: 20,
            feedback: "Spot on! Panic-fueled brilliance is practically an Olympic sport."
          },
          {
            text: "Finishes it three weeks early with color-coded sticky notes",
            points: 5,
            feedback: "Wait, are we talking about the same Vyga?! Check your records."
          },
          {
            text: "Negotiates with the universe for an accidental deadline extension",
            points: 18,
            feedback: "Classic strategy. Manifesting 'sir postponed the submission' works occasionally."
          },
          {
            text: "Opens the doc, writes her name, rewards herself with a 2-hour break",
            points: 20,
            feedback: "Writing the title takes tremendous energy! A break is legally warranted."
          }
        ]
      },
      {
        question: "What happens when someone disturbs her?",
        options: [
          {
            text: "Oscar-worthy side-eye followed by a dramatic monologue",
            points: 20,
            feedback: "Direct hit! Prepare for a 3-minute theatrical performance."
          },
          {
            text: "Calmly smiles and politely pauses her chaos",
            points: 5,
            feedback: "Only if they brought cake. Otherwise, proceed with caution."
          },
          {
            text: "Enters Maintenance Mode and refuses to process the question",
            points: 18,
            feedback: "Error 404: Patience not found. Reboot with chocolate."
          },
          {
            text: "Remembers something annoying they said in 2021 as a counter-attack",
            points: 20,
            feedback: "Selective Memory Champion strikes again! Zero mercy."
          }
        ]
      },
      {
        question: "What is her biggest superpower?",
        options: [
          {
            text: "Turning tiny everyday incidents into blockbuster comedy episodes",
            points: 20,
            feedback: "Facts! Boring days literally stand no chance around Vyga."
          },
          {
            text: "Replying at lightspeed to every text message",
            points: 5,
            feedback: "Nice try! We all know replies travel via carrier pigeon."
          },
          {
            text: "Detecting a BTS reference from across a crowded noisy classroom",
            points: 20,
            feedback: "ARMY radar tuned to 1000% sensitivity!"
          },
          {
            text: "Making everyone around her smile even during stressful college weeks",
            points: 20,
            feedback: "Wholesome truth! Underneath the chaos, she brings genuine joy."
          }
        ]
      },
      {
        question: "What would she choose: sleep, food or BTS?",
        options: [
          {
            text: "All three simultaneously: napping with snacks while a BTS playlist runs",
            points: 20,
            feedback: "Genius answer! Why pick one when you can achieve ultimate harmony?"
          },
          {
            text: "BTS first, food second, sleep negotiated later",
            points: 20,
            feedback: "Certified ARMY behavior! Priorities strictly respected."
          },
          {
            text: "None — she chooses extra homework instead",
            points: 0,
            feedback: "BZZZT! Incorrect! Who wrote this option, a prankster?!"
          },
          {
            text: "Food right now, BTS immediately after, sleep for five more minutes",
            points: 18,
            feedback: "Balanced diet of carbs, purple happiness, and eternal snooze buttons."
          }
        ]
      }
    ],
    mysteryRiddles: [
      {
        id: "mystery-1",
        title: "CASE #01: THE DISAPPEARING ACT",
        clues: [
          "Clue 1: This mysterious phenomenon happens right after someone sends an urgent question in the chat.",
          "Clue 2: The person is visibly 'Online', yet zero typing bubbles appear for hours.",
          "Clue 3: Two words describing how fast Vyga answers texts (starts with R... S...)."
        ],
        acceptedAnswers: ["reply speed", "slow reply", "late reply", "ghosting", "reply", "texting"],
        displayAnswer: "Reply Speed (or Late Reply!)",
        quickChoices: ["Reply Speed", "Homework", "Alarm Clock"],
        wrongMessages: [
          "Not quite detective! Check how long it takes her to respond to a simple 'hi'.",
          "Cold trail! Think about unread notifications piling up."
        ],
        solvedNote: "Solved! Three to five business centuries remain the official record."
      },
      {
        id: "mystery-2",
        title: "CASE #02: THE PURPLE PRIORITY",
        clues: [
          "Clue 1: Seven icons, endless purple hearts, and zero hesitation to drop everything for a comeback.",
          "Clue 2: The global fandom Vyga proudly represents.",
          "Clue 3: Three letters + four letters — 'BTS ____' (or the group name itself!)."
        ],
        acceptedAnswers: ["bts", "army", "bts army", "borahae", "bangtan"],
        displayAnswer: "BTS / ARMY!",
        quickChoices: ["BTS ARMY", "Coffee", "Math Class"],
        wrongMessages: [
          "Wrong universe! Hint: Purple hearts and 'Borahae' are everywhere.",
          "Nope! Think of seven legends and a purple ocean."
        ],
        solvedNote: "Solved! Never underestimate ARMY loyalty."
      },
      {
        id: "mystery-3",
        title: "CASE #03: THE ETERNAL LIE",
        clues: [
          "Clue 1: Spoken passionately when Vyga is supposed to leave the house or wake up.",
          "Clue 2: Never equals 300 actual seconds.",
          "Clue 3: 'Just ___ ____ _______!' (3 words)"
        ],
        acceptedAnswers: ["five more minutes", "5 more minutes", "five minutes", "5 minutes"],
        displayAnswer: "Five More Minutes!",
        quickChoices: ["Five More Minutes", "Good Morning", "I Am Ready"],
        wrongMessages: [
          "Almost! Every sleepy person says this phrase right after hitting snooze.",
          "Try again! Hint: A number between 4 and 6 + 'more minutes'."
        ],
        solvedNote: "Solved! Scientists confirm '5 minutes' translates to roughly 42 minutes."
      }
    ],
    mysteryReward:
      "🕵️‍♀️ CASE CLOSED! Official Certified Vyga Detective Badge Unlocked — You know her chaos way too well, and honestly? That makes you a top-tier friend. 💜🎀"
  },

  btsZone: {
    title: "VYGA'S PURPLE UNIVERSE",
    subtitle: "Because ordinary birthday celebrations are not enough for an ARMY.",
    borahaeButtonLabel: "PRESS FOR PURPLE HAPPINESS 💜",
    borahaeDisplayMessage:
      "A little purple happiness for our favourite ARMY. Borahae, Vyga! 💜",
    armyAward: {
      badge: "BTS • ARMY SPECIAL CITATION",
      title: "OFFICIAL ARMY MEMBER OF THE YEAR",
      description:
        "For maintaining loyalty through every comeback, every concert-ticket struggle and every BTS-related emotional event."
    },
    secretSurprise: {
      prompt: "Tap all 7 Purple Stars (OT7) to unlock the hidden ARMY wish ✨",
      message:
        "May your life be filled with the same happiness that your favourite BTS songs bring you. Keep shining, keep smiling and keep being you. Borahae! 💜"
    },
    playlistName: "Vyga's Birthday Purple Universe Playlist 💜",
    songs: [
      {
        title: "Mikrokosmos",
        album: "Map of the Soul: Persona",
        vibe: "Starlight & late-night comfort",
        youtubeUrl: "https://www.youtube.com/results?search_query=BTS+Mikrokosmos+official",
        spotifyUrl: "https://open.spotify.com/search/BTS%20Mikrokosmos"
      },
      {
        title: "Magic Shop",
        album: "Love Yourself: Tear",
        vibe: "Safe space & warm purple glow",
        youtubeUrl: "https://www.youtube.com/results?search_query=BTS+Magic+Shop+official",
        spotifyUrl: "https://open.spotify.com/search/BTS%20Magic%20Shop"
      },
      {
        title: "Dynamite",
        album: "BE",
        vibe: "Instant birthday dance floor energy",
        youtubeUrl: "https://www.youtube.com/watch?v=gdZLi9oWNZg",
        spotifyUrl: "https://open.spotify.com/search/BTS%20Dynamite"
      },
      {
        title: "Spring Day",
        album: "You Never Walk Alone",
        vibe: "Timeless queen & nostalgic comfort",
        youtubeUrl: "https://www.youtube.com/watch?v=xEeFrLSkMm8",
        spotifyUrl: "https://open.spotify.com/search/BTS%20Spring%20Day"
      },
      {
        title: "Boy With Luv (feat. Halsey)",
        album: "Map of the Soul: Persona",
        vibe: "Pastel pink meets BTS purple perfection",
        youtubeUrl: "https://www.youtube.com/watch?v=XsX3ATc3FbA",
        spotifyUrl: "https://open.spotify.com/search/BTS%20Boy%20With%20Luv"
      },
      {
        title: "Butter",
        album: "Butter",
        vibe: "Smooth like butter, iconic like Vyga",
        youtubeUrl: "https://www.youtube.com/watch?v=WMweEpGlu_U",
        spotifyUrl: "https://open.spotify.com/search/BTS%20Butter"
      }
    ]
  },

  music: {
    defaultExternalLabel: "Open Official BTS on Spotify 💜",
    defaultExternalUrl: "https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX",
    customPersonalAudioHint: "Paste any YouTube / Spotify link to save as your party shortcut"
  },

  birthdayLetter: {
    salutation: "Dear Vygaaaa! 💜🎀",
    opening: "Happiest Birthdayyyyy! 🥳",
    paragraphs: [
      "Well, congratulations! You've successfully survived another year of assignments, exams, random classroom chaos and whatever goes on inside that beautiful little brain of yours. 😂",
      "I hope your special day is filled with happiness, laughter, good food, amazing memories and, of course, plenty of BTS!",
      "May your day be as iconic as a BTS comeback and your happiness last longer than an ARMY waiting for the next announcement. 💜",
      "Keep smiling, keep being your wonderfully weird self, and never stop being the person who makes ordinary days a little more fun.",
      "I hope you achieve everything you're working towards and get countless reasons to be happy."
    ],
    listHeading: "May your life have:",
    listItems: [
      "More happiness than a BTS concert.",
      "More luck than getting concert tickets.",
      "More beautiful moments than your favourite BTS songs.",
      "And absolutely zero boring days!"
    ],
    closingParagraphs: [
      "And remember: getting older is compulsory, but don't worry... your level of maturity is still under development. 😭😂",
      "Have an amazing birthday, Vyga!",
      "Stay happy, stay healthy, keep shining and enjoy every little moment.",
      "BORAHAE! 💜"
    ],
    signOff: "With lots of birthday wishes,",
    signature: "Your fellow classroom survivor! 🎀"
  },

  finalSurprise: {
    buttonLabel: "ONE LAST THING FOR YOU 💗",
    heading: "HAPPY BIRTHDAY, VYGA!",
    lines: [
      "Stay happy, stay weird, keep smiling and never stop being iconic.",
      "A little chaos, a lot of laughter and endless purple happiness."
    ],
    signOff: "BORAHAE! 💜🎀"
  }
};
