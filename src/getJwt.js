const getJwt = () => {
    return localStorage.getItem('jwt');
}

export default getJwt;