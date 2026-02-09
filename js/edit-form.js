import {
  showError,
  clearErrors,
  isValidEmail,
  showLoading,
  hideLoading,
  showToast,
} from './common.js'

// lấy id từ url để biết user có id là gì
const params = new URLSearchParams(window.location.search)
const id = params.get('id')
console.log(id)

// nếu id ko hợp lệ, show toast và quay lại trang list
if (!id) {
  showToast({
    message: 'User không hợp lệ',
    type: 'error',
  })
  window.location.href = './users.html'
}

const form = document.getElementById('user-form-edit')
if (form) {
  const { firstName, lastName, email, age, gender } = form.elements
  loadUserDetail(id, { firstName, lastName, email, age, gender })

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

    UpdateUser(id, payload)
  })
}

// hàm get data user khi vào trang edit
async function loadUserDetail(id, fields) {
  const { firstName, lastName, email, age, gender } = fields
  try {
    showLoading()

    const res = await fetch(`https://dummyjson.com/users/${id}`)
    if (!res.ok) throw new Error('Fetch user failed')
    const data = await res.json()

    firstName.value = data.firstName ?? ''
    lastName.value = data.lastName ?? ''
    email.value = data.email ?? ''
    age.value = data.age ?? ''
    gender.value = data.gender ?? ''
  } catch (err) {
    console.error(err)
    alert('Không lấy được data')
  } finally {
    hideLoading()
  }
}

// hàm update user
async function UpdateUser(id, payload) {
  try {
    showLoading()
    const res = await fetch(`https://dummyjson.com/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Update failed')
    }
    const data = await res.json()
    showToast({
      message: `
    <strong>Update user thành công, data mới là : </strong><br/>
    <b>ID:</b> ${id}<br/>
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
    console.error('Update error:', error.message)
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

// add event xóa nút delete
const deleteBtn = document.getElementById('delete-btn')

deleteBtn.addEventListener('click', () => {
  const ok = confirm(`Bạn có chắc muốn xoá user có id = ${id} không?`)
  if (!ok) return

  deleteUser(id)
})

// hàm delete user
async function deleteUser(id) {
  try {
    showLoading()

    const res = await fetch(`https://dummyjson.com/users/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Delete failed')
    }
    localStorage.setItem(
      'toastMessage',
      `Delete user với id = ${id} thành công`,
    )
    window.location.href = './users.html'
  } catch (error) {
    console.error('Delete error:', error.message)
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
