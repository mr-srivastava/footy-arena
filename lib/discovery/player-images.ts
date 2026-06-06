const FOTMOB_PLAYER_IDS: Record<string, string> = {
  "jude-bellingham": "1077894",
  "jamal-musiala": "1156141",
  "lamine-yamal": "1467236",
  "florian-wirtz": "1152455",
  endrick: "1406729",
  "lionel-messi": "30981",
  "julian-alvarez": "974753",
  "enzo-fernandez": "1137705",
  "alexis-mac-allister": "831489",
  "kylian-mbappe": "701154",
  "eduardo-camavinga": "1015185",
  "aurelien-tchouameni": "914458",
  "william-saliba": "955406",
  "vinicius-junior": "846033",
  rodrygo: "895362",
  "bruno-guimaraes": "850354",
  "bukayo-saka": "961995",
  "phil-foden": "815006",
  "harry-kane": "194165",
  "kai-havertz": "749736",
  "antonio-rudiger": "276738",
  pedri: "1083323",
  "nico-williams": "1202110",
  rodri: "675088",
  "bruno-fernandes": "422685",
  "rafael-leao": "848844",
  "joao-neves": "1342757",
  "bernardo-silva": "488139",
  "achraf-hakimi": "770881",
  "sofyan-amrabat": "593116",
  "brahim-diaz": "750027",
  "luka-modric": "31097",
  "josko-gvardiol": "1070712",
  "mateo-kovacic": "239219",
  "takefusa-kubo": "848289",
  "kaoru-mitoma": "862608",
  "wataru-endo": "202643",
  "virgil-van-dijk": "209405",
  "xavi-simons": "1173787",
  "cody-gakpo": "806552",
  "cristiano-ronaldo": "30893",
  "khvicha-kvaratskhelia": "900433",
};

function getFotmobPlayerImageUrl(fotmobId: string): string {
  return `https://images.fotmob.com/image_resources/playerimages/${fotmobId}.png`;
}

export function getPlayerImage(slug: string): string | undefined {
  const fotmobId = FOTMOB_PLAYER_IDS[slug];
  return fotmobId ? getFotmobPlayerImageUrl(fotmobId) : undefined;
}
