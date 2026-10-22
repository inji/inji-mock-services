// ---------------------------------------------------------------------------
// Institute Service
// Encapsulates institution metadata and portal branding queries.
// Currently returns mock data; ready for future REST API integration.
// ---------------------------------------------------------------------------

import { institute } from "@/data";
import type { Institute } from "@/data/types";
import { API_ENDPOINTS } from "@/config/api";

export const instituteService = {
  /** Fetch details of the owner institution. */
  async getInstitute(): Promise<Institute> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(API_ENDPOINTS.institute)
    return institute;
  },

  /** Update institution metadata. */
  async updateInstitute(updates: Partial<Institute>): Promise<Institute> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    // API endpoint reference: fetch(API_ENDPOINTS.institute, { method: "PUT", body: JSON.stringify(updates) })
    Object.assign(institute, updates);
    return institute;
  },
};
