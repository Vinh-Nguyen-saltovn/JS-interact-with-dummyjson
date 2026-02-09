import { delay, filterUsersCase, hideLoading, showLoading } from "./common.js";

let allUsers = [];
let mode = "all"; // "all" | "search"
let keyword = ""; // keyword search
let sortBy = ""; // field sort
let order = "asc"; // asc | desc
let limit = 10;
let skip = 0;

// lấy accessToken khi login
const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");

// nếu chưa login, quay lại trang login
if (!accessToken) window.location.href = "../index.html";
else {
  fetchLoginUser();
  // fetch render list khi vừa vào page
  fetchAllUsers();
}

// nút đăng xuất
const logoutBtn = document.getElementById("btn-logout");

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "../index.html";
});

// get info user đang login để show lên header
function renderHeader(user) {
  const userImage = document.getElementById("user-image");
  const userName = document.getElementById("user-name");
  userImage.src = user.image;
  userImage.alt = user.username;

  userName.textContent = `${user.firstName} ${user.lastName}`;
}

// fetch api để lấy thông tin user đang đăng nhập
async function fetchLoginUser() {
  try {
    const res = await fetch("https://dummyjson.com/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Auth failed");
    }
    const data = await res.json();
    renderHeader(data);
  } catch (error) {
    console.error("Auth error :", error);
    localStorage.removeItem("accessToken");
    window.location.href = "../index.html";
  }
}

let totalUsers = 0;

// render all users info
function renderUsersInfo(users) {
  const tbody = document.getElementById("user-table-body");
  // clear data cũ
  tbody.innerHTML = "";

  users.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    <td>${user.age}</td>
    <td>${user.gender}</td>
    <td>${user.birthDate}</td>
    <td><a href='../html/edit.html?id=${user.id}'><button>Update</button></a></td>
    `;
    tbody.appendChild(tr);
  });
}

const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

// hàm update pagination theo từng trang
function updatePaginationUI() {
  // làm tròn lên số nguyên lớn nhất
  const currentPage = Math.floor(skip / limit) + 1;
  // làm tròn xuống số nguyên nhỏ nhất
  const totalPages = Math.ceil(totalUsers / limit);

  pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
  // ẩn nút prev khi skip = 0
  prevBtn.disabled = skip === 0;
  // ẩn nút next khi skip + limit tổng số trang đang có
  nextBtn.disabled = skip + limit >= totalUsers;
}

// xử lý event nút prev
prevBtn.addEventListener("click", () => {
  if (skip >= limit) {
    skip -= limit;
    fetchAllUsers();
  }
});

// xử lý event nút next
nextBtn.addEventListener("click", () => {
  if (skip + limit < totalUsers) {
    skip += limit;
    fetchAllUsers();
  }
});

// fetch get all users
async function fetchAllUsers() {
  let baseUrl = "https://dummyjson.com/users";

  const params = new URLSearchParams({
    limit: limit,
    skip: skip,
  });

  if (mode === "search" && !keyword) mode = "all";

  // nếu là search, thêm params để search
  if (mode === "search" && keyword) {
    baseUrl = "https://dummyjson.com/users/search";
    params.append("q", keyword);
  }

  // nếu là sort, append value
  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("order", order);
  }

  try {
    showLoading();
    await delay(500);

    const url = `${baseUrl}?${params.toString()}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Fetch users failed");

    const data = await res.json();

    allUsers = data.users;
    if (mode === "search" && keyword) {
      allUsers = filterUsersCase(allUsers, keyword);
      totalUsers = allUsers.length;
    } else {
      totalUsers = data.total;
    }
    renderUsersInfo(allUsers);
    updatePaginationUI();
  } catch (error) {
    console.error("Lỗi render user list ", error);
  } finally {
    hideLoading();
  }
}

// add event nút search
document.getElementById("btn-search").addEventListener("click", () => {
  const form = document.getElementById("filter-form");
  keyword = form.search.value.trim();
  mode = keyword ? "search" : "all";
  skip = 0;
  sortBy = "";
  order = "asc";
  fetchAllUsers();
});

// add event nút sort
document.getElementById("btn-sort").addEventListener("click", () => {
  const form = document.getElementById("filter-form");
  sortBy = form.sortBy.value;
  order = form.order.value;
  skip = 0;
  fetchAllUsers();
});
