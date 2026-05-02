import axios from 'axios';
import { Blog } from '../types/Blogs';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api/blogs';

const isBlog = (value: unknown): value is Blog => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const blog = value as Partial<Blog>;
  return typeof blog.documentId === 'string' || typeof blog.id === 'number';
};

const normalizeBlogs = (payload: unknown): Blog[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isBlog);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const nested = (payload as { data?: unknown }).data;
    if (Array.isArray(nested)) {
      return nested.filter(isBlog);
    }
  }

  return [];
};

const normalizeBlog = (payload: unknown): Blog | null => {
  if (isBlog(payload)) {
    return payload;
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const nested = (payload as { data?: unknown }).data;
    if (isBlog(nested)) {
      return nested;
    }
  }

  return null;
};

// Fetch all blogs
export const fetchBlogs = async (locale: string) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        locale: locale,
        populate: '*',
      },
    });
    return normalizeBlogs(response.data);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error;
  }
};

// Fetch a single blog by documentId
export const fetchBlogById = async (locale: string, documentId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${documentId}`, {
      params: {
        locale: locale,
        populate: '*',
      },
    });
    return normalizeBlog(response.data);
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;
  }
};
