/**
 * Axios API Client for Human Collaboration Intelligence Platform
 */

import axios from 'axios';
import type {
  CreatorProfile,
  Project,
  Match,
  ParsedProjectBrief,
  BriefParseRequest,
  AdminApprovalRequest,
  AuthSession,
  ProjectWorkspace,
  ShotItem,
  BudgetItem,
  CallSheet,
} from '../types';

const client = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Auth
  authSession: async (payload: {
    provider: string;
    token?: string;
    email?: string;
    name?: string;
    role?: string;
  }): Promise<AuthSession> => {
    const res = await client.post<AuthSession>('/auth/session', payload);
    return res.data;
  },

  // Creators
  getCreators: async (role?: string, location?: string): Promise<CreatorProfile[]> => {
    const res = await client.get<CreatorProfile[]>('/creators', {
      params: { role, location },
    });
    return res.data;
  },

  updateProfile: async (profile: Partial<CreatorProfile>): Promise<CreatorProfile> => {
    const res = await client.post<CreatorProfile>('/creators/profile', profile);
    return res.data;
  },

  // Brief Parser & Projects
  parseBrief: async (payload: BriefParseRequest): Promise<ParsedProjectBrief> => {
    const res = await client.post<ParsedProjectBrief>('/projects/parse-brief', payload);
    return res.data;
  },

  getProjects: async (): Promise<Project[]> => {
    const res = await client.get<Project[]>('/projects');
    return res.data;
  },

  createProject: async (project: {
    seekerId: string;
    title: string;
    rawTextBrief: string;
    parsedRequirements: ParsedProjectBrief;
    budgetUsd: number;
    timeline: string;
    location: string;
    genreTags?: string[];
  }): Promise<Project> => {
    const res = await client.post<Project>('/projects', project);
    return res.data;
  },

  // Matches & Bidirectional Evaluation
  getMatches: async (params?: {
    projectId?: string;
    seekerId?: string;
    collaboratorId?: string;
    status?: string;
  }): Promise<Match[]> => {
    const res = await client.get<Match[]>('/matches', { params });
    return res.data;
  },

  evaluateMatch: async (payload: {
    projectId: string;
    seekerId: string;
    collaboratorId: string;
  }): Promise<Match> => {
    const res = await client.post<Match>('/matches/evaluate', payload);
    return res.data;
  },

  matchAction: async (
    matchId: string,
    action: 'accept' | 'counter_offer' | 'pass',
    counterOfferNotes?: string
  ): Promise<Match> => {
    const res = await client.post<Match>(`/matches/${matchId}/action`, {
      action,
      counterOfferNotes,
    });
    return res.data;
  },

  // Founder Concierge Admin
  getAdminQueue: async (statusFilter?: string): Promise<Match[]> => {
    const res = await client.get<Match[]>('/admin/match-queue', {
      params: { statusFilter },
    });
    return res.data;
  },

  approveMatch: async (
    matchId: string,
    payload: AdminApprovalRequest
  ): Promise<Match> => {
    const res = await client.patch<Match>(`/admin/match-approve/${matchId}`, payload);
    return res.data;
  },

  // Reset Mock Seed Data
  resetSeed: async (): Promise<{ message: string }> => {
    const res = await client.post<{ message: string }>('/seed/reset');
    return res.data;
  },

  // Python Codebase
  getPythonCodebase: async (): Promise<Record<string, string>> => {
    const res = await client.get<Record<string, string>>('/codebase/python');
    return res.data;
  },

  // Post-Match Workspace & Shoot Plan
  getWorkspace: async (projectId: string): Promise<ProjectWorkspace> => {
    const res = await client.get<ProjectWorkspace>(`/workspace/${projectId}`);
    return res.data;
  },

  addShot: async (projectId: string, shot: Partial<ShotItem>): Promise<ProjectWorkspace> => {
    const res = await client.post<ProjectWorkspace>(`/workspace/${projectId}/shot`, shot);
    return res.data;
  },

  updateShot: async (projectId: string, shotId: string, updates: Partial<ShotItem>): Promise<ProjectWorkspace> => {
    const res = await client.patch<ProjectWorkspace>(`/workspace/${projectId}/shot/${shotId}`, updates);
    return res.data;
  },

  deleteShot: async (projectId: string, shotId: string): Promise<ProjectWorkspace> => {
    const res = await client.delete<ProjectWorkspace>(`/workspace/${projectId}/shot/${shotId}`);
    return res.data;
  },

  addBudgetItem: async (projectId: string, item: Partial<BudgetItem>): Promise<ProjectWorkspace> => {
    const res = await client.post<ProjectWorkspace>(`/workspace/${projectId}/budget`, item);
    return res.data;
  },

  updateBudgetItem: async (projectId: string, budgetId: string, updates: Partial<BudgetItem>): Promise<ProjectWorkspace> => {
    const res = await client.patch<ProjectWorkspace>(`/workspace/${projectId}/budget/${budgetId}`, updates);
    return res.data;
  },

  deleteBudgetItem: async (projectId: string, budgetId: string): Promise<ProjectWorkspace> => {
    const res = await client.delete<ProjectWorkspace>(`/workspace/${projectId}/budget/${budgetId}`);
    return res.data;
  },

  updateCallSheet: async (projectId: string, updates: Partial<CallSheet>): Promise<ProjectWorkspace> => {
    const res = await client.patch<ProjectWorkspace>(`/workspace/${projectId}/callsheet`, updates);
    return res.data;
  },

  optimizeShootPlanAI: async (projectId: string): Promise<{
    success: boolean;
    optimizationNotes: string;
    estimatedTimeSavedMinutes: number;
    suggestedShots: Partial<ShotItem>[];
    currentWorkspace: ProjectWorkspace;
  }> => {
    const res = await client.post(`/workspace/${projectId}/ai-optimize`);
    return res.data;
  },
};
