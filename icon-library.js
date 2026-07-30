/* Campo v9.02 icon registry. All operational icons use a single approved library. */
window.CAMPO_ICON_LIBRARY = Object.freeze({
  version: '9.02',
  base: './assets/icons/v902',
  path(name, size = 64) {
    const normalized = [24,32,48,64,160].includes(Number(size)) ? Number(size) : 64
    return `./assets/icons/v902/${normalized}/${name}.png`
  },
  generic: Object.freeze({
    home: 'nav-home', clipboard: 'survey-quick', map: 'nav-map', history: 'nav-history',
    download: 'backup-export', cow: 'review-herd', rain: 'rain', alert: 'alert-data',
    event: 'event-reclassification', balance: 'review-balance', archive: 'survey-archive',
    restore: 'demo-reset', zoomIn: 'map-zoom-in', zoomOut: 'map-zoom-out', target: 'map-fit',
    menu: 'nav-more'
  }),
  navigation: Object.freeze({
    resumen: 'nav-home', registrar: 'nav-register', revisar: 'nav-review', mapa: 'nav-map',
    historico: 'nav-history', mas: 'nav-more'
  }),
  survey: Object.freeze({ quick:'survey-quick', full:'survey-full', save:'survey-save', archive:'survey-archive', delete:'survey-delete' }),
  event: Object.freeze({ sale:'event-sale', purchase:'event-purchase', birth:'event-birth', death:'event-mortality', reclassification:'event-reclassification', adjustment:'event-adjustment' }),
  rain: Object.freeze({ rain:'rain', monthly:'rain-monthly', fortnight:'rain-fortnight', cumulative:'rain-cumulative', index:'rain-index' }),
  condition: Object.freeze({ 'muy-bueno':'condition-very-good', bueno:'condition-good', regular:'condition-regular', malo:'condition-poor', anegado:'condition-flooded', 'no-observado':'condition-no-info' }),
  load: Object.freeze({ low:'load-low', adequate:'load-adequate', high:'load-high', overload:'load-overload', critical:'load-critical' }),
  kpi: Object.freeze({ animals:'kpi-animals', load:'kpi-load', condition:'kpi-condition', rain:'kpi-rain', births:'kpi-birth', sales:'kpi-sales', purchases:'kpi-purchases', mortality:'kpi-mortality', balance:'kpi-balance', waterIndex:'kpi-water-index' }),
  review: Object.freeze({ field:'review-field', herd:'review-herd', balance:'review-balance' }),
  demo: Object.freeze({ main:'demo', load:'demo-load', open:'demo-open', reset:'demo-reset', delete:'demo-delete' }),
  backup: Object.freeze({ export:'backup-export', import:'backup-import', csv:'export-csv', pdf:'export-pdf' }),
  map: Object.freeze({ zoomIn:'map-zoom-in', zoomOut:'map-zoom-out', fit:'map-fit', selected:'map-selected', animation:'map-animation', pause:'map-pause' })
})
