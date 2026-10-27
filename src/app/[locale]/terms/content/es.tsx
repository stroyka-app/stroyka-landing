import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;

export const termsEs: LegalDoc = {
  title: "Términos de Servicio",
  subtitle: "Lee con atención estos Términos de Servicio antes de usar Stroyka.",
  effectiveDate: "Vigentes desde abril de 2026 · Actualizados el 26 de octubre de 2026",
  sections: [
    {
      id: "definitions",
      title: "1. Definiciones",
      content: (
        <ul>
          <li><strong>&ldquo;Stroyka&rdquo;, &ldquo;nosotros&rdquo; o &ldquo;nuestro&rdquo;</strong> se refiere a Dalen Meridian LLC, una sociedad de responsabilidad limitada de Texas que opera como Stroyka, y a la aplicación Stroyka y sus servicios relacionados.</li>
          <li><strong>&ldquo;Servicio&rdquo;</strong> se refiere al software Stroyka de control de costos de obra y gestión de cuadrillas, ofrecido a través de nuestras apps para iPhone y Android y de los servicios en la nube y el sitio web relacionados.</li>
          <li><strong>&ldquo;Cliente&rdquo;, &ldquo;tú&rdquo; o &ldquo;tu&rdquo;</strong> se refiere a la persona o empresa que crea una cuenta y usa el Servicio.</li>
          <li><strong>&ldquo;Cuenta de Empresa&rdquo;</strong> se refiere a la cuenta de la organización dentro del Servicio, en la que se agrupan todos los proyectos, usuarios y datos.</li>
          <li><strong>&ldquo;Jefe&rdquo;</strong> se refiere a un usuario con privilegios de administrador en una Cuenta de Empresa, que puede gestionar proyectos, invitar trabajadores, aprobar solicitudes y gestionar la facturación.</li>
          <li><strong>&ldquo;Trabajador&rdquo;</strong> se refiere a un usuario invitado por un Jefe a una Cuenta de Empresa, con permisos limitados para registrar tiempo, registrar compras y completar tareas asignadas.</li>
          <li><strong>&ldquo;Contenido&rdquo;</strong> se refiere a todos los datos, textos, imágenes, fotos, archivos y demás información que se sube, envía o genera en el Servicio.</li>
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
          <p>3.3. Algunas funciones usan servicios de terceros, por ejemplo la lectura de fotos de recibos con un proveedor de IA. Lo que compartimos con ellos se describe en nuestra <Link href="/es/privacy">Política de Privacidad</Link>.</p>
          <p>3.4. Podemos actualizar, modificar o mejorar el Servicio de vez en cuando. Haremos lo razonable por mantener la compatibilidad, pero nos reservamos el derecho de cambiar funciones, APIs o interfaces con aviso razonable.</p>
        </>
      ),
    },
    {
      id: "data-ownership",
      title: "4. Propiedad y portabilidad de los datos",
      content: (
        <>
          <p>4.1. <strong>Tus datos son tuyos.</strong> Todo el Contenido que tú o tus trabajadores suben, ingresan o generan en el Servicio sigue siendo de tu propiedad. Stroyka no reclama ningún derecho de propiedad sobre tu Contenido.</p>
          <p>4.2. Nos otorgas una licencia limitada y no exclusiva para guardar, procesar, transmitir y mostrar tu Contenido con el único fin de prestarte el Servicio.</p>
          <p>4.3. Puedes descargar una copia de tus datos en cualquier momento (Perfil &rarr; Privacidad y datos &rarr; Descargar mis datos), y los Jefes pueden exportar informes, por ejemplo a PDF, CSV o Excel.</p>
          <p>4.4. <strong>Información personal de otras personas.</strong> Cuando ingresas información personal de tus trabajadores o clientes (por ejemplo nombres, datos de contacto, tarifas, horas o ubicaciones), eres responsable de tener derecho a recopilarla y usarla, y de informar a esas personas cuando sea obligatorio. Tratamos esa información en tu nombre para prestar el Servicio, como se describe en nuestra <Link href="/es/privacy">Política de Privacidad</Link>.</p>
          <p>4.5. Cancelar un plan de pago no elimina tus datos (ver la sección 7). La eliminación de una cuenta o de una Cuenta de Empresa se trata en los puntos 7.6 a 7.11.</p>
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
          <p>5.4. Nos tomamos la seguridad en serio y seguimos buenas prácticas, pero ningún sistema es perfectamente seguro. No podemos garantizar una seguridad absoluta y no somos responsables de accesos no autorizados causados por factores fuera de nuestro control razonable.</p>
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
          <p>6.4. <strong>Las compras en la app de iPhone</strong> las vende y cobra Apple a través del App Store, y se renuevan automáticamente hasta que las canceles. Los términos de Apple rigen el pago, la renovación, la cancelación y los reembolsos de esas compras.</p>
          <p>6.5. <strong>Las compras en nuestro sitio web</strong> (incluidas las suscripciones de equipos que usan la app de Android) se cobran a través de Stripe, nuestro procesador de pagos. Tus datos de pago van directamente a Stripe y nunca se guardan en nuestros servidores.</p>
          <p>6.6. Nos reservamos el derecho de cambiar los precios con 30 días de aviso por escrito. Los cambios no se aplican a tu ciclo de facturación actual. Los precios conservados (por ejemplo, tarifas de primeros clientes) se respetan mientras tu suscripción esté activa y al corriente.</p>
        </>
      ),
    },
    {
      id: "cancellation",
      title: "7. Cancelación, reembolsos y eliminación",
      content: (
        <>
          <p>7.1. Puedes cancelar en cualquier momento. Una suscripción del App Store se cancela en los ajustes de suscripciones de tu Apple ID. Una suscripción del sitio web se cancela desde la pantalla de facturación de la app o escribiéndonos a {SUPPORT}.</p>
          <p>7.2. Al cancelar, tu suscripción sigue activa hasta el final del periodo de facturación actual. No se te volverá a cobrar.</p>
          <p>7.3. En las suscripciones del sitio web no hacemos reembolsos prorrateados por periodos parciales; conservas el acceso hasta el final del periodo. Los reembolsos de compras del App Store los gestiona Apple según sus políticas.</p>
          <p>7.4. Cuando termina un plan de pago, tu Cuenta de Empresa pasa al plan gratis. Las funciones exclusivas de los planes de pago dejan de estar disponibles, pero <strong>tus datos no se eliminan</strong> y siguen accesibles y exportables.</p>
          <h3>Eliminar tu cuenta o tu empresa</h3>
          <p>7.5. Cancelar no es eliminar. Para eliminar datos:</p>
          <p>7.6. <strong>Un Trabajador</strong> puede eliminar su cuenta en la app (Perfil &rarr; Privacidad y datos &rarr; Eliminar mi cuenta) o escribiendo a {SUPPORT} desde el correo de la cuenta. Se eliminan la cuenta y los registros que creó ese Trabajador: desaparecen de la app de inmediato y se borran de forma permanente de nuestros servidores en un plazo de 30 días.</p>
          <p>7.7. <strong>Un Jefe</strong> no puede eliminar solo su propia cuenta. El Jefe puede eliminar toda la Cuenta de Empresa en la app (Perfil &rarr; Privacidad y datos &rarr; Eliminar mi empresa). Sus datos se ocultan de inmediato y se borran de forma permanente de nuestros servidores en un plazo de 30 días.</p>
          <p>7.8. Si una Cuenta de Empresa da de baja a un Trabajador, los registros que creó se quedan con la empresa como registros de su negocio, hasta que la empresa los elimine o elimine la Cuenta de Empresa.</p>
          <p>7.9. Los datos eliminados salen de nuestras copias de seguridad cifradas a medida que esas copias caducan (copias de la base de datos hasta 6 meses, copias de archivos hasta 1 año). Los datos eliminados no se pueden recuperar desde la app.</p>
          <p>7.10. Eliminar una cuenta o una Cuenta de Empresa no cancela la suscripción. Cancélala como se indica en el punto 7.1.</p>
          <p>7.11. Todos los detalles están en nuestra <Link href="/es/privacy">Política de Privacidad</Link> (sección 8) y en <Link href="/es/delete-account">getstroyka.com/es/delete-account</Link>.</p>
        </>
      ),
    },
    {
      id: "acceptable-use",
      title: "8. Uso aceptable",
      content: (
        <>
          <p>Te comprometes a no:</p>
          <ul>
            <li>Usar el Servicio con fines ilegales o en violación de cualquier ley local, estatal, nacional o internacional aplicable</li>
            <li>Intentar acceder a los datos de otra Cuenta de Empresa o eludir la separación de datos</li>
            <li>Aplicar ingeniería inversa, descompilar o desensamblar cualquier parte del Servicio</li>
            <li>Usar el Servicio para guardar o transmitir código malicioso, virus o contenido dañino</li>
            <li>Revender, sublicenciar o redistribuir el acceso al Servicio sin nuestro consentimiento por escrito</li>
            <li>Usar medios automatizados (bots, scrapers, etc.) para acceder al Servicio más allá de su uso previsto</li>
            <li>Subir contenido que infrinja los derechos de propiedad intelectual de otros</li>
          </ul>
        </>
      ),
    },
    {
      id: "availability",
      title: "9. Disponibilidad del Servicio",
      content: (
        <>
          <p>9.1. Procuramos mantener una alta disponibilidad del Servicio, pero no garantizamos ningún porcentaje de tiempo activo. Por ahora no ofrecemos un Acuerdo de Nivel de Servicio (SLA) formal.</p>
          <p>9.2. El Servicio puede no estar disponible temporalmente por mantenimiento programado, actualizaciones o problemas técnicos imprevistos. Haremos lo razonable por avisar con anticipación de las interrupciones planificadas.</p>
          <p>9.3. El modo sin conexión está pensado para seguir trabajando durante cortes de internet. Los datos ingresados sin conexión se sincronizan cuando vuelve la conexión.</p>
        </>
      ),
    },
    {
      id: "ip",
      title: "10. Propiedad intelectual",
      content: (
        <>
          <p>10.1. La plataforma Stroyka, incluidos su software, diseño, logotipos, documentación y toda la propiedad intelectual relacionada, es propiedad de Dalen Meridian LLC y está protegida por las leyes de derechos de autor, marcas y demás leyes de propiedad intelectual aplicables.</p>
          <p>10.2. Estos Términos te otorgan una licencia limitada, no exclusiva, intransferible y revocable para usar el Servicio con fines internos de tu negocio mientras uses el Servicio.</p>
          <p>10.3. No puedes copiar, modificar, distribuir, vender ni crear obras derivadas del Servicio ni de ninguna de sus partes.</p>
          <p>10.4. <strong>Comentarios y sugerencias.</strong> Si nos envías comentarios, solicitudes de funciones, ideas o sugerencias sobre el Servicio (&ldquo;Comentarios&rdquo;), nos otorgas una licencia perpetua, irrevocable, mundial y libre de regalías para usar, modificar e incorporar esos Comentarios al Servicio o a cualquier otro producto, sin restricciones, atribución ni compensación. Los Comentarios se envían de forma voluntaria y no son confidenciales.</p>
          <p>10.5. <strong>Sin obligación de implementar.</strong> Agradecemos los Comentarios, pero no tenemos obligación de responder, implementar ni conservar ningún Comentario, solicitud de función o sugerencia. Nada en estos Términos &mdash; ni ninguna conversación, correo o mensaje sobre una posible función &mdash; crea un compromiso de construir, entregar o mantener una funcionalidad concreta, ni un plazo para hacerlo. Las decisiones de producto son exclusivamente nuestras.</p>
        </>
      ),
    },
    {
      id: "warranties",
      title: "11. Exclusión de garantías",
      content: (
        <>
          <p><strong>11.1. EL SERVICIO SE OFRECE &ldquo;TAL CUAL&rdquo; Y &ldquo;SEGÚN DISPONIBILIDAD&rdquo;, SIN GARANTÍA DE NINGÚN TIPO, EXPRESA NI IMPLÍCITA.</strong></p>
          <p><strong>11.2. EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE, DALEN MERIDIAN LLC EXCLUYE EXPRESAMENTE TODAS LAS GARANTÍAS, INCLUIDAS, SIN LIMITACIÓN, LAS GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD, IDONEIDAD PARA UN FIN DETERMINADO, TITULARIDAD Y NO INFRACCIÓN, Y CUALQUIER GARANTÍA DERIVADA DEL CURSO DE LAS NEGOCIACIONES O DE LOS USOS COMERCIALES.</strong></p>
          <p>11.3. No garantizamos que el Servicio funcione sin interrupciones, a tiempo, de forma segura o sin errores, que se corrija cualquier defecto, ni que esté libre de virus u otros componentes dañinos.</p>
          <p><strong>11.4. EL SERVICIO REALIZA CÁLCULOS &mdash; INCLUIDOS COSTOS DE OBRA, COSTOS DE MANO DE OBRA, MÁRGENES Y TOTALES DE FACTURAS &mdash; A PARTIR DE LOS DATOS QUE INGRESAN TÚ Y TUS USUARIOS, Y PUEDE LEER RECIBOS Y LISTAS AUTOMÁTICAMENTE. NO GARANTIZAMOS LA EXACTITUD, INTEGRIDAD O IDONEIDAD DE NINGÚN CÁLCULO, LECTURA AUTOMÁTICA, INFORME, PRESUPUESTO O FACTURA QUE PRODUZCA EL SERVICIO.</strong> Eres el único responsable de revisar y verificar todas las cifras antes de usarlas para cotizar, facturar, pagar nómina, declarar impuestos o tomar cualquier otra decisión de negocio o financiera.</p>
          <p>11.5. Eres responsable de llevar tus propios registros y copias de seguridad de tu Contenido. Aunque tomamos medidas razonables para proteger y conservar los datos, no garantizamos que el Contenido no se pierda, se dañe o no esté disponible temporalmente, y no somos responsables de esa pérdida.</p>
          <p>11.6. Ningún consejo o información, oral o escrita, que obtengas de nosotros o a través del Servicio crea una garantía que no esté expresamente indicada en estos Términos.</p>
          <p>11.7. Algunas jurisdicciones no permiten excluir ciertas garantías implícitas. En esas jurisdicciones, las exclusiones anteriores se aplican en la máxima medida permitida por la ley, y el resto de esta sección sigue vigente.</p>
        </>
      ),
    },
    {
      id: "liability",
      title: "12. Limitación de responsabilidad",
      content: (
        <>
          <p>12.1. En la máxima medida permitida por la ley aplicable, Dalen Meridian LLC no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, incluidos, entre otros, la pérdida de ganancias, datos, oportunidades de negocio o reputación, derivados del uso del Servicio o relacionados con él.</p>
          <p>12.2. Nuestra responsabilidad total por cualquier reclamación relacionada con estos Términos o el Servicio no superará el monto que pagaste a Stroyka en los doce (12) meses anteriores a la reclamación.</p>
          <p>12.3. El Servicio está pensado para el control de costos y la gestión de cuadrillas. No sustituye el asesoramiento profesional contable, legal o financiero. Eres responsable de verificar la exactitud de todos los datos e informes que genera el Servicio.</p>
        </>
      ),
    },
    {
      id: "indemnification",
      title: "13. Indemnización",
      content: (
        <p>Aceptas indemnizar, defender y mantener indemne a Dalen Meridian LLC, a sus directivos, administradores, empleados y agentes frente a cualquier reclamación, responsabilidad, daño, pérdida y gasto (incluidos honorarios razonables de abogados) derivados de tu uso del Servicio, de tu incumplimiento de estos Términos o de tu violación de derechos de terceros, o relacionados con ellos.</p>
      ),
    },
    {
      id: "modifications",
      title: "14. Cambios en los Términos",
      content: (
        <>
          <p>14.1. Podemos actualizar estos Términos de vez en cuando. Si los cambios son importantes, te avisaremos por correo o a través del Servicio al menos 30 días antes de que entren en vigor.</p>
          <p>14.2. Si sigues usando el Servicio después de la fecha de entrada en vigor de los Términos revisados, aceptas los cambios. Si no estás de acuerdo, puedes cancelar tu suscripción y dejar de usar el Servicio antes de que entren en vigor.</p>
        </>
      ),
    },
    {
      id: "governing-law",
      title: "15. Ley aplicable",
      content: (
        <>
          <p>15.1. Estos Términos se rigen e interpretan de acuerdo con las leyes del Estado de Texas, Estados Unidos de América, sin tener en cuenta sus normas sobre conflicto de leyes.</p>
          <p>15.2. Cualquier disputa relacionada con estos Términos o el Servicio se intentará resolver primero mediante una negociación de buena fe. Si la negociación no prospera, la disputa se resolverá mediante arbitraje vinculante conforme a las reglas de la American Arbitration Association, en el Estado de Texas.</p>
          <p>15.3. Nada en esta sección impide que cualquiera de las partes solicite una medida cautelar u otra reparación equitativa ante un tribunal competente.</p>
          <p><strong>15.4. RENUNCIA A ACCIONES COLECTIVAS. TÚ Y DALEN MERIDIAN LLC ACEPTAN QUE CADA PARTE SOLO PUEDE PRESENTAR RECLAMACIONES CONTRA LA OTRA A TÍTULO INDIVIDUAL, Y NO COMO DEMANDANTE O MIEMBRO DE UN GRUPO EN NINGÚN PROCEDIMIENTO COLECTIVO, CONSOLIDADO O REPRESENTATIVO.</strong> El árbitro no puede acumular las reclamaciones de más de una parte ni presidir ningún tipo de procedimiento colectivo o representativo.</p>
          <p><strong>15.5. RENUNCIA A JUICIO CON JURADO. EN LA MEDIDA EN QUE UNA RECLAMACIÓN SE TRAMITE ANTE UN TRIBUNAL Y NO EN ARBITRAJE, TÚ Y DALEN MERIDIAN LLC RENUNCIAN DE FORMA CONSCIENTE Y VOLUNTARIA A CUALQUIER DERECHO A UN JUICIO CON JURADO.</strong></p>
          <p><strong>15.6. PLAZO PARA RECLAMAR. CUALQUIER RECLAMACIÓN RELACIONADA CON ESTOS TÉRMINOS O EL SERVICIO DEBE PRESENTARSE DENTRO DE UN (1) AÑO DESDE QUE SURGE.</strong> Las reclamaciones no presentadas en ese plazo quedan definitivamente excluidas, salvo cuando la ley aplicable no permita esa limitación.</p>
          <p>15.7. Si la renuncia a acciones colectivas del punto 15.4 se declara inaplicable para una reclamación concreta, el acuerdo de arbitraje del punto 15.2 no se aplicará a esa reclamación, que se tramitará ante un tribunal competente del Estado de Texas. El resto de esta sección sigue vigente.</p>
        </>
      ),
    },
    {
      id: "termination",
      title: "16. Terminación",
      content: (
        <>
          <p>16.1. Podemos suspender o terminar tu acceso al Servicio si incumples estos Términos, no pagas la suscripción o realizas actividades que razonablemente consideremos dañinas para el Servicio, otros usuarios o nuestro negocio.</p>
          <p>16.2. Si terminamos el acceso por causa justificada, tendrás 30 días para exportar tus datos, salvo que la terminación se deba a una actividad ilegal o a una violación de la sección 8 (Uso aceptable), en cuyo caso el acceso puede terminarse de inmediato.</p>
        </>
      ),
    },
    {
      id: "miscellaneous",
      title: "17. Disposiciones varias",
      content: (
        <>
          <p>17.1. <strong>Acuerdo completo.</strong> Estos Términos, junto con la Política de Privacidad, constituyen el acuerdo completo entre tú y Dalen Meridian LLC sobre el Servicio.</p>
          <p>17.2. <strong>Divisibilidad.</strong> Si alguna disposición de estos Términos se considera inaplicable, las demás siguen plenamente vigentes.</p>
          <p>17.3. <strong>Renuncia.</strong> Que Stroyka no haga valer un derecho o disposición de estos Términos no significa que renuncie a él.</p>
          <p>17.4. <strong>Cesión.</strong> No puedes ceder ni transferir tus derechos bajo estos Términos sin nuestro consentimiento previo por escrito. Nosotros podemos ceder nuestros derechos y obligaciones sin restricción.</p>
          <p>17.5. <strong>Traducciones.</strong> Estos Términos también se ofrecen en español y ruso para tu comodidad. Si una traducción difiere de la versión en inglés, prevalece la versión en inglés.</p>
        </>
      ),
    },
    {
      id: "contact",
      title: "18. Contacto",
      content: (
        <>
          <p>Si tienes preguntas sobre estos Términos, escríbenos:</p>
          <p>
            Dalen Meridian LLC<br />
            Correo: {SUPPORT}<br />
            Sitio web: <a href="https://getstroyka.com">getstroyka.com</a>
          </p>
        </>
      ),
    },
  ],
};
