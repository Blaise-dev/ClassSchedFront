<template>
    <footer class="site-footer mt-5 py-4">
        <div class="cs-container">
            <div class="footer-shell p-4 p-md-5">

                <!-- Top grid -->
                <div class="footer-grid">

                    <!-- Brand -->
                    <div class="footer-col">
                        <div class="footer-brand">
                            <img src="@/assets/logo.png" alt="ClassSched" class="footer-logo">
                            <span class="footer-brand-name">ClassSched</span>
                        </div>
                        <p class="footer-text mt-3">
                            Plateforme professionnelle de planification des cours, événements académiques et réservations de salles.
                        </p>
                        <div class="footer-badge">
                            <i class="fas fa-map-marker-alt"></i>
                            Université de Yaoundé 1, Cameroun
                        </div>
                    </div>

                    <!-- Contact -->
                    <div class="footer-col">
                        <p class="footer-title">
                            <i class="fas fa-envelope footer-title-icon"></i>
                            Contact
                        </p>
                        <ul class="list-unstyled footer-contact-list">
                            <li>
                                <a href="mailto:ci@facsciences.uy1.cm" class="footer-contact-link">
                                    <i class="fas fa-at"></i>
                                    ci@facsciences.uy1.cm
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@uy1.uninet.cm" class="footer-contact-link">
                                    <i class="fas fa-at"></i>
                                    info@uy1.uninet.cm
                                </a>
                            </li>
                        </ul>
                    </div>

                    <!-- Liens utiles -->
                    <div class="footer-col">
                        <p class="footer-title">
                            <i class="fas fa-link footer-title-icon"></i>
                            Liens utiles
                        </p>
                        <ul class="list-unstyled footer-links-list">
                            <li>
                                <a href="https://www.preinscriptions.uninet.cm/" target="_blank" rel="noopener">
                                    <i class="fas fa-arrow-up-right-from-square"></i>
                                    Préinscriptions
                                </a>
                            </li>
                            <li>
                                <a href="https://uy1.uninet.cm/" target="_blank" rel="noopener">
                                    <i class="fas fa-arrow-up-right-from-square"></i>
                                    Site officiel UY1
                                </a>
                            </li>
                            <li>
                                <router-link to="/planning/">
                                    <i class="fas fa-calendar-days"></i>
                                    Consulter le planning
                                </router-link>
                            </li>
                        </ul>
                    </div>

                </div>

                <!-- Divider -->
                <div class="footer-divider"></div>

                <!-- Bottom -->
                <div class="footer-bottom">
                    <span class="footer-copyright">© 2026 ClassSched. Tous droits réservés.</span>
                    <span class="footer-authors">
                        Réalisé par
                        <a href="https://github.com/Belvanie" target="_blank" rel="noopener">Belvanie</a>,
                        <a href="https://github.com/Blaise-dev" target="_blank" rel="noopener">Blaise.dev</a>
                        &amp;
                        <a href="https://github.com/GBETNKOM" target="_blank" rel="noopener">GBETNKOM</a>
                    </span>
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
    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: linear-gradient(155deg, rgba(16, 22, 48, 0.88), rgba(22, 30, 64, 0.75));
    backdrop-filter: blur(16px);
    box-shadow: 0 20px 48px rgba(6, 10, 28, 0.32);
}

/* Grid */
.footer-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 2.5rem;
}

/* Brand */
.footer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.footer-logo {
    width: 36px;
    height: 28px;
    object-fit: contain;
}

.footer-brand-name {
    font-size: 1.2rem;
    font-weight: 800;
    background: linear-gradient(135deg, #a78bfa, #f472b6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.footer-text {
    color: rgba(220, 225, 255, 0.72);
    font-size: 0.88rem;
    line-height: 1.75;
    margin: 0;
}

.footer-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 0.9rem;
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(167, 139, 250, 0.1);
    border: 1px solid rgba(167, 139, 250, 0.2);
    color: rgba(200, 185, 255, 0.85);
    font-size: 0.78rem;
    font-weight: 600;
}

.footer-badge i {
    color: #c084fc;
    font-size: 0.72rem;
}

/* Titles */
.footer-title {
    font-weight: 800;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(200, 208, 255, 0.55);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 7px;
}

.footer-title-icon {
    color: #a78bfa;
    font-size: 0.78rem;
}

/* Contact links */
.footer-contact-list {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    margin: 0;
}

.footer-contact-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(210, 218, 255, 0.78);
    text-decoration: none;
    font-size: 0.87rem;
    transition: color 0.2s;
}

.footer-contact-link i {
    color: #a78bfa;
    font-size: 0.78rem;
    flex-shrink: 0;
}

.footer-contact-link:hover {
    color: #e0d9ff;
}

/* Useful links */
.footer-links-list {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    margin: 0;
}

.footer-links-list a {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(210, 218, 255, 0.78);
    text-decoration: none;
    font-size: 0.87rem;
    font-weight: 500;
    transition: color 0.2s;
}

.footer-links-list a i {
    color: #a78bfa;
    font-size: 0.75rem;
    flex-shrink: 0;
}

.footer-links-list a:hover {
    color: #e0d9ff;
}

/* Divider */
.footer-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: 2rem 0 1.4rem;
}

/* Bottom bar */
.footer-bottom {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
}

.footer-copyright {
    color: rgba(200, 210, 255, 0.5);
    font-size: 0.82rem;
}

.footer-authors {
    color: rgba(200, 210, 255, 0.5);
    font-size: 0.82rem;
}

.footer-authors a {
    color: #c4b5fd;
    font-weight: 700;
    text-decoration: none;
    transition: color 0.2s;
}

.footer-authors a:hover {
    color: #f0e6ff;
}

/* Responsive */
@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr;
        gap: 1.8rem;
    }

    .footer-bottom {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.4rem;
    }
}
</style>
