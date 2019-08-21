export function hour24To12(hour) {
  if (hour.toUpperCase() === '24') {
    return 0;
  }
  const hourAsNumber = Number.parseInt(hour);

  if (hourAsNumber > 12) {
    return hourAsNumber - 12;
  }
  return hour;
}
