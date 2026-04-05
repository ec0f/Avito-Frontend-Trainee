import { ComponentType } from 'react';
import Announcements from './pages/Announcements';
import ItemOfAnnouncements from './pages/ItemOfAnnouncements';
import EditAnnouncement from './pages/EditAnnouncement';
import {
  ANNOUNCEMENTS_ROUTE,
  ANNOUNCEMENT_EDIT_ROUTE,
  ANNOUNCEMENT_ITEM_ROUTE,
} from './utils/consts';

interface IRoute {
  path: string;
  Component: ComponentType;
}

export const publicRoutes: IRoute[] = [
  {
    path: ANNOUNCEMENTS_ROUTE,
    Component: Announcements,
  },
  {
    path: ANNOUNCEMENT_ITEM_ROUTE,
    Component: ItemOfAnnouncements,
  },
  {
    path: ANNOUNCEMENT_EDIT_ROUTE,
    Component: EditAnnouncement,
  },
];
