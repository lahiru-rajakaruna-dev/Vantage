import {
    Inject,
    Injectable,
    InternalServerErrorException,
    type NestMiddleware,
    UnauthorizedException,
}                                from '@nestjs/common';
import { OrganizationService }   from '../business_logic/organization/organization.service';
import type ILoggerService       from '../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../logger/logger_factory/logger_factory.service';



@Injectable()
export class Middleware_OrganizationPuller implements NestMiddleware {
    private readonly organizationService: OrganizationService;
    private readonly logger: ILoggerService;
    
    
    constructor(
        @Inject()
        organizationService: OrganizationService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
    ) {
        this.organizationService = organizationService;
        this.logger              = logger;
    }
    
    
    async use(
        req: Request,
        res: Response,
        next: (error?: any) => void
    ) {
        try {
            const user_id = req['cookies']['user_id'];
            
            if (!user_id) {
                throw new UnauthorizedException({
                                                    message: 'Unauthenticated request...',
                                                });
            }
            
            const adminsOrganization = await this.organizationService.getOrganizationDetailsByAdmin(user_id);
            
            req['organization'] = adminsOrganization;
            
            next();
        } catch (e) {
            this.logger.log(e);
            throw new InternalServerErrorException();
        }
    }
}
