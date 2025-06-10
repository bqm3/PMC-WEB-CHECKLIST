/* eslint-disable no-nested-ternary */
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
  Card,
  CardContent,
  Chip,
  Paper,
  IconButton,
  Divider,
  Avatar,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Skeleton,
  Tooltip,
  Fade,
} from '@mui/material';
import Iconify from 'src/components/iconify';
// eslint-disable-next-line import/no-extraneous-dependencies
import { X, Upload, Image as ImageIcon, Trash2, AlertTriangle } from 'lucide-react';
import { useSnackbar } from 'src/components/snackbar';
import { getYeuCauDetail, deleteXuLy, createFeedback } from './yc_api';

// Types
interface FormData {
  MoTaCongViec: string;
  TrangThai: string;
  images: File[];
}

interface FormErrors {
  MoTaCongViec?: string;
  TrangThai?: string;
  images?: string;
}

interface DetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  user: any;
  mutate: any;
}

// Constants
const TRANG_THAI_MAP = {
  0: { label: 'Chờ xử lý', color: 'warning' as const },
  1: { label: 'Xác nhận thông tin', color: 'info' as const },
  2: { label: 'Đang xử lý', color: 'info' as const },
  3: { label: 'Hoàn thành', color: 'success' as const },
  4: { label: 'Hủy', color: 'error' as const },
  5: { label: 'Chưa hoàn thành', color: 'error' as const },
} as const;

const STATUS_OPTIONS = [
  { value: '0', label: 'Chờ xử lý' },
  { value: '1', label: 'Xác nhận thông tin' },
  { value: '2', label: 'Đang xử lý' },
  { value: '3', label: 'Hoàn thành' },
  { value: '4', label: 'Hủy' },
  { value: '5', label: 'Chưa hoàn thành' },
] as const;

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;

// Utility functions
const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.MoTaCongViec.trim()) {
    errors.MoTaCongViec = 'Vui lòng nhập mô tả công việc';
  }

  if (!formData.TrangThai) {
    errors.TrangThai = 'Vui lòng chọn trạng thái';
  }

  if (formData.images.length > MAX_IMAGES) {
    errors.images = `Chỉ được tải lên tối đa ${MAX_IMAGES} ảnh`;
  }

  return errors;
};

const validateFile = (file: File): string | null => {
  if (!ALLOWED_TYPES.includes(file.type as any)) {
    return 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Kích thước file không được vượt quá 5MB';
  }
  return null;
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString('vi-VN');
  } catch {
    return 'Không xác định';
  }
};

const getStatusColor = (status: number) =>
  TRANG_THAI_MAP[status as keyof typeof TRANG_THAI_MAP]?.color || 'default';

// Delete Confirmation Dialog Component
const DeleteConfirmDialog = React.memo(
  ({
    open,
    onClose,
    onConfirm,
    loading,
    feedbackId,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    feedbackId: number;
  }) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AlertTriangle size={24} color="#f57c00" />
        <Typography variant="h6">Xác nhận xóa phản hồi</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">Bạn có chắc chắn muốn xóa phản hồi này không?</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <Trash2 size={16} />}
        >
          {loading ? 'Đang xóa...' : 'Xóa'}
        </Button>
      </DialogActions>
    </Dialog>
  )
);

// Memoized Components
const InfoSection = React.memo(
  ({ title, children }: { title: string; children: React.ReactNode }) => (
    <>
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {title}
          </Typography>
          <Divider />
        </Box>
      </Grid>
      {children}
    </>
  )
);

const InfoItem = React.memo(
  ({
    label,
    value,
    xs = 12,
    md = 6,
  }: {
    label: string;
    value: React.ReactNode;
    xs?: number;
    md?: number;
  }) => (
    <Grid item xs={xs} md={md}>
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {value}
      </Typography>
    </Grid>
  )
);

const UserAvatar = React.memo(({ user }: { user: any }) => (
  <Box display="flex" alignItems="center" gap={2}>
    <Avatar sx={{ bgcolor: 'primary.main' }}>{user?.HoTen?.charAt(0) || 'U'}</Avatar>
    <Box>
      <Typography variant="subtitle1">{user?.HoTen || 'Không xác định'}</Typography>
      <Typography variant="body2" color="textSecondary">
        {user?.UserName || 'Không xác định'}
      </Typography>
    </Box>
  </Box>
));

