import axios from "axios";

const AUTH_URL = `${(process.env.VUE_APP_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')}/auth/admin/`;

class AuthService {
    login(admin) {
        return axios
            .post(AUTH_URL + 'signin', {
                pseudo: admin.pseudo,
                password: admin.password
            }).then(
                (response) => {
                    if (response.data.token) {
                        localStorage.setItem('admin', JSON.stringify(response.data));
                    }
                    return response.data;
                }
            ).catch(
                (error) => {
                    console.log(error);
                    return error;
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