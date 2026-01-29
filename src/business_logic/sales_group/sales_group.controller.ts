import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { type TSalesGroup } from '../../orm/orm.interface';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
import type { TOrganization } from '../../schemas';
import { SalesGroupService } from './sales_group.service';

@Controller('sales_group')
export class SalesGroupController {
  private salesGroupService: SalesGroupService;

  constructor(@Inject() salesGroupService: SalesGroupService) {
    this.salesGroupService = salesGroupService;
  }

  @Post('/add')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({
        sales_group_name: z.string().nonempty().nonoptional(),
        sales_group_territory: z.string().nonempty().nonoptional(),
      }),
    ),
  )
  async addSalesGroup(
    @Req() req: { organization: TOrganization } & Request,
    @Body() salesGroupData: TSalesGroup,
  ) {
    const organization = req.organization;

    if (!organization.organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return await this.salesGroupService.addSalesGroup({
      sales_group_id: uuid().toString(),
      sales_group_organization_id: organization.organization_id,
      sales_group_name: salesGroupData.sales_group_name,
      sales_group_territory: salesGroupData.sales_group_territory,
    });
  }

  @Get('/view')
  async getSalesGroups(
    @Req() request: Request & { organization: TOrganization },
  ) {
    const organization_id = request.organization.organization_id;
    if (!organization_id) {
      throw new BadRequestException('Organization not found');
    }

    return await this.salesGroupService.getSalesGroupsByOrganizationId(
      organization_id,
    );
  }

  @Get('/view/:sales_group_id')
  async getSalesGroupDetails(
    @Req() request: Request & { organization: TOrganization },
    @Param('sales_group_id') sales_group_id: string,
  ) {
    const organization_id = request.organization.organization_id;

    if (!organization_id) {
      throw new BadRequestException('Unauthorized request');
    }

    if (!sales_group_id || sales_group_id.length <= 0) {
      throw new BadRequestException('Invalid sales group id');
    }

    return await this.salesGroupService.getSalesGroupDetailsById(
      organization_id,
      sales_group_id,
    );
  }

  @Patch('/update/name/:sales_group_id')
  @UsePipes(
    new ZodSchemaValidationPipe(
      z.object({
        sales_group_name: z.string().nonempty().nonoptional(),
      }),
    ),
  )
  async updateSalesGroupName(
    @Headers('organization_id') organization_id: string,
    @Param('sales_group_id') sales_group_id: string,
    @Body() salesGroupData: TSalesGroup,
  ) {
    return await this.salesGroupService.updateSalesGroupNameById(
      organization_id,
      sales_group_id,
      salesGroupData.sales_group_name,
    );
  }

  @Delete('/delete/:sales_group_id')
  async removeSalesGroup(
    @Req() request: Request & { organization: TOrganization },
    @Param('sales_group_id') sales_group_id: string,
  ) {
    if (!request.organization) {
      throw new UnauthorizedException('Organization not found');
    }

    return await this.salesGroupService.deleteSalesGroupById(
      request.organization.organization_id,
      sales_group_id,
    );
  }
}
