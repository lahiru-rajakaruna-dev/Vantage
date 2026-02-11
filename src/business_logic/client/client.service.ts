import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import { v4 as uuid }         from 'uuid'
import {
    TClientData,
    TClientSelect,
    TClientUpdate
}                             from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';



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
    async updateClient(
        organization_id: string,
        client_id: string,
        clientUpdates: TClientUpdate,
    ): Promise<TClientSelect[]> {
        return this.orm.updateClientById(
            organization_id,
            client_id,
            clientUpdates,
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
