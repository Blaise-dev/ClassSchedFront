/* eslint-disable no-console */
const axios = require('axios');

const API_BASE_URL = (process.env.VUE_APP_API_URL || 'https://classsched-backend.onrender.com').replace(/\/$/, '');
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

const seedSpec = {
  departments: [
    { codeDepartement: 'INFO', nom: 'Informatique' },
    { codeDepartement: 'MATH', nom: 'Mathématiques' },
    { codeDepartement: 'PHYS', nom: 'Physique' },
  ],
  filieres: [
    { codeFiliere: 'INF', nom: 'Informatique', code_departement: 'INFO' },
    { codeFiliere: 'MAT', nom: 'Mathématiques', code_departement: 'MATH' },
    { codeFiliere: 'PHY', nom: 'Physique', code_departement: 'PHYS' },
  ],
  niveaux: [
    { codeNiveau: 'L1', nom: 'Licence 1' },
    { codeNiveau: 'L2', nom: 'Licence 2' },
    { codeNiveau: 'L3', nom: 'Licence 3' },
    { codeNiveau: 'M1', nom: 'Master 1' },
    { codeNiveau: 'M2', nom: 'Master 2' },
  ],
  options: [
    { codeOption: 'GL', nom: 'Génie Logiciel' },
    { codeOption: 'IA', nom: 'Intelligence Artificielle' },
    { codeOption: 'RES', nom: 'Réseaux & Systèmes' },
    { codeOption: 'ALG', nom: 'Algèbre Avancée' },
    { codeOption: 'ANA', nom: 'Analyse Numérique' },
  ],
  ues: [
    { codeUE: 'INF101', intitulé: 'Algorithmique et structures de données' },
    { codeUE: 'INF102', intitulé: 'Programmation orientée objet' },
    { codeUE: 'INF201', intitulé: 'Base de données relationnelles' },
    { codeUE: 'INF202', intitulé: 'Architecture des ordinateurs' },
    { codeUE: 'INF301', intitulé: 'Développement web avancé' },
    { codeUE: 'INF302', intitulé: 'Systèmes distribués' },
    { codeUE: 'INF401', intitulé: 'Machine Learning' },
    { codeUE: 'INF402', intitulé: 'Vision par ordinateur' },
    { codeUE: 'INF403', intitulé: 'Cybersécurité appliquée' },
    { codeUE: 'MAT101', intitulé: 'Algèbre linéaire' },
    { codeUE: 'MAT102', intitulé: 'Analyse 1' },
    { codeUE: 'MAT201', intitulé: 'Probabilités et statistiques' },
    { codeUE: 'MAT301', intitulé: 'Équations différentielles' },
    { codeUE: 'PHY101', intitulé: 'Mécanique classique' },
    { codeUE: 'PHY102', intitulé: 'Thermodynamique' },
    { codeUE: 'PHY201', intitulé: 'Électromagnétisme' },
    { codeUE: 'PHY301', intitulé: 'Physique quantique' },
  ],
  salles: [
    { codeSalle: 'A1', nomSalle: 'Amphi 1' },
    { codeSalle: 'A2', nomSalle: 'Amphi 2' },
    { codeSalle: 'B12', nomSalle: 'Salle B12' },
    { codeSalle: 'B14', nomSalle: 'Salle B14' },
    { codeSalle: 'C21', nomSalle: 'Salle C21' },
    { codeSalle: 'C24', nomSalle: 'Salle C24' },
    { codeSalle: 'LABIA', nomSalle: 'Laboratoire IA' },
    { codeSalle: 'LABNET', nomSalle: 'Laboratoire Réseaux' },
    { codeSalle: 'LABPHY', nomSalle: 'Laboratoire Physique' },
    { codeSalle: 'S006', nomSalle: 'Salle 006' },
  ],
  filiereNiveaux: [
    { filiere: 'INF', niveau: 'L1' },
    { filiere: 'INF', niveau: 'L2' },
    { filiere: 'INF', niveau: 'L3' },
    { filiere: 'INF', niveau: 'M1' },
    { filiere: 'INF', niveau: 'M2' },
    { filiere: 'MAT', niveau: 'L1' },
    { filiere: 'MAT', niveau: 'L2' },
    { filiere: 'MAT', niveau: 'L3' },
    { filiere: 'MAT', niveau: 'M1' },
    { filiere: 'PHY', niveau: 'L1' },
    { filiere: 'PHY', niveau: 'L2' },
    { filiere: 'PHY', niveau: 'L3' },
  ],
  niveauOptions: [
    { Niveau: 'L1', option: 'GL' },
    { Niveau: 'L2', option: 'GL' },
    { Niveau: 'L2', option: 'ALG' },
    { Niveau: 'L3', option: 'GL' },
    { Niveau: 'L3', option: 'IA' },
    { Niveau: 'L3', option: 'RES' },
    { Niveau: 'L3', option: 'ANA' },
    { Niveau: 'M1', option: 'IA' },
    { Niveau: 'M1', option: 'RES' },
    { Niveau: 'M1', option: 'ANA' },
    { Niveau: 'M2', option: 'IA' },
    { Niveau: 'M2', option: 'RES' },
  ],
};

