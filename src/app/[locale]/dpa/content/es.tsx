import Link from "next/link";
import type { LegalDoc } from "../../privacy/content/types";
import {
  LAST_UPDATED_ES,
  NOTICE_EFFECTIVE_ES,
  POSTAL_ADDRESS,
  REPRESENTATIVES_INTERIM,
} from "@/lib/legal";

const SUPPORT = <a href="mailto:support@getstroyka.com">support@getstroyka.com</a>;
const DATE = NOTICE_EFFECTIVE_ES;
const REPS = REPRESENTATIVES_INTERIM.es;
const SCC = (
  <a href="https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj" target="_blank" rel="noopener noreferrer">
    Cláusulas Contractuales Tipo
  </a>
);
const UK_ADDENDUM = (
  <a href="https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/international-transfers/international-data-transfer-agreement-and-guidance/" target="_blank" rel="noopener noreferrer">
    Anexo de Transferencia Internacional de Datos
  </a>
);

export const dpaEs: LegalDoc = {
  title: "Anexo de Tratamiento de Datos",
  subtitle: "Cómo tratamos la información personal que tu empresa pone en Stroyka. Forma parte de nuestros Términos de Servicio; no hay nada que firmar.",
  effectiveDate: `Última actualización: ${LAST_UPDATED_ES} · El punto 4.3 cambia el ${DATE}`,
  sections: [
    {
      id: "scope",
      title: "1. Entre quiénes es y cuándo se aplica",
      content: (
        <>
          <p>1.1. Este Anexo de Tratamiento de Datos (&ldquo;Anexo&rdquo;) se celebra entre Dalen Meridian LLC, d/b/a Stroyka, {POSTAL_ADDRESS} (&ldquo;Stroyka&rdquo;, &ldquo;nosotros&rdquo;), y el Cliente titular de una Cuenta de Empresa (&ldquo;tú&rdquo;). Forma parte de nuestros <Link href="/es/terms">Términos de Servicio</Link> (punto 4.7) y lo aceptas al aceptar los Términos. No hace falta firma.</p>
          <p>1.2. Se aplica siempre que tratamos información personal por tu cuenta a través del Servicio (&ldquo;Datos Personales del Cliente&rdquo;). Respecto de esa información tú eres el responsable (o &ldquo;controller&rdquo;, &ldquo;negocio&rdquo;, &ldquo;operador&rdquo;, &ldquo;data fiduciary&rdquo;, según tu ley) y nosotros somos tu encargado (o &ldquo;proveedor de servicios&rdquo;). Si tú mismo eres encargado de otra persona, nosotros somos tu subencargado.</p>
          <p>1.3. No cubre la información que tratamos para nuestros propios fines como responsables &mdash; las cuentas e inicios de sesión de tus usuarios, la facturación, la analítica de uso, los informes de fallos, los registros de seguridad y nuestros propios correos. Eso lo cubre nuestra <Link href="/es/privacy">Política de Privacidad</Link>.</p>
          <p>1.4. Si este Anexo y los Términos se contradicen, prevalece este Anexo para los Datos Personales del Cliente. Si las Cláusulas Contractuales Tipo (sección 11) contradicen a cualquiera de ellos, prevalecen las Cláusulas.</p>
        </>
      ),
    },
    {
      id: "details",
      title: "2. Detalles del tratamiento",
      content: (
        <ul>
          <li><strong>Objeto y finalidad:</strong> prestar el Servicio según los Términos: guardar, sincronizar, calcular, mostrar, enviar y eliminar los registros de tu empresa.</li>
          <li><strong>Duración:</strong> mientras uses el Servicio y después hasta su eliminación según la sección 12.</li>
          <li><strong>Naturaleza:</strong> recogida a través de las apps, almacenamiento, organización, consulta, cálculo, transmisión (por ejemplo facturas y notificaciones), copia de seguridad y eliminación.</li>
          <li><strong>Personas a las que se refieren los datos:</strong> tus Jefes y Trabajadores (empleados y subcontratistas), tus clientes y sus personas de contacto, y cualquier otra persona que ingreses.</li>
          <li><strong>Tipos de datos:</strong> nombres, datos de contacto, roles; horas y registros de tiempo; tarifas y forma de pago; ubicaciones registradas al marcar entrada y salida (si usas el reloj con GPS); compras de materiales, gastos, recibos y sus fotos; viajes y kilometraje; solicitudes, tareas, mensajes de tareas, bitácoras diarias; fotos, videos (con sonido) y archivos; datos de clientes, notas y facturas.</li>
          <li><strong>Datos sensibles:</strong> el Servicio no los necesita. Por favor no ingreses datos de salud, números de documentos de identidad de personas ni datos sensibles similares.</li>
        </ul>
      ),
    },
    {
      id: "our-duties",
      title: "3. Lo que prometemos",
      content: (
        <>
          <p>3.1. Tratamos los Datos Personales del Cliente solo según tus instrucciones documentadas (sección 4), también en cuanto a transferencias a otros países, salvo que la ley exija otra cosa; en ese caso te avisamos antes, salvo que la ley lo prohíba.</p>
          <p>3.2. Te avisamos de inmediato si creemos que una instrucción infringe la ley de protección de datos.</p>
          <p>3.3. Todas las personas de Stroyka que pueden acceder a los Datos Personales del Cliente están obligadas a mantenerlos confidenciales y solo acceden a ellos como describe la sección 7 de nuestra Política de Privacidad.</p>
          <p>3.4. No vendemos los Datos Personales del Cliente, no los usamos para publicidad y no los usamos para nuestros propios fines más allá de hacer funcionar, proteger y dar soporte al Servicio para ti.</p>
        </>
      ),
    },
    {
      id: "instructions",
      title: "4. Tus instrucciones",
      content: (
        <>
          <p>4.1. Tus instrucciones son los Términos y este Anexo, y lo que tú y tus usuarios hacen en el Servicio: lo que ingresan, la configuración que eligen y las acciones que realizan (por ejemplo exportar, eliminar, enviar una factura). Puedes dar más instrucciones por escrito a {SUPPORT} si son coherentes con los Términos.</p>
          <p>4.2. <strong>Reloj con GPS.</strong> Tú decides si lo activas. Cuando está activo, registramos la ubicación de un Trabajador solo al marcar entrada y salida, y solo si ese Trabajador lo permitió en la app y en su teléfono. Un Trabajador puede desactivarlo cuando quiera y seguir marcando.</p>
          <p>4.3. <strong>Cuando un Trabajador elimina su propia cuenta.</strong> Nos indicas que eliminemos el inicio de sesión del Trabajador, sus datos de contacto, tokens de notificaciones, configuración de notificaciones, consentimiento de ubicación y las ubicaciones registradas al marcar entrada y salida. <strong>A partir del {DATE}</strong>, también nos indicas que conservemos en tu Cuenta de Empresa los demás registros que creó ese Trabajador &mdash; horas, gastos y compras, recibos, viajes, solicitudes, bitácoras diarias, mensajes de tareas, fotos y videos &mdash; con su nombre, hasta que los elimines o elimines la Cuenta de Empresa. Hasta el {DATE} (y desde versiones de la app anteriores a la 1.0.62), la eliminación por parte del Trabajador también borra, en un plazo de 31 días, sus horas, gastos y compras, viajes, solicitudes y bitácoras diarias y las fotos adjuntas; sus recibos, mensajes de tareas con sus fotos y videos, y días libres se quedan en tu Cuenta de Empresa.</p>
          <p>4.4. <strong>Cuando das de baja a un Trabajador,</strong> nos indicas que conservemos en tu Cuenta de Empresa los registros que creó hasta que los elimines o elimines la Cuenta de Empresa.</p>
          <p>4.5. <strong>Lectura de recibos y listas.</strong> Nos indicas que enviemos la foto de un recibo o de una lista de compras a nuestro subencargado de IA cuando uno de tus usuarios elige escanear y lo ha permitido en la app.</p>
          <p>4.6. <strong>Eliminación de tu empresa.</strong> Cuando el dueño elimina la Cuenta de Empresa, nos indicas que eliminemos todos los Datos Personales del Cliente como indica la sección 12.</p>
        </>
      ),
    },
    {
      id: "security",
      title: "5. Seguridad",
      content: (
        <>
          <p>Mantenemos medidas técnicas y organizativas adecuadas al riesgo, entre ellas:</p>
          <ul>
            <li>cifrado en tránsito (TLS) y en reposo; una base de datos sin conexión cifrada en los teléfonos (SQLCipher / sqlite3mc, claves en Keychain o Keystore);</li>
            <li>separación de los datos de cada empresa en la propia base de datos (Row Level Security) y acceso por roles dentro de cada empresa;</li>
            <li>nuestras propias copias de seguridad cifradas, guardadas por separado (copias de la base de datos hasta 7 meses, copias de archivos hasta 13 meses);</li>
            <li>acceso a los sistemas de producción limitado a quienes hacen funcionar el Servicio, con autenticación robusta;</li>
            <li>límites de solicitudes, validación de datos y registros de auditoría; y</li>
            <li>un procedimiento escrito ante incidentes y un registro de cada incidente de seguridad.</li>
          </ul>
          <p>Podemos mejorar estas medidas con el tiempo, pero no reduciremos el nivel general de protección.</p>
        </>
      ),
    },
    {
      id: "subprocessors",
      title: "6. Subencargados",
      content: (
        <>
          <p>6.1. Nos das una autorización general para usar los subencargados que figuran en nuestra página de <Link href="/es/subprocessors">Subencargados</Link>.</p>
          <p>6.2. Escribiremos al titular de la cuenta al menos 30 días antes de añadir o sustituir un subencargado que trate Datos Personales del Cliente, y actualizaremos la página; si hay que sustituir un subencargado con urgencia por seguridad o para que el Servicio siga funcionando, te avisaremos lo antes posible y podrás oponerte de la misma forma. En ese plazo puedes oponerte por escrito por motivos razonables de protección de datos. Entonces intentaremos encontrar una solución; si no podemos, puedes dar por terminado el Servicio afectado y te reembolsaremos las cuotas prepagadas de la suscripción del sitio web por el periodo posterior. Las compras hechas a través de Apple o Google se cancelan y reembolsan según sus políticas.</p>
          <p>6.3. Imponemos a cada subencargado cláusulas de protección de datos que protegen los Datos Personales del Cliente al menos tan bien como este Anexo, y seguimos siendo responsables ante ti de su cumplimiento.</p>
        </>
      ),
    },
    {
      id: "requests",
      title: "7. Solicitudes de las personas",
      content: (
        <p>Si una persona nos pide acceder, rectificar, eliminar o exportar Datos Personales del Cliente, o se opone a su uso, te pasamos la solicitud en un plazo de 5 días hábiles y le decimos a la persona que lo hemos hecho. No la respondemos nosotros salvo que nos lo pidas. El Servicio te permite ver, corregir, exportar y eliminar tus registros por tu cuenta; cuando no sea posible, te ayudamos si lo pides.</p>
      ),
    },
    {
      id: "breaches",
      title: "8. Brechas de seguridad",
      content: (
        <>
          <p>8.1. Si tenemos conocimiento de una violación de la seguridad que provoque la destrucción, pérdida o alteración accidental o ilícita de Datos Personales del Cliente, o su comunicación o acceso no autorizados, avisamos al titular de la cuenta por correo sin demora indebida y, en cualquier caso, en un máximo de 72 horas desde que tenemos conocimiento de ella.</p>
          <p>8.2. Te contamos, en la medida en que lo sepamos: qué pasó; las categorías y el número aproximado de personas y registros afectados; las consecuencias probables; lo que hemos hecho y haremos; y un contacto. Te enviamos novedades a medida que sabemos más.</p>
          <p>8.3. Te ayudamos a cumplir tus propias obligaciones de notificar a las autoridades y a las personas. Avisarte no supone admitir culpa.</p>
        </>
      ),
    },
    {
      id: "assistance",
      title: "9. Ayuda con tu cumplimiento",
      content: (
        <p>Te damos la información que razonablemente necesites, teniendo en cuenta la naturaleza del tratamiento y lo que sabemos, para evaluaciones de impacto en la protección de datos (por ejemplo antes de usar el reloj con GPS con trabajadores en la UE o el Reino Unido) y para consultas con una autoridad.</p>
      ),
    },
    {
      id: "audits",
      title: "10. Auditorías",
      content: (
        <p>Ponemos a tu disposición la información necesaria para demostrar que cumplimos este Anexo. Puedes enviarnos un cuestionario por escrito una vez al año y lo respondemos en 30 días. Si una autoridad lo exige, o después de una brecha que afecte a tus datos, puedes auditarnos con 30 días de aviso, en horario laboral, a tu costa, con un auditor obligado a confidencialidad y sin acceso a datos de otros clientes.</p>
      ),
    },
    {
      id: "transfers",
      title: "11. Transferencias internacionales",
      content: (
        <>
          <p>11.1. Los Datos Personales del Cliente se guardan en Fráncfort, Alemania. Stroyka está en Estados Unidos y algunos subencargados están en Estados Unidos o en otros países, por lo que los datos también se consultan y se tratan fuera del EEE, el Reino Unido y Suiza.</p>
          <p>11.2. <strong>UE y EEE.</strong> Cuando el RGPD se aplica a una transferencia de Datos Personales del Cliente hacia nosotros, las {SCC} de la Comisión Europea (Decisión (UE) 2021/914) se incorporan a este Anexo por referencia: el Módulo Dos (de responsable a encargado) cuando tú eres responsable, y el Módulo Tres (de encargado a encargado) cuando tú eres encargado. Tú eres el exportador de datos y nosotros el importador. Para las Cláusulas: se aplica la cláusula 7 (cláusula de incorporación); en la cláusula 9 se aplica la Opción 2 (autorización general) con el plazo de aviso del punto 6.2; la redacción opcional de la cláusula 11 no se aplica; en la cláusula 13, la autoridad de control es la que determina la cláusula 13(a): si no tienes establecimiento en la UE pero has designado un representante según el artículo 27(1) del RGPD, la del Estado miembro donde esté tu representante y, si no, la de uno de los Estados miembros donde se encuentren las personas cuyos datos se transfieren; las cláusulas 17 y 18 eligen la ley y los tribunales de Irlanda. El Anexo I es la sección 2 de este Anexo y los datos de las partes de las secciones 1 y 15; el Anexo II es la sección 5; el Anexo III es nuestra página de Subencargados.</p>
          <p>11.3. <strong>Reino Unido.</strong> Para las transferencias sujetas a la ley de protección de datos del Reino Unido, se incorpora por referencia el {UK_ADDENDUM} a las Cláusulas Contractuales Tipo de la UE (versión B1.0) del Information Commissioner del Reino Unido. Sus Tablas 1 a 3 se completan con la información del punto 11.2 y de este Anexo, y cualquiera de las partes puede terminarlo como permite su sección 19.</p>
          <p>11.4. <strong>Suiza.</strong> Las Cláusulas del punto 11.2 se aplican con los cambios que exige la Ley Federal suiza de Protección de Datos: la autoridad competente es el Comisionado Federal de Protección de Datos e Información, y las personas en Suiza pueden reclamar allí.</p>
          <p>11.5. Cuando un subencargado está certificado en el Marco de Privacidad de Datos UE&ndash;EE. UU. (o en su extensión al Reino Unido o en el marco Suiza&ndash;EE. UU.), podemos basarnos en esa certificación para las transferencias posteriores a él; en otro caso usamos con él las Cláusulas Contractuales Tipo.</p>
          <p>11.6. Para otros países, este Anexo es el contrato que exige proteger los datos dondequiera que se traten.</p>
        </>
      ),
    },
    {
      id: "end",
      title: "12. Devolución y eliminación",
      content: (
        <p>Puedes exportar tus datos en cualquier momento (Términos, punto 4.3) y durante los 30 días siguientes a la terminación (Términos, punto 17.4). Cuando se elimina la Cuenta de Empresa, eliminamos los Datos Personales del Cliente del Servicio en funcionamiento en un plazo de 31 días. Después salen de nuestras copias de seguridad cifradas a medida que caducan (copias de la base de datos en 7 meses, copias de archivos en 13 meses) y, mientras tanto, se mantienen aislados y no se usan. Te confirmamos la eliminación por escrito si lo pides. Solo conservamos datos más tiempo cuando la ley lo exige.</p>
      ),
    },
    {
      id: "us-laws",
      title: "13. Leyes estatales de privacidad de EE. UU.",
      content: (
        <p>Cuando se aplica la Ley de Privacidad del Consumidor de California (CCPA) u otra ley estatal de privacidad de EE. UU., actuamos como tu proveedor de servicios o encargado. No venderemos ni compartiremos los Datos Personales del Cliente; no los conservaremos, usaremos ni revelaremos para otro fin que prestarte el Servicio, ni fuera de nuestra relación comercial directa contigo; no los combinaremos con información personal que obtengamos de otros salvo en lo que esas leyes permitan; cumpliremos esas leyes y daremos el nivel de protección que exigen; y te avisaremos si ya no podemos cumplirlas. Puedes tomar medidas razonables para detener y corregir cualquier uso no autorizado.</p>
      ),
    },
    {
      id: "other-laws",
      title: "14. Otros países",
      content: (
        <p>Este Anexo es también el contrato por escrito entre responsable y encargado que exigen otras leyes &mdash; por ejemplo la LFPDPPP de México (<em>encargado</em>), la Ley de Privacidad de Datos de Filipinas (procesador de información personal), la PIPEDA de Canadá y la ley de Quebec del sector privado (mandato por escrito), la Ley DPDP de la India y la Ley 18.331 de Uruguay. Si tu ley local te exige avisar a una autoridad, obtener el consentimiento por escrito de tus trabajadores para usar un servicio externo o hacer una evaluación antes de enviar datos al extranjero, eso te corresponde a ti; te daremos la información sobre nosotros que necesites.</p>
      ),
    },
    {
      id: "general",
      title: "15. Disposiciones generales",
      content: (
        <>
          <p>15.1. Este Anexo dura mientras tratemos Datos Personales del Cliente por tu cuenta.</p>
          <p>15.2. La responsabilidad de cada parte según este Anexo está sujeta a los límites de los Términos (sección 13), salvo cuando las Cláusulas Contractuales Tipo o la ley no lo permitan.</p>
          <p>15.3. Podemos actualizar este Anexo como describen los Términos (sección 15), y no reduciremos la protección que da a los Datos Personales del Cliente sin avisar con al menos 30 días de antelación.</p>
          <p>15.4. Contacto: {SUPPORT}, con &ldquo;DPA&rdquo; en el asunto. {REPS}</p>
        </>
      ),
    },
  ],
};
