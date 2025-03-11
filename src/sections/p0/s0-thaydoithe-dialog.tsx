import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';

type CardManagementFormProps = {
  open: boolean;
  getSoThe: () => void;
  onClose: () => void;
  onSubmit: (data: any) => void;
  currentValues?: {
    Sotheotodk: any;
    Sothexemaydk: any;
  };
  setIsLoading: any;
};

const STORAGE_KEY = 'accessToken';

export default function CardManagementDialog({
  open,
  getSoThe,
  onClose,
  onSubmit,
  currentValues,
  setIsLoading,
}: CardManagementFormProps) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const accessToken = localStorage.getItem(STORAGE_KEY);

  const [formValues, setFormValues] = useState<any>(null);

  useEffect(() => {
    if (currentValues) {
      setFormValues({
        Sotheotodk: currentValues?.Sotheotodk,
        Sothexemaydk: currentValues?.Sothexemaydk,
        sltheoto: 0,
        slthexemay: 0,
        lydothaydoi: '',
      });
    }
  }, [currentValues]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Allow only numbers and empty string
    if (value === '' || /^[0-9]+$/.test(value)) {
      setFormValues({
        ...formValues,
        [name]: value === '' ? 0 : parseInt(value, 10),
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setIsLoading(true);
    try {
      // Prepare data for API call
      const dataToSubmit = {
        sltheoto: formValues?.sltheoto === 0 ? formValues.Sotheotodk : formValues?.sltheoto,
        slthexemay: formValues?.slthexemay === 0 ? formValues.Sothexemaydk : formValues?.slthexemay,
        lydothaydoi: formValues?.lydothaydoi,
      };

      const dataOld =  {
        sotheotodk: formValues.Sotheotodk,
        sothexemaydk: formValues.Sothexemaydk
      }
      
      if (dataToSubmit.lydothaydoi.trim() === '') {
        throw new Error(`Vui lòng nhập lý do`);
      }
      
      // Here you would typically call your API to update the values
      await axios.put(`https://checklist.pmcweb.vn/be/api/v2/s0-thaydoithe/update`, {data: dataToSubmit, dataOld }, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // For now, just pass the data to the parent component
      onSubmit(dataToSubmit);
      setFormValues(null);
      getSoThe();
      
      enqueueSnackbar({
        variant: 'success',
        autoHideDuration: 4000,
        message: 'Cập nhật số lượng thẻ thành công!',
      });
      
      onClose();
    } catch (error) {
      console.log(error);
      let errorMessage = 'Lỗi cập nhật số lượng thẻ';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      enqueueSnackbar({
        variant: 'error',
        autoHideDuration: 4000,
        message: errorMessage,
      });
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: '#21409A', fontWeight: 'bold' }}>
        Thay đổi số lượng thẻ xe
      </DialogTitle>

      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Số lượng thẻ ô tô đã bàn giao</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={formValues?.Sotheotodk}
                disabled
                size="small"
                margin="dense"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1">Số lượng thẻ xe máy đã bàn giao</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={formValues?.Sothexemaydk}
                disabled
                size="small"
                margin="dense"
              />
            </Grid>

            <>
              <Grid item xs={6}>
                <TextField
                  name="sltheoto"
                  label="Nhập số lượng thẻ ô tô"
                  value={formValues?.sltheoto}
                  onChange={handleNumberChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="slthexemay"
                  label="Nhập số lượng thẻ xe máy "
                  value={formValues?.slthexemay}
                  onChange={handleNumberChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Lý do</Typography>
                <TextField
                  name="lydothaydoi"
                  fullWidth
                  multiline
                  rows={3}
                  value={formValues?.lydothaydoi}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{ backgroundColor: '#21409A' }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
