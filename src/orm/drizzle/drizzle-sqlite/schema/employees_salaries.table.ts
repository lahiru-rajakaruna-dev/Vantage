import { relations }     from 'drizzle-orm'
import {
    foreignKey,
    index,
    integer,
    primaryKey,
    real,
    sqliteTable,
    text
}                        from 'drizzle-orm/sqlite-core'
import { employees }     from './employees.table'
import { organizations } from './organizations.table';



export const employeesSalaryProfiles = sqliteTable(
    'employees_salaries',
    {
        employee_salary_profile_id                   : text()
            .notNull(),
        employee_salary_profile_organization_id      : text()
            .notNull(),
        employee_salary_profile_employee_id          : text()
            .notNull(),
        employee_salary_profile_base                 : real()
            .notNull(),
        employee_salary_profile_commission_percentage: integer()
            .notNull()
            .default(0),
    },
    (table) => ({
        pk                 : primaryKey({
                                            name   : 'employees_salaries_pk',
                                            columns: [
                                                table.employee_salary_profile_id,
                                                table.employee_salary_profile_organization_id,
                                                table.employee_salary_profile_employee_id
                                            ],
                                        }),
        employeeFk         : foreignKey({
                                            name          : 'employees_salaries_employee_fk',
                                            columns       : [
                                                table.employee_salary_profile_employee_id,
                                                table.employee_salary_profile_organization_id
                                            ],
                                            foreignColumns: [
                                                employees.employee_id,
                                                employees.employee_organization_id
                                            ],
                                        }),
        organizationFk     : foreignKey({
                                            name          : 'employees_salaries_organization_fk',
                                            columns       : [ table.employee_salary_profile_organization_id ],
                                            foreignColumns: [ organizations.organization_id ],
                                        }),
        salaryIdIndex      : index('employee_salary_id_idx')
            .on(table.employee_salary_profile_id),
        organizationIdIndex: index('employee_salary_organization_id_fk_idx')
            .on(table.employee_salary_profile_organization_id),
        employeeIdIndex    : index('employee_salary_employee_id_fk_idx')
            .on(table.employee_salary_profile_employee_id),
    }),
);

export const employeesSalaryProfileRelations = relations(
    employeesSalaryProfiles,
    ({ one }) => ({
        employee    : one(
            employees,
            {
                fields    : [
                    employeesSalaryProfiles.employee_salary_profile_employee_id,
                    employeesSalaryProfiles.employee_salary_profile_organization_id
                ],
                references: [
                    employees.employee_id,
                    employees.employee_organization_id
                ],
            }
        ),
        organization: one(
            organizations,
            {
                fields    : [ employeesSalaryProfiles.employee_salary_profile_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
    })
);
