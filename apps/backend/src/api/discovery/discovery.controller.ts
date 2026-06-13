import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DiscoveryService } from "./discovery.service";
import { TournamentListQueryDto } from "./dto/discovery-query.dto";
import {
  CitiesApiResponseDto,
  PublicFixtureSetListApiResponseDto,
  SportsApiResponseDto,
  TournamentDetailApiResponseDto,
  TournamentListApiResponseDto
} from "./dto/discovery-response.dto";

@ApiTags("discovery")
@Controller()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get("sports")
  @ApiOperation({ summary: "List active public sports" })
  @ApiOkResponse({ type: SportsApiResponseDto })
  findSports() {
    return this.discoveryService.findSports();
  }

  @Get("cities")
  @ApiOperation({ summary: "List active public cities" })
  @ApiOkResponse({ type: CitiesApiResponseDto })
  findCities() {
    return this.discoveryService.findCities();
  }

  @Get("tournaments")
  @ApiOperation({ summary: "List public published tournaments" })
  @ApiOkResponse({ type: TournamentListApiResponseDto })
  findTournaments(@Query() query: TournamentListQueryDto) {
    return this.discoveryService.findTournaments(query);
  }

  @Get("tournaments/:slugOrId")
  @ApiOperation({ summary: "Get a public tournament by slug or UUID" })
  @ApiOkResponse({ type: TournamentDetailApiResponseDto })
  findTournamentDetail(@Param("slugOrId") slugOrId: string) {
    return this.discoveryService.findTournamentDetail(slugOrId);
  }

  @Get("tournaments/:slugOrId/fixtures")
  @ApiOperation({ summary: "List public fixture sets and results for a published tournament" })
  @ApiOkResponse({ type: PublicFixtureSetListApiResponseDto })
  findTournamentFixtures(@Param("slugOrId") slugOrId: string) {
    return this.discoveryService.findTournamentFixtures(slugOrId);
  }
}
