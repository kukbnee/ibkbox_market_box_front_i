const createKey = () => {
  const createKey = (window.crypto || window.msCrypto).getRandomValues(new Uint32Array(1))[0];
  return createKey;
}

// board Numbering
const getTotalNumberBoard = (total, page, record, index) => {
  let number = total - (page - 1) * record - index
  return number < 10 ? '0' + number : number
}

export { createKey, getTotalNumberBoard }
