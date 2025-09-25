export interface MenuItem {
  title: string
  link?: string
  icon?: string
  children?: MenuItem[],
  isActive: boolean,
  requiredRole?: string
}

export const mainMenuItems: MenuItem[] = [
  {title: 'menu.dashboard', icon: 'dashboard', link: 'dashboard', isActive: false},
  {title: 'menu.access_request', icon: 'app_registration', link: 'access-requests', isActive: false},
  {title: 'menu.validations', icon: 'approval', link: 'approvals', isActive: false},
  {title: 'menu.applications', icon: 'apps', link: 'applications', isActive: false, requiredRole: 'SYS_MNGT'},
  {title: 'menu.delegations', icon: 'assignment_ind', link: 'delegations', isActive: false},
  {title: 'menu.users', icon: 'groups', link: 'users', isActive: false, requiredRole: 'USERS_MNGT'},
  {
    title: 'menu.settings',
    icon: 'settings',
    isActive: false,
    requiredRole: 'SETTINGS',
    children: [
      {title: 'menu.contexts', link: 'settings/contexts', isActive: false},
      {title: 'menu.flows', link: 'settings/flows', isActive: false}
    ]
  }
]
