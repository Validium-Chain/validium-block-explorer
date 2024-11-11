import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOkResponse, ApiExcludeController } from "@nestjs/swagger";
import { DashboardDto } from "./dashboard.dto";
import { swagger } from "../config/featureFlags";
import { TokenService } from "src/token/token.service";
import { TransactionService } from "../transaction/transaction.service";
import { BalanceService } from "../balance/balance.service";

const entityName = "dashboard";

@ApiTags("Dashboard BFF")
@ApiExcludeController(!swagger.bffEnabled)
@Controller(entityName)
export class DashboardController {
    constructor(
        private readonly balanceService: BalanceService,
        private readonly tokenService: TokenService,
        private readonly transactionService: TransactionService
      ) {}    


    @Get()
    @ApiOkResponse({ description: "Dashboard", type: DashboardDto })
    public async dashboard(): Promise<DashboardDto> {
        const response = {
            totalAccounts: await this.balanceService.getBalanceCount(),
            totalTransaction: await this.transactionService.count(),
            avgGasFee: await this.transactionService.getAvgGasFeeLast24h(),
            totalTokens: await this.tokenService.getTokensCount()
        };
        return response;
    }
}