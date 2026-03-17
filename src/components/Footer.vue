<template>
    <footer class="site-footer border-top mt-5 py-4">
        <div class="cs-container">
            <div class="row g-4">
                <div class="col-md-4">
                    <p class="footer-title">ClassSched</p>
                    <p class="footer-text">Plateforme professionnelle de planification des cours, événements académiques et réservations.</p>
                </div>
                <div class="col-md-4">
                    <p class="footer-title">Contact</p>
                    <ul class="list-unstyled footer-list">
                        <li>ci@facsciences.uy1.cm</li>
                        <li>info@uy1.uninet.cm</li>
                        <li>Yaoundé, Cameroun</li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <p class="footer-title">Liens utiles</p>
                    <ul class="list-unstyled footer-list">
                        <li><a href="https://www.preinscriptions.uninet.cm/" target="_blank" rel="noopener">Préinscriptions</a></li>
                        <li><a href="https://uy1.uninet.cm/" target="_blank" rel="noopener">Site officiel UY1</a></li>
                        <li><router-link to="/planning/">Consulter le planning</router-link></li>
                    </ul>
                </div>
            </div>
            <div class="row border-top mt-3 pt-3">
                <div class="col text-center footer-copyright">
                    © 2026 — ClassSched. Tous droits réservés.
                </div>
            </div>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'SiteFooter',
    components: {}
}
</script>

<style scoped>
.site-footer {
    background: #fff;
}

.footer-title {
    font-weight: 800;
    margin-bottom: 0.65rem;
}

.footer-text,
.footer-list {
    color: var(--cs-muted);
    line-height: 1.7;
}

.footer-list a {
    color: var(--cs-primary);
    font-weight: 600;
}

.footer-copyright {
    color: #8891a5;
    font-size: 0.9rem;
}
</style>