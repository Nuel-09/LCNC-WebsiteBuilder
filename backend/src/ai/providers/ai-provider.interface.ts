/**
 * Injection token used by Nest DI to resolve the active AI provider.
 * The actual provider implementation is selected in ai.module.ts.
 */
export const AI_PROVIDER = Symbol('AI_PROVIDER');

/**
 * Request-scoped identity/context passed from controller to provider.
 * Keep this minimal and non-sensitive so it can be safely logged/audited.
 */
export type AiChatContext = {
  userId: string;
  projectId?: string;
  totalPages?: number;
  activePageId?: string;
  activePageTitle?: string;
  pageSlugs?: string[];
};

/**
 * Provider contract for all AI backends.
 * Any future provider (OpenAI/Azure/local model) should implement this same shape.
 */
export interface AiProvider {
  chat(request: Request, context: AiChatContext): Promise<Response>;
}
