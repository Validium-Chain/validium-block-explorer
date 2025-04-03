import { Module } from "@nestjs/common";
import { StatsController } from "./stats.controller";
import { BatchModule } from "../batch/batch.module";
import { BlockModule } from "../block/block.module";
import { TransactionModule } from "../transaction/transaction.module";
import { BalanceModule } from "../balance/balance.module";

@Module({
  imports: [BatchModule, BlockModule, TransactionModule, BalanceModule],
  controllers: [StatsController],
})
export class StatsModule {}
