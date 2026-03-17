import axios from "axios";

const API_BASE_URL = (process.env.VUE_APP_API_URL || 'https://classsched-backend.onrender.com').replace(/\/$/, '');
const AUTH_URL = `${API_BASE_URL}/utilisateur/auth/admin/`;

class AuthService {
    login(admin) {
        return axios
            .post(AUTH_URL + 'signin', {
                login: admin.login || admin.pseudo,
                password: admin.password
            }).then(
                (response) => {
                    if (response.data.token) {
                        localStorage.setItem('admin', JSON.stringify(response.data));
                    }
                    return response.data;
                }
            );
    }

    logout() {
        localStorage.removeItem('admin');
    }

    register(admin) {
        return axios
            .post(AUTH_URL + 'signup', {
                name: admin.name,
                surname: admin.surname,
                email: admin.email,
                pseudo: admin.pseudo,
                password: admin.password
            });
    }
}

export default new AuthService();