import Link from "next/link";
import type { LegalDoc } from "./types";
import {
  EU_REPRESENTATIVE,
  LAST_UPDATED_ES,
  NOTICE_EFFECTIVE_ES,
  POSTAL_ADDRESS,
  RETENTION,
  UK_REPRESENTATIVE,
} from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const DATE = NOTICE_EFFECTIVE_ES;
const R = RETENTION.es;

export const privacyEs: LegalDoc = {
  title: "Política de Privacidad",
  subtitle: "Qué recopila Stroyka, para qué, a dónde va, cuánto tiempo lo guardamos y cómo eliminarlo.",
  effectiveDate: `Vigente desde: abril de 2026 · Última actualización: ${LAST_UPDATED_ES} · Los cambios con fecha entran en vigor el ${DATE}`,
  sections: [
    {
      id: "who-we-are",
      title: "1. Quiénes somos y qué cubre esta política",
      content: (
        <>
          <p>Stroyka es operado por Dalen Meridian LLC, una sociedad de responsabilidad limitada de Texas (&ldquo;Stroyka&rdquo;, &ldquo;nosotros&rdquo;), con domicilio en {POSTAL_ADDRESS}. Esta política cubre las apps móviles de Stroyka para iPhone y Android y nuestro sitio web, getstroyka.com.</p>
          <p>Stroyka es una herramienta para negocios. El dueño de una empresa (el &ldquo;Jefe&rdquo;) crea una cuenta de empresa e invita a su cuadrilla (&ldquo;Trabajadores&rdquo;). La empresa también ingresa información de sus propios clientes, como nombres y correos para las facturas.</p>
          <ul>
            <li><strong>Tu empresa decide sobre sus registros.</strong> Sobre lo que una empresa ingresa de sus trabajadores y clientes &mdash; horas, tarifas, ubicaciones al marcar, gastos, recibos, fotos, mensajes, datos de clientes y facturas &mdash; la empresa decide qué recopilar y para qué. En las leyes de privacidad es el &ldquo;responsable&rdquo; (en otros países, &ldquo;controller&rdquo;, &ldquo;operador&rdquo; o &ldquo;data fiduciary&rdquo;). Nosotros somos su encargado: tratamos esa información solo para prestarle el servicio, conforme a nuestro <Link href="/es/dpa">Anexo de Tratamiento de Datos</Link>. La empresa es responsable de tener derecho a guardarla y usarla y de informar a su gente cuando la ley lo exija.</li>
            <li><strong>Nosotros decidimos sobre nuestros propios datos.</strong> Para tu cuenta e inicio de sesión, la facturación, la analítica de uso, los informes de fallos, los registros de seguridad, nuestros correos y nuestro sitio web, Stroyka es el responsable.</li>
          </ul>
          <p><strong>Contacto de privacidad.</strong> Nuestro fundador es el responsable de la privacidad en Stroyka. Escribe a {SUPPORT} con &ldquo;Privacy&rdquo; en el asunto. También es nuestro Oficial de Protección de Datos según la Ley de Privacidad de Datos de Filipinas y la persona a cargo de la protección de la información personal según la ley de Quebec. Nuestros representantes en la UE y el Reino Unido figuran en la sección 16.</p>
        </>
      ),
    },
    {
      id: "info-collect",
      title: "2. Información que recopilamos",
      content: (
        <>
          <h3>2.1 Información que ingresas tú o tu empresa</h3>
          <ul>
            <li><strong>Datos de la cuenta:</strong> tu nombre, correo, número de teléfono (opcional) y tu contraseña o tu inicio de sesión con Apple o Google.</li>
            <li><strong>Datos de la empresa:</strong> nombre de la empresa y, opcionalmente, dirección, teléfono, correo, logotipo, número fiscal y datos de licencia que aparecen en las facturas.</li>
            <li><strong>Registros de trabajo:</strong> proyectos y presupuestos, horas y registros de tiempo, tarifas y forma de pago que fija la empresa, compras de materiales y otros gastos, recibos, viajes y kilometraje, listas de compras, tareas y comentarios, bitácoras diarias y días libres.</li>
            <li><strong>Fotos, videos y archivos:</strong> fotos de recibos, fotos de obra, videos (con su sonido) y otros adjuntos que subes.</li>
            <li><strong>Clientes de tu empresa:</strong> nombres, correos, teléfonos, direcciones y notas de los clientes, y las facturas que se les envían.</li>
            <li><strong>Mensajes para nosotros:</strong> todo lo que nos envías por correo o desde la app.</li>
          </ul>

          <h3>2.2 Información que se recopila automáticamente</h3>
          <ul>
            <li><strong>Datos del dispositivo:</strong> modelo, sistema operativo, versión de la app e idioma.</li>
            <li><strong>Token de notificaciones push:</strong> un identificador que nos permite enviar notificaciones a tu dispositivo.</li>
            <li><strong>Analítica de uso (PostHog), solo si aceptas.</strong> Desde la versión 1.0.62, la app te pregunta una vez y la analítica queda desactivada hasta que digas que sí. Puedes cambiar tu respuesta cuando quieras en Perfil &rarr; Privacidad y datos &rarr; Compartir datos de uso. Las versiones anteriores de la app envían analítica de uso salvo que la desactives en ese mismo lugar. Cuando está activada, recibimos qué pantallas y funciones se usan, vinculadas a tu ID de usuario, el ID de tu empresa y tu rol; recibimos tu dirección IP y a partir de ella se deduce una ubicación aproximada (ciudad y país).</li>
            <li><strong>Informes de errores y fallos (Sentry), siempre activos:</strong> detalles del error, dispositivo, sistema operativo y versión de la app, vinculados a tu ID de usuario, ID de empresa y rol. Los necesitamos para encontrar y corregir fallos y mantener la app segura, así que no se pueden desactivar.</li>
            <li><strong>Registros del servidor:</strong> direcciones IP y detalles de las solicitudes, como parte del funcionamiento normal y la seguridad.</li>
          </ul>

          <h3>2.3 Ubicación</h3>
          <p>Si tu empresa activa el reloj con GPS, Stroyka registra la ubicación precisa de tu teléfono <strong>solo en el momento en que marcas entrada o salida</strong>, para comprobar que estás en la obra:</p>
          <ul>
            <li>La ubicación se toma solo al marcar entrada y salida: nunca de forma continua y nunca en segundo plano.</li>
            <li>Cada punto registrado (latitud, longitud y precisión) se guarda con ese registro de tiempo y lo ven los jefes de tu empresa.</li>
            <li>Tu empresa decide si usa el reloj con GPS y es responsable de tener una razón legal y de informarte.</li>
            <li>Decida lo que decida tu empresa, tú eliges: Stroyka te pregunta en la app y tu teléfono pide su permiso. Puedes decir que no y desactivarlo cuando quieras en la app (Perfil &rarr; Privacidad y datos &rarr; Ubicación al marcar) o en los ajustes del teléfono. Puedes seguir marcando; el registro simplemente queda sin ubicación. Guardamos cuándo lo activaste y cuándo lo desactivaste.</li>
            <li>Nunca usamos tu ubicación para publicidad ni para seguirte en otras apps o sitios web.</li>
          </ul>

          <h3>2.4 Nuestro sitio web</h3>
          <ul>
            <li><strong>Analítica:</strong> solo si aceptas las cookies en nuestro banner &mdash; páginas vistas, sitio de procedencia y clics en botones (PostHog). No grabamos tu pantalla ni tu sesión. Nuestro hosting, Vercel, también cuenta las visitas y mide la velocidad de las páginas sin cookies.</li>
            <li><strong>Formularios:</strong> si pides una demo, recibimos tu nombre, empresa, tamaño de la cuadrilla, correo y, opcionalmente, tu teléfono y mensaje.</li>
            <li><strong>Compras:</strong> si te suscribes en el sitio web, el pago lo gestiona Stripe (ver la sección 5).</li>
          </ul>

          <h3>2.5 Lo que no recopilamos</h3>
          <ul>
            <li>Tu ubicación en segundo plano, ni en ningún momento distinto de marcar entrada y salida.</li>
            <li>Datos biométricos ni datos personales sensibles, como salud, religión u origen étnico. No los pedimos y el servicio no está pensado para guardarlos.</li>
            <li>Números de tarjeta o de cuenta bancaria. Los pagos los gestionan Apple, Google o Stripe, y no vemos el número completo de tu tarjeta.</li>
            <li>Números de Seguro Social ni copias de documentos de identidad. (Una empresa puede ingresar su propio número fiscal para imprimirlo en sus facturas; por favor no ingreses ahí un número personal.)</li>
          </ul>

          <h3>2.6 Lo que tienes que darnos</h3>
          <p>Para tener una cuenta necesitas darnos tu nombre y un correo (o usar el inicio de sesión de Apple o Google); sin ellos no podemos prestarte el servicio. Todo lo demás es opcional o depende de tu empresa.</p>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "3. Cómo usamos la información",
      content: (
        <ul>
          <li><strong>Para que el servicio funcione:</strong> guardar y sincronizar los registros de tu empresa, calcular costos y pagos, generar informes y facturas, y permitir que jefes y trabajadores colaboren.</li>
          <li><strong>Para iniciar tu sesión</strong> y dar a cada persona el acceso que permite su rol.</li>
          <li><strong>Para comprobar la asistencia en obra</strong> cuando el reloj con GPS está activado.</li>
          <li><strong>Para leer recibos y listas de compras, si lo permites.</strong> Desde la versión 1.0.62, la primera vez que escaneas, la app te avisa de que la foto (o el texto de la lista) se envía a nuestro proveedor de IA, Anthropic, y te pide permiso. Si dices que no, no se envía nada y puedes ingresar los artículos a mano. Las versiones anteriores de la app la envían cuando eliges escanear, sin ese aviso aparte. Anthropic devuelve los artículos y montos que lee, y tú los revisas antes de guardar. Según sus términos comerciales, Anthropic no usa este contenido para entrenar sus modelos y lo elimina después de un tiempo limitado.</li>
          <li><strong>Para enviar correos:</strong> correos de inicio de sesión y de contraseña, invitaciones a trabajadores, y facturas y recordatorios de pago que una empresa envía a sus propios clientes a través de Stroyka. Después de registrarte también te enviamos un correo de bienvenida de nuestro fundador, y es posible que te escribamos personalmente sobre tu experiencia. Responde &ldquo;stop&rdquo; y dejaremos de hacerlo.</li>
          <li><strong>Para enviar notificaciones push</strong> sobre el trabajo de tu empresa. Puedes desactivarlas en los ajustes del teléfono.</li>
          <li><strong>Para mejorar el servicio:</strong> la analítica de uso (si aceptas) y los informes de errores nos ayudan a encontrar fallos y decidir qué construir.</li>
          <li><strong>Para ayudarte</strong> y responder a tus mensajes.</li>
          <li><strong>Para mantener el servicio seguro:</strong> prevenir abusos, fraudes y accesos no autorizados, hacer cumplir nuestros Términos y cumplir obligaciones legales.</li>
        </ul>
      ),
    },
    {
      id: "legal-bases",
      title: "4. Por qué podemos usarla y cuánto tiempo la guardamos",
      content: (
        <>
          <p>Para cada finalidad: la base legal en la que nos apoyamos (esto importa sobre todo según las leyes de la UE y del Reino Unido) y cuánto tiempo guardamos la información.</p>
          <ul>
            <li><strong>Tu cuenta e inicio de sesión.</strong> Base: nuestro contrato contigo. Plazo: mientras exista tu cuenta; se elimina cuando la eliminas (sección 9).</li>
            <li><strong>Los registros de tu empresa</strong> (registros de trabajo, clientes, facturas, ubicaciones al marcar). Los tratamos por cuenta de tu empresa; ella elige la base legal. Plazo: mientras tu empresa los conserve, y se eliminan en los 30 días siguientes a la eliminación de la empresa (más la caducidad de las copias de seguridad, 9.7).</li>
            <li><strong>Facturación y suscripciones.</strong> Base: nuestro contrato, y obligaciones legales de registros fiscales y contables. Plazo: mientras dure la suscripción y después lo que exija la ley fiscal. Apple, Google y Stripe guardan sus propios registros de pago.</li>
            <li><strong>Analítica de uso (PostHog).</strong> Base: tu consentimiento. Plazo: {R.posthog}. Puedes retirar el consentimiento cuando quieras (sección 10).</li>
            <li><strong>Informes de fallos (Sentry).</strong> Base: nuestro interés legítimo en que la app funcione y sea segura. Plazo: {R.sentry}.</li>
            <li><strong>Registros de seguridad y límite de solicitudes.</strong> Base: nuestro interés legítimo en prevenir abusos. Plazo: hashes del límite de solicitudes, 24 horas; registros del servidor, no más de 90 días.</li>
            <li><strong>Correo de bienvenida y correos del fundador.</strong> Base: nuestro interés legítimo en ayudar a los clientes nuevos a empezar. Plazo: hasta que te opongas (responde &ldquo;stop&rdquo;) o elimines tu cuenta.</li>
            <li><strong>Lectura de recibos y listas (Anthropic).</strong> Por cuenta de tu empresa y solo después de que lo permitas en la app. El resultado se guarda en los registros de tu empresa; Anthropic conserva el contenido solo por un tiempo limitado según sus términos comerciales.</li>
            <li><strong>Mensajes de soporte.</strong> Base: nuestro contrato, o nuestro interés legítimo en responderte. Plazo: mientras los necesitemos para ayudarte y para dejar constancia de lo acordado.</li>
            <li><strong>Solicitudes de demo desde el sitio web.</strong> Base: las medidas que nos pediste antes de un contrato y nuestro interés legítimo en responder. Plazo: mientras estemos en contacto por tu solicitud; eliminamos los contactos que ya no necesitamos.</li>
            <li><strong>Analítica del sitio web y píxel de Meta.</strong> Base: tu consentimiento en el banner de cookies. Plazo: ver la sección 12.</li>
            <li><strong>Reclamaciones y obligaciones legales.</strong> Base: obligación legal o nuestro interés legítimo en defendernos de reclamaciones. Plazo: solo el necesario (9.9).</li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      title: "5. Con quién la compartimos",
      content: (
        <>
          <p><strong>No vendemos tu información personal</strong> ni compartimos los datos de la app con anunciantes. Nuestro sitio web (no la app) puede usar el píxel de Meta para medir nuestros anuncios, solo si aceptas las cookies y solo fuera de la UE y el Reino Unido (sección 12); algunas leyes estatales de EE. UU. lo llaman &ldquo;compartir&rdquo;.</p>
          <p><strong>Dentro de tu empresa:</strong> lo que ingresas lo ven otras personas de tu empresa según su rol. Los jefes pueden ver las horas, gastos, pagos y ubicaciones al marcar de los trabajadores.</p>
          <p><strong>Proveedores de servicios</strong> que hacen funcionar partes de Stroyka por nosotros; cada uno recibe solo lo que necesita para su tarea. La lista completa, con ubicaciones, está en nuestra página de <Link href="/es/subprocessors">Subencargados</Link>:</p>
          <ul>
            <li><strong>Supabase</strong> &mdash; nuestra base de datos, inicio de sesión, almacenamiento de archivos y funciones de servidor. Alojado en Amazon Web Services en Fráncfort, Alemania. Guarda todos los datos y archivos de la app.</li>
            <li><strong>Anthropic</strong> (EE. UU.) &mdash; lee fotos de recibos y fotos o texto de listas de compras cuando usas esa función y la has permitido.</li>
            <li><strong>PostHog</strong> (EE. UU.) &mdash; analítica de uso de la app y del sitio web, solo con tu consentimiento.</li>
            <li><strong>Sentry</strong> (EE. UU.) &mdash; informes de errores y fallos.</li>
            <li><strong>Resend</strong> (EE. UU.) &mdash; envía nuestros correos, incluidas las facturas y recordatorios a los clientes de una empresa. Recibe la dirección del destinatario y el contenido del correo.</li>
            <li><strong>Google</strong> &mdash; inicio de sesión con Google, suscripciones de Google Play compradas en la app de Android y Firebase Cloud Messaging, que entrega las notificaciones push usando el token de tu dispositivo.</li>
            <li><strong>Apple</strong> &mdash; inicio de sesión con Apple, suscripciones del App Store compradas en la app de iPhone y entrega de notificaciones en iPhone.</li>
            <li><strong>RevenueCat</strong> (EE. UU.) &mdash; lleva el estado de las suscripciones compradas en las apps de iPhone y Android. Recibe el ID de tu empresa y la información de compra de Apple o Google.</li>
            <li><strong>Stripe</strong> (EE. UU.) &mdash; pago y facturación de las suscripciones compradas en nuestro sitio web. Stripe recibe tus datos de pago directamente.</li>
            <li><strong>Cloudflare</strong> &mdash; nuestro dominio y DNS, el reenvío del correo enviado a nuestras direcciones y el almacenamiento de nuestras copias de seguridad cifradas.</li>
            <li><strong>Vercel</strong> (EE. UU.) &mdash; aloja nuestro sitio web, procesa registros web estándar con direcciones IP y cuenta visitas sin cookies.</li>
            <li><strong>Telegram</strong> &mdash; avisa a nuestro equipo cuando alguien envía el formulario de demo de nuestro sitio web, con los datos del formulario.</li>
            <li><strong>Meta</strong> &mdash; solo el píxel de Meta en nuestro sitio web, como se indica arriba. No está en la app. <a href="https://www.facebook.com/privacy/policy" target="_blank" rel="noopener noreferrer">Política de privacidad de Meta</a></li>
          </ul>
          <p>Nuestros proveedores de servicios solo pueden usar tu información para prestarnos su servicio, según contratos que los obligan a protegerla al menos tan bien como esta política, y ninguno puede usarla para su propia publicidad. Las excepciones actúan según sus propios términos y políticas de privacidad: Apple y Google para las compras e inicios de sesión hechos con ellos, Meta para el píxel del sitio web y Telegram para los avisos del formulario de demo.</p>
          <p>También podemos revelar información si lo exige la ley, un tribunal o una autoridad, o si creemos que es necesario para proteger los derechos, la propiedad o la seguridad de Stroyka, de nuestros usuarios o del público.</p>
        </>
      ),
    },
    {
      id: "transfers",
      title: "6. Dónde se tratan tus datos",
      content: (
        <>
          <p>Los datos y archivos de la app se guardan en Alemania (Supabase, en Amazon Web Services en Fráncfort). Stroyka es una empresa de EE. UU. y varios proveedores de la sección 5 están en Estados Unidos, por lo que la información también se consulta y se trata en EE. UU.</p>
          <p>Para las transferencias desde la UE, el EEE, Suiza y el Reino Unido nos apoyamos en las Cláusulas Contractuales Tipo de la Comisión Europea y en el Anexo de Transferencia Internacional de Datos del Reino Unido, que forman parte de nuestro <Link href="/es/dpa">Anexo de Tratamiento de Datos</Link> y de los términos de tratamiento de datos de nuestros proveedores, y en el Marco de Privacidad de Datos UE&ndash;EE. UU. (y su extensión al Reino Unido) cuando un proveedor está certificado en él. Puedes pedirnos una copia en {SUPPORT}.</p>
          <p>Cuando la información está en otro país, los tribunales, las autoridades policiales y las de seguridad nacional de ese país pueden acceder a ella según sus leyes.</p>
          <p>Stroyka no se ofrece en países o regiones sujetos a sanciones integrales de EE. UU. (ver nuestros <Link href="/es/terms">Términos</Link>, sección 9).</p>
        </>
      ),
    },
    {
      id: "data-isolation",
      title: "7. Quién puede ver los datos de tu empresa",
      content: (
        <>
          <p>Los datos de cada empresa están separados de los de todas las demás a nivel de base de datos, mediante políticas de Row Level Security:</p>
          <ul>
            <li>Ningún usuario de una empresa puede ver ni cambiar los datos de otra empresa.</li>
            <li>La separación la aplica la propia base de datos, no solo el código de la app.</li>
          </ul>
          <p><strong>En Stroyka</strong> no miramos el contenido de los registros de tu empresa &mdash; por ejemplo registros, fotos, mensajes o datos de clientes &mdash; salvo para ayudarte cuando nos pides soporte, para mantener el servicio seguro o corregir un fallo, o cuando la ley lo exige. Para hacer funcionar y mejorar Stroyka sí usamos información de cada empresa a nivel de cuenta: su plan, la fecha de registro, cuántos registros tiene y cuándo se usó la app por última vez, junto con la analítica de uso si la aceptaste (sección 2.2).</p>
        </>
      ),
    },
    {
      id: "storage-security",
      title: "8. Seguridad, copias de seguridad y brechas",
      content: (
        <>
          <p>8.1. Los datos se cifran en tránsito (TLS) y en reposo en nuestro proveedor de hosting.</p>
          <p>8.2. Los datos que la app guarda en tu teléfono para usarla sin conexión están cifrados (SQLCipher / sqlite3mc), con las claves en el almacenamiento seguro del teléfono (Keychain en iPhone, Keystore en Android).</p>
          <p>8.3. Hacemos nuestras propias copias de seguridad de la base de datos y de los archivos subidos. Se cifran antes de salir de nuestros sistemas y se guardan en Cloudflare.</p>
          <p>8.4. Usamos acceso por roles, límites de solicitudes, validación de datos y registros de auditoría.</p>
          <p>8.5. Ningún método de almacenamiento o transmisión es completamente seguro, y no podemos garantizar una seguridad absoluta.</p>
          <p>8.6. <strong>Si algo sale mal.</strong> Si sabemos de una brecha de seguridad que afecte a información personal que guardamos, avisamos a las empresas afectadas sin demora indebida y en un máximo de 48 horas desde que la confirmamos. Avisamos a las personas afectadas y a las autoridades cuando la ley lo exige &mdash; por ejemplo, a las autoridades de protección de datos en 72 horas cuando somos responsables según la ley de la UE o del Reino Unido. Llevamos un registro de cada incidente de seguridad.</p>
        </>
      ),
    },
    {
      id: "retention",
      title: "9. Cuánto tiempo guardamos los datos y cómo eliminarlos",
      content: (
        <>
          <p>9.1. <strong>Mientras uses Stroyka</strong>, guardamos tus datos mientras existan tu cuenta y tu empresa. La sección 4 indica cuánto tiempo guardamos cada tipo de información.</p>
          <p>9.2. <strong>Cancelar un plan de pago no elimina nada.</strong> Tu empresa pasa al plan gratis y tus datos se quedan.</p>
          <p>9.3. <strong>Eliminar tu cuenta (trabajadores).</strong> En la app ve a Perfil &rarr; Privacidad y datos &rarr; Eliminar mi cuenta, o escribe a {SUPPORT} desde el correo de tu cuenta (ver <Link href="/es/delete-account">getstroyka.com/es/delete-account</Link>). Esto elimina tu cuenta y tu inicio de sesión, tus datos de contacto (teléfono), tus tokens de notificaciones, tu configuración de notificaciones, tu consentimiento de ubicación y los puntos GPS registrados al marcar entrada y salida. En la app ocurre de inmediato: se cierra tu sesión y ya no puedes volver a entrar.</p>
          <p><strong>A partir del {DATE}, los registros de trabajo que creaste para tu empresa se quedan con tu empresa.</strong> Tus horas, gastos y compras de materiales, recibos, viajes, solicitudes, bitácoras diarias, mensajes de tareas, fotos y videos son registros del negocio de tu empresa: se quedan con ella, con tu nombre, igual que cuando una empresa da de baja a un trabajador (9.6). Tu empresa es responsable de ellos; muchas veces la ley obliga a los empleadores a conservar los registros de trabajo y de pago. Si quieres que se eliminen, pídeselo a tu empresa: puede eliminarlos en la app y, a petición suya, los borraremos de forma permanente de nuestros servidores. <strong>Hasta esa fecha, eliminar tu cuenta también elimina los registros que creaste</strong>, que se borran de forma permanente de nuestros servidores en un plazo de 30 días.
            {/* remove when min app version ≥ 1.0.62 */}
            {" "}Una versión de la app anterior a la 1.0.62 también elimina esos registros, incluso después del {DATE}, hasta que dejemos de admitir esas versiones; para que se queden con tu empresa, actualiza la app primero.</p>
          <p>9.4. <strong>Dueños de empresa.</strong> El dueño de una empresa no puede eliminar solo su propia cuenta. En su lugar elimina toda la empresa (9.5) o nos escribe a {SUPPORT}.</p>
          <p>9.5. <strong>Eliminar una empresa.</strong> El dueño puede eliminar la empresa en la app (Perfil &rarr; Privacidad y datos &rarr; Eliminar mi empresa). Todo se oculta de inmediato para todos en la empresa, y en un plazo de 30 días borramos de forma permanente todos los datos y archivos de la empresa. Eliminar la empresa no cancela una suscripción; cancélala por separado (ver nuestros <Link href="/es/terms">Términos</Link>, sección 7).</p>
          <p>9.6. <strong>Si una empresa da de baja a un trabajador</strong>, los registros de trabajo que creó se quedan con la empresa como registros de su negocio, mostrados con su nombre, hasta que la empresa los elimine o elimine la empresa. A partir del {DATE} ocurre lo mismo cuando el trabajador elimina su propia cuenta. Un trabajador dado de baja puede pedirnos igualmente que eliminemos su cuenta, como en 9.3.</p>
          <p>9.7. <strong>Copias de seguridad.</strong> Los datos eliminados no salen de inmediato de las copias de seguridad existentes. Salen a medida que esas copias caducan: las copias de la base de datos se guardan hasta 6 meses y las copias de archivos hasta 1 año.</p>
          <p>9.8. <strong>Los datos de analítica y de errores</strong> se guardan {R.posthog} (PostHog) y {R.sentry} (Sentry). Los correos de soporte se guardan mientras los necesitemos para ayudarte y para dejar constancia de lo acordado.</p>
          <p>9.9. Podemos guardar información concreta por más tiempo cuando la ley lo exige, o para resolver una disputa o hacer cumplir nuestros Términos, y solo mientras dure esa necesidad.</p>
        </>
      ),
    },
    {
      id: "your-rights",
      title: "10. Tus opciones y derechos",
      content: (
        <>
          <h3>Para todos</h3>
          <ul>
            <li><strong>Ver y corregir:</strong> puedes ver tus datos en la app y actualizar tus datos en Perfil.</li>
            <li><strong>Descargar:</strong> Perfil &rarr; Privacidad y datos &rarr; Descargar mis datos te da una copia de tus datos. Los jefes también pueden exportar informes (por ejemplo a PDF, CSV o Excel).</li>
            <li><strong>Eliminar:</strong> ver la sección 9 y <Link href="/es/delete-account">getstroyka.com/es/delete-account</Link>.</li>
            <li><strong>Analítica:</strong> Perfil &rarr; Privacidad y datos &rarr; Compartir datos de uso. En el sitio web: Configuración de cookies, al pie de cualquier página.</li>
            <li><strong>Ubicación:</strong> desactiva Ubicación al marcar en la misma pantalla o en los ajustes del teléfono.</li>
            <li><strong>Correos del fundador:</strong> responde &ldquo;stop&rdquo;.</li>
          </ul>
          <p>Vivas donde vivas, puedes pedirnos acceder a tu información personal, corregirla, eliminarla o exportarla, dejar de usarla para una finalidad o retirar un consentimiento que diste. Escribe a {SUPPORT} con &ldquo;Privacy&rdquo; en el asunto. Es gratis. Podemos pedirte que confirmes que eres tú. Respondemos en un mes como máximo, o antes si tu ley local fija un plazo más corto (sección 11).</p>
          <p><strong>Registros que guarda tu empresa.</strong> Si eres trabajador o cliente de una empresa que usa Stroyka y tu solicitud trata de registros que guarda esa empresa, puedes pedírselo directamente. Si nos lo pides a nosotros, pasamos tu solicitud a la empresa con prontitud (en 5 días hábiles) y te avisamos; la empresa decide y nosotros la ayudamos a cumplir su decisión.</p>
          <p><strong>Tu derecho de oposición.</strong> Cuando nos basamos en nuestro interés legítimo (sección 4), puedes oponerte en cualquier momento, y dejaremos de hacerlo salvo que tengamos motivos imperiosos que prevalezcan sobre tus intereses o necesitemos la información para una reclamación legal. Siempre puedes detener los correos del fundador respondiendo &ldquo;stop&rdquo; y desactivar la analítica como se indica arriba.</p>
          <p>No tomamos decisiones sobre ti basadas únicamente en un tratamiento automatizado que produzcan efectos jurídicos o te afecten de forma igual de significativa.</p>

          <h3>Residentes de California (CCPA)</h3>
          <ul>
            <li><strong>Derecho a saber:</strong> puedes preguntar qué información personal hemos recopilado sobre ti.</li>
            <li><strong>Derecho a eliminar:</strong> puedes pedirnos que la eliminemos, con las excepciones legales.</li>
            <li><strong>Derecho a corregir</strong> la información inexacta.</li>
            <li><strong>Venta y compartición:</strong> no vendemos información personal. El píxel de Meta del sitio web (sección 12) solo se carga si lo aceptas, y Rechazar o una señal de Global Privacy Control lo desactivan.</li>
            <li><strong>No discriminación:</strong> no te trataremos de forma distinta por ejercer estos derechos.</li>
          </ul>
          <p>Para ejercer estos derechos, escribe a {SUPPORT}. Respondemos a las solicitudes verificables en un plazo de 45 días.</p>

          <h3>Usuarios en la UE, el EEE, Suiza y el Reino Unido (RGPD)</h3>
          <ul>
            <li>Derechos de acceso, rectificación, supresión y portabilidad.</li>
            <li>Derechos a limitar el tratamiento o a oponerte a él.</li>
            <li>Derecho a retirar el consentimiento en cualquier momento (por ejemplo a la analítica de uso), sin afectar a lo hecho antes.</li>
            <li>Derecho a presentar una reclamación ante tu autoridad de protección de datos (sección 11).</li>
          </ul>
          <p>La base legal de cada finalidad está en la sección 4. Respondemos en un mes; si la solicitud es compleja podemos ampliar el plazo hasta dos meses más y te explicaremos por qué.</p>
        </>
      ),
    },
    {
      id: "country",
      title: "11. Información para países concretos",
      content: (
        <>
          <ul>
            <li><strong>UE y EEE.</strong> Nuestro representante en la UE según el artículo 27 del RGPD: {EU_REPRESENTATIVE}. Puedes presentar una reclamación ante la autoridad de protección de datos del lugar donde vives o trabajas (<a href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">lista de autoridades</a>).</li>
            <li><strong>Reino Unido.</strong> Nuestro representante en el Reino Unido: {UK_REPRESENTATIVE}. Si no estás conforme con cómo tratamos tu información, escríbenos primero: acusamos recibo de las quejas en 30 días y te decimos qué haremos. También puedes reclamar ante la Information Commissioner&rsquo;s Office (<a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk</a>).</li>
            <li><strong>Estados Unidos.</strong> No vendemos información personal. Si una brecha te afecta, te avisamos como exija la ley de tu estado. Los derechos de California están en la sección 10.</li>
            <li><strong>México.</strong> Esta política es nuestro aviso de privacidad integral. Puedes ejercer tus derechos ARCO (acceso, rectificación, cancelación y oposición) y revocar tu consentimiento como se indica en la sección 10; respondemos en 20 días y hacemos efectiva la respuesta en los 15 días siguientes. Autoridad: Secretaría Anticorrupción y Buen Gobierno.</li>
            <li><strong>Filipinas.</strong> Nuestro Oficial de Protección de Datos es el contacto de privacidad de la sección 1. Puedes reclamar ante la National Privacy Commission (<a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer">privacy.gov.ph</a>).</li>
            <li><strong>Canadá.</strong> Respondemos a las solicitudes de acceso en 30 días. Puedes reclamar ante el Office of the Privacy Commissioner of Canada y, en Quebec, ante la Commission d&rsquo;accès à l&rsquo;information. La información puede tratarse y consultarse fuera de Canadá (sección 6).</li>
            <li><strong>India.</strong> Atendemos las quejas en 90 días en el contacto de la sección 1, y después puedes acudir al Data Protection Board of India. Puedes designar a otra persona para que ejerza tus derechos si falleces o quedas incapacitado.</li>
            <li><strong>Uruguay.</strong> Puedes reclamar ante la Unidad Reguladora y de Control de Datos Personales.</li>
            <li><strong>Resto del mundo.</strong> Puedes contactar con tu autoridad local de protección de datos.</li>
          </ul>
          <p><strong>Las obligaciones de la propia empresa.</strong> Cuando la ley local considera a tu empresa responsable u operador de la información de sus trabajadores y clientes, la empresa debe cumplir los avisos, consentimientos y registros que exige esa ley &mdash; por ejemplo el consentimiento por escrito de los trabajadores para usar un servicio externo, o informar a la autoridad de protección de datos sobre los registros de ubicación. Nuestro <Link href="/es/dpa">Anexo de Tratamiento de Datos</Link> explica cómo ayudamos.</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "12. Cookies y seguimiento",
      content: (
        <>
          <p>12.1. <strong>La app</strong> no tiene publicidad y no te sigue por las apps o sitios web de otras empresas. La analítica de uso en la app necesita tu consentimiento (sección 2.2).</p>
          <p>12.2. <strong>Nuestro sitio web</strong> pregunta antes de poner cualquier cookie opcional. Hasta que eliges Aceptar en el banner de cookies, no se cargan ni PostHog ni el píxel de Meta. Rechazar es tan fácil como Aceptar, y puedes cambiar tu elección cuando quieras en Configuración de cookies, al pie de cada página. Si tu navegador envía una señal de Global Privacy Control, la tratamos como Rechazar.</p>
          <p>12.3. Lo que pone el sitio web:</p>
          <ul>
            <li><strong>sx_consent</strong> (necesaria) &mdash; recuerda tu elección sobre cookies. 180 días.</li>
            <li><strong>sx_geo</strong> (necesaria) &mdash; el código de dos letras de tu país, que se usa solo para no cargar el píxel de Meta en la UE, el EEE y el Reino Unido. 1 día.</li>
            <li><strong>Cookies de PostHog (ph_&hellip;)</strong> (analítica, solo después de Aceptar) &mdash; distinguen las visitas para que veamos cómo se usa el sitio. Hasta 1 año.</li>
            <li><strong>Cookies del píxel de Meta (_fbp)</strong> (publicidad, solo después de Aceptar, y nunca en la UE, el EEE, el Reino Unido o cuando no sabemos tu país) &mdash; avisan a Meta de que hubo una visita o un clic de registro, para medir nuestros anuncios. Hasta 90 días.</li>
            <li>El conteo de visitas y la medición de velocidad de Vercel no usan cookies.</li>
          </ul>
          <p>12.4. La protección contra rastreo del navegador o un bloqueador de anuncios también detienen las herramientas opcionales, y el sitio funciona con normalidad sin ellas.</p>
        </>
      ),
    },
    {
      id: "third-party",
      title: "13. Enlaces de terceros",
      content: (
        <p>El servicio puede enlazar a otros sitios web o servicios. No somos responsables de sus prácticas de privacidad; lee sus políticas de privacidad.</p>
      ),
    },
    {
      id: "children",
      title: "14. Privacidad de menores",
      content: (
        <p>Stroyka no está pensado para menores de 18 años, y no recopilamos a sabiendas información personal de menores de 18 años. Si descubrimos que lo hemos hecho, la eliminaremos.</p>
      ),
    },
    {
      id: "changes",
      title: "15. Cambios en esta política",
      content: (
        <>
          <p>15.1. Podemos actualizar esta política. Si los cambios son importantes, te avisaremos por correo o en la app al menos 30 días antes de que entren en vigor. Si sigues usando Stroyka después de esa fecha, se aplica la política actualizada.</p>
          <p>15.2. <strong>A partir del {DATE}</strong>, el punto 15.1 se sustituye por esta regla: los cambios que reduzcan tus derechos o amplíen el uso de tu información seguirán entrando en vigor al menos 30 días después de que te avisemos por correo o en la app. Los cambios que exija la ley, que corrijan un problema de seguridad o que no reduzcan tus derechos pueden entrar en vigor al publicarse; aun así te avisaremos de los importantes. Si no estás de acuerdo con un cambio, puedes eliminar tu cuenta antes de que entre en vigor.</p>
          <p>15.3. <strong>Esta versión.</strong> Publicada el {LAST_UPDATED_ES}. Entra en vigor al publicarse, salvo dos cambios que entran en vigor el {DATE}: lo que se conserva al eliminar la cuenta de un trabajador (9.3 y 9.6) y la regla de aviso de cambios del punto 15.2. Añade: bases legales y plazos de conservación por finalidad (4), la analítica de uso que ahora pide permiso primero (2.2), el aviso antes de que la IA lea los recibos (3), nuestra dirección y representantes en la UE y el Reino Unido (1, 11, 16), las transferencias internacionales (6), quién en Stroyka ve los datos de las empresas (7), el aviso de brechas (8.6), los plazos de respuesta y dónde reclamar según el país (10, 11) y el banner de cookies del sitio web (12).</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "16. Contacto",
      content: (
        <>
          <p>Preguntas, solicitudes sobre tus datos o inquietudes:</p>
          <p>
            Dalen Meridian LLC (d/b/a Stroyka)<br />
            {POSTAL_ADDRESS}<br />
            Correo: {SUPPORT} (pon &ldquo;Privacy&rdquo; en el asunto)<br />
            Sitio web: <a href="https://getstroyka.com">getstroyka.com</a>
          </p>
          <p>
            Representante en la UE: {EU_REPRESENTATIVE}<br />
            Representante en el Reino Unido: {UK_REPRESENTATIVE}
          </p>
        </>
      ),
    },
  ],
};
