import React from 'react';

const frases = {
  ansioso: {
    emoji: '😔', label: 'ANSIEDAD',
    lista: [
      'Tu respiración es el ancla. Vuelve a ella.',
      'Este momento pasará. Siempre pasa.',
      'No tienes que resolver todo ahora mismo.',
      'La ansiedad es energía sin dirección. Respira y dale un rumbo.',
      'Estás a salvo en este instante.',
      'Un pensamiento no es una verdad.',
      'Inhala cuatro tiempos. Exhala seis. Repite.',
      'Tu cuerpo sabe cómo calmarse. Dale permiso.',
      'No luches contra la ola. Déjala pasar.',
      'Hoy solo necesitas el siguiente paso, no todos.',
      'La mente viaja al futuro. Tráela de vuelta al ahora.',
      'Sentir ansiedad no significa que algo está mal contigo.',
      'Suelta lo que no puedes controlar.',
      'Eres más grande que lo que sientes ahora.',
      'Este estado es temporal. Tú eres permanente.',
      'Respira como si fuera lo único que importa. Porque ahora lo es.',
      'No necesitas tener todo bajo control para estar bien.',
      'Date la misma compasión que le darías a alguien que amas.',
      'El presente siempre es más manejable que el futuro imaginado.',
      'Hay calma disponible para ti. Empieza aquí.'
    ]
  },
  tenso: {
    emoji: '😶', label: 'TENSIÓN',
    lista: [
      'El cuerpo guarda lo que la mente no procesa. Suéltalo.',
      'Relaja los hombros. Siempre están más tensos de lo que crees.',
      'No tienes que estar listo para todo todo el tiempo.',
      'Una pausa no es perder tiempo. Es ganar claridad.',
      'Desaprieta la mandíbula. Respira.',
      'La tensión avisa que algo importa. Escúchala, luego suéltala.',
      'No eres tu lista de pendientes.',
      'Puedes ser productivo y estar en paz al mismo tiempo.',
      'Tres respiraciones profundas cambian tu sistema nervioso.',
      'Permítete no estar en modo alerta por un momento.',
      'Tu valor no depende de cuánto produces hoy.',
      'El descanso es parte del trabajo, no su opuesto.',
      'Afloja. El mundo no se cae si bajas la guardia un instante.',
      'Estás haciendo más de lo que crees.',
      'Hoy hiciste suficiente.',
      'La tensión acumulada también se suelta con la exhalación.',
      'No todo requiere tu máximo esfuerzo ahora mismo.',
      'Date un momento antes de seguir.',
      'Respira como si tuvieras tiempo. Porque lo tienes.',
      'La calma es una habilidad. Estás entrenándola ahora.'
    ]
  },
  bien: {
    emoji: '🙂', label: 'BIENESTAR',
    lista: [
      'Este es un buen punto de partida.',
      'Sentirte bien también merece atención.',
      'Cultiva este estado. No lo des por sentado.',
      'Desde aquí puedes ir más profundo.',
      'El bienestar se construye en días como este.',
      'Estar bien es suficiente. No necesitas más razón para meditar.',
      'Aprovecha esta claridad para conectar contigo.',
      'Los días ordinarios son donde se forma el hábito.',
      'Bien es el suelo fértil donde crece la paz.',
      'Sigue aquí. Esto también es práctica.',
      'No esperes la tormenta para cuidarte. Hazlo hoy.',
      'Tu bienestar de mañana se construye en este momento.',
      'Un día tranquilo es un regalo. Recíbelo con atención.',
      'Desde la calma se ven las cosas con más claridad.',
      'Hoy es un buen día para ir un paso más adentro.',
      'El equilibrio no es ausencia de problemas. Es esto que sientes ahora.',
      'Nota cómo se siente estar bien. Eso también es meditación.',
      'Cada día que cuidas tu mente cuenta.',
      'Estás exactamente donde necesitas estar.',
      'Desde aquí, todo es posible.'
    ]
  },
  tranquilo: {
    emoji: '😌', label: 'TRANQUILIDAD',
    lista: [
      'La tranquilidad no es vacío. Es presencia plena.',
      'Quédate aquí un momento más antes de seguir.',
      'Este es tu estado natural. Recuérdalo.',
      'La quietud también habla. Escúchala.',
      'No necesitas hacer nada con esta calma. Solo habitarla.',
      'Estás en el lugar correcto.',
      'La tranquilidad es la base de toda sabiduría.',
      'Desde aquí puedes observar sin reaccionar.',
      'Esto que sientes hoy puede ser tu punto de regreso mañana.',
      'La calma no es debilidad. Es la forma más poderosa de estar.',
      'Respira y nota cuánto ya está bien.',
      'En la quietud se escucha lo esencial.',
      'No necesitas buscar más. Por un momento, esto es todo.',
      'La tranquilidad cultivada hoy es el recurso de mañana.',
      'Eres capaz de volver a este lugar cuando lo necesites.',
      'Nota el peso de tu cuerpo. El ritmo de tu respiración. Estás aquí.',
      'Cuida este estado como lo que es: algo valioso.',
      'La serenidad no llega. Se descubre. Ya la encontraste.',
      'Desde la calma, todo se hace más simple.',
      'Esto también es éxito.'
    ]
  },
  paz: {
    emoji: '🌿', label: 'PAZ',
    lista: [
      'La paz no es un destino. Es este momento exacto.',
      'Nada falta aquí.',
      'Estás completo ahora mismo.',
      'Este silencio interior es tu hogar.',
      'La paz que sientes es real y es tuya.',
      'Desde aquí todo puede comenzar.',
      'No hay nada que resolver en este instante.',
      'Eres el observador tranquilo de todo lo que pasa.',
      'Esta es la razón de la práctica.',
      'La paz profunda no depende de las circunstancias.',
      'Quédate aquí el tiempo que puedas.',
      'Lo que buscabas afuera siempre estuvo adentro.',
      'Nada puede quitarte este momento si eliges quedarte en él.',
      'Eres más que tus pensamientos. Esto lo prueba.',
      'La paz es la respuesta más inteligente a cualquier cosa.',
      'Desde este lugar puedes dar lo mejor de ti.',
      'Hay una versión de ti que siempre está en paz. La encontraste.',
      'Este estado es tu naturaleza más profunda.',
      'Respira. Todo está bien.',
      'Bienvenido a ti mismo.'
    ]
  }
};

