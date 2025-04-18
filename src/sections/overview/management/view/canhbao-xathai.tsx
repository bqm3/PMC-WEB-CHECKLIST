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
  TableRow
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Iconify from 'src/components/iconify';

interface CanhBaoData {
  TenDuAn: string;
  NgayGhiNhan: string;
  XaThai: number;
  ChiSoGiayPhep: number;
  ChiSoTrungBinh: number;
  CanhBao: string;
  IDCanhbao: number;
}

const CanhBaoXaThaiDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(moment());
  const [data, setData] = useState<CanhBaoData[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('https://checklist.pmcweb.vn/be/api/v2/hsse/canhbao-xathai', {
        params: {
          Ngay: selectedDate.format('YYYY/MM/DD')
        }
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

  useEffect(() => {
    if (open) {
      fetchData();
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

  // Chức năng export to Excel
  const exportToExcel = () => {
    // Định dạng dữ liệu cho Excel
    const excelData = data.map((row, index) => ({
      'STT': index + 1,
      'Tên dự án': row.TenDuAn,
      'Ngày ghi nhận': moment(row.NgayGhiNhan).format('DD/MM/YYYY'),
      'Xả thải': row.XaThai,
      'Chỉ số giấy phép': row.ChiSoGiayPhep,
      'Chỉ số trung bình': row.ChiSoTrungBinh,
      'Cảnh báo': row.CanhBao
    }));

    // Tạo workbook và worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cảnh báo xả thải');

    // Tự động điều chỉnh chiều rộng cột
    const colWidths = [
      { wch: 5 },  // STT
      { wch: 30 }, // Tên dự án
      { wch: 15 }, // Ngày ghi nhận
      { wch: 10 }, // Xả thải
      { wch: 20 }, // Chỉ số giấy phép
      { wch: 20 }, // Chỉ số trung bình
      { wch: 25 }  // Cảnh báo
    ];
    worksheet['!cols'] = colWidths;

    // Tạo tên file với định dạng ngày tháng năm
    const fileName = `Canh_Bao_Xa_Thai_${selectedDate.format('DD-MM-YYYY')}.xlsx`;

    // Xuất file Excel
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Báo cáo cảnh báo xả thải</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3, mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ width: '70%' }}>
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
                  } 
                }}
              />
            </LocalizationProvider>
          </Box>
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<Iconify icon="eva:download-outline" />}
            onClick={exportToExcel}
            disabled={loading || data.length === 0}
          >
            Xuất Excel
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={50} align="center">STT</TableCell>
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
                      <Typography color={getCanhBaoColor(row.IDCanhbao)}>
                        {row.CanhBao}
                      </Typography>
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button onClick={fetchData} variant="contained" color="primary">
          Tải lại
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CanhBaoXaThaiDialog;