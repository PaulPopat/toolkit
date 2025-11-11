import { IsRecord, IsString, IsType } from "@toolkit/safe-type";

export const ThemeSpec = IsRecord(IsString, IsString);

export type ThemeSpec = IsType<typeof ThemeSpec>;