// Optimized Image Upload Component
const ImageUpload = React.memo(
  ({
    images,
    onImagesChange,
    error,
    disabled,
  }: {
    images: File[];
    onImagesChange: (files: File[]) => void;
    error?: string;
    disabled?: boolean;
  }) => {
    const [dragOver, setDragOver] = useState(false);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Memoize preview URLs generation
    useEffect(() => {
      const urls = images.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);

      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    }, [images]);

    const handleFileSelect = useCallback(
      (files: FileList | null) => {
        if (!files || disabled) return;

        const validFiles: File[] = [];
        const errors: string[] = [];

        Array.from(files).forEach((file) => {
          const fileError = validateFile(file);
          if (fileError) {
            errors.push(`${file.name}: ${fileError}`);
          } else if (images.length + validFiles.length < MAX_IMAGES) {
            validFiles.push(file);
          } else {
            errors.push(`${file.name}: Đã đạt giới hạn ${MAX_IMAGES} ảnh`);
          }
        });

        if (errors.length > 0) {
          console.warn('File validation errors:', errors);
        }

        if (validFiles.length > 0) {
          onImagesChange([...images, ...validFiles]);
        }
      },
      [images, onImagesChange, disabled]
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files);
      },
      [handleFileSelect]
    );

    const handleDragOver = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      },
      [disabled]
    );

    const handleDragLeave = useCallback(() => {
      setDragOver(false);
    }, []);

    const removeImage = useCallback(
      (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
      },
      [images, onImagesChange]
    );

    const canAddMore = images.length < MAX_IMAGES && !disabled;

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Hình ảnh đính kèm (tối đa {MAX_IMAGES} ảnh)
        </Typography>

        {images.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={1}>
              {images.map((file, index) => (
                <Grid item key={`${file.name}-${index}`} xs={4}>
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
                      loading="lazy"
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
                      label={file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 4,
                        left: 4,
                        right: 4,
                        fontSize: '0.7rem',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

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
              '&:hover': !disabled
                ? {
                    borderColor: '#1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  }
                : {},
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !disabled && fileInputRef.current?.click()}
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
  }
);

// Optimized Image Gallery Component
const ImageGallery = React.memo(({ images, title }: { images: any[]; title: string }) => {
  if (!images?.length) return null;

  return (
    <>
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            {title}
          </Typography>
          <Divider />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box display="flex" gap={2} flexWrap="wrap">
          {images.map((image: any, index: number) => (
            <Box
              key={`${image.URL}-${index}`}
              component="img"
              src={image.URL}
              alt={`${title} ${index + 1}`}
              loading="lazy"
              sx={{
                width: 150,
                height: 150,
                objectFit: 'cover',
                borderRadius: 1,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
              onClick={() => window.open(image.URL, '_blank')}
            />
          ))}
        </Box>
      </Grid>
    </>
  );
});

// Enhanced Feedback Item Component
const FeedbackItem = React.memo(
  ({
    feedback,
    onDelete,
    deleting,
    isCheckRole,
  }: {
    feedback: any;
    onDelete: (id: number) => void;
    deleting: boolean;
    isCheckRole: any;
  }) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const handleDeleteClick = useCallback(() => {
      setDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
      onDelete(feedback.ID_XuLy);
      setDeleteDialogOpen(false);
    }, [feedback.ID_XuLy, onDelete]);

    const handleDeleteCancel = useCallback(() => {
      setDeleteDialogOpen(false);
    }, []);

    return (
      <>
        <Fade in timeout={300}>
          <Paper
            sx={{
              position: 'relative',
              p: 2,
              opacity: deleting ? 0.5 : 1,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Delete Button */}
            {isCheckRole && (
              <Tooltip title="Xóa phản hồi" placement="top">
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'error.main',
                    backgroundColor: 'rgba(211, 47, 47, 0.04)',
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.12)',
                    },
                  }}
                  onClick={handleDeleteClick}
                  disabled={deleting}
                >
                  {deleting ? <CircularProgress size={16} color="error" /> : <Trash2 size={16} />}
                </IconButton>
              </Tooltip>
            )}

            <Box sx={{ mb: 2, pr: 5 }}>
              {' '}
              {/* Add padding right for delete button */}
              <Box display="flex" alignItems="center" gap={2} sx={{ mb: 1 }}>
                <UserAvatar user={feedback.ent_user} />
                <Box sx={{ ml: 'auto', mr: 4 }}>
                  {' '}
                  {/* Add margin right for delete button */}
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(feedback.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={
                  STATUS_OPTIONS.find((opt) => opt.value === feedback.TrangThai.toString())?.label
                }
                color={getStatusColor(feedback.TrangThai)}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {feedback.MoTaCongViec}
              </Typography>
            </Box>

            {feedback.hinhanh_xuly?.length > 0 && (
              <Box display="flex" gap={1} flexWrap="wrap">
                {feedback.hinhanh_xuly.map((image: any, index: number) => (
                  <Box
                    key={`${image.URL}-${index}`}
                    component="img"
                    src={image.URL}
                    alt={`Phản hồi ${index + 1}`}
                    loading="lazy"
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'opacity 0.2s',
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                    onClick={() => window.open(image.URL, '_blank')}
                  />
                ))}
              </Box>
            )}
          </Paper>
        </Fade>

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleting}
          feedbackId={feedback.ID_XuLy}
        />
      </>
    );
  }
);

// Optimized Feedback List Component
const FeedbackList = React.memo(
  ({
    feedbacks,
    onDeleteFeedback,
    deletingFeedbacks,
    isCheckRole,
  }: {
    feedbacks: any[];
    onDeleteFeedback: (id: number) => void;
    deletingFeedbacks: Set<number>;
    isCheckRole: any;
  }) => {
    if (!feedbacks?.length) {
      return (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 3 }}>
          Chưa có phản hồi nào
        </Typography>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {feedbacks.map((feedback: any) => (
          <FeedbackItem
            key={feedback.ID_XuLy}
            feedback={feedback}
            onDelete={onDeleteFeedback}
            deleting={deletingFeedbacks.has(feedback.ID_XuLy)}
            isCheckRole={isCheckRole}
          />
        ))}
      </Box>
    );
  }
);

