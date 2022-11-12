export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month}/${day}`;
};

export const convertToHalf = (str) => {
  return str.replace(/[！-～]/g, (s) => (
    String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  )).replace(/　/g, " ");
};