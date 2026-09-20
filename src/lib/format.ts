const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Warsaw',
});

// Daty z kolekcji są parsowane jako UTC, więc zawsze formatujemy z jawną strefą.
export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Europe/Warsaw',
});

// Dzień kalendarzowy YYYY-MM-DD w tej samej strefie, w której wyświetlamy daty (formatDate).
export function toDayKey(date: Date): string {
  return dayKeyFormatter.format(date);
}
