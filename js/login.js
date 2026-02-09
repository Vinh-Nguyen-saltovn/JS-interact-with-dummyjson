import {
  showError,
  clearErrors,
  showLoading,
  delay,
  hideLoading,
} from './common.js'

const form = document.getElementById('login-form')
if (form) {
  const { username, password } = form.elements

  form.addEventListener('submit', e => {
    e.preventDefault()

    clearErrors(form)

    let isValid = true

    // check validate userName
    if (!username.value.trim()) {
      // check username có rỗng hay ko
      showError(username, 'username is required')
      isValid = false
    } else if (username.value.length < 6) {
      // check length
      showError(username, 'username must have at least 6 characters')
      isValid = false
    }

    // check validate password
    if (!password.value.trim()) {
      // check password có rỗng hay ko
      showError(password, 'password is required')
      isValid = false
    } else if (password.value.length < 4) {
      // check length
      showError(password, 'password must have at least 4 characters')
      isValid = false
    }

    if (!isValid) return
    login()
  })

  let isSubmitting = false
  // fetch api
  async function login() {
    if (isSubmitting) return
    isSubmitting = true
    try {
      showLoading()
      await delay(500)
      const res = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || 'Login failed')
      }
      const data = await res.json()
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      window.location.href = './html/users.html'
    } catch (error) {
      console.error('lỗi khi login', error)
    } finally {
      hideLoading()
      isSubmitting = false
    }
  }
}
