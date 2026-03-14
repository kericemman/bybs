import api from "../utils/axios";

/**
 * GET ALL ARTICLES
 */
export const fetchArticles = () => {
  return api.get("/admin/articles");
};

/**
 * GET SINGLE ARTICLE
 */
export const fetchArticle = (id) => {
  return api.get(`/admin/articles/${id}`);
};

/**
 * CREATE ARTICLE
 */
export const createArticle = (formData) => {
  return api.post("/admin/articles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * UPDATE ARTICLE
 */
export const updateArticle = (id, formData) => {
  return api.put(`/admin/articles/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * DELETE ARTICLE
 */
export const deleteArticle = (id) => {
  return api.delete(`/admin/articles/${id}`);
};


