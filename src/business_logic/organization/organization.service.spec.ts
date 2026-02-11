import {
    Test,
    TestingModule
}                              from '@nestjs/testing';
import { OrmModule }           from '../../orm/orm.module';
import {
    EOrganizationStatus,
    ESubscriptionStatus
}                              from '../../types';
import { OrganizationService } from './organization.service';



describe(
    'OrganizationService',
    () => {
        let service: OrganizationService;
        
        const requestOrganizationData = {
            organization_id                   : 'org_0001',
            organization_name                 : 'Test organization',
            organization_paddle_customer_id   : 'stripe__test_organization_id',
            organization_registration_date    : Date.now(),
            organization_subscription_status  : ESubscriptionStatus.VALID,
            organization_status               : EOrganizationStatus.ACTIVE,
            organization_subscription_end_date: Date.now() + 60 * 60 * 24 * 28,
        };
        
        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                                                                             providers: [ OrganizationService ],
                                                                             imports  : [ OrmModule ],
                                                                         })
                                                    .compile();
            
            service = module.get<OrganizationService>(OrganizationService);
        });
        
        it(
            'should be defined',
            () => {
                expect(service)
                    .toBeDefined();
            }
        );
        
        describe(
            'Testing functionality',
            () => {
                it(
                    'should add organization to the database',
                    async () => {
                        const result = await service.addOrganization(requestOrganizationData);
                        
                        expect(result)
                            .toBe('organization_id');
                    }
                );
                
                it(
                    'should get organization data from the database',
                    async () => {
                        const result = await service.getOrganizationDetails(requestOrganizationData.organization_id,);
                        
                        expect(result)
                            .toMatchInlineSnapshot();
                    }
                );
                
                it(
                    'should update organization name',
                    async () => {
                        const result = await service.updateOrganization(
                            requestOrganizationData.organization_id,
                            'new_organization_name',
                        );
                        
                        expect(result)
                            .toHaveProperty(
                                'organization_name',
                                'new_organization_name',
                            );
                    }
                );
                
                it(
                    'should update organization status',
                    async () => {
                        const result = await service.deactivateOrganizationById(requestOrganizationData.organization_id,);
                        
                        expect(result)
                            .toHaveProperty(
                                'organization_status',
                                EOrganizationStatus.DEACTIVATED,
                            );
                    }
                );
                
                it(
                    'should update organization subscription status',
                    async () => {
                        const result = await service.setOrganizationSubscriptionStatusToExpiredById(requestOrganizationData.organization_id,);
                        
                        expect(result)
                            .toHaveProperty(
                                'organization_subscription_status',
                                ESubscriptionStatus.EXPIRED,
                            );
                    }
                );
                
                it(
                    'should update organization subscription end date',
                    async () => {
                        const result = await service.setOrganizationSubscriptionEndDateBy30ById(requestOrganizationData.organization_id,);
                        
                        expect(result)
                            .toHaveProperty(
                                'organization_subscription_end_date',
                                Date.now() + 60 * 60 * 24 * 60,
                            );
                    }
                );
            }
        );
    }
);
