import type { CatchUpTopic, HomepageModule } from '../types';

export const HOMEPAGE_MODULES: HomepageModule[] = [
  {
    slug: 'start-your-journey',
    title: 'Start Your Journey',
    cards: [
      {
        title: 'Lost Glories',
        description: 'Former giants navigating decline and comeback hope.',
        href: '/explore/lost-glories',
      },
      {
        title: 'Rising Underdogs',
        description:
          'Smaller nations rewriting expectations on the world stage.',
        href: '/explore/rising-underdogs',
      },
      {
        title: 'Next Generation',
        description:
          "Young stars redefining what's possible at the highest level.",
        href: '/explore/next-generation',
      },
      {
        title: 'Legends & Legacy',
        description: 'Icons in their final chapters chasing one last glory.',
        href: '/explore/legends-legacy',
      },
      {
        title: 'Football Cultures',
        description: 'How nations play - distinct identities and philosophies.',
        href: '/explore/tactical-identities',
      },
    ],
  },
  {
    slug: 'catch-me-up',
    title: 'Catch Me Up',
    cards: [
      {
        title: 'Football Since Messi & Ronaldo',
        description: 'How the GOAT era shaped modern football.',
        href: '/explore/catch-up/messi-ronaldo-era',
      },
      {
        title: 'The New Midfield Era',
        description: 'Why midfielders now control everything.',
        href: '/explore/catch-up/new-midfield-era',
      },
      {
        title: 'Why Smaller Nations Are Rising',
        description: 'Tactical evolution leveling the playing field.',
        href: '/explore/catch-up/smaller-nations-rising',
      },
      {
        title: 'How Football Tactics Evolved',
        description: 'From rigid formations to fluid, pressing systems.',
        href: '/explore/catch-up/tactics-evolved',
      },
    ],
  },
  {
    slug: 'nations-to-watch',
    title: 'Nations To Watch',
    cards: [
      {
        title: 'France',
        description: 'The deepest squad in world football.',
        href: '/teams/fra',
      },
      {
        title: 'Argentina',
        description: 'Defending champions with a new generation emerging.',
        href: '/teams/arg',
      },
      {
        title: 'Morocco',
        description: 'Relentless underdogs building on historic success.',
        href: '/teams/mar',
      },
      {
        title: 'Germany',
        description: 'A sleeping giant awakening with elite young creators.',
        href: '/teams/ger',
      },
      {
        title: 'Japan',
        description: 'Disciplined disruptors challenging the elite.',
        href: '/teams/jpn',
      },
    ],
  },
];

export const CATCH_UP_TOPICS: CatchUpTopic[] = [
  {
    slug: 'messi-ronaldo-era',
    title: 'Football Since Messi & Ronaldo',
    summary:
      'For nearly two decades, Lionel Messi and Cristiano Ronaldo defined football. Their rivalry pushed every standard higher - goals, consistency, and big-game mentality.',
    bullets: [
      'Club football became dominated by their teams - Barcelona, Real Madrid, and later PSG and Al-Nassr.',
      "International football finally saw both win major trophies - Argentina in 2021 and 2022, Portugal's Euro 2016.",
      "A new generation grew up watching them, learning skills and mentality that didn't exist before.",
      'This World Cup may be the last chapter of that era - making every moment count.',
    ],
  },
  {
    slug: 'new-midfield-era',
    title: 'The New Midfield Era',
    summary:
      'Modern football belongs to midfielders who do everything - press, progress, create, and score.',
    bullets: [
      'Players like Rodri, Bellingham, and Pedri control games without needing the spotlight.',
      'Tactical systems now build around midfield dominance rather than pure striker goals.',
      'The best teams press as a unit from the midfield, winning the ball high and attacking fast.',
      'Watch midfield battles - they often decide who controls the tempo of a match.',
    ],
  },
  {
    slug: 'smaller-nations-rising',
    title: 'Why Smaller Nations Are Rising',
    summary:
      "The gap between football's elite and the rest is shrinking - and tactical intelligence is the reason.",
    bullets: [
      "Morocco's 2022 semifinal run proved African teams can compete tactically with anyone.",
      "Japan's organized pressing and discipline regularly trouble European giants.",
      'Smaller nations invest in coaching, data, and player development pathways.',
      "Individual stars like Kvaratskhelia can elevate an entire nation's ceiling.",
    ],
  },
  {
    slug: 'tactics-evolved',
    title: 'How Football Tactics Evolved',
    summary:
      'Football has transformed from rigid formations to fluid, high-intensity systems where everyone attacks and defends.',
    bullets: [
      "Possession football (tiki-taka) dominated the 2010s - Spain's era of control.",
      'Pressing and transitions became the new standard - win the ball high, attack immediately.',
      'Full-backs became attackers, midfielders became goal threats, and goalkeepers became playmakers.',
      'The 2026 World Cup will showcase the most tactically diverse tournament ever.',
    ],
  },
];
