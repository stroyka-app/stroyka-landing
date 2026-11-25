import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";
import { LAST_UPDATED_ES, NOTICE_EFFECTIVE_ES, POSTAL_ADDRESS, VENUE_COUNTY } from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const DATE = NOTICE_EFFECTIVE_ES;
const EULA = (
  <a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer">
    Contrato de Licencia de Usuario Final de Aplicaciones con Licencia (Licensed Application EULA)
  </a>
);

export const termsEs: LegalDoc = {
  title: "Términos de Servicio",
  subtitle: "Lee con atención estos Términos de Servicio antes de usar la plataforma Stroyka.",
  effectiveDate: `Vigentes desde: abril de 2026 · Última actualización: ${LAST_UPDATED_ES} · Los cambios con fecha entran en vigor el ${DATE}`,
  sections: [
    {
      id: "definitions",
      title: "1. Definiciones",
      content: (
        <ul>
          <li><strong>&ldquo;Stroyka&rdquo;, &ldquo;nosotros&rdquo; o &ldquo;nuestro&rdquo;</strong> se refiere a Dalen Meridian LLC, una sociedad de responsabilidad limitada de Texas que opera como Stroyka, y a la aplicación Stroyka y sus servicios relacionados.</li>
          <li><strong>&ldquo;Servicio&rdquo;</strong> se refiere al software Stroyka de control de costos de obra y gestión de cuadrillas, ofrecido a través de nuestras apps para iPhone y Android y de los servicios en la nube y el sitio web relacionados.</li>
          <li><strong>&ldquo;Cliente&rdquo;, &ldquo;tú&rdquo; o &ldquo;tu&rdquo;</strong> se refiere a la persona o empresa que crea una Cuenta de Empresa y usa el Servicio.</li>
          <li><strong>&ldquo;Cuenta de Empresa&rdquo;</strong> se refiere a la cuenta de la organización dentro del Servicio, en la que se agrupan todos los proyectos, usuarios y datos.</li>
          <li><strong>&ldquo;Jefe&rdquo;</strong> se refiere a un usuario con privilegios de administrador en una Cuenta de Empresa, que puede gestionar proyectos, invitar trabajadores, aprobar solicitudes y gestionar la facturación.</li>
          <li><strong>&ldquo;Trabajador&rdquo;</strong> se refiere a un usuario invitado por un Jefe a una Cuenta de Empresa, con permisos limitados para registrar tiempo, registrar compras y completar tareas asignadas.</li>
          <li><strong>&ldquo;Contenido&rdquo;</strong> se refiere a todos los datos, textos, imágenes, fotos, videos, archivos y demás información que se sube, envía o genera en el Servicio.</li>
          <li><strong>&ldquo;Anexo de Tratamiento de Datos&rdquo;</strong> se refiere a nuestro anexo en <Link href="/es/dpa">getstroyka.com/es/dpa</Link>.</li>
        </ul>
      ),
    },
    {
      id: "account",
      title: "2. Registro de cuenta",
      content: (
        <>
          <p>2.1. Debes tener al menos 18 años y la capacidad legal para aceptar estos Términos en tu nombre o en nombre de la empresa que representas.</p>
          <p>2.2. Al crear una cuenta, debes dar información exacta y completa, incluido un correo válido, tu nombre y el nombre de tu empresa.</p>
          <p>2.3. Eres responsable de mantener la confidencialidad de tus credenciales y de toda la actividad que ocurra en tu cuenta.</p>
          <p>2.4. Cada Cuenta de Empresa es para una sola empresa. No puedes compartir una Cuenta de Empresa entre varios negocios no relacionados.</p>
          <p>2.5. El Jefe que crea la Cuenta de Empresa es su titular y es responsable de todos los usuarios que invita y de toda la actividad en la Cuenta de Empresa.</p>
          <p>2.6. <strong>Trabajadores.</strong> Si una empresa te invita como Trabajador, usas el Servicio dentro de la Cuenta de Empresa de esa empresa. El Cliente es la empresa, no tú, y ella responde por la Cuenta de Empresa y por los pagos. Al unirte, aceptas cumplir el punto 2.3, las secciones 8 (Uso aceptable), 9 (Sanciones y control de exportaciones) y 11 (Propiedad intelectual), y los términos de las tiendas de apps del punto 18.6. Tus condiciones de trabajo, tu pago y los registros que tu empresa lleva sobre tu trabajo son asunto entre tú y tu empresa.</p>
        </>
      ),
    },
    {
      id: "service",
      title: "3. Descripción del Servicio",
      content: (
        <>
          <p>3.1. Stroyka es una plataforma para cuadrillas de construcción pequeñas: controlar costos por obra, llevar las hojas de horas de la cuadrilla, registrar compras de materiales, llevar listas de compras, asignar tareas, enviar facturas y generar informes financieros de los proyectos activos.</p>
          <p>3.2. El Servicio funciona sin conexión. Los datos ingresados sin conexión se guardan en el dispositivo y se sincronizan con nuestros servidores cuando vuelve la conexión.</p>
          <p>3.3. Algunas funciones usan servicios de terceros, por ejemplo la lectura de fotos de recibos con un proveedor de IA; la app te pide permiso antes de enviarle algo por primera vez. Lo que compartimos y con quién se describe en nuestra <Link href="/es/privacy">Política de Privacidad</Link> y en la página de <Link href="/es/subprocessors">Subencargados</Link>.</p>
          <p>3.4. Podemos actualizar, modificar o mejorar el Servicio de vez en cuando. Haremos lo razonable por mantener la compatibilidad, pero nos reservamos el derecho de cambiar funciones, APIs o interfaces con aviso razonable.</p>
        </>
      ),
    },
    {
      id: "data-ownership",
      title: "4. Tus datos y tus responsabilidades",
      content: (
        <>
          <p>4.1. <strong>Tus datos son tuyos.</strong> Todo el Contenido que tú o tus trabajadores suben, ingresan o generan en el Servicio sigue siendo de tu propiedad. Stroyka no reclama ningún derecho de propiedad sobre tu Contenido.</p>
          <p>4.2. Nos otorgas una licencia limitada y no exclusiva para guardar, procesar, transmitir y mostrar tu Contenido con el único fin de prestarte el Servicio.</p>
          <p>4.3. Puedes descargar una copia de tus datos en cualquier momento (Perfil &rarr; Privacidad y datos &rarr; Descargar mis datos), y los Jefes pueden exportar informes, por ejemplo a PDF, CSV o Excel.</p>
          <p>4.4. <strong>Información personal de otras personas.</strong> Cuando ingresas información personal de tus trabajadores o clientes (por ejemplo nombres, datos de contacto, tarifas, horas o ubicaciones), eres responsable de tener derecho a recopilarla y usarla, y de informar a esas personas cuando sea obligatorio. Tratamos esa información en tu nombre para prestar el Servicio, como se describe en nuestra <Link href="/es/privacy">Política de Privacidad</Link> y en el Anexo de Tratamiento de Datos.</p>
          <p>4.5. Cancelar un plan de pago no elimina tus datos (ver la sección 7). La eliminación de una cuenta o de una Cuenta de Empresa se trata en los puntos 7.6 a 7.11.</p>
          <p>4.6. <strong>Tus registros y tus obligaciones legales.</strong> Tú decides qué registros guardar y por cuánto tiempo. Muchas leyes obligan a los empleadores a conservar registros de nómina, horas, gastos y kilometraje durante varios años (por ejemplo, en EE. UU., la Ley de Normas Laborales Justas (FLSA) y las reglas del IRS). El Servicio te ayuda a llevar esos registros, pero eres responsable de cumplir tus propias obligaciones de conservación, laborales, fiscales y de aviso a los trabajadores, incluido cualquier aviso o consentimiento necesario antes de usar el reloj con GPS (por ejemplo en Connecticut, Nueva York o Delaware, o según las leyes de protección de datos o laborales de tu país).</p>
          <p>4.7. <strong>Anexo de Tratamiento de Datos.</strong> Nuestro <Link href="/es/dpa">Anexo de Tratamiento de Datos</Link> forma parte de estos Términos y se aplica siempre que tratamos información personal por tu cuenta. Incluye las cláusulas que las leyes de protección de datos exigen entre un responsable (o &ldquo;negocio&rdquo;) y su encargado (o &ldquo;proveedor de servicios&rdquo;), entre otras el RGPD, el RGPD del Reino Unido y las leyes estatales de privacidad de EE. UU.</p>
        </>
      ),
    },
    {
      id: "security",
      title: "5. Separación de datos y seguridad",
      content: (
        <>
          <p>5.1. Los datos de cada Cuenta de Empresa están separados lógicamente de los de todas las demás. Ningún usuario de una empresa puede acceder, ver ni modificar los datos de otra.</p>
          <p>5.2. La separación de datos se aplica a nivel de base de datos mediante políticas de Row Level Security (RLS). No es una opción que se pueda desactivar: es una restricción fundamental de la arquitectura.</p>
          <p>5.3. Usamos cifrado estándar de la industria para los datos en tránsito (TLS) y en reposo. Los datos sin conexión se cifran en el dispositivo.</p>
          <p>5.4. Nos tomamos la seguridad en serio y seguimos buenas prácticas, pero ningún sistema es perfectamente seguro. No podemos garantizar una seguridad absoluta y no somos responsables de accesos no autorizados causados por factores fuera de nuestro control razonable. Si una brecha de seguridad afecta a los datos de tu empresa, te avisaremos como indica el Anexo de Tratamiento de Datos.</p>
        </>
      ),
    },
    {
      id: "billing",
      title: "6. Suscripción y facturación",
      content: (
        <>
          <p>6.1. Stroyka ofrece un plan gratis sin límite de tiempo para cuadrillas de hasta 5 trabajadores. No se necesita tarjeta para usar el plan gratis. Los planes de pago (Starter y Pro) desbloquean funciones adicionales y límites de trabajadores más altos.</p>
          <p>6.2. Las suscripciones de pago son opcionales. Si no te suscribes a un plan de pago, puedes seguir usando el plan gratis el tiempo que quieras.</p>
          <p>6.3. Las suscripciones se cobran por adelantado, mensual o anualmente según el ciclo que elijas. El precio y la moneda se muestran antes de comprar.</p>
          <p>6.4. <strong>Compras en las apps.</strong> Las compras en la app de iPhone las vende y cobra Apple a través del App Store, y las compras en la app de Android las vende y cobra Google a través de Google Play. Ambas se renuevan automáticamente hasta que las canceles. Los términos de Apple o de Google rigen el pago, la renovación, la cancelación y los reembolsos de esas compras.</p>
          <p>6.5. <strong>Las compras en nuestro sitio web</strong> se cobran a través de Stripe, nuestro procesador de pagos, y se renuevan automáticamente al final de cada periodo hasta que las canceles. Tus datos de pago van directamente a Stripe y nunca se guardan en nuestros servidores.</p>
          <p>6.6. Nos reservamos el derecho de cambiar los precios con 30 días de aviso por escrito. Los cambios no se aplican a tu ciclo de facturación actual. Los precios conservados (por ejemplo, tarifas de primeros clientes) se respetan mientras tu suscripción esté activa y al corriente.</p>
        </>
      ),
    },
    {
      id: "cancellation",
      title: "7. Cancelación, reembolsos y eliminación",
      content: (
        <>
          <p>7.1. Puedes cancelar en cualquier momento. Una suscripción del App Store se cancela en los ajustes de suscripciones de tu Apple ID. Una suscripción de Google Play, en Google Play &rsaquo; Pagos y suscripciones &rsaquo; Suscripciones. Una suscripción del sitio web se cancela desde la pantalla de facturación de la app o escribiéndonos a {SUPPORT}.</p>
          <p>7.2. Al cancelar, tu suscripción sigue activa hasta el final del periodo de facturación actual. No se te volverá a cobrar.</p>
          <p>7.3. En las suscripciones del sitio web no hacemos reembolsos prorrateados por periodos parciales; conservas el acceso hasta el final del periodo. Los reembolsos de compras del App Store y de Google Play los gestionan Apple o Google según sus políticas.</p>
          <p>7.4. Cuando termina un plan de pago, tu Cuenta de Empresa pasa al plan gratis. Las funciones exclusivas de los planes de pago dejan de estar disponibles, pero <strong>tus datos no se eliminan</strong> y siguen accesibles y exportables.</p>
          <h3>Eliminar tu cuenta o tu empresa</h3>
          <p>7.5. Cancelar no es eliminar. Para eliminar datos:</p>
          <p>7.6. <strong>Un Trabajador</strong> puede eliminar su cuenta en la app (Perfil &rarr; Privacidad y datos &rarr; Eliminar mi cuenta) o escribiendo a {SUPPORT} desde el correo de la cuenta. Se eliminan la cuenta, su inicio de sesión y los datos personales del Trabajador: datos de contacto (teléfono), tokens de notificaciones, configuración de notificaciones, consentimiento de ubicación y los puntos GPS registrados al marcar entrada y salida. <strong>A partir del {DATE}</strong>, los registros de trabajo que el Trabajador creó para la empresa (horas, gastos y compras de materiales, recibos, viajes, solicitudes, bitácoras diarias, mensajes de tareas, fotos y videos) son registros del negocio de la empresa: se quedan en la Cuenta de Empresa, con el nombre del Trabajador, como en 7.8. <strong>Hasta esa fecha, eliminar la cuenta de un Trabajador también elimina los registros que creó</strong>: desaparecen de la app de inmediato y se borran de forma permanente de nuestros servidores en un plazo de 30 días.
            {/* remove when min app version ≥ 1.0.62 */}
            {" "}Una versión de la app anterior a la 1.0.62 también elimina esos registros, incluso después del {DATE}, hasta que dejemos de admitir esas versiones.</p>
          <p>7.7. <strong>Un Jefe</strong> no puede eliminar solo su propia cuenta. El Jefe puede eliminar toda la Cuenta de Empresa en la app (Perfil &rarr; Privacidad y datos &rarr; Eliminar mi empresa). Sus datos se ocultan de inmediato y se borran de forma permanente de nuestros servidores en un plazo de 30 días.</p>
          <p>7.8. Si una Cuenta de Empresa da de baja a un Trabajador, los registros que creó se quedan con la empresa como registros de su negocio, hasta que la empresa los elimine o elimine la Cuenta de Empresa.</p>
          <p>7.9. Los datos eliminados salen de nuestras copias de seguridad cifradas a medida que esas copias caducan (copias de la base de datos hasta 6 meses, copias de archivos hasta 1 año). Los datos eliminados no se pueden recuperar desde la app.</p>
          <p>7.10. Eliminar una cuenta o una Cuenta de Empresa no cancela la suscripción. Cancélala como se indica en el punto 7.1.</p>
          <p>7.11. Todos los detalles están en nuestra <Link href="/es/privacy">Política de Privacidad</Link> (sección 9) y en <Link href="/es/delete-account">getstroyka.com/es/delete-account</Link>.</p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "8. Uso aceptable",
      content: (
        <>
          <p>Te comprometes a no hacer, ni permitir que nadie en tu Cuenta de Empresa haga, lo siguiente:</p>
          <ul>
            <li>Usar el Servicio con fines ilegales o en violación de cualquier ley local, estatal, nacional o internacional aplicable</li>
            <li>Intentar acceder a los datos de otra Cuenta de Empresa o eludir la separación de datos</li>
            <li>Aplicar ingeniería inversa, descompilar o desensamblar cualquier parte del Servicio</li>
            <li>Usar el Servicio para guardar o transmitir código malicioso, virus o contenido dañino</li>
            <li>Revender, sublicenciar o redistribuir el acceso al Servicio sin nuestro consentimiento por escrito</li>
            <li>Usar medios automatizados (bots, scrapers, etc.) para acceder al Servicio más allá de su uso previsto</li>
            <li>Subir contenido que infrinja los derechos de propiedad intelectual de otros</li>
            <li>Usar el Servicio para rastrear a personas en secreto, o para recopilar información sobre personas sin el aviso o el consentimiento que exige la ley</li>
          </ul>
        </>
      ),
    },
    {
      id: "sanctions",
      title: "9. Sanciones y control de exportaciones",
      content: (
        <>
          <p>9.1. El Servicio se presta desde Estados Unidos y está sujeto a las leyes de sanciones y de control de exportaciones de EE. UU. No puedes usar ni acceder al Servicio desde un país o región sujeto a sanciones integrales de EE. UU., ni desde un lugar donde la ley de EE. UU. restrinja prestar el Servicio (&ldquo;Ubicaciones Restringidas&rdquo;), ni en beneficio de alguien que esté allí, y no puedes exportar ni reexportar las apps en violación de esas leyes.</p>
          <p>9.2. Confirmas que ni tú ni tu empresa están ubicados en una Ubicación Restringida, constituidos conforme a sus leyes ni residen habitualmente allí, y que ni tú ni tu empresa figuran en una lista de partes restringidas del gobierno de EE. UU. ni pertenecen en un 50% o más a alguien que figure en ella.</p>
          <p>9.3. Podemos negar, suspender o terminar el acceso al Servicio, con o sin aviso, si creemos que prestarlo podría infringir esas leyes. Si la ley lo permite, primero te daremos la oportunidad de descargar tus datos.</p>
        </>
      ),
    },
    {
      id: "availability",
      title: "10. Disponibilidad del Servicio",
      content: (
        <>
          <p>10.1. Procuramos mantener una alta disponibilidad del Servicio, pero no garantizamos ningún porcentaje de tiempo activo. Por ahora no ofrecemos un Acuerdo de Nivel de Servicio (SLA) formal.</p>
          <p>10.2. El Servicio puede no estar disponible temporalmente por mantenimiento programado, actualizaciones o problemas técnicos imprevistos. Haremos lo razonable por avisar con anticipación de las interrupciones planificadas.</p>
          <p>10.3. El modo sin conexión está pensado para seguir trabajando durante cortes de internet. Los datos ingresados sin conexión se sincronizan cuando vuelve la conexión.</p>
        </>
      ),
    },
    {
      id: "ip",
      title: "11. Propiedad intelectual",
      content: (
        <>
          <p>11.1. La plataforma Stroyka, incluidos su software, diseño, logotipos, documentación y toda la propiedad intelectual relacionada, es propiedad de Dalen Meridian LLC y está protegida por las leyes de derechos de autor, marcas y demás leyes de propiedad intelectual aplicables.</p>
          <p>11.2. Estos Términos te otorgan una licencia limitada, no exclusiva, intransferible y revocable para usar el Servicio con fines internos de tu negocio mientras uses el Servicio.</p>
          <p>11.3. No puedes copiar, modificar, distribuir, vender ni crear obras derivadas del Servicio ni de ninguna de sus partes.</p>
          <p>11.4. <strong>Comentarios y sugerencias.</strong> Si nos envías comentarios, solicitudes de funciones, ideas o sugerencias sobre el Servicio (&ldquo;Comentarios&rdquo;), nos otorgas una licencia perpetua, irrevocable, mundial y libre de regalías para usar, modificar e incorporar esos Comentarios al Servicio o a cualquier otro producto, sin restricciones, atribución ni compensación. Los Comentarios se envían de forma voluntaria y no son confidenciales.</p>
          <p>11.5. <strong>Sin obligación de implementar.</strong> Agradecemos los Comentarios, pero no tenemos obligación de responder, implementar ni conservar ningún Comentario, solicitud de función o sugerencia. Nada en estos Términos &mdash; ni ninguna conversación, correo o mensaje sobre una posible función &mdash; crea un compromiso de construir, entregar o mantener una funcionalidad concreta, ni un plazo para hacerlo. Las decisiones de producto son exclusivamente nuestras.</p>
        </>
      ),
    },
    {
      id: "warranties",
      title: "12. Exclusión de garantías",
      content: (
        <>
          <p><strong>12.1. EL SERVICIO SE OFRECE &ldquo;TAL CUAL&rdquo; Y &ldquo;SEGÚN DISPONIBILIDAD&rdquo;, SIN GARANTÍA DE NINGÚN TIPO, EXPRESA NI IMPLÍCITA.</strong></p>
          <p><strong>12.2. EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, DALEN MERIDIAN LLC EXCLUYE EXPRESAMENTE TODAS LAS GARANTÍAS, INCLUIDAS, SIN LIMITACIÓN, LAS GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN DETERMINADO, TITULARIDAD Y NO INFRACCIÓN, Y CUALQUIER GARANTÍA DERIVADA DEL CURSO DE LAS NEGOCIACIONES O DE LOS USOS COMERCIALES.</strong></p>
          <p>12.3. No garantizamos que el Servicio funcione sin interrupciones, a tiempo, de forma segura o sin errores, que se corrija cualquier defecto, ni que esté libre de virus u otros componentes dañinos.</p>
          <p><strong>12.4. EL SERVICIO REALIZA CÁLCULOS &mdash; INCLUIDOS COSTOS DE OBRA, COSTOS DE MANO DE OBRA, PAGOS, MÁRGENES Y TOTALES DE FACTURAS &mdash; A PARTIR DE LOS DATOS QUE INGRESAN TÚ Y TUS USUARIOS, Y PUEDE LEER RECIBOS Y LISTAS AUTOMÁTICAMENTE. NO GARANTIZAMOS LA EXACTITUD, INTEGRIDAD O IDONEIDAD DE NINGÚN CÁLCULO, LECTURA AUTOMÁTICA, INFORME, PRESUPUESTO O FACTURA QUE PRODUZCA EL SERVICIO.</strong> Eres el único responsable de revisar y verificar todas las cifras antes de usarlas para cotizar, facturar, pagar nómina, declarar impuestos o tomar cualquier otra decisión de negocio o financiera.</p>
          <p>12.5. Las ubicaciones registradas al marcar entrada y salida vienen del teléfono y pueden ser inexactas o faltar. Son una ayuda para tus registros, no una prueba de dónde estaba alguien.</p>
          <p>12.6. No somos tu proveedor de nómina, contador, asesor fiscal ni abogado. Que tu uso del Servicio cumpla las leyes laborales, de salarios y horas, fiscales, de privacidad u otras que se apliquen a tu negocio es tu responsabilidad.</p>
          <p>12.7. Eres responsable de llevar tus propios registros y copias de seguridad de tu Contenido. Aunque tomamos medidas razonables para proteger y conservar los datos, no garantizamos que el Contenido no se pierda, se dañe o no esté disponible temporalmente.</p>
          <p>12.8. Ningún consejo o información, oral o escrita, que obtengas de nosotros o a través del Servicio crea una garantía que no esté expresamente indicada en estos Términos.</p>
          <p>12.9. Algunas jurisdicciones no permiten excluir ciertas garantías implícitas. En esas jurisdicciones, las exclusiones anteriores se aplican en la máxima medida permitida por la ley, y el resto de esta sección sigue vigente.</p>
        </>
      ),
    },
    {
      id: "liability",
      title: "13. Limitación de responsabilidad",
      content: (
        <>
          <p><strong>13.1. EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, NINGUNA DE LAS PARTES SERÁ RESPONSABLE DE DAÑOS INDIRECTOS, INCIDENTALES, ESPECIALES, CONSECUENTES, EJEMPLARES O PUNITIVOS, NI DE LA PÉRDIDA DE GANANCIAS, INGRESOS, DATOS O REPUTACIÓN, DERIVADOS DE ESTOS TÉRMINOS O DEL SERVICIO O RELACIONADOS CON ELLOS, AUNQUE SE LE HAYA ADVERTIDO DE ESA POSIBILIDAD.</strong></p>
          <p><strong>13.2. EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY, NUESTRA RESPONSABILIDAD TOTAL POR TODAS LAS RECLAMACIONES DERIVADAS DE ESTOS TÉRMINOS O DEL SERVICIO, O RELACIONADAS CON ELLOS, NO SUPERARÁ LA MAYOR DE ESTAS CANTIDADES: (A) LO QUE NOS PAGASTE POR EL SERVICIO EN LOS 12 MESES ANTERIORES AL HECHO QUE ORIGINA LA RECLAMACIÓN, O (B) CIEN DÓLARES ESTADOUNIDENSES (US$100).</strong></p>
          <p>13.3. Estos límites no se aplican a tus obligaciones de pago, a tus obligaciones según la sección 14 ni a la responsabilidad que la ley no permite limitar (por ejemplo, por fraude o, cuando corresponda, por negligencia grave o dolo).</p>
          <p>13.4. El Servicio está pensado para el control de costos y la gestión de cuadrillas. No sustituye el asesoramiento profesional contable, legal o financiero.</p>
        </>
      ),
    },
    {
      id: "indemnification",
      title: "14. Indemnización",
      content: (
        <p>Defenderás, indemnizarás y mantendrás indemne a Dalen Meridian LLC y a sus socios, directivos y agentes frente a reclamaciones, pérdidas y gastos (incluidos honorarios razonables de abogados) presentados por terceros &mdash; incluidos tus Trabajadores, tus clientes y autoridades &mdash; que deriven de (a) el Contenido que tú o tus usuarios ingresen, (b) tu recopilación y uso de información personal de tus Trabajadores o clientes, incluido cualquier aviso o consentimiento necesario para el GPS u otro tipo de control, (c) tus prácticas de pago, salarios y horas, impuestos, facturación y conservación de registros, o (d) tu incumplimiento de estos Términos o de la ley. Te avisaremos pronto de la reclamación y te dejaremos dirigir la defensa, pero no puedes llegar a un acuerdo que nos imponga obligaciones sin nuestro consentimiento.</p>
      ),
    },
    {
      id: "modifications",
      title: "15. Cambios en los Términos",
      content: (
        <>
          <p>15.1. Podemos actualizar estos Términos de vez en cuando. Si los cambios son importantes, te avisaremos por correo o a través del Servicio al menos 30 días antes de que entren en vigor.</p>
          <p>15.2. <strong>A partir del {DATE}</strong>, el punto 15.1 se sustituye por esta regla: los cambios que reduzcan tus derechos o aumenten tus obligaciones entran en vigor al menos 30 días después de que te avisemos por correo o a través del Servicio. Los cambios que exija la ley, que corrijan un problema de seguridad o que no reduzcan tus derechos pueden entrar en vigor al publicarse. Los nuevos subencargados se notifican como indica el Anexo de Tratamiento de Datos.</p>
          <p>15.3. Si sigues usando el Servicio después de la fecha de entrada en vigor de los Términos revisados, aceptas los cambios. Si no estás de acuerdo, puedes cancelar tu suscripción y dejar de usar el Servicio antes de que entren en vigor.</p>
          <p>15.4. <strong>Esta versión.</strong> Publicada el {LAST_UPDATED_ES}. Entra en vigor al publicarse, salvo los cambios de los puntos 7.6, 15.2, 16.7 y 17.3, que entran en vigor el {DATE}. Añade el Anexo de Tratamiento de Datos (4.7), las obligaciones de conservación de registros del empleador (4.6), la facturación de Google Play (6.4, 7.1, 7.3), los Trabajadores (2.6), sanciones y control de exportaciones (9), un límite de responsabilidad de al menos US$100 (13.2), una indemnización más acotada, solo frente a reclamaciones de terceros (14), la opción de tribunales de menor cuantía, ayuda con las tarifas y la posibilidad de excluirse del arbitraje (16), un plazo para exportar datos después de cualquier terminación (17.4) y los términos de las tiendas de apps (18.6).</p>
        </>
      ),
    },
    {
      id: "governing-law",
      title: "16. Ley aplicable y disputas",
      content: (
        <>
          <p>16.1. Estos Términos se rigen por las leyes del Estado de Texas, Estados Unidos de América, sin tener en cuenta sus normas sobre conflicto de leyes, y, en lo relativo al arbitraje, por la Ley Federal de Arbitraje de EE. UU.</p>
          <p>16.2. <strong>Primero, escríbenos.</strong> Antes de presentar una reclamación, escribe a {SUPPORT} explicando la disputa y lo que pides. Intentaremos de buena fe resolverla en 30 días, y haremos lo mismo antes de presentar una reclamación contra ti.</p>
          <p>16.3. <strong>Arbitraje.</strong> Si la disputa no se resuelve, se decidirá mediante arbitraje individual vinculante administrado por la American Arbitration Association (AAA) conforme a sus Reglas de Arbitraje Comercial o, si eres una persona que usa el Servicio principalmente con fines personales, sus Reglas de Arbitraje de Consumo. Las audiencias pueden celebrarse por video o en Texas.</p>
          <p>16.4. <strong>Menor cuantía.</strong> Cualquiera de las partes puede presentar una reclamación individual ante un tribunal de menor cuantía en lugar de ir a arbitraje.</p>
          <p>16.5. <strong>Tarifas.</strong> Si tu reclamación es inferior a US$10.000, pagaremos las tarifas de presentación y administración de la AAA y los honorarios del árbitro, salvo que el árbitro considere la reclamación frívola o presentada con un fin indebido.</p>
          <p>16.6. <strong>Exclusión del arbitraje.</strong> Puedes excluirte del arbitraje escribiendo a {SUPPORT} desde el correo de tu cuenta con el asunto &ldquo;Arbitration opt-out&rdquo; dentro de los 30 días siguientes a aceptar estos Términos por primera vez o, si aceptaste una versión anterior, a más tardar el {DATE}. Si te excluyes, las disputas van a los tribunales del punto 16.8.</p>
          <p>16.7. <strong>Arbitraje masivo (a partir del {DATE}).</strong> Si se presentan 25 o más demandas de arbitraje similares contra nosotros, o por nosotros, por los mismos abogados o partes coordinadas o con su ayuda, se tramitarán en lotes de hasta 25 conforme a las Reglas Complementarias de Arbitraje Masivo de la AAA, y los plazos de prescripción quedan suspendidos para las reclamaciones que esperan su turno.</p>
          <p>16.8. <strong>Tribunales.</strong> Las reclamaciones que no se arbitren se presentarán ante los tribunales estatales o federales del condado de {VENUE_COUNTY.es}, Texas, y ambas partes aceptan su jurisdicción. Cualquiera de las partes puede solicitar una medida cautelar u otra reparación equitativa ante cualquier tribunal competente.</p>
          <p><strong>16.9. RENUNCIA A ACCIONES COLECTIVAS. TÚ Y DALEN MERIDIAN LLC ACEPTAN QUE CADA PARTE SOLO PUEDE PRESENTAR RECLAMACIONES CONTRA LA OTRA A TÍTULO INDIVIDUAL, Y NO COMO DEMANDANTE O MIEMBRO DE UN GRUPO EN NINGÚN PROCEDIMIENTO COLECTIVO, CONSOLIDADO O REPRESENTATIVO.</strong> El árbitro no puede acumular las reclamaciones de más de una parte ni presidir ningún tipo de procedimiento colectivo o representativo, salvo la tramitación por lotes del punto 16.7.</p>
          <p><strong>16.10. RENUNCIA A JUICIO CON JURADO. EN LA MEDIDA EN QUE UNA RECLAMACIÓN SE TRAMITE ANTE UN TRIBUNAL Y NO EN ARBITRAJE, TÚ Y DALEN MERIDIAN LLC RENUNCIAN DE FORMA CONSCIENTE Y VOLUNTARIA A CUALQUIER DERECHO A UN JUICIO CON JURADO.</strong></p>
          <p><strong>16.11. PLAZO PARA RECLAMAR. CUALQUIER RECLAMACIÓN RELACIONADA CON ESTOS TÉRMINOS O EL SERVICIO DEBE PRESENTARSE DENTRO DE UN (1) AÑO DESDE QUE SURGE.</strong> Las reclamaciones no presentadas en ese plazo quedan definitivamente excluidas, salvo cuando la ley aplicable no permita esa limitación.</p>
          <p>16.12. Si la renuncia a acciones colectivas del punto 16.9 se declara inaplicable para una reclamación concreta, el acuerdo de arbitraje del punto 16.3 no se aplicará a esa reclamación, que se tramitará ante los tribunales del punto 16.8. El resto de esta sección sigue vigente.</p>
          <p>16.13. Nada en esta sección limita los derechos que te dan las normas imperativas de protección del consumidor o de datos del país donde vives, ni la ley y los tribunales que las Cláusulas Contractuales Tipo del Anexo de Tratamiento de Datos fijan para sí mismas.</p>
        </>
      ),
    },
    {
      id: "termination",
      title: "17. Suspensión y terminación",
      content: (
        <>
          <p>17.1. <strong>Suspensión.</strong> Podemos suspender el acceso, total o parcialmente, si (a) tu uso supone un riesgo de seguridad o puede dañar el Servicio o a otros, (b) lo exige la ley, un tribunal o una autoridad, incluso conforme a la sección 9, (c) una factura de suscripción del sitio web lleva más de 15 días vencida, o (d) incumples de forma grave la sección 8. Te avisaremos con antelación cuando sea razonable y restableceremos el acceso cuando se resuelva el problema.</p>
          <p>17.2. <strong>Por tu parte.</strong> Puedes dejar de usar el Servicio y eliminar tu cuenta o tu Cuenta de Empresa en cualquier momento (sección 7).</p>
          <p>17.3. <strong>Por nuestra parte.</strong> Podemos terminar estos Términos por un incumplimiento grave que no corrijas en los 15 días siguientes a nuestro aviso, o de inmediato por actividad ilegal o por incumplir la sección 8 o 9. <strong>A partir del {DATE}</strong>, también podemos dejar de prestarte el Servicio, o dejar de ofrecerlo por completo, con al menos 60 días de aviso; en ese caso te reembolsaremos las cuotas prepagadas de la suscripción del sitio web por el periodo posterior a la fecha de fin.</p>
          <p>17.4. <strong>Tus datos después de la terminación.</strong> Salvo que la terminación se deba a una actividad ilegal o que la ley (incluida la sección 9) no lo permita, tendrás 30 días después de la terminación para exportar tus datos. Después eliminamos los datos de la Cuenta de Empresa como se describe en nuestra <Link href="/es/privacy">Política de Privacidad</Link> (sección 9), incluida su salida de las copias de seguridad.</p>
          <p>17.5. Las secciones 4, 11 a 14, 16, el punto 17.4 y la sección 18 siguen vigentes después de la terminación.</p>
        </>
      ),
    },
    {
      id: "miscellaneous",
      title: "18. Disposiciones varias",
      content: (
        <>
          <p>18.1. <strong>Acuerdo completo.</strong> Estos Términos, junto con la Política de Privacidad y el Anexo de Tratamiento de Datos, constituyen el acuerdo completo entre tú y Dalen Meridian LLC sobre el Servicio.</p>
          <p>18.2. <strong>Divisibilidad.</strong> Si alguna disposición de estos Términos se considera inaplicable, las demás siguen plenamente vigentes.</p>
          <p>18.3. <strong>Renuncia.</strong> Que Stroyka no haga valer un derecho o disposición de estos Términos no significa que renuncie a él.</p>
          <p>18.4. <strong>Cesión.</strong> No puedes ceder ni transferir tus derechos bajo estos Términos sin nuestro consentimiento previo por escrito. Nosotros podemos ceder nuestros derechos y obligaciones sin restricción.</p>
          <p>18.5. <strong>Traducciones.</strong> Estos Términos también se ofrecen en español y ruso para tu comodidad. Si una traducción difiere de la versión en inglés, prevalece la versión en inglés.</p>
          <p>18.6. <strong>Tiendas de apps.</strong> Si descargaste la app del App Store de Apple, también se aplica a tu uso de la app el {EULA} de Apple. Estos Términos son solo entre tú y Dalen Meridian LLC, no con Apple ni con Google. Apple y Google no son responsables de la app ni de su contenido y no tienen obligación de mantenerla ni de darle soporte. Respecto de la app de iPhone, Apple y sus filiales son terceros beneficiarios de estos Términos y pueden hacerlos cumplir frente a ti.</p>
          <p>18.7. <strong>Hechos fuera de nuestro control.</strong> Ninguna de las partes responde por retrasos o incumplimientos causados por hechos fuera de su control razonable, como caídas de proveedores de internet o de hosting, desastres naturales, guerras o actos de autoridad. Esto no exime de las obligaciones de pago.</p>
          <p>18.8. <strong>Avisos.</strong> Enviamos los avisos al correo del titular de la cuenta o a través del Servicio. Tú envías los avisos a {SUPPORT}.</p>
          <p>18.9. <strong>Relación entre las partes.</strong> Somos partes independientes. Estos Términos no crean una sociedad, agencia ni relación laboral.</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "19. Contacto",
      content: (
        <>
          <p>Si tienes preguntas sobre estos Términos, escríbenos:</p>
          <p>
            Dalen Meridian LLC<br />
            {POSTAL_ADDRESS}<br />
            Correo: {SUPPORT}<br />
            Sitio web: <a href="https://getstroyka.com">getstroyka.com</a>
          </p>
        </>
      ),
    },
  ],
};
