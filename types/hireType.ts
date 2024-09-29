import { TFilter } from "./filterType";

export interface THire {
  id: number;
  beginDate: string;
  endDate: string;
  beginSalary: number;
  isDeleted: any;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  position: Position;
  employee: Employee;
}

export interface Position {
  id: number;
  name: string;
  isDeleted: any;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}

export interface Employee {
  id: number;
  phone: string;
  address: any;
  isDeleted: any;
  active: any;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  user: User;
}

export interface User {
  id: string;
  login: string;
  email: string;
  first_name: string;
  last_name: string;
}

export type THireQuery = {
  positionName?: TFilter;
  employeeName?: TFilter;
};
