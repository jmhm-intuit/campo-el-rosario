import { useMemo, useState } from 'react'
import { Focus, Layers3, Minus, Plus, RotateCcw } from 'lucide-react'
import { LOTS, PASTURE_COLORS, PASTURE_LABELS } from '../data/config'
import type { AppState, CapacityStatus } from '../types'
import {
  CAPACITY_COLORS,
  CAPACITY_LABELS,
  capacityStatus,
  metricForLot,
} from '../utils/calculations'
import { formatDecimal, formatNumber } from '../utils/format'

export type MapMode = 'carga' | 'animales' | 'cambio' | 'pasturas'

type Geometry = {
  points: string
  label: [number, number]
  bounds: [number, number, number, number]
}

const GEOMETRY: Record<string, Geometry> = {
  // The drawing uses a common visual scale of roughly 180 px² per hectare.
  // This keeps the relative field sizes faithful to the 1,735 ha source report
  // while preserving the recognizable north-to-south layout of El Rosario.
  'ER-01': { points: '50,45 209,45 209,215 50,215', label: [129, 88], bounds: [35, 30, 189, 200] },
  'ER-02': { points: '209,45 368,45 368,215 209,215', label: [288, 88], bounds: [194, 30, 189, 200] },
  'ER-03': { points: '368,45 527,45 527,215 368,215', label: [447, 88], bounds: [353, 30, 189, 200] },
  'ER-04': { points: '527,45 633,45 633,130 527,130', label: [580, 61], bounds: [492, 25, 176, 150] },
  'ER-05': { points: '633,45 768,45 768,125 633,125', label: [700, 61], bounds: [613, 25, 175, 140] },
  'ER-06': { points: '527,130 633,130 633,215 527,215', label: [580, 146], bounds: [492, 110, 176, 150] },
  'ER-07': { points: '633,125 768,125 768,212 633,212', label: [700, 141], bounds: [613, 105, 175, 147] },
  'ER-08-09': { points: '50,215 230,215 230,365 50,365', label: [140, 258], bounds: [35, 200, 210, 180] },
  'ER-10': { points: '230,215 410,215 410,365 230,365', label: [320, 258], bounds: [215, 200, 210, 180] },
  'ER-11': { points: '527,215 644,215 644,315 527,315', label: [585, 231], bounds: [502, 195, 167, 160] },
  'ER-12': { points: '644,215 743,215 743,315 644,315', label: [693, 231], bounds: [619, 195, 149, 160] },
  'ER-13': { points: '527,315 617,315 617,415 527,415', label: [572, 331], bounds: [497, 295, 150, 160] },
  'ER-14': { points: '617,315 725,315 725,415 617,415', label: [671, 331], bounds: [592, 295, 158, 160] },
  'ER-15-16': { points: '527,415 647,415 647,520 527,520', label: [587, 431], bounds: [502, 395, 170, 165] },
  'ER-17': { points: '647,415 767,415 767,520 647,520', label: [707, 431], bounds: [622, 395, 170, 165] },
  'ER-18': { points: '600,526 672,526 672,676 600,676', label: [636, 545], bounds: [560, 506, 152, 190] },
  'ER-19': { points: '672,526 852,526 852,676 672,676', label: [762, 570], bounds: [657, 511, 210, 180] },
  'ER-20-21': { points: '852,526 1068,526 1068,676 852,676', label: [960, 570], bounds: [837, 511, 246, 180] },
}

const PASTURE_POSITIONS: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
  'p-er02-1': { cx: 318, cy: 126, rx: 22, ry: 17 },
  'p-er03-1': { cx: 454, cy: 136, rx: 37, ry: 29 },
  'p-er04-1': { cx: 580, cy: 86, rx: 28, ry: 31 },
  'p-er05-1': { cx: 700, cy: 84, rx: 38, ry: 29 },
  'p-er06-1': { cx: 580, cy: 178, rx: 17, ry: 23 },
  'p-er08-1': { cx: 112, cy: 327, rx: 20, ry: 14 },
  'p-er08-2': { cx: 156, cy: 303, rx: 16, ry: 12 },
  'p-er10-1': { cx: 327, cy: 300, rx: 32, ry: 25 },
  'p-er13-1': { cx: 572, cy: 374, rx: 16, ry: 15 },
  'p-er14-1': { cx: 682, cy: 365, rx: 27, ry: 31 },
  'p-er14-2': { cx: 651, cy: 397, rx: 22, ry: 18 },
  'p-er15-1': { cx: 587, cy: 480, rx: 12, ry: 31 },
  'p-er18-1': { cx: 636, cy: 624, rx: 27, ry: 38 },
}

