export interface SidenavMenuItem {
  title: string
  link?: string
  icon?: string
  children?: SidenavMenuItem[],
  isActive: boolean,
  requiredRole?: string
}

export const mainMenuItems: SidenavMenuItem[] = [
  { title: 'Dashboard', icon: 'dashboard', link: 'dashboard', isActive: false },
  { title: 'Access Requests', icon: 'app_registration', link: 'access-requests', isActive: false },
  { title: 'Validations', icon: 'approval', link: 'approvals', isActive: false },
  { title: 'Applications / Systems', icon: 'apps', link: 'systems', isActive: false, requiredRole: 'SYS_MNGT' },
  { title: 'Delegations', icon: 'assignment_ind', link: 'delegations', isActive: false },
  { title: 'Users', icon: 'groups', link: 'users', isActive: false, requiredRole: 'USERS_MNGT' },
  {
    title: 'Settings',
    icon: 'settings',
    isActive: false,
    requiredRole: 'SETTINGS',
    children: [
      { title: 'Validation contexts', link: 'settings/contexts', isActive: false },
      { title: 'Validation flows', link: 'settings/flows', isActive: false }
    ]
  }
]
