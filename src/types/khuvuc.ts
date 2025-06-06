import { is } from "date-fns/locale";

export type IRoomFilterValue = string | string[] | null;

export type IRoomFilters = {
  labels: string;
  services: string[];
};

export type IKhuvucTableFilterValue = string | null | [] | string[];

export type IKhuvucTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  building: string[];
};

export type IChecklistTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  building: string[];
  projectStatus?: string,
};

export type IBaoCaoTableFilterValue = string | null | string[] | Date;

export type IBaoCaoTableFilters = {
  name: string;
  stock: string[];
  publish: string[];
  startDate: Date | null;
  endDate: Date | null;
};

export type ITbChecklistTableFilterValue = string | Date | null;

export type ITbChecklistTableFilters = {
  name: string;
  status: number | string;
  startDate: Date | null;
  endDate: Date | null;
};

export type E_KhoiCV = {
  KhoiCV: string;
  ID_KhoiCV: string;
};

export type E_Chucvu = {
  Chucvu: string;
};

export type E_Toanha = {
  ID_Toanha: string;
  Sotang: string;
  Toanha: string;
};

export type E_Duan = {
  Duan: string;
  ID_Duan: string;
  ent_duan_khoicv: IDuanKhoiCV;
};

export type E_Calv = {
  Tenca: string;
  ID_Calv: string;
  Giobatdau: string;
  Gioketthuc: string;
};

export type E_Tang = {
  ID_Tang: string;
  Tentang: string;
  Sotang: string;
};

export type INhom = {
  ID_Nhom: string;
  Tennhom: string;
};

export type IChinhanh = {
  ID_Chinhanh: string;
  Tenchinhanh: string;
};

export type ILinhvuc = {
  ID_Linhvuc: string;
  Linhvuc: string;
};
export type ILoaihinh = {
  ID_Loaihinh: string;
  Loaihinh: string;
};

export type IPhanloai = {
  ID_Phanloai: string;
  Phanloai: string;
};

export type IDuan = {
  ID_Duan: string;
  Duan: string;
  Diachi: string;
  Vido: string;
  Kinhdo: string;
  Logo: string;
  ID_Nhom: string;
  ID_Chinhanh: string;
  ID_Linhvuc: string;
  P0: string;
  HSSE: string;
  BeBoi: string;
  Xathai: string;
  Ngaybatdau: string;
  Ngayketthuc?: Date;
  ID_Loaihinh: string;
  ID_Phanloai: string;
  Percent: number;
  totalKhuvucInDuan: string;
  totalHangmucInDuan: string;
  toanhas: IToanha[];
  ent_nhom: INhom;
  ent_chinhanh: IChinhanh;
  ent_linhvuc: ILinhvuc;
  ent_loaihinh: ILoaihinh;
  ent_phanloai: IPhanloai;
  ent_duan_khoicv: IDuanKhoiCV[];
  isBaoCao: number;
  isDelete: number;
};

export type IBeboi = {
  ID_Beboi: string;
  ID_Duan: string;
  Ngay_ghi_nhan: string;
  Nguoi_tao: string;
  ID_Checklist: string;
  ID_ChecklistC: string;
  Giatridinhdanh: string;
  Giatrighinhan: string;
  Giatrisosanh: string;
  Tyle: string;
  VuotChuan: string;
  ID_Loaisosanh: string;
  Duongdananh: string;
  isDelete: string;
  ent_duan: IDuan;
  ent_checklist: IChecklist;
  tb_checklistc: TbChecklistCalv;
}

export type IHSSE = {
  ID: number;
  Ten_du_an?: string;
  Ghichu?: string;
  Ngay_ghi_nhan?: string;
  Nguoi_tao?: string;
  createdAt?: Date;
  updatedAt?: Date;
  Dien_cu_dan?: number;
  Dien_cdt?: number;
  Nuoc_cu_dan?: number;
  Nuoc_cdt?: number;
  Xa_thai?: number;
  Rac_sh?: number;
  Muoi_dp?: number;
  PAC?: number;
  NaHSO3?: number;
  NaOH?: number;
  Mat_rd?: number;
  Polymer_Anion?: number;
  Chlorine_bot?: number;
  Chlorine_vien?: number;
  Methanol?: number;
  Dau_may?: number;
  Tui_rac240?: number;
  Tui_rac120?: number;
  Tui_rac20?: number;
  Tui_rac10?: number;
  Tui_rac5?: number;
  giayvs_235?: number;
  giaivs_120?: number;
  giay_lau_tay?: number;
  hoa_chat?: number;
  nuoc_rua_tay?: number;
  nhiet_do?: number;
  nuoc_bu?: number;
  clo?: number;
  PH?: number;
  Poolblock?: number;
  trat_thai?: number;
  Email?: string;
  pHMINUS?: number;
  axit?: number;
  PN180?: number;
  modifiedBy?: string;
  chiSoCO2?: number;
  clorin?: number;
  NaOCL?: number;
};

