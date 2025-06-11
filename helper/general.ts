
export const getCredentials = () => {
    const credentials = localStorage.getItem('data');
    const parsed = JSON.parse(credentials || '{}');
    return  {email : parsed.email , password : parsed.password}  
    
}