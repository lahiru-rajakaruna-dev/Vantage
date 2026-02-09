import {
    Inject,
    Injectable
}                             from '@nestjs/common';
import {
    EOrganizationStatus,
    ESubscriptionStatus
}                             from 'src/types';
import { v4 as uuid }         from 'uuid'
import {
    TOrganizationData,
    TOrganizationSelect
}                             from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY } from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface     from '../../orm/orm.interface';



@Injectable()
export class OrganizationService {
    private orm: IOrmInterface;
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface) {
        this.orm = orm;
    }
    
    
    async addOrganization(
        admin_id: string,
        paddle_id: string,
        organizationData: Omit<TOrganizationData, 'organization_subscription_status' | 'organization_status' | 'organization_stripe_customer_id'>,
    ): Promise<TOrganizationSelect> {
        // TODO ADD STRIPE
        const organization_id = uuid()
            .toString()
        return await this.orm.addOrganization(
            organization_id,
            admin_id,
            paddle_id,
            {
                ...organizationData,
                organization_stripe_customer_id: paddle_id,
            }
        );
    }
    
    
    async getOrganizationDetailsById(organization_id: string,): Promise<TOrganizationSelect> {
        return await this.orm.getOrganizationDetailsById(organization_id);
    }
    
    
    async getOrganizationDetailsAdminById(admin_id: string,): Promise<TOrganizationSelect> {
        return await this.orm.getOrganizationDetailsByAdminId(admin_id);
    }
    
    
    async updateOrganizationNameById(
        organization_id: string,
        organization_name: string,
    ): Promise<TOrganizationSelect> {
        return await this.orm.updateOrganizationById(
            organization_id,
            {
                organization_name: organization_name,
            }
        );
    }
    
    
    async deactivateOrganizationById(organization_id: string,): Promise<TOrganizationSelect> {
        return await this.orm.updateOrganizationById(
            organization_id,
            {
                organization_status: EOrganizationStatus.DEACTIVATED,
            }
        );
    }
    
    
    async activateOrganizationById(organization_id: string,): Promise<TOrganizationSelect> {
        return await this.orm.updateOrganizationById(
            organization_id,
            {
                organization_status: EOrganizationStatus.ACTIVE,
            }
        );
    }
    
    
    async setOrganizationSubscriptionStatusToExpiredById(organization_id: string,): Promise<TOrganizationSelect> {
        return await this.orm.updateOrganizationById(
            organization_id,
            {
                organization_subscription_status: ESubscriptionStatus.EXPIRED,
            }
        );
    }
    
    
    async setOrganizationSubscriptionStatusToValidById(organization_id: string,): Promise<TOrganizationSelect> {
        return await this.orm.updateOrganizationById(
            organization_id,
            {
                organization_subscription_status: ESubscriptionStatus.VALID,
            }
        );
    }
    
    
    async setOrganizationSubscriptionEndDateBy30ById(organization_id: string,): Promise<TOrganizationSelect> {
        const currentSubscriptionEndDate = (await this.orm.getOrganizationDetailsById(organization_id)).organization_subscription_end_date;
        
        return await this.orm.updateOrganizationById(
            organization_id,
            {
                organization_subscription_end_date: currentSubscriptionEndDate + 60 * 60 * 24 * 30,
            }
        );
    }
}
