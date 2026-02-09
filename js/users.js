import {
  filterUsersCase,
  hideLoading,
  logout,
  showLoading,
  showToast,
} from './common.js'

let allUsers = []
let mode = 'all' // "all" | "search"
let keyword = '' // keyword search
let sortBy = '' // field sort
let order = 'asc' // asc | desc
let limit = 10
let skip = 0
let totalUsers = 0

// lấy accessToken khi login
function getAccessToken() {
  return localStorage.getItem('accessToken')
}

// lấy refreshToken khi login
function getRefreshToken() {
  return localStorage.getItem('refreshToken')
}

// check đăng nhập và token khi vào trnag
async function initAuth() {
  const refreshToken = getRefreshToken()
  // không có refreshToken => chưa login
  if (!refreshToken) {
    logout()
    return
  }

  try {
    const res = await fetch('https://dummyjson.com/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) throw new Error('Refresh failed')

    const data = await res.json()

    // update access token mới
    localStorage.setItem('accessToken', data.accessToken)

    // nếu có refreshToken mới, ghi đè cái cũ
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken)
    }

    // auth OK → load data
    fetchLoginUser()
    fetchAllUsers()
  } catch (err) {
    console.error('Refresh token error:', err)
    logout()
  }
}

// đẩy params limit và skip lên url để biết đang ở trang nào
function pushPagingToURL() {
  const params = new URLSearchParams()
  params.set('limit', limit)
  params.set('skip', skip)

  const newUrl = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', newUrl)
}

// tạo params trên url để biết đang ở trang nào
function initPagingFromURL() {
  const params = new URLSearchParams(window.location.search)
  limit = Number(params.get('limit')) || limit
  skip = Number(params.get('skip')) || skip
}

// Load toast delete thành công sau khi redirect từ form edit
document.addEventListener('DOMContentLoaded', () => {
  const msg = localStorage.getItem('toastMessage')
  if (msg) {
    showToast({
      message: msg,
      type: 'success',
      duration: 4000,
    })
    localStorage.removeItem('toastMessage')
  }
})

// nút đăng xuất
const logoutBtn = document.getElementById('btn-logout')
logoutBtn.addEventListener('click', logout)

// get info user đang login để show lên header
function renderHeader(user) {
  const userImage = document.getElementById('user-image')
  const userName = document.getElementById('user-name')
  userImage.src = user.image
  userImage.alt = user.username

  userName.textContent = `${user.firstName} ${user.lastName}`
}

// fetch api để lấy thông tin user đang đăng nhập
async function fetchLoginUser() {
  try {
    const res = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Auth failed')
    }
    const data = await res.json()
    renderHeader(data)
  } catch (error) {
    console.error('Auth error :', error)
    logout()
  }
}

// render all users info
function renderUsersInfo(users) {
  const tbody = document.getElementById('user-table-body')
  // clear data cũ
  tbody.innerHTML = ''

  users.forEach(user => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    <td>${user.age}</td>
    <td>${user.gender}</td>
    <td>${user.birthDate}</td>
    <td><a href='../html/edit.html?id=${user.id}'><button>Update</button></a></td>
    `
    tbody.appendChild(tr)
  })
}

const prevBtn = document.getElementById('prev-page')
const nextBtn = document.getElementById('next-page')
const pageInfo = document.getElementById('page-info')

// hàm update pagination theo từng trang
function updatePaginationUI() {
  // làm tròn lên số nguyên lớn nhất
  const currentPage = Math.floor(skip / limit) + 1
  // làm tròn xuống số nguyên nhỏ nhất
  const totalPages = Math.ceil(totalUsers / limit)

  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`
  // ẩn nút prev khi skip = 0
  prevBtn.disabled = skip === 0
  // ẩn nút next khi skip + limit <= tổng số trang đang có
  nextBtn.disabled = skip + limit >= totalUsers
}

// xử lý event nút prev
prevBtn.addEventListener('click', () => {
  if (skip >= limit) {
    skip -= limit
    pushPagingToURL()
    updatePaginationUI()
    fetchAllUsers()
  }
})

// xử lý event nút next
nextBtn.addEventListener('click', () => {
  if (skip + limit < totalUsers) {
    skip += limit
    pushPagingToURL()
    updatePaginationUI()
    fetchAllUsers()
  }
})

// fetch get all users
async function fetchAllUsers() {
  let baseUrl = 'https://dummyjson.com/users'

  const params = new URLSearchParams({
    limit: limit,
    skip: skip,
  })

  // nếu ko phải search, fetch bình thường
  if (mode === 'search' && !keyword) mode = 'all'

  // nếu là search, thêm params để search
  if (mode === 'search' && keyword) {
    baseUrl = 'https://dummyjson.com/users/search'
    params.append('q', keyword)
  }

  // nếu là sort, append field sort và order
  if (sortBy) {
    params.append('sortBy', sortBy)
    params.append('order', order)
  }

  try {
    showLoading()
    const url = `${baseUrl}?${params.toString()}`
    const res = await fetch(url)

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Fetch users failed')
    }
    const data = await res.json()

    allUsers = data.users
    if (mode === 'search' && keyword) {
      allUsers = filterUsersCase(allUsers, keyword)
      totalUsers = allUsers.length
    } else {
      totalUsers = data.total
    }
    renderUsersInfo(allUsers)
    updatePaginationUI()
  } catch (error) {
    console.error('Lỗi render user list ', error)
  } finally {
    hideLoading()
  }
}

// add event nút search
document.getElementById('btn-search').addEventListener('click', () => {
  const form = document.getElementById('filter-form')
  keyword = form.search.value.trim()
  mode = keyword ? 'search' : 'all'
  skip = 0
  sortBy = ''
  order = 'asc'
  fetchAllUsers()
})

// add event nút sort
document.getElementById('btn-sort').addEventListener('click', () => {
  const form = document.getElementById('filter-form')
  sortBy = form.sortBy.value
  order = form.order.value
  skip = 0
  fetchAllUsers()
})

initPagingFromURL()
initAuth()
