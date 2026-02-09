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
}                                from '@nestjs/common';
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    SchemaClientData,
    type TClientData,
    type   TOrganizationSelect,
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { EAccountStatus }        from '../../types';
import { BaseController }        from '../abstract.base.controller';
import { ClientService }         from './client.service';



@Controller('client')
export class ClientController extends BaseController {
    private readonly clientService: ClientService;
    
    
    constructor(
        clientService: ClientService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService
    ) {
        super(logger)
        this.clientService = clientService;
    }
    
    
    @Post('/')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientData))
    async addClient(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Body()
        clientData: TClientData
    ) {
        const req_organization_id = this.validateOrganization(request)
        
        return await this.clientService.addClient(
            req_organization_id,
            {
                ...clientData,
                client_account_status   : EAccountStatus.UNVERIFIED,
                client_registration_date: Date.now(),
            }
        );
    }
    
    
    @Patch('/name/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientData))
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
        const req_organization_id = this.validateOrganization(request)
        return await this.clientService.updateClientName(
            req_organization_id,
            client_id,
            client_name,
        );
    }
    
    
    @Patch('/nic/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientData))
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
        const req_organization_id = this.validateOrganization(request)
        return await this.clientService.updateClientNicNumber(
            req_organization_id,
            client_id,
            clientData.client_nic_number,
        );
    }
    
    
    @Patch('/phone/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientData))
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
        
        const req_organization_id = this.validateOrganization(request)
        return await this.clientService.updateClientPhone(
            req_organization_id,
            client_id,
            clientData.client_phone,
        );
    }
    
    
    @Patch('/status/active/:client_id')
    async updateClientStatusToActive(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ) {
        
        const req_organization_id = this.validateOrganization(request)
        return await this.clientService.updateClientAccountStatusToActive(
            req_organization_id,
            client_id,
        );
    }
    
    
    @Patch('/status/deactivated/:client_id')
    async updateClientStatusToDeactivated(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ) {
        const req_organization_id = this.validateOrganization(request)
        return await this.clientService.updateClientAccountStatusToDeactivated(
            req_organization_id,
            client_id,
        );
    }
    
    
    @Patch('/status/unverified/:client_id')
    async updateClientStatusToUnverified(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
    ) {
        const req_organization_id = this.validateOrganization(request)
        return await this.clientService.updateClientAccountStatusToUnverified(
            req_organization_id,
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
        const req_organization_id = this.validateOrganization(request)
        return await this.clientService.viewClientProfile(
            req_organization_id,
            client_id,
        );
    }
    
    
    @Get('/view/organization')
    async getClientsByOrganizationId( // EDITED: Removed unnecessary param decorator
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        
        const req_organization_id = this.validateOrganization(request)
        
        return await this.clientService.getClientsByOrganizationId(req_organization_id);
    }
}
