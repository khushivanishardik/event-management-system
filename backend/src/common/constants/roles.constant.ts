// Location: backend/src/common/constants/roles.constant.ts
// Purpose: Enum of all possible user roles in the system.
//          Used in schemas, guards, decorators, and JWT payload.

export enum Role {
  USER = 'user', // Regular attendee — can browse, buy tickets
  ORGANIZER = 'organizer', // Event creators — can create/manage events
  ADMIN = 'admin', // Super admin — full access
}
