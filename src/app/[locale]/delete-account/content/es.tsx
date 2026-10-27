import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const REQUEST = (
  <a href="mailto:support@getstroyka.com?subject=Delete%20my%20account">
    escríbenos
  </a>
);

export const deleteAccountEs: LegalDoc = {
  title: "Eliminar tu cuenta",
  subtitle: "Cómo eliminar tu cuenta de Stroyka o tu empresa, qué se elimina y cuándo. No necesitas iniciar sesión para usar esta página.",
  effectiveDate: "Actualizada el 26 de octubre de 2026",
  sections: [
    {
      id: "in-the-app",
      title: "1. Elimínala en la app",
      content: (
        <>
          <p>La forma más rápida es desde la app de Stroyka en tu teléfono:</p>
          <ul>
            <li><strong>Trabajadores:</strong> abre <strong>Perfil &rarr; Privacidad y datos &rarr; Eliminar mi cuenta</strong> y confirma.</li>
            <li><strong>Dueños de empresa:</strong> abre <strong>Perfil &rarr; Privacidad y datos &rarr; Eliminar mi empresa</strong> y confirma. La cuenta del dueño no se puede eliminar por separado; al eliminar la empresa se elimina también.</li>
          </ul>
          <p>Se cierra tu sesión en cuanto termina la eliminación.</p>
        </>
      ),
    },
    {
      id: "by-email",
      title: "2. O pídenoslo por correo",
      content: (
        <>
          <p>Si no puedes usar la app, {REQUEST} a {SUPPORT}:</p>
          <ul>
            <li>Escribe <strong>desde el correo de tu cuenta de Stroyka</strong>, para que sepamos que la solicitud es tuya.</li>
            <li>Usa el asunto <strong>&ldquo;Delete my account&rdquo;</strong> (también vale &ldquo;Eliminar mi cuenta&rdquo;).</li>
            <li>Dinos el nombre de tu empresa. Si eres el dueño, indica si quieres eliminar toda la empresa.</li>
            <li>Si iniciaste sesión con Apple o Google, escribe desde el correo de ese Apple ID o cuenta de Google. Si no puedes, dínoslo en el correo y buscaremos otra forma de confirmar que eres tú.</li>
          </ul>
          <p>Te responderemos para confirmar y completaremos la eliminación en un plazo de 30 días desde que confirmemos la solicitud.</p>
        </>
      ),
    },
    {
      id: "what-is-deleted",
      title: "3. Qué se elimina y cuándo",
      content: (
        <>
          <p>Al eliminar tu cuenta, eliminamos <strong>tu cuenta y los registros que creaste</strong>: tus horas, gastos y compras de materiales, viajes, solicitudes y bitácoras diarias.</p>
          <ul>
            <li><strong>De inmediato:</strong> tus registros desaparecen de la app para todos en tu empresa, en lugar de tu nombre se muestra &ldquo;Deleted user&rdquo; (usuario eliminado) y ya no puedes iniciar sesión.</li>
            <li><strong>En un plazo de 30 días:</strong> borramos de forma permanente de nuestros servidores tu inicio de sesión, tus datos de contacto, tus tokens de notificaciones push, tus puntos de ubicación al marcar, y tus registros y sus fotos.</li>
          </ul>
        </>
      ),
    },
    {
      id: "company",
      title: "4. Eliminar toda una empresa",
      content: (
        <p>Cuando el dueño elimina la empresa, todo su contenido se oculta de inmediato para todos, y en un plazo de 30 días borramos de forma permanente todos los datos y archivos de la empresa, incluidos sus proyectos, registros de trabajo, fotos, clientes y facturas.</p>
      ),
    },
    {
      id: "what-we-keep",
      title: "5. Qué conservamos y por cuánto tiempo",
      content: (
        <ul>
          <li><strong>Copias de seguridad.</strong> Nuestras copias cifradas no se modifican después de hechas. Los datos eliminados salen de ellas a medida que caducan: las copias de la base de datos en un plazo de 6 meses y las de archivos en un plazo de 1 año.</li>
          <li><strong>Si tu empleador te dio de baja</strong> (en lugar de que eliminaras tu propia cuenta), los registros de trabajo que creaste se quedan con esa empresa como registros de su negocio, con tu nombre, hasta que la empresa los elimine o elimine la empresa. Igualmente puedes pedirnos que eliminemos tu cuenta.</li>
          <li><strong>Los registros de pago</strong> de las suscripciones los conservan Apple o Stripe según sus propias políticas.</li>
          <li><strong>Requisitos legales.</strong> Podemos conservar cierta información por más tiempo si la ley lo exige.</li>
        </ul>
      ),
    },
    {
      id: "subscriptions",
      title: "6. Suscripciones",
      content: (
        <p>Eliminar tu cuenta o tu empresa <strong>no cancela una suscripción</strong>. Cancela una suscripción del App Store en los ajustes de tu Apple ID. Si la compraste en nuestro sitio web, cancélala desde la pantalla de facturación de la app o escribe a {SUPPORT}.</p>
      ),
    },
    {
      id: "questions",
      title: "7. Preguntas",
      content: (
        <p>Nuestra <Link href="/es/privacy">Política de Privacidad</Link> (sección 8) tiene todos los detalles. Para cualquier otra cosa, escribe a {SUPPORT}.</p>
      ),
    },
  ],
};
