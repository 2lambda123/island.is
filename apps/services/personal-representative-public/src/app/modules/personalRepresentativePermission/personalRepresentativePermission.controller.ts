import { AuthScope } from '@island.is/auth/scopes'
import {
  PersonalRepresentativeAccess,
  PersonalRepresentativeAccessDTO,
  PersonalRepresentativeAccessService,
  PersonalRepresentativeDTO,
  PersonalRepresentativeService,
} from '@island.is/auth-api-lib/personal-representative'
import {
  BadRequestException,
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Inject,
  Param,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger'
import { AuditService } from '@island.is/nest/audit'
import { environment } from '../../../environments/'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { PersonalRepresentativePublicDTO } from './dto/personalRepresentativePublicDTO.dto'

const namespace = `${environment.audit.defaultNamespace}/personal-representative-permission`

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AuthScope.readPersonalRepresentative)
@ApiTags('Personal Representative Permission')
@Controller('v1/personal-representative-permission')
@ApiBearerAuth()
export class PersonalRepresentativePermissionController {
  constructor(
    @Inject(PersonalRepresentativeService)
    private readonly prService: PersonalRepresentativeService,
    @Inject(PersonalRepresentativeAccessService)
    private readonly prAccessService: PersonalRepresentativeAccessService,
    private readonly auditService: AuditService,
  ) {}

  /** Gets a personal representative rights by nationalId of personal representative */
  @ApiOperation({
    summary:
      'Gets personal representative rights by nationalId of personal representative',
    description: 'A personal representative can represent more than one person',
  })
  @Get(':nationalId')
  @ApiOkResponse({
    description: 'Personal representative connections with rights',
    type: PersonalRepresentativePublicDTO,
  })
  @ApiParam({ name: 'nationalId', required: true, type: String })
  async getByPersonalRepresentativeAsync(
    @Param('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<PersonalRepresentativePublicDTO[]> {
    if (!nationalId) {
      throw new BadRequestException('NationalId needs to be provided')
    }

    const personalReps = await this.auditService.auditPromise(
      {
        user,
        action: 'getPersonalRepresentativePermissions',
        namespace,
        resources: nationalId,
      },
      this.prService.getByPersonalRepresentativeAsync(nationalId, false),
    )

    return personalReps.map((pr) =>
      new PersonalRepresentativePublicDTO().fromDTO(pr),
    )
  }

  /** Gets a personal representative rights by nationalId of personal representative */
  @ApiOperation({
    summary: 'Log access',
    description:
      'Logs the access of a personal representative on behalf of represented person',
  })
  @Post('log-access')
  @ApiOkResponse({
    description: 'Access log file',
    type: PersonalRepresentativeAccess,
  })
  async logAccessByPersonalRepresentativeAsync(
    @Body() personalRepresentativeAccess: PersonalRepresentativeAccessDTO,
    @CurrentUser() user: User,
  ): Promise<PersonalRepresentativeAccess | null> {
    if (!personalRepresentativeAccess) {
      throw new BadRequestException('access body needs to be provided')
    }

    return await this.auditService.auditPromise(
      {
        user,
        action: 'logPersonalRepresentativeAccess',
        namespace,
        resources:
          personalRepresentativeAccess.nationalIdPersonalRepresentative,
        meta: { fields: Object.keys(personalRepresentativeAccess) },
      },
      this.prAccessService.logAccessAsync(personalRepresentativeAccess),
    )
  }
}
