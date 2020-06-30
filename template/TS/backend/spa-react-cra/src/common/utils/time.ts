export const getTime = () => new Date().getTime();

export const transferTime2Corn = (time: string) => {
  const [h, m, s] = time.split(':');
  return `${Number(s)} ${Number(m)} ${Number(h)} * * ?`;
};

export const transferCorn2Time = (corn: string) => {
  const [s, m, h] = corn.split(' ');
  return `${h}:${m}:${s}`;
};
