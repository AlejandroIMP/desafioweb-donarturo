import React, { useState, useRef, useCallback, memo } from 'react';
import {
  Box,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Image as ImageIcon
} from '@mui/icons-material';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  currentImageUrl?: string;
  label?: string;
  maxSize?: number; // en MB
  acceptedTypes?: string[];
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImageUrl,
  label = "Imagen del Producto",
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  disabled = false
}) => {
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Optimizar con useCallback para prevenir recreaciones innecesarias
  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Reset error
    setError(null);

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setError(`Tipo de archivo no válido. Tipos permitidos: ${acceptedTypes.join(', ')}`);
      return;
    }

    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSize) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${maxSize}MB`);
      return;
    }

    setIsLoading(true);

    // Create preview - optimize with createObjectURL for better performance
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsLoading(false);
    onImageSelect(file);

    // Cleanup the created URL when done
    return () => URL.revokeObjectURL(objectUrl);
  }, [acceptedTypes, maxSize, onImageSelect]);

  const handleRemoveImage = useCallback(() => {
    setPreview(null);
    setError(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onImageSelect]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>
      
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          textAlign: 'center',
          border: error ? '2px solid #f44336' : '2px dashed #ccc',
          borderRadius: 2,
          backgroundColor: disabled ? '#f5f5f5' : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'border-color 0.3s ease',
          '&:hover': {
            borderColor: disabled ? '#ccc' : '#1976d2',
          }
        }}
        onClick={!disabled && !preview ? handleButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled}
          aria-label={`Subir ${label.toLowerCase()}`}
          aria-describedby="file-upload-description"
        />
        <span id="file-upload-description" hidden>
          {`Seleccione ${label.toLowerCase()}. Formatos permitidos: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}. Tamaño máximo: ${maxSize}MB`}
        </span>

        {isLoading ? (
          <Box>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Procesando imagen...
            </Typography>
          </Box>
        ) : preview ? (
          <Box>
            <Avatar
              src={preview}
              sx={{
                width: 150,
                height: 150,
                mx: 'auto',
                mb: 2,
                border: '2px solid #e0e0e0'
              }}
              variant="rounded"
            >
              <ImageIcon sx={{ fontSize: 60 }} />
            </Avatar>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={handleButtonClick}
                disabled={disabled}
                size="small"
                aria-label="Cambiar imagen"
              >
                Cambiar imagen
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleRemoveImage}
                disabled={disabled}
                size="small"
                aria-label="Eliminar imagen"
              >
                Eliminar
              </Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <CloudUploadIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {disabled ? 'Subida de imagen deshabilitada' : 'Seleccionar imagen'}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {disabled 
                ? 'La funcionalidad de subida está deshabilitada'
                : `Arrastra una imagen aquí o haz clic para seleccionar`
              }
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Formatos: {acceptedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()} • 
              Tamaño máximo: {maxSize}MB
            </Typography>
            {!disabled && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleButtonClick}
                >
                  Seleccionar archivo
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

// Exportar como componente memoizado para evitar renderizados innecesarios
export default memo(ImageUpload);
