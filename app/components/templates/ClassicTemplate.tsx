'use client';

import type { InvitationConfig } from '@/app/types/invitation';

interface ClassicTemplateProps {
  config: InvitationConfig;
}

/**
 * Template Clássico
 * Layout centralizado, fontes serifadas, elegante com ornamentos dourados
 */
export function ClassicTemplate({ config }: ClassicTemplateProps) {
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
      {/* Container principal com fundo gradiente suave */}
      <div className="min-h-screen bg-gradient-to-b from-[#fdf8f3] to-[#f7e7ce] py-16 px-4">
        {/* Card do convite */}
        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden">
          {/* Borda decorativa superior */}
          <div className="h-2 bg-[var(--primary)]" />

          {/* Conteúdo centralizado */}
          <div className={`text-center py-16 px-8 md:px-16 ${fontFamilyClass}`}>
            {/* Ornamento superior */}
            <div className="text-[var(--primary)] text-4xl mb-8 opacity-60">
              ❧
            </div>

            {/* Texto introdutório */}
            <p className="text-[var(--secondary)] text-sm tracking-[0.3em] uppercase mb-8">
              Temos a honra de convidar você para celebrar o casamento de
            </p>

            {/* Nomes dos noivos */}
            <h1 className="text-4xl md:text-6xl text-[var(--primary)] mb-2 leading-tight">
              {content.partner1Name}
            </h1>
            <p className="text-[var(--primary)] text-3xl md:text-4xl italic my-4">&</p>
            <h1 className="text-4xl md:text-6xl text-[var(--primary)] mb-8 leading-tight">
              {content.partner2Name}
            </h1>

            {/* Linha decorativa */}
            <div className="flex items-center justify-center gap-4 my-10">
              <div className="h-px w-16 bg-[var(--primary)] opacity-40" />
              <span className="text-[var(--primary)] text-xl">✦</span>
              <div className="h-px w-16 bg-[var(--primary)] opacity-40" />
            </div>

            {/* Data e local */}
            <div className="space-y-4 mb-12">
              <p className="text-[var(--secondary)] text-xl md:text-2xl">
                {content.weddingDate}
              </p>
              <p className="text-[var(--secondary)] text-lg opacity-80">
                {content.venue}
              </p>
            </div>

            {/* Grid de fotos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              {content.photoUrls.map((url, index) => (
                <div
                  key={index}
                  className="aspect-[3/4] overflow-hidden rounded-sm shadow-lg"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={`Foto do casal ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Foto {index + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Ornamento inferior */}
            <div className="text-[var(--primary)] text-4xl mt-12 opacity-60 rotate-180">
              ❧
            </div>
          </div>

          {/* Borda decorativa inferior */}
          <div className="h-2 bg-[var(--primary)]" />
        </div>
      </div>
    </div>
  );
}
