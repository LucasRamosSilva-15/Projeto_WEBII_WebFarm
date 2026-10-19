export function showToast(message, type = 'info', title = '') {
  if (typeof window === 'undefined') return;
  const event = new CustomEvent('webfarm:toast', {
    detail: {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      message,
      type,
      title
    }
  });
  window.dispatchEvent(event);
}
