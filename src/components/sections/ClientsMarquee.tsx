'use client';

import dynamic from 'next/dynamic';
import ScrollReveal from '../shared/ScrollReveal';
import ClientLogo from '../shared/ClientLogo';

const ReactFastMarquee = dynamic(() => import('react-fast-marquee'), { ssr: false });

const staticClients = [
  { name: 'CGE', logoUrl: '', website: '' },
  { name: 'Transelec', logoUrl: '', website: '' },
  { name: 'Enel', logoUrl: '', website: '' },
  { name: 'AES Chile', logoUrl: '', website: '' },
  { name: 'Colbún', logoUrl: '', website: '' },
  { name: 'Pacific Energy', logoUrl: '', website: '' },
  { name: 'Grupo Saesa', logoUrl: '', website: '' },
  { name: 'Engie', logoUrl: '', website: '' },
];

export default function ClientsMarquee() {
  return (
    <section className="py-14 bg-[#F5F5F5] overflow-hidden">
      <div className="container-max">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00A896]">
              Confianza y Trayectoria
            </span>
            <h2 className="mt-3 text-2xl md:text-3xl font-bold uppercase text-[#0B1D3A]">
              Nuestros Clientes
            </h2>
          </div>
        </ScrollReveal>
      </div>

      <ReactFastMarquee
        speed={40}
        pauseOnHover
        gradient={false}
        className="mt-6"
      >
        <div className="flex items-center gap-6 pr-6">
          {staticClients.map((client) => (
            <div key={client.name} className="flex-shrink-0 w-44">
              <ClientLogo
                name={client.name}
                logoUrl={client.logoUrl}
                website={client.website}
              />
            </div>
          ))}
        </div>
      </ReactFastMarquee>
    </section>
  );
}