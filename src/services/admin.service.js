import axios from "axios";

const API_BASE_URL = (process.env.VUE_APP_API_URL || "https://classsched-backend.onrender.com").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

const getAuthHeaders = () => {
  const admin = localStorage.getItem("admin");
  if (!admin) return {};

  try {
    const adminData = JSON.parse(admin);
    if (adminData?.token) {
      return { Authorization: `Bearer ${adminData.token}` };
    }
  } catch (_) {
    return {};
  }

  return {};
};

const getCurrentUserId = () => {
  try {
    const admin = localStorage.getItem("admin");
    if (!admin) return null;
    const adminData = JSON.parse(admin);
    return adminData?.id || adminData?.user_id || adminData?.userId || null;
  } catch (_) {
    return null;
  }
};


  const getCurrentUserProfile = () => {
    try {
      const admin = localStorage.getItem("admin");
      if (!admin) return null;
      return JSON.parse(admin);
    } catch (_) {
      return null;
    }
  };

  const toNumberOrNull = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const normalizeList = (value) => (Array.isArray(value) ? value : []);
const mapMessage = (response, fallback) => ({
  ...(response?.data || {}),
  message: response?.data?.message || fallback
});

const adminService = {
  // ===== UE =====
  getUEs() {
    return api.get("/unité/ues/", { headers: getAuthHeaders() });
  },

  createUE(data) {
    return api.post(
      "/unité/ues/",
      {
        codeUE: data.code,
        intitulé: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  updateUE(codeUE, data) {
    return api.patch(
      `/unité/ues/${codeUE}/`,
      {
        codeUE: data.codeNew || codeUE,
        intitulé: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  deleteUE(codeUE) {
    return api.delete(`/unité/ues/${codeUE}/`, { headers: getAuthHeaders() });
  },

  // ===== Salles =====
  getSalles() {
    return api.get("/plannification/salles/", { headers: getAuthHeaders() });
  },

  createSalle(data) {
    return api.post(
      "/plannification/salles/",
      {
        codeSalle: data.code,
        nomSalle: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  updateSalle(codeSalle, data) {
    return api.patch(
      `/plannification/salles/${codeSalle}/`,
      {
        codeSalle: data.codeNew || codeSalle,
        nomSalle: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  deleteSalle(codeSalle) {
    return api.delete(`/plannification/salles/${codeSalle}/`, { headers: getAuthHeaders() });
  },

  // ===== Départements =====
  getDepartements() {
    return api.get("/unité/departements/", { headers: getAuthHeaders() });
  },

  createDepartement(data) {
    return api.post(
      "/unité/departements/",
      {
        codeDepartement: data.code,
        nom: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  updateDepartement(codeDept, data) {
    return api.patch(
      `/unité/departements/${codeDept}/`,
      {
        codeDepartement: data.codeNew || codeDept,
        nom: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  deleteDepartement(codeDept) {
    return api.delete(`/unité/departements/${codeDept}/`, { headers: getAuthHeaders() });
  },

  // ===== Filières =====
  getFilieres() {
    return api.get("/unité/filieres/", { headers: getAuthHeaders() });
  },

  createFiliere(data) {
    return api.post(
      "/unité/filieres/",
      {
        codeFiliere: data.code,
        nom: data.name,
        code_departement: data.dep
      },
      { headers: getAuthHeaders() }
    );
  },

  updateFiliereByCode(codeFiliere, data) {
    return api.patch(
      `/unité/filieres/${codeFiliere}/`,
      {
        codeFiliere: data.codeNew || codeFiliere,
        nom: data.name,
        code_departement: data.dep
      },
      { headers: getAuthHeaders() }
    );
  },

  deleteFiliereByCode(codeFiliere) {
    return api.delete(`/unité/filieres/${codeFiliere}/`, { headers: getAuthHeaders() });
  },

  // ===== Niveaux =====
  getNiveaux() {
    return api.get("/unité/niveaux/", { headers: getAuthHeaders() });
  },

  createNiveau(data) {
    return api.post(
      "/unité/niveaux/",
      {
        codeNiveau: data.code,
        nom: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  updateNiveauByCode(codeNiveau, data) {
    return api.patch(
      `/unité/niveaux/${codeNiveau}/`,
      {
        codeNiveau: data.codeNew || codeNiveau,
        nom: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  deleteNiveauByCode(codeNiveau) {
    return api.delete(`/unité/niveaux/${codeNiveau}/`, { headers: getAuthHeaders() });
  },

  // ===== Options =====
  getOptions() {
    return api.get("/unité/options/", { headers: getAuthHeaders() });
  },

  createOption(data) {
    return api.post(
      "/unité/options/",
      {
        codeOption: data.code,
        nom: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  updateOptionByCode(codeOption, data) {
    return api.patch(
      `/unité/options/${codeOption}/`,
      {
        codeOption: data.codeNew || codeOption,
        nom: data.name
      },
      { headers: getAuthHeaders() }
    );
  },

  deleteOptionByCode(codeOption) {
    return api.delete(`/unité/options/${codeOption}/`, { headers: getAuthHeaders() });
  },

  // ===== Enseignants =====
  getEnseignants() {
    return api.get('/utilisateur/enseignants/', { headers: getAuthHeaders() });
  },

  createEnseignant(data) {
    return api.post(
      '/utilisateur/enseignants/',
      {
        utilisateur: {
          email: data.email,
          motPass: data.password,
          nom: data.nom,
          prenom: data.prenom,
          typeU: 'enseignant'
        }
      },
      { headers: getAuthHeaders() }
    );
  },

  deleteEnseignant(id) {
    return api.delete(`/utilisateur/enseignants/${id}/`, { headers: getAuthHeaders() });
  },

  getDispenserUes() {
    return api.get('/utilisateur/dispenser-ues/', { headers: getAuthHeaders() });
  },

  assignUeToEnseignant(enseignantId, ueCode) {
    return api.post(
      '/utilisateur/dispenser-ues/',
      {
        enseignanT: enseignantId,
        ue: ueCode
      },
      { headers: getAuthHeaders() }
    );
  },

  removeUeAssignment(id) {
    return api.delete(`/utilisateur/dispenser-ues/${id}/`, { headers: getAuthHeaders() });
  },

  async getUesByOption(codeOption) {
    const [relationsResponse, uesResponse] = await Promise.all([
      api.get('/unité/contenir-ues/', { headers: getAuthHeaders() }),
      this.getUEs()
    ]);

    const ueCodes = (relationsResponse.data || [])
      .filter((relation) => relation.option === codeOption)
      .map((relation) => relation.ue);

    const ues = (uesResponse.data || []).filter((ue) => ueCodes.includes(ue.codeUE));
    return { ...uesResponse, data: ues };
  },

  // ===== Cours =====
  getCours() {
    return api.get("/plannification/cours/", { headers: getAuthHeaders() });
  },

  createCours(data) {
    return api.post(
      "/plannification/cours/",
      {
        heureDebut: data.heureDebut,
        heureFin: data.heureFin,
        ue: data.ue,
        salle: data.salle,
        periode: data.periode,
        jourDeCours: data.jourDeCours
      },
      { headers: getAuthHeaders() }
    );
  },

  updateCours(id, data) {
    return api.patch(
      `/plannification/cours/${id}/`,
      {
        heureDebut: data.heureDebut,
        heureFin: data.heureFin,
        ue: data.ue,
        salle: data.salle,
        periode: data.periode,
        jourDeCours: data.jourDeCours
      },
      { headers: getAuthHeaders() }
    );
  },

  deleteCours(id) {
    return api.delete(`/plannification/cours/${id}/`, { headers: getAuthHeaders() });
  },

  // ===== Méthodes historiques utilisées par les formulaires =====
  addClassroom(data) {
    return this.createSalle(data).then((response) => ({ ...response, data: mapMessage(response, "Salle créée avec succès") }));
  },

  updateClassroom(data) {
    return this.updateSalle(data.code, data).then((response) => ({ ...response, data: mapMessage(response, "Salle modifiée avec succès") }));
  },

  deleteClassroom(data) {
    return this.deleteSalle(data.code).then((response) => ({ ...response, data: mapMessage(response, "Salle supprimée avec succès") }));
  },

  addCourse(data) {
    return this.createUE(data).then((response) => ({ ...response, data: mapMessage(response, "UE créée avec succès") }));
  },

  updateCourse(data) {
    return this.updateUE(data.code, data).then((response) => ({ ...response, data: mapMessage(response, "UE modifiée avec succès") }));
  },

  deleteCourse(data) {
    return this.deleteUE(data.code).then((response) => ({ ...response, data: mapMessage(response, "UE supprimée avec succès") }));
  },

  addDepartment(data) {
    return this.createDepartement(data).then((response) => ({ ...response, data: mapMessage(response, "Département créé avec succès") }));
  },

  updateDepartment(data) {
    return this.updateDepartement(data.code, data).then((response) => ({ ...response, data: mapMessage(response, "Département modifié avec succès") }));
  },

  deleteDepartment(data) {
    return this.deleteDepartement(data.code).then((response) => ({ ...response, data: mapMessage(response, "Département supprimé avec succès") }));
  },

  getAllDepartments() {
    return this.getDepartements();
  },

  addFiliere(data) {
    return this.createFiliere(data).then((response) => ({ ...response, data: mapMessage(response, "Filière créée avec succès") }));
  },

  updateFiliere(data) {
    return this.updateFiliereByCode(data.code, data).then((response) => ({ ...response, data: mapMessage(response, "Filière modifiée avec succès") }));
  },

  deleteFiliere(data) {
    return this.deleteFiliereByCode(data.code).then((response) => ({ ...response, data: mapMessage(response, "Filière supprimée avec succès") }));
  },

  getAllFilieres() {
    return this.getFilieres();
  },

  addLevel(data) {
    return this.createNiveau(data).then((response) => ({ ...response, data: mapMessage(response, "Niveau créé avec succès") }));
  },

  updateLevel(data) {
    return this.updateNiveauByCode(data.code, data).then((response) => ({ ...response, data: mapMessage(response, "Niveau modifié avec succès") }));
  },

  deleteLevel(data) {
    return this.deleteNiveauByCode(data.code).then((response) => ({ ...response, data: mapMessage(response, "Niveau supprimé avec succès") }));
  },

  addOption(data) {
    return this.createOption(data).then((response) => ({ ...response, data: mapMessage(response, "Option créée avec succès") }));
  },

  updateOption(data) {
    return this.updateOptionByCode(data.code, data).then((response) => ({ ...response, data: mapMessage(response, "Option modifiée avec succès") }));
  },

  deleteOption(data) {
    return this.deleteOptionByCode(data.code).then((response) => ({ ...response, data: mapMessage(response, "Option supprimée avec succès") }));
  },

  async getLevelsFiliere(codeFiliere) {
    const [relationsResponse, niveauxResponse] = await Promise.all([
      api.get("/unité/appartenir-niveaux/", { headers: getAuthHeaders() }),
      this.getNiveaux()
    ]);

    const niveauCodes = (relationsResponse.data || [])
      .filter((relation) => relation.filiere === codeFiliere)
      .map((relation) => relation.niveau);

    const niveaux = (niveauxResponse.data || []).filter((niveau) => niveauCodes.includes(niveau.codeNiveau));

    return { ...niveauxResponse, data: niveaux };
  },

  async getOptionsLevel(codeLevel) {
    const [relationsResponse, optionsResponse] = await Promise.all([
      api.get("/unité/contenir-niveaux/", { headers: getAuthHeaders() }),
      this.getOptions()
    ]);

    const optionCodes = (relationsResponse.data || [])
      .filter((relation) => relation.Niveau === codeLevel)
      .map((relation) => relation.option);

    const options = (optionsResponse.data || []).filter((option) => optionCodes.includes(option.codeOption));

    return { ...optionsResponse, data: options };
  },

  addReservation(data) {
    const headers = getAuthHeaders();
    const currentUserId = toNumberOrNull(getCurrentUserId());
    const currentProfile = getCurrentUserProfile();
    const currentEmail = String(currentProfile?.email || "").toLowerCase();

    const getTeacherId = async () => {
      if (currentUserId) return currentUserId;

      const enseignantsResponse = await api.get('/utilisateur/enseignants/', { headers });
      const enseignants = normalizeList(enseignantsResponse?.data);

      const matched = enseignants.find((item) => {
        const nestedEmail = String(item?.utilisateur?.email || "").toLowerCase();
        return nestedEmail && nestedEmail === currentEmail;
      });

      return toNumberOrNull(matched?.id) || toNumberOrNull(enseignants[0]?.id);
    };

    const getChefCandidates = async () => {
      const candidates = [];

      const fromCurrent = toNumberOrNull(currentUserId);
      if (fromCurrent && String(currentProfile?.typeU || '').toLowerCase().includes('chef')) {
        candidates.push(fromCurrent);
      }

      try {
        const reservationsResponse = await api.get('/utilisateur/reservations/', { headers });
        const reservations = normalizeList(reservationsResponse?.data);
        for (const reservation of reservations) {
          const chefId = toNumberOrNull(reservation?.chef_departement);
          if (chefId) candidates.push(chefId);
        }
      } catch (_) {
        // ignore and keep fallback candidates
      }

      candidates.push(2, 1);
      return [...new Set(candidates.filter(Boolean))];
    };

    return (async () => {
      const enseignantId = await getTeacherId();
      if (!enseignantId) {
        throw new Error("Compte enseignant non rattaché: impossible d'identifier l'enseignant pour la réservation.");
      }

      const chefCandidates = await getChefCandidates();
      let lastError = null;

      for (const chefId of chefCandidates) {
        try {
          return await api.post(
            '/utilisateur/reservations/',
            {
              chef_departement: chefId,
              enseignanT: enseignantId,
              Salle: data.salle,
              motifReservation: data.motif,
              statutReservation: 'en_attente'
            },
            { headers }
          );
        } catch (error) {
          lastError = error;
          const message = JSON.stringify(error?.response?.data || '').toLowerCase();
          const isChefFkIssue = message.includes('chef_departement') && message.includes('invalid pk');
          if (!isChefFkIssue) {
            throw error;
          }
        }
      }

      throw lastError || new Error('Impossible de soumettre la réservation.');
    })();
  },

  getReservations() {
    return api.get("/utilisateur/reservations/", { headers: getAuthHeaders() });
  },

  async updateReservationStatus(id, status) {
    const mapStatus = (s) => {
      const lower = String(s || "").toLowerCase();
      if (["refused", "refusee", "refusée"].includes(lower)) return "refusée";
      if (["approved", "acceptee", "acceptée", "validee", "validée"].includes(lower)) return "acceptée";
      return "en_attente";
    };
    const backendStatus = mapStatus(status);
    try {
      return await api.patch(
        `/utilisateur/reservations/${id}/`,
        { statutReservation: backendStatus },
        { headers: getAuthHeaders() }
      );
    } catch (_) {
      return api.put(
        `/utilisateur/reservations/${id}/`,
        { statutReservation: backendStatus },
        { headers: getAuthHeaders() }
      );
    }
  },

  async getTimeTable(data) {
    try {
      return await api.get(`/plannification/emploi_niveau/${data.id}/${data.annee}/`, { headers: getAuthHeaders() });
    } catch (_) {
      return api.get("/plannification/cours/", { headers: getAuthHeaders() });
    }
  }
};

export default adminService;
