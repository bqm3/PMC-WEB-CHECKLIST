/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  Paper,
  Chip,
} from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { X, Upload, Image as ImageIcon, Plus } from 'lucide-react';

// Types
interface YeuCauKhachHang {
  ID_YeuCau: number;
  ID_Phanhe: number;
  ID_Duan?: number;
  ID_Useryc?: number;
  TenKhachHang: string;
  Tenyeucau: string;
  NoiDung: string;
  TrangThai: number;
  isDelete: number;
  createdAt?: string;
  updatedAt?: string;
  images?: File[];
}

interface FormData {
  ID_Phanhe: string | null;
  TenKhachHang: string;
  Tenyeucau: string;
  NoiDung: string;
  images: File[];
}

interface FormErrors {
  ID_Phanhe?: string;
  TenKhachHang?: string;
  Tenyeucau?: string;
  NoiDung?: string;
  images?: string;
}

interface CreateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingRequest: YeuCauKhachHang | null;
  phanhe: any[];
  onSubmit: (formData: FormData, isEdit: boolean, requestId?: number) => Promise<boolean>;
  loading: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  ID_Phanhe: 'other',
  TenKhachHang: '',
  Tenyeucau: '',
  NoiDung: '',
  images: [],
};

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Validation function
const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.ID_Phanhe) {
    errors.ID_Phanhe = 'Vui lòng chọn phân hệ';
  }

  if (!formData.TenKhachHang.trim()) {
    errors.TenKhachHang = 'Vui lòng nhập tên khách hàng';
  }

  if (!formData.Tenyeucau.trim()) {
    errors.Tenyeucau = 'Vui lòng nhập tên yêu cầu';
  }

  if (!formData.NoiDung.trim()) {
    errors.NoiDung = 'Vui lòng nhập nội dung yêu cầu';
  }

  if (formData.images.length > MAX_IMAGES) {
    errors.images = `Chỉ được tải lên tối đa ${MAX_IMAGES} ảnh`;
  }

  return errors;
};

// File validation
const validateFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Kích thước file không được vượt quá 5MB';
  }
  return null;
};

