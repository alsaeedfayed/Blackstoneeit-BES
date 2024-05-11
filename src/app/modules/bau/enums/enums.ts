export enum sortDirections {
  Asc = 1,
  Desc = 2,
}

export enum TasksSortBy {
  title = 'title',
  creationDate = 'creationDate',
  dueDate = 'dueDate',
  importanceLevel = 'importanceLevel',
  commentsCount = 'commentsCount',
  attachmentsCount = 'attachmentsCount',
  progress = 'progress',
  status = 'status',
}

export enum RoleSortBy {
  nameAr = "nameAr",
  nameEn = "nameEn",
  creationDate = 'creationDate'
}
export function getEnumKeyByValue<T>(enumObj: T, enumValue: any): keyof T {
  return Object.keys(enumObj).find(key => enumObj[key] === enumValue) as keyof T;
}

