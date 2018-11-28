const pad = (value, size) => {
  var s = String(value);
  while (s.length < (size || 2)) {
    s = "0" + s;
  }
  return s;
};

export default () => {
  const now = new Date();

  const parts = [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  ];

  return parts.map(part => pad(part, 2)).join("-");
};
