import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
// @mui
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { alpha } from '@mui/material/styles';
import Label from 'src/components/label';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Stack, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
// _mock
import { useGetCalv, useGetDayTb_Checklist, useGetKhoiCV } from 'src/api/khuvuc';

import { fTimestamp } from 'src/utils/format-time';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
    useTable,
    getComparator,
    emptyRows,
    TableNoData,
    TableEmptyRows,
    TableHeadCustom,
    TableSelectedAction,
    TablePaginationCustom,
} from 'src/components/table';
import { useSnackbar } from 'src/components/snackbar';
// types
import {
    IDayChecklistC,
    ITbChecklistTableFilters,
    ITbChecklistTableFilterValue,
} from 'src/types/khuvuc';
//
import ChecklistTableRow from '../checklist-day/tb-day-checklist-table-row';
import ChecklistTableToolbar from '../checklist-day/tbchecklist-table-toolbar';
import ChecklistTableFiltersResult from '../checklist-day/tbchecklist-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: 'Ngay', label: 'Ngày checklist' },
    { id: 'Tong', label: 'Số Checklist' },
    { id: 'ID_Calv', label: 'Ca làm việc' },
    { id: 'ID_KhoiCV', label: 'Khối công việc' },
    { id: '', width: 50 },
];

const defaultFilters: ITbChecklistTableFilters = {
    name: '',
    status: 'all',
    startDate: null,
    endDate: null,
};

const STORAGE_KEY = 'accessToken';
// ----------------------------------------------------------------------

