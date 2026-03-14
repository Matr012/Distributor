import { useState } from 'react';

const faqData = [
  {
    question: 'Mi az az MMZ?',
    answer: 'Az MMZ egy szolgáltatás a zenészek számára, amely eljuttatja a zenéidet a boltok és a streaming szolgáltatások kínálatába. Majd amikor az emberek meghallgatják a zenéidet, mi pénzt küldünk neked.',
  },
  {
    question: 'Miért használjam az MMZ-t?',
    answer: 'Az MMZ nem kér el semmilyen pénzt a disztribúciós szolgáltatásaiért – ezzel is segítve, hogy a zenészek akadályok nélkül fókuszálhassanak az alkotásra és a fejlődésre.',
  },
  {
    question: 'Miért jobb az MMZ?',
    answer: 'Hiszünk abban, hogy a tehetség számít, nem a pénz. Ingyenes disztribúció, promóciós támogatás és fiatal, feltörekvő zenészek segítése a fő célunk.',
  },
  {
    question: 'Ki használja az MMZ-t?',
    answer: 'Magyar előadók, különösen fiatal, feltörekvő zenészek, akik hisznek a zenéjükben, de még nem rendelkeznek nagy háttérrel.',
  },
  {
    question: 'Mennyibe fog ez kerülni nekem?',
    answer: 'Semmibe. Az MMZ disztribúció teljesen ingyenes.',
  },
  {
    question: 'Mennyit tart meg az eladásaimból az MMZ?',
    answer: '0%-ot. Minden bevétel 100%-ban a tiéd.',
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggle = (idx) => {
    setActiveIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <div className="faq-section">
      <h1>Gyakran Ismételt Kérdések</h1>

      {faqData.map((item, idx) => (
        <div className={`faq-item${activeIndex === idx ? ' active' : ''}`} key={idx}>
          <div className="faq-question" onClick={() => toggle(idx)}>
            <span>{item.question}</span>
            <i className="faq-toggle">{activeIndex === idx ? '−' : '+'}</i>
          </div>
          <div className="faq-answer">
            <p>{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