const periodLabels = ['GL', 'IA', 'RES', 'ANA'];
const dayNames = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const slots = [
  ['07:00', '09:00'],
  ['09:00', '11:00'],
  ['11:00', '13:00'],
  ['13:00', '15:00'],
  ['15:00', '17:00'],
  ['17:00', '19:00'],
];

function pick(array, index) {
  return array[index % array.length];
}

function normalizeError(error) {
  return error?.response?.data || error?.message || String(error);
}

function extractId(value) {
  if (value && typeof value === 'object') {
    return value.id || value.pk || value.code || value.codePeriode || value.codeJour || null;
  }
  return value;
}

async function signupAndSignin() {
  const ts = Date.now();
  const pseudo = `seed${String(ts).slice(-8)}`;
  const email = `${pseudo}@example.com`;
  const password = 'Seed1234';

  try {
    await api.post('/utilisateur/auth/admin/signup', {
      name: 'Seed',
      surname: 'Runner',
      email,
      pseudo,
      password,
    });
  } catch (error) {
    const payload = error?.response?.data;
    const alreadyExists = typeof payload?.message === 'string' && payload.message.toLowerCase().includes('existe');
    if (!alreadyExists) {
      throw new Error(`Signup impossible: ${JSON.stringify(normalizeError(error))}`);
    }
  }

  const signinResponse = await api.post('/utilisateur/auth/admin/signin', {
    login: email,
    password,
  });

  const token = signinResponse?.data?.token;
  if (!token) {
    throw new Error(`Token admin introuvable après signin: ${JSON.stringify(signinResponse?.data || {})}`);
  }

  api.defaults.headers.Authorization = `Bearer ${token}`;
  return { pseudo, email };
}

async function upsertByCode(listEndpoint, createEndpoint, seedRows, codeKey) {
  const existingResponse = await api.get(listEndpoint);
  const existingList = Array.isArray(existingResponse?.data) ? existingResponse.data : [];
  const existingCodes = new Set(existingList.map((item) => String(item?.[codeKey] || '')));

  let created = 0;
  for (const row of seedRows) {
    const code = String(row[codeKey]);
    if (existingCodes.has(code)) continue;
    try {
      await api.post(createEndpoint, row);
      created += 1;
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 400 && status !== 409) {
        console.warn(`[WARN] Création échouée ${createEndpoint} ${code}:`, normalizeError(error));
      }
    }
  }
  return created;
}

async function createRelations() {
  const relNiveauResponse = await api.get('/unité/appartenir-niveaux/');
  const relOptionResponse = await api.get('/unité/contenir-niveaux/');

  const relNiveauSet = new Set((relNiveauResponse?.data || []).map((row) => `${row?.filiere || row?.codeFiliere}|${row?.niveau || row?.codeNiveau}`));
  const relOptionSet = new Set((relOptionResponse?.data || []).map((row) => `${row?.Niveau || row?.niveau || row?.codeNiveau}|${row?.option || row?.codeOption}`));

  let relNiveauCreated = 0;
  let relOptionCreated = 0;
  let relOptionUeCreated = 0;

  for (const relation of seedSpec.filiereNiveaux) {
    const key = `${relation.filiere}|${relation.niveau}`;
    if (relNiveauSet.has(key)) continue;

    const payloadVariants = [
      { filiere: relation.filiere, niveau: relation.niveau },
      { codeFiliere: relation.filiere, codeNiveau: relation.niveau },
    ];

    for (const payload of payloadVariants) {
      try {
        await api.post('/unité/appartenir-niveaux/', payload);
        relNiveauCreated += 1;
        break;
      } catch (error) {
        if (payload === payloadVariants[payloadVariants.length - 1]) {
          console.warn('[WARN] Relation filière/niveau non créée:', relation, normalizeError(error));
        }
      }
    }
  }

  for (const relation of seedSpec.niveauOptions) {
    const niveauCode = relation.Niveau;
    const key = `${niveauCode}|${relation.option}`;
    if (relOptionSet.has(key)) continue;

    const payloadVariants = [
      { Niveau: niveauCode, option: relation.option },
      { niveau: niveauCode, option: relation.option },
      { codeNiveau: niveauCode, codeOption: relation.option },
    ];

    for (const payload of payloadVariants) {
      try {
        await api.post('/unité/contenir-niveaux/', payload);
        relOptionCreated += 1;
        break;
      } catch (error) {
        if (payload === payloadVariants[payloadVariants.length - 1]) {
          console.warn('[WARN] Relation niveau/option non créée:', relation, normalizeError(error));
        }
      }
    }
  }

  const relUeResponse = await api.get('/unité/contenir-ues/');
  const relUeSet = new Set((relUeResponse?.data || []).map((row) => `${row?.option}|${row?.ue}`));

  const optionCodes = seedSpec.options.map((item) => item.codeOption);
  const ueCodes = seedSpec.ues.map((item) => item.codeUE);

  for (const optionCode of optionCodes) {
    for (const ueCode of ueCodes) {
      const key = `${optionCode}|${ueCode}`;
      if (relUeSet.has(key)) continue;

      try {
        await api.post('/unité/contenir-ues/', { option: optionCode, ue: ueCode });
        relOptionUeCreated += 1;
      } catch (error) {
        console.warn('[WARN] Relation option/ue non créée:', { option: optionCode, ue: ueCode }, normalizeError(error));
      }
    }
  }

  return { relNiveauCreated, relOptionCreated, relOptionUeCreated };
}

