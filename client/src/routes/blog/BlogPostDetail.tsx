import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlogById } from '../../lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Blog } from '../../types/Blogs';
import { ImSpinner4 } from 'react-icons/im';

const BlogPostsDetails: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { documentId } = useParams<{ documentId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getBlog = async () => {
      try {
        if (!documentId) {
          throw new Error('Blog documentId is missing');
        }
        const data = await fetchBlogById(locale, documentId);
        setBlog(data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to fetch blog');
      } finally {
        setLoading(false);
      }
    };

    getBlog();
  }, [locale, documentId]);

  if (loading)
    return (
      <div className="text-center mt-8">
        {loading && (
          <div className="loading-spinner">
            <ImSpinner4 className="animate-spin text-yellow-400 text-4xl text-center" />
          </div>
        )}
      </div>
    );
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!blog) return <div className="text-center mt-8">Blog not found</div>;

  return (
    <div className="w-full space-y-8 px-2 sm:px-8 py-8 mt-8 bg-gray-900 text-white">
      <div className="max-w-5xl mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        {blog.coverImage?.[0]?.url && (
          <img src={blog.coverImage[0].url} alt={blog.title} className="w-full h-72 sm:h-80 md:h-96 object-cover" />
        )}
        <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-400">{blog.title}</h1>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ ...props }) => (
                  <img
                    {...props}
                    className="mx-auto my-4 max-w-full h-auto rounded-lg shadow-md"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                ),
                ul: ({ ...props }) => <ul {...props} className="list-disc list-inside mb-2 pl-6" />,
                ol: ({ ...props }) => <ol {...props} className="list-decimal list-inside mb-2 pl-6" />,
                li: ({ ...props }) => <li {...props} className="mb-2 pl-2" />,
                h2: ({ ...props }) => <h2 {...props} className="text-xl font-semibold mt-6 mb-4 text-blue-400" />,
                h3: ({ ...props }) => <h3 {...props} className="text-lg font-semibold mt-5 mb-3 text-blue-400" />,
                p: ({ ...props }) => <p {...props} className="mb-2 text-gray-300" />,
                a: ({ ...props }) => <a {...props} className="text-blue-400 hover:text-blue-500" />,
                blockquote: ({ ...props }) => (
                  <blockquote {...props} className="border-l-4 border-blue-400 pl-4 italic my-4" />
                ),
                code: ({ ...props }) => <code {...props} className="bg-gray-700 rounded px-2 py-1 text-sm" />,
              }}
            >
              {blog.content ?? ''}
            </ReactMarkdown>
          </div>

          <button
            onClick={() => navigate('/blog')}
            className="mt-8 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors duration-200"
          >
            Back to blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostsDetails;
