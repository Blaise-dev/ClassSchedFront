<template>
    <footer class="site-footer mt-5 py-4">
        <div class="cs-container">
            <div class="row g-4 footer-shell p-4 p-md-5">
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
            <div class="row border-top border-light-subtle mt-3 pt-3">
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
    background: transparent;
}

.footer-shell {
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: linear-gradient(155deg, rgba(16, 22, 48, 0.86), rgba(22, 30, 64, 0.72));
    backdrop-filter: blur(14px);
    box-shadow: 0 16px 40px rgba(6, 10, 28, 0.28);
}

.footer-title {
    font-weight: 800;
    color: #f2f4ff;
    margin-bottom: 0.65rem;
}

.footer-text,
.footer-list {
    color: rgba(223, 228, 255, 0.78);
    line-height: 1.7;
}

.footer-list a {
    color: #c3c9ff;
    font-weight: 600;
}

.footer-copyright {
    color: rgba(213, 218, 244, 0.65);
    font-size: 0.9rem;
}
</style>