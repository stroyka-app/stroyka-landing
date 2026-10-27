import Link from "next/link";
import type { LegalDoc } from "./types";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;

export const privacyEs: LegalDoc = {
  title: "Política de Privacidad",
  subtitle: "Qué datos recopila Stroyka, a quién se envían, cuánto tiempo los guardamos y cómo eliminarlos.",
  effectiveDate: "Vigente desde abril de 2026 · Actualizada el 26 de octubre de 2026",
  sections: [
    {
      id: "who-we-are",
      title: "1. Quiénes somos y qué cubre esta política",
      content: (
        <>
          <p>Stroyka es operada por Dalen Meridian LLC, una sociedad de responsabilidad limitada de Texas, EE. UU. (&ldquo;Stroyka&rdquo;, &ldquo;nosotros&rdquo;). Esta política cubre las apps de Stroyka para iPhone y Android y nuestro sitio web, getstroyka.com.</p>
          <p>Stroyka es una herramienta de negocio. El dueño de una empresa (el &ldquo;Jefe&rdquo;) crea la cuenta de la empresa e invita a su cuadrilla (los &ldquo;Trabajadores&rdquo;). La empresa también ingresa datos de sus propios clientes, como nombres y correos para las facturas. Sobre los datos que una empresa ingresa de sus trabajadores y clientes, la empresa decide qué recopilar y para qué, y nosotros los tratamos en su nombre para hacer funcionar el servicio. La empresa es responsable de tener derecho a guardar y usar esos datos.</p>
        </>
      ),
    },
    {
      id: "info-collect",
      title: "2. Qué información recopilamos",
      content: (
        <>
          <h3>2.1 Información que ingresas tú o tu empresa</h3>
          <ul>
            <li><strong>Datos de la cuenta:</strong> tu nombre, correo electrónico, teléfono (opcional) y tu contraseña o tu inicio de sesión con Apple o Google.</li>
            <li><strong>Datos de la empresa:</strong> nombre de la empresa y, opcionalmente, dirección, teléfono, correo, logotipo, número de identificación fiscal y datos de licencia que aparecen en las facturas.</li>
            <li><strong>Registros de trabajo:</strong> proyectos y presupuestos, horas y registros de tiempo, tarifas y forma de pago fijadas por la empresa, compras de materiales y otros gastos, recibos, viajes y kilometraje, listas de compras, tareas y comentarios, bitácoras diarias y días libres.</li>
            <li><strong>Fotos y archivos:</strong> fotos de recibos, de la obra y otros adjuntos que subes.</li>
            <li><strong>Clientes de tu empresa:</strong> nombres, correos, teléfonos, direcciones y notas de los clientes, y las facturas que se les envían.</li>
            <li><strong>Tus mensajes:</strong> todo lo que nos envías por correo o desde la app.</li>
          </ul>

          <h3>2.2 Información que se recopila automáticamente</h3>
          <ul>
            <li><strong>Datos del dispositivo:</strong> modelo, sistema operativo, versión de la app e idioma.</li>
            <li><strong>Token de notificaciones push:</strong> un identificador que nos permite enviar notificaciones a tu dispositivo.</li>
            <li><strong>Datos de uso (PostHog):</strong> qué pantallas y funciones se usan, vinculados a tu ID de usuario, el ID de tu empresa y tu rol. Recibimos tu dirección IP y de ella se deduce una ubicación aproximada (ciudad y país). Puedes desactivarlo en la app (ver sección 9).</li>
            <li><strong>Informes de errores y fallos (Sentry):</strong> detalles del error, dispositivo y sistema operativo, vinculados a tu ID de usuario, ID de empresa y rol.</li>
            <li><strong>Registros del servidor:</strong> direcciones IP y datos de las solicitudes, como parte del funcionamiento normal y la seguridad.</li>
          </ul>

          <h3>2.3 Ubicación</h3>
          <p>Si tu empresa activa el reloj con GPS, Stroyka registra la ubicación precisa de tu teléfono <strong>solo en el momento en que marcas entrada o salida</strong>, para confirmar que estás en la obra:</p>
          <ul>
            <li>La ubicación se toma solo al marcar entrada y salida &mdash; nunca de forma continua y nunca en segundo plano.</li>
            <li>Cada punto (latitud, longitud y precisión) se guarda con ese registro de tiempo y lo pueden ver los encargados de tu empresa.</li>
            <li>Se necesita tu consentimiento en Stroyka y el permiso de tu teléfono. Puedes negarte y desactivarlo cuando quieras en la app (Perfil &rarr; Privacidad y datos &rarr; Ubicación al marcar) o en los ajustes del teléfono. Puedes seguir marcando; el registro simplemente queda sin ubicación.</li>
            <li>Guardamos cuándo diste y cuándo retiraste tu consentimiento.</li>
            <li>Nunca usamos tu ubicación para publicidad ni para rastrearte en otras apps o sitios web.</li>
          </ul>

          <h3>2.4 Nuestro sitio web</h3>
          <ul>
            <li><strong>Analítica:</strong> páginas vistas, sitio de procedencia y clics en botones (PostHog). No grabamos tu pantalla ni tu sesión.</li>
            <li><strong>Formularios:</strong> si pides una demostración, recibimos tu nombre, empresa, tamaño de la cuadrilla, correo y, opcionalmente, tu teléfono y mensaje.</li>
            <li><strong>Compras:</strong> si te suscribes en el sitio web, el pago lo procesa Stripe (ver sección 4).</li>
          </ul>

          <h3>2.5 Lo que no recopilamos</h3>
          <ul>
            <li>Tu ubicación en segundo plano o en cualquier momento que no sea al marcar entrada o salida.</li>
            <li>Datos biométricos.</li>
            <li>Números de tarjeta o de cuenta bancaria. Los pagos los procesan Apple o Stripe, y no vemos el número completo de tu tarjeta.</li>
            <li>Números de Seguro Social ni copias de documentos de identidad. (Una empresa puede ingresar su propio número fiscal para que aparezca en sus facturas.)</li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "3. Cómo usamos la información",
      content: (
        <ul>
          <li><strong>Para hacer funcionar el servicio:</strong> guardar y sincronizar los registros de la empresa, calcular costos y pagos, generar informes y facturas, y permitir que jefes y trabajadores colaboren.</li>
          <li><strong>Para iniciar sesión</strong> y dar a cada persona el acceso que le corresponde según su rol.</li>
          <li><strong>Para confirmar la asistencia en la obra</strong> cuando el reloj con GPS está activado.</li>
          <li><strong>Para leer recibos y listas de compras por ti:</strong> cuando usas esta función, la foto (o el texto de la lista) se envía a nuestro proveedor de IA, Anthropic, que devuelve los artículos e importes que lee. Tú revisas el resultado y lo guardas.</li>
          <li><strong>Para enviar correos:</strong> correos de inicio de sesión y de contraseña, invitaciones a trabajadores, y facturas y recordatorios de pago que una empresa envía a sus propios clientes a través de Stroyka. Después de registrarte también enviamos un correo de bienvenida de nuestro fundador, y podemos escribirte personalmente para saber cómo te va. Responde pidiéndonos que paremos y lo haremos.</li>
          <li><strong>Para enviar notificaciones push</strong> sobre el trabajo en tu empresa. Puedes desactivarlas en los ajustes del teléfono.</li>
          <li><strong>Para mejorar el servicio:</strong> la analítica de uso y los informes de errores nos ayudan a encontrar fallos y decidir qué construir.</li>
          <li><strong>Para darte soporte</strong> y responder tus mensajes.</li>
          <li><strong>Para mantener el servicio seguro:</strong> prevenir abusos, fraude y accesos no autorizados, y hacer cumplir nuestros Términos.</li>
        </ul>
      ),
    },
    {
      id: "sharing",
      title: "4. Con quién la compartimos",
      content: (
        <>
          <p><strong>No vendemos tu información personal</strong> y no compartimos los datos de la app con anunciantes.</p>
          <p><strong>Dentro de tu empresa:</strong> lo que ingresas lo ven otras personas de tu empresa según su rol. Los encargados pueden ver las horas, gastos, pagos y ubicaciones de marcado de los trabajadores.</p>
          <p><strong>Proveedores de servicios</strong> que operan partes de Stroyka por nosotros; cada uno recibe solo lo que necesita para su tarea:</p>
          <ul>
            <li><strong>Supabase</strong> &mdash; nuestra base de datos, inicio de sesión, almacenamiento de archivos y funciones de servidor. Alojado en Amazon Web Services en Fráncfort, Alemania. Guarda todos los datos y archivos de la app.</li>
            <li><strong>Anthropic</strong> (EE. UU.) &mdash; lee fotos de recibos y fotos o texto de listas de compras cuando usas esa función.</li>
            <li><strong>PostHog</strong> (EE. UU.) &mdash; analítica de uso de la app y del sitio web, como se describe en la sección 2.</li>
            <li><strong>Sentry</strong> (EE. UU.) &mdash; informes de errores y fallos.</li>
            <li><strong>Resend</strong> (EE. UU.) &mdash; envía nuestros correos, incluidas las facturas y recordatorios a los clientes de una empresa. Recibe la dirección del destinatario y el contenido del correo.</li>
            <li><strong>Google</strong> &mdash; inicio de sesión con Google y Firebase Cloud Messaging, que entrega las notificaciones push usando el token de tu dispositivo.</li>
            <li><strong>Apple</strong> &mdash; inicio de sesión con Apple, suscripciones del App Store y entrega de notificaciones a iPhone.</li>
            <li><strong>RevenueCat</strong> &mdash; controla el estado de las suscripciones compradas en la app de iPhone. Recibe el ID de tu empresa y los datos de compra de Apple.</li>
            <li><strong>Stripe</strong> &mdash; pago y facturación de las suscripciones compradas en nuestro sitio web. Stripe recibe tus datos de pago directamente.</li>
            <li><strong>Cloudflare</strong> &mdash; nuestro dominio y DNS, el reenvío de correos a nuestras direcciones y el almacenamiento de nuestras copias de seguridad cifradas.</li>
            <li><strong>Vercel</strong> &mdash; aloja nuestro sitio web y procesa registros web estándar, incluidas direcciones IP.</li>
            <li><strong>Upstash</strong> &mdash; limita la frecuencia de solicitudes en los formularios y el pago del sitio web. Usa tu dirección IP y, en el formulario de demostración, un hash irreversible del correo ingresado.</li>
            <li><strong>Telegram</strong> &mdash; avisa a nuestro equipo cuando alguien envía el formulario de demostración, con los datos del formulario.</li>
            <li><strong>Meta</strong> &mdash; el píxel de Meta, solo en nuestro sitio web (ver sección 10). No está en la app. <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Política de privacidad de Meta</a></li>
          </ul>
          <p>También podemos divulgar información si lo exige la ley, un tribunal o una autoridad, o si creemos que es necesario para proteger los derechos, bienes o seguridad de Stroyka, de nuestros usuarios o del público.</p>
        </>
      ),
    },
    {
      id: "transfers",
      title: "5. Dónde se tratan tus datos",
      content: (
        <p>Los datos y archivos de la app se guardan en Alemania (Supabase, en Amazon Web Services en Fráncfort). Varios de los proveedores de la sección 4 están en Estados Unidos, así que parte de tu información también se trata en EE. UU. Estés donde estés, tu información puede tratarse fuera de tu país.</p>
      ),
    },
    {
      id: "data-isolation",
      title: "6. Separación de datos entre empresas",
      content: (
        <>
          <p>Los datos de cada empresa están separados de los de todas las demás a nivel de base de datos, mediante políticas de Row Level Security:</p>
          <ul>
            <li>Ningún usuario de una empresa puede ver ni cambiar los datos de otra.</li>
            <li>La separación la aplica la propia base de datos, no solo el código de la app.</li>
            <li>Nuestro equipo mira los datos de una empresa solo cuando hace falta para darle soporte y con su permiso.</li>
          </ul>
        </>
      ),
    },
    {
      id: "storage-security",
      title: "7. Seguridad y copias de seguridad",
      content: (
        <>
          <p>7.1. Los datos se cifran en tránsito (TLS) y en reposo con nuestro proveedor de alojamiento.</p>
          <p>7.2. Los datos que la app guarda en tu teléfono para trabajar sin conexión están cifrados (SQLCipher / sqlite3mc), con claves guardadas en el almacenamiento seguro del teléfono (Keychain en iPhone, Keystore en Android).</p>
          <p>7.3. Hacemos nuestras propias copias de seguridad de la base de datos y de los archivos subidos. Se cifran antes de salir de nuestros sistemas y se guardan en Cloudflare.</p>
          <p>7.4. Usamos acceso por roles, límites de frecuencia, validación de datos y registro de auditoría.</p>
          <p>7.5. Ningún método de almacenamiento o transmisión es totalmente seguro, y no podemos garantizar una seguridad absoluta.</p>
        </>
      ),
    },
    {
      id: "retention",
      title: "8. Cuánto tiempo guardamos los datos y cómo eliminarlos",
      content: (
        <>
          <p>8.1. <strong>Mientras usas Stroyka</strong>, guardamos tus datos mientras existan tu cuenta y tu empresa.</p>
          <p>8.2. <strong>Cancelar un plan de pago no elimina nada.</strong> Tu empresa pasa al plan Gratis y tus datos se conservan.</p>
          <p>8.3. <strong>Eliminar tu cuenta (trabajadores).</strong> En la app ve a Perfil &rarr; Privacidad y datos &rarr; Eliminar mi cuenta, o escribe a {SUPPORT} desde el correo de tu cuenta (ver <Link href="/es/delete-account">getstroyka.com/es/delete-account</Link>). Esto elimina tu cuenta <strong>y los registros que creaste</strong>: tus horas, gastos y compras de materiales, viajes, solicitudes y bitácoras diarias. Desaparecen de la app de inmediato y en lugar de tu nombre se muestra &ldquo;Deleted user&rdquo; (usuario eliminado). En un plazo de 30 días borramos de forma permanente de nuestros servidores tu inicio de sesión, tus datos de contacto, tus tokens de notificaciones, tus puntos de ubicación, y tus registros y sus fotos.</p>
          <p>8.4. <strong>Dueños de empresa.</strong> El dueño de una empresa no puede eliminar solo su propia cuenta. En su lugar elimina toda la empresa (8.5) o nos escribe a {SUPPORT}.</p>
          <p>8.5. <strong>Eliminar una empresa.</strong> El dueño puede eliminar la empresa en la app (Perfil &rarr; Privacidad y datos &rarr; Eliminar mi empresa). Todo se oculta de inmediato para todos en la empresa, y en un plazo de 30 días borramos de forma permanente todos los datos y archivos de la empresa. Eliminar la empresa no cancela una suscripción; cancélala por separado (ver nuestros <Link href="/es/terms">Términos</Link>, sección 7).</p>
          <p>8.6. <strong>Si una empresa da de baja a un trabajador</strong> (en lugar de que el trabajador elimine su propia cuenta), los registros de trabajo que creó se quedan con la empresa como registros de su negocio, mostrados con su nombre, hasta que la empresa los elimine o elimine la empresa. El trabajador puede pedirnos igualmente que eliminemos su cuenta, como en 8.3.</p>
          <p>8.7. <strong>Copias de seguridad.</strong> Los datos eliminados no salen de inmediato de las copias de seguridad existentes. Salen a medida que esas copias caducan: las copias de la base de datos se guardan hasta 6 meses y las de los archivos hasta 1 año.</p>
          <p>8.8. <strong>Los datos de analítica y de errores</strong> los conservan PostHog y Sentry durante sus plazos de retención. Guardamos los correos de soporte mientras los necesitemos para ayudarte y llevar nuestros registros.</p>
          <p>8.9. Podemos conservar información por más tiempo cuando la ley lo exija, o para resolver una disputa o hacer cumplir nuestros Términos.</p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "9. Tus opciones y derechos",
      content: (
        <>
          <h3>Para todos</h3>
          <ul>
            <li><strong>Ver y corregir:</strong> puedes ver tus datos en la app y actualizar tus datos en Perfil.</li>
            <li><strong>Descargar:</strong> Perfil &rarr; Privacidad y datos &rarr; Descargar mis datos te da una copia de tus datos. Los jefes también pueden exportar informes (por ejemplo a PDF, CSV o Excel).</li>
            <li><strong>Eliminar:</strong> ver la sección 8 y <Link href="/es/delete-account">getstroyka.com/es/delete-account</Link>.</li>
            <li><strong>Analítica:</strong> desactiva Perfil &rarr; Privacidad y datos &rarr; Compartir datos de uso.</li>
            <li><strong>Ubicación:</strong> desactiva Ubicación al marcar en la misma pantalla o en los ajustes del teléfono.</li>
          </ul>
          <p>Si una empresa guarda información sobre ti &mdash; por ejemplo, eres su trabajador o su cliente &mdash;, puedes pedírsela directamente a esa empresa. También puedes escribirnos y te ayudaremos.</p>

          <h3>Residentes de California (CCPA)</h3>
          <ul>
            <li><strong>Derecho a saber</strong> qué información personal hemos recopilado sobre ti.</li>
            <li><strong>Derecho a eliminar</strong> esa información, con las excepciones legales.</li>
            <li><strong>Derecho a corregir</strong> información inexacta.</li>
            <li><strong>Venta:</strong> no vendemos información personal.</li>
            <li><strong>No discriminación:</strong> no te trataremos de forma distinta por ejercer estos derechos.</li>
          </ul>
          <p>Para ejercer estos derechos, escribe a {SUPPORT}. Respondemos a las solicitudes verificables en un plazo de 45 días.</p>

          <h3>Usuarios en la UE y el Reino Unido (RGPD)</h3>
          <ul>
            <li>Derechos de acceso, rectificación, supresión y portabilidad.</li>
            <li>Derechos a limitar el tratamiento o a oponerte a él.</li>
            <li>Derecho a retirar tu consentimiento en cualquier momento (por ejemplo, el de ubicación).</li>
            <li>Derecho a presentar una reclamación ante tu autoridad local de protección de datos.</li>
          </ul>
          <p>Nos basamos en: (a) la ejecución de un contrato, para prestar el servicio; (b) el interés legítimo, para mejorar y proteger el servicio y enviar nuestros correos de bienvenida y seguimiento; y (c) el consentimiento, cuando lo pedimos, como la ubicación al marcar.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "10. Cookies y seguimiento",
      content: (
        <>
          <p>10.1. <strong>La app</strong> no tiene publicidad y no te rastrea en apps ni sitios web de otras empresas.</p>
          <p>10.2. <strong>Nuestro sitio web</strong> usa cookies de analítica de PostHog para entender cómo lo usan los visitantes. No grabamos tu pantalla ni tu sesión.</p>
          <p>10.3. El sitio también carga el píxel publicitario de Meta (Facebook), que instala cookies de terceros e informa a Meta de que hubo una visita o un clic para registrarse, para que podamos medir nuestros anuncios. No se carga para visitantes del Espacio Económico Europeo ni del Reino Unido, ni cuando no podemos saber el país del visitante. La protección contra rastreo del navegador o un bloqueador de anuncios también lo detienen, y el sitio funciona igual sin él.</p>
          <p>10.4. Para tomar esa decisión, el sitio guarda durante un día una cookie con el código de dos letras de tu país.</p>
        </>
      ),
    },
    {
      id: "third-party",
      title: "11. Enlaces de terceros",
      content: (
        <p>El servicio puede enlazar a otros sitios o servicios. No somos responsables de sus prácticas de privacidad; te recomendamos leer sus políticas de privacidad.</p>
      ),
    },
    {
      id: "children",
      title: "12. Privacidad de menores",
      content: (
        <p>Stroyka no está dirigida a menores de 18 años, y no recopilamos a sabiendas información de menores de 18. Si descubrimos que lo hemos hecho, la eliminaremos.</p>
      ),
    },
    {
      id: "changes",
      title: "13. Cambios en esta política",
      content: (
        <p>Podemos actualizar esta política. Si los cambios son importantes, te avisaremos por correo o en la app al menos 30 días antes de que entren en vigor. Si sigues usando Stroyka después de esa fecha, se aplica la política actualizada.</p>
      ),
    },
    {
      id: "contact",
      title: "14. Contacto",
      content: (
        <>
          <p>Preguntas, solicitudes sobre tus datos o inquietudes:</p>
          <p>
            Dalen Meridian LLC (d/b/a Stroyka)<br />
            Correo: {SUPPORT}<br />
            Sitio web: <a href="https://getstroyka.com">getstroyka.com</a>
          </p>
          <p>Para solicitudes de privacidad, escribe &ldquo;Privacy&rdquo; en el asunto.</p>
        </>
      ),
    },
  ],
};
