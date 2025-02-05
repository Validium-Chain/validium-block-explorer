import { ApiProperty } from "@nestjs/swagger";


export class DashboardDto {
    @ApiProperty({ type: Number, description: "Total number of accounts", example: 1000 })
    public readonly totalAccounts: number;

    @ApiProperty({ type: Number, description: "Total number of transactions", example: 5000 })
    public readonly totalTransaction: number;

    @ApiProperty({ type: Number, description: "Average gas fee", example: 0.01 })
    public readonly avgGasFee: number;

    @ApiProperty({ type: Number, description: "Total number of tokens", example: 300 })
    public readonly totalTokens: number;
}