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
