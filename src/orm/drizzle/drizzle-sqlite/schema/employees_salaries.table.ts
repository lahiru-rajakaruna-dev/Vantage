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



export const employeesSalaries = sqliteTable(
    'employees_salaries',
    {
        employee_salary_id                   : text()
            .notNull(),
        employee_salary_organization_id      : text()
            .notNull(),
        employee_salary_employee_id          : text()
            .notNull(),
        employee_salary_base                 : real()
            .notNull(),
        employee_salary_commission_percentage: integer()
            .notNull()
            .default(0),
    },
    (table) => ({
        pk                 : primaryKey({
                                            name   : 'employees_salaries_pk',
                                            columns: [
                                                table.employee_salary_id,
                                                table.employee_salary_organization_id,
                                                table.employee_salary_employee_id
                                            ],
                                        }),
        employeeFk         : foreignKey({
                                            name          : 'employees_salaries_employee_fk',
                                            columns       : [
                                                table.employee_salary_employee_id,
                                                table.employee_salary_organization_id
                                            ],
                                            foreignColumns: [
                                                employees.employee_id,
                                                employees.employee_organization_id
                                            ],
                                        }),
        organizationFk     : foreignKey({
                                            name          : 'employees_salaries_organization_fk',
                                            columns       : [ table.employee_salary_organization_id ],
                                            foreignColumns: [ organizations.organization_id ],
                                        }),
        salaryIdIndex      : index('employee_salary_id_idx')
            .on(table.employee_salary_id),
        organizationIdIndex: index('employee_salary_organization_id_fk_idx')
            .on(table.employee_salary_organization_id),
        employeeIdIndex    : index('employee_salary_employee_id_fk_idx')
            .on(table.employee_salary_employee_id),
    }),
);

export const employeesSalariesRelations = relations(
    employeesSalaries,
    ({ one }) => ({
        employee    : one(
            employees,
            {
                fields    : [
                    employeesSalaries.employee_salary_employee_id,
                    employeesSalaries.employee_salary_organization_id
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
                fields    : [ employeesSalaries.employee_salary_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
    })
);
