<template>
    <div class="data-table-container">
        <!-- Header avec actions -->
        <div class="table-header">
            <div class="header-left">
                <h2 class="table-title">{{ title }}</h2>
                <p v-if="subtitle" class="table-subtitle">{{ subtitle }}</p>
            </div>
            <div class="header-right">
                <div class="search-wrapper">
                    <i class="fas fa-search"></i>
                    <input 
                        v-model="searchQuery" 
                        type="text" 
                        class="search-input" 
                        :placeholder="`Rechercher ${title.toLowerCase()}...`"
                    />
                </div>
                <button @click="$emit('create')" class="btn-primary btn-create">
                    <i class="fas fa-plus"></i>
                    <span>Créer</span>
                </button>
            </div>
        </div>

        <!-- Messages de chargement/erreur -->
        <div v-if="loading" class="table-loading">
            <div class="spinner"></div>
            <p>Chargement en cours...</p>
        </div>

        <div v-else-if="error" class="table-error">
            <i class="fas fa-exclamation-circle"></i>
            <p>{{ error }}</p>
            <button @click="$emit('retry')" class="btn-secondary">Réessayer</button>
        </div>

        <!-- Tableau -->
        <div v-else-if="filteredItems.length > 0" class="table-section">
            <table class="data-table">
                <thead>
                    <tr>
                        <th v-for="column in columns" :key="column.key" class="table-header-cell">
                            <div class="header-content">
                                {{ column.label }}
                                <span v-if="column.sortable" @click="sort(column.key)" class="sort-icon">
                                    <i class="fas fa-arrows-alt-v"></i>
                                </span>
                            </div>
                        </th>
                        <th class="table-header-cell actions-header">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in paginatedItems" :key="index" class="table-row">
                        <td v-for="column in columns" :key="column.key" class="table-cell">
                            <div class="cell-content">
                                <span v-if="column.badge" :class="`badge badge-${column.badgeType || 'default'}`">
                                    {{ item[column.key] }}
                                </span>
                                <span v-else>{{ formatCellValue(item[column.key], column.type) }}</span>
                            </div>
                        </td>
                        <td class="table-cell actions-cell">
                            <div class="action-buttons">
                                <button 
                                    @click.stop="$emit('edit', item)" 
                                    class="btn-action btn-edit" 
                                    title="Modifier"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button 
                                    @click.stop="confirmDelete(item)" 
                                    class="btn-action btn-delete" 
                                    title="Supprimer"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="table-pagination">
                <button 
                    @click="previousPage" 
                    :disabled="currentPage === 1"
                    class="btn-page"
                >
                    <i class="fas fa-chevron-left"></i>
                </button>
                
                <span class="page-info">
                    Page {{ currentPage }} / {{ totalPages }}
                </span>
                
                <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    class="btn-page"
                >
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- État vide -->
        <div v-else class="table-empty">
            <div class="table-empty-inner">
                <i class="fas fa-inbox table-empty-icon"></i>
                <p class="empty-title">Aucune donnée</p>
                <p class="empty-subtitle">{{ searchQuery ? 'Aucun résultat ne correspond à votre recherche.' : 'Aucun élément trouvé pour le moment.' }}</p>
                <button v-if="!searchQuery" @click="$emit('create')" class="btn-primary btn-empty-create">
                    <i class="fas fa-plus"></i>
                    <span>Créer le premier élément</span>
                </button>
            </div>
        </div>

        <!-- Modal de confirmation de suppression -->
        <div v-if="showDeleteConfirm" class="delete-modal-overlay">
            <div class="delete-modal">
                <div class="modal-header">
                    <h3>Confirmer la suppression</h3>
                    <button @click="cancelDelete" class="btn-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>
                    <p class="item-info">{{ getItemLabel(itemToDelete) }}</p>
                </div>
                <div class="modal-footer">
                    <button @click="cancelDelete" class="btn-secondary">Annuler</button>
                    <button @click="confirmDeleteAction" class="btn-danger">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DataTable',
    props: {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            default: null
        },
        items: {
            type: Array,
            default: () => []
        },
        columns: {
            type: Array,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: null
        },
        itemsPerPage: {
            type: Number,
            default: 10
        }
    },
    emits: ['create', 'edit', 'delete', 'retry'],
    data() {
        return {
            searchQuery: '',
            currentPage: 1,
            sortKey: null,
            sortOrder: 'asc',
            showDeleteConfirm: false,
            itemToDelete: null
        };
    },
    computed: {
        filteredItems() {
            let filtered = this.items;

            // Filtrer par recherche
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(item =>
                    this.columns.some(col => {
                        const value = String(item[col.key] || '').toLowerCase();
                        return value.includes(query);
                    })
                );
            }

            // Trier
            if (this.sortKey) {
                filtered = [...filtered].sort((a, b) => {
                    const aVal = a[this.sortKey];
                    const bVal = b[this.sortKey];
                    const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
                    return this.sortOrder === 'asc' ? comparison : -comparison;
                });
            }

            return filtered;
        },
        paginatedItems() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredItems.slice(start, start + this.itemsPerPage);
        },
        totalPages() {
            return Math.ceil(this.filteredItems.length / this.itemsPerPage);
        }
    },
    methods: {
        formatCellValue(value, type) {
            if (!value) return '-';
            
            if (type === 'date') {
                return new Date(value).toLocaleDateString('fr-FR');
            }
            if (type === 'datetime') {
                return new Date(value).toLocaleString('fr-FR');
            }
            return value;
        },
        sort(key) {
            if (this.sortKey === key) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortKey = key;
                this.sortOrder = 'asc';
            }
        },
        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        confirmDelete(item) {
            this.itemToDelete = item;
            this.showDeleteConfirm = true;
        },
        cancelDelete() {
            this.showDeleteConfirm = false;
            this.itemToDelete = null;
        },
        confirmDeleteAction() {
            this.$emit('delete', this.itemToDelete);
            this.cancelDelete();
        },
        getItemLabel(item) {
            // Essayer de trouver le meilleur label pour l'item
            const mainNames = ['nom', 'name', 'intitulé', 'nomSalle', 'nomFiliere'];
            for (const field of mainNames) {
                if (item[field]) return String(item[field]);
            }
            return JSON.stringify(item).substring(0, 50);
        }
    }
};
</script>