function statusFill(status: CapacityStatus) {
  return CAPACITY_COLORS[status]
}

interface RanchMapProps {
  state: AppState
  period: string
  selectedLotId?: string
  onSelectLot?: (lotId: string) => void
  compact?: boolean
  initialMode?: MapMode
  showModeSelector?: boolean
}

export function RanchMap({
  state,
  period,
  selectedLotId,
  onSelectLot,
  compact = false,
  initialMode = 'carga',
  showModeSelector = true,
}: RanchMapProps) {
  const [mode, setMode] = useState<MapMode>(initialMode)
  const [zoom, setZoom] = useState(1)
  const [focus, setFocus] = useState<string | undefined>()
  const metrics = useMemo(
    () => Object.fromEntries(LOTS.map((lot) => [lot.id, metricForLot(state, period, lot.id)])),
    [state, period],
  )
  const maxAnimals = Math.max(...Object.values(metrics).map((metric) => metric.animals), 1)
  const maxChange = Math.max(...Object.values(metrics).map((metric) => Math.abs(metric.animalChange)), 1)

  const focusedGeometry = focus ? GEOMETRY[focus] : undefined
  const viewBox = focusedGeometry
    ? `${focusedGeometry.bounds[0]} ${focusedGeometry.bounds[1]} ${focusedGeometry.bounds[2]} ${focusedGeometry.bounds[3]}`
    : zoom === 1
      ? '0 0 1100 700'
      : zoom === 1.25
        ? '80 35 880 560'
        : '170 80 700 445'

  const dominantPasture = (lotId: string) =>
    [...state.pastures]
      .filter((pasture) => pasture.lotId === lotId)
      .sort((a, b) => b.hectares - a.hectares)[0]

  const fillForLot = (lotId: string) => {
    const metric = metrics[lotId]
    if (mode === 'carga') return statusFill(capacityStatus(metric.loadPerHa, metric.animals))
    if (mode === 'animales') {
      const intensity = metric.animals / maxAnimals
      return `hsl(96 42% ${71 - intensity * 33}%)`
    }
    if (mode === 'cambio') {
      if (!metric.animalChange) return '#8d9687'
      const intensity = Math.min(1, Math.abs(metric.animalChange) / maxChange)
      return metric.animalChange > 0
        ? `hsl(104 43% ${70 - intensity * 35}%)`
        : `hsl(17 65% ${72 - intensity * 36}%)`
    }
    const pasture = dominantPasture(lotId)
    return pasture ? PASTURE_COLORS[pasture.type] : PASTURE_COLORS['campo-natural']
  }

  return (
    <div className={`ranch-map-shell ${compact ? 'ranch-map-shell--compact' : ''}`}>
      {showModeSelector && (
        <div className="map-mode-bar" role="group" aria-label="Visualización del mapa">
          {([
            ['carga', 'Carga animal'],
            ['animales', 'Cantidad'],
            ['cambio', 'Cambio mensual'],
            ['pasturas', 'Pasturas'],
          ] as [MapMode, string][]).map(([key, label]) => (
            <button
              type="button"
              key={key}
              className={mode === key ? 'is-active' : ''}
              onClick={() => setMode(key)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="map-stage">
        {!compact && (
          <div className="map-controls" aria-label="Controles del mapa">
            <button type="button" onClick={() => setZoom((value) => Math.min(1.6, value + 0.25))} title="Acercar">
              <Plus size={17} />
            </button>
            <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} title="Alejar">
              <Minus size={17} />
            </button>
            <button
              type="button"
              onClick={() => selectedLotId && setFocus(selectedLotId)}
              disabled={!selectedLotId}
              title="Enfocar lote seleccionado"
            >
              <Focus size={17} />
            </button>
            <button
              type="button"
              onClick={() => {
                setFocus(undefined)
                setZoom(1)
              }}
              title="Restablecer vista"
            >
              <RotateCcw size={17} />
            </button>
          </div>
        )}

        <svg
          className="ranch-map"
          viewBox={viewBox}
          role="img"
          aria-label={`Mapa de El Rosario para ${period}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="terrain" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#b6a663" />
              <stop offset="0.36" stopColor="#82985c" />
              <stop offset="0.7" stopColor="#6f8a52" />
              <stop offset="1" stopColor="#9b8b58" />
            </linearGradient>
            <pattern id="grass" width="22" height="22" patternUnits="userSpaceOnUse">
              <path d="M3 19l3-8m0 8 4-11m5 11 2-7m0 7 3-10" stroke="#f7f0c4" strokeOpacity="0.15" strokeWidth="1" />
              <circle cx="7" cy="5" r="1" fill="#243d27" fillOpacity="0.16" />
            </pattern>
            <pattern id="cropRows" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <rect width="12" height="12" fill="transparent" />
              <path d="M0 2h12M0 8h12" stroke="#fff7ce" strokeOpacity="0.34" strokeWidth="1.4" />
            </pattern>
            <filter id="labelShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#152516" floodOpacity="0.9" />
            </filter>
            <filter id="lotShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#13271b" floodOpacity="0.28" />
            </filter>
            <symbol id="cowMark" viewBox="0 0 26 16">
              <path d="M3 5h14l3 3v5h-3v-3h-3v4h-3v-4H7v4H4v-4H2V7z" fill="currentColor" />
              <path d="M18 3h5l2 2-2 3h-4z" fill="currentColor" />
            </symbol>
          </defs>

          <rect width="1100" height="700" fill="url(#terrain)" />
          <rect width="1100" height="700" fill="url(#grass)" opacity="0.9" />

          {/* Open Pampas background: sparse shelter belts, no lake. */}
          <g opacity="0.55" fill="#2f5734">
            {[25, 92, 168, 836, 1010].map((x, index) => (
              <g key={x} transform={`translate(${x} ${index % 2 ? 520 : 120})`}>
                <circle cx="0" cy="0" r="9" />
                <circle cx="12" cy="3" r="7" />
                <rect x="4" y="8" width="3" height="10" fill="#654927" />
              </g>
            ))}
          </g>

          {/* Dirt roads following the reference plan. */}
          <g fill="none" strokeLinecap="round">
            <path d="M25 392C190 392 305 405 455 402C570 400 650 450 760 505C870 560 990 505 1090 486" stroke="#594c31" strokeOpacity="0.28" strokeWidth="20" />
            <path d="M25 392C190 392 305 405 455 402C570 400 650 450 760 505C870 560 990 505 1090 486" stroke="#d4bd7a" strokeWidth="11" />
            <path d="M485 20C480 175 475 315 478 430C480 525 545 610 650 700" stroke="#5c4b2f" strokeOpacity="0.26" strokeWidth="16" />
            <path d="M485 20C480 175 475 315 478 430C480 525 545 610 650 700" stroke="#ceb879" strokeWidth="8" />
          </g>

          {/* Ranch buildings and Argentine Pampas water infrastructure. */}
          <g transform="translate(300 402)" filter="url(#lotShadow)">
            <path d="M0 26h58v28H0z" fill="#815e39" />
            <path d="M-5 28 29 7l35 21z" fill="#4f3527" />
            <rect x="10" y="37" width="12" height="17" fill="#d5c394" />
            <rect x="37" y="35" width="11" height="9" fill="#8fc0c7" />
            <text x="29" y="69" textAnchor="middle" fontSize="12" fill="#fdf8e5" filter="url(#labelShadow)">Casco</text>
          </g>
          <g transform="translate(390 429)" stroke="#283c2d" strokeWidth="2" fill="none">
            <circle cx="0" cy="0" r="17" />
            {[0, 30, 60, 90, 120, 150].map((angle) => (
              <line key={angle} x1="0" y1="0" x2={17 * Math.cos((angle * Math.PI) / 180)} y2={17 * Math.sin((angle * Math.PI) / 180)} />
            ))}
            <path d="M0 17-13 62M0 17l13 45M-9 50H9" />
            <path d="M17 0h16l-5 7z" fill="#d6bd70" />
          </g>
          <g transform="translate(438 462)" filter="url(#lotShadow)">
            <ellipse cx="0" cy="0" rx="24" ry="8" fill="#cfd5ca" stroke="#53615b" strokeWidth="2" />
            <path d="M-24 0v23c0 5 48 5 48 0V0" fill="#aeb9b1" stroke="#53615b" strokeWidth="2" />
            <ellipse cx="0" cy="23" rx="24" ry="8" fill="#98a69f" stroke="#53615b" strokeWidth="2" />
            <path d="M-20 7h40M-20 13h40" stroke="#e8ece7" strokeOpacity="0.8" />
            <text x="0" y="46" textAnchor="middle" fontSize="11" fill="#fff8e7" filter="url(#labelShadow)">Tanque</text>
          </g>

          {/* Pasture approximation shapes from the reference map. */}
          {state.pastures.map((pasture) => {
            const position = PASTURE_POSITIONS[pasture.id]
            if (!position) return null
            return (
              <g key={pasture.id} pointerEvents="none">
                <ellipse
                  cx={position.cx}
                  cy={position.cy}
                  rx={position.rx}
                  ry={position.ry}
                  fill={PASTURE_COLORS[pasture.type]}
                  fillOpacity={mode === 'pasturas' ? 0.95 : 0.68}
                  stroke="#fff8d8"
                  strokeWidth="1.5"
                  strokeDasharray={pasture.type === 'rastrojo' ? '4 3' : undefined}
                />
                {(pasture.type === 'avena' || pasture.type === 'sorgo') && (
                  <ellipse
                    cx={position.cx}
                    cy={position.cy}
                    rx={position.rx}
                    ry={position.ry}
                    fill="url(#cropRows)"
                  />
                )}
                {!compact && mode === 'pasturas' && (
                  <text
                    x={position.cx}
                    y={position.cy + 4}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#fff"
                    filter="url(#labelShadow)"
                  >
                    {pasture.hectares} ha
                  </text>
                )}
                <title>{`${pasture.name}: ${PASTURE_LABELS[pasture.type]} · ${pasture.hectares} ha`}</title>
              </g>
            )
          })}

          {LOTS.map((lot) => {
            const geometry = GEOMETRY[lot.id]
            const metric = metrics[lot.id]
            const status = capacityStatus(metric.loadPerHa, metric.animals)
            const selected = selectedLotId === lot.id
            const labelX = geometry.label[0]
            const labelY = geometry.label[1]
            const pasture = dominantPasture(lot.id)
            const isSmallLot = lot.hectares <= 70
            const shortPastureLabel = pasture
              ? PASTURE_LABELS[pasture.type]
                  .replace('Campo natural', 'Natural')
                  .replace('Pastura mejorada', 'Mejorada')
                  .replace('Sin información', 'Sin info')
              : 'Natural'
            const detailValue =
              mode === 'cambio'
                ? `${metric.animalChange > 0 ? '+' : ''}${metric.animalChange}`
                : mode === 'pasturas'
                  ? isSmallLot
                    ? shortPastureLabel
                    : pasture
                      ? PASTURE_LABELS[pasture.type]
                      : 'Campo natural'
                  : `${formatNumber(metric.animals)} animales`
            const badgeOffset = compact ? 18 : isSmallLot ? 33 : 38
            const badgeWidth = compact ? 68 : isSmallLot ? 82 : 96
            const badgeHeight = compact ? 25 : isSmallLot ? 27 : 30
            const badgeX = -badgeWidth / 2
            const badgeY = -13

            return (
              <g
                key={lot.id}
                className={`map-lot ${selected ? 'is-selected' : ''}`}
                onClick={() => onSelectLot?.(lot.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') onSelectLot?.(lot.id)
                }}
              >
                <polygon
                  points={geometry.points}
                  fill={fillForLot(lot.id)}
                  fillOpacity={mode === 'pasturas' ? 0.46 : 0.68}
                  stroke={selected ? '#ffd96b' : '#f7f2dc'}
                  strokeWidth={selected ? 5 : 3}
                  filter={selected ? 'url(#lotShadow)' : undefined}
                />
                <polygon points={geometry.points} fill="url(#grass)" opacity="0.48" />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="map-lot__name"
                  filter="url(#labelShadow)"
                >
                  {lot.name}
                </text>
                {!compact && (
                  <text
                    x={labelX}
                    y={labelY + 18}
                    textAnchor="middle"
                    className="map-lot__meta"
                    filter="url(#labelShadow)"
                  >
                    {lot.hectares} ha
                  </text>
                )}
                <g transform={`translate(${labelX} ${labelY + badgeOffset})`}>
                  <rect
                    x={badgeX}
                    y={badgeY}
                    width={badgeWidth}
                    height={badgeHeight}
                    rx="14"
                    fill="#14281c"
                    fillOpacity="0.74"
                    stroke="#fff7dd"
                    strokeOpacity="0.45"
                  />
                  {mode !== 'pasturas' && (
                    <circle cx={compact ? -22 : -33} cy="2" r="5" fill={statusFill(status)} stroke="#fff6dc" strokeWidth="1" />
                  )}
                  <text
                    x={mode === 'pasturas' ? 0 : compact ? 4 : 7}
                    y="6"
                    textAnchor="middle"
                    fontSize={compact || isSmallLot ? 10.5 : 12}
                    fontWeight="700"
                    fill="#fffaf0"
                  >
                    {(compact || isSmallLot) && mode !== 'pasturas' ? formatNumber(metric.animals) : detailValue}
                  </text>
                </g>
                {!compact && !isSmallLot && mode === 'carga' && metric.animals > 0 && (
                  <text
                    x={labelX}
                    y={labelY + 77}
                    textAnchor="middle"
                    className="map-lot__load"
                    filter="url(#labelShadow)"
                  >
                    {formatDecimal(metric.loadPerHa, 2)} EV/ha
                  </text>
                )}
                {!compact && !isSmallLot && metric.animals > 0 && (
                  <g transform={`translate(${labelX - 22} ${labelY + 87})`} color="#fff9e9" opacity="0.86">
                    {Array.from({ length: Math.min(4, Math.max(1, Math.ceil(metric.animals / 80))) }).map((_, index) => (
                      <use key={index} href="#cowMark" x={index * 15} y="0" width="18" height="11" />
                    ))}
                  </g>
                )}
                <title>{`${lot.name}: ${metric.animals} animales · ${formatDecimal(metric.loadPerHa, 2)} EV/ha · ${CAPACITY_LABELS[status]}`}</title>
              </g>
            )
          })}
        </svg>

        {!compact && (
          <div className="map-legend">
            <Layers3 size={15} />
            {mode === 'carga' ? (
              <div className="map-legend__items">
                {(['baja', 'adecuada', 'alta', 'sobrecarga', 'critica'] as CapacityStatus[]).map((status) => (
                  <span key={status}>
                    <i style={{ backgroundColor: CAPACITY_COLORS[status] }} /> {CAPACITY_LABELS[status]}
                  </span>
                ))}
              </div>
            ) : mode === 'pasturas' ? (
              <div className="map-legend__items">
                {Object.entries(PASTURE_LABELS)
                  .slice(0, 6)
                  .map(([type, label]) => (
                    <span key={type}>
                      <i style={{ backgroundColor: PASTURE_COLORS[type as keyof typeof PASTURE_COLORS] }} /> {label}
                    </span>
                  ))}
              </div>
            ) : (
              <span>{mode === 'animales' ? 'Más oscuro = más animales' : 'Verde = aumento · naranja = reducción'}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
