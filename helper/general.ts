export const getCredentials = () => {
  if (typeof window === 'undefined') {
    return { email: null, password: null };
  }

  const credentials = localStorage.getItem('data');
  try {
    const parsed = JSON.parse(credentials || '{}');
    return { email: parsed.email, password: parsed.password };
  } catch (err) {
    console.error('Failed to parse credentials', err);
    return { email: null, password: null };
  }
};
