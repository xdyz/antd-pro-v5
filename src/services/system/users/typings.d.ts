declare namespace SystemUsers {
  type TableItem = {
    username: string;
    nickname: string;
    password: string;
    roles: number | null;
    email: string,
    create_time?: string;
  };

  type RestItemType = {
    username?: string;
    nickname?: string;
  };

  type CreateFormColumn = {
    id?: number;
  } & TableItem;

  type EditFormColumn = {
    id?: number;
  } & TableItem;

  type UsersParamsType = {
    page?: number;
    size?: number;
    sort?: string;
  };

  type GetUsersParamsType = {
    current?: number;
    pageSize?: number;
  };
  
  type RoleDataType = {
    id: number;
    name: string;
  };
  
}