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
    SchemaClientUpdate,
    type TClientData,
    type TClientUpdate,
    type   TOrganizationSelect,
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import ZodSchemaValidationPipe   from '../../pipes/schema_validation.pipe';
import { EAccountStatus }        from '../../types';
import { BaseController }        from '../abstract.base.controller';
import { ClientService }         from './client.service';



@Controller('clients')
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
    
    
    @Get('/organization')
    async getClientsByOrganizationId( // EDITED: Removed unnecessary param decorator
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },) {
        
        const req_organization_id = this.validateOrganization(request)
        
        return await this.clientService.getClientsByOrganizationId(req_organization_id);
    }
    
    
    @Get('/:client_id')
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
    
    
    @Patch('/:client_id')
    @UsePipes(new ZodSchemaValidationPipe(SchemaClientUpdate))
    async updateClientName(
        @Req()
        request: Request & {
            organization: TOrganizationSelect
        },
        @Param('client_id')
        client_id: string,
        @Body()
        clientUpdates: TClientUpdate,
    ) {
        const req_organization_id = this.validateOrganization(request)
        
        return await this.clientService.updateClient(
            req_organization_id,
            client_id,
            clientUpdates
        );
        
    }
    
}
