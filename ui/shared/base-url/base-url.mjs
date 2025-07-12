/**
 * From https://stackoverflow.com/a/61839170
 *
 * @param {string} hostname
 * @returns
 */
function isLocalNetwork(hostname) {
  return (
    ['localhost', '127.0.0.1', '', '::1'].includes(hostname) ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.endsWith('.local')
  )
}

const prefix = isLocalNetwork(window.location.hostname) ? '/ui/' : '/trendy-app/ui/'
const baseURL = window.location.origin + prefix

export default baseURL
