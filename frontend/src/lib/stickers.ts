export type StickerStatus = "missing" | "owned" | "duplicate";

export type StickerCategory = "special" | "country" | "cocacola";

export interface Sticker {
  code: string;
  category: StickerCategory;
  group: string; // country code or "FWC" or "CC"
  groupName: string;
  number: number; // 0 for "00"
}

export interface Team {
  code: string;
  name: string;
  flag: string;
}

export const TEAMS: Team[] = [
  { code: "MEX", name: "México", flag: "🇲🇽" },
  { code: "RSA", name: "África do Sul", flag: "🇿🇦" },
  { code: "KOR", name: "Coreia do Sul", flag: "🇰🇷" },
  { code: "CZE", name: "República Tcheca", flag: "🇨🇿" },
  { code: "CAN", name: "Canadá", flag: "🇨🇦" },
  { code: "BIH", name: "Bósnia e Herzegovina", flag: "🇧🇦" },
  { code: "QAT", name: "Catar", flag: "🇶🇦" },
  { code: "SUI", name: "Suíça", flag: "🇨🇭" },
  { code: "BRA", name: "Brasil", flag: "🇧🇷" },
  { code: "MAR", name: "Marrocos", flag: "🇲🇦" },
  { code: "HAI", name: "Haiti", flag: "🇭🇹" },
  { code: "SCO", name: "Escócia", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" },
  { code: "USA", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "PAR", name: "Paraguai", flag: "🇵🇾" },
  { code: "AUS", name: "Austrália", flag: "🇦🇺" },
  { code: "TUR", name: "Turquia", flag: "🇹🇷" },
  { code: "GER", name: "Alemanha", flag: "🇩🇪" },
  { code: "CUW", name: "Curaçao", flag: "🇨🇼" },
  { code: "CIV", name: "Costa do Marfim", flag: "🇨🇮" },
  { code: "ECU", name: "Equador", flag: "🇪🇨" },
  { code: "NED", name: "Holanda", flag: "🇳🇱" },
  { code: "JPN", name: "Japão", flag: "🇯🇵" },
  { code: "SWE", name: "Suécia", flag: "🇸🇪" },
  { code: "TUN", name: "Tunísia", flag: "🇹🇳" },
  { code: "BEL", name: "Bélgica", flag: "🇧🇪" },
  { code: "EGY", name: "Egito", flag: "🇪🇬" },
  { code: "IRN", name: "Irã", flag: "🇮🇷" },
  { code: "NZL", name: "Nova Zelândia", flag: "🇳🇿" },
  { code: "ESP", name: "Espanha", flag: "🇪🇸" },
  { code: "CPV", name: "Cabo Verde", flag: "🇨🇻" },
  { code: "KSA", name: "Arábia Saudita", flag: "🇸🇦" },
  { code: "URU", name: "Uruguai", flag: "🇺🇾" },
  { code: "FRA", name: "França", flag: "🇫🇷" },
  { code: "SEN", name: "Senegal", flag: "🇸🇳" },
  { code: "IRQ", name: "Iraque", flag: "🇮🇶" },
  { code: "NOR", name: "Noruega", flag: "🇳🇴" },
  { code: "ARG", name: "Argentina", flag: "🇦🇷" },
  { code: "ALG", name: "Argélia", flag: "🇩🇿" },
  { code: "AUT", name: "Áustria", flag: "🇦🇹" },
  { code: "JOR", name: "Jordânia", flag: "🇯🇴" },
  { code: "POR", name: "Portugal", flag: "🇵🇹" },
  { code: "COD", name: "RD Congo", flag: "🇨🇩" },
  { code: "UZB", name: "Uzbequistão", flag: "🇺🇿" },
  { code: "COL", name: "Colômbia", flag: "🇨🇴" },
  { code: "ENG", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { code: "CRO", name: "Croácia", flag: "🇭🇷" },
  { code: "GHA", name: "Gana", flag: "🇬🇭" },
  { code: "PAN", name: "Panamá", flag: "🇵🇦" },
];

export function generateStickers(): Sticker[] {
  const list: Sticker[] = [];
  // Specials
  list.push({ code: "00", category: "special", group: "FWC", groupName: "Especial", number: 0 });
  for (let i = 1; i <= 8; i++) {
    list.push({
      code: `FWC${i}`,
      category: "special",
      group: "FWC",
      groupName: "FIFA World Cup",
      number: i,
    });
  }
  // Teams
  for (const t of TEAMS) {
    for (let i = 1; i <= 20; i++) {
      list.push({
        code: `${t.code}${i}`,
        category: "country",
        group: t.code,
        groupName: t.name,
        number: i,
      });
    }
  }
  // Coca-Cola
  for (let i = 1; i <= 14; i++) {
    list.push({
      code: `CC${i}`,
      category: "cocacola",
      group: "CC",
      groupName: "Coca-Cola",
      number: i,
    });
  }
  return list;
}

export const ALL_STICKERS = generateStickers();
