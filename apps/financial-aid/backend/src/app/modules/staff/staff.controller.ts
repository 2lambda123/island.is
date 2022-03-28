import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Put,
  Post,
  UseGuards,
} from '@nestjs/common'

import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { StaffService } from './staff.service'
import { StaffModel } from './models'
import {
  apiBasePath,
  RolesRule,
  StaffRole,
} from '@island.is/financial-aid/shared/lib'

import type { Staff } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'
import { RolesGuard } from '../../guards/roles.guard'
import { CurrentStaff, RolesRules } from '../../decorators'
import { StaffGuard } from '../../guards/staff.guard'
import { StaffRolesRules } from '../../decorators/staffRole.decorator'
import { UpdateStaffDto, CreateStaffDto } from './dto'

@UseGuards(IdsUserGuard, RolesGuard, StaffGuard)
@RolesRules(RolesRule.VEITA)
@Controller(`${apiBasePath}/staff`)
@ApiTags('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get('nationalId')
  @ApiOkResponse({
    type: StaffModel,
    description: 'Gets staff by nationalId',
  })
  async getStaffByNationalId(
    @CurrentStaff() staff: StaffModel,
  ): Promise<StaffModel> {
    if (!staff || staff.active === false) {
      throw new ForbiddenException('Staff not found or is not active')
    }
    return staff
  }

  @Get('id/:id')
  @ApiOkResponse({
    type: StaffModel,
    description: 'Gets staff by id',
  })
  async getStaffById(@Param('id') id: string): Promise<StaffModel> {
    const staff = await this.staffService.findById(id)
    if (staff === null) {
      throw new NotFoundException('Staff not found')
    }
    return staff
  }

  @StaffRolesRules(StaffRole.ADMIN)
  @Get('municipality')
  @ApiOkResponse({
    type: [StaffModel],
    description: 'Gets staff for municipality',
  })
  async getStaffForMunicipality(
    @CurrentStaff() staff: Staff,
  ): Promise<StaffModel[]> {
    return await this.staffService.findByMunicipalityId(staff.municipalityIds)
  }

  @Put('id/:id')
  @ApiOkResponse({
    type: StaffModel,
    description: 'Updates an existing staff',
  })
  async update(
    @Param('id') id: string,
    @Body() staffToUpdate: UpdateStaffDto,
  ): Promise<StaffModel> {
    const {
      numberOfAffectedRows,
      updatedStaff,
    } = await this.staffService.update(id, staffToUpdate)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Staff ${id} does not exist`)
    }

    return updatedStaff
  }

  @StaffRolesRules(StaffRole.ADMIN, StaffRole.SUPERADMIN)
  @Post('')
  @ApiOkResponse({
    type: StaffModel,
    description: 'Creates staff',
  })
  async createStaff(
    @CurrentStaff() staff: Staff,
    @Body() createStaffInput: CreateStaffDto,
  ): Promise<StaffModel> {
    //TODO
    return await this.staffService.createStaff(
      createStaffInput,
      {
        municipalityId:
          createStaffInput.municipalityId ?? staff.municipalityIds[0],
        municipalityName:
          createStaffInput.municipalityName ?? staff.municipalityName,
      },
      staff,
    )
  }

  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Get('municipality/:municipalityId')
  @ApiOkResponse({
    type: Number,
    description: 'Counts users for municipality',
  })
  async numberOfUsersForMunicipality(
    @Param('municipalityId') municipalityId: string,
  ): Promise<number> {
    return await this.staffService.numberOfUsersForMunicipality(municipalityId)
  }

  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Get('users/:municipalityId')
  @ApiOkResponse({
    type: [StaffModel],
    description: 'Gets admin users by municipality id',
  })
  async getUsers(
    @Param('municipalityId') municipalityId: string,
  ): Promise<StaffModel[]> {
    return this.staffService.getUsers(municipalityId)
  }

  @StaffRolesRules(StaffRole.SUPERADMIN)
  @Get('supervisors')
  @ApiOkResponse({
    type: [StaffModel],
    description: 'Gets supervisors',
  })
  async getSupervisors(): Promise<StaffModel[]> {
    return this.staffService.getSupervisors()
  }
}
