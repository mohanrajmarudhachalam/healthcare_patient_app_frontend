import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';
//const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://healthcare-backend-3yc2.onrender.com';
export const API = `${BACKEND_URL}/api`;

const PHONE_KEY = 'aevum.phone';
const NAME_KEY = 'aevum.name';
const ADDR_KEY = 'aevum.address';
const ADMIN_KEY = 'aevum.admin_token';

export const getStoredPhone = () => localStorage.getItem(PHONE_KEY) || '';
export const getStoredName = () => localStorage.getItem(NAME_KEY) || '';
export const getStoredAddress = () => localStorage.getItem(ADDR_KEY) || '';
export const setIdentity = ({ name, phone, address }) => {
  if (phone) localStorage.setItem(PHONE_KEY, phone);
  if (name) localStorage.setItem(NAME_KEY, name);
  if (address) localStorage.setItem(ADDR_KEY, address);
  window.dispatchEvent(new Event('aevum:identity-changed'));
};
export const clearIdentity = () => {
  localStorage.removeItem(PHONE_KEY);
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(ADDR_KEY);
  window.dispatchEvent(new Event('aevum:identity-changed'));
};

/* ---------- Public ---------- */
export const fetchServices = async () => {
  const { data } = await axios.get(`${API}/services`);
  console.log(JSON.stringify(data));
  
  return data;
};

export const createBooking = async (payload) => {
  console.log(JSON.stringify(payload));
  const { data } = await axios.post(`${API}/bookings`, payload);
  return data;
};

export const fetchMyBookings = async (phone) => {
  const { data } = await axios.get(`${API}/bookings`, { params: { phone } });
  return data;
};

export const cancelMyBooking = async (id, phone) => {
  const { data } = await axios.patch(`${API}/bookings/${id}/cancel`, null, {
    params: { phone },
  });
  return data;
};

/* ---------- Admin ---------- */
export const getAdminToken = () => localStorage.getItem(ADMIN_KEY) || '';
export const setAdminToken = (t) => {
  if (t) localStorage.setItem(ADMIN_KEY, t);
  else localStorage.removeItem(ADMIN_KEY);
};
export const adminLogin = async (password) => {
  const { data } = await axios.post(`${API}/admin/login`, { password });
  setAdminToken(data.token);
  return data.token;
};
const adminHeaders = () => ({ headers: { 'X-Admin-Token': getAdminToken() } });
export const adminListBookings = async ({ status, q } = {}) => {
  const { data } = await axios.get(`${API}/admin/bookings`, {
    ...adminHeaders(),
    params: { status, q },
  });
  return data;
};
export const adminUpdateStatus = async (id, status) => {
  const { data } = await axios.patch(
    `${API}/admin/bookings/${id}/status`,
    { status },
    adminHeaders()
  );
  return data;
};
export const adminStats = async () => {
  const { data } = await axios.get(`${API}/admin/stats`, adminHeaders());
  return data;
};