export type IP0 = {
  ID_P0: number;
  ID_Duan?: number;
  ID_User_AN?: number;
  Ngaybc?: string;
  Slxeoto?: number;
  Slxeotodien?: number;
  Slxemay?: number;
  Slxemaydien?: number;
  Slxedap?: number;
  Slxedapdien?: number;
  Sotheotodk?: number;
  Sothexemaydk?: number;
  Sltheoto?: number;
  Slthexemay?: number;
  Sltheotophanmem?: number;
  Slthexemayphanmem?: number;
  Slscoto?: number;
  Slscotodien?: number;
  Slscxemay?: number;
  Slscxemaydien?: number;
  Slscxedap?: number;
  Slscxedapdien?: number;
  Slcongto?: number;
  Slsucokhac?: number;
  QuansoTT?: number;
  QuansoDB?: number;
  Doanhthu?: number;
  iTrangthai?: number;
  Ghichu?: string;
  ID_User_KT?: number;
  isDelete?: number;
  ent_user_AN: IUser;
  ent_user_KT: IUser;
  ent_user_DV: IUser;
  ent_duan: IDuan;
};

export type IGiamsat = {
  ID_Giamsat: string;
  ID_Duan: string;
  ID_Chucvu: string;
  ID_KhoiCV: string;
  Hoten: string;
  Ngaysinh: Date;
  Sodienthoai: string;
  Gioitinh: string;
  iQuyen: string;
  ent_khoicv: E_KhoiCV;
  ent_chucvu: E_Chucvu;
  // ent_quyen: ;
  isDelete: string;
};

export type IThietLapCa = {
  ID_ThietLapCa: string;
  Ngaythu: string;
  ID_Calv: string;
  Sochecklist: string;
  ID_Hangmucs: string;
  ID_Duan: string;
  isDelte: string;
  ent_calv: ICalv;
  ent_duan: IDuan;
  ent_duan_khoicv: IDuanKhoiCV;
};

export type IUser = {
  ID_User: string;
  ID_Duan: string;
  UserName: string;
  ID_Khuvucs: string;
  ID_Chucvu: string;
  ID_KhoiCV: string;
  ID_Chinhanh: string;
  Hoten: string;
  Ngaysinh: Date | null;
  Sodienthoai: string;
  arr_Duan: string;
  arr_Khoi: string;
  Gioitinh: string;
  Email: string;
  Password: string;
  PasswordPrivate: string;
  isCheckketoan: string;
  isDelete: string;
  ent_khoicv: E_KhoiCV;
  ent_duan: IDuan;
  ent_chucvu: IChucvu;
};

export type ISucongoai = {
  ID_Suco: string;
  ID_KV_CV: string;
  ID_Hangmuc: string;
  Ngaysuco: string;
  TenHangmuc: string;
  Giosuco: string;
  Noidungsuco: string;
  Duongdancacanh: string;
  Anhkiemtra: string;
  ID_User: string;
  Bienphapxuly: string;
  Tinhtrangxuly: string;
  Mucdo: string;
  Ghichu: string;
  Ngayxuly: string;
  isDelete: string;
  ent_hangmuc: IHangMuc;
  ent_user: IUser;
  ent_duan: IDuan;
};

export type ILoaiChiSo = {
  ID_LoaiCS: string;
  ID_Duan_Loai: string;
  TenLoaiCS: string;
  isDelete: string;
};

export type IHangMucChiSo = {
  ID_Hangmuc_Chiso: string;
  ID_Duan: string;
  ID_LoaiCS: string;
  Ten_Hangmuc_Chiso: string;
  Heso: string;
  Donvi: string;
  ent_loai_chiso: ILoaiChiSo;
  isDelete: string;
};

export type IBaocaochiso = {
  ID_Baocaochiso: string;
  ID_User: string;
  ID_Hangmuc_Chiso: string;
  Day: string;
  Month: string;
  Year: string;
  Chiso: string;
  Image: string;
  Chiso_Before: string;
  Chiso_Read_Img: string;
  Ghichu: string;
  isDelete: string;
  // ent_hangmuc_chiso: IHangMucChiSo;
  ent_user: IUser;
};

export type IChucvu = {
  ID_Chucvu: string;
  Chucvu: string;
  Ghichu: string;
  Role: number;
};

export type ITang = {
  ID_Tang: string;
  Tentang: string;
  ID_Duan: string;
  ID_User: string;
  ent_duan: IDuan;
  ent_user: IUser;
};

export type ITailieuphanhe = {
  ID_Duongdantl: string;
  ID_Phanhe: string;
  ID_Duan: string;
  Tenduongdan: string;
  Duongdan: string;
  Ghichu: string;
  ent_phanhe: IPhanhe;
};

export type E_Khuvuc_KhoiCV = {
  ID_KV_CV: string;
  ID_Khuvuc: string;
  ID_KhoiCV: string;
  ent_khoicv: E_KhoiCV;
};

export type E_Calv_KhoiCV = {
  ID_Calv_KhoiCV: string;
  ID_Calv: string;
  ID_KhoiCV: string;
  ent_khoicv: E_KhoiCV;
};

