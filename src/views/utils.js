const DAY_MAP = {
    lundi: 'Lundi',
    mardi: 'Mardi',
    mercredi: 'Mercredi',
    jeudi: 'Jeudi',
    vendredi: 'Vendredi',
    samedi: 'Samedi',
    dimanche: 'Dimanche',
};

function normalizeDay(dayValue) {
    if (!dayValue) return null;
    const key = String(dayValue).trim().toLowerCase();
    return DAY_MAP[key] || null;
}

function extractHour(value) {
    if (value === null || value === undefined) return null;
    const stringValue = String(value).trim();
    const hourMatch = stringValue.match(/^(\d{1,2})/);
    if (!hourMatch) return null;
    return `${Number(hourMatch[1])}:00`;
}

function extractCourseCode(course) {
    if (!course) return '';
    if (typeof course.ue === 'string') return course.ue;
    if (course.ue && typeof course.ue === 'object') {
        return course.ue.codeUE || course.ue.code || course.ue.intitulé || '';
    }
    return course.codeUE || '';
}

function extractRoomCode(course) {
    if (!course) return '';
    if (typeof course.salle === 'string') return course.salle;
    if (course.salle && typeof course.salle === 'object') {
        return course.salle.codeSalle || course.salle.nomSalle || '';
    }
    return course.codeSalle || '';
}

function extractTeacher(course) {
    if (!course) return '';
    if (typeof course.enseignant === 'string') return course.enseignant;
    if (course.enseignant && typeof course.enseignant === 'object') {
        const fullName = [course.enseignant.nom, course.enseignant.prenom].filter(Boolean).join(' ').trim();
        return fullName || course.enseignant.email || '';
    }
    if (typeof course.teacher === 'string') return course.teacher;
    return '';
}

// Convertir la liste des cours reçus de l'API en la structure de données utilisée par l'app.
export function convertToTimetable(cours) {
    if (!cours) return {};

    let normalizedCourses = [];

    if (Array.isArray(cours)) {
        normalizedCourses = cours;
    } else if (typeof cours === 'object') {
        normalizedCourses = Object.entries(cours).flatMap(([dayKey, dayCourses]) => {
            if (!Array.isArray(dayCourses)) return [];
            return dayCourses.map((course) => ({ ...course, jourDeCours: course?.jourDeCours || dayKey }));
        });
    }

    if (!normalizedCourses.length) return {};

    const timetable = {};

    normalizedCourses.forEach((course) => {
        const dayLabel = normalizeDay(course.jourDeCours || course.jour || course.day);
        const hourLabel = extractHour(course.heureDebut || course.heure || course.startTime);

        if (!dayLabel || !hourLabel) return;

        if (!timetable[hourLabel]) {
            timetable[hourLabel] = {};
        }

        timetable[hourLabel][dayLabel] = {
            ue: extractCourseCode(course),
            teacher: extractTeacher(course),
            room: extractRoomCode(course),
        };
    });

    return timetable;
}