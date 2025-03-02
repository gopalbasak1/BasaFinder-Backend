export const USER_ROLE = {
  landlord: 'landlord',
  tenant: 'tenant',
  admin: 'admin',
} as const;

export const UserStatus = ['in-progress', 'blocked'];
export const userSearchableFields = ['name', 'email', 'phoneNumber'];
