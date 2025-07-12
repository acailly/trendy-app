// Not 100% unique but close enough
const initialValue = `id${Date.now().toString(32)}${Math.floor(Math.random() * 1000)}`

let counter = 0

// 100% unique if there is one instance of this function
// not unique if there is several instances that share the same initialValue (unlikely but possible)
export const uniqueId = () => `${initialValue}${counter++}`
