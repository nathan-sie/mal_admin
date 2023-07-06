import dayjs from 'dayjs';

export function localGet (key) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (error) {
    return value
  }
}

export function localSet (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove (key) {
  window.localStorage.removeItem(key)
}

export const useCharacteristicMap = () => {
  return new Map([
    [ 1, '普通商品' ],
    [ 2, '充值商品' ],
    [ 3, '增值商品' ]
  ])
}

export const getPrice = (characteristic, standardPrice, createDate, deadline) => {
  if (characteristic == 1 && deadline != null) {
    const now = dayjs()
    const targetDate = dayjs(deadline)
    const diff = now.diff(targetDate, 'day')
    if (Math.abs(diff) < 3) {
      return standardPrice / 2
    } else {
      return standardPrice
    }
  } else if (characteristic == 3 && createDate != null) {
    const now = dayjs()
    const targetDate = dayjs(createDate)
    const diff = now.diff(targetDate, 'year')
    return Math.round(Math.pow(1.05, diff)*standardPrice)
  } else {
    return standardPrice
  }
}