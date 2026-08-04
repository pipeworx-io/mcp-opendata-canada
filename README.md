# @pipeworx/opendata-canada

[open.canada.ca](https://open.canada.ca) MCP — Canada's national open-data catalogue (CKAN). Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `search(query, fq?, rows?, start?)` — CKAN package_search
- `package(id)` — single dataset by id or slug
- `organizations(limit?)` — publishers
- `groups(limit?)` — themes/groups

## Data source

`https://open.canada.ca/data/api/3/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "opendata-canada": {
      "url": "https://gateway.pipeworx.io/opendata-canada/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Opendata Canada data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
