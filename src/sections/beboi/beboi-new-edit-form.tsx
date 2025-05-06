import * as Yup from 'yup';
import axios from 'axios';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import {
  Button,
  Card,
  Container,
  TableContainer,
  Typography,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
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
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IBeboi, IChecklistTableFilters, IHSSE, IKhuvucTableFilterValue } from 'src/types/khuvuc';
import { useSettingsContext } from 'src/components/settings';
import BeBoiDetailTableRow from './beboi-detail-table-row';

// ----------------------------------------------------------------------

type Props = {
  currentBeBoi: IBeboi[];
};

const TABLE_HEAD = [
  { id: 'ID_Checklist', label: 'Tên checklist' },
  { id: 'Giatridinhdanh', label: 'Giá trị định danh' },
  { id: 'Giatrighinhan', label: 'Giá trị ghi nhận' },
  { id: 'Giatrisosanh', label: 'Giá trị so sánh' },
  { id: 'Tyle', label: 'Tỷ lệ' },
  { id: 'Nguoitao', label: 'Người gửi' },
  { id: '', width: 10 },
];

const defaultFilters: IChecklistTableFilters = {
  name: '',
  status: 'all',
  startDate: null,
  endDate: null,
  building: [],
};


export default function HSSENewEditForm({ currentBeBoi }: Props) {
  const table = useTable({ defaultOrderBy: 'ID_Beboi' });

  const confirm = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);
  const [tableData, setTableData] = useState<IBeboi[]>([]);

  useEffect(() => {
    if (currentBeBoi?.length > 0) {
      setTableData(currentBeBoi);
    }
  }, [currentBeBoi]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !!filters.name || filters.status !== 'all';

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleFilters = useCallback(
    (name: string, value: IKhuvucTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );


  return (
    <>
      <Card>
        {/* <DuanTableToolbar
            filters={filters}
            onFilters={handleFilters}
            departmentOptions={DEPARTMENT_OPTIONS}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
          />

          {canReset && (
            <DuanTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={table.dense}
            numSelected={table.selected.length}
            rowCount={tableData?.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(checked, tableData?.map((row) => row?.ID_Beboi))
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
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(checked, tableData?.map((row) => row.ID_Beboi))
                }
              />

              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <BeBoiDetailTableRow
                      key={row.ID_Beboi}
                      row={row}
                      selected={table.selected.includes(row.ID_Beboi)}
                    // onViewRow={}
                    />
                  ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData?.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered?.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </>
  );
}


function applyFilter({
  inputData,
  comparator,
  filters, // dateError,
}: {
  inputData: IBeboi[];
  comparator: (a: any, b: any) => number;
  filters: IChecklistTableFilters;
  // dateError: boolean;
}) {
  const { status, name, building } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // if (name) {
  //   inputData = inputData?.filter(
  //     (order) =>
  //       order.Duan.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
  //       order.Diachi.toLowerCase().indexOf(name.toLowerCase()) !== -1
  //   );
  // }


  // if (building.length) {
  //   inputData = inputData.filter((item) => building.includes(String(item?.ID_Chinhanh)));
  // }

  return inputData;
}