let container = null

function ensureContainer() {
  if (!container) {
    container = document.createElement('div')
    container.className = 'toast-container'
    document.body.appendChild(container)
  }
  return container
}

export function showToast(message, type = 'success', duration = 2500) {
  const el = document.createElement('div')
  el.className = `toast toast-${type}`
  el.textContent = message

  const c = ensureContainer()
  c.appendChild(el)

  const timer = setTimeout(() => remove(el), duration)

  el.addEventListener('click', () => {
    clearTimeout(timer)
    remove(el)
  })
}

function remove(el) {
  el.classList.add('toast-leaving')
  el.addEventListener('animationend', () => {
    el.remove()
    if (container && container.children.length === 0) {
      container.remove()
      container = null
    }
  })
}
