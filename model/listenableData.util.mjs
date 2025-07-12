// THOUGHT: if being based on an event emitter blocks us from running on certain devices,
// consider using a simple homemade implementation

/**
 * @template T
 * @typedef {Object} MutableListenableDataEvent<T>
 * @property {T} previousValue
 * @property {T} currentValue
 */

/**
 * @template T
 * @typedef {Pick<MutableListenableData<T>, 'get' | 'onChange'>} ListenableData<T>
 */

/**
 * @template T
 */
export default class MutableListenableData {
  _eventTarget = new EventTarget()
  _eventType = '_'
  /** @type {T} */
  _value

  /**
   * @constructor
   * @param {T} initialValue
   */
  constructor(initialValue) {
    this._value = initialValue
  }

  /**
   * @returns {T} value
   */
  get = () => {
    return this._value
  }

  /**
   * Listen value changes
   *
   * @param {(payload: MutableListenableDataEvent<T>) => unknown} callback
   * @returns {Function} unsubscribe function
   */
  onChange = (callback) => {
    /** @type {Parameters<typeof this._eventTarget.addEventListener>[1]} */
    const eventListener = (event) => {
      if (this._isCustomEvent(event)) {
        /** @type {CustomEvent<MutableListenableDataEvent<T>>} */
        const customEvent = event
        callback(customEvent.detail)
      }
    }

    this._eventTarget.addEventListener(this._eventType, eventListener)

    return () => {
      this._eventTarget.removeEventListener(this._eventType, eventListener)
    }
  }

  /**
   *
   * @param {Event} event
   * @returns {event is CustomEvent<MutableListenableDataEvent<T>>}
   */
  _isCustomEvent = (event) => {
    return event && event.type === this._eventType && 'detail' in event
  }

  /**
   * Change the value
   *
   * @param {T} newValue
   */
  set = (newValue) => {
    const previousValue = this._value

    this._value = newValue

    const currentValue = this._value

    const event = new CustomEvent(this._eventType, {
      detail: {
        previousValue,
        currentValue,
      },
    })
    this._eventTarget.dispatchEvent(event)
  }

  /**
   * Return the data without setters
   *
   * @returns {ListenableData<T>}
   */
  asReadonly = () => {
    return { get: this.get, onChange: this.onChange }
  }
}
