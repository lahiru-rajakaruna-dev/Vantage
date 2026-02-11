import {
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
    SchemaOrganizationPaymentUpdate,
    TOrganizationPaymentInsert,
    type TOrganizationPaymentUpdate,
    type   TOrganizationSelect,
}                                     from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe        from '../../pipes/schema_validation.pipe';
import { EPaymentStatus }             from '../../types';
import { BaseController }             from '../abstract.base.controller';
import { OrganizationPaymentService } from './organization-payment.service';



@Controller('organization-payments')
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
            organization: TOrganizationSelect,
            user_id: string
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
    
    
    @Patch('/:payment_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaOrganizationPaymentUpdate))
    async updateOrganizationPayment(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('payment_id')
        payment_id: string,
        @Body()
        paymentUpdates: TOrganizationPaymentUpdate,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.organizationPaymentService.updateOrganizationPayment(
            req_organization_id,
            payment_id,
            paymentUpdates
        );
    }
    
    
    @Get('/:payment_id')
    async getOrganizationPaymentProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
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
    
    
    @Get('/organization')
    async getOrganizationPaymentsByOrganizationId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },) {
        const req_organization_id = this.validateOrganization(req)
        return await this.organizationPaymentService.getOrganizationPaymentsByOrganizationId(req_organization_id,);
    }
}
