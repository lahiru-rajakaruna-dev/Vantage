import {
    Controller,
    Get,
    Inject,
    Request
}                                from '@nestjs/common';
import { ConfigService }         from '@nestjs/config';
import jwt                       from 'jsonwebtoken';
import { OrganizationService }   from '../business_logic/organization/organization.service';
import type ILoggerService       from '../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../logger/logger_factory/logger_factory.service';
import { EEnvVars }              from '../types';



@Controller('auth')
export class AuthenticationController {
    private logger: ILoggerService;
    private organizationService: OrganizationService;
    private configService: ConfigService;
    
    
    constructor(
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
        @Inject()
        organizationService: OrganizationService,
        @Inject()
        configService: ConfigService,
    ) {
        this.logger              = logger;
        this.organizationService = organizationService;
        this.configService       = configService;
    }
    
    
    @Get('/authenticate')
    async authenticate(
        @Request()
        request: Request) {
        const user_id = request['cookies']['user_id'];
        
        if (!user_id) {
            throw new Error('[-] Unauthenticated user');
        }
        
        const organization = await this.organizationService.getOrganizationDetailsByAdmin(user_id);
        if (!organization) {
            throw new Error('[-] Unregistered organization...');
        }
        
        const token = jwt.sign(
            {
                user_id        : user_id,
                organization_id: organization.organization_id
            },
            this.configService.get(EEnvVars.JWT_SECRET_KEY) as string,
            {
                expiresIn: 1000 * 60 * 60 * 24,
            },
        );
        
        return { token };
    }
}
