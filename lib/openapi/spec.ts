import type { OpenAPIV3 } from "openapi-types";

const convexPlayerSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "_id",
    "_creationTime",
    "countryId",
    "name",
    "age",
    "position",
    "detailedPosition",
    "preferredFoot",
    "club",
    "league",
    "clubCountry",
    "positionGroup",
    "isCaptain",
    "previousWorldCupsCount",
    "previousWorldCupsList",
  ],
  properties: {
    _id: { type: "string", description: "Convex document ID" },
    _creationTime: { type: "number" },
    countryId: { type: "string", description: "Convex country document ID" },
    name: { type: "string" },
    jerseyNumber: { type: "integer", nullable: true },
    age: { type: "integer" },
    position: { type: "string" },
    detailedPosition: { type: "string" },
    preferredFoot: { type: "string" },
    club: { type: "string" },
    league: { type: "string" },
    clubCountry: { type: "string" },
    positionGroup: { type: "string", enum: ["GK", "DF", "MF", "FW"] },
    isCaptain: { type: "boolean" },
    previousWorldCupsCount: { type: "integer" },
    previousWorldCupsList: { type: "array", items: { type: "string" } },
    profileSlug: { type: "string" },
  },
};

const convexCountrySnapshotSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["slug", "displayName", "fifaCode", "groupLetter"],
  properties: {
    slug: { type: "string", example: "argentina" },
    displayName: { type: "string", example: "Argentina" },
    fifaCode: { type: "string", example: "ARG" },
    groupLetter: { type: "string", example: "J" },
  },
};

const convexPlayerSnapshotSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: [
    "id",
    "name",
    "age",
    "position",
    "detailedPosition",
    "preferredFoot",
    "club",
    "league",
    "clubCountry",
    "positionGroup",
    "isCaptain",
  ],
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    jerseyNumber: { type: "integer", nullable: true },
    age: { type: "integer" },
    position: { type: "string" },
    detailedPosition: { type: "string" },
    preferredFoot: { type: "string" },
    club: { type: "string" },
    league: { type: "string" },
    clubCountry: { type: "string" },
    positionGroup: { type: "string", enum: ["GK", "DF", "MF", "FW"] },
    isCaptain: { type: "boolean" },
  },
};

const bsdMatchMetaSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["bsdPlayerId", "score", "confidence", "strategy"],
  properties: {
    bsdPlayerId: { type: "integer", nullable: true },
    score: { type: "number", nullable: true },
    confidence: {
      type: "string",
      nullable: true,
      enum: ["high", "medium", "low"],
    },
    strategy: {
      type: "string",
      nullable: true,
      enum: ["club", "national", "consensus"],
    },
  },
};

const enrichedPlayerResponseSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["player", "match"],
  properties: {
    player: { type: "object" },
    match: bsdMatchMetaSchema,
  },
};

const errorSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  required: ["detail"],
  properties: {
    detail: { type: "string" },
  },
};

