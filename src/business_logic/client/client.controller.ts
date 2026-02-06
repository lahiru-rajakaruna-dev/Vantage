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
}                              from '@nestjs/common';
import {
    SchemaClientInsert,
    SchemaClientUpdate,
    type TClientInsert,
    type   TOrganizationSelect,
}                              from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import { EAccountStatus }      from '../../types';
import { ClientService }       from './client.service';



@Controller('client')
export class ClientController {
    private readonly clientService: ClientService;
    
    
    // EDITED: Removed incorrect @Inject() decorator
    constructor(clientService: ClientService) {
        this.clientService = clientService;
    }
    
    
    @Post()
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientInsert.pick({
                                                                      client_email     : true,
                                                                      client_name      : true,
                                                                      client_phone     : true,
                                                                      client_nic_number: true,
                                                                  })
                                                            .nonoptional()))
    async addClient(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        clientData: Omit<TClientInsert, 'client_organization_id' | 'client_account_status' | 'client_registration_date'> // EDITED: Fixed type
    ) {
        if (!request.organization) {
            throw new BadRequestException('[-] Invalid request...');
        }
        
        return await this.clientService.addClient(
            request.organization.organization_id,
            {
                client_name             : clientData.client_name,
                client_nic_number       : clientData.client_nic_number,
                client_phone            : clientData.client_phone,
                client_email            : clientData.client_email,
                client_account_status   : EAccountStatus.UNVERIFIED,
                client_registration_date: Date.now(),
            }
        );
    }
    
    
    @Patch('/update/name/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientUpdate.pick({
                                                                      client_name: true
                                                                  })
                                                            .nonoptional()))
    async updateClientName(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
        @Body('client_name')
        client_name: string,
    ) {
        return await this.clientService.updateClientName(
            request.organization.organization_id,
            client_id,
            client_name,
        );
    }
    
    
    @Patch('/update/nic/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientUpdate.pick({ client_nic_number: true })
                                                            .nonoptional()))
    async updateClientNic(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
        @Body()
        clientData: {
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
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientUpdate.pick({ client_phone: true })
                                                            .nonoptional()))
    async updateClientPhone(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
        @Body()
        clientData: {
            client_phone: string
        },
    ) {
        
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found') // EDITED:
                                                                      // Fixed
                                                                      // typo
        }
        
        return await this.clientService.updateClientPhone(
            request.organization.organization_id,
            client_id,
            clientData.client_phone,
        );
    }
    
    
    @Patch('/update/status/active/:client_id')
    async updateClientStatusToActive(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ) {
        
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found') // EDITED:
                                                                      // Fixed
                                                                      // typo
        }
        
        return await this.clientService.updateClientAccountStatusToActive(request.organization.organization_id,
                                                                          client_id,
        );
    }
    
    
    @Patch('/update/status/deactivated/:client_id')
    async updateClientStatusToDeactivated(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found') // EDITED:
                                                                      // Fixed
                                                                      // typo
        }
        
        return await this.clientService.updateClientAccountStatusToDeactivated(request.organization.organization_id,
                                                                               client_id,
        );
    }
    
    
    @Patch('/update/status/unverified/:client_id')
    async updateClientStatusToUnverified(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found') // EDITED:
                                                                      // Fixed
                                                                      // typo
        }
        
        return await this.clientService.updateClientAccountStatusToUnverified(request.organization.organization_id,
                                                                              client_id,
        );
    }
    
    
    @Get('/profile/:client_id')
    async getClientProfile(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found') // EDITED:
                                                                      // Fixed
                                                                      // typo
        }
        
        return await this.clientService.viewClientProfile(
            request.organization.organization_id,
            client_id,
        );
    }
    
    
    @Get('/view/organization')
    async getClientsByOrganizationId( // EDITED: Removed unnecessary param decorator
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        if (!request.organization) {
            throw new UnauthorizedException('Organization not found')
        }
        
        return await this.clientService.getClientsByOrganizationId(request.organization.organization_id);
    }
}
