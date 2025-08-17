export const KEY='products';

export function getProducts(){
  if (typeof window==='undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function setProducts(list){
  if (typeof window==='undefined') return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function seedIfEmpty(seed){
  if (typeof window==='undefined') return;
  const exists = localStorage.getItem(KEY);
  if (!exists) localStorage.setItem(KEY, JSON.stringify(seed));
}