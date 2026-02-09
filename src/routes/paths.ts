export const PATHS = {
  home: "/",
  casesList: "/",
  createCase: "/cases/new",
  caseDetail: (id: string) => `/cases/${id}`,
} as const;