async function upsertAnnees() {
  const targetYears = [2023, 2024, 2025];
  const response = await api.get('/plannification/annees/');
  const existing = Array.isArray(response?.data) ? response.data : [];
  const mapByYear = new Map(existing.map((item) => [Number(item?.annee), Number(item?.annee)]));

  for (const year of targetYears) {
    if (mapByYear.has(year)) continue;
    try {
      const created = await api.post('/plannification/annees/', { annee: year });
      const row = created?.data || {};
      mapByYear.set(year, Number(row?.annee || year));
    } catch (error) {
      console.warn('[WARN] Création année échouée:', year, normalizeError(error));
    }
  }

  const refreshed = await api.get('/plannification/annees/');
  const rows = Array.isArray(refreshed?.data) ? refreshed.data : [];
  return new Map(rows.map((item) => [Number(item?.annee), Number(item?.annee)]));
}

async function upsertJours() {
  const response = await api.get('/plannification/jours/');
  const existing = Array.isArray(response?.data) ? response.data : [];
  const mapByName = new Map(existing.map((item) => [String(item?.nomJour || '').toLowerCase(), item?.id || item?.pk]));

  for (const day of dayNames) {
    if (mapByName.has(day)) continue;
    try {
      const created = await api.post('/plannification/jours/', { nomJour: day });
      const row = created?.data || {};
      mapByName.set(day, row.id || row.pk);
    } catch (error) {
      console.warn('[WARN] Création jour échouée:', day, normalizeError(error));
    }
  }

  const refreshed = await api.get('/plannification/jours/');
  const rows = Array.isArray(refreshed?.data) ? refreshed.data : [];
  return new Map(rows.map((item) => [String(item?.nomJour || '').toLowerCase(), String(item?.nomJour || '').toLowerCase()]));
}

async function probePeriodeIds(maxId = 200) {
  const result = [];
  let misses = 0;
  for (let id = 1; id <= maxId; id += 1) {
    try {
      const response = await api.get(`/plannification/periodes/${id}/`);
      const row = response?.data || {};
      result.push({
        id,
        DateDebut: row.DateDebut,
        DateFin: row.DateFin,
        annee: Number(extractId(row.annee)),
      });
      misses = 0;
    } catch (_) {
      misses += 1;
      if (misses >= 35 && result.length > 0) break;
    }
  }
  return result;
}

async function upsertPeriodes(yearMap) {
  const templates = [
    { label: 'GL', DateDebut: '2023-10-01', DateFin: '2023-12-20', year: 2023 },
    { label: 'IA', DateDebut: '2024-01-08', DateFin: '2024-03-31', year: 2024 },
    { label: 'RES', DateDebut: '2024-04-10', DateFin: '2024-06-28', year: 2024 },
    { label: 'ANA', DateDebut: '2025-01-10', DateFin: '2025-03-30', year: 2025 },
  ];

  const response = await api.get('/plannification/periodes/');
  const existing = Array.isArray(response?.data) ? response.data : [];
  const existingSet = new Set(existing.map((item) => `${item?.DateDebut}|${item?.DateFin}|${Number(extractId(item?.annee))}`));

  for (const item of templates) {
    const anneeId = yearMap.get(item.year);
    if (!anneeId) continue;
    const key = `${item.DateDebut}|${item.DateFin}|${anneeId}`;
    if (existingSet.has(key)) continue;
    try {
      await api.post('/plannification/periodes/', {
        DateDebut: item.DateDebut,
        DateFin: item.DateFin,
        annee: Number(anneeId),
      });
    } catch (error) {
      console.warn('[WARN] Création période échouée:', item, normalizeError(error));
    }
  }

  const allById = await probePeriodeIds(260);
  const ordered = allById.sort((a, b) => String(a.DateDebut).localeCompare(String(b.DateDebut)));

  const labelMap = new Map();
  for (const template of templates) {
    const match = ordered.find(
      (row) => row.DateDebut === template.DateDebut && row.DateFin === template.DateFin && Number(row.annee) === Number(template.year)
    );
    if (match?.id) {
      labelMap.set(template.label, match.id);
    }
  }

  return labelMap;
}

