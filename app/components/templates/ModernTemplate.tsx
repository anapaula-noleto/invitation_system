'use client';

import type { InvitationConfig } from '@/app/types/invitation';

interface ModernTemplateProps {
  config: InvitationConfig;
}

/**
 * Template Moderno
 * Layout assimétrico, fontes sans-serif, design ousado e contemporâneo
 */
export function ModernTemplate({ config }: ModernTemplateProps) {
  const { content, theme } = config;

  // Mapeia fontFamily para a classe CSS correspondente
  const fontFamilyClass = {
    playfair: 'font-serif',
    cormorant: 'font-serif',
    montserrat: 'font-sans',
    lora: 'font-serif',
    josefin: 'font-sans',
  }[theme.fontFamily];

  return (
    <div
      className="min-h-screen w-full"
      style={{
        '--primary': theme.primaryColor,
        '--secondary': theme.secondaryColor,
      } as React.CSSProperties}
    >
      {/* Layout assimétrico com grid */}
      <div className={`min-h-screen bg-[var(--primary)] ${fontFamilyClass}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Lado esquerdo - Fotos em grid dinâmico */}
          <div className="relative h-[50vh] lg:h-screen">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1">
              {/* Foto principal - ocupa 2 linhas */}
              <div className="row-span-2 overflow-hidden">
                {content.photoUrls[0] ? (
                  <img
                    src={content.photoUrls[0]}
                    alt="Foto principal do casal"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Foto 1</span>
                  </div>
                )}
              </div>
              {/* Foto 2 */}
              <div className="overflow-hidden">
                {content.photoUrls[1] ? (
                  <img
                    src={content.photoUrls[1]}
                    alt="Foto do casal 2"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Foto 2</span>
                  </div>
                )}
              </div>
              {/* Foto 3 */}
              <div className="overflow-hidden">
                {content.photoUrls[2] ? (
                  <img
                    src={content.photoUrls[2]}
                    alt="Foto do casal 3"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Foto 3</span>
                  </div>
                )}
              </div>
            </div>

            {/* Overlay com gradiente */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--primary)] opacity-30 lg:opacity-60 pointer-events-none" />
          </div>

          {/* Lado direito - Conteúdo textual */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-0">
            {/* Linha decorativa */}
            <div className="w-24 h-1 bg-[var(--secondary)] mb-12" />

            {/* Tag superior */}
            <p className="text-[var(--secondary)] text-xs tracking-[0.4em] uppercase mb-8">
              Save the Date
            </p>

            {/* Nomes em layout vertical */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-light leading-none tracking-tight">
                {content.partner1Name}
              </h1>
              <div className="flex items-center gap-4 my-4">
                <div className="h-px flex-1 bg-[var(--secondary)] opacity-30" />
                <span className="text-[var(--secondary)] text-2xl font-light">&</span>
                <div className="h-px flex-1 bg-[var(--secondary)] opacity-30" />
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-light leading-none tracking-tight">
                {content.partner2Name}
              </h1>
            </div>

            {/* Data - destaque tipográfico */}
            <div className="mb-8">
              <p className="text-[var(--secondary)] text-2xl md:text-3xl font-light">
                {content.weddingDate}
              </p>
            </div>

            {/* Local */}
            <div className="border-l-2 border-[var(--secondary)] pl-6">
              <p className="text-white opacity-70 text-lg">
                {content.venue}
              </p>
            </div>

            {/* Elemento gráfico - círculo decorativo */}
            <div className="mt-16 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-[var(--secondary)]" />
              <div className="w-2 h-2 rounded-full bg-[var(--secondary)] opacity-60" />
              <div className="w-1 h-1 rounded-full bg-[var(--secondary)] opacity-30" />
            </div>
          </div>
        </div>

        {/* Barra inferior com gradiente */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--secondary)] to-transparent opacity-50" />
      </div>
    </div>
  );
}
