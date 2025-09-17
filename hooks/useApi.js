'use client';

import { useState, useCallback } from 'react';
import { legislationAPI, newsAPI, reviewAPI } from '../lib/api';
import { Legislation, News, Review } from '../models/index';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Функции для преобразования данных API в экземпляры моделей
  const transformLegislationData = (data) => {
    console.log("📥 Данные от API (legis):", data);
    if (Array.isArray(data)) {
      return data.map(item => new Legislation(item));
    }
    return new Legislation(data);
  };

  const transformNewsData = (data) => {
    console.log("📥 Данные от API (news):", data);
    if (Array.isArray(data)) {
      return data.map(item => new News(item));
    }
    return new News(data);
  };

  const transformReviewData = (data) => {
    console.log("📥 Данные от API (reviews):", data);
    if (Array.isArray(data)) {
      return data.map(item => new Review(item));
    }
    return new Review(data);
  };

  return {
    loading,
    error,
    clearError: () => setError(null),
    legislation: {
      create: useCallback((formData) => makeRequest(legislationAPI.create, formData), [makeRequest]),
      getAll: useCallback(async () => {
        const data = await makeRequest(legislationAPI.getAll);
        if (Array.isArray(data.data)) {
          return data.data.map(item => new Legislation(item));
        }
        return [];
      }, [makeRequest]),
      getById: useCallback(async (id) => {
        const data = await makeRequest(legislationAPI.getById, id);
        return new Legislation(data);
      }, [makeRequest]),
      update: useCallback((id, formData) => makeRequest(legislationAPI.update, id, formData), [makeRequest]),
      delete: useCallback((id) => makeRequest(legislationAPI.delete, id), [makeRequest]),
    },
    news: {
    create: useCallback((data) => makeRequest(newsAPI.create, data), [makeRequest]),
    getAll: useCallback(async () => {
      const response = await makeRequest(newsAPI.getAll);
      const data = response.data; // извлекаем массив из поля data
      if (Array.isArray(data)) {
        return data.map(item => new News(item));
      }
      return [];
    }, [makeRequest]),
    getById: useCallback(async (id) => {
      const data = await makeRequest(newsAPI.getById, id);
      return transformNewsData(data);
    }, [makeRequest]),
    getByLink: useCallback(async (link) => {
      const data = await makeRequest(newsAPI.getByLink, link);
      return new News(data);
    }, [makeRequest]),
    update: useCallback((id, data) => makeRequest(newsAPI.update, id, data), [makeRequest]),
    delete: useCallback((id) => makeRequest(newsAPI.delete, id), [makeRequest]),
    publish: useCallback((id) => makeRequest(newsAPI.publish, id), [makeRequest]),
    unpublish: useCallback((id) => makeRequest(newsAPI.unpublish, id), [makeRequest]),
    uploadImage: useCallback((file) => makeRequest(newsAPI.uploadImage, file), [makeRequest]),
  },
    review: {
      create: useCallback((data) => makeRequest(reviewAPI.create, data), [makeRequest]),
      getAll: useCallback(async () => {
        const response = await makeRequest(reviewAPI.getAll);
        const data = response.data; // извлекаем массив из поля data
        if (Array.isArray(data)) {
          return data.map(item => new Review(item));
        }
        return [];
      }, [makeRequest]),
      getById: useCallback(async (id) => {
        const data = await makeRequest(reviewAPI.getById, id);
        return transformReviewData(data);
      }, [makeRequest]),
      update: useCallback((id, data) => makeRequest(reviewAPI.update, id, data), [makeRequest]),
      delete: useCallback((id) => makeRequest(reviewAPI.delete, id), [makeRequest]),
      uploadFile: useCallback((file) => makeRequest(reviewAPI.uploadFile, file), [makeRequest]),
    },
  };
}