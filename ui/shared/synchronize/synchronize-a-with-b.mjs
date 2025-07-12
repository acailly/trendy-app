/**
 * @template A
 * @template B
 * @param {() => A} getAValue
 * @param {(value: B) => unknown} setAValueFromB
 * @param {() => B} getBValue
 * @param {(value: A) => unknown} setBValueFromA
 * @param {(setBValueFromA: (value: A) => unknown) => unknown} listenAChange
 * @param {(setAValueFromB: (value: B) => unknown) => unknown} listenBChange
 */
export const synchronizeAWithB = (
  getAValue,
  setAValueFromB,
  getBValue,
  setBValueFromA,
  listenAChange,
  listenBChange
) => {
  // Initialization
  const initialAValue = getAValue()
  if (initialAValue) {
    setBValueFromA(initialAValue)
  } else {
    setAValueFromB(getBValue())
  }

  // A => B
  listenAChange(setBValueFromA)

  // B => A
  listenBChange(setAValueFromB)
}
