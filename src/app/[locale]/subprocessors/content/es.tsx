import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";
import { LAST_UPDATED_ES } from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;

export const subprocessorsEs: LegalDoc = {
  title: "Subencargados",
  subtitle: "Las empresas que tratan datos para Stroyka: qué hace cada una, qué recibe y dónde está.",
  effectiveDate: `Última actualización: ${LAST_UPDATED_ES}`,
  sections: [
    {
      id: "customer-data",
      title: "1. Proveedores que tratan los registros de tu empresa",
      content: (
        <>
          <p>Estos subencargados tratan los registros que tu empresa guarda en Stroyka, por cuenta de tu empresa, conforme a nuestro <Link href="/es/dpa">Anexo de Tratamiento de Datos</Link>.</p>
          <ul>
            <li><strong>Supabase</strong> &mdash; base de datos, inicio de sesión, almacenamiento de archivos y funciones de servidor. Recibe: todos los datos y archivos de la app. Ubicación: datos guardados en Fráncfort, Alemania; empresa de EE. UU.</li>
            <li><strong>Amazon Web Services</strong> &mdash; la infraestructura en la nube sobre la que funciona Supabase. Recibe: todos los datos y archivos de la app, que guarda para Supabase. Ubicación: Fráncfort, Alemania.</li>
            <li><strong>Anthropic</strong> &mdash; lee fotos de recibos y listas de compras, solo cuando un usuario elige escanear y lo ha permitido. Recibe: la foto que se escanea. Ubicación: Estados Unidos.</li>
            <li><strong>Resend</strong> &mdash; envía correos: facturas y recordatorios de pago a tus clientes, invitaciones a trabajadores, correos de inicio de sesión. Recibe: las direcciones de los destinatarios y el contenido del correo. Ubicación: Estados Unidos.</li>
            <li><strong>Sentry</strong> &mdash; informes de errores y fallos de las apps. Recibe: detalles del error, datos del dispositivo e ID de usuario, empresa y rol; un informe de error puede incluir parte del registro afectado. Ubicación: Estados Unidos.</li>
            <li><strong>Google (Firebase Cloud Messaging)</strong> &mdash; entrega notificaciones push a teléfonos Android y, a través del servicio de Apple, a iPhones. Recibe: el token del dispositivo y el texto de la notificación. Ubicación: Estados Unidos y global.</li>
            <li><strong>Apple (Apple Push Notification service)</strong> &mdash; entrega notificaciones push a iPhone. Recibe: el token del dispositivo y el texto de la notificación. Ubicación: Estados Unidos y global.</li>
            <li><strong>Cloudflare</strong> &mdash; guarda nuestras copias de seguridad cifradas. Recibe: copias cifradas de la base de datos y de los archivos (las claves las guardamos nosotros). Ubicación: Estados Unidos y global.</li>
            <li><strong>GitHub (Microsoft)</strong> &mdash; ejecuta en sus máquinas nuestras tareas de copia de seguridad: cada noche la base de datos y cada semana los archivos. Recibe: la base de datos y los archivos, por poco tiempo, mientras se copian y cifran para la copia de seguridad; al terminar la tarea no queda ninguna copia de seguridad en GitHub. Ubicación: Estados Unidos.</li>
          </ul>
        </>
      ),
    },
    {
      id: "our-data",
      title: "2. Proveedores que usamos para nuestros propios fines",
      content: (
        <>
          <p>Aquí Stroyka decide qué se trata y para qué, como describe nuestra <Link href="/es/privacy">Política de Privacidad</Link>. No reciben el contenido de los registros de tu empresa.</p>
          <ul>
            <li><strong>PostHog</strong> &mdash; analítica de uso de las apps y del sitio web, solo con consentimiento. Recibe: pantallas y funciones usadas, ID de usuario, empresa y rol, dirección IP. Ubicación: Estados Unidos.</li>
            <li><strong>Stripe</strong> &mdash; pago y facturación de las suscripciones compradas en nuestro sitio web. Recibe: datos de facturación y de pago. Ubicación: Estados Unidos.</li>
            <li><strong>RevenueCat</strong> &mdash; estado de las suscripciones compradas en las apps de iPhone y Android. Recibe: el ID de la empresa y la información de compra de Apple o Google. Ubicación: Estados Unidos.</li>
            <li><strong>Apple</strong> &mdash; suscripciones del App Store e inicio de sesión con Apple. Ubicación: Estados Unidos.</li>
            <li><strong>Google</strong> &mdash; suscripciones de Google Play e inicio de sesión con Google. Ubicación: Estados Unidos.</li>
            <li><strong>Cloudflare</strong> &mdash; nuestro dominio, el DNS y el reenvío del correo enviado a nuestras direcciones. Ubicación: Estados Unidos y global.</li>
            <li><strong>Vercel</strong> &mdash; aloja nuestro sitio web; registros web con direcciones IP; conteo de visitas sin cookies. Ubicación: Estados Unidos y global.</li>
            <li><strong>Meta</strong> &mdash; el píxel de Meta en nuestro sitio web, solo si el visitante acepta las cookies y nunca en la UE, el EEE ni el Reino Unido. Ubicación: Estados Unidos.</li>
            <li><strong>Telegram</strong> &mdash; avisa a nuestro equipo de que alguien envió el formulario de demo de nuestro sitio web (solo un aviso). Recibe: ningún dato personal; la solicitud nos llega por correo. Ubicación: Emiratos Árabes Unidos y global.</li>
          </ul>
        </>
      ),
    },
    {
      id: "safeguards",
      title: "3. Garantías",
      content: (
        <>
          <p>Cada proveedor de la sección 1 solo puede usar los datos para prestarnos su servicio, según cláusulas de protección de datos que los protegen al menos tan bien como nuestra Política de Privacidad y nuestro Anexo de Tratamiento de Datos. Lo mismo vale para los de la sección 2, salvo Apple y Google (para las compras e inicios de sesión hechos con ellos) y Meta, que actúan según sus propios términos y políticas de privacidad. Para los proveedores fuera del EEE, el Reino Unido y Suiza, las transferencias se basan en las Cláusulas Contractuales Tipo de la Comisión Europea (con el Anexo del Reino Unido) incluidas en los términos de ese proveedor, o en el Marco de Privacidad de Datos UE&ndash;EE. UU. cuando el proveedor está certificado en él.</p>
        </>
      ),
    },
    {
      id: "changes",
      title: "4. Cambios en esta lista",
      content: (
        <>
          <p>Escribimos a los dueños de empresa al menos 30 días antes de añadir o sustituir un proveedor de la sección 1, y actualizamos esta página. Si hay que sustituir un proveedor con urgencia por seguridad o para que el Servicio siga funcionando, se lo comunicamos lo antes posible. Una empresa puede oponerse como indica nuestro <Link href="/es/dpa">Anexo de Tratamiento de Datos</Link> (sección 6).</p>
          <p>Para recibir avisos de cambios aunque no seas dueño de una empresa, escribe a {SUPPORT} con el asunto &ldquo;Sub-processor updates&rdquo;.</p>
        </>
      ),
    },
  ],
};
