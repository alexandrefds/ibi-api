import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
export class CreateProductDto {
  @IsString() @MinLength(2) @MaxLength(200) name!: string;
  @IsOptional() @IsString() description?: string;
  @IsInt() @Min(0) priceInCents!: number;
  @IsInt() @Min(0) stock!: number;
  @IsOptional() @IsString() category?: string;
}
