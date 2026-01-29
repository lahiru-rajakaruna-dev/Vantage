import {
  Inject,
  Injectable,
  type NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import {
  OrganizationService
} from '../business_logic/organization/organization.service';



@Injectable()
export class Middleware_OrganizationPuller implements NestMiddleware {
  private readonly organizationService: OrganizationService;

  constructor(@Inject() organizationService: OrganizationService) {
    this.organizationService = organizationService;
  }

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const user_id = req['cookies']['user_id'];

    if (!user_id) {
      throw new UnauthorizedException({
        message: 'Unauthenticated request...',
      });
    }

    const adminsOrganization =
      await this.organizationService.getOrganizationDetailsAdminId(user_id);

    req['organization'] = adminsOrganization;

    next();
  }
}
