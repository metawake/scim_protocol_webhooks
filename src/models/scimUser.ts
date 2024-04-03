export interface ScimUserResource {
  schemas: string[];
  id?: string;
  externalId?: string;
  userName: string;
  name?: {
    formatted?: string;
    familyName?: string;
    givenName?: string;
    middleName?: string;
  };
  emails?: Array<{
    value: string;
    type?: string;
    primary?: boolean;
  }>;
  active?: boolean;
  meta?: {
    resourceType?: string;
    created?: string;
    lastModified?: string;
  };
}

export interface ScimUserDatabase {
  id: string;
  userName: string;
  externalId?: string;
  familyName?: string;
  givenName?: string;
  emails: Array<{
    value: string;
    type?: string;
    primary?: boolean;
  }>;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
} 