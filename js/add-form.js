import {
  showError,
  clearErrors,
  isValidEmail,
  showLoading,
  hideLoading,
  showToast,
} from './common.js'

const form = document.getElementById('user-form-add')
if (form) {
  const { firstName, lastName, email, age, gender } = form.elements

  form.addEventListener('submit', e => {
    e.preventDefault()

    clearErrors(form)
    let isValid = true

    // First name
    if (!firstName.value.trim()) {
      showError(firstName, 'First name is required')
      isValid = false
    }

    // Last name
    if (!lastName.value.trim()) {
      showError(lastName, 'Last name is required')
      isValid = false
    }

    // Email
    if (!email.value.trim()) {
      showError(email, 'Email is required')
      isValid = false
    } else if (!isValidEmail(form.email.value)) {
      showError(email, 'Email is invalid')
      isValid = false
    }

    // Age
    if (!Number(age.value)) {
      showError(age, 'Age is required')
      isValid = false
    } else if (Number(age.value) < 1 || Number(age.value) > 120) {
      showError(age, 'Age must be between 1 and 120')
      isValid = false
    }

    // Gender
    if (!gender.value) {
      showError(gender, 'Gender is required')
      isValid = false
    }

    if (!isValid) return

    const payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      age: Number(age.value),
      gender: gender.value,
    }

    addNewUser(payload)
  })
}

async function addNewUser(payload) {
  try {
    showLoading()
    const res = await fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Add new failed')
    }
    const data = await res.json()
    showToast({
      message: `
    <strong>Add user thành công</strong><br/>
    <b>ID:</b> ${data.id}<br/>
    <b>First name:</b> ${data.firstName}<br/>
    <b>Last name:</b> ${data.lastName}<br/>
    <b>Email:</b> ${data.email}<br/>
    <b>Age:</b> ${data.age}<br/>
    <b>Gender:</b> ${data.gender}
  `,
      duration: 5000,
      type: 'success',
    })
  } catch (error) {
    console.error('Add new error:', error.message)
    Toastify({
      text: error.message,
      duration: 4000,
      gravity: 'top',
      position: 'right',
      backgroundColor: '#ef4444',
    }).showToast()
  } finally {
    hideLoading()
  }
}
