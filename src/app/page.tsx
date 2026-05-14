import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#0B1D3A] text-white py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ingeniería que{' '}
              <span className="text-[#00A896]">construye futuro</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              PRO&CON es una empresa de ingeniería líder en Chile, especializada en 
              proyectos industriales, construcción y desarrollo de infraestructura.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#00A896] hover:bg-[#008f7f] text-white">
                Nuestros Servicios
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#0B1D3A]">
                Ver Proyectos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#0B1D3A]">50+</p>
              <p className="text-sm text-gray-600 mt-1">Proyectos completados</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#0B1D3A]">15</p>
              <p className="text-sm text-gray-600 mt-1">Años de experiencia</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#0B1D3A]">100%</p>
              <p className="text-sm text-gray-600 mt-1">Clientes satisfechos</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-[#0B1D3A]">Chile</p>
              <p className="text-sm text-gray-600 mt-1">Cobertura nacional</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0B1D3A] mb-12">
            Nuestros Servicios
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-t-4 border-t-[#00A896]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-[#0B1D3A] mb-3">Ingeniería</h3>
                <p className="text-gray-600 text-sm">
                  Diseño y desarrollo de proyectos de ingeniería para entornos industriales.
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-[#00A896]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-[#0B1D3A] mb-3">Construcción</h3>
                <p className="text-gray-600 text-sm">
                  Ejecución de obras civiles e industriales con los más altos estándares.
                </p>
              </CardContent>
            </Card>
            <Card className="border-t-4 border-t-[#00A896]">
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-[#0B1D3A] mb-3">Consultoría</h3>
                <p className="text-gray-600 text-sm">
                  Asesoría técnica especializada para tus proyectos de inversión.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
