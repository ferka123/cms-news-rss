export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;
  return `${hours} hours ${restMinutes ? restMinutes + " minutes" : ""}`.trim();
};
