'use client';

import { useState, useEffect } from 'react';
import AdminAuthWrapper from '@/components/AdminAuthWrapper';
import { getTranslations, updateTranslations } from '@/lib/fetch';

interface TranslationValue {
  [key: string]: string | TranslationValue;
}

interface TranslationData {
  locale: string;
  translations: TranslationValue;
}

export default function AdminSettingsPage() {
  const [currentLocale, setCurrentLocale] = useState('ca');
  const [translations, setTranslations] = useState<TranslationValue>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadTranslations();
  }, [currentLocale]);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const data: TranslationData = await getTranslations(currentLocale);
      setTranslations(data.translations);
    } catch (error) {
      console.error('Error loading translations:', error);
      setMessage({ type: 'error', text: 'Error cargando las traducciones' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateTranslations(currentLocale, translations);
      setMessage({ type: 'success', text: 'Traducciones guardadas correctamente' });
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving translations:', error);
      setMessage({ type: 'error', text: 'Error guardando las traducciones' });
    } finally {
      setSaving(false);
    }
  };

  const updateNestedValue = (path: string, value: string) => {
    const keys = path.split('.');
    const newTranslations = { ...translations };
    
    let current: any = newTranslations;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setTranslations(newTranslations);
  };

  const getNestedValue = (obj: any, path: string): string => {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return '';
      }
    }
    return typeof current === 'string' ? current : '';
  };

  const renderSection = (sectionKey: string, sectionData: any, basePath = '') => {
    const currentPath = basePath ? `${basePath}.${sectionKey}` : sectionKey;
    
    if (typeof sectionData === 'string') {
      return (
        <div key={currentPath} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {currentPath}
          </label>
          <textarea
            value={sectionData}
            onChange={(e) => updateNestedValue(currentPath, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            rows={sectionData.length > 50 ? 3 : 1}
          />
        </div>
      );
    }
    
    if (typeof sectionData === 'object' && sectionData !== null) {
      return (
        <div key={currentPath} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize border-b pb-2">
            📝 {sectionKey.replace('_', ' ')}
          </h3>
          <div className="pl-4 space-y-2">
            {Object.entries(sectionData).map(([key, value]) =>
              renderSection(key, value, currentPath)
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <AdminAuthWrapper>
        <div className="min-h-screen bg-gray-50 pt-[76px]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
              <div className="h-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className="min-h-screen bg-gray-50 pt-[76px]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">⚙️ Configuración de Textos</h1>
            <p className="mt-2 text-gray-600">
              Edita los textos de la aplicación. Los cambios se aplicarán inmediatamente.
            </p>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma a editar:
            </label>
            <select
              value={currentLocale}
              onChange={(e) => setCurrentLocale(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ca">🏴‍☠️ Català</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Translations Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Editar traducciones - {currentLocale.toUpperCase()}
              </h2>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Guardando...
                  </>
                ) : (
                  <>
                    💾 Guardar Cambios
                  </>
                )}
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(translations).map(([sectionKey, sectionData]) =>
                renderSection(sectionKey, sectionData)
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Consejos:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Los cambios se guardan en los archivos de traducción y se aplican inmediatamente</li>
              <li>• Puedes usar emojis y caracteres especiales</li>
              <li>• Para textos largos, el campo se expandirá automáticamente</li>
              <li>• Cambia el idioma arriba para editar las traducciones en inglés o catalán</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminAuthWrapper>
  );
}