export default function DayChecklistCalvListView() {
    const table = useTable();

    const settings = useSettingsContext();

    const router = useRouter();

    const confirm = useBoolean();

    const { enqueueSnackbar } = useSnackbar();

    const accessToken = localStorage.getItem(STORAGE_KEY);

    const [filters, setFilters] = useState(defaultFilters);

    const [tableData, setTableData] = useState<IDayChecklistC[]>([]);
    const [showModal, setShowModal] = useState<any>(false);
    const [dateFilter, setDateFilter] = useState<any>({
        startDate: null,
        endDate: null,
    });

    const { tb_day_checkList, tb_day_checkListTotalPages, tb_day_checklistTotalCount, mutateTb_Checklist } =
        useGetDayTb_Checklist({
            page: table.page,
            limit: table.rowsPerPage,
        });

    const { khoiCV } = useGetKhoiCV();

    // Use the checklist data in useEffect to set table data
    useEffect(() => {
        if (tb_day_checkList) {
            setTableData(tb_day_checkList);
        }
    }, [tb_day_checkList]);

    const handleDateChange = (date: any, type: 'startDate' | 'endDate') => {
        setDateFilter((prevState: any) => ({
            ...prevState,
            [type]: date, // Cập nhật startDate hoặc endDate tùy thuộc vào type
        }));
    };

    const STATUS_OPTIONS = useMemo(
        () => [
            { value: 'all', label: 'Tất cả' },
            ...khoiCV.map((khoi) => ({
                value: khoi.ID_KhoiCV.toString(),
                label: khoi.KhoiCV,
            })),
        ],
        [khoiCV]
    );

    const dateError =
        filters.startDate && filters.endDate
            ? filters.startDate.getTime() > filters.endDate.getTime()
            : false;

    const dataFiltered = applyFilter({
        inputData: tableData,
        comparator: getComparator(table.order, table.orderBy),
        filters,
        dateError,
    });

    const dataInPage = dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
    );

    const denseHeight = 52;

    const canReset =
        !!filters.name || filters.status !== 'all' || (!!filters.startDate && !!filters.endDate);

    const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

    const GroupPolicySchema = Yup.object().shape({
        Tenphongban: Yup.string().required('Không được để trống'),
    });

    const defaultValues = {
        Tenphongban: '',
    };

    const methods = useForm({
        resolver: yupResolver(GroupPolicySchema),
        defaultValues,
    });

    const { reset } = methods;

    const handleFilters = useCallback(
        (name: string, value: ITbChecklistTableFilterValue) => {
            table.onResetPage();
            setFilters((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        },
        [table]
    );


    const handleFilterSubmit = async () => {
        await axios
            .post(`http://localhost:6868/api/v2/tb_day_checkListc/date`, dateFilter, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res) => {
                setTableData(res.data.data);
                setShowModal(false);
                enqueueSnackbar({
                    variant: 'success',
                    autoHideDuration: 4000,
                    message: `Tìm kiếm thành công`,
                });
            })
            .catch((error) => {
                if (error.response) {
                    enqueueSnackbar({
                        variant: 'error',
                        autoHideDuration: 4000,
                        message: `${error.response.data.message}`,
                    });
                } else if (error.request) {
                    // Lỗi không nhận được phản hồi từ server
                    enqueueSnackbar({
                        variant: 'error',
                        autoHideDuration: 4000,
                        message: `Không nhận được phản hồi từ máy chủ`,
                    });
                } else {
                    // Lỗi khi cấu hình request
                    enqueueSnackbar({
                        variant: 'error',
                        autoHideDuration: 4000,
                        message: `Lỗi gửi yêu cầu`,
                    });
                }
            });
    };



    const getStatusText = (status: any) => {
        switch (status) {
            case '1':
                return 'Khối làm sạch';
            case '2':
                return 'Khối kỹ thuật';
            case '3':
                return 'Khối bảo vệ';
            case '4':
                return 'Khối dự án';
            case '5':
                return 'Khối F&B';
            case 'all':
                return 'Khối Bảo vệ, Làm sạch, Kỹ thuật, Dự án, F&B';
            default:
                return '';
        }
    };

    const handlePrint = useCallback(async () => {
        try {
            const idChecklistCArray = dataFiltered.map((item) => item.Key);
            const khoiText = getStatusText(filters.status);
            const data = {
                list_IDChecklistC: idChecklistCArray,
                startDate: filters.startDate,
                endDate: filters.endDate,
                tenBoPhan: khoiText,
            };
            const response = await axios.post('http://localhost:6868/api/v2/tb_day_checkListc/baocao', data, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                responseType: 'blob', // Ensure response is treated as a blob
            });

            // Create a new Blob object using the response data of the file
            const blob = new Blob([response.data], {
                type: response.headers['content-type'],
            });

            // Create a link element
            const link = document.createElement('a');

            // Set the download attribute with a filename
            link.href = window.URL.createObjectURL(blob);
            link.download = 'Báo cáo Checklist.xlsx';

            // Append the link to the body
            document.body.appendChild(link);

            // Programmatically trigger a click on the link to download the file
            link.click();

            // Remove the link from the document
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading the Excel file', error);
        }
    }, [accessToken, dataFiltered, filters]);

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);


    const handleViewNot = useCallback((Ngay: string, ID_Calv: string) => {
        console.log('Ngay, ID_Calv', Ngay, ID_Calv)
        const url = paths.dashboard.checklist.catrongngaydetail(Ngay, ID_Calv);
        window.open(url, '_blank');
    }, []);


    const handleFilterStatus = useCallback(
        (event: React.SyntheticEvent, newValue: string) => {
            handleFilters('status', newValue);
        },
        [handleFilters]
    );

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <CustomBreadcrumbs
                heading="Ca Checklist"
                links={[
                    {
                        name: 'Dashboard',
                        href: paths.dashboard.root,
                    },
                    {
                        name: 'Checklist',
                        href: paths.dashboard.checklist.root,
                    },
                    { name: 'Danh sách' },
                ]}
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <Card>
                <Tabs
                    value={filters.status}
                    onChange={handleFilterStatus}
                    sx={{
                        px: 2.5,
                        boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                    }}
                >
                    {STATUS_OPTIONS.map((tab) => (
                        <Tab
                            key={tab.value}
                            iconPosition="end"
                            value={tab.value}
                            label={tab.label}
                            icon={
                                <Label
                                    variant={
                                        ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                                    }
                                    color={
                                        (tab.value === '1' && 'success') ||
                                        (tab.value === '2' && 'warning') ||
                                        (tab.value === '3' && 'error') ||
                                        (tab.value === '4' && 'info') ||
                                        'default'
                                    }
                                >
                                    {tab.value === 'all' && tb_day_checkList?.length}
                                    {tab.value === '1' &&
                                        tb_day_checkList?.filter((item) => `${item.ID_KhoiCV}` === '1').length}

                                    {tab.value === '2' &&
                                        tb_day_checkList?.filter((item) => `${item.ID_KhoiCV}` === '2').length}
                                    {tab.value === '3' &&
                                        tb_day_checkList?.filter((item) => `${item.ID_KhoiCV}` === '3').length}
                                    {tab.value === '4' &&
                                        tb_day_checkList?.filter((item) => `${item.ID_KhoiCV}` === '4').length}
                                    {tab.value === '5' &&
                                        tb_day_checkList?.filter((item) => `${item.ID_KhoiCV}` === '5').length}
                                </Label>
                            }
                        />
                    ))}
                </Tabs>
                <ChecklistTableToolbar
                    filters={filters}
                    onFilters={handleFilters}
                    onPrint={handlePrint}
                    dateError={dateError}
                    departmentOptions={STATUS_OPTIONS}
                    setShowModal={setShowModal}
                    //
                    canReset={canReset}
                    onResetFilters={handleResetFilters}
                />

                {canReset && (
                    <ChecklistTableFiltersResult
                        filters={filters}
                        onFilters={handleFilters}
                        //
                        onResetFilters={handleResetFilters}
                        //
                        results={dataFiltered?.length}
                        sx={{ p: 2.5, pt: 0 }}
                    />
                )}

                <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                    <TableSelectedAction
                        dense={table.dense}
                        numSelected={table.selected.length}
                        rowCount={tableData?.length}
                        onSelectAllRows={(checked) =>
                            table.onSelectAllRows(checked, tableData?.map((row) => row?.Key))
                        }
                        action={
                            <Tooltip title="Delete">
                                <IconButton color="primary" onClick={confirm.onTrue}>
                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                </IconButton>
                            </Tooltip>
                        }
                    />

                    <Scrollbar>
                        <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                            <TableHeadCustom
                                order={table.order}
                                orderBy={table.orderBy}
                                headLabel={TABLE_HEAD}
                                rowCount={tableData?.length}
                                numSelected={table.selected.length}
                                onSort={table.onSort}
                            // onSelectAllRows={(checked) =>
                            //   table.onSelectAllRows(checked, tableData?.map((row) => row.Key))
                            // }
                            />

                            <TableBody>
                                {dataInPage.map((row) => (
                                    <ChecklistTableRow
                                        key={row.Key}
                                        row={row}
                                        selected={table.selected.includes(row.Key)}
                                        onViewNot={() => handleViewNot(row.Ngay, row.ID_Calv)}
                                    />
                                ))}

                                <TableEmptyRows
                                    height={denseHeight}
                                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                                />

                                <TableNoData notFound={notFound} />
                            </TableBody>
                        </Table>
                    </Scrollbar>
                </TableContainer>

                <TablePaginationCustom
                    count={dataFiltered.length}
                    page={table.page}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                    //
                    dense={table.dense}
                    onChangeDense={table.onChangeDense}
                />
            </Card>

            <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
                <DialogContent sx={{ mt: 2.5, mr: 2.5 }}>
                    <Typography variant="h5" pb={2}>
                        Tìm kiếm theo ngày
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
                        <DatePicker
                            label="Ngày bắt đầu"
                            value={dateFilter.startDate}
                            onChange={(date) => handleDateChange(date, 'startDate')} // Gọi hàm với type 'startDate'
                            slotProps={{ textField: { fullWidth: true } }}
                            sx={{
                                maxWidth: { md: 200 },
                            }}
                        />

                        <DatePicker
                            label="Ngày kết thúc"
                            value={dateFilter.endDate}
                            onChange={(date) => handleDateChange(date, 'endDate')} // Gọi hàm với type 'endDate'
                            slotProps={{ textField: { fullWidth: true } }}
                            sx={{
                                maxWidth: { md: 200 },
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" variant="contained" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button
                        color="success"
                        variant="contained"
                        onClick={() => {
                            // setShowModal(false);
                            handleFilterSubmit();
                        }}
                    >
                        Tìm kiếm
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

// ----------------------------------------------------------------------

function applyFilter({
    inputData,
    comparator,
    filters,
    dateError,
}: {
    inputData: IDayChecklistC[];
    comparator: (a: any, b: any) => number;
    filters: ITbChecklistTableFilters;
    dateError: boolean;
}) {
    const { status, name, startDate, endDate } = filters;

    const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData?.filter(
            (checklist) =>
                `${checklist?.Ca}`?.toLowerCase().indexOf(name.toLowerCase()) !== -1

        );
    }
    if (status !== 'all') {
        inputData = inputData.filter((tbchecklist) => `${tbchecklist.ID_KhoiCV}` === `${status}`);
    }

    if (!dateError) {
        if (startDate && endDate) {
            // Đặt endDate vào cuối ngày
            endDate.setHours(23);
            endDate.setMinutes(59);
            endDate.setSeconds(59);

            const startTimestamp = fTimestamp(startDate);
            const endTimestamp = fTimestamp(endDate);
            inputData = inputData.filter((item) => {
                const nxTimestamp = fTimestamp(item.Ngay);
                return nxTimestamp >= startTimestamp && nxTimestamp < endTimestamp;
            });
        }
    }

    return inputData;
}
