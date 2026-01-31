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
}                              from '@nestjs/common';
import {
    v4 as uuid
}                              from 'uuid';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import {
    ClientPaymentSchema,
    type TClientPaymentInsert,
    TOrganization
}                              from '../../schemas';
import {
    ClientPaymentService
}                              from './client_payment.service';



@Controller('client-payment')
export class ClientPaymentController {
    private readonly clientPaymentService: ClientPaymentService;
    
    
    constructor(@Inject() clientPaymentService: ClientPaymentService) {
        this.clientPaymentService = clientPaymentService;
    }
    
    
    @Post()
    @UsePipes(
        new ZodSchemaValidationPipe(
            ClientPaymentSchema.pick({
                                         client_payment_client_id: true,
                                         client_payment_amount   : true,
                                     })
        ),
    )
    async addClientPayment(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Body() clientPaymentData: TClientPaymentInsert,
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.clientPaymentService.addClientPayment({
                                                                    client_payment_id             : uuid()
                                                                        .toString(),
                                                                    client_payment_organization_id: request.organization.organization_id,
                                                                    client_payment_client_id      : clientPaymentData.client_payment_client_id,
                                                                    client_payment_amount         : clientPaymentData.client_payment_amount,
                                                                    client_payment_date           : Date.now(),
                                                                    client_payment_status         : 'VERIFIED',
                                                                });
    }
    
    
    @Patch('/update/amount/:client_payment_id')
    @UsePipes(
        new ZodSchemaValidationPipe(
            ClientPaymentSchema.pick({ client_payment_amount: true })
        ),
    )
    async updateClientPaymentAmount(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('client_payment_id') client_payment_id: string,
        @Body() clientPaymentData: {
            client_payment_amount: number
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found');
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
            organization: TOrganization
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
            organization: TOrganization
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
            organization: TOrganization
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
            organization: TOrganization
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
            organization: TOrganization
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
            organization: TOrganization
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
