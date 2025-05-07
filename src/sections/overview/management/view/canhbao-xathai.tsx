import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import axios from 'axios';
import * as XLSX from 'xlsx';

interface CanhBaoData {
  TenDuAn: string;
  NgayGhiNhan: string;
  XaThai: number;
  ChiSoGiayPhep: number;
  ChiSoTrungBinh: number;
  CanhBao: string;
  IDCanhbao: number;
}

interface Duan {
  Duan: string;
  Tenchinhanh: string;
  Loaihinh: string;
}

const CanhBaoXaThaiDialog: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment().subtract(1, 'day'));
  const [data, setData] = useState<CanhBaoData[]>([]);
  const [data2, setData2] = useState<Duan[]>([]);
  const [xaThai, setXaThai] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${process.env.REACT_APP_HOST_API}/api/v2/hsse/canhbao-xathai`, {
        params: {
          Ngay: selectedDate.format('YYYY/MM/DD'),
        },
      });

      // Sắp xếp dữ liệu theo tên dự án
      const sortedData = response.data.sort((a: CanhBaoData, b: CanhBaoData) =>
        a.TenDuAn.localeCompare(b.TenDuAn, 'vi')
      );
      setData(sortedData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchData2 = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${process.env.REACT_APP_HOST_API}/api/v2/hsse/duan-khongnhap-xathai`, {
        params: {
          p_ngay: selectedDate.format('YYYY/MM/DD'),
        },
      });


      const sortedData = response.data.sort((a: Duan, b: Duan) => {
        const duAnCompare = a.Duan.localeCompare(b.Duan, 'vi');
        if (duAnCompare !== 0) return duAnCompare;

        const chiNhanhCompare = a.Tenchinhanh.localeCompare(b.Tenchinhanh, 'vi');
        if (chiNhanhCompare !== 0) return chiNhanhCompare;

        return a.Loaihinh.localeCompare(b.Loaihinh, 'vi');
      });


      setData2(sortedData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
      fetchData2();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedDate]);

  const getCanhBaoColor = (idCanhbao: number) => {
    switch (idCanhbao) {
      case 1:
        return '#000000'; // Màu cam cho cảnh báo dưới mức
      case 2:
        return '#f44336'; // Màu đỏ cho cảnh báo vượt mức
      default:
        return '#000000';
    }
  };

  const handleDateChange = (newValue: moment.Moment | null) => {
    if (newValue && newValue.isSameOrBefore(moment(), 'day')) {
      setSelectedDate(newValue);
    }
  };

  const handleFormChange = () => {
    setXaThai(!xaThai);
  };

  // Chức năng export to Excel
  const exportToExcel = () => {
    if (xaThai) {
      // Export data for xả thải
      const excelData = data.map((row, index) => ({
        STT: index + 1,
        'Tên dự án': row.TenDuAn,
        'Ngày ghi nhận': moment(row.NgayGhiNhan).format('DD/MM/YYYY'),
        'Xả thải': row.XaThai,
        'Chỉ số giấy phép': row.ChiSoGiayPhep,
        'Chỉ số trung bình': row.ChiSoTrungBinh,
        'Cảnh báo': row.CanhBao,
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Cảnh báo xả thải');

      const colWidths = [
        { wch: 5 }, // STT
        { wch: 30 }, // Tên dự án
        { wch: 15 }, // Ngày ghi nhận
        { wch: 10 }, // Xả thải
        { wch: 20 }, // Chỉ số giấy phép
        { wch: 20 }, // Chỉ số trung bình
        { wch: 25 }, // Cảnh báo
      ];
      worksheet['!cols'] = colWidths;

      const fileName = `Canh_Bao_Xa_Thai_${selectedDate.format('DD-MM-YYYY')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } else {
      // Export data for dự án không nhập xả thải
      const excelData = data2.map((row, index) => ({
        STT: index + 1,
        'Tên dự án': row.Duan,
        'Tên chi nhánh': row.Tenchinhanh,
        'Loại hình': row.Loaihinh,
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dự án không nhập xả thải');

      const colWidths = [
        { wch: 5 }, // STT
        { wch: 30 }, // Tên dự án
        { wch: 30 }, // Tên chi nhánh
        { wch: 20 }, // Loại hình
      ];
      worksheet['!cols'] = colWidths;

      const fileName = `Du_An_Khong_Nhap_Xa_Thai_${selectedDate.format('DD-MM-YYYY')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        {xaThai ? 'Báo cáo cảnh báo xả thải' : 'Báo cáo dự án không nhập xả thải'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            mb: 3,
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ width: '50%' }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                label="Chọn ngày"
                value={selectedDate}
                onChange={handleDateChange}
                format="DD/MM/YYYY"
                maxDate={moment()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon={xaThai ? 'mdi:alert-box-outline' : 'mdi:water-outline'} />}
              onClick={handleFormChange}
              disabled={loading}
            >
              {xaThai ? 'Dự án không nhập xả thải' : 'Cảnh báo xả thải'}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Iconify icon="eva:download-outline" />}
              onClick={exportToExcel}
              disabled={loading || (xaThai ? data.length === 0 : data2.length === 0)}
            >
              Xuất Excel
            </Button>
          </Box>
        </Box>

        {/* eslint-disable-next-line no-nested-ternary */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : xaThai ? (
          // Table for Xả thải data
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50} align="center">
                    STT
                  </TableCell>
                  <TableCell>Tên dự án</TableCell>
                  <TableCell>Ngày ghi nhận</TableCell>
                  <TableCell align="right">Xả thải</TableCell>
                  <TableCell align="right">Chỉ số giấy phép</TableCell>
                  <TableCell align="right">Chỉ số trung bình</TableCell>
                  <TableCell>Cảnh báo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{row.TenDuAn}</TableCell>
                    <TableCell>{moment(row.NgayGhiNhan).format('DD/MM/YYYY')}</TableCell>
                    <TableCell align="right">{row.XaThai}</TableCell>
                    <TableCell align="right">{row.ChiSoGiayPhep}</TableCell>
                    <TableCell align="right">{row.ChiSoTrungBinh}</TableCell>
                    <TableCell>
                      <Typography color={getCanhBaoColor(row.IDCanhbao)}>{row.CanhBao}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {data.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50} align="center">
                    STT
                  </TableCell>
                  <TableCell>Tên dự án</TableCell>
                  <TableCell>Tên chi nhánh</TableCell>
                  <TableCell>Loại hình</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data2.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{row.Duan}</TableCell>
                    <TableCell>{row.Tenchinhanh}</TableCell>
                    <TableCell>{row.Loaihinh}</TableCell>
                  </TableRow>
                ))}
                {data2.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button onClick={xaThai ? fetchData : fetchData2} variant="contained" color="primary">
          Tải lại
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CanhBaoXaThaiDialog;