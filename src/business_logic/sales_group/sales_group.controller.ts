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
} from '@nestjs/common';
import { SalesGroupService } from './sales_group.service';
import { v4 as uuid } from 'uuid';

@Controller('sales_group')
export class SalesGroupController {
  private salesGroupService: SalesGroupService;

  constructor(@Inject() salesGroupService: SalesGroupService) {
    this.salesGroupService = salesGroupService;
  }

  @Post('/add')
  addSalesGroup(
    @Headers('organization_id') organization_id: string,
    @Body('sales_group_name') sales_group_name: string,
  ) {
    if (!organization_id) {
      throw new BadRequestException('[-] Invalid request...');
    }

    return this.salesGroupService.addSalesGroup({
      sales_group_id: uuid().toString(),
      sales_group_organization_id: organization_id,
      sales_group_name: sales_group_name,
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

  @Patch('/update/name/:sales_group_id')
  updateSalesGroupName(
    @Param('sales_group_id') sales_group_id: string,
    @Body('sales_group_name') sales_group_name: string,
  ) {
    return this.salesGroupService.updateSalesGroupNameById(
      sales_group_id,
      sales_group_name,
    );
  }

  @Delete('/delete/:sales_group_id')
  removeSalesGroup(@Param('sales_group_id') sales_group_id: string) {
    return this.salesGroupService.deleteSalesGroupById(sales_group_id);
  }
}
