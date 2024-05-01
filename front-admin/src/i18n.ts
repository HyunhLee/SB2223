import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {}
  },
  es: {
    translation: {
      'Language changed': 'Se ha cambiado el idioma.',
      'Your tier': 'Tu nivel',
      'General': 'General',
      'Overview': 'Visión general',
      'Analytics': 'Analítica',
      'Finance': 'Finanzas',
      'Logistics': 'Logística',
      'Account': 'Cuenta',
      'Management': 'Gestión',
      'Customers': 'Clientes',
      'List': 'Lista',
      'Details': 'Detalles',
      'Edit': 'Editar',
      'Products': 'Productos',
      'Create': 'Crear',
      'Orders': 'Pedidos',
      'Invoices': 'Facturas',
      'Platforms': 'Plataforma',
      'Job Listings': 'Listado de trabajos',
      'Browse': 'Buscar',
      'Social Media': 'Redes sociales',
      'Profile': 'Perfil',
      'Feed': 'Fuente social',
      'Blog': 'Blog',
      'Post List': 'Lista de articulos',
      'Post Details': 'Detalles del articulo',
      'Post Create': 'Create articulo',
      'Apps': 'Aplicaciones',
      'Kanban': 'Kanban',
      'Mail': 'Correo',
      'Chat': 'Chat',
      'Calendar': 'Calendario',
      'Pages': 'Páginas',
      'Auth': 'Autenticación',
      'Register': 'Registrarse',
      'Login': 'Acceso',
      'Pricing': 'Precios',
      'Checkout': 'Pago',
      'Contact': 'Contacto',
      'Error': 'Error',
      'Need Help?': '¿Necesitas ayuda?',
      'Check our docs': 'Consulte nuestros documentos',
      'Documentation': 'Documentación'
    }
  },
  ko: {
    translation: {
      'Language changed': '언어 변경',
      'Your tier': 'Ihre Stufe',
      'General': 'Allgemein',
      'Overview': '대시보드',
      'Analytics': 'Analytik',
      'Finance': 'Finanzen',
      'Logistics': 'Logistik',
      'Account': 'Konto',
      'Management': 'Verwaltung',
      'Customers': 'Kunden',
      'List': 'Aufführen',
      'Details': 'Einzelheiten',
      'Edit': 'Bearbeiten',
      'Products': 'Produkte',
      'Create': 'Schaffen',
      'Orders': 'Aufträge',
      'Invoices': 'Rechnungen',
      'Platforms': 'Plattform',
      'Job Listings': 'Stellenangebote',
      'Browse': 'Durchsuche',
      'Social Media': 'Sozialen Medien',
      'Profile': 'Profil',
      'Feed': 'Füttern',
      'Blog': 'Blog',
      'Post List': 'Beitragsliste',
      'Post Details': 'Beitragsdetails',
      'Post Create': 'Beitrag erstellen',
      'Apps': 'Apps',
      'Kanban': 'Kanban',
      'Mail': 'E-Mail',
      'Chat': 'Plaudern',
      'Calendar': 'Kalender',
      'Pages': 'Seiten',
      'Auth': 'Authentifizierung',
      'Register': 'Registrieren',
      'Login': 'Anmeldung',
      'Pricing': 'Preisgestaltung',
      'Checkout': 'Auschecken',
      'Contact': 'Kontakt',
      'Error': 'Fehler',
      'Need Help?': 'Brauchen Sie Hilfe?',
      'Check our docs': 'Überprüfen Sie unsere Dokumente',
      'Documentation': 'Dokumentation',
    }
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
