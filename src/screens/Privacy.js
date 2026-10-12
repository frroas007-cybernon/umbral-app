import React from 'react';

function Privacy({ onNavigate }) {
  return (
    <div className="screen">
      <div className="screen-content" style={{ paddingBottom: 40 }}>

        <div className="back-btn" onClick={() => onNavigate && onNavigate('home')}>
          ← Volver
        </div>

        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, color: '#3D3530', marginBottom: 6 }}>
          Política de Privacidad
        </div>
        <div style={{ fontSize: 11, color: '#8A7A6E', marginBottom: 28 }}>
          Última actualización: octubre de 2026
        </div>

        {[
          {
            title: '1. Quiénes somos',
            text: 'Umbral es una aplicación gratuita de meditación y bienestar desarrollada por Francisco Roa San Martín, con domicilio en Viña del Mar, Chile. Si tienes preguntas sobre esta política, puedes contactarnos en umbralapp.contact@gmail.com.'
          },
          {
            title: '2. Información que recopilamos',
            text: 'Al crear una cuenta recopilamos: nombre, correo electrónico, género (opcional) y fecha de nacimiento (opcional). Si inicias sesión con Google, obtenemos tu nombre y correo desde tu cuenta de Google. También registramos tu actividad dentro de la app: sesiones completadas, racha diaria y valoraciones.'
          },
          {
            title: '3. Cómo usamos tu información',
            text: 'Usamos tu información para: personalizar tu experiencia dentro de la app (saludo con tu nombre, historial de práctica), gestionar tu cuenta y sesión de usuario, mejorar el contenido y las funcionalidades de Umbral, y contactarte en caso de cambios importantes en el servicio.'
          },
          {
            title: '4. Compartir información con terceros',
            text: 'No vendemos ni compartimos tu información personal con terceros con fines comerciales. Utilizamos los siguientes servicios de terceros para operar la app: Supabase (base de datos y autenticación), Google OAuth (inicio de sesión opcional), y Vercel (hosting). Estos servicios tienen sus propias políticas de privacidad.'
          },
          {
            title: '5. Seguridad de los datos',
            text: 'Tus datos se almacenan en Supabase, que utiliza cifrado en tránsito (HTTPS/TLS) y en reposo. Las contraseñas nunca se almacenan en texto plano — se cifran con bcrypt antes de guardarse. No tenemos acceso a tu contraseña.'
          },
          {
            title: '6. Retención de datos',
            text: 'Conservamos tu información mientras mantengas una cuenta activa en Umbral. Puedes solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento escribiendo a umbralapp.contact@gmail.com.'
          },
          {
            title: '7. Tus derechos',
            text: 'Tienes derecho a acceder a tu información personal, corregirla, solicitar su eliminación y oponerte a su procesamiento. Para ejercer cualquiera de estos derechos, contáctanos en umbralapp.contact@gmail.com.'
          },
          {
            title: '8. Usuarios menores de edad',
            text: 'Umbral no está dirigida a menores de 13 años. Si eres menor de 13 años, no uses la app ni crees una cuenta. Si tomamos conocimiento de que hemos recopilado datos de un menor de 13 años sin consentimiento, eliminaremos esa información.'
          },
          {
            title: '9. Cambios a esta política',
            text: 'Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios significativos mediante un aviso en la app o por correo electrónico. El uso continuado de Umbral después de los cambios implica tu aceptación de la nueva política.'
          },
          {
            title: '10. Contacto',
            text: 'Para cualquier consulta sobre esta política de privacidad, escríbenos a: umbralapp.contact@gmail.com'
          }
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 16,
              color: '#3D3530',
              fontWeight: 600,
              marginBottom: 8
            }}>
              {section.title}
            </div>
            <div style={{
              fontSize: 13,
              color: '#5A4A42',
              lineHeight: 1.7
            }}>
              {section.text}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Privacy;
