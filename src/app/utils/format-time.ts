export const formatTime = (isoString: string): string => {
  const date = new Date(isoString); // Chuyển chuỗi ISO 8601 thành đối tượng Date
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Để hiển thị giờ theo định dạng 24h
  });
};
