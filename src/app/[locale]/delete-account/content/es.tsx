import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";
import { LAST_UPDATED_ES, NOTICE_EFFECTIVE_ES } from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const DATE = NOTICE_EFFECTIVE_ES;
const REQUEST = (
  <a href="mailto:support@getstroyka.com?subject=Delete%20my%20account">
    escríbenos
  </a>
);

export const deleteAccountEs: LegalDoc = {
  title: "Eliminar tu cuenta de Stroyka",
  subtitle: "Cómo eliminar tu cuenta de Stroyka o tu empresa, qué se elimina y cuándo. No necesitas iniciar sesión para usar esta página.",
  effectiveDate: `Actualizada el ${LAST_UPDATED_ES}`,
  sections: [
    {
      id: "in-the-app",
      title: "1. Elimínala en la app",
      content: (
        <>
          <p>La forma más rápida es desde la app de Stroyka en tu teléfono:</p>
          <ul>
            <li><strong>Trabajadores:</strong> abre <strong>Perfil &rarr; Ajustes &rarr; Privacidad y datos &rarr; Eliminar mi cuenta</strong> y confirma.</li>
            <li><strong>Dueños de empresa:</strong> abre <strong>Perfil &rarr; Ajustes &rarr; Privacidad y datos &rarr; Eliminar mi empresa</strong> y confirma. La cuenta del dueño no se puede eliminar por separado; al eliminar la empresa se elimina también.</li>
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
          <p>Al eliminar tu cuenta, eliminas tu inicio de sesión y tus datos personales. A partir del {DATE}, el trabajo que hiciste para tu empresa se queda con tu empresa, con tu nombre.</p>
          <ul>
            <li><strong>A partir del {DATE}, se elimina de inmediato:</strong> tu cuenta y tu inicio de sesión, tus datos de contacto (teléfono), tus tokens de notificaciones push, tu configuración de notificaciones, tu consentimiento de ubicación y los puntos GPS registrados al marcar entrada y salida. Se cierra tu sesión y ya no puedes volver a entrar.</li>
            <li><strong>A partir del {DATE}, se queda con tu empresa, para sus registros de negocio y legales:</strong> los registros de trabajo que creaste para ella: horas, gastos y compras de materiales, recibos, viajes, solicitudes, bitácoras diarias, mensajes de tareas, fotos y videos. Se quedan con ella, con tu nombre, hasta que la empresa los elimine o elimine la empresa; muchas veces la ley obliga a los empleadores a conservar los registros de trabajo y de pago. Tu empresa es responsable de ellos. Si quieres que se eliminen, pídeselo a tu empresa: puede eliminarlos en la app y, a petición suya, los borraremos de forma permanente de nuestros servidores.</li>
            <li><strong>Hasta el {DATE}</strong> (en la app o por correo): de inmediato se elimina tu inicio de sesión, tu nombre se sustituye por &ldquo;Deleted user&rdquo;, se eliminan tu teléfono y tus notificaciones en la app, y tus horas (con sus puntos GPS), gastos y compras de materiales, viajes, solicitudes y bitácoras diarias desaparecen de la app. En un plazo de 31 días esos registros y sus fotos se borran de forma permanente de nuestros servidores, junto con tus tokens de notificaciones, tu configuración de notificaciones, tu tarifa de pago y tu consentimiento de ubicación. Tus recibos y sus fotos, tus mensajes de tareas con sus fotos y videos, y tus días libres no se eliminan: se quedan con tu empresa, como &ldquo;Deleted user&rdquo;, hasta que los elimine o elimine la empresa. Si quieres que se eliminen, pídeselo a tu empresa, o pídenoslo y le pasaremos tu solicitud.</li>
            {/* remove when min app version ≥ 1.0.62 */}
            <li><strong>Versiones anteriores de la app:</strong> una versión de la app anterior a la 1.0.62 elimina como se describe en &ldquo;Hasta el {DATE}&rdquo;, incluso después de esa fecha. Para que se queden con tu empresa, actualiza la app antes.</li>
          </ul>
        </>
      ),
    },
    {
      id: "company",
      title: "4. Eliminar toda una empresa",
      content: (
        <p>Cuando el dueño elimina la empresa, todo su contenido se oculta de inmediato para todos, y en un plazo de 31 días borramos de forma permanente todos los datos y archivos de la empresa, incluidos sus proyectos, registros de trabajo, fotos, clientes y facturas.</p>
      ),
    },
    {
      id: "what-we-keep",
      title: "5. Qué conservamos y por cuánto tiempo",
      content: (
        <ul>
          <li><strong>Copias de seguridad.</strong> Nuestras copias cifradas no se modifican después de hechas. Los datos eliminados salen de ellas a medida que caducan: las copias de la base de datos en un plazo de 7 meses y las de archivos en un plazo de 13 meses.</li>
          <li><strong>Si tu empleador te dio de baja</strong>, los registros de trabajo que creaste se quedan con esa empresa como registros de su negocio, con tu nombre, hasta que la empresa los elimine o elimine la empresa; a partir del {DATE}, igual que si eliminas tu propia cuenta. Igualmente puedes pedirnos que eliminemos tu cuenta.</li>
          <li><strong>Los registros de pago</strong> de las suscripciones los conservan Apple, Google o Stripe según sus propias políticas.</li>
          <li><strong>Requisitos legales.</strong> Podemos conservar cierta información por más tiempo si la ley lo exige.</li>
        </ul>
      ),
    },
    {
      id: "subscriptions",
      title: "6. Suscripciones",
      content: (
        <p>Eliminar tu cuenta o tu empresa <strong>no cancela una suscripción</strong>. Cancela una suscripción del App Store en los ajustes de tu Apple ID, y una de Google Play en Google Play &rsaquo; Pagos y suscripciones &rsaquo; Suscripciones. Si la compraste en nuestro sitio web, cancélala en línea en getstroyka.com/account, o escribe a {SUPPORT} desde el correo de tu cuenta y la cancelaremos.</p>
      ),
    },
    {
      id: "questions",
      title: "7. Preguntas",
      content: (
        <p>Nuestra <Link href="/es/privacy">Política de Privacidad</Link> (sección 9) tiene todos los detalles. Para cualquier otra cosa, escribe a {SUPPORT}.</p>
      ),
    },
  ],
};
