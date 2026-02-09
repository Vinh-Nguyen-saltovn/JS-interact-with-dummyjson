import { showError, clearErrors, isValidEmail } from './common.js'

const form = document.getElementById('user-form')
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

    console.log('User form valid')
  })
}
