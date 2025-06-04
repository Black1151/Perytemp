// utils.js

export const truncateText = (title: string, maxLength: number = 4) => {
  return title.length > maxLength
    ? `${title.substring(0, maxLength)}...`
    : title;
};
