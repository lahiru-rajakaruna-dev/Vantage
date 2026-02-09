import { relations }            from 'drizzle-orm';
import {
    foreignKey,
    index,
    integer,
    primaryKey,
    sqliteTable,
    text
}                               from 'drizzle-orm/sqlite-core';
import { EmployeeStatus }       from './common';
import { employeesActivities }  from './employees_activities.table';
import { employeesAttendances } from './employees_attendances.table';
import { employeesCredentials } from './employees_credentials.table';
import { employeesSalaries }    from './employees_salaries.table';
import { organizations }        from './organizations.table';
import { sales }                from './sales.table';
import { salesGroups }          from './sales_groups.table';



export const employees = sqliteTable(
    'employees',
    {
        employee_id                 : text()
            .notNull(),
        employee_organization_id    : text()
            .notNull(),
        employee_sales_group_id     : text(),
        employee_profile_picture_url: text(),
        employee_first_name         : text(),
        employee_last_name          : text(),
        employee_phone              : text(),
        employee_nic_number         : text()
            .notNull()
            .unique(),
        employee_active_territory   : text(),
        employee_registration_date  : integer()
            .notNull(),
        employee_status             : text({ enum: EmployeeStatus })
            .default('NOT_REPORTED')
            .notNull(),
    },
    (table) => ({
        pk                 : primaryKey({
                                            name   : 'employee_primary_key',
                                            columns: [
                                                table.employee_id,
                                                table.employee_organization_id
                                            ],
                                        }),
        organizationFk     : foreignKey({
                                            name          : 'employees_organization_fk',
                                            columns       : [ table.employee_organization_id ],
                                            foreignColumns: [ organizations.organization_id ],
                                        }),
        salesGroupFk       : foreignKey({
                                            name          : 'employees_sales_group_fk',
                                            columns       : [ table.employee_sales_group_id ],
                                            foreignColumns: [ salesGroups.sales_group_id ],
                                        })
            .onDelete('set null'),
        employeeIdIndex    : index('employee_id_idx')
            .on(table.employee_id),
        organizationIdIndex: index('employee_organization_id_fk_idx')
            .on(table.employee_organization_id),
        salesGroupIdIndex  : index('employee_sales_group_id_fk_idx')
            .on(table.employee_sales_group_id),
        nicIndex           : index('employee_nic_idx')
            .on(table.employee_nic_number),
    }),
);

export const employeesRelations = relations(
    employees,
    ({
         one,
         many
     }) => ({
        organization: one(
            organizations,
            {
                fields    : [ employees.employee_organization_id ],
                references: [ organizations.organization_id ],
            }
        ),
        credentials : one(
            employeesCredentials,
            {
                fields    : [
                    employees.employee_id,
                    employees.employee_organization_id
                ],
                references: [
                    employeesCredentials.employee_credential_employee_id,
                    employeesCredentials.employee_credential_organization_id
                ],
            }
        ),
        attendance  : one(
            employeesAttendances,
            {
                fields    : [
                    employees.employee_id,
                    employees.employee_organization_id
                ],
                references: [
                    employeesAttendances.employee_attendance_employee_id,
                    employeesAttendances.employee_attendance_organization_id
                ],
            }
        ),
        salary      : one(
            employeesSalaries,
            {
                fields    : [
                    employees.employee_id,
                    employees.employee_organization_id
                ],
                references: [
                    employeesSalaries.employee_salary_employee_id,
                    employeesSalaries.employee_salary_organization_id
                ],
            }
        ),
        salesGroup  : one(
            salesGroups,
            {
                fields    : [
                    employees.employee_sales_group_id,
                    employees.employee_organization_id
                ],
                references: [
                    salesGroups.sales_group_id,
                    salesGroups.sales_group_organization_id
                ],
            }
        ),
        sales       : many(sales),
        activities  : many(employeesActivities),
    })
);
