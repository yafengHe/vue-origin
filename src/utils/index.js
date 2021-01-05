/* eslint-disable import/prefer-default-export */
export function partial(fn, arg) {
  return () => fn(arg);
}

export function forEachValue(obj, fn) {
  Object.keys(obj).forEach((key) => fn(obj[key], key));
}
