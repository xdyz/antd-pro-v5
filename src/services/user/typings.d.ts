declare namespace User {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    userid?: string;
    signature?: string;
    title?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    access?: string;
    address?: string;
  };
}