function buildCoursPayloads(dayIdMap, periodIdMap) {
  const ueCodes = seedSpec.ues.map((item) => item.codeUE);
  const salleCodes = seedSpec.salles.map((item) => item.codeSalle);
  const cours = [];

  periodLabels.forEach((periodLabel, periodIndex) => {
    const periodId = periodIdMap.get(periodLabel);
    if (!periodId) return;

    dayNames.forEach((dayName, dayIndex) => {
      const dayId = dayIdMap.get(dayName) || dayName;

      slots.forEach((slot, slotIndex) => {
        const [heureDebut, heureFin] = slot;
        const ue = pick(ueCodes, periodIndex * 7 + dayIndex * 3 + slotIndex);
        const salle = pick(salleCodes, periodIndex * 11 + dayIndex * 5 + slotIndex);

        cours.push({
          heureDebut,
          heureFin,
          ue,
          salle,
          periode: periodId,
          jourDeCours: dayId,
        });
      });
    });
  });

  return cours;
}

async function createCoursRich(dayIdMap, periodIdMap) {
  const existingCoursResponse = await api.get('/plannification/cours/');
  const existingCours = Array.isArray(existingCoursResponse?.data) ? existingCoursResponse.data : [];
  const existingSet = new Set(
    existingCours.map((c) => `${extractId(c?.periode)}|${String(extractId(c?.jourDeCours) || '').toLowerCase()}|${c?.heureDebut}|${c?.heureFin}|${c?.salle?.codeSalle || c?.salle || ''}`)
  );

  const payloads = buildCoursPayloads(dayIdMap, periodIdMap);
  let created = 0;

  for (const payload of payloads) {
    const key = `${payload.periode}|${String(payload.jourDeCours).toLowerCase()}|${payload.heureDebut}|${payload.heureFin}|${payload.salle}`;
    if (existingSet.has(key)) continue;

    try {
      await api.post('/plannification/cours/', payload);
      created += 1;
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 400 && status !== 409) {
        console.warn('[WARN] Cours non créé:', payload, normalizeError(error));
      }
    }
  }

  return created;
}

async function main() {
  console.log('🚀 Seed démarré sur', API_BASE_URL);

  const admin = await signupAndSignin();
  console.log('✅ Admin prêt:', admin.pseudo);

  const depCreated = await upsertByCode('/unité/departements/', '/unité/departements/', seedSpec.departments, 'codeDepartement');
  const filiereCreated = await upsertByCode('/unité/filieres/', '/unité/filieres/', seedSpec.filieres, 'codeFiliere');
  const niveauCreated = await upsertByCode('/unité/niveaux/', '/unité/niveaux/', seedSpec.niveaux, 'codeNiveau');
  const optionCreated = await upsertByCode('/unité/options/', '/unité/options/', seedSpec.options, 'codeOption');
  const ueCreated = await upsertByCode('/unité/ues/', '/unité/ues/', seedSpec.ues, 'codeUE');
  const salleCreated = await upsertByCode('/plannification/salles/', '/plannification/salles/', seedSpec.salles, 'codeSalle');

  const yearMap = await upsertAnnees();
  const dayIdMap = await upsertJours();
  const periodIdMap = await upsertPeriodes(yearMap);

  const relations = await createRelations();
  const coursCreated = await createCoursRich(dayIdMap, periodIdMap);

  console.log('📊 Résumé seed:');
  console.log(`- Départements créés: ${depCreated}`);
  console.log(`- Filières créées: ${filiereCreated}`);
  console.log(`- Niveaux créés: ${niveauCreated}`);
  console.log(`- Options créées: ${optionCreated}`);
  console.log(`- UEs créées: ${ueCreated}`);
  console.log(`- Salles créées: ${salleCreated}`);
  console.log(`- Années présentes: ${yearMap.size}`);
  console.log(`- Jours présents: ${dayIdMap.size}`);
  console.log(`- Périodes mappées: ${periodIdMap.size}`);
  console.log(`- Relations filière/niveau créées: ${relations.relNiveauCreated}`);
  console.log(`- Relations niveau/option créées: ${relations.relOptionCreated}`);
  console.log(`- Relations option/UE créées: ${relations.relOptionUeCreated}`);
  console.log(`- Cours créés: ${coursCreated}`);
  console.log('✅ Seed terminé');
}

main().catch((error) => {
  console.error('❌ Seed échoué:', normalizeError(error));
  process.exit(1);
});
