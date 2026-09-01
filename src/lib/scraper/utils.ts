export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .trim();
}

export function extractDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;

  const cleaned = dateStr.trim();

  const isoMatch = cleaned.match(/\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return new Date(isoMatch[0]);

  const dmyMatch = cleaned.match(/(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);
  if (dmyMatch) {
    return new Date(`${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`);
  }

  const mdyMatch = cleaned.match(/(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/);
  if (mdyMatch) {
    const months: Record<string, string> = {
      enero: '01', febrero: '02', marzo: '03', abril: '04',
      mayo: '05', junio: '06', julio: '07', agosto: '08',
      septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12',
    };
    const monthNum = months[mdyMatch[2].toLowerCase()];
    if (monthNum) {
      return new Date(`${mdyMatch[3]}-${monthNum}-${mdyMatch[1].padStart(2, '0')}`);
    }
  }

  const parsed = new Date(cleaned);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

export function normalizeUrl(url: string, baseUrl: string): string {
  try {
    return new URL(url, baseUrl).href;
  } catch {
    return url;
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
