import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Wheat,
  Layers,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Scale,
  Sparkles
} from 'lucide-react';

export default function GraficosDesempenho() {
  const [activeTab, setActiveTab] = useState('peso');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [selectedRaca, setSelectedRaca] = useState('todas');
  const [selectedSafraPeriodo, setSelectedSafraPeriodo] = useState('2024/2025');

  const dadosPeso = {
    todas: [
      { mes: 'Mar', peso: 335, meta: 320, gmd: '1.10 kg/d' },
      { mes: 'Abr', peso: 368, meta: 355, gmd: '1.12 kg/d' },
      { mes: 'Mai', peso: 402, meta: 390, gmd: '1.14 kg/d' },
      { mes: 'Jun', peso: 436, meta: 425, gmd: '1.15 kg/d' },
      { mes: 'Jul', peso: 468, meta: 455, gmd: '1.18 kg/d' },
      { mes: 'Ago', peso: 498, meta: 485, gmd: '1.16 kg/d' },
      { mes: 'Set', peso: 524, meta: 510, gmd: '1.19 kg/d' },
      { mes: 'Out', peso: 546, meta: 535, gmd: '1.21 kg/d' }
    ],
    nelore: [
      { mes: 'Mar', peso: 330, meta: 320, gmd: '1.08 kg/d' },
      { mes: 'Abr', peso: 362, meta: 355, gmd: '1.10 kg/d' },
      { mes: 'Mai', peso: 395, meta: 390, gmd: '1.12 kg/d' },
      { mes: 'Jun', peso: 428, meta: 425, gmd: '1.14 kg/d' },
      { mes: 'Jul', peso: 460, meta: 455, gmd: '1.16 kg/d' },
      { mes: 'Ago', peso: 490, meta: 485, gmd: '1.15 kg/d' },
      { mes: 'Set', peso: 518, meta: 510, gmd: '1.18 kg/d' },
      { mes: 'Out', peso: 540, meta: 535, gmd: '1.20 kg/d' }
    ],
    angus: [
      { mes: 'Mar', peso: 345, meta: 330, gmd: '1.15 kg/d' },
      { mes: 'Abr', peso: 380, meta: 365, gmd: '1.18 kg/d' },
      { mes: 'Mai', peso: 416, meta: 400, gmd: '1.20 kg/d' },
      { mes: 'Jun', peso: 452, meta: 435, gmd: '1.22 kg/d' },
      { mes: 'Jul', peso: 485, meta: 470, gmd: '1.24 kg/d' },
      { mes: 'Ago', peso: 518, meta: 500, gmd: '1.23 kg/d' },
      { mes: 'Set', peso: 544, meta: 525, gmd: '1.25 kg/d' },
      { mes: 'Out', peso: 565, meta: 550, gmd: '1.26 kg/d' }
    ],
    senepol: [
      { mes: 'Mar', peso: 338, meta: 325, gmd: '1.12 kg/d' },
      { mes: 'Abr', peso: 372, meta: 360, gmd: '1.14 kg/d' },
      { mes: 'Mai', peso: 406, meta: 395, gmd: '1.16 kg/d' },
      { mes: 'Jun', peso: 440, meta: 430, gmd: '1.17 kg/d' },
      { mes: 'Jul', peso: 472, meta: 460, gmd: '1.19 kg/d' },
      { mes: 'Ago', peso: 502, meta: 490, gmd: '1.18 kg/d' },
      { mes: 'Set', peso: 530, meta: 515, gmd: '1.21 kg/d' },
      { mes: 'Out', peso: 552, meta: 540, gmd: '1.22 kg/d' }
    ]
  };

  const dadosFluxo = [
    { mes: 'Mai', entradas: 112000, saidas: 46000, saldo: 66000 },
    { mes: 'Jun', entradas: 98000, saidas: 54000, saldo: 44000 },
    { mes: 'Jul', entradas: 145000, saidas: 68000, saldo: 77000 },
    { mes: 'Ago', entradas: 128000, saidas: 51000, saldo: 77000 },
    { mes: 'Set', entradas: 182000, saidas: 74000, saldo: 108000 },
    { mes: 'Out', entradas: 142800, saidas: 33500, saldo: 109300 }
  ];

  const dadosSafra = [
    {
      cultura: 'Soja',
      variedade: 'TMG 2375 / Brasmax',
      real: 72,
      meta: 65,
      area: '390 ha',
      unidade: 'sc/ha',
      rendimento: '+10.7%'
    },
    {
      cultura: 'Milho Safrinha',
      variedade: 'Pioneer P3707',
      real: 138,
      meta: 125,
      area: '180 ha',
      unidade: 'sc/ha',
      rendimento: '+10.4%'
    },
    {
      cultura: 'Sorgo Granífero',
      variedade: 'DKB 599',
      real: 85,
      meta: 78,
      area: '80 ha',
      unidade: 'sc/ha',
      rendimento: '+8.9%'
    },
    {
      cultura: 'Pastagem Rotacionada',
      variedade: 'Brachiaria Brizantha',
      real: 94,
      meta: 88,
      area: '200 ha',
      unidade: '% lotação',
      rendimento: '+6.8%'
    }
  ];

  const seriePesoAtual = dadosPeso[selectedRaca] || dadosPeso.todas;

  const minPeso = 300;
  const maxPeso = 600;
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const getCoordinates = (index, value) => {
    const x = paddingX + (index / (seriePesoAtual.length - 1)) * usableWidth;
    const y = svgHeight - paddingY - ((value - minPeso) / (maxPeso - minPeso)) * usableHeight;
    return { x, y };
  };

  const pathRealPoints = seriePesoAtual.map((p, i) => getCoordinates(i, p.peso));
  const pathMetaPoints = seriePesoAtual.map((p, i) => getCoordinates(i, p.meta));

  const buildPathD = (points) => {
    if (points.length === 0) return '';
    return points.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, '');
  };

  const dReal = buildPathD(pathRealPoints);
  const dMeta = buildPathD(pathMetaPoints);
  const dArea = `${dReal} L ${pathRealPoints[pathRealPoints.length - 1].x} ${svgHeight - paddingY} L ${pathRealPoints[0].x} ${svgHeight - paddingY} Z`;

  const maxFluxoValor = Math.max(...dadosFluxo.flatMap((d) => [d.entradas, d.saidas]));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#237a32] animate-pulse" />
            <span className="text-xs font-bold text-[#237a32] uppercase tracking-wider">
              Painel Gráfico de Performance
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
            Estatísticas & Produtividade Agropecuária
          </h3>
          <p className="text-xs text-slate-500">
            Acompanhamento dinâmico de curvas zootécnicas, conciliação mensal e rendimento agrícola.
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTab('peso');
              setHoveredPoint(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'peso'
                ? 'bg-white text-[#185824] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Evolução de Peso</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('fluxo');
              setHoveredPoint(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'fluxo'
                ? 'bg-white text-[#185824] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Fluxo de Caixa</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('safra');
              setHoveredPoint(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'safra'
                ? 'bg-white text-[#185824] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wheat className="w-3.5 h-3.5" />
            <span>Produtividade Safra</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {activeTab === 'peso' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Filtrar por Raça:</span>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
                  {['todas', 'nelore', 'angus', 'senepol'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRaca(r)}
                      className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                        selectedRaca === r
                          ? 'bg-[#237a32] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r === 'todas' ? 'Todo o Rebanho' : r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#237a32] rounded-full inline-block" />
                  <span>Realizado (kg)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-amber-400 border-t border-dashed border-amber-600 rounded-full inline-block" />
                  <span>Meta Projetada</span>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-b from-emerald-50/20 to-transparent rounded-xl border border-slate-100 p-2 sm:p-4">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-56 sm:h-64 overflow-visible"
              >
                <defs>
                  <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#237a32" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#237a32" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {[300, 375, 450, 525, 600].map((v) => {
                  const y = svgHeight - paddingY - ((v - minPeso) / (maxPeso - minPeso)) * usableHeight;
                  return (
                    <g key={v}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[10px] fill-slate-400 font-medium"
                      >
                        {v} kg
                      </text>
                    </g>
                  );
                })}

                <path d={dArea} fill="url(#realGradient)" />

                <path
                  d={dMeta}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />

                <path
                  d={dReal}
                  fill="none"
                  stroke="#237a32"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {seriePesoAtual.map((item, idx) => {
                  const pt = pathRealPoints[idx];
                  const isHovered = hoveredPoint === idx;

                  return (
                    <g key={item.mes} className="cursor-pointer">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill="#ffffff"
                        stroke="#237a32"
                        strokeWidth={isHovered ? 3 : 2.5}
                        className="transition-all duration-150"
                      />
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="18"
                        fill="transparent"
                        onMouseEnter={() => setHoveredPoint(idx)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      <text
                        x={pt.x}
                        y={svgHeight - 10}
                        textAnchor="middle"
                        className={`text-[11px] font-semibold transition-colors ${
                          isHovered ? 'fill-[#185824]' : 'fill-slate-500'
                        }`}
                      >
                        {item.mes}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {hoveredPoint !== null && (
                <div
                  className="absolute z-20 pointer-events-none bg-slate-900/95 text-white px-3 py-2 rounded-xl shadow-xl text-xs backdrop-blur-xs border border-slate-700 transition-all duration-150"
                  style={{
                    left: `${(pathRealPoints[hoveredPoint].x / svgWidth) * 100}%`,
                    top: `${(pathRealPoints[hoveredPoint].y / svgHeight) * 100 - 35}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  <div className="font-bold text-emerald-400 border-b border-slate-700 pb-1 mb-1">
                    Mês de {seriePesoAtual[hoveredPoint].mes} / 2025
                  </div>
                  <div className="space-y-0.5 text-slate-200">
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Peso Real:</span>
                      <span className="font-semibold text-white">
                        {seriePesoAtual[hoveredPoint].peso} kg
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-slate-400">Meta:</span>
                      <span className="font-semibold text-amber-300">
                        {seriePesoAtual[hoveredPoint].meta} kg
                      </span>
                    </div>
                    <div className="flex justify-between gap-3 pt-0.5">
                      <span className="text-slate-400">GMD Médio:</span>
                      <span className="font-bold text-emerald-400">
                        {seriePesoAtual[hoveredPoint].gmd}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                <span className="text-xs font-semibold text-emerald-800">Ganho Médio Diário</span>
                <div className="text-xl font-extrabold text-[#185824] mt-0.5">1,18 kg / dia</div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+8.4% acima da média regional</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-semibold text-slate-600">Peso Médio Atual</span>
                <div className="text-xl font-extrabold text-slate-900 mt-0.5">546 kg</div>
                <div className="text-[11px] text-slate-500 mt-1">Lote em ponto de terminação</div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs font-semibold text-slate-600">Eficiência de Conversão</span>
                <div className="text-xl font-extrabold text-[#237a32] mt-0.5">6,1 : 1</div>
                <div className="text-[11px] text-slate-500 mt-1">kg MS consumida / kg ganho</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fluxo' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Visão comparativa de Receitas vs Despesas Operacionais (últimos 6 meses)
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#237a32] rounded-xs inline-block" />
                  <span>Entradas (Receitas)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-rose-500 rounded-xs inline-block" />
                  <span>Saídas (Custos)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" />
                  <span>Saldo Líquido</span>
                </div>
              </div>
            </div>

            <div className="relative bg-slate-50/50 rounded-xl border border-slate-200/80 p-4">
              <div className="h-60 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 px-2">
                {dadosFluxo.map((item, idx) => {
                  const alturaEntrada = (item.entradas / maxFluxoValor) * 100;
                  const alturaSaida = (item.saidas / maxFluxoValor) * 100;
                  const isHovered = hoveredPoint === idx;

                  return (
                    <div
                      key={item.mes}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-44 relative">
                        <div
                          className="w-1/2 max-w-[28px] bg-[#237a32] hover:bg-[#185824] rounded-t-md transition-all duration-200 shadow-xs relative"
                          style={{ height: `${alturaEntrada}%` }}
                        />
                        <div
                          className="w-1/2 max-w-[28px] bg-rose-500 hover:bg-rose-600 rounded-t-md transition-all duration-200 shadow-xs relative"
                          style={{ height: `${alturaSaida}%` }}
                        />

                        {isHovered && (
                          <div className="absolute -top-12 z-30 pointer-events-none bg-slate-900 text-white text-[11px] font-medium px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap">
                            Saldo: +R$ {item.saldo.toLocaleString('pt-BR')}
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-xs mt-2 font-semibold transition-colors ${
                          isHovered ? 'text-[#185824]' : 'text-slate-600'
                        }`}
                      >
                        {item.mes}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <span className="text-xs font-semibold text-emerald-800">Total Faturado no Semestre</span>
                <div className="text-xl font-extrabold text-[#185824] mt-0.5">R$ 807.800</div>
                <div className="text-[11px] text-emerald-700 mt-1 font-medium">Comercialização de gado e grãos</div>
              </div>

              <div className="p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl">
                <span className="text-xs font-semibold text-rose-800">Custos Operacionais</span>
                <div className="text-xl font-extrabold text-rose-700 mt-0.5">R$ 326.500</div>
                <div className="text-[11px] text-rose-700 mt-1 font-medium">Insumos, combustível e folha</div>
              </div>

              <div className="p-3.5 bg-[#237a32]/10 border border-[#237a32]/20 rounded-xl">
                <span className="text-xs font-semibold text-[#185824]">Margem Operacional Líquida</span>
                <div className="text-xl font-extrabold text-[#185824] mt-0.5">+59,6%</div>
                <div className="text-[11px] text-emerald-800 mt-1 font-medium">R$ 481.300 de superávit acumulado</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'safra' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  Produtividade Obtida vs Meta Projetada por Cultura (Safra 2024/2025)
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-[#237a32] rounded-xs inline-block" />
                  <span>Produtividade Real</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-amber-400 rounded-xs inline-block" />
                  <span>Meta Esperada</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dadosSafra.map((item, idx) => {
                const percent = Math.min(100, Math.round((item.real / (item.meta * 1.2)) * 100));
                const metaPercent = Math.min(100, Math.round((item.meta / (item.meta * 1.2)) * 100));

                return (
                  <div
                    key={item.cultura}
                    className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 hover:bg-white hover:border-[#237a32]/40 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-xs font-bold text-[#185824] uppercase tracking-wide">
                          {item.area}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{item.cultura}</h4>
                        <span className="text-[11px] text-slate-500">{item.variedade}</span>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#185824]">
                          {item.rendimento}
                        </span>
                        <div className="text-lg font-extrabold text-slate-900 mt-1">
                          {item.real}{' '}
                          <span className="text-xs font-semibold text-slate-500">
                            {item.unidade}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                        <span>Realizado: {item.real} {item.unidade}</span>
                        <span>Meta: {item.meta} {item.unidade}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-[#237a32] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
                          style={{ left: `${metaPercent}%` }}
                          title={`Meta: ${item.meta}`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-emerald-200 flex items-center justify-center text-[#237a32]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Destaque da Safra 24/25
                  </h4>
                  <p className="text-xs text-emerald-800 font-medium">
                    Soja comercial alcançou 72 sc/ha no Talhão 01, superando a meta em +7 sc/ha graças ao manejo de solo e irrigação.
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-[#185824] bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-xs">
                  Eficiência Geral: 108%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
