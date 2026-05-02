import { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { ContactData } from '../types/Contact';
import ReCAPTCHA from 'react-google-recaptcha';

const API_URL = import.meta.env.VITE_API_BASE_URL;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  // Add a ref for the ReCAPTCHA component
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
    if (value) {
      setCaptchaError(null);
    }
  };

  const handleCaptchaExpired = () => {
    setCaptchaValue(null);
    setCaptchaError('Captcha expired. Please verify again.');
  };

  const handleCaptchaError = () => {
    setCaptchaValue(null);
    setCaptchaError('Captcha failed to load. Please refresh and try again.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!RECAPTCHA_SITE_KEY) {
      Swal.fire({
        title: 'Configuration Error',
        text: 'reCAPTCHA site key is missing. Please set VITE_RECAPTCHA_SITE_KEY.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    if (!captchaValue) {
      setCaptchaError('Please complete the captcha before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        data: {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          recaptchaToken: captchaValue,
        },
      };

      const response = await axios.post(`${API_URL}/api/contacts`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'X-Captcha-Token': captchaValue,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
        // Clear the captcha after successful submission
        setCaptchaValue(null);
        setCaptchaError(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        Swal.fire({
          title: 'Success!',
          text: "Thank you for your message! We'll get back to you soon.",
          icon: 'success',
          confirmButtonText: '<span style="padding: 0 20px;">OK</span>',
          confirmButtonColor: '#3b82f6',
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'There was an error submitting your form. Please try again.',
          icon: 'error',
          confirmButtonText: '<span style="padding: 0 20px;">OK</span>',
          confirmButtonColor: '#3b82f6',
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Detailed error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      }
      Swal.fire({
        title: 'Error!',
        text: 'There was an error submitting your form. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 lg:p-10">
        <h2 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-6">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm sm:text-base font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm sm:text-base font-medium text-gray-300">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm sm:text-base font-medium text-gray-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
            onErrored={handleCaptchaError}
            className="my-4"
          />
          {captchaError && <div className="text-red-400 text-sm">{captchaError}</div>}

          <button
            type="submit"
            disabled={isSubmitting || !RECAPTCHA_SITE_KEY}
            className={`w-full py-3 px-6 rounded-md text-white font-medium ${
              isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