export type IKhuvuc = {
  ID_Khuvuc: string;
  ID_Toanha: string;
  Sothutu: string;
  ID_KhoiCVs: string;
  Makhuvuc: string;
  MaQrCode: string;
  Tenkhuvuc: string;
  ID_User: string;
  isDelete: string;
  ent_khuvuc_khoicvs: E_Khuvuc_KhoiCV[];
  ent_toanha: E_Toanha;
  hangMucLength: string;
  ent_hangmuc: IHangMuc[];
  KhoiCVs: IKhoiCV[];
};

export type ILocation = {
  id: string;
  project: string;
  ca: string;
  nguoi: string;
  cv: string;
  detailedCoordinates: IDetailLocation[];
};

export type IDetailLocation = {
  coordinates: string;
  detailedItems: IDetailHMLocation[];
};

export type IDetailHMLocation = {
  Gioht: string;
  relatedHangmuc: string;
};

export type IToanha = {
  ID_Toanha: string;
  ID_Duan: string;
  Toanha: string;
  Sotang: string;
  isDelete: string;
  khuvucLength: string;
  ent_duan: E_Duan;
  khuvuc: IKhuvuc;
  ent_khuvuc: IKhuvuc[];
  tenKhois: string[];
};

export type IKhoiCV = {
  ID_KhoiCV: string;
  KhoiCV: string;
  Chuky: string;
  Ngaybatdau: Date;
};

export type IDuanKhoiCV = {
  ID_Duan_KhoiCV: string;
  ID_KhoiCV: string;
  ID_Duan: string;
  ID_Phanhe: string;
  Ngaybatdau: string;
  Chuky: string;
  Tenchuky:string;
  isQuantrong: string;
  ent_duan: IDuan;
  ent_khoicv: IKhoiCV;
  ent_phanhe: IPhanhe;
};

export type ICalv = {
  ID_Calv: string;
  ID_KhoiCV: string;
  ID_Duan: string;
  Tenca: string;
  Giobatdau: string;
  Gioketthuc: string;
  ID_User: string;
  isDelete: string;
  ent_khoicv: IKhoiCV;
};

export type IHangMuc = {
  ID_Hangmuc: string;
  ID_Khuvuc: string;
  MaQrCode: string;
  Hangmuc: string;
  FileTieuChuan: string;
  Important: string;
  Tieuchuankt: string;
  isDelete: string;
  ent_khuvuc: IKhuvuc;
};

export type ITbChecklist = {
  ID_ChecklistC: string;
  ID_Duan: string;
  ID_KhoiCV: string;
  Ngay: string;
  ID_Calv: string;
  ID_User: string;
  ID_ThietLapCa: string;
  TongC: string;
  Tong: string;
  Giobd: string;
  Giokt: string;
  Ghichu: string;
  Tinhtrang: string;
  Giochupanh1: string;
  Anh1: string;
  Giochupanh2: string;
  Anh2: string;
  Giochupanh3: string;
  Anh3: string;
  Giochupanh4: string;
  Anh4: string;
  ent_khoicv: IKhoiCV;
  ent_giamsat: IGiamsat;
  ent_calv: ICalv;
  ent_user: IUser;
  ent_thietlapca: IThietLapCa;
};

export type IDayChecklistC = {
  Key: string;
  Ngay: string;
  Ca: string;
  Tong: string;
  TongC: string;
  KhoiCV: string;
  ID_Calv: string;
  ID_Duan: string;
  ID_KhoiCV: string;
  Chuky?: string;
};

export type IChecklist = {
  ID_Checklist: string;
  ID_Khuvuc: string;
  ID_Hangmuc: string;
  ID_Tang: string;
  ID_Phanhe: string;
  Sothutu: string;
  Maso: string;
  MaQrCode: string;
  Checklist: string;
  Giatridinhdanh: string;
  Giatrinhan: string;
  Giatriloi: string;
  Ghichu: string;
  Tieuchuan: string;
  Tinhtrang: string;
  isCheck: string;
  isImportant: string;
  ID_User: string;
  sCalv: string;
  ID_Loaisosanh: string;
  Giatrisosanh: string;
  isCanhbao: string;
  isDelete: string;
  ent_toanha: E_Toanha;
  ent_hangmuc: IHangMuc;
  ent_khuvuc: IKhuvuc;
  ent_tang: E_Tang;
  ent_calv: ICalv;
  ent_phanhe: IPhanhe;
  ent_loaisosanh: ILoaisosanh;
};

export type TbChecklistCalv = {
  ID_Checklistchitiet: string;
  ID_ChecklistC: string;
  ID_Checklist: string;
  isCheckListLai: string;
  Ketqua: string;
  Anh: string;
  Ngay: string;
  Gioht: string;
  Ghichu: string;
  isDelete: string;
  status: string;
  tb_checklistc: ITbChecklist;
  ent_checklist: IChecklist;
};


export type IPhanhe = {
  ID_Phanhe: string;
  Phanhe: string;
  isDelete: string;
}

export type ILoaisosanh = {
  ID_Loaisosanh: string;
  Noidung: string;
  isDelete: string;
}