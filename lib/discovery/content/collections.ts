import type { DiscoveryCollection } from '../types';

export const DISCOVERY_COLLECTIONS: DiscoveryCollection[] = [
  {
    slug: 'future-ballon-dor',
    title: "Future Ballon d'Or Contenders",
    description:
      'The young superstars who could define the next decade of world football.',
    playerSlugs: [
      'jude-bellingham',
      'jamal-musiala',
      'lamine-yamal',
      'vinicius-junior',
      'florian-wirtz',
    ],
  },
  {
    slug: 'midfield-maestros',
    title: 'Midfield Maestros',
    description:
      'The conductors who control tempo, space, and the flow of every match.',
    playerSlugs: [
      'rodri',
      'luka-modric',
      'pedri',
      'bruno-fernandes',
      'alexis-mac-allister',
    ],
  },
  {
    slug: 'chaos-creators',
    title: 'Chaos Creators',
    description:
      'Unpredictable attackers who thrive in 1v1 situations and break defensive lines.',
    playerSlugs: [
      'kylian-mbappe',
      'vinicius-junior',
      'rafael-leao',
      'kaoru-mitoma',
    ],
  },
  {
    slug: 'veteran-legends',
    title: 'Veteran Legends',
    description:
      'Icons in the twilight of legendary careers - one last chance at glory.',
    playerSlugs: ['lionel-messi', 'luka-modric', 'cristiano-ronaldo'],
  },
];