function MoodModal({ mood, onClose }) {
  if (!mood) return null;

  const data = frases[mood];
  const frase = data.lista[Math.floor(Math.random() * data.lista.length)];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={e => e.stopPropagation()}>
        <div className="modal-handle" />
        <div className="modal-emoji">{data.emoji}</div>
        <div className="modal-estado">{data.label}</div>
        <div className="modal-frase">{frase}</div>
        <button className="btn-main" onClick={onClose}>
          Comenzar práctica
        </button>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20, opacity: 0.35 }}>
          <svg viewBox="0 0 300 175" xmlns="http://www.w3.org/2000/svg" style={{ width: 64, height: 'auto' }}>
            <ellipse cx="150" cy="120" rx="42" ry="7" fill="#7AACB5" opacity="0.30"/>
            <ellipse cx="150" cy="125" rx="28" ry="4" fill="#7AACB5" opacity="0.18"/>
            <path d="M 110 114 A 40 40 0 0 1 190 114 Z" fill="#C4977A"/>
            <line x1="84" y1="114" x2="216" y2="114" stroke="#3D3530" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="150" y1="66" x2="150" y2="82" stroke="#C4977A" strokeWidth="2" strokeLinecap="round"/>
            <line x1="129" y1="71" x2="135.5" y2="86" stroke="#C4977A" strokeWidth="1.7" strokeLinecap="round"/>
            <line x1="171" y1="71" x2="164.5" y2="86" stroke="#C4977A" strokeWidth="1.7" strokeLinecap="round"/>
            <line x1="111" y1="87" x2="120" y2="98" stroke="#C4977A" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="189" y1="87" x2="180" y2="98" stroke="#C4977A" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="92" y1="108" x2="106" y2="108" stroke="#C4977A" strokeWidth="1.2" strokeLinecap="round"/>
            <line x1="208" y1="108" x2="194" y2="108" stroke="#C4977A" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M 124 114 A 26 26 0 0 1 176 114 Z" fill="#7AACB5" opacity="0.22"/>
            <text x="150" y="158" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fill="#3D3530" letterSpacing="9">UMBRAL</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default MoodModal;