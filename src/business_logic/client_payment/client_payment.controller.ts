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
}                               from '@nestjs/common';
import {
    SchemaInsertClientPayment,
    SchemaUpdateClientPayment,
    TClientPaymentInsert,
    TClientPaymentUpdate,
    TOrganizationSelect
}                               from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe  from '../../pipes/schema_validation.pipe';
import { EPaymentStatus }       from '../../types';
import { ClientPaymentService } from './client_payment.service';



@Controller('client-payment')
export class ClientPaymentController {
    private readonly clientPaymentService: ClientPaymentService;
    
    
    constructor(clientPaymentService: ClientPaymentService) {
        this.clientPaymentService = clientPaymentService;
    }
    
    
    @Post('/add/:client_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaInsertClientPayment.pick({
                                               client_payment_amount: true,
                                           })
                                     .nonoptional()
        ),
    )
    async addClientPayment(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id') client_id: string,
        @Body() clientPaymentData: Pick<TClientPaymentInsert, 'client_payment_amount'>,
    ) {
        if (!request.organization || !client_id) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.clientPaymentService.addClientPayment(
            request.organization.organization_id,
            client_id,
            {
                client_payment_amount: clientPaymentData.client_payment_amount,
                client_payment_date  : Date.now(),
                client_payment_status: EPaymentStatus.PENDING,
            }
        );
    }
    
    
    @Patch('/update/amount/:client_payment_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            SchemaUpdateClientPayment.pick({ client_payment_amount: true })
                                     .nonoptional()
        ),
    )
    async updateClientPaymentAmount(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id') client_payment_id: string,
        @Body() clientPaymentData: Pick<TClientPaymentUpdate, 'client_payment_amount'>,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        if (!clientPaymentData.client_payment_amount) {
            throw new BadRequestException('Missing required data')
        }
        
        return await this.clientPaymentService.updateClientPaymentAmountById(
            request.organization.organization_id,
            client_payment_id,
            clientPaymentData.client_payment_amount,
        );
    }
    
    
    @Patch('/update/status/pending/:client_payment_id')
    async updateClientPaymentStatusToPending(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id') client_payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.clientPaymentService.updateClientPaymentStatusToPendingById(
            request.organization.organization_id,
            client_payment_id,
        );
    }
    
    
    @Patch('/update/status/paid/:client_payment_id')
    async updateClientPaymentStatusToPaid(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id') client_payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.clientPaymentService.updateClientPaymentStatusToPaidById(
            request.organization.organization_id,
            client_payment_id,
        );
    }
    
    
    @Patch('/update/status/verified/:client_payment_id')
    async updateClientPaymentStatusToVerified(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id') client_payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.clientPaymentService.updateClientPaymentStatusToVerifiedById(
            request.organization.organization_id,
            client_payment_id,
        );
    }
    
    
    @Patch('/update/status/refunded/:client_payment_id')
    async updateClientPaymentStatusToRefunded(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id') client_payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.clientPaymentService.updateClientPaymentStatusToRefundedById(
            request.organization.organization_id,
            client_payment_id,
        );
    }
    
    
    @Get('/profile/:client_payment_id')
    async getClientPaymentProfile(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_payment_id') client_payment_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.clientPaymentService.viewClientPaymentById(
            request.organization.organization_id,
            client_payment_id,
        );
    }
    
    
    @Get('/view/client/:client_id')
    async getClientPaymentsByClientId(
        @Req() request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id') client_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
        }
        
        return await this.clientPaymentService.getClientPaymentsByClientId(
            request.organization.organization_id,
            client_id,
        );
    }
}
