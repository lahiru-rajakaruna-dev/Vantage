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
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaClientPaymentData,
    SchemaClientPaymentUpdate,
    type TClientPaymentData,
    type TClientPaymentUpdate,
    TOrganizationSelect
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { EPaymentStatus }        from '../../types';
import { BaseController }        from '../abstract.base.controller';
import { ClientPaymentService }  from './client_payment.service';



@Controller('client-payment')
export class ClientPaymentController extends BaseController {
    private readonly clientPaymentService: ClientPaymentService;
    
    
    constructor(
        clientPaymentService: ClientPaymentService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        super(logger)
        this.clientPaymentService = clientPaymentService;
    }
    
    
    @Post('/add/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientPaymentData))
    async addClientPayment(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
        @Body()
        clientPaymentData: TClientPaymentData,
    ) {
        
        const req_organization_id = this.validateOrganization(req)
        
        if (!client_id) {
            throw new BadRequestException('[-] Invalid req...');
        }
        
        return await this.clientPaymentService.addClientPayment(
            req_organization_id,
            client_id,
            {
                client_payment_amount: clientPaymentData.client_payment_amount,
                client_payment_date  : Date.now(),
                client_payment_status: EPaymentStatus.PENDING,
            }
        );
    }
    
    
    @Patch('/amount/:client_payment_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientPaymentUpdate.pick({ client_payment_amount: true })
                                                                   .nonoptional()),)
    async updateClientPaymentAmount(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id')
        client_payment_id: string,
        @Body()
        clientPaymentData: Pick<TClientPaymentUpdate, 'client_payment_amount'>,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        if (!clientPaymentData.client_payment_amount) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.clientPaymentService.updateClientPaymentAmountById(
            req_organization_id,
            client_payment_id,
            clientPaymentData.client_payment_amount,
        );
    }
    
    
    @Patch('/status/pending/:client_payment_id')
    async updateClientPaymentStatusToPending(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id')
        client_payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.clientPaymentService.updateClientPaymentStatusToPendingById(
            req_organization_id,
            client_payment_id,
        );
    }
    
    
    @Patch('/status/paid/:client_payment_id')
    async updateClientPaymentStatusToPaid(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id')
        client_payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.clientPaymentService.updateClientPaymentStatusToPaidById(
            req_organization_id,
            client_payment_id,
        );
    }
    
    
    @Patch('/status/verified/:client_payment_id')
    async updateClientPaymentStatusToVerified(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id')
        client_payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.clientPaymentService.updateClientPaymentStatusToVerifiedById(
            req_organization_id,
            client_payment_id,
        );
    }
    
    
    @Patch('/status/refunded/:client_payment_id')
    async updateClientPaymentStatusToRefunded(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id')
        client_payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.clientPaymentService.updateClientPaymentStatusToRefundedById(
            req_organization_id,
            client_payment_id,
        );
    }
    
    
    @Get('/profile/:client_payment_id')
    async getClientPaymentProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id')
        client_payment_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.clientPaymentService.viewClientPaymentById(
            req_organization_id,
            client_payment_id,
        );
    }
    
    
    @Get('/view/client/:client_id')
    async getClientPaymentsByClientId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.clientPaymentService.getClientPaymentsByClientId(
            req_organization_id,
            client_id,
        );
    }
}
