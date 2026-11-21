const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export async function request(path, options = {}) {
  const token = localStorage.getItem('shopsmart_token');
  const response = await fetch(API + path, {
    ...options,
    headers: {'Content-Type':'application/json', ...(token ? {Authorization:'Bearer '+token}:{}), ...(options.headers||{})}
  });
  const data = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(data.detail || 'Request failed');
  return data;
}
