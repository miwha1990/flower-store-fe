import axios from 'axios';

const API_URL =
  import.meta.env.VITE_NOVA_POSHTA_API_URL ?? 'https://api.novapost.com/v.1.0';
const API_KEY = import.meta.env.VITE_NP_API_KEY;
const TOKEN_TTL_MS = 55 * 60 * 1000;

type JwtResponse = {
  jwt: string;
};

export type NovaPoshtaDivisionCategory =
  | 'PostBranch'
  | 'CargoBranch'
  | 'Postomat'
  | 'PUDO';

export type NovaPoshtaDivision = {
  id: string;
  name: string;
  shortName?: string;
  externalId?: string;
  countryCode?: string;
  divisionCategory: NovaPoshtaDivisionCategory;
  status?: string;
  number?: string;
  address?: string;
  fullAddress?: unknown;
  settlement?: {
    id?: string;
    name?: string;
    [key: string]: unknown;
  };
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
};

export type NovaPoshtaSettlement = {
  id: string;
  name: string;
  countryCode?: string;
  region?: {
    name?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type PaginatedResponse<T> = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  items: T[];
};

const DIVISIONS_LIMIT = 100;
const AUTOCOMPLETE_LIMIT = 15;
const BRANCH_CATEGORIES: NovaPoshtaDivisionCategory[] = [
  'PostBranch',
  'CargoBranch',
  'Postomat',
];

export class NovaPoshtaApi {
  private readonly apiKey?: string;
  private readonly apiUrl: string;
  private cachedToken?: { value: string; expiresAt: number };

  constructor(apiKey = API_KEY, apiUrl = API_URL) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl.replace(/\/+$/, '');
  }

  async generateJwtToken(): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Nova Poshta API key is missing (VITE_NP_API_KEY).');
    }

    const { data } = await axios.get<JwtResponse>(
      `${this.apiUrl}/clients/authorization`,
      { params: { apiKey: this.apiKey } }
    );

    if (!data.jwt) {
      throw new Error(
        'Nova Poshta authorization response did not include a JWT.'
      );
    }

    this.cachedToken = {
      value: data.jwt,
      expiresAt: Date.now() + TOKEN_TTL_MS,
    };

    return data.jwt;
  }

  async getJwtToken(): Promise<string> {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now()) {
      return this.cachedToken.value;
    }

    return this.generateJwtToken();
  }

  async searchSettlements(search: string): Promise<NovaPoshtaSettlement[]> {
    const term = search.trim();
    if (term.length < 2) return [];

    const token = await this.getJwtToken();
    const { data } = await axios.get<PaginatedResponse<NovaPoshtaSettlement>>(
      `${this.apiUrl}/settlements`,
      {
        params: {
          'countryCodes[]': 'UA',
          textSearch: term,
          limit: AUTOCOMPLETE_LIMIT,
          page: 1,
        },
        headers: { Authorization: token },
      }
    );

    if (!Array.isArray(data.items)) {
      throw new Error(
        'Nova Poshta settlements response has an invalid format.'
      );
    }

    return data.items;
  }

  async searchBranchesAndMailboxes(
    settlementId: string,
    search: string
  ): Promise<NovaPoshtaDivision[]> {
    if (!settlementId) {
      throw new Error(
        'A settlement must be selected to load Nova Poshta branches.'
      );
    }

    const term = search.trim();
    if (!term) return [];

    const token = await this.getJwtToken();
    const { data } = await axios.get<PaginatedResponse<NovaPoshtaDivision>>(
      `${this.apiUrl}/divisions`,
      {
        params: {
          'countryCodes[]': 'UA',
          'settlementIds[]': settlementId,
          'divisionCategories[]': BRANCH_CATEGORIES,
          textSearch: term,
          limit: DIVISIONS_LIMIT,
          page: 1,
        },
        headers: { Authorization: token },
      }
    );

    if (!Array.isArray(data.items)) {
      throw new Error('Nova Poshta divisions response has an invalid format.');
    }

    return data.items;
  }
}

export const novaPoshtaApi = new NovaPoshtaApi();
