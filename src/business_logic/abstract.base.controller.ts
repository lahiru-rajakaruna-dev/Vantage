import { UnauthorizedException } from '@nestjs/common';
import ILoggerService            from '../logger/logger.interface';
import { TOrganizationSelect }   from '../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';



export abstract class BaseController {
    protected readonly logger: ILoggerService
    
    
    constructor(logger: ILoggerService) {
        this.logger = logger
    }
    
    
    protected validateOrganization(request: Request & {
        organization: TOrganizationSelect
    }) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found')
        }
        
        return request.organization.organization_id
    }
}