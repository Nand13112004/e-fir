import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useAuth } from '../store/auth';

export default function EvidenceTable({ evidence = [], complaintId, onEvidenceUpdate }) {
  const { t } = useTranslation();
  const { token, user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files || []));
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || !complaintId) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('evidence', file);
      });
      formData.append('complaintId', complaintId);

      await axios.post('/api/complaints/evidence', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSelectedFiles([]);
      setShowUpload(false);
      if (onEvidenceUpdate) onEvidenceUpdate();
    } catch (error) {
      console.error('Failed to upload evidence:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const canUpload = (user?.role === 'POLICE' || user?.role === 'JUDGE') && complaintId;

  if (!evidence || evidence.length === 0) {
    return (
      <div className="text-center py-8 text-govGray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-govGray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm">{t('noEvidenceUploaded')}</p>
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'photo':
        return (
          <svg className="w-5 h-5 text-govBlue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-5 h-5 text-govOrange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'document':
        return (
          <svg className="w-5 h-5 text-govGreen-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'audio':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-govGray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div>
      {canUpload && (
        <div className="mb-4 flex items-center justify-between">
          {!showUpload ? (
            <button
              onClick={() => setShowUpload(true)}
              className="btn-primary text-sm"
            >
              <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('uploadEvidence') || 'Upload Evidence'}
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="form-input flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-govBlue-50 file:text-govBlue-700 hover:file:bg-govBlue-100"
              />
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFiles.length}
                className="btn-primary"
              >
                {uploading ? t('uploading') || 'Uploading...' : t('upload') || 'Upload'}
              </button>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setSelectedFiles([]);
                }}
                className="btn-outline"
              >
                {t('cancel') || 'Cancel'}
              </button>
            </div>
          )}
        </div>
      )}
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-govGray">
            <tr>
              <th className="text-left p-2">{t('type')}</th>
              <th className="text-left p-2">{t('title')}</th>
              <th className="text-left p-2">{t('description')}</th>
              <th className="text-left p-2">Size</th>
              <th className="text-left p-2">{t('status')}</th>
              <th className="text-left p-2">{t('view')}</th>
            </tr>
          </thead>
        <tbody>
          {evidence.map((item, idx) => (
            <tr key={`${item.storedName || item.url}-${idx}`} className="border-t hover:bg-gray-50">
              <td className="p-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(item.type)}
                  <span className="capitalize">{item.type || 'Unknown'}</span>
                </div>
              </td>
              <td className="p-2">{item.originalName || item.storedName || 'Untitled'}</td>
              <td className="p-2 text-gray-500">{item.mimeType || '-'}</td>
              <td className="p-2 text-gray-500">{formatFileSize(item.size)}</td>
              <td className="p-2">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-semibold">
                  {t('approved')}
                </span>
              </td>
              <td className="p-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-govBlue-600 hover:text-govBlue-800 underline inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {t('view')}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