// Image Upload Component
const ImageUpload = ({ 
  images, 
  onImagesChange, 
  error, 
  disabled 
}: {
  images: File[];
  onImagesChange: (files: File[]) => void;
  error?: string;
  disabled?: boolean;
}) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Tạo preview URLs khi images thay đổi
  useEffect(() => {
    const urls = images.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup function để giải phóng URLs khi component unmount hoặc images thay đổi
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || disabled) return;

    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else if (images.length + validFiles.length < MAX_IMAGES) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: Đã đạt giới hạn ${MAX_IMAGES} ảnh`);
      }
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      onImagesChange([...images, ...validFiles]);
    }
  }, [images, onImagesChange, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);

  const removeImage = useCallback((index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const canAddMore = images.length < MAX_IMAGES && !disabled;

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Hình ảnh đính kèm (tối đa {MAX_IMAGES} ảnh)
      </Typography>
      
      {/* Image previews */}
      {images.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Grid container spacing={1}>
            {images.map((file, index) => (
              <Grid item key={index} xs={4}>
                <Paper
                  sx={{
                    position: 'relative',
                    aspectRatio: '1',
                    overflow: 'hidden',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <img
                    src={previewUrls[index]}
                    alt={`Preview ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                      },
                    }}
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                  >
                    <X size={16} />
                  </IconButton>
                  <Chip
                    label={file.name}
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 4,
                      left: 4,
                      right: 4,
                      fontSize: '0.7rem',
                      backgroundColor: 'black',
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Upload area */}
      {canAddMore && (
        <Paper
          sx={{
            border: `2px dashed ${dragOver ? '#1976d2' : '#e0e0e0'}`,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: disabled ? 'default' : 'pointer',
            backgroundColor: dragOver ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': !disabled ? {
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            } : {},
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={disabled}
          />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Upload size={48} color={dragOver ? '#1976d2' : '#9e9e9e'} />
            <Typography variant="h6" color={dragOver ? 'primary' : 'textSecondary'}>
              {dragOver ? 'Thả ảnh vào đây' : 'Kéo thả ảnh vào đây'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              hoặc <strong>nhấp để chọn file</strong>
            </Typography>
            <Typography variant="caption" color="textSecondary">
              PNG, JPG, GIF, WebP (tối đa 5MB mỗi file)
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Còn lại: {MAX_IMAGES - images.length} ảnh
            </Typography>
          </Box>
        </Paper>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default function CreateFormDialog({
  isOpen,
  onClose,
  editingRequest,
  phanhe,
  onSubmit,
  loading,
}: CreateFormDialogProps) {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Mock phanhe data for demo
  const mockPhanhe = [
    { ID_Phanhe: 1, Phanhe: 'Hệ thống CRM', isDelete: 0 },
    { ID_Phanhe: 2, Phanhe: 'Hệ thống ERP', isDelete: 0 },
    { ID_Phanhe: 3, Phanhe: 'Website', isDelete: 0 },
    { ID_Phanhe: 4, Phanhe: 'Mobile App', isDelete: 0 },
  ];

  const activePhanHe = (phanhe?.length ? phanhe : mockPhanhe).filter((ph: any) => ph.isDelete !== 1);

  // Event handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (formErrors[name as keyof FormData]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [formErrors]
  );

  const handleSelectChange = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (formErrors[name as keyof FormData]) {
        setFormErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [formErrors]
  );

  const handleImagesChange = useCallback((newImages: File[]) => {
    setFormData((prev) => ({ ...prev, images: newImages }));
    if (formErrors.images) {
      setFormErrors((prev) => ({ ...prev, images: undefined }));
    }
  }, [formErrors.images]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = useCallback(async () => {
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const submitData: FormData = {
      ...formData,
      ID_Phanhe: formData.ID_Phanhe === 'other' ? null : formData.ID_Phanhe,
    };

    const success = await onSubmit(
      submitData,
      !!editingRequest,
      editingRequest?.ID_YeuCau
    );

    if (success) {
      handleClose();
    }
  }, [formData, editingRequest, onSubmit, handleClose]);

  // Effects
  useEffect(() => {
    if (isOpen) {
      if (editingRequest) {
        setFormData({
          ID_Phanhe: editingRequest.ID_Phanhe ? editingRequest.ID_Phanhe.toString() : 'other',
          TenKhachHang: editingRequest.TenKhachHang,
          Tenyeucau: editingRequest.Tenyeucau,
          NoiDung: editingRequest.NoiDung,
          images: editingRequest.images || [],
        });
      } else {
        setFormData(INITIAL_FORM_DATA);
      }
      setFormErrors({});
    }
  }, [isOpen, editingRequest]);

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {editingRequest ? 'Chỉnh sửa yêu cầu' : 'Tạo yêu cầu mới'}
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.ID_Phanhe} disabled={loading}>
                <InputLabel id="phanhe-select-label">Phân hệ *</InputLabel>
                <Select
                  labelId="phanhe-select-label"
                  name="ID_Phanhe"
                  value={formData.ID_Phanhe}
                  onChange={handleSelectChange}
                  label="Phân hệ *"
                >
                  <MenuItem value="other">
                    <em>Khác</em>
                  </MenuItem>
                  {activePhanHe.map((ph: any) => (
                    <MenuItem key={ph.ID_Phanhe} value={ph.ID_Phanhe.toString()}>
                      {ph.Phanhe}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.ID_Phanhe && <FormHelperText>{formErrors.ID_Phanhe}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên khách hàng"
                name="TenKhachHang"
                value={formData.TenKhachHang}
                onChange={handleInputChange}
                error={!!formErrors.TenKhachHang}
                helperText={formErrors.TenKhachHang}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tên yêu cầu"
                name="Tenyeucau"
                value={formData.Tenyeucau}
                onChange={handleInputChange}
                error={!!formErrors.Tenyeucau}
                helperText={formErrors.Tenyeucau}
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nội dung yêu cầu"
                name="NoiDung"
                multiline
                rows={4}
                value={formData.NoiDung}
                onChange={handleInputChange}
                error={!!formErrors.NoiDung}
                helperText={formErrors.NoiDung}
                required
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <ImageUpload
                images={formData.images}
                onImagesChange={handleImagesChange}
                error={formErrors.images}
                disabled={loading}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit" disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {editingRequest ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}