export const openApiSpec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Footy Arena API",
    description:
      "Development-only API reference for Footy Arena route handlers. This playground is unavailable in production.",
    version: "0.1.0",
  },
  tags: [
    { name: "Players", description: "Public player endpoints" },
    { name: "Teams", description: "Public team squad endpoints" },
    { name: "Lab", description: "Development lab endpoints (Convex + BSD enrichment)" },
  ],
  paths: {
    "/api/player": {
      get: {
        tags: ["Players"],
        summary: "Enrich a player by Convex ID",
        description:
          "Loads a player from Convex by ID, reconciles club and national-team BSD matches, and returns the normalized player with match metadata.",
        operationId: "getEnrichedPlayer",
        parameters: [
          {
            name: "playerId",
            in: "query",
            required: true,
            description: "Convex player document ID",
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Enriched player",
            content: {
              "application/json": {
                schema: enrichedPlayerResponseSchema,
              },
            },
          },
          "400": {
            description: "Missing playerId query parameter",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
          "404": {
            description: "Player not found",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
        },
      },
      post: {
        tags: ["Players"],
        summary: "Enrich a player from Convex ID or snapshot",
        description:
          "Accepts either a Convex player ID or a full Convex player document, reconciles club and national-team BSD matches, and returns the normalized player with match metadata.",
        operationId: "postEnrichedPlayer",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    type: "object",
                    required: ["playerId"],
                    properties: {
                      playerId: { type: "string" },
                    },
                  },
                  {
                    type: "object",
                    required: ["player"],
                    properties: {
                      player: convexPlayerSchema,
                    },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Enriched player",
            content: {
              "application/json": {
                schema: enrichedPlayerResponseSchema,
              },
            },
          },
          "400": {
            description: "Invalid request body",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
          "404": {
            description: "Player not found",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
        },
      },
    },
    "/api/teams/{slug}/squad": {
      get: {
        tags: ["Teams"],
        summary: "Get an enriched team squad",
        description:
          "Loads a country's squad from Convex and enriches each player via BSD when BSD_API_TOKEN is configured. Falls back to Convex-only player data when enrichment is unavailable.",
        operationId: "getEnrichedTeamSquad",
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            description: "Country slug (case-insensitive)",
            schema: { type: "string", example: "argentina" },
          },
        ],
        responses: {
          "200": {
            description: "Enriched team squad",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["country", "status", "source", "players", "summary"],
                  properties: {
                    country: convexCountrySnapshotSchema,
                    status: {
                      type: "string",
                      enum: ["announced", "pending"],
                    },
                    manager: {
                      type: "object",
                      nullable: true,
                      properties: {
                        name: { type: "string" },
                        nationality: { type: "string" },
                      },
                    },
                    source: {
                      type: "string",
                      enum: ["bsd", "convex"],
                      description:
                        "Whether player records were enriched via BSD or returned from Convex only",
                    },
                    players: {
                      type: "array",
                      items: enrichedPlayerResponseSchema,
                    },
                    summary: {
                      type: "object",
                      required: ["total", "matched"],
                      properties: {
                        total: { type: "integer" },
                        matched: {
                          type: "integer",
                          description: "Players successfully matched to BSD records",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Team not found",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
          "500": {
            description: "Failed to load team squad",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
        },
      },
    },
    "/api/lab/convex/team": {
      get: {
        tags: ["Lab"],
        summary: "Get team snapshot from Convex",
        description:
          "Loads a country's squad snapshot from Convex for lab tooling. Returns 404 outside development.",
        operationId: "getLabTeamSnapshot",
        parameters: [
          {
            name: "slug",
            in: "query",
            required: true,
            description: "Country slug (case-insensitive)",
            schema: { type: "string", example: "argentina" },
          },
        ],
        responses: {
          "200": {
            description: "Team snapshot",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["country", "squadStatus", "players"],
                  properties: {
                    country: convexCountrySnapshotSchema,
                    managerName: { type: "string" },
                    squadStatus: {
                      type: "string",
                      enum: ["announced", "pending"],
                    },
                    players: {
                      type: "array",
                      items: convexPlayerSnapshotSchema,
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Missing slug query parameter",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
          "404": {
            description: "Team not found or endpoint unavailable",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
        },
      },
    },
    "/api/lab/bsd/players": {
      post: {
        tags: ["Lab"],
        summary: "Enrich Convex players with BSD metadata",
        description:
          "Matches Convex squad members using club and national-team BSD strategies, reconciles results, and optionally attaches stats. Requires BSD_API_TOKEN. Returns 404 outside development.",
        operationId: "enrichLabPlayers",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["country", "players"],
                properties: {
                  country: convexCountrySnapshotSchema,
                  players: {
                    type: "array",
                    items: convexPlayerSnapshotSchema,
                  },
                  includeStats: {
                    type: "boolean",
                    default: true,
                    description: "Whether to fetch BSD career stats for matched players",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Enrichment payload",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["country", "players", "summary"],
                  properties: {
                    country: convexCountrySnapshotSchema,
                    bsdNationalTeamId: { type: "integer", nullable: true },
                    bsdNationalTeamName: { type: "string", nullable: true },
                    players: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["convexPlayerId", "convex", "stats", "statsSummary"],
                        properties: {
                          convexPlayerId: { type: "string" },
                          convex: convexPlayerSnapshotSchema,
                          bsd: { type: "object", nullable: true },
                          matchScore: { type: "number", nullable: true },
                          matchConfidence: {
                            type: "string",
                            nullable: true,
                            enum: ["high", "medium", "low"],
                          },
                          matchStrategy: {
                            type: "string",
                            nullable: true,
                            enum: ["club", "national", "consensus"],
                          },
                          stats: { type: "array", items: { type: "object" } },
                          statsSummary: {
                            type: "object",
                            properties: {
                              appearances: { type: "integer" },
                              goals: { type: "integer" },
                              assists: { type: "integer" },
                              avgRating: { type: "number", nullable: true },
                            },
                          },
                        },
                      },
                    },
                    summary: {
                      type: "object",
                      properties: {
                        total: { type: "integer" },
                        matched: { type: "integer" },
                        withStats: { type: "integer" },
                      },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Invalid request body",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
          "404": {
            description: "Endpoint unavailable outside development",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
          "500": {
            description: "Enrichment failed",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
          "503": {
            description: "BSD_API_TOKEN is not configured",
            content: {
              "application/json": { schema: errorSchema },
            },
          },
        },
      },
    },
  },
};
