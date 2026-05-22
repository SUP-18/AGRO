import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { RiUploadCloud2Line, RiCloseLine, RiImageLine } from 'react-icons/ri';
import { useLanguage } from '../../context/LanguageContext';

export default function FileUpload({ onFileSelect, accept = { 'image/*': [] }, maxSize = 10485760 }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const { t } = useLanguage();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      onFileSelect?.(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const clearFile = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    onFileSelect?.(null);
  };

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300
        ${isDragActive
          ? 'border-primary-500 bg-primary-500/10'
          : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-800/30'
        }`}
    >
      <input {...getInputProps()} />

      {preview ? (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover" />
          <p className="text-sm text-dark-300 mt-3">{fileName}</p>
          <button
            onClick={clearFile}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
          >
            <RiCloseLine size={16} />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <motion.div animate={{ y: isDragActive ? -5 : 0 }} transition={{ duration: 0.2 }}>
            <RiUploadCloud2Line className="text-4xl text-dark-400 mx-auto" />
          </motion.div>
          <div>
            <p className="text-white font-medium">
              {isDragActive ? t('fileUpload.dropHere', 'Drop your image here') : t('fileUpload.dragAndDrop', 'Drag & drop your crop image here')}
            </p>
            <p className="text-sm text-dark-500 mt-1">{t('fileUpload.browseInfo', 'or click to browse • PNG, JPG up to 10MB')}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-dark-500">
            <RiImageLine /> {t('fileUpload.supports', 'Supports leaf, stem, and fruit images')}
          </div>
        </div>
      )}
    </div>
  );
}
