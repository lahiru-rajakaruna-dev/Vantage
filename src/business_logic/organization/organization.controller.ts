import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    Inject,
    InternalServerErrorException,
    Patch,
    Post,
    Req,
    UsePipes,
}                                                   from '@nestjs/common';
import {
    Business,
    Customer
}                                                   from '@paddle/paddle-node-sdk';
import { v4 as uuid }                               from 'uuid';
import type ILoggerService
                                                    from '../../logger/logger.interface';
import {
    TOKEN__LOGGER_FACTORY
}                                                   from '../../logger/logger_factory/logger_factory.service';
import {
    PaddleService
}                                                   from '../../paddle/paddle.service';
import ZodSchemaValidationPipe
                                                    from '../../pipes/schema_validation.pipe';
import {
    CreateOrganizationRequestSchema,
    type TOrganization,
    UpdateOrganizationRequestSchema
}                                                   from '../../schemas';
import { EOrganizationStatus, ESubscriptionStatus } from '../../types';
import {
    OrganizationService
}                                                   from './organization.service';



@Controller('organization')
export class OrganizationController {
    private organizationService: OrganizationService;
    private readonly logger: ILoggerService;
    private readonly paddle: PaddleService;
    
    
    constructor(
        @Inject() organizationService: OrganizationService,
        @Inject(TOKEN__LOGGER_FACTORY) logger: ILoggerService,
        @Inject() paddle: PaddleService,
    ) {
        this.organizationService = organizationService;
        this.logger              = logger;
        this.paddle              = paddle;
    }
    
    
    @Get('/is_registered')
    async isRegistered(@Req() request: Request) {
        const user_id = request['cookies']['user_id'];
        
        if (!user_id) {
            throw new BadRequestException('[-] Cookie not found...');
        }
        
        const organization =
                  await this.organizationService.getOrganizationDetailsAdminId(
                      user_id);
        
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
        @Req() request: Request & {
            organization: TOrganization
        },
    ) {
        return request.organization
    }
    
    
    @Post('/add')
    @UsePipes(
        new ZodSchemaValidationPipe(
            CreateOrganizationRequestSchema
        ),
    )
    async addOrganization(
        @Req() req: Request,
        @Body()
        organizationData: {
            organization_name: string;
            organization_admin_email: string;
            organization_logo_url: string;
            organization_admin_phone: string;
        },
    ) {
        const user_id = req['cookies']['user_id'];
        
        const {
                  organization_name,
                  organization_logo_url,
                  organization_admin_email,
                  organization_admin_phone,
              } = organizationData;
        
        if (
            !user_id ||
            !organization_name ||
            !organization_logo_url ||
            !organization_admin_email ||
            !organization_admin_phone
        ) {
            throw new BadRequestException(
                'Invalid request. Required data is missing...',
            );
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
                {
                    organization_id                   : uuid().toString(),
                    organization_admin_id             : user_id,
                    organization_stripe_customer_id   : paddleCustomerAccount.id,
                    organization_name,
                    organization_admin_email,
                    organization_admin_phone,
                    organization_logo_url,
                    organization_status               : EOrganizationStatus.ACTIVE,
                    organization_subscription_status  : ESubscriptionStatus.VALID,
                    organization_registration_date    : Date.now(),
                    organization_subscription_end_date:
                        Date.now() + 28 * 24 * 60 * 60 * 1000,
                },
            );
            
            return this.logger.logAndReturn(organizationRecord);
        } catch (e) {
            this.logger.log(e);
            throw new InternalServerErrorException(`[-] ${ (e as Error).message }`);
        }
    }
    
    
    @Patch('/update/name')
    @UsePipes(
        new ZodSchemaValidationPipe(
            UpdateOrganizationRequestSchema
        ),
    )
    updateOrganizationById(
        @Headers('organization_id') organization_id: string,
        @Body() organizationData: Pick<TOrganization, 'organization_name'>,
    ) {
        if (!organization_id) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.updateOrganizationNameById(
            organization_id,
            organizationData.organization_name,
        );
    }
    
    
    @Patch('/update/subscription/expired')
    updateOrganizationSubscriptionStatusToExpiredById(
        @Req() request: Request & {
            organization: TOrganization
        },
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.setOrganizationSubscriptionStatusToExpiredById(
            request.organization.organization_id,
        );
    }
    
    
    @Patch('/update/subscription/valid')
    updateOrganizationSubscriptionStatusToValidById(
        @Req() request: Request & {
            organization: TOrganization
        },
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.setOrganizationSubscriptionStatusToValidById(
            request.organization.organization_id,
        );
    }
    
    
    @Patch('/update/subscription/date')
    extendOrganizationSubscriptionEndDateBy30ById(
        @Req() request: Request & {
            organization: TOrganization
        },
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.setOrganizationSubscriptionEndDateBy30ById(
            request.organization.organization_id,
        );
    }
    
    
    @Delete('/deactivate')
    deactivateOrganizationById(
        @Req() request: Request & {
            organization: TOrganization
        },
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.deactivateOrganizationById(
            request.organization.organization_id);
    }
    
    
    @Patch('/activate/:organization_id')
    activateOrganizationById(organization_id: string) {
        if (!organization_id) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return this.organizationService.activateOrganizationById(organization_id);
    }
}
