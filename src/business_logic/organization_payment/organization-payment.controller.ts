import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UnauthorizedException,
    UsePipes,
}                                     from '@nestjs/common';
import {
    SchemaOrganizationPaymentInsert,
    SchemaOrganizationPaymentUpdate,
    TOrganizationPaymentInsert,
    type TOrganizationPaymentUpdate,
    type   TOrganizationSelect,
}                                     from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe        from '../../pipes/schema_validation.pipe';
import { EPaymentStatus }             from '../../types';
import { OrganizationPaymentService } from './organization-payment.service';



@Controller('organization-payment')
export class OrganizationPaymentController {
    private readonly organizationPaymentService: OrganizationPaymentService;
    
    
    constructor(organizationPaymentService: OrganizationPaymentService) {
        this.organizationPaymentService = organizationPaymentService;
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaOrganizationPaymentInsert.pick({
                                                                                   organization_payment_amount: true,
                                                                               })
                                                                         .nonoptional()),)
    async addOrganizationPayment(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        paymentData: Pick<TOrganizationPaymentInsert, 'organization_payment_amount'>,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.organizationPaymentService.addOrganizationPayment(request.organization.organization_id,
                                                                            {
                                                                                organization_payment_amount   : paymentData.organization_payment_amount,
                                                                                organization_payment_timestamp: Date.now(),
                                                                                organization_payment_status   : EPaymentStatus.PAID,
                                                                            }
        );
    }
    
    
    @Patch('/update/amount/:payment_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaOrganizationPaymentUpdate.pick({ organization_payment_amount: true })
                                                                         .nonoptional()),)
    async updateOrganizationPaymentAmount(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
        @Body()
        paymentData: Pick<TOrganizationPaymentUpdate, 'organization_payment_amount'>,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        if (!paymentData.organization_payment_amount) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentAmountById(
            request.organization.organization_id,
            payment_id,
            paymentData.organization_payment_amount
        );
    }
    
    
    @Patch('/update/status/pending/:payment_id')
    async updateOrganizationPaymentStatusToPending(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToPendingById(request.organization.organization_id,
                                                                                                  payment_id,
        );
    }
    
    
    @Patch('/update/status/paid/:payment_id')
    async updateOrganizationPaymentStatusToPaid(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToPaidById(request.organization.organization_id,
                                                                                               payment_id,
        );
    }
    
    
    @Patch('/update/status/verified/:payment_id')
    async updateOrganizationPaymentStatusToVerified(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToVerifiedById(request.organization.organization_id,
                                                                                                   payment_id,
        );
    }
    
    
    @Patch('/update/status/refunded/:payment_id')
    async updateOrganizationPaymentStatusToRefunded(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToRefundedById(request.organization.organization_id,
                                                                                                   payment_id,
        );
    }
    
    
    @Get('/profile/:payment_id')
    async getOrganizationPaymentProfile(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.getOrganizationPaymentById(request.organization.organization_id,
                                                                                payment_id,
        );
    }
    
    
    @Get('/view/organization')
    async getOrganizationPaymentsByOrganizationId(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.organizationPaymentService.getOrganizationPaymentsByOrganizationId(
            request.organization.organization_id,);
    }
}
