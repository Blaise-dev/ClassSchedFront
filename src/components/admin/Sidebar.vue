<template>
    <ul class="list-group list-group-flush text-center h-100 sidebar-list p-2">
        <li class="list-group-item side-items">
            <router-link to="/admin/time-table" class="side-link text-decoration-none" active-class="active-link">
                <font-awesome-icon icon="calendar-days" class="fs-5"></font-awesome-icon>
                <div class="font-monospace sub-text text-break">Emploi de temps</div>
            </router-link>
        </li>
        <li class="list-group-item side-items">
            <router-link to="/admin/reservations" class="side-link text-decoration-none" active-class="active-link">
                <font-awesome-icon icon="calendar-check" class="fs-5"></font-awesome-icon>
                <div class="font-monospace sub-text text-break">R&eacute;servations</div>
            </router-link>
        </li>
        <li class="list-group-item side-items">
            <router-link to="/admin/classrooms" class="side-link text-decoration-none" active-class="active-link">
                <font-awesome-icon icon="chalkboard-teacher" class="fs-5"></font-awesome-icon>
                <div class="font-monospace sub-text text-break">Salles</div>
            </router-link>
        </li>
        <li class="list-group-item side-items">
            <router-link to="/admin/departments" class="side-link text-decoration-none" active-class="active-link">
                <font-awesome-icon icon="school" class="fs-5"></font-awesome-icon>
                <div class="font-monospace sub-text text-break">D&eacute;partements</div>
            </router-link>
        </li>
        <li class="list-group-item side-items">
            <router-link to="/admin/filieres" class="side-link text-decoration-none" active-class="active-link">
                <font-awesome-icon icon="clipboard-list" class="fs-5"></font-awesome-icon>
                <div class="font-monospace sub-text text-break">Fili&egrave;res</div>
            </router-link>
        </li>
        <li class="list-group-item side-items">
            <router-link to="/admin/levels" class="side-link text-decoration-none" active-class="active-link">
                <font-awesome-icon icon="book-open-reader" class="fs-5"></font-awesome-icon>
                <div class="font-monospace sub-text text-break">Niveaux</div>
            </router-link>
        </li>
        <li class="list-group-item side-items">
            <router-link to="/admin/options" class="side-link text-decoration-none" active-class="active-link">
                <font-awesome-icon icon="filter" class="fs-5"></font-awesome-icon>
                <div class="font-monospace sub-text text-break">Options</div>
            </router-link>
        </li>
        <li class="list-group-item side-items">
            <router-link to="/admin/courses" class="side-link text-decoration-none" active-class="active-link">
                <font-awesome-icon icon="book" class="fs-5"></font-awesome-icon><br/>
                <span class="font-monospace sub-text text-break">UEs</span>
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'SideBar',
    components: {}
}
</script>

<style scoped>
.sidebar-list {
    background: transparent;
}

.side-items {
    background-color: transparent;
    border: none;
    border-radius: 12px;
    margin-bottom: 0.4rem;
    transition: background-color 0.2s ease;
}

.side-link {
    color: #dce3ff;
    display: block;
    padding: 0.7rem 0.5rem;
    border-radius: 10px;
    font-weight: 700;
}

.side-link:hover,
.active-link {
    background: rgba(91, 44, 255, 0.2);
    color: #ffffff;
}

.sub-text {
    font-size: 0.72rem;
    font-weight: 800;
}

</style>