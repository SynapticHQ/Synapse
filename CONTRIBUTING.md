# Contributing

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/synapse
cd synapse
bun install
cp .env.example .env   # fill in your keys
bun run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Run with hot reload |
| `bun run test` | Run vitest suite |
| `bun run lint` | TypeScript type check |
| `bun run build` | Compile to dist/ |

## Adding an Agent

See `CLAUDE.md` → "Adding a new agent".

## License

MIT


