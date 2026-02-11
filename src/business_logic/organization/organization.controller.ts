import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    Patch,
    Post,
    Req,
    UsePipes,
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaInsertOrganization,
    SchemaUpdateOrganization,
    type TOrganizationData,
    type   TOrganizationSelect,
    type TOrganizationUpdate
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { OrganizationService }   from './organization.service';



@Controller('organizations')
export class OrganizationController extends BaseController {
    private organizationService: OrganizationService;
    
    
    constructor(
        organizationService: OrganizationService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
    ) {
        super(logger)
        
        this.organizationService = organizationService;
    }
    
    
    @Get('/is_registered')
    async isRegistered(
        @Req()
        request: Request) {
        const user_id = request['cookies']['user_id'];
        
        if (!user_id) {
            throw new BadRequestException('[-] Cookie not found...');
        }
        
        const organization = await this.organizationService.getOrganizationDetailsByAdmin(user_id);
        
        if (organization) {
            return {
                isRegistered: true,
            };
        }
        
        return {
            isRegistered: false,
        };
    }
    
    
    @Get('/')
    async getOrganizationById(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        
        this.validateOrganization(request)
        
        return request.organization
    }
    
    
    @Post('/')
    @UsePipes(new ZodSchemaValidationPipe(SchemaInsertOrganization.pick({
                                                                            organization_admin_email: true,
                                                                            organization_admin_phone: true,
                                                                            organization_logo_url   : true,
                                                                            organization_name       : true,
                                                                        })
                                                                  .nonoptional()),)
    async addOrganization(
        @Req()
        req: Request,
        @Body()
        organizationData: TOrganizationData,
    ) {
        const user_id = req['cookies']['user_id'];
        
        const {
                  organization_name,
                  organization_logo_url,
                  organization_admin_email,
                  organization_admin_phone,
              } = organizationData;
        
        if (!user_id || !organization_name || !organization_logo_url || !organization_admin_email || !organization_admin_phone) {
            throw new BadRequestException('Missing required data',);
        }
        
        // ADD ORGANIZATION RECORD
        try {
            const organizationRecord = await this.organizationService.addOrganization(
                user_id,
                {
                    organization_name,
                    organization_admin_email,
                    organization_admin_phone,
                    organization_logo_url,
                    organization_registration_date    : Date.now(),
                    organization_subscription_end_date: Date.now() + 1000 * 60 * 60 * 24 * 30
                },
            );
            
            return this.logger.logAndReturn(organizationRecord);
        } catch (e) {
            this.logger.log(e);
            throw new InternalServerErrorException(`[-] ${ (e as Error).message }`);
        }
    }
    
    
    @Patch('/')
    @UsePipes(new ZodSchemaValidationPipe(SchemaUpdateOrganization),)
    updateOrganizationById(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        organizationData: TOrganizationUpdate,
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        
        return this.organizationService.updateOrganization(
            req_organization_id,
            organizationData,
        );
    }
    
    
    /*
     @Delete('/deactivate')
     deactivateOrganizationById(
     @Req()
     request: Request & {
     organization: TOrganizationSelect
     },) {
     if (!request.organization) {
     throw new BadRequestException('[-] Invalid request...');
     }
     
     return this.organizationService.deactivateOrganizationById(request.organization.organization_id);
     }
     */
    
    /*
     @Patch('/activate/:organization_id')
     activateOrganizationById(
     @Param('organization_id')
     organization_id: string) {
     if (!organization_id) {
     throw new BadRequestException('[-] Invalid request...');
     }
     
     return this.organizationService.activateOrganizationById(organization_id);
     }
     */
}
