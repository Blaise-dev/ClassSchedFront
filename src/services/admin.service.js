import axios from "axios";
import authHeader from "./auth-header";

// API endpoints
const BASE_URL = `${(process.env.VUE_APP_API_URL || 'https://classsched-backend.onrender.com').replace(/\/$/, '')}/`;
const DATA_URL = BASE_URL + 'unité/';
const PLANNING_URL = BASE_URL + 'plannification/';
const USER_URL = BASE_URL + 'utilisateur/';

class AdminService {
    addClassroom(data) {
        let formData = new FormData()
        formData.append('codeSalle', data.code)
        formData.append('nomSalle', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                PLANNING_URL + 'salles_disponibles/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    updateClassroom(data) {
        let formData = new FormData()
        formData.append('codeSalle', data.codeNew)
        formData.append('nomSalle', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .patch(
                PLANNING_URL + 'salles_disponibles/' + data.code + '/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    deleteClassroom(data) {
        let url = PLANNING_URL + 'salles_disponibles/' + data.code + '/'
        return axios
            .delete(
                url, 
                {
                    headers: authHeader()
                }
            );
    }

    addCourse(data) {
        let formData = new FormData()
        formData.append('codeUE', data.code)
        formData.append('intitule', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'creer_ue/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    updateCourse(data) {
        let formData = new FormData()
        formData.append('codeUE', data.code)
        formData.append('codeNew', data.codeNew)
        formData.append('intitule', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'modifier_ue/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    deleteCourse(data) {
        let url = DATA_URL + 'supprimer_ue/?codeUE=' + data.code
        return axios
            .get(
                url, 
                {
                    headers: authHeader()
                }
            );
    }

    addDepartment(data) {
        let formData = new FormData()
        formData.append('codeDepartement', data.code)
        formData.append('nomDepartement', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'creer_departement/',
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    updateDepartment(data) {
        let formData = new FormData()
        formData.append('codeDepartement', data.code)
        formData.append('codeNew', data.codeNew)
        formData.append('nomDepartement', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'modifier_departement/',
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    deleteDepartment(data) {
        let url = DATA_URL + 'supprimer_departement/?codeDepartement=' + data.code
        return axios
            .get(
                url, 
                {
                    headers: authHeader()
                }
            );
    }

    getAllDepartments() {
        return axios
            .get(
                DATA_URL + 'tous_departements/',
                {
                    headers: authHeader()
                }
            );
    }

    addFiliere(data) {
        let formData = new FormData()
        formData.append('codeFiliere', data.code)
        formData.append('nomFiliere', data.name)
        formData.append('codeDepartement', data.dep)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'creer_filiere/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    updateFiliere(data) {
        let formData = new FormData()
        formData.append('codeFiliere', data.code)
        formData.append('codeNew', data.codeNew)
        formData.append('nomFiliere', data.name)
        formData.append('codeDepartement', data.dep)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'modifier_filiere/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    deleteFiliere(data) {
        let url = DATA_URL + 'supprimer_filiere/?codeFiliere=' + data.code
        return axios
            .get(
                url, 
                {
                    headers: authHeader()
                }
            );
    }

    getAllFilieres() {
        return axios
            .get(
                DATA_URL + 'toutes_filieres/',
                {
                    headers: authHeader()
                }
            );
    }

    addLevel(data) {
        let formData = new FormData()
        formData.append('codeNiveau', data.code)
        formData.append('nomNiveau', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'creer_niveau/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    updateLevel(data) {
        let formData = new FormData()
        formData.append('codeNiveau', data.code)
        formData.append('codeNew', data.codeNew)
        formData.append('nomNiveau', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'modifier_niveau/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    deleteLevel(data) {
        let url = DATA_URL + 'supprimer_niveau/?codeNiveau=' + data.code
        return axios
            .get(
                url, 
                {
                    headers: authHeader()
                }
            );
    }

    getLevelsFiliere(codeFiliere) {
        return axios
            .get(
                DATA_URL + 'niveaux_filiere/?codeFiliere=' + codeFiliere,
                {
                    headers: authHeader()
                }
            );
    }

    addOption(data) {
        let formData = new FormData()
        formData.append('codeOption', data.code)
        formData.append('nomOption', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'creer_option/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    updateOption(data) {
        let formData = new FormData()
        formData.append('codeOption', data.code)
        formData.append('codeNew', data.codeNew)
        formData.append('nomOption', data.name)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                DATA_URL + 'modifier_option/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    deleteOption(data) {
        let url = DATA_URL + 'supprimer_option/?codeOption=' + data.code
        return axios
            .get(
                url, 
                {
                    headers: authHeader()
                }
            );
    }

    getOptionsLevel(codeLevel) {
        return axios
            .get(
                DATA_URL + 'option_niveau/?codeNiveau=' + codeLevel,
                {
                    headers: authHeader()
                }
            );
    }

    addReservation(data) {
        let formData = new FormData()
        formData.append('salle', data.salle)
        formData.append('date', data.date)
        formData.append('heure_debut', data.debut)
        formData.append('heure_fin', data.fin)
        formData.append('motif', data.motif)
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        return axios
            .post(
                USER_URL + 'reservation/', 
                formData,
                {
                    headers: authHeader()
                }
            );
    }

    getTimeTable(data) {
        return axios
            .get(
                PLANNING_URL + 'emploi_niveau/' + data.id + '/' + data.annee + '/',
                {
                    headers: authHeader()
                }
            );
    }
}

export default new AdminService();
