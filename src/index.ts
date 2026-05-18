interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * open.canada.ca MCP — Canada CKAN catalogue.
 */


const BASE = 'https://open.canada.ca/data/api/3';
const UA = 'pipeworx-mcp-opendata-canada/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  { name: 'search', description: 'CKAN package_search.', inputSchema: { type: 'object', properties: { query: { type: 'string' }, fq: { type: 'string' }, rows: { type: 'number' }, start: { type: 'number' } }, required: ['query'] } },
  { name: 'package', description: 'Dataset by id/slug.', inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } },
  { name: 'organizations', description: 'List orgs.', inputSchema: { type: 'object', properties: { limit: { type: 'number' } } } },
  { name: 'groups', description: 'List themes.', inputSchema: { type: 'object', properties: { limit: { type: 'number' } } } },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search': {
      const p = new URLSearchParams({
        q: reqStr(args, 'query', '"agriculture"'),
        rows: String(Math.min(1000, Math.max(1, (args.rows as number) ?? 25))),
        start: String(Math.max(0, (args.start as number) ?? 0)),
      });
      if (args.fq) p.set('fq', String(args.fq));
      return ckanGet(`/action/package_search?${p}`);
    }
    case 'package':
      return ckanGet(`/action/package_show?id=${encodeURIComponent(reqStr(args, 'id', '"<id>"'))}`);
    case 'organizations':
      return ckanGet(`/action/organization_list?all_fields=true&limit=${Math.min(1000, Math.max(1, (args.limit as number) ?? 100))}`);
    case 'groups':
      return ckanGet(`/action/group_list?all_fields=true&limit=${Math.min(1000, Math.max(1, (args.limit as number) ?? 100))}`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function ckanGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`open.canada.ca: ${res.status}`);
  const json = (await res.json()) as { success?: boolean; error?: { message?: string }; result?: unknown };
  if (json.success === false) throw new Error(`open.canada.ca: ${json.error?.message ?? 'unknown error'}`);
  return json.result ?? json;
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
