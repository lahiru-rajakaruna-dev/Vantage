import {
    Inject,
    Injectable,
    InternalServerErrorException
}                                from '@nestjs/common';
import { Customer }              from '@paddle/paddle-node-sdk';
import {
    EOrganizationStatus,
    ESubscriptionStatus
}                                from 'src/types';
import { v4 as uuid }            from 'uuid'
import type ILoggerService       from '../../logger/logger.interface';
import { TOKEN__LOGGER_FACTORY } from '../../logger/logger_factory/logger_factory.service';
import {
    TOrganizationData,
    TOrganizationSelect,
    TOrganizationUpdate
}                                from '../../orm/drizzle/drizzle-postgres/schema';
import { TOKEN__ORM_FACTORY }    from '../../orm/orm-factory/orm-factory.service';
import type IOrmInterface        from '../../orm/orm.interface';
import { PaddleService }         from '../../paddle/paddle.service';



@Injectable()
export class OrganizationService {
    private readonly orm: IOrmInterface;
    private readonly paddleService: PaddleService
    private readonly logger: ILoggerService
    
    
    constructor(
        @Inject(TOKEN__ORM_FACTORY)
        orm: IOrmInterface,
        paddleService: PaddleService,
        @Inject(TOKEN__LOGGER_FACTORY)
        logger: ILoggerService,
    ) {
        this.orm           = orm;
        this.paddleService = paddleService
        this.logger        = logger
    }
    
    
    async addOrganization(
        admin_id: string,
        organizationData: Omit<TOrganizationData, 'organization_paddle_customer_id' | 'organization_subscription_status' | 'organization_status' | 'organization_stripe_customer_id'>,
    ): Promise<TOrganizationSelect> {
        let paddleCustomerAccount: Customer;
        
        try {
            paddleCustomerAccount = await this.paddleService.addCustomerAccount(
                organizationData.organization_name,
                organizationData.organization_admin_email,
            );
        } catch (e) {
            this.logger.log(e);
            throw new InternalServerErrorException((e as Error).message);
        }
        
        this.logger.log('[+] Add organization payment account to the platform');
        
        const organization_id = uuid()
            .toString()
        return await this.orm.addOrganization(
            organization_id,
            admin_id,
            paddleCustomerAccount.id,
            organizationData,
        );
    }
    
    
    async getOrganizationDetails(organization_id: string,): Promise<TOrganizationSelect> {
        return await this.orm.getOrganizationDetailsById(organization_id);
    }
    
    
    async getOrganizationDetailsByAdmin(admin_id: string,): Promise<TOrganizationSelect> {
        return await this.orm.getOrganizationDetailsByAdminId(admin_id);
    }
    
    
    async updateOrganization(
        organization_id: string,
        organization_updates: Omit<TOrganizationUpdate, 'organization_subscription_end_date' | 'organization_status' | 'organization_subscription_status'>,
    ): Promise<TOrganizationSelect> {
        return await this.orm.updateOrganizationById(
            organization_id,
            organization_updates
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
