import { relations }     from 'drizzle-orm';
import {
    decimal,
    foreignKey,
    index,
    integer,
    pgTable,
    primaryKey,
    text
}                        from 'drizzle-orm/pg-core';
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema
}                        from 'drizzle-zod';
import { z }             from 'zod';
import { employees }     from './employees.table';
import { organizations } from './organizations.table';



export const employeesSalaries = pgTable(
    'employees_salaries',
    {
        employee_salary_id                   : text()
            .unique()
            .notNull(),
        employee_salary_organization_id      : text()
            .notNull(),
        employee_salary_employee_id          : text()
            .notNull(),
        employee_salary_base                 : decimal(
            'employee_salary_base',
            { mode: 'number' }
        )
            .notNull(),
        employee_salary_commission_percentage: integer()
            .notNull()
            .default(0)
    },
    (table) => {
        return {
            pk                 : primaryKey({
                                                name   : 'employees_salaries_pk',
                                                columns: [
                                                    table.employee_salary_id,
                                                    table.employee_salary_organization_id,
                                                    table.employee_salary_employee_id
                                                ]
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
        }
    }
)

export const SchemaEmployeeSalaryInsert = createInsertSchema(employeesSalaries)
export const SchemaEmployeeSalaryData   = SchemaEmployeeSalaryInsert.omit({
                                                                              employee_salary_id             : true,
                                                                              employee_salary_organization_id: true,
                                                                              employee_salary_employee_id    : true
                                                                          })
export const SchemaEmployeeSalaryUpdate = createUpdateSchema(employeesSalaries)
    .omit({
              employee_salary_id             : true,
              employee_salary_organization_id: true,
              employee_salary_employee_id    : true
          });
export const SchemaEmployeeSalarySelect = createSelectSchema(employeesSalaries)

export type TEmployeeSalaryInsert = z.infer<typeof SchemaEmployeeSalaryInsert>
export type TEmployeeSalaryData = z.infer<typeof SchemaEmployeeSalaryData>
export type TEmployeeSalaryUpdate = z.infer<typeof SchemaEmployeeSalaryUpdate>
export type TEmployeeSalarySelect = z.infer<typeof SchemaEmployeeSalarySelect>

export const employeesSalariesRelations = relations(
    employeesSalaries,
    ({ one }) => {
        return {
            organization: one(
                organizations,
                {
                    fields    : [ employeesSalaries.employee_salary_organization_id ],
                    references: [ organizations.organization_id ]
                }
            ),
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
                    ]
                }
            )
        }
    }
)

