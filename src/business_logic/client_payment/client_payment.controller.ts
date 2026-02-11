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



@Controller('client-payments')
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
    
    
    @Post('/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientPaymentData))
    async addClientPayment(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
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
    
    
    @Patch('/:client_payment_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientPaymentUpdate))
    async updateClientPayment(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
        },
        @Param('client_payment_id')
        client_payment_id: string,
        @Body()
        clientPaymentUpdates: TClientPaymentUpdate,
    ) {
        const req_organization_id = this.validateOrganization(req)
        
        return await this.clientPaymentService.updateClientPayment(
            req_organization_id,
            client_payment_id,
            clientPaymentUpdates,
        );
    }
    
    
    @Get('/:client_payment_id')
    async getClientPaymentProfile(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
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
    
    
    @Get('/client/:client_id')
    async getClientPaymentsByClientId(
        @Req()
        req: Request & {
            organization: TOrganizationSelect,
            user_id: string
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
