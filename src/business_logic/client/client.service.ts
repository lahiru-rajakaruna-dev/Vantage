import { Inject, Injectable } from '@nestjs/common';
import type IOrmInterface from '../../orm/orm.interface';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import { TClient } from '../../orm/drizzle/drizzle-postgres/drizzle-postgres.schema';
import { EAccountStatus } from '../../types';

@Injectable()
export class ClientService {
  private readonly orm: IOrmInterface;

  constructor(@Inject(TOKEN__ORM_FACTORY) orm: IOrmInterface) {
    this.orm = orm;
  }

  //   ADD CLIENT
  async addClient(clientDetails: TClient): Promise<TClient> {
    return this.orm.addClient(clientDetails);
  }

  //   UPDATE CLIENT NAME
  async updateClientName(client_id: string, client_name: string) {
    return this.orm.updateClientById(client_id, { client_name: client_name });
  }

  //   UPDATE CLIENT NIC NUMBER
  async updateClientNicNumber(client_id: string, client_nic_number: string) {
    return this.orm.updateClientById(client_id, {
      client_nic_number: client_nic_number,
    });
  }

  //   UPDATE CLIENT PHONE
  async updateClientPhone(client_id: string, client_phone: string) {
    return this.orm.updateClientById(client_id, {
      client_phone: client_phone,
    });
  }

  //   UPDATE CLIENT ACCOUNT STATUS DEACTIVATED
  async updateClientAccountStatusToDeactivated(client_id: string) {
    return this.orm.updateClientById(client_id, {
      client_account_status: EAccountStatus.DEACTIVATED,
    });
  }

  //   UPDATE CLIENT ACCOUNT STATUS TO ACTIVE
  async updateClientAccountStatusToActive(client_id: string) {
    return this.orm.updateClientById(client_id, {
      client_account_status: EAccountStatus.ACTIVE,
    });
  }

  // UPDATE CLIENT ACCOUNT STATUS TO UNVERIFIED
  async updateClientAccountStatusToUnverified(client_id: string) {
    return this.orm.updateClientById(client_id, {
      client_account_status: EAccountStatus.UNVERIFIED,
    });
  }

  //   VIEW CLIENT PROFILE
  async viewClientProfile(client_id: string) {
    return this.orm.getClientProfileById(client_id);
  }

  //   GET CLIENTS BY ORGANIZATION ID
  async getClientsByOrganizationId(organization_id: string) {
    return this.orm.getClientsByOrganizationId(organization_id);
  }
}
