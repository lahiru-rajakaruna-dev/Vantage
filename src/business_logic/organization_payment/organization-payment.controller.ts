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
    UsePipes,
}                                     from '@nestjs/common';
import type ILoggerService            from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY }      from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaOrganizationPaymentData,
    TOrganizationPaymentInsert,
    type TOrganizationPaymentUpdate,
    type   TOrganizationSelect,
}                                     from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe        from '../../pipes/schema_validation.pipe';
import { EPaymentStatus }             from '../../types';
import { BaseController }             from '../abstract.base.controller';
import { OrganizationPaymentService } from './organization-payment.service';



@Controller('organization-payment')
export class OrganizationPaymentController extends BaseController {
    private readonly organizationPaymentService: OrganizationPaymentService;
    
    
    constructor(
        organizationPaymentService: OrganizationPaymentService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        super(logger)
        this.organizationPaymentService = organizationPaymentService;
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaOrganizationPaymentData))
    async addOrganizationPayment(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        paymentData: Pick<TOrganizationPaymentInsert, 'organization_payment_amount'>,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.organizationPaymentService.addOrganizationPayment(
            req_organization_id,
            {
                organization_payment_amount   : paymentData.organization_payment_amount,
                organization_payment_timestamp: Date.now(),
                organization_payment_status   : EPaymentStatus.PAID,
            }
        );
    }
    
    
    @Patch('/amount/:payment_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaOrganizationPaymentData))
    async updateOrganizationPaymentAmount(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
        @Body()
        paymentData: Pick<TOrganizationPaymentUpdate, 'organization_payment_amount'>,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!paymentData.organization_payment_amount) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.organizationPaymentService.updateOrganizationPaymentAmountById(
            req_organization_id,
            payment_id,
            paymentData.organization_payment_amount
        );
    }
    
    
    @Patch('/status/pending/:payment_id')
    async updateOrganizationPaymentStatusToPending(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToPendingById(
            req_organization_id,
            payment_id,
        );
    }
    
    
    @Patch('/status/paid/:payment_id')
    async updateOrganizationPaymentStatusToPaid(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToPaidById(
            req_organization_id,
            payment_id,
        );
    }
    
    
    @Patch('/status/verified/:payment_id')
    async updateOrganizationPaymentStatusToVerified(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToVerifiedById(
            req_organization_id,
            payment_id,
        );
    }
    
    
    @Patch('/status/refunded/:payment_id')
    async updateOrganizationPaymentStatusToRefunded(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        return await this.organizationPaymentService.updateOrganizationPaymentStatusToRefundedById(
            req_organization_id,
            payment_id,
        );
    }
    
    
    @Get('/profile/:payment_id')
    async getOrganizationPaymentProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('payment_id')
        payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        return await this.organizationPaymentService.getOrganizationPaymentById(
            req_organization_id,
            payment_id,
        );
    }
    
    
    @Get('/view/organization')
    async getOrganizationPaymentsByOrganizationId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },) {
        const req_organization_id = this.validateOrganization(req)
        return await this.organizationPaymentService.getOrganizationPaymentsByOrganizationId(req_organization_id,);
    }
}
