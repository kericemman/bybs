import api from "../utils/axios";

export const fetchPublishedArticles = () =>
  api.get("/articles");

export const fetchArticleBySlug = (slug) =>
  api.get(`/articles/${slug}`);
