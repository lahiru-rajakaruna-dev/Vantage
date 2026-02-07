import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    Req,
    UsePipes,
}                                from '@nestjs/common';
import {
    Business,
    Customer
}                                from '@paddle/paddle-node-sdk';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaInsertOrganization,
    SchemaUpdateOrganization,
    type TOrganizationData,
    type   TOrganizationSelect,
    type TOrganizationUpdate
}                                from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import { PaddleService }         from '../../paddle/paddle.service';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { BaseController }        from '../abstract.base.controller';
import { OrganizationService }   from './organization.service';



@Controller('organization')
export class OrganizationController extends BaseController {
    private organizationService: OrganizationService;
    private readonly paddle: PaddleService;
    
    
    constructor(
        organizationService: OrganizationService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
        paddle: PaddleService,
    ) {
        super(logger)
        
        this.organizationService = organizationService;
        this.paddle              = paddle;
    }
    
    
    @Get('/is_registered')
    async isRegistered(
        @Req()
        request: Request) {
        const user_id = request['cookies']['user_id'];
        
        if (!user_id) {
            throw new BadRequestException('[-] Cookie not found...');
        }
        
        const organization = await this.organizationService.getOrganizationDetailsAdminById(user_id);
        
        if (organization) {
            return {
                isRegistered: true,
            };
        }
        
        return {
            isRegistered: false,
        };
    }
    
    
    @Get('/view')
    async getOrganizationById(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        
        this.validateOrganization(request)
        
        return request.organization
    }
    
    
    @Post('/add')
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
        
        let paddleCustomerAccount: Customer;
        let paddleBusinessAccount: Business;
        
        // ADD PADDLE CUSTOMER ACCOUNT
        try {
            paddleCustomerAccount = await this.paddle.addCustomerAccount(
                organization_name,
                organization_admin_email,
            );
        } catch (e) {
            this.logger.log(e);
            throw new InternalServerErrorException((e as Error).message);
        }
        
        // ADD PADDLE BUSINESS ACCOUNT
        try {
            paddleBusinessAccount = await this.paddle.addOrganizationAccount(
                paddleCustomerAccount.id,
                organization_name,
                organization_admin_phone,
            );
        } catch (e) {
            this.logger.log(e);
            throw new InternalServerErrorException((e as Error).message);
        }
        this.logger.log('[+] Add organization payment account to the platform');
        
        // ADD ORGANIZATION RECORD
        try {
            const organizationRecord = await this.organizationService.addOrganization(
                user_id,
                paddleCustomerAccount.id,
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
    
    
    @Patch('/name')
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
        
        return this.organizationService.updateOrganizationNameById(
            req_organization_id,
            organizationData.organization_name!,
        );
    }
    
    
    @Patch('/subscription/expired')
    updateOrganizationSubscriptionStatusToExpiredById(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.setOrganizationSubscriptionStatusToExpiredById(request.organization.organization_id,);
    }
    
    
    @Patch('/subscription/valid')
    updateOrganizationSubscriptionStatusToValidById(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.setOrganizationSubscriptionStatusToValidById(request.organization.organization_id,);
    }
    
    
    @Patch('/subscription/date')
    extendOrganizationSubscriptionEndDateBy30ById(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.setOrganizationSubscriptionEndDateBy30ById(request.organization.organization_id,);
    }
    
    
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
    
    
    @Patch('/activate/:organization_id')
    activateOrganizationById(
        @Param('organization_id')
        organization_id: string) {
        if (!organization_id) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.activateOrganizationById(organization_id);
    }
}
