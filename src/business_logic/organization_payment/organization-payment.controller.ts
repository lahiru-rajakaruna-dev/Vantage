import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UsePipes,
}                                                   from '@nestjs/common';
import { v4 as uuid }                               from 'uuid';
import {
    type TOrganizationPayment
}                                                   from '../../orm/orm.interface';
import ZodSchemaValidationPipe
                                                    from '../../pipes/schema_validation.pipe';
import { OrganizationPaymentSchema, TOrganization } from '../../schemas';
import {
    OrganizationPaymentService
}                                                   from './organization-payment.service';



@Controller('organization-payment')
export class OrganizationPaymentController {
    private readonly organizationPaymentService: OrganizationPaymentService;
    
    
    constructor(@Inject() organizationPaymentService: OrganizationPaymentService) {
        this.organizationPaymentService = organizationPaymentService;
    }
    
    
    @Post()
    @UsePipes(
        new ZodSchemaValidationPipe(
            OrganizationPaymentSchema.pick({
                                               payment_amount: true,
                                           })
        ),
    )
    async addOrganizationPayment(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Body() paymentData: TOrganizationPayment,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.organizationPaymentService.addOrganizationPayment({
                                                                                payment_id             : uuid()
                                                                                    .toString(),
                                                                                payment_organization_id: request.organization.organization_id,
                                                                                payment_amount         : paymentData.payment_amount,
                                                                                payment_timestamp      : Date.now(),
                                                                                payment_status         : 'PAID',
                                                                            });
    }
    
    
    @Patch('/update/amount/:payment_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            OrganizationPaymentSchema.pick({ payment_amount: true })
        ),
    )
    async updateOrganizationPaymentAmount(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('payment_id') payment_id: string,
        @Body() paymentData: {
            payment_amount: number
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentAmountById(
            request.organization.organization_id,
            payment_id,
            paymentData.payment_amount,
        );
    }
    
    
    @Patch('/update/status/pending/:payment_id')
    async updateOrganizationPaymentStatusToPending(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('payment_id') payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToPendingById(
            request.organization.organization_id,
            payment_id,
        );
    }
    
    
    @Patch('/update/status/paid/:payment_id')
    async updateOrganizationPaymentStatusToPaid(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('payment_id') payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToPaidById(
            request.organization.organization_id,
            payment_id,
        );
    }
    
    
    @Patch('/update/status/verified/:payment_id')
    async updateOrganizationPaymentStatusToVerified(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('payment_id') payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToVerifiedById(
            request.organization.organization_id,
            payment_id,
        );
    }
    
    
    @Patch('/update/status/refunded/:payment_id')
    async updateOrganizationPaymentStatusToRefunded(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('payment_id') payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToRefundedById(
            request.organization.organization_id,
            payment_id,
        );
    }
    
    
    @Get('/profile/:payment_id')
    async getOrganizationPaymentProfile(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('payment_id') payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.getOrganizationPaymentById(
            request.organization.organization_id,
            payment_id,
        );
    }
    
    
    @Get('/view/organization')
    async getOrganizationPaymentsByOrganizationId(
        @Req() request: Request & {
            organization: TOrganization
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.getOrganizationPaymentsByOrganizationId(
            request.organization.organization_id,
        );
    }
}