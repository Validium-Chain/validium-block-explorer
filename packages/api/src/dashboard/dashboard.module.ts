import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { TokenModule } from "../token/token.module";
import { BalanceModule } from "src/balance/balance.module";
import { TransactionModule } from "../transaction/transaction.module";

@Module({
  imports: [BalanceModule, TokenModule, TransactionModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
