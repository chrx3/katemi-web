'use client';

import StatCounter from '../shared/StatCounter';

const stats = [
  { value: '150', label: 'Proyectos Entregados', suffix: '+' },
  { value: '12', label: 'Años de Experiencia', suffix: '' },
  { value: '8', label: 'Clientes Activos', suffix: '+' },
  { value: '50', label: 'Especialistas', suffix: '+' },
];

export default function StatsBar() {
  return (
    <section className="py-16 bg-[#F5F5F5]">
      <div className="container-max">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <StatCounter
              key={stat.label}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={i * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
}