// Main Component
export default function DetailDialog({
  isOpen,
  onClose,
  requestId,
  user,
  mutate,
}: DetailDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [request, setRequest] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [deletingFeedbacks, setDeletingFeedbacks] = useState<Set<number>>(new Set());
  const isCheckRole = [0, 1, 4, 5, 10].includes(user?.ent_chucvu?.Role);
  const [formData, setFormData] = useState<FormData>({
    MoTaCongViec: '',
    TrangThai: '0',
    images: [],
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Fetch request details when dialog opens
  useEffect(() => {
    const fetchRequestDetail = async () => {
      if (isOpen && requestId) {
        setLoadingDetail(true);
        try {
          const response = await getYeuCauDetail(requestId);
          if (response) {
            setRequest(response.data);
            setFormData((prev) => ({
              ...prev,
              TrangThai: response.data.TrangThai?.toString() || '0',
            }));
          }
        } catch (err) {
          enqueueSnackbar('Không thể lấy thông tin chi tiết. Vui lòng thử lại.', {
            variant: 'error',
          });
          console.error('Error fetching request details:', err);
        } finally {
          setLoadingDetail(false);
        }
      }
    };

    fetchRequestDetail();
  }, [isOpen, requestId, enqueueSnackbar]);

  // Memoized values
  const statusInfo = useMemo(() => {
    if (!request) return null;
    return TRANG_THAI_MAP[request.TrangThai as keyof typeof TRANG_THAI_MAP];
  }, [request]);

  const canSubmit = useMemo(
    () => formData.MoTaCongViec.trim() && formData.TrangThai,
    [formData.MoTaCongViec, formData.TrangThai]
  );

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

  const handleImagesChange = useCallback(
    (newImages: File[]) => {
      setFormData((prev) => ({ ...prev, images: newImages }));
      if (formErrors.images) {
        setFormErrors((prev) => ({ ...prev, images: undefined }));
      }
    },
    [formErrors.images]
  );

  const handleSubmit = useCallback(async () => {
    if (!request?.ID_YeuCau) return;

    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoadingFeedback(true);
    try {
      const response = await createFeedback(formData, request.ID_YeuCau);
      if (response) {
        // Refresh request data after successful submission
        const updatedResponse = await getYeuCauDetail(requestId);
        if (updatedResponse) {
          setRequest(updatedResponse.data);
        }
        enqueueSnackbar('Gửi phản hồi thành công', { variant: 'success' });
        setFormData({ MoTaCongViec: '', TrangThai: '0', images: [] });
        setFormErrors({});
      }
    } catch (err) {
      enqueueSnackbar('Không thể gửi phản hồi. Vui lòng thử lại.', { variant: 'error' });
      console.error('Error sending feedback:', err);
    } finally {
      mutate();
      setLoadingFeedback(false);
    }
  }, [formData, request?.ID_YeuCau, requestId, enqueueSnackbar, mutate]);

  const handleDeleteFeedback = useCallback(
    async (feedbackId: number) => {
      try {
        const response = await deleteXuLy(feedbackId);
        if (response) {
          // Refresh request data after successful deletion
          const updatedResponse = await getYeuCauDetail(requestId);
          if (updatedResponse) {
            setRequest(updatedResponse.data);
          }
          enqueueSnackbar('Xóa phản hồi thành công', { variant: 'success' });
        }
        return true;
      } catch (err) {
        enqueueSnackbar('Không thể xóa phản hồi. Vui lòng thử lại.', { variant: 'error' });
        console.error('Error deleting feedback:', err);
        return false;
      }
    },
    [requestId, enqueueSnackbar]
  );

  const handleClose = useCallback(() => {
    setFormData({ MoTaCongViec: '', TrangThai: '0', images: [] });
    setFormErrors({});
    onClose();
  }, [onClose]);

  if (!request && loadingDetail) {
    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            height: '90vh',
            width: '60vw',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (!request) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          height: '90vh',
          width: '60vw',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <DialogTitle sx={{ flexShrink: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Chi tiết yêu cầu #{request.ID_YeuCau}</Typography>
          {/* <IconButton onClick={handleClose} size="small">
            <Iconify icon="eva:close-fill" />
          </IconButton> */}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <InfoSection title="Thông tin cơ bản">
                <InfoItem label="Tên khách hàng" value={request.TenKhachHang || 'Không xác định'} />
                <InfoItem label="Tên yêu cầu" value={request.Tenyeucau || 'Không xác định'} />
                <InfoItem label="Dự án" value={request?.ent_duan?.Duan || 'Không có'} />
                <InfoItem label="Phân hệ" value={request.ent_phanhe?.Phanhe || 'Khác'} />
              </InfoSection>

              {/* Status and Time */}
              <InfoSection title="Trạng thái và thời gian">
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Trạng thái
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={statusInfo?.label || 'Không xác định'}
                      color={statusInfo?.color || 'default'}
                    />
                  </Box>
                </Grid>
                <InfoItem label="Thời gian tạo" value={formatDate(request.createdAt)} md={6} />
              </InfoSection>

              {/* Request Content */}
              <InfoSection title="Nội dung yêu cầu">
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                    <Typography variant="body1">
                      {request.NoiDung || 'Không có nội dung'}
                    </Typography>
                  </Paper>
                </Grid>
              </InfoSection>

              {/* Request Images */}
              <ImageGallery images={request.hinhanh_yeucau} title="Hình ảnh đính kèm" />

              {/* Feedback History */}
              <InfoSection title="Lịch sử phản hồi">
                <Grid item xs={12}>
                  <FeedbackList
                    feedbacks={request.lb_xuly}
                    onDeleteFeedback={handleDeleteFeedback}
                    deletingFeedbacks={deletingFeedbacks}
                    isCheckRole={isCheckRole}
                  />
                </Grid>
              </InfoSection>

              {/* New Feedback Form */}
              {isCheckRole && `${request.TrangThai}` !== `3` && (
                <InfoSection title="Thêm phản hồi mới">
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!formErrors.TrangThai}>
                      <InputLabel>Trạng thái *</InputLabel>
                      <Select
                        name="TrangThai"
                        value={formData.TrangThai}
                        onChange={handleSelectChange}
                        label="Trạng thái *"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.TrangThai && (
                        <FormHelperText>{formErrors.TrangThai}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Mô tả công việc"
                      name="MoTaCongViec"
                      multiline
                      rows={4}
                      value={formData.MoTaCongViec}
                      onChange={handleInputChange}
                      error={!!formErrors.MoTaCongViec}
                      helperText={formErrors.MoTaCongViec}
                      required
                      placeholder="Nhập mô tả chi tiết về công việc đã thực hiện..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <ImageUpload
                      images={formData.images}
                      onImagesChange={handleImagesChange}
                      error={formErrors.images}
                    />
                  </Grid>
                </InfoSection>
              )}
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, flexShrink: 0 }}>
        <Button onClick={handleClose} color="inherit">
          Đóng
        </Button>
        {isCheckRole && `${request.TrangThai}` !== `3` && (
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!canSubmit || loadingFeedback}
            startIcon={loadingFeedback ? <CircularProgress size={20} /> : null}
          >
            {loadingFeedback ? 'Đang gửi...' : 'Gửi phản hồi'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
