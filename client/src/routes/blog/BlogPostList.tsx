import React, { useEffect, useState } from 'react';
import { fetchBlogs } from '../../lib/api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Blog } from '../../types/Blogs';
import { ImSpinner4 } from 'react-icons/im';

const BlogPosts: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs(locale);
        setBlogs(data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, [locale]);

  if (loading)
    return (
      <div className="text-center mt-8">
        {loading && (
          <div className="loading-spinner">
            {/* spinner */}
            <ImSpinner4 className="animate-spin text-yellow-400 text-4xl text-center" />
          </div>
        )}
      </div>
    );
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

  return (
    <div className="w-full space-y-8 px-4 sm:px-8 py-8 mt-8 bg-gray-900 text-white">
      <h1 className="text-center text-2xl sm:text-3xl font-bold mb-2 text-blue-400">Blogs</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center text-gray-300">No blog posts available.</div>
        )}
        {blogs.map((blog) => (
          <div key={blog.documentId} className="bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col">
            {blog.coverImage?.[0]?.url && (
              <img src={blog.coverImage[0].url} alt={blog.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between mb-4">
                <p className="text-sm">{blog.author}</p>
                <p className="text-sm">{blog.date}</p>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-blue-400">{blog.title}</h3>
              <p className="text-sm text-gray-300 mb-4 flex-grow">{blog.description}</p>
              <Link to={`/blog/${blog.documentId}`} className="text-sm text-blue-400 hover:text-blue-500 self-start">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
