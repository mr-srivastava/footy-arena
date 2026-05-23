export type HostNation = {
  country: string;
  flag: string;
  cities: number;
  accent: string;
  detail: string;
};

export type HostCityVenue = {
  city: string;
  country: string;
  venue: string;
};

export const HOST_NATIONS: HostNation[] = [
  {
    country: "United States",
    flag: "🇺🇸",
    cities: 11,
    accent: "from-red via-red/40",
    detail: "MetLife Stadium hosts the Final on July 19",
  },
  {
    country: "Mexico",
    flag: "🇲🇽",
    cities: 3,
    accent: "from-teal via-teal/40",
    detail: "Estadio Azteca opens the tournament on June 11",
  },
  {
    country: "Canada",
    flag: "🇨🇦",
    cities: 2,
    accent: "from-pitch-bright via-pitch/40",
    detail: "Toronto & Vancouver welcome the world",
  },
];

export const HOST_CITY_VENUES: HostCityVenue[] = [
  { city: "New York / New Jersey", country: "USA", venue: "MetLife Stadium" },
  { city: "Los Angeles", country: "USA", venue: "SoFi Stadium" },
  { city: "Dallas", country: "USA", venue: "AT&T Stadium" },
  { city: "Miami", country: "USA", venue: "Hard Rock Stadium" },
  { city: "Atlanta", country: "USA", venue: "Mercedes-Benz Stadium" },
  { city: "Houston", country: "USA", venue: "NRG Stadium" },
  { city: "Philadelphia", country: "USA", venue: "Lincoln Financial Field" },
  { city: "Seattle", country: "USA", venue: "Lumen Field" },
  { city: "San Francisco", country: "USA", venue: "Levi's Stadium" },
  { city: "Boston", country: "USA", venue: "Gillette Stadium" },
  { city: "Kansas City", country: "USA", venue: "Arrowhead Stadium" },
  { city: "Mexico City", country: "MEX", venue: "Estadio Azteca" },
  { city: "Guadalajara", country: "MEX", venue: "Estadio Akron" },
  { city: "Monterrey", country: "MEX", venue: "Estadio BBVA" },
  { city: "Toronto", country: "CAN", venue: "BMO Field" },
  { city: "Vancouver", country: "CAN", venue: "BC Place" },
];
