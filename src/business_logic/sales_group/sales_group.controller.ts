import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { SalesGroupService } from './sales_group.service';
import { v4 as uuid } from 'uuid';

@Controller('sales-group')
export class SalesGroupController {
  private salesGroupService: SalesGroupService;

  constructor(@Inject() salesGroupService: SalesGroupService) {
    this.salesGroupService = salesGroupService;
  }

  @Post('/add')
  addSalesGroup(
    @Req() request: Request,
    @Body('sales_group_name') sales_group_name: string,
  ) {
    return this.salesGroupService.addSalesGroup({
      sales_group_id: uuid().toString(),
      sales_group_organization_id: request.headers['organization_id'],
      sales_group_name: sales_group_name,
    });
  }

  @Get('/view')
  getSalesGroups(@Req() request: Request) {
    return this.salesGroupService.getSalesGroupsByOrganizationId(
      request.headers['organization_id'],
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
