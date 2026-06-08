import api from "../utils/axios";

export const fetchPublishedArticles = () =>
  api.get("/articles");

export const fetchArticleBySlug = (slug) =>
  api.get(`/articles/${slug}`);

export const fetchArticleReaderCount = (slug) =>
  api.get(`/articles/${slug}/readers`);

export const trackArticleReader = (slug, sessionId) =>
  api.post(`/articles/${slug}/readers/heartbeat`, { sessionId });
