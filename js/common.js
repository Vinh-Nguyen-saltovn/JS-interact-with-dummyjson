// hàm common showError để show lỗi khi input/select ko vượt qua validate
export function showError(field, message) {
  const errorEl = field.parentElement.querySelector('.error')
  if (errorEl) {
    errorEl.textContent = message
  }
}
// hàm common clearErrors để xóa lỗi cũ mỗi khi click lại event ( nếu hợp lệ )
export function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => {
    el.textContent = ''
  })
}

// hàm common isValidEmail để check validate mail
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// hàm ẩn hiện loading
const loadingEl = document.getElementById('users-loading')

export function showLoading() {
  loadingEl.classList.remove('hidden')
  document.body.classList.add('loading-active')
}

export function hideLoading() {
  loadingEl.classList.add('hidden')
  document.body.classList.remove('loading-active')
}

// hàm common để search đúng lower|upper case
export function filterUsersCase(users, keyword) {
  if (!keyword) return users
  return users.filter(
    u =>
      u.firstName.includes(keyword) ||
      u.lastName.includes(keyword) ||
      u.email.includes(keyword),
  )
}

// hiển thị toast khi thao tác
export function showToast({ message, duration = 4000, type = 'success' }) {
  const bgColor = type === 'success' ? '#22c55e' : '#ef4444'
  Toastify({
    text: message,
    duration,
    gravity: 'top',
    position: 'right',
    escapeMarkup: false,
    backgroundColor: bgColor,
  }).showToast()
}

// hàm logic logout
export function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.href = '../index.html'
}
