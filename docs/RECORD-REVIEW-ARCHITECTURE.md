# Campo v9.00 — Record & Review architecture

## Product model

Campo separates three concepts:

```text
Survey = observed photograph
Event = change between photographs
Balance = expected versus observed stock
```

## Recording workflow

```text
Registrar
├── Revisión rápida
│   └── latest survey + events → projected lots → review exceptions
├── Conteo completo
│   └── empty photograph → load observed lots
├── Venta / Compra
├── Nacimiento / Mortandad / Recategorización
└── Lluvia
```

## Review workflow

```text
Revisar
├── Campo
│   ├── condition by hectares
│   ├── load
│   ├── observation coverage
│   ├── condition × load matrix
│   └── freshness and trends
├── Rodeo
│   ├── stock and composition
│   ├── births and mortality
│   ├── commercial movement
│   └── observed reproductive flow
└── Balance
    ├── prior observed stock
    ├── events
    ├── expected stock
    ├── current observed stock
    └── category differences
```

## Principles

- Exceptions first.
- Projected values are never presented as observed facts.
- Discrepancies do not block saving.
- Observed, estimated, projected and missing information remain distinguishable.
- The same lot editor is reused from map, table and review workflows.
- Local data and PWA behavior remain unchanged.
