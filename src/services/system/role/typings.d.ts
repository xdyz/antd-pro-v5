declare namespace SystemRoles {
  type PrivilegesParams = Record<string, {
    execute: boolean,
    read: boolean,
    write: boolean
  }>

  type RoleDataType = {
    id?: number;
    name: string;
    privileges: PrivilegesParams;
  };

  type GetAllRolesType = {
    page?: number;
    per_page?: number;
  };

  type RoleObjType = {
    text: string;
    status?: string;
  };

  type RoleValueEnum = Record<string, RoleObjType>;

  type GetRolesParamsType = {
    current?: number;
    pageSize?: number;
  };
  
  type PrivilegesParamsAndKey = {
    key: string,
    execute: boolean,
    read: boolean,
    write: boolean
  }
  
  
  type FormInfoParams = {
    id?: number;
    name: string;
    privileges: PrivilegesParamsAndKey[],
    root?: boolean
  }
}