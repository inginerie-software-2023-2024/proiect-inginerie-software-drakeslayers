function isToday(date: Date): boolean {
  const currentDate = new Date();
  return (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  );
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

export function formatInstagramTimestamp(timestamp: string): string {
  const currentDate = new Date();
  const postDate = new Date(timestamp);
  const timeDiffInSeconds = Math.floor((currentDate.getTime() - postDate.getTime()) / 1000); // Time difference in seconds

  if (timeDiffInSeconds === 0) {
    return 'Just now'; // Just now
  } else if (timeDiffInSeconds < 60) {
    return `${timeDiffInSeconds}s ago`; // Less than a minute ago
  } else if (timeDiffInSeconds < 3600) {
    const minutes = Math.floor(timeDiffInSeconds / 60);
    return `${minutes}m ago`; // Less than an hour ago
  } else if (timeDiffInSeconds < 86400) {
    const hours = Math.floor(timeDiffInSeconds / 3600);
    return `${hours}h ago`; // Less than a day ago
  } else if (timeDiffInSeconds < 2592000) {
    const days = Math.floor(timeDiffInSeconds / 86400);
    return `${days}d ago`; // Less than a month ago (30 days)
  } else if (timeDiffInSeconds < 31536000) {
    const months = Math.floor(timeDiffInSeconds / 2592000);
    return `${months}mo ago`; // Less than a year ago (12 months)
  } else {
    const years = Math.floor(timeDiffInSeconds / 31536000);
    return `${years}y ago`; // More than a year ago
  }
}

export function formatTimestampHour(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function formatTimestampDate(timestamp: string): string {
  const date = new Date(timestamp);
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${day}.${month}.${year}`;
}

export function formatTimestampWhatsapp(timestamp: string): string {
  const date = new Date(timestamp);

  // if date is today, return only hour
  const currentDate = new Date();
  if (isToday(date)) {
    return formatTimestampHour(timestamp);
  }

  // else return only date
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return formatTimestampDate(timestamp);
}
