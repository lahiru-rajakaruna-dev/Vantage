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
}                                                    from '@nestjs/common';
import { v4 as uuid }                                from 'uuid';
import ZodSchemaValidationPipe
                                                     from '../../pipes/schema_validation.pipe';
import { ClientSchema, type TClient, TOrganization } from '../../schemas';
import { EAccountStatus }                            from '../../types';
import { ClientService }                             from './client.service';



@Controller('client')
export class ClientController {
    private readonly clientService: ClientService;
    
    
    constructor(@Inject() clientService: ClientService) {
        this.clientService = clientService;
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(
        ClientSchema.pick({
                              client_email     : true,
                              client_name      : true,
                              client_phone     : true,
                              client_nic_number: true,
                          })
    ))
    async addClient(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Body() clientData: TClient
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.clientService.addClient({
                                                      client_id                : uuid()
                                                          .toString(),
                                                      client_organization_id   : request.organization.organization_id,
                                                      client_name              : clientData.client_name,
                                                      client_nic_number        : clientData.client_nic_number,
                                                      client_phone             : clientData.client_phone,
                                                      client_email             : clientData.client_email,
                                                      client_stripe_customer_id: 'not-set',
                                                      client_account_status    : EAccountStatus.UNVERIFIED,
                                                      client_registration_date : Date.now(),
                                                  });
    }
    
    
    @Patch('/update/name/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(ClientSchema.pick({
                                                                client_name: true
                                                            })))
    async updateClientName(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('client_id') client_id: string,
        @Body('client_name') client_name: string,
    ) {
        return await this.clientService.updateClientName(
            request.organization.organization_id,
            client_id,
            client_name,
        );
    }
    
    
    @Patch('/update/nic/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(
        ClientSchema.pick({ client_nic_number: true })
    ))
    async updateClientNic(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('client_id') client_id: string,
        @Body() clientData: {
            client_nic_number: string
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found')
        }
        
        return await this.clientService.updateClientNicNumber(
            request.organization.organization_id,
            client_id,
            clientData.client_nic_number,
        );
    }
    
    
    @Patch('/update/phone/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(ClientSchema.pick({ client_phone: true })))
    async updateClientPhone(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('client_id') client_id: string,
        @Body() clientData: {
            client_phone: string
        },
    ) {
        
        if (!request.organization) {
            throw new UnauthorizedException('Organziation not found')
        }
        
        return await this.clientService.updateClientPhone(
            request.organization.organization_id,
            client_id,
            clientData.client_phone,
        );
    }
    
    
    @Patch('/update/status/active/:client_id')
    async updateClientStatusToActive(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('client_id') client_id: string,
    ) {
        
        if (!request.organization) {
            throw new UnauthorizedException('Organziation not found')
        }
        
        return await this.clientService.updateClientAccountStatusToActive(
            request.organization.organization_id,
            client_id,
        );
    }
    
    
    @Patch('/update/status/deactivated/:client_id')
    async updateClientStatusToDeactivated(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('client_id') client_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organziation not found')
        }
        
        return await this.clientService.updateClientAccountStatusToDeactivated(
            request.organization.organization_id,
            client_id,
        );
    }
    
    
    @Patch('/update/status/unverified/:client_id')
    async updateClientStatusToUnverified(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('client_id') client_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organziation not found')
        }
        
        return await this.clientService.updateClientAccountStatusToUnverified(
            request.organization.organization_id,
            client_id,
        );
    }
    
    
    @Get('/profile/:client_id')
    async getClientProfile(
        @Req() request: Request & {
            organization: TOrganization
        },
        @Param('client_id') client_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organziation not found')
        }
        
        return await this.clientService.viewClientProfile(
            request.organization.organization_id,
            client_id,
        );
    }
    
    
    @Get('/view/organization/:organization_id')
    async getClientsByOrganizationId(
        @Param() request: Request & {
            organization: TOrganization
        },
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found')
        }
        
        return await this.clientService.getClientsByOrganizationId(
            request.organization.organization_id);
    }
}
