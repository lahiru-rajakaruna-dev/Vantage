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
  UsePipes,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { type TSalesGroup } from '../../orm/orm.interface';
import ZodSchemaValidationPipe from '../../pipes/schema_validation.pipe';
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
      }),
    ),
  )
  addSalesGroup(
    @Headers('organization_id') organization_id: string,
    @Body() salesGroupData: TSalesGroup,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.salesGroupService.addSalesGroup({
      sales_group_id: uuid().toString(),
      sales_group_organization_id: organization_id,
      sales_group_name: salesGroupData.sales_group_name,
    });
  }

  @Get('/view')
  getSalesGroups(@Headers('organization_id') organization_id: string) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.salesGroupService.getSalesGroupsByOrganizationId(
      organization_id,
    );
  }

  @Get('/view/:sales_group_id')
  getSalesGroupDetails(
    @Headers('organization_id') organization_id: string,
    @Param('sales_group_id') sales_group_id: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.salesGroupService.getSalesGroupDetailsById(
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
  updateSalesGroupName(
    @Headers('organization_id') organization_id: string,
    @Param('sales_group_id') sales_group_id: string,
    @Body() salesGroupData: TSalesGroup,
  ) {
    return this.salesGroupService.updateSalesGroupNameById(
      organization_id,
      sales_group_id,
      salesGroupData.sales_group_name,
    );
  }

  @Delete('/delete/:sales_group_id')
  removeSalesGroup(
    @Headers('organization_id') organization_id: string,
    @Param('sales_group_id') sales_group_id: string,
  ) {
    return this.salesGroupService.deleteSalesGroupById(
      organization_id,
      sales_group_id,
    );
  }
}
