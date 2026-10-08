// Texto de la Política de Privacidad. Cubre lo que la Ley Orgánica de Protección de Datos Personales
// (LOPDP) obliga a informar antes de pedir los datos (art. 12): quién es el responsable y cómo
// contactarlo, qué datos se tratan, para qué, con qué base legal, quién los ve, dónde se guardan,
// cuánto tiempo, qué derechos hay y cómo ejercerlos, y cómo retirar el consentimiento.
//
// Describe lo que el sistema hace DE VERDAD: si cambia quién ve qué, dónde se guardan los datos o
// para qué se usan, hay que cambiar este texto y subir la versión en `config/politica.ts` y en el
// backend. Los datos de contacto no se escriben aquí: salen de Sanity → Contacto.

export interface ContactoResponsable {
  direccion: string;
  telefono: string;
  correo: string;
}

export interface SeccionPolitica {
  titulo: string;
  parrafos: string[];
  lista?: string[];
  /** Párrafos que van después de la lista. */
  cierre?: string[];
}

export function seccionesPolitica(contacto: ContactoResponsable): SeccionPolitica[] {
  const canales = [
    contacto.direccion && `en ${contacto.direccion}`,
    contacto.telefono && `al teléfono ${contacto.telefono}`,
    contacto.correo && `al correo ${contacto.correo}`,
  ].filter(Boolean) as string[];
  const comoContactar = canales.length
    ? `Puedes contactarla ${canales.join(", ")}.`
    : "Puedes contactarla por los canales de atención publicados en la página de la fundación.";

  return [
    {
      titulo: "1. Quién es responsable de tus datos",
      parrafos: [
        `La Fundación ASPY Ecuador (en adelante, "ASPY") es la responsable del tratamiento de los datos personales que se recogen en este sistema. ${comoContactar}`,
        "ASPY trata tus datos conforme a la Constitución del Ecuador, la Ley Orgánica de Protección de Datos Personales (LOPDP) y su reglamento. Cuando ASPY designe a su delegado de protección de datos personales, sus datos de contacto se publicarán en esta política.",
      ],
    },
    {
      titulo: "2. Qué datos tratamos",
      parrafos: ["Tus datos constan en la base de datos del sistema de gestión de ASPY. Son estos:"],
      lista: [
        "Identificación y contacto: nombres, apellidos, número de identificación, fecha de nacimiento, género, estado civil, ocupación, nivel de educación, dirección, teléfono y correo electrónico.",
        "Cuenta: tu correo y tu contraseña (la contraseña se guarda protegida; nadie puede leerla).",
        "Atención: servicios, citas, horarios y registro de asistencia.",
        "Pagos: comprobantes de transferencia que subes, montos y recibos.",
        "Salud: los reportes de sesión que elabora el profesional que te atiende.",
        "Datos técnicos: fecha, dirección IP y navegador con que aceptas esta política, y el registro de quién sube o abre cada comprobante y cada reporte.",
      ],
      cierre: [
        "Los datos los entregas tú o tu representante legal. Los reportes y la asistencia los registran los profesionales de ASPY. Si ASPY creó tu cuenta, lo hizo con los datos que entregaste a la fundación; por eso ves esta política en tu primer ingreso.",
      ],
    },
    {
      titulo: "3. Datos sensibles y datos de niñas, niños y adolescentes",
      parrafos: [
        "Los reportes de sesión contienen datos de salud y pueden referirse a una discapacidad. La ley los considera categorías especiales de datos (arts. 25 y 26) y ASPY solo puede tratarlos con tu consentimiento explícito, que se te pide por separado al final de este documento.",
        "Si la persona atendida tiene menos de 15 años, el consentimiento lo da su madre, su padre o su representante legal. Desde los 15 años puede darlo por sí misma (art. 21).",
      ],
    },
    {
      titulo: "4. Para qué usamos tus datos",
      parrafos: ["Únicamente para estas finalidades:"],
      lista: [
        "Crear y administrar tu cuenta.",
        "Agendar, confirmar y cancelar citas, y registrar la asistencia.",
        "Verificar los pagos por transferencia y emitir los recibos.",
        "Que el profesional registre el reporte de cada sesión y dé seguimiento a la atención.",
        "Comunicarnos contigo sobre tus citas, tus pagos y tu atención.",
        "Cumplir las obligaciones legales de la fundación.",
        "Elaborar estadísticas internas (número de citas, ingresos) que no identifican a ninguna persona.",
      ],
      cierre: [
        "ASPY no vende tus datos, no los usa para publicidad y no toma decisiones automatizadas ni elabora perfiles con ellos.",
      ],
    },
    {
      titulo: "5. Con qué base legal",
      parrafos: [
        "Tu consentimiento (arts. 7 y 8 de la LOPDP) y, para los datos de salud y de discapacidad, tu consentimiento explícito (art. 26). También la prestación del servicio que solicitas y el cumplimiento de las obligaciones legales de la fundación.",
      ],
    },
    {
      titulo: "6. Quién puede ver tus datos",
      parrafos: ["Dentro del sistema, cada persona ve solo lo que necesita para su función:"],
      lista: [
        "Tú: tus propios datos, citas, pagos, recibos y reportes.",
        "El profesional que te atiende: tus datos de identificación y contacto, tus citas con él o ella (con su pago) y los reportes de esas citas.",
        "Secretaría: los datos de las cuentas, las citas, los pagos y los comprobantes. No ve los reportes de sesión.",
        "Administración: toda la información, para supervisar el servicio.",
      ],
      cierre: [
        "Todo el personal de ASPY está obligado a guardar confidencialidad, incluso después de terminar su relación con la fundación (art. 30). ASPY no comparte tus datos con terceros, salvo que tú lo autorices o lo ordene una autoridad competente.",
      ],
    },
    {
      titulo: "7. Dónde se guardan tus datos",
      parrafos: [
        "El sistema funciona en servicios de computación en la nube que ASPY contrata como encargados del tratamiento: Railway (aplicación y base de datos) y Vercel (página web). Sus servidores están fuera del Ecuador, de modo que tus datos se transfieren a otro país (arts. 55 a 60).",
        "Esos países pueden no tener un nivel de protección equivalente al ecuatoriano. Por eso se te pide autorizarlo expresamente al final de este documento. ASPY sigue siendo responsable de tus datos y de exigir a esos proveedores que los protejan.",
      ],
    },
    {
      titulo: "8. Cuánto tiempo los conservamos",
      parrafos: [
        "Mientras tengas una cuenta y recibas atención en ASPY. Después, solo durante el tiempo que exijan las normas de salud, tributarias y contables aplicables; cumplido ese plazo se eliminan o se vuelven anónimos.",
        "Si retiras tu consentimiento o pides la eliminación, se borran los datos que la ley no obligue a conservar.",
      ],
    },
    {
      titulo: "9. Qué pasa si no entregas tus datos o son incorrectos",
      parrafos: [
        "Entregar tus datos es voluntario. Sin ellos no es posible crear tu cuenta ni agendar citas en línea, aunque puedes pedir atención directamente en la fundación.",
        "Si los datos son incorrectos o están desactualizados, ASPY podría no poder contactarte, confirmar tus pagos o atenderte bien. Mantenlos al día en “Perfil”.",
      ],
    },
    {
      titulo: "10. Tus derechos y cómo ejercerlos",
      parrafos: ["Sobre tus datos personales tienes derecho a:"],
      lista: [
        "Acceso: saber qué datos tuyos tiene ASPY y obtener una copia.",
        "Rectificación y actualización: corregir los que estén mal o incompletos.",
        "Eliminación: pedir que se borren cuando ya no sean necesarios o retires tu consentimiento.",
        "Oposición y suspensión: pedir que dejen de usarse, o que se limite su uso, en los casos que prevé la ley.",
        "Portabilidad: recibirlos en un formato que puedas llevar a otra institución.",
        "No ser objeto de decisiones basadas solo en valoraciones automatizadas (ASPY no las hace).",
      ],
      cierre: [
        "Puedes ver y corregir tus datos tú mismo en “Perfil”. Para lo demás, pídelo a ASPY por los canales del punto 1: te responderá sin costo en un máximo de 15 días (arts. 13 a 17). Si la persona tiene menos de 15 años, sus derechos los ejerce su representante legal.",
        "Si consideras que no se atendió tu pedido, puedes reclamar ante ASPY y ante la Superintendencia de Protección de Datos Personales del Ecuador.",
      ],
    },
    {
      titulo: "11. Cómo retirar tu consentimiento",
      parrafos: [
        "Puedes retirarlo cuando quieras, sin dar explicaciones y sin costo. Si eres paciente o familiar, dentro del sistema: menú ⋮ → “Privacidad y mis datos” → “Retirar mi consentimiento”. También puedes pedirlo a ASPY por los canales del punto 1.",
        "Al retirarlo, tu cuenta se deshabilita y ASPY deja de tratar tus datos, salvo los que la ley obligue a conservar. El retiro no afecta lo que se hizo antes de retirarlo (art. 8).",
      ],
    },
    {
      titulo: "12. Cómo protegemos tus datos",
      parrafos: [
        "La conexión con el sistema va cifrada. Las contraseñas se guardan protegidas. Los comprobantes y los reportes se guardan cifrados, no tienen enlaces públicos y solo se abren con la sesión iniciada. Cada rol ve únicamente lo que le corresponde, las sesiones vencen y queda registro de quién abre cada comprobante y cada reporte.",
        "El sistema no usa cookies de publicidad ni de seguimiento: guarda en tu navegador solo lo necesario para mantener tu sesión y tus preferencias de pantalla.",
        "Si ocurriera una vulneración de seguridad que ponga en riesgo tus derechos, ASPY te lo comunicará y lo notificará a la autoridad en los plazos que fija la ley (arts. 43 y 46).",
      ],
    },
    {
      titulo: "13. Cambios en esta política",
      parrafos: [
        "Si ASPY cambia esta política en algo importante, el sistema te la mostrará de nuevo y te pedirá aceptarla otra vez. La versión vigente está siempre disponible en el menú ⋮ → “Privacidad y mis datos”.",
      ],
    },
  ];
}
