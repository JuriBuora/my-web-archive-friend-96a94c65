const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})/;

export function parsePostDate(dateString: string): Date | null {
  const match = dateString.match(DATE_PREFIX);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  // Use local noon to keep calendar dates stable across time zones and DST edges.
  return new Date(year, month - 1, day, 12);
}

export function formatPostDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions,
  locale = "en-US",
): string {
  const parsed = parsePostDate(dateString);
  return parsed ? parsed.toLocaleDateString(locale, options) : dateString;
}
