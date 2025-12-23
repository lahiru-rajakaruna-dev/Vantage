import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
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
    @Headers('organization_id') organization_id: string,
    @Body('client_name') client_name: string,
    @Body('client_nic_number') client_nic_number: string,
    @Body('client_phone') client_phone: string,
    @Body('client_email') client_email: string,
    @Body('client_stripe_customer_id') client_stripe_customer_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.clientService.addClient({
      client_id: uuid().toString(),
      client_organization_id: organization_id,
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
    @Headers('organization_id') organization_id: string,
    @Param('client_id') client_id: string,
    @Body('client_name') client_name: string,
  ) {
    return await this.clientService.updateClientName(
      organization_id,
      client_id,
      client_name,
    );
  }

  @Patch('/update/nic/:client_id')
  async updateClientNic(
    @Param('client_id') client_id: string,
    @Body('client_nic_number') client_nic_number: string,
  ) {
    return await this.clientService.updateClientNicNumber(
      '',
      client_id,
      client_nic_number,
    );
  }

  @Patch('/update/phone/:client_id')
  async updateClientPhone(
    @Headers('organization_id') organization_id: string,
    @Param('client_id') client_id: string,
    @Body('client_phone') client_phone: string,
  ) {
    return await this.clientService.updateClientPhone(
      organization_id,
      client_id,
      client_phone,
    );
  }

  @Patch('/update/status/active/:client_id')
  async updateClientStatusToActive(
    @Headers('organization_id') organization_id: string,
    @Param('client_id') client_id: string,
  ) {
    return await this.clientService.updateClientAccountStatusToActive(
      organization_id,
      client_id,
    );
  }

  @Patch('/update/status/deactivated/:client_id')
  async updateClientStatusToDeactivated(
    @Headers('organization_id') organization_id: string,
    @Param('client_id') client_id: string,
  ) {
    return await this.clientService.updateClientAccountStatusToDeactivated(
      organization_id,
      client_id,
    );
  }

  @Patch('/update/status/unverified/:client_id')
  async updateClientStatusToUnverified(
    @Headers('organization_id') organization_id: string,
    @Param('client_id') client_id: string,
  ) {
    return await this.clientService.updateClientAccountStatusToUnverified(
      organization_id,
      client_id,
    );
  }

  @Get('/profile/:client_id')
  async getClientProfile(
    @Headers('organization_id') organization_id: string,
    @Param('client_id') client_id: string,
  ) {
    return await this.clientService.viewClientProfile(
      organization_id,
      client_id,
    );
  }

  @Get('/view/organization/:organization_id')
  async getClientsByOrganizationId(
    @Param('organization_id') organization_id: string,
  ) {
    return await this.clientService.getClientsByOrganizationId(organization_id);
  }
}
