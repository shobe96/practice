import { provideRouter, Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { enumRoles } from './shared/constants.model';
import { authRoutes } from './routes/auth.routes';
import { homeRoutes } from './routes/home.routes';
import { employeeRoutes } from './routes/employee.routes';
import { departmentRoutes } from './routes/department.routes';
import { userRoutes } from './routes/user.routes';
import { skillRoutes } from './routes/skill.routes';
import { projectRoutes } from './routes/project.routes';
import { roleRoutes } from './routes/role.routes';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  ...employeeRoutes,
  ...departmentRoutes,
  ...authRoutes,
  ...userRoutes,
  ...skillRoutes,
  ...projectRoutes,
  ...homeRoutes,
  ...roleRoutes
];

export const appRoutes = provideRouter(routes);
