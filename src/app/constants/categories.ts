import { CategoryModel } from '../models/recipe.models';

export const CATEGORIES: CategoryModel[] = [
  {
    id: 1,
    name: 'Arroces',
    severity: 'warning',
  },
  {
    id: 2,
    name: 'Aves',
    severity: 'danger',
  },
  {
    id: 3,
    name: 'Ensaladas',
    severity: 'success',
  },
  {
    id: 4,
    name: 'Carnes',
    severity: 'danger',
  },
  {
    id: 5,
    name: 'Huevos',
    severity: 'info',
  },
  {
    id: 6,
    name: 'Legumbres',
    severity: 'info',
  },
  {
    id: 7,
    name: 'Licores',
    severity: 'danger',
  },
  {
    id: 8,
    name: 'Mermeladas',
    severity: 'danger',
  },
  {
    id: 9,
    name: 'Pastas',
    severity: 'danger',
  },
  {
    id: 10,
    name: 'Pescado y mariscos',
    severity: 'info',
  },
  {
    id: 11,
    name: 'Postres',
    severity: 'success',
  },
  {
    id: 12,
    name: 'Verduras',
    severity: 'danger',
  },
  {
    id: 13,
    name: 'Salsas',
    severity: 'success',
  },
  {
    id: 14,
    name: 'Sopas y cremas',
    severity: 'danger',
  },
];

export const EDIT_MODE = 1;
export const CREATE_MODE = 2;
