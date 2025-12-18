import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { v4 as uuid } from 'uuid';
import { EAccountStatus } from '../../types';

@Controller('client')
export class ClientController {
  private readonly clientService: ClientService;

  constructor(@Inject() clientService: ClientService) {
    this.clientService = clientService;
  }

  @Post()
  async addClient(
    @Req() request: Request,
    @Body('client_name') client_name: string,
    @Body('client_nic_number') client_nic_number: string,
    @Body('client_phone') client_phone: string,
    @Body('client_email') client_email: string,
    @Body('client_stripe_customer_id') client_stripe_customer_id: string,
  ) {
    return await this.clientService.addClient({
      client_id: uuid().toString(),
      client_organization_id: request.headers['organization_id'],
      client_name: client_name,
      client_nic_number: client_nic_number,
      client_phone: client_phone,
      client_email: client_email,
      client_stripe_customer_id: client_stripe_customer_id,
      client_account_status: EAccountStatus.UNVERIFIED,
      client_registration_date: Date.now(),
    });
  }

  @Patch('/update/name/:client_id')
  async updateClientName(
    @Param('client_id') client_id: string,
    @Body('client_name') client_name: string,
  ) {
    return await this.clientService.updateClientName(client_id, client_name);
  }

  @Patch('/update/nic/:client_id')
  async updateClientNic(
    @Param('client_id') client_id: string,
    @Body('client_nic_number') client_nic_number: string,
  ) {
    return await this.clientService.updateClientNicNumber(
      client_id,
      client_nic_number,
    );
  }

  @Patch('/update/phone/:client_id')
  async updateClientPhone(
    @Param('client_id') client_id: string,
    @Body('client_phone') client_phone: string,
  ) {
    return await this.clientService.updateClientPhone(client_id, client_phone);
  }

  @Patch('/update/status/active/:client_id')
  async updateClientStatusToActive(@Param('client_id') client_id: string) {
    return await this.clientService.updateClientAccountStatusToActive(
      client_id,
    );
  }

  @Patch('/update/status/deactivated/:client_id')
  async updateClientStatusToDeactivated(@Param('client_id') client_id: string) {
    return await this.clientService.updateClientAccountStatusToDeactivated(
      client_id,
    );
  }

  @Patch('/update/status/unverified/:client_id')
  async updateClientStatusToUnverified(@Param('client_id') client_id: string) {
    return await this.clientService.updateClientAccountStatusToUnverified(
      client_id,
    );
  }

  @Get('/profile/:client_id')
  async getClientProfile(@Param('client_id') client_id: string) {
    return await this.clientService.viewClientProfile(client_id);
  }

  @Get('/view/organization/:organization_id')
  async getClientsByOrganizationId(
    @Param('organization_id') organization_id: string,
  ) {
    return await this.clientService.getClientsByOrganizationId(organization_id);
  }
}
