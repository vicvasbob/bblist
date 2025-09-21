'use client';

import { createProduct, parseProduct } from '@/lib/fetch';
import { useState } from 'react';

interface AddProductProps {
  onClose: () => void;
  onProductAdded: () => void;
}

export default function AddProduct({ onClose, onProductAdded }: AddProductProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'parse'>('manual');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    image_url: '',
    active: true
  });
  const [parseUrl, setParseUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
  const { data } = await createProduct(formData);

      if (data) {
        onProductAdded();
        onClose();
      } else {
        alert('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const onParseProduct = async (url: string) => {
    if (!url.trim()) {
      setErrors({ parseUrl: 'Please enter a URL' });
      return;
    }

    if (!isValidUrl(url)) {
      setErrors({ parseUrl: 'Please enter a valid URL' });
      return;
    }

    setIsParsing(true);
    setErrors({});
    
    try {
      const data = await parseProduct(url);
      console.log(data);
      setFormData(prev => ({ 
        ...prev, 
        name: data.name || '', 
        description: data.description || '', 
        image_url: data.image_url || '',
        url: url
      }));
      setActiveTab('manual');
    } catch (error) {
      console.error('Error parsing product:', error);
      setErrors({ parseUrl: 'Failed to parse product from URL' });
    } finally {
      setIsParsing(false);
    }
  }

  const handleParseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onParseProduct(parseUrl);
  };

  return (
    <div className="fixed inset-0 bg-fuchsia-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Add New Product
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-4">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'manual'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manual Entry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('parse')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'parse'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Parse from URL
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'manual' ? (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={3}
              placeholder="Enter product description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.url ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/product"
            />
            {errors.url && <p className="text-red-500 text-sm mt-1">{errors.url}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => handleInputChange('image_url', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.image_url ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
            />
            {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>}
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => handleInputChange('active', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Active (visible to users)
              </span>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-md hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Creating...
                </>
              ) : (
                'Create Product'
              )}
            </button>
            </div>
          </form>
        ) : (
          <div className="px-6 py-4 space-y-4">
            <form onSubmit={handleParseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product URL *
                </label>
                <input
                  type="url"
                  value={parseUrl}
                  onChange={(e) => {
                    setParseUrl(e.target.value);
                    if (errors.parseUrl) {
                      setErrors(prev => ({ ...prev, parseUrl: '' }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                    errors.parseUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/product"
                />
                {errors.parseUrl && <p className="text-red-500 text-sm mt-1">{errors.parseUrl}</p>}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isParsing}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isParsing}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {isParsing ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Parsing...
                    </>
                  ) : (
                    'Parse Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
