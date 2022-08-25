export const isLoggedIn = () => {
    const user = localStorage.getItem('usernameOfLoggedUser')
    if(user !== null){
        return true
    } else {
        return false
    }
}