<style scoped lang="css">
.data-table-container {
    background: rgba(26, 31, 58, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    overflow: hidden;
}

/* Header */
.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    padding: 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-left {
    flex: 1;
}

.table-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
}

.table-subtitle {
    margin: 4px 0 0;
    font-size: 13px;
    color: #b0b7d4;
}

.header-right {
    display: flex;
    gap: 16px;
    align-items: center;
}

.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-wrapper i {
    position: absolute;
    left: 12px;
    color: #5b2cff;
    font-size: 14px;
}

.search-input {
    padding: 10px 12px 10px 36px;
    background: rgba(91, 44, 255, 0.1);
    border: 1px solid rgba(91, 44, 255, 0.3);
    border-radius: 8px;
    color: #ffffff;
    font-size: 13px;
    transition: all 0.3s ease;
    min-width: 250px;
}

.search-input::placeholder {
    color: #b0b7d4;
}

.search-input:focus {
    outline: none;
    background: rgba(91, 44, 255, 0.15);
    border-color: #5b2cff;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: linear-gradient(135deg, #5b2cff, #7e4cff);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 13px;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(91, 44, 255, 0.3);
}

.btn-create {
    white-space: nowrap;
}

/* Loading */
.table-loading {
    padding: 60px 24px;
    text-align: center;
    color: #b0b7d4;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(91, 44, 255, 0.2);
    border-top-color: #5b2cff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Error */
.table-error {
    padding: 40px 24px;
    text-align: center;
    color: #ff4f9f;
}

.table-error i {
    font-size: 40px;
    margin-bottom: 16px;
    display: block;
}

/* Table */
.table-section {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.table-header-cell {
    padding: 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #b0b7d4;
    text-transform: uppercase;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.sort-icon {
    font-size: 12px;
    opacity: 0.6;
    transition: opacity 0.3s;
}

.header-content:hover .sort-icon {
    opacity: 1;
}

.actions-header {
    text-align: center;
}

.table-row {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: background-color 0.2s ease;
}

.table-row:hover {
    background: rgba(91, 44, 255, 0.1);
}

.table-cell {
    padding: 16px;
    color: #ffffff;
    font-size: 13px;
}

.cell-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
}

.badge-default {
    background: rgba(91, 44, 255, 0.2);
    color: #5b2cff;
}

.badge-success {
    background: rgba(76, 209, 139, 0.2);
    color: #4cd18b;
}

.badge-danger {
    background: rgba(255, 79, 159, 0.2);
    color: #ff4f9f;
}

.badge-warning {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
}

.actions-cell {
    text-align: center;
}

.action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.btn-action {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(91, 44, 255, 0.1);
    color: #5b2cff;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
}

.btn-action:hover {
    background: rgba(91, 44, 255, 0.2);
    border-color: #5b2cff;
}

.btn-delete {
    color: #ff4f9f;
    background: rgba(255, 79, 159, 0.1);
    border-color: rgba(255, 79, 159, 0.2);
}

.btn-delete:hover {
    background: rgba(255, 79, 159, 0.2);
    border-color: #ff4f9f;
    color: #ff7fb3;
}

/* Pagination */
.table-pagination {
    padding: 16px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
}

.btn-page {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background: rgba(91, 44, 255, 0.1);
    border: 1px solid rgba(91, 44, 255, 0.3);
    color: #5b2cff;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-page:hover:not(:disabled) {
    background: rgba(91, 44, 255, 0.2);
    border-color: #5b2cff;
}

.btn-page:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-info {
    color: #b0b7d4;
    font-size: 13px;
}

/* Empty State */
.table-empty {
    padding: 56px 20px;
    text-align: center;
}

.table-empty-inner {
    max-width: 420px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 28px 20px;
}

.table-empty-icon {
    font-size: 52px;
    color: #5b2cff;
    opacity: 0.45;
    display: block;
    margin-bottom: 14px;
}

.empty-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
}

.empty-subtitle {
    margin: 0 0 24px;
    color: #b0b7d4;
    font-size: 13px;
}

.btn-empty-create {
    margin: 0 auto;
    min-width: 220px;
    justify-content: center;
}

/* Delete Modal */
.delete-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.delete-modal {
    background: #1a1f3a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.modal-header {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
}

.btn-close {
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(91, 44, 255, 0.1);
    color: #5b2cff;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-body {
    padding: 24px;
}

.modal-body p {
    margin: 0 0 12px;
    color: #b0b7d4;
    font-size: 13px;
}

.item-info {
    padding: 12px;
    background: rgba(91, 44, 255, 0.1);
    border-radius: 6px;
    color: #5b2cff;
    font-weight: 500;
    margin: 12px 0 0 !important;
}

.modal-footer {
    padding: 20px 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn-secondary {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ffffff;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
}

.btn-danger {
    padding: 8px 16px;
    background: #ff4f9f;
    border: 1px solid #ff4f9f;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-danger:hover {
    background: #ff7fb3;
    border-color: #ff7fb3;
}

/* Responsive */
@media (max-width: 768px) {
    .table-header {
        flex-direction: column;
        gap: 16px;
    }

    .header-right {
        flex-direction: column;
        width: 100%;
    }

    .search-input {
        min-width: 100%;
    }

    .btn-create {
        width: 100%;
        justify-content: center;
    }

    .table-cell {
        padding: 12px 8px;
        font-size: 12px;
    }

    .action-buttons {
        gap: 4px;
    }

    .btn-action {
        width: 28px;
        height: 28px;
        font-size: 12px;
    }
}
</style>
