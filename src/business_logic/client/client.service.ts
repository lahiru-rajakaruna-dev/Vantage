import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import { v4 as uuid }         from 'uuid'
import {
    TClientData,
    TClientSelect
}                             from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';
import { EAccountStatus }     from '../../types';



@Injectable()
export class ClientService {
    private readonly orm: IOrmInterface;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    //   ADD CLIENT
    async addClient(
        organization_id: string,
        clientDetails: TClientData,
    ): Promise<TClientSelect[]> {
        const client_id = uuid()
            .toString()
        return this.orm.addClient(
            organization_id,
            client_id,
            {
                ...clientDetails,
            }
        );
    }
    
    
    //   UPDATE CLIENT NAME
    async updateClientName(
        organization_id: string,
        client_id: string,
        client_name: string,
    ): Promise<TClientSelect[]> {
        return this.orm.updateClientById(
            organization_id,
            client_id,
            {
                client_name: client_name,
            }
        );
    }
    
    
    async updateClientNicNumber(
        organization_id: string,
        client_id: string,
        client_nic_number: string,
    ): Promise<TClientSelect[]> {
        return this.orm.updateClientById(
            organization_id,
            client_id,
            {
                client_nic_number: client_nic_number,
            }
        );
    }
    
    
    async updateClientEmail(
        organization_id: string,
        client_id: string,
        client_email: string,
    ): Promise<TClientSelect[]> {
        return this.orm.updateClientById(
            organization_id,
            client_id,
            {
                client_email: client_email,
            }
        );
    }
    
    
    async updateClientPhone(
        organization_id: string,
        client_id: string,
        client_phone: string,
    ): Promise<TClientSelect[]> {
        return this.orm.updateClientById(
            organization_id,
            client_id,
            {
                client_phone: client_phone,
            }
        );
    }
    
    
    async updateClientAccountStatusToDeactivated(
        organization_id: string,
        client_id: string,
    ): Promise<TClientSelect[]> {
        return this.orm.updateClientById(
            organization_id,
            client_id,
            {
                client_account_status: EAccountStatus.DEACTIVATED,
            }
        );
    }
    
    
    async updateClientAccountStatusToActive(
        organization_id: string,
        client_id: string,
    ): Promise<TClientSelect[]> {
        return this.orm.updateClientById(
            organization_id,
            client_id,
            {
                client_account_status: EAccountStatus.ACTIVE,
            }
        );
    }
    
    
    async updateClientAccountStatusToUnverified(
        organization_id: string,
        client_id: string,
    ): Promise<TClientSelect[]> {
        return this.orm.updateClientById(
            organization_id,
            client_id,
            {
                client_account_status: EAccountStatus.UNVERIFIED,
            }
        );
    }
    
    
    async viewClientProfile(
        organization_id: string,
        client_id: string
    ): Promise<TClientSelect> {
        return this.orm.getClientProfileById(
            organization_id,
            client_id
        );
    }
    
    
    async getClientsByOrganizationId(organization_id: string): Promise<TClientSelect[]> {
        return this.orm.getClientsByOrganizationId(organization_id);
    }
}
