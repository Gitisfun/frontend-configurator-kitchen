<template>
  <footer class="footer">
    <div class="footer-main">
      <div class="footer-brand">
        <NuxtLink to="/" class="footer-logo-link">
          <img src="/logo_dekeukenfabriek_kleur.png" alt="De Keuken Fabriek" class="footer-logo" />
        </NuxtLink>
        <p class="footer-tagline">
          Design your dream kitchen with our interactive configurator.
        </p>
        <div class="footer-social">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
          </a>
          <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a4 4 0 1 1 8 0c0 2.5-1.5 4.5-3 6l-1 4" /><path d="M10.5 15.5L8 22" /><circle cx="12" cy="12" r="10" /></svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          </a>
        </div>
      </div>

      <div class="footer-column">
        <h4 class="footer-heading">Navigation</h4>
        <ul class="footer-list">
          <li><NuxtLink to="/" class="footer-link">Home</NuxtLink></li>
          <li><NuxtLink to="/configurator" class="footer-link">Configurator</NuxtLink></li>
          <li><NuxtLink to="/about" class="footer-link">About</NuxtLink></li>
          <li><NuxtLink to="/contact" class="footer-link">Contact</NuxtLink></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4 class="footer-heading">Contact</h4>
        <ul class="footer-list">
          <li class="footer-text">info@dekeukenfabriek.nl</li>
          <li class="footer-text">+31 (0)20 123 4567</li>
          <li class="footer-text">Keizersgracht 100</li>
          <li class="footer-text">1015 AA Amsterdam</li>
        </ul>
      </div>

      <div class="footer-column">
        <h4 class="footer-heading">Showroom</h4>
        <ul class="footer-list">
          <li class="footer-text">Monday – Friday: 9:00 – 18:00</li>
          <li class="footer-text">Saturday: 10:00 – 17:00</li>
          <li class="footer-text">Sunday: Closed</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p class="footer-copyright">
        &copy; {{ new Date().getFullYear() }} De Keuken Fabriek. All rights reserved.
      </p>
      <div class="footer-legal">
        <NuxtLink to="/privacy" class="footer-legal-link">Privacy Policy</NuxtLink>
        <NuxtLink to="/terms" class="footer-legal-link">Terms &amp; Conditions</NuxtLink>
        <NuxtLink to="/cookies" class="footer-legal-link">Cookie Policy</NuxtLink>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--footer-bg);
  color: var(--footer-text-color);
  padding: var(--footer-padding-y) var(--footer-padding-x);
}

.footer-main {
  max-width: var(--footer-max-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--footer-gap);
  padding-bottom: var(--footer-padding-y);
  border-bottom: 1px solid var(--footer-border-color);
}

.footer-brand {
  max-width: 280px;
}

.footer-logo-link {
  display: inline-block;
  transition: opacity 0.2s ease;
}

.footer-logo-link:hover {
  opacity: 0.8;
}

.footer-logo {
  height: var(--footer-logo-height);
  width: auto;
  filter: brightness(0) invert(1);
}

.footer-tagline {
  font-family: var(--font-sans);
  font-size: var(--footer-text-size);
  line-height: var(--line-height-body);
  color: var(--footer-text-muted);
  margin: 1rem 0 1.25rem;
}

.footer-social {
  display: flex;
  gap: 0.75rem;
}

.footer-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--footer-border-color);
  color: var(--footer-text-muted);
  transition: color 0.2s ease, border-color 0.2s ease;
}

.footer-social a:hover {
  color: var(--color-brand);
  border-color: var(--color-brand);
}

.footer-heading {
  font-family: var(--font-serif);
  font-size: var(--footer-heading-size);
  font-weight: 500;
  color: var(--footer-heading-color);
  letter-spacing: var(--letter-spacing-tight);
  margin: 0 0 1rem;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-link {
  font-family: var(--font-sans);
  font-size: var(--footer-text-size);
  color: var(--footer-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--color-brand);
}

.footer-text {
  font-family: var(--font-sans);
  font-size: var(--footer-text-size);
  color: var(--footer-text-muted);
  line-height: 1.6;
}

.footer-bottom {
  max-width: var(--footer-max-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding-top: var(--footer-bottom-padding-y);
}

.footer-copyright {
  font-family: var(--font-sans);
  font-size: var(--footer-small-text-size);
  color: var(--footer-text-muted);
  margin: 0;
}

.footer-legal {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer-legal-link {
  font-family: var(--font-sans);
  font-size: var(--footer-small-text-size);
  color: var(--footer-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-legal-link:hover {
  color: var(--color-brand);
}

@media (min-width: 768px) {
  .footer {
    padding: var(--footer-padding-y-desktop) var(--footer-padding-x-desktop);
  }

  .footer-main {
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    gap: var(--footer-gap-desktop);
    padding-bottom: var(--footer-padding-y-desktop);
  }

  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    padding-top: var(--footer-bottom-padding-y-desktop);
  }
}
</style>
