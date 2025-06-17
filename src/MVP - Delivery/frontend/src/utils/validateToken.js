// utils/validateToken.js
export async function validateToken(token, type) {
  const url =
    type === 'user'
      ? 'http://localhost:5000/api/users/validate'
      : 'http://localhost:5000/api/restaurants/validate';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await response.json();
    
    return !result.error;
  } catch (error) {
    console.error('Erro na validação do token', error);
    return false;
  